/* eslint-disable no-param-reassign */
// @flow
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
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
});

const processForm = (data: Object, dataSources: DataSources) => {
  const formInfoResult = createFormInfoResult(data, dataSources.injuries);
  formInfoResult.headerTitle = i18n.t('Assessment results');
  formInfoResult.hideFormInfo = true;

  const formattedFormResults = [];

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

  const attachments = [];

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

    let distanceGroupKeys = ['distance3', 'distance2', 'distance1'];
    const distanceGroup: QuestionGroup = {
      questionsAndAnswers: [],
      id: 5,
      isConditional: false,
      isGroupInData: true,
      columns: 3,
      type: 'group',
    };

    section.form_elements.forEach((element: FormElement) => {
      if (!element.visible) {
        return;
      }

      const newGroup: QuestionGroup = {
        questionsAndAnswers: [],
        id: element.id,
        isConditional: element.config?.condition != null,
        isGroupInData:
          element.element_type === 'Forms::Elements::Layouts::Group',
        type: 'group',
        columns: 1,
        title: undefined,
      };

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
      } else {
        const isDistanceKey = distanceGroupKeys.includes(
          element.config.element_id
        );
        if (isDistanceKey) {
          switch (element.config.element_id) {
            case 'distance1': {
              processElement(
                element,
                newSection,
                distanceGroup,
                formAnswers,
                dataSources,
                data.athlete,
                data.editor,
                attachments
              );
              break;
            }
            case 'distance2': {
              processElement(
                element,
                newSection,
                distanceGroup,
                formAnswers,
                dataSources,
                data.athlete,
                data.editor,
                attachments
              );
              break;
            }
            case 'distance3': {
              processElement(
                element,
                newSection,
                distanceGroup,
                formAnswers,
                dataSources,
                data.athlete,
                data.editor,
                attachments
              );
              break;
            }
            default:
            // allow pass through
          }

          // remove distance key after it has been processed
          distanceGroupKeys = distanceGroupKeys.filter(
            (key) => key !== element.config.element_id
          );
        }

        // add distance group when all items are added
        if (distanceGroupKeys.length === 0 && isDistanceKey) {
          newSection.elements.push(distanceGroup);
        } else if (!isDistanceKey) {
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
      }

      if (newGroup.questionsAndAnswers.length > 0) {
        newSection.elements.push(newGroup);
      }
    });

    formattedFormResults.push(newSection);

    if (newSection.elementId === 'section_main') {
      newSection.columns = 2;

      newSection.elements.forEach((sectionElement) => {
        if (sectionElement.type === 'group') {
          sectionElement.questionsAndAnswers.forEach((groupElement) => {
            // Rename the questions as don't have titles
            if (groupElement.type === 'questionAndAnswer') {
              // eslint-disable-next-line default-case
              switch (groupElement.id) {
                case 'score': {
                  groupElement.question = `${i18n.t('Score')}:`;
                  break;
                }
                case 'errors': {
                  groupElement.question = `${i18n.t('Errors')}:`;
                  break;
                }
                case 'distance1': {
                  groupElement.question = `${i18n.t('Distance')} 1:`;
                  break;
                }
                case 'distance2': {
                  groupElement.question = `${i18n.t('Distance')} 2:`;
                  break;
                }
                case 'distance3': {
                  groupElement.question = `${i18n.t('Distance')} 3:`;
                  break;
                }
                case 'average': {
                  groupElement.question = `${i18n.t('Average')}:`;
                  break;
                }
              }
            }
          });
        }
      });
      const additionalQuestions = [];

      if (formInfoResult.date) {
        const dateGroup: QuestionGroup = {
          questionsAndAnswers: [
            {
              question: `${i18n.t('Date of examination')}:`,
              answer: DateFormatter.formatStandard({
                date: moment(formInfoResult.date),
                showTime: false,
                displayLongDate: true,
              }),
              id: 'date_of_examination',
              type: 'questionAndAnswer',
            },
          ],
          id: 0,
          isConditional: false,
          isGroupInData: false,
          type: 'group',
          title: undefined,
        };

        const timeGroup: QuestionGroup = {
          questionsAndAnswers: [
            {
              question: `${i18n.t('Time of examination')}:`,
              answer: DateFormatter.formatJustTime(moment(formInfoResult.date)),
              id: 'time_of_examination',
              type: 'questionAndAnswer',
            },
          ],
          id: 1,
          isConditional: false,
          isGroupInData: false,
          type: 'group',
          title: undefined,
        };
        additionalQuestions.push(dateGroup, timeGroup);
      }

      if (formInfoResult.formMeta.name) {
        const assessmentTypeGroup: QuestionGroup = {
          questionsAndAnswers: [
            {
              question: `${i18n.t('Assessment type')}:`,
              answer: formInfoResult.formMeta.fullname,
              id: 'assessment_type',
              type: 'questionAndAnswer',
            },
          ],
          id: 2,
          isConditional: false,
          isGroupInData: false,
          type: 'group',
          title: undefined,
        };
        additionalQuestions.push(assessmentTypeGroup);
      }

      if (formInfoResult.editor?.fullname) {
        const examinerGroup: QuestionGroup = {
          questionsAndAnswers: [
            {
              question: `${i18n.t('Examiner')}:`,
              answer: formInfoResult.editor.fullname,
              id: 'examiner_name',
              type: 'questionAndAnswer',
            },
          ],
          id: 3,
          isConditional: false,
          isGroupInData: false,
          type: 'group',
          title: undefined,
        };
        additionalQuestions.push(examinerGroup);
      }

      newSection.elements.unshift(...additionalQuestions);
    }
  });
  formInfoResult.attachments = attachments;
  return { formattedFormResults, formInfoResult };
};

export default processForm;
