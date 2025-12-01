/* eslint-disable no-param-reassign */
// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  isConditionMet,
  processElement,
  createFormInfoResult,
} from './formResultsDefaultProcessor';
import type {
  QuestionGroup,
  QuestionSection,
  FormElement,
} from '../../types/medical/QuestionTypes';
import type { DataSources } from '../../hooks/useFormResultsData';

export const addSimpleScore = (
  score: number,
  max: number,
  id: string,
  titleOverride?: string
) => ({
  question: `${titleOverride || i18n.t('Score')}:`,
  answer: i18n.t('{{score}} of {{max}}', { score, max }),
  id,
  type: 'questionAndAnswer',
});

const performAggregation = (
  element: FormElement,
  answer: ?{ value: any },
  aggregation: Object,
  wordListLength: number
) => {
  const aggregationGroupKey = element.config.custom_params?.group;
  const answerValue = answer?.value || null;
  // eslint-disable-next-line default-case
  switch (aggregationGroupKey) {
    case 'symptom_severity_score': {
      aggregation.symptomsCount.score += answerValue ? 1 : 0;
      aggregation.symptomsCount.max += 1;
      aggregation.symptomsSeverity.score += answerValue || 0;

      const maxSeverityScore =
        typeof element.config.max === 'string'
          ? parseInt(element.config.max, 10)
          : element.config.max;
      aggregation.symptomsSeverity.max += maxSeverityScore || 0;

      break;
    }
    case 'orientation': {
      aggregation[aggregationGroupKey].score += answerValue ? 1 : 0;
      aggregation[aggregationGroupKey].max += 1;

      aggregation.sac.score += answerValue ? 1 : 0;
      aggregation.sac.max += 1;

      break;
    }
    case 'neurological': {
      aggregation[aggregationGroupKey].score += answerValue ? 1 : 0;
      aggregation[aggregationGroupKey].max += 1;
      break;
    }
    case 'immediate_memory':
    case 'delayed_recall': {
      const answersCount = answer?.value?.length || 0;

      aggregation[aggregationGroupKey].score += answersCount;
      aggregation[aggregationGroupKey].max += wordListLength;

      aggregation.sac.score += answersCount;
      aggregation.sac.max += wordListLength;
      break;
    }
    case 'concentration': {
      aggregation.concentration.max += 1;
      aggregation.concentration.score += answerValue ? 1 : 0;

      aggregation.sac.score += answerValue ? 1 : 0;
      aggregation.sac.max += 1;

      if (
        element.element_type === 'Forms::Elements::Customs::DigitsBackwards'
      ) {
        aggregation.digitsBackwards.score += answerValue ? 1 : 0;
        aggregation.digitsBackwards.max += 1;
      } else if (element.config.element_id === 'passed_months_in_reverse') {
        aggregation.monthsInReverse.score += answerValue ? 1 : 0;
        aggregation.monthsInReverse.max += 1;
      }

      break;
    }
  }
};

const processForm = (data: Object, dataSources: DataSources) => {
  const formattedFormResults = [];
  const attachments = [];

  // create answers dictionary
  const formAnswers = {};
  data.form_answers.forEach((item) => {
    formAnswers[item.form_element.config.element_id] = {
      value: item.value,
      items: item.form_element.config?.items || [],
      attachment: item.attachment,
      attachments: item.attachments,
    };
  });

  let wordListLength = 0;
  if (data.extra?.word_list_length != null) {
    wordListLength =
      typeof data.extra.word_list_length === 'string'
        ? parseInt(data.extra.word_list_length, 10)
        : data.extra.word_list_length;
  }

  // Prepare a group to hold aggregated symptom answers
  const symptomsGroup: QuestionGroup = {
    questionsAndAnswers: [],
    id: 1,
    isConditional: false,
    isGroupInData: true,
    columns: 3,
    title: i18n.t('Symptom scores'),
    type: 'table',
  };

  // Prepare a Section to show balance details
  const balanceSection: QuestionSection = {
    title: i18n.t('Balance examination'),
    elements: [],
    id: 0,
    elementId: 'balance_section',
    sidePanelSection: false,
  };

  // Prepare a Section to show SAC details
  const sacSection: QuestionSection = {
    title: i18n.t('Standardized Assessment of Concussion (SAC)'),
    elements: [],
    id: 1,
    elementId: 'sac_section',
    sidePanelSection: false,
  };

  // Prepare a group to hold aggregated balance answers
  const balanceGroup: QuestionGroup = {
    questionsAndAnswers: [],
    id: 0,
    isConditional: false,
    isGroupInData: true,
    columns: 4,
    title: undefined,
    type: 'group',
  };

  // create aggregation dictionary
  // When element encountered that has the same group as one of these keys the aggregation logic will increment values
  const aggregation = {
    // Standardized Assessment of Concussion (SAC)
    sac: { score: 0, max: 0 },

    // Symptoms
    symptomsCount: { score: 0, max: 0 },
    symptomsSeverity: { score: 0, max: 0 },

    orientation: { score: 0, max: 0 },
    neurological: { score: 0, max: 0 },
    immediate_memory: { score: 0, max: 0 },
    delayed_recall: { score: 0, max: 0 },

    // Balance
    balance: { score: 0, max: 0 },
    errors_double_leg_stance: { score: 0, max: 0 },
    errors_single_leg_stance: { score: 0, max: 0 },
    errors_tandem_stance: { score: 0, max: 0 },

    // Concentration
    digitsBackwards: { score: 0, max: 0 },
    monthsInReverse: { score: 0, max: 0 },
    concentration: { score: 0, max: 0 },
  };

  // We just assume all forms have sections as first level elements
  data.form_template_version.form_elements.forEach((section) => {
    if (!section.visible) {
      return;
    }

    const newSection: QuestionSection = {
      title: section.config.title,
      elements: [],
      id: section.id,
      elementId: section.config.element_id,
      sidePanelSection: false,
    };

    // Apply rending hint if present ( Add column layout to section )
    if (section.config?.custom_params?.columns != null) {
      newSection.columns = section.config?.custom_params?.columns;
    }

    // Apply rending hint if present (Show section in the side panel )
    if (section.config?.custom_params?.side_panel_section) {
      newSection.sidePanelSection =
        section.config?.custom_params?.side_panel_section;
    }

    section.form_elements.forEach((element: FormElement) => {
      if (!element.visible) {
        return;
      }

      // Check for aggregation
      if (element.config?.custom_params?.group) {
        performAggregation(
          element,
          formAnswers[element.config.element_id],
          aggregation,
          wordListLength
        );

        switch (element.config?.custom_params?.group) {
          case 'orientation':
          case 'neurological':
          case 'immediate_memory':
          case 'delayed_recall':
          case 'concentration': {
            // No need to process these known groups further
            return;
          }
          case 'symptom_severity_score': {
            // Symptom severity score group elements also need to appear in a table
            if (isConditionMet(element, formAnswers)) {
              // Process its form_elements
              processElement(
                element,
                newSection,
                symptomsGroup,
                formAnswers,
                dataSources,
                data.athlete,
                data.editor,
                attachments
              );
            }
            return;
          }
          default:
          // Allow fall through to create a group
        }
      }

      let newGroup: QuestionGroup;
      let addGroupToSection = true;
      switch (newSection.elementId) {
        case 'balance_test_setup': {
          newGroup = balanceGroup;
          addGroupToSection = false;
          break;
        }
        default: {
          newGroup = {
            questionsAndAnswers: [],
            id: element.id,
            isConditional: element.config?.condition != null,
            isGroupInData:
              element.element_type === 'Forms::Elements::Layouts::Group',
            type: 'group',
            columns: 1,
            title: undefined,
          };
          addGroupToSection = true;
          break;
        }
      }

      if (element.element_type === 'Forms::Elements::Layouts::Group') {
        if (element.config?.custom_params?.columns != null) {
          newGroup.columns = element.config?.custom_params?.columns;
        }
        if (element.config?.title != null) {
          newGroup.title = element.config?.title;
        }

        if (isConditionMet(element, formAnswers)) {
          // Process its form_elements
          element.form_elements?.forEach((groupElement) =>
            processElement(
              groupElement,
              newSection,
              newGroup,
              formAnswers,
              dataSources,
              data.athlete,
              data.editor,
              attachments
            )
          );
        }
      } else if (
        element.element_type === 'Forms::Elements::Layouts::List' &&
        element.form_elements &&
        element.form_elements.length > 0
      ) {
        if (isConditionMet(element, formAnswers)) {
          // Lists in this form contain elements for balance aggregation
          element.form_elements?.forEach((listElement) => {
            if (listElement.config?.custom_params?.group === 'balance') {
              const questionId = listElement.config.element_id;
              // eslint-disable-next-line default-case
              switch (questionId) {
                case 'errors_double_leg_stance':
                case 'errors_single_leg_stance':
                case 'errors_tandem_stance': {
                  let max = 10;
                  const answerValue = formAnswers[questionId]?.value;

                  if (listElement.config.max != null) {
                    max =
                      typeof listElement.config.max === 'string'
                        ? parseInt(listElement.config.max, 10)
                        : listElement.config.max;
                  }
                  aggregation[questionId].score += answerValue;
                  aggregation[questionId].max += max;
                  break;
                }
              }
            }
          });
        }
      } else {
        // Process single element
        processElement(
          element,
          newSection,
          newGroup,
          formAnswers,
          dataSources,
          data.athlete,
          data.editor,
          attachments
        );
      }

      if (addGroupToSection && newGroup.questionsAndAnswers.length > 0) {
        newSection.elements.push(newGroup);
      }
    });

    switch (newSection.elementId) {
      case 'symptom_evaluation': {
        newSection.title = i18n.t('Symptoms');
        newSection.columns = 2;

        const summaryQuestions = [
          addSimpleScore(
            aggregation.symptomsCount.score,
            aggregation.symptomsCount.max,
            'total_symptoms',
            i18n.t('Total number of symptoms')
          ),
          addSimpleScore(
            aggregation.symptomsSeverity.score,
            aggregation.symptomsSeverity.max,
            'symptom_severity',
            i18n.t('Symptom severity score')
          ),
        ];
        const summaryGroup: QuestionGroup = {
          questionsAndAnswers: summaryQuestions,
          id: 0,
          columns: 2,
          isConditional: false,
          isGroupInData: true,
          type: 'group',
        };
        newSection.elements.unshift(summaryGroup, symptomsGroup);
        formattedFormResults.push(newSection);

        break;
      }
      case 'orientation': {
        if (window.featureFlags['concussion-web-show-sac']) {
          formattedFormResults.push(sacSection);
        }

        const orientationQuestions = [
          addSimpleScore(
            aggregation.orientation.score,
            aggregation.orientation.max,
            'orientation_score'
          ),
        ];
        const orientationGroup: QuestionGroup = {
          questionsAndAnswers: orientationQuestions,
          id: 0,
          isConditional: false,
          isGroupInData: false,
          type: 'group',
        };
        newSection.elements.push(orientationGroup);
        formattedFormResults.push(newSection);
        break;
      }
      case 'immediate_memory_1':
      case 'immediate_memory_2': {
        // Skip these sections. immediate_memory_3 will be used to summarize
        break;
      }
      case 'immediate_memory_3': {
        const memoryQuestions = [
          addSimpleScore(
            aggregation.immediate_memory.score,
            aggregation.immediate_memory.max,
            'immediate_memory_score'
          ),
        ];
        const immediateMemoryGroup: QuestionGroup = {
          questionsAndAnswers: memoryQuestions,
          id: 0,
          isConditional: false,
          isGroupInData: false,
          type: 'group',
        };
        newSection.elements.push(immediateMemoryGroup);
        formattedFormResults.push(newSection);
        break;
      }
      case 'section_digits_backwards': {
        // Skip this section. months_in_reverse section will be used to summarize
        break;
      }
      case 'months_in_reverse': {
        newSection.title = i18n.t('Concentration');

        const concentrationQuestions = [
          addSimpleScore(
            aggregation.digitsBackwards.score,
            aggregation.digitsBackwards.max,
            'digit_score',
            i18n.t('Digit score')
          ),
          addSimpleScore(
            aggregation.monthsInReverse.score,
            aggregation.monthsInReverse.max,
            'month_score',
            i18n.t('Months score')
          ),
          addSimpleScore(
            aggregation.concentration.score,
            aggregation.concentration.max,
            'total_score',
            i18n.t('Total score')
          ),
        ];
        const concentrationGroup: QuestionGroup = {
          questionsAndAnswers: concentrationQuestions,
          id: 0,
          isConditional: false,
          isGroupInData: true,
          columns: 3,
          type: 'group',
        };
        newSection.elements.push(concentrationGroup);
        formattedFormResults.push(newSection);

        break;
      }
      case 'neurological_screening': {
        const orientationQuestions = [
          addSimpleScore(
            aggregation.neurological.score,
            aggregation.neurological.max,
            'neurological_score'
          ),
        ];
        const neurologicalGroup: QuestionGroup = {
          questionsAndAnswers: orientationQuestions,
          id: 0,
          isConditional: false,
          isGroupInData: false,
          type: 'group',
        };
        newSection.elements.push(neurologicalGroup);
        formattedFormResults.push(newSection);
        break;
      }
      case 'balance_test_setup':
      case 'tandem_gait':
      case 'double_leg_stance':
      case 'single_leg_stance':
      case 'tandem_stance': {
        // Don't add these sections, balanceSection will aggregate
        break;
      }
      case 'immediate_memory_4': {
        // Add balance section before delayed recall
        balanceGroup.questionsAndAnswers.push(
          addSimpleScore(
            aggregation.errors_double_leg_stance.score,
            aggregation.errors_double_leg_stance.max,
            'errors_double_leg_stance',
            i18n.t('Double leg stance')
          ),
          addSimpleScore(
            aggregation.errors_single_leg_stance.score,
            aggregation.errors_single_leg_stance.max,
            'errors_single_leg_stance',
            i18n.t('Single leg stance (non-dominant foot)')
          ),
          addSimpleScore(
            aggregation.errors_tandem_stance.score,
            aggregation.errors_tandem_stance.max,
            'errors_tandem_stance',
            i18n.t('Tandem stance (non-dominant foot at the back)')
          )
        );

        if (balanceGroup.questionsAndAnswers.length > 0) {
          balanceSection.elements.push(balanceGroup);
        }
        formattedFormResults.push(balanceSection);

        // Delayed recall
        newSection.title = i18n.t('Delayed recall');
        const recallQuestions = [
          addSimpleScore(
            aggregation.delayed_recall.score,
            aggregation.delayed_recall.max,
            'recall_score'
          ),
        ];
        const neurologicalGroup: QuestionGroup = {
          questionsAndAnswers: recallQuestions,
          id: 0,
          isConditional: false,
          isGroupInData: false,
          type: 'group',
        };
        newSection.elements.push(neurologicalGroup);
        formattedFormResults.push(newSection);
        break;
      }
      case 'sign_off': {
        formattedFormResults.push(newSection);
        break;
      }
      default: {
        formattedFormResults.push(newSection);
        break;
      }
    }
  });

  if (window.featureFlags['concussion-web-show-sac']) {
    const sacGroup: QuestionGroup = {
      questionsAndAnswers: [
        addSimpleScore(aggregation.sac.score, aggregation.sac.max, 'sac_score'),
      ],
      id: 0,
      isConditional: false,
      isGroupInData: false,
      type: 'group',
    };

    sacSection.elements.push(sacGroup);
  }

  const formInfoResult = createFormInfoResult(data, dataSources.injuries);
  formInfoResult.attachments = attachments;
  return { formattedFormResults, formInfoResult };
};

export default processForm;
