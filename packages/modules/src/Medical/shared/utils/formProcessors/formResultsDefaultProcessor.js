// @flow
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import i18n from '@kitman/common/src/utils/i18n';
import unitsHelper from '@kitman/common/src/utils/unitsHelper';
import type { DataSourceEntry } from '@kitman/services/src/services/getFormDataSourceItems';
import type {
  QuestionGroup,
  QuestionSection,
  FormElement,
  InjuryIllnessSummary,
  FormInfo,
  AthleteDetails,
  UserDetails,
  FormAttachment,
} from '../../types/medical/QuestionTypes';
import { getPathologyName } from '..';
import type { DataSources } from '../../hooks/useFormResultsData';

type Kt1000 = {
  displacement: number,
  force: number,
};

type BloodPressure = {
  systolic: number,
  diastolic: number,
};

export const formatAnswer = (
  answer: {
    value:
      | string
      | number
      | boolean
      | Array<string | number | boolean | Kt1000 | BloodPressure>,
    items: ?Array<{ value: string, label: string }>,
  },
  answerType: string,
  config: ?Object,
  repeatableAnswerIndex?: ?number
): ?string => {
  if (!answer) {
    return null;
  }

  let answerValue = answer.value;
  if (Array.isArray(answer.value) && repeatableAnswerIndex != null) {
    answerValue = answer?.value[repeatableAnswerIndex || 0];
  }

  if (answerValue == null) {
    return null;
  }

  switch (answerType) {
    case 'Forms::Elements::Inputs::DateTime': {
      if (config?.type === 'date' || config?.type === 'time') {
        let parsedDate = moment(answerValue, DateFormatter.dateTransferFormat);
        if (!parsedDate.isValid()) {
          parsedDate = moment(answerValue);
        }
        if (parsedDate.isValid()) {
          return config?.type === 'time'
            ? DateFormatter.formatJustTime(parsedDate)
            : DateFormatter.formatStandard({
                date: parsedDate,
                showTime: false,
                displayLongDate: false,
              });
        }
      }
      return answerValue.toString();
    }
    case 'Forms::Elements::Inputs::Number': {
      let answerString;
      if (answerValue != null) {
        if (typeof answerValue === 'number') {
          answerString =
            config?.type === 'integer'
              ? answerValue.toString()
              : parseFloat(answerValue.toFixed(3)).toString();
        } else {
          answerString = answerValue.toString();
        }
      }

      // Support for unit singular / plural translations
      const unit = config?.custom_params?.unit;
      if (answerString && unit) {
        if (unit === 'ft inches' && typeof answerValue === 'number') {
          const feet = Math.floor(answerValue / 12);
          const inches = answerValue % 12;
          const feetUnit = unitsHelper('foot', feet, true);
          const inchesUnit = unitsHelper('inch', inches, false);
          return `${feet} ${feetUnit} ${inches} ${inchesUnit}`;
        }
        const pluralizedUnit = unitsHelper(
          unit,
          typeof answerValue === 'number' ? answerValue : 0,
          true
        );
        // If unit is single char like % then appending to string, otherwise add a space
        return `${answerString}${
          unit.length === 1 ? pluralizedUnit : ` ${pluralizedUnit}`
        }`;
      }
      return answerString || '';
    }
    case 'Forms::Elements::Customs::BloodPressure': {
      // $FlowIgnore Type has to match BloodPressure
      const bloodPressure: BloodPressure = answerValue;
      return `${i18n.t('Systolic')}: ${bloodPressure.systolic}, ${i18n.t(
        'Diastolic'
      )}: ${bloodPressure.diastolic}`;
    }
    case 'Forms::Elements::Customs::Kt1000': {
      // $FlowIgnore Type has to match Kt1000
      const kt1000: Kt1000 = answerValue;
      return `${i18n.t('Displacement')}: ${kt1000.displacement}, ${i18n.t(
        'Force'
      )}: ${kt1000.force}`;
    }
    case 'Forms::Elements::Inputs::Range': {
      return answerValue.toString();
    }
    case 'Forms::Elements::Inputs::Boolean': {
      return answerValue ? i18n.t('Yes') : i18n.t('No');
    }
    case 'Forms::Elements::Inputs::MultipleChoice': {
      if (!answer.items || answer.items.length === 0) {
        return answerValue.toString();
      }
      if (Array.isArray(answerValue)) {
        const matches = answer.items.filter((item) =>
          // $FlowFixMe Is an array I checked
          answerValue.includes(item.value)
        );
        return matches.map((item) => item.label).join(', ');
      }
      return '';
    }
    case 'Forms::Elements::Inputs::SingleChoice': {
      if (!answer.items || answer.items.length === 0) {
        return answerValue.toString();
      }
      const match = answer.items.find((item) => item.value === answerValue);

      return match ? match.label : '';
    }
    default: {
      return answerValue.toString();
    }
  }
};

export const formatQuestion = (
  question: string,
  includeColon: boolean = true
) => {
  if (!question || question.length < 1) {
    return question;
  }
  const lastCharacter = question.charAt(question.length - 1);
  switch (lastCharacter) {
    case '?': {
      return question;
    }
    default: {
      return includeColon ? `${question}:` : `${question}`;
    }
  }
};

const evaluateCondition = (condition: Object, formAnswers: Object): boolean => {
  const answerToCondition = formAnswers[condition.element_id]
    ? formAnswers[condition.element_id].value
    : null;

  switch (condition.type) {
    case '==': {
      const result = answerToCondition === condition.value;
      if (result) {
        return result;
      }
      // Support == where multiple choice but selection exactly matches the single answer
      if (Array.isArray(answerToCondition) && answerToCondition.length === 1) {
        return answerToCondition[0] === condition.value;
      }
      return false;
    }
    case '!=': {
      const result = answerToCondition !== condition.value;
      if (result) {
        return result;
      }
      // Support != where multiple choice but selection exactly matches the single answer
      if (Array.isArray(answerToCondition) && answerToCondition.length === 1) {
        return answerToCondition[0] !== condition.value;
      }
      return false;
    }
    case '<': {
      return answerToCondition < condition.value;
    }
    case '>': {
      return answerToCondition > condition.value;
    }
    case '<=': {
      return answerToCondition <= condition.value;
    }
    case '>=': {
      return answerToCondition >= condition.value;
    }
    case 'is_answered': {
      return !!answerToCondition === condition.value;
    }
    case 'in': {
      return (
        Array.isArray(answerToCondition) &&
        answerToCondition.includes(condition.value)
      );
    }
    case 'and': {
      return condition.conditions.every((childCondition) =>
        evaluateCondition(childCondition, formAnswers)
      );
    }
    case 'or': {
      return condition.conditions.some((childCondition) =>
        evaluateCondition(childCondition, formAnswers)
      );
    }
    default:
      return false;
  }
};

export const isConditionMet = (
  element: FormElement,
  formAnswers: Object
): boolean => {
  if (!element.config?.condition) {
    return true;
  }

  return evaluateCondition(element.config.condition, formAnswers);
};

const findNextResultsInChain = (
  answerValue,
  dataSourceEntries: Array<DataSourceEntry>
) => {
  return dataSourceEntries?.find(
    (entry) => entry.value.toString() === answerValue?.toString()
  );
};

export const recursiveFindDataSourceLabel = (
  answerChain: Array<any>,
  dataSourceEntries: Array<DataSourceEntry>
) => {
  const answerValue = answerChain.pop();

  // If answers is an array then things are getting too complex, Stop recursion
  if (Array.isArray(answerValue)) {
    const multipleResults = answerValue.map(
      (singleAnswer) =>
        findNextResultsInChain(singleAnswer, dataSourceEntries)?.label ||
        singleAnswer.toString()
    );
    return multipleResults?.join(', ');
  }

  if (!dataSourceEntries || answerValue == null) {
    return answerValue;
  }
  const nextResultsInChain = findNextResultsInChain(
    answerValue,
    dataSourceEntries
  );

  if (answerChain.length === 0 || !nextResultsInChain?.children) {
    return nextResultsInChain?.label || answerValue;
  }
  return recursiveFindDataSourceLabel(
    answerChain,
    nextResultsInChain?.children
  );
};

export const recursiveFindDataSource = (
  dependency: string,
  formAnswers: Object,
  answerChain: Array<any>
) => {
  const priorAnswer = formAnswers[dependency];
  if (priorAnswer?.value) {
    answerChain.push(priorAnswer?.value);
  }
  if (priorAnswer?.dataSource) {
    // We have reached the root dataSource, won't check dataDependsOn at this level
    return { rootDataSource: priorAnswer.dataSource, answerChain };
  }
  if (priorAnswer.dataDependsOn) {
    return recursiveFindDataSource(
      priorAnswer.dataDependsOn,
      formAnswers,
      answerChain
    );
  }
  return { rootDataSource: null, answerChain };
};

export const processElement = (
  element: FormElement,
  section: QuestionSection,
  group: QuestionGroup,
  formAnswers: Object,
  dataSources: DataSources,
  athlete: AthleteDetails,
  editor: UserDetails,
  attachments: Array<FormAttachment>
) => {
  if (!element.visible) {
    return;
  }

  if (element.element_type === 'Forms::Elements::Layouts::MenuGroup') {
    return; // Don't support nested menu group right now
  }

  if (element.element_type === 'Forms::Elements::Layouts::List') {
    return; // Not supported yet
  }

  // Don't process if condition is not met
  if (element.config?.condition) {
    if (!isConditionMet(element, formAnswers)) {
      return;
    }
  }

  if (element.element_type === 'Forms::Elements::Layouts::Group') {
    // eslint-disable-next-line no-use-before-define
    processGroup(
      element,
      group,
      section,
      formAnswers,
      dataSources,
      athlete,
      editor,
      attachments
    );
    return;
  }

  if (element.element_type === 'Forms::Elements::Layouts::MenuItem') {
    element.form_elements?.forEach((childElement) =>
      processElement(
        childElement,
        section,
        group,
        formAnswers,
        dataSources,
        athlete,
        editor,
        attachments
      )
    );
    return;
  }

  if (element.element_type === 'Forms::Elements::Layouts::Separator') {
    section.elements.push({
      type: 'separator',
      id: element.id,
    });
    return;
  }

  const answer = formAnswers[element.config.element_id];

  if (element.element_type === 'Forms::Elements::Inputs::Attachment') {
    const answerValue = answer?.value;
    let attachment;
    if (Array.isArray(answerValue) && group.repeatableAnswerIndex != null) {
      attachment = answer.attachments[group.repeatableAnswerIndex];
    } else if (answer?.attachment) {
      attachment = answer.attachment;
    }

    if (!attachment) {
      return;
    }

    let title;
    let signatureName;
    let displayType = 'file';
    switch (element.config.element_id) {
      case 'player_signature': {
        displayType = 'signature';
        title = `${i18n.t('Player signature')}:`;
        signatureName = athlete.fullname;
        break;
      }
      case 'examiner_signature': {
        displayType = 'signature';
        title = `${i18n.t('Examiner signature')}:`;
        signatureName = editor.fullname;
        break;
      }
      default:
        if (element.config?.custom_params?.type === 'signature') {
          displayType = 'signature';
          title = element.config?.text || `${i18n.t('Signature')}:`;
        } else if (element.config?.custom_params?.type === 'image') {
          displayType = 'image';
          title = element.config?.text;
        } else {
          // Default to displaying a file
          displayType = 'file';
          title = element.config?.text;
        }
    }

    attachments.push(attachment);

    group.questionsAndAnswers.push({
      type: 'attachment',
      attachment,
      id: element.config.element_id,
      displayType,
      title,
      signatureName,
    });
    return;
  }

  let formattedAnswer;

  /*
      NOTE: Some data sources have option entries with child values. A select may present to the user the parent level options
      Making a selection can cause a different select component to display the child values of that prior answer
      "The second select data depends on the answer from the first"
  */
  const dependency = element.config.custom_params?.data_depends_on;

  if ((element.config.data_source || dependency) && answer) {
    let answerValue = answer.value;

    if (Array.isArray(answerValue) && group.repeatableAnswerIndex != null) {
      answerValue = answerValue[group.repeatableAnswerIndex];
    }

    if (!answerValue) {
      return;
    }

    let answerChain = [answerValue];
    let dataSource;
    if (dependency) {
      // Walk back up answers to find the DataSource and also record the chain of answer values as walk
      const { rootDataSource, answerChain: answerChainUpdated } =
        recursiveFindDataSource(dependency, formAnswers, answerChain);
      answerChain = answerChainUpdated;
      dataSource = rootDataSource;
    } else {
      dataSource = element.config.data_source;
    }

    if (dataSource === 'injuries') {
      if (dataSources.injuries) {
        const injuryId = parseInt(answerValue, 10);
        const injury = dataSources.injuries?.find(
          (linkedIssue) => linkedIssue.occurrence_id === injuryId
        );

        if (injury) {
          const date = DateFormatter.formatStandard({
            date: moment(injury.occurrence_date),
            showTime: false,
            displayLongDate: false,
          });

          const pathologyName = getPathologyName(injury);
          formattedAnswer = `${date} - ${pathologyName}`;
        }
      }
    } else if (dataSource != null) {
      formattedAnswer = recursiveFindDataSourceLabel(
        answerChain,
        dataSources[dataSource]
      )?.toString();
    }
  }

  if (formattedAnswer == null) {
    formattedAnswer = formatAnswer(
      answer,
      element.element_type,
      element.config,
      group.repeatableAnswerIndex
    );
  }

  const isDescriptionContent =
    element.element_type === 'Forms::Elements::Layouts::Content';

  let renderConfig;

  if (
    element.element_type === 'Forms::Elements::Inputs::Range' &&
    element.config.custom_params?.style === 'rating'
  ) {
    renderConfig = {
      renderAs: 'color',
      valueMap: { '0': '#C31D2B', '1': '#FFAB00', '2': '#43B374' },
    };
  }

  if (element.config.text || element.config.element_id != null) {
    const output = {
      question: formatQuestion(
        element.config.text != null
          ? element.config.text
          : element.config.element_id,
        !isDescriptionContent
      ),
      answer: formattedAnswer,
      id: element.config.element_id,
      type: isDescriptionContent ? 'descriptionContent' : 'questionAndAnswer',
    };
    if (renderConfig) {
      // $FlowIgnore[prop-missing] Adding the optionally present key
      output.renderConfig = renderConfig;
    }

    group.questionsAndAnswers.push(output);
  }
};

export const processGroup = (
  element: FormElement,
  parentGroup: ?QuestionGroup,
  section: QuestionSection,
  formAnswers: Object,
  dataSources: DataSources,
  athlete: AthleteDetails,
  editor: UserDetails,
  attachments: Array<FormAttachment>
) => {
  if (!element.visible) {
    return;
  }
  if (isConditionMet(element, formAnswers)) {
    const isRepeatable = element.config?.repeatable;

    // The 'Repeatable group' concept supports users to 'Add another' response to questions like "What medications are you on?"
    // Repeatable groups have elements whose answers are arrays corresponding to each additional response
    // Pseudo repeatedGroupFormElements = [ {elementA_Answers:[A,B,C]}, {elementB_Answers:[D,E,F]} ]

    // We have to show all elements in the group each with its value from the first index
    // Then repeat to show all elements in the group each with its value from the second index
    // Until no more response sets

    // Pseudo Output of answers:
    // A, D // Group Repetition 1
    // B, E // Group Repetition 2
    // C, F // Group Repetition 3

    const isParentRepeatable = parentGroup?.repeatableAnswerIndex != null;

    let maxRepetitionAnswerCount = 1;

    if (isRepeatable) {
      maxRepetitionAnswerCount = element.form_elements?.reduce(
        (accumulator, childElement) => {
          const answerValue =
            formAnswers[childElement.config.element_id]?.value;
          if (Array.isArray(answerValue) && answerValue.length > accumulator) {
            return answerValue.length;
          }

          return accumulator;
        },
        1
      );
    }
    // Doubly ensure to perform at least one repeat of the group
    maxRepetitionAnswerCount = maxRepetitionAnswerCount || 1;

    for (let i = 0; i < maxRepetitionAnswerCount; i++) {
      const newGroup: QuestionGroup = {
        questionsAndAnswers: [],
        id: element.id,
        isConditional: element.config?.condition != null,
        isGroupInData: true,
        type: 'group',
      };
      if (isRepeatable) {
        newGroup.repeatableAnswerIndex = i;
      } else if (isParentRepeatable) {
        newGroup.repeatableAnswerIndex = parentGroup?.repeatableAnswerIndex;
      }

      if (element.config?.custom_params?.columns != null) {
        newGroup.columns = element.config?.custom_params?.columns;
      }

      if (element.config?.title != null) {
        newGroup.title = element.config.title;
      }

      element.form_elements?.forEach((childElement) => {
        processElement(
          childElement,
          section,
          newGroup,
          formAnswers,
          dataSources,
          athlete,
          editor,
          attachments
        );
      });

      if (!newGroup.questionsAndAnswers.length) {
        // eslint-disable-next-line no-continue
        continue; // Continue saves an extra layer of nesting
      }
      if (parentGroup) {
        parentGroup.questionsAndAnswers.push(newGroup);
      } else {
        section.elements.push(newGroup);
      }
    }
  }
};

export const processMenuGroup = (
  menuGroup: FormElement,
  section: QuestionSection,
  formAnswers: Object,
  dataSources: DataSources,
  athlete: AthleteDetails,
  editor: UserDetails,
  attachments: Array<FormAttachment>
) => {
  if (!menuGroup.visible) {
    return;
  }

  if (menuGroup.element_type === 'Forms::Elements::Layouts::MenuGroup') {
    if (isConditionMet(menuGroup, formAnswers)) {
      // Process its form_elements
      menuGroup.form_elements?.forEach((menuItem) => {
        const menuItemGroup: QuestionGroup = {
          questionsAndAnswers: [],
          id: menuItem.id,
          isConditional: menuItem.config?.condition != null,
          isGroupInData: false,
          type: 'group',
        };

        if (menuItem.config?.title != null) {
          menuItemGroup.title = menuItem.config.title;
        }

        processElement(
          menuItem,
          section,
          menuItemGroup,
          formAnswers,
          dataSources,
          athlete,
          editor,
          attachments
        );

        if (menuItemGroup.questionsAndAnswers.length > 0) {
          section.elements.push(menuItemGroup);

          section.elements.push({
            type: 'separator',
            id: `${menuItem.id}_separator`,
          });
        }
      });
    }
  }
};

export const createFormInfoResult = (
  data: Object,
  linkedInjuriesAndIllnesses: ?Array<InjuryIllnessSummary>
): FormInfo => {
  return {
    formMeta: data.form,
    headerTitle: data.form_template_version.config?.custom_params?.header_tile,
    mergeSections:
      data.form_template_version.config?.custom_params?.merge_section ||
      data.form_template_version.config?.custom_params?.merge_sections,
    hideFormInfo:
      data.form_template_version.config?.custom_params?.hide_form_info,
    athlete: data.athlete,
    editor: data.editor,
    status: data.status,
    date: data.date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    linked_injuries_illnesses: linkedInjuriesAndIllnesses,
    attachments: [],
  };
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
      dataSource: item.form_element.config?.data_source,
      dataDependsOn: item.form_element.config?.custom_params?.data_depends_on, // TODO: currently unused in processing
      attachment: item.attachment,
      attachments: item.attachments,
    };
  });

  data.form_template_version.form_elements.forEach((section) => {
    if (!section.visible) {
      return;
    }

    const newSection: QuestionSection = {
      title: section.config.title,
      elementId: section.config.element_id,
      elements: [],
      id: section.id,
      sidePanelSection: false,
    };

    if (section.config?.custom_params?.columns != null) {
      newSection.columns = section.config?.custom_params?.columns;
    }

    if (section.config?.custom_params?.side_panel_section) {
      newSection.sidePanelSection =
        section.config?.custom_params?.side_panel_section;
    }
    section.form_elements.forEach((element: FormElement) => {
      if (!element.visible) {
        return;
      }

      if (element.element_type === 'Forms::Elements::Layouts::Group') {
        processGroup(
          element,
          null,
          newSection,
          formAnswers,
          dataSources,
          data.athlete,
          data.editor,
          attachments
        );
      } else if (element.element_type === 'Forms::Elements::Layouts::Menu') {
        if (isConditionMet(element, formAnswers)) {
          // Process its form_elements
          element.form_elements?.forEach((menuGroup) =>
            processMenuGroup(
              menuGroup,
              newSection,
              formAnswers,
              dataSources,
              data.athlete,
              data.editor,
              attachments
            )
          );
        }
      } else {
        const newGroup: QuestionGroup = {
          questionsAndAnswers: [],
          id: element.id,
          isConditional: element.config?.condition != null,
          isGroupInData: false,
          type: 'group',
        };
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

        if (newGroup.questionsAndAnswers.length > 0) {
          newSection.elements.push(newGroup);
        }
      }
    });

    formattedFormResults.push(newSection);
  });

  const formInfoResult = createFormInfoResult(data, dataSources.injuries);
  formInfoResult.attachments = attachments;

  return { formattedFormResults, formInfoResult };
};

export default processForm;
