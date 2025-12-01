/* eslint-disable camelcase */
// @flow
import _flattenDeep from 'lodash/flattenDeep';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import {
  getCodingSystemFromIssue,
  getIssueTypeFromPayload,
  isInfoEvent,
} from '@kitman/modules/src/Medical/shared/utils/index';

import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { SelectOption } from '@kitman/components/src/types';
import type { Conditions } from '@kitman/modules/src/Medical/rosters/src/services/getConditionalFields';

import type {
  ActiveCondition,
  ActiveQuestion,
  BasicConditionalFieldAnswer,
  ConditionWithQuestions,
  ConditionalFieldAnswer,
  PredicateOption,
  PredicateOptionTransformed,
  SerializedQuestion,
  Operand,
  NewQuestion,
  NewQuestionTree,
  NewCondition,
} from '../types';

const isEmptyString = (value: ?string) =>
  value == null || value?.trim().length === 0;

const blankConditionGenerator = (
  allConditionsLength: number = 0
): ActiveCondition => ({
  index: allConditionsLength,
  order: allConditionsLength + 1,
  name: '',
  predicate: {
    operands: [{ operator: null, path: '', value: '' }],
    operator: 'and',
  },
  // this is hard-coded for now will update when BE updates.
  location: 'AdditionalQuestions',
  questions: [
    {
      id: 26,
      answer_datatype: 'string',
      csv_header: null,
      default_required_for_complete_record: 'optional',
      default_value: null,
      detail: null,
      name: '',
      order: 1,
      path: null,
      placement: 'form-end', // this is hard-coded for now will update when BE updates
      question: '',
      question_options: [],
      question_type: '',
      training_variable_perma_id: null,
      trigger_value: null,
      previous_version_of_question_id: null,
      children: [],
      questionNumbering: '1',
    },
  ],
});

const blankQuestionGenerator = (
  order: number,
  questionNumbering: string = '1'
): ActiveQuestion => ({
  answer_datatype: 'string',
  csv_header: null,
  default_required_for_complete_record: 'optional',
  default_value: null,
  detail: null,
  name: '',
  order,
  path: null,
  placement: 'form-end',
  question: '',
  question_options: [],
  question_type: '',
  training_variable_perma_id: null,
  trigger_value: null,
  previous_version_of_question_id: null,
  children: [],
  questionNumbering,
});

// used in conditionBuildViewSlice to create a new followup question inside the parent,
// maps recursively until the parent is found
const createNestedFollowupQuestion = (
  items: Array<ActiveQuestion>,
  questionNumbering: string
): Array<ActiveQuestion> => {
  return items.map((item) => {
    const childrenOrder = item.children.length + 1;
    const newQuestionNumbering = questionNumbering
      ? `${questionNumbering}.${childrenOrder}`
      : `${childrenOrder}`;

    if (questionNumbering === item.questionNumbering) {
      return {
        ...item,
        children: [
          ...item.children,
          blankQuestionGenerator(childrenOrder, newQuestionNumbering),
        ],
      };
    }

    if (item.children) {
      return {
        ...item,
        children: createNestedFollowupQuestion(
          item.children,
          questionNumbering
        ),
      };
    }

    return item;
  });
};

// used in conditionBuildViewSlice to update a followup question,
// maps recursively until the question is found
const updateNestedFollowupQuestion = (
  items: Array<ActiveQuestion>,
  questionNumbering: string,
  key: string,
  value: string
): Array<ActiveQuestion> => {
  return items.map((item) => {
    if (questionNumbering === item.questionNumbering) {
      if (
        key === 'question_type' &&
        (value === 'multiple-choice' || value === 'boolean')
      ) {
        return {
          ...item,
          question_options: [
            {
              order: 1,
              value: '',
            },
          ],
          answer_datatype: 'string',
          [key]: value,
        };
      }

      return {
        ...item,
        answer_datatype: 'string',
        [key]: value,
      };
    }

    if (item.children) {
      return {
        ...item,
        children: updateNestedFollowupQuestion(
          item.children,
          questionNumbering,
          key,
          value
        ),
      };
    }

    return item;
  });
};

// used in conditionBuildViewSlice to add a new question option for a followup question,
// maps recursively until the question is found
const addNestedFollowupQuestionMetadata = (
  items: Array<ActiveQuestion>,
  questionNumbering: string
): Array<ActiveQuestion> => {
  return items.map((item) => {
    if (questionNumbering === item.questionNumbering) {
      return {
        ...item,
        question_options: [
          ...item.question_options,
          { order: item.question_options.length + 1, value: '' },
        ],
      };
    }

    if (item.children) {
      return {
        ...item,
        children: addNestedFollowupQuestionMetadata(
          item.children,
          questionNumbering
        ),
      };
    }

    return item;
  });
};

// used in conditionBuildViewSlice to update a question option for a followup question,
// maps recursively until the question is found
const updateNestedFollowupQuestionMetadata = (
  items: Array<ActiveQuestion>,
  questionNumbering: string,
  order: number,
  value: string
): Array<ActiveQuestion> => {
  return items.map((item) => {
    if (questionNumbering === item.questionNumbering) {
      const indexToModify = order - 1;
      const newObject = { order, value };
      const modifiedQuestionOptions = [...item.question_options];
      modifiedQuestionOptions.splice(indexToModify, 1, newObject);

      return {
        ...item,
        question_options: modifiedQuestionOptions,
      };
    }
    if (item.children) {
      return {
        ...item,
        children: updateNestedFollowupQuestionMetadata(
          item.children,
          questionNumbering,
          order,
          value
        ),
      };
    }

    return item;
  });
};

// used in conditionBuildViewSlice to update a trigger value for a followup question,
// maps recursively until the question is found
const updateNestedFollowupQuestionTrigger = (
  items: Array<ActiveQuestion>,
  questionNumbering: string,
  value: string
): Array<ActiveQuestion> => {
  return items.map((item) => {
    if (questionNumbering === item.questionNumbering) {
      return {
        ...item,
        trigger_value: value,
      };
    }
    if (item.children) {
      return {
        ...item,
        children: updateNestedFollowupQuestionTrigger(
          item.children,
          questionNumbering,
          value
        ),
      };
    }
    return item;
  });
};

const blankOperandGenerator = (): Operand => ({
  operator: null,
  path: '',
  value: 'string',
});

/**
 *
 * The first iteration of v2 Conditional Fields
 * is bringing parity with v1 and so the BE is
 * in-flight and so there are misalignments
 *
 * Currently the BE response structure varies
 * slightly from the Request structure and
 * so logic needs to be run to ensure
 * data is correctly stored client side
 * and then sent to BE
 *
 * Called out in the Types file as well
 * ConditionWithQuestions <== BE RESPONSE type
 * ActiveCondition <=== REQUEST type
 *
 * biggest issue is the nested question data
 * but also the naming of the question_metadata
 * vs. question_options
 *
 *
 * * Transforms the BE response of version conditions
 * *  into client-side usable data
 *
 *
 * @param {Array<ConditionWithQuestions>} conditions Array of conditions from the BE RESPONSE
 *
 * @returns {Array<ActiveCondition>} an array of conditions suitable for REQUEST and client-side state
 *
 */

const transformQuestionsRecursively = (
  questions: Array<SerializedQuestion>,
  questionNumbering?: string
): Array<ActiveQuestion> => {
  return questions.map(({ question: q, children }, index) => {
    const newQuestionNumbering = questionNumbering
      ? `${questionNumbering}.${index + 1}`
      : `${index + 1}`;

    const {
      id: questionId,
      csv_header,
      default_required_for_complete_record,
      default_value,
      name: questionName,
      order: questionOrder,
      path,
      placement,
      question,
      question_metadata,
      question_type,
      training_variable_perma_id,
      trigger_value,
    } = q;
    const activeQuestion = {
      id: questionId,
      answer_datatype: 'string',
      csv_header,
      default_required_for_complete_record,
      default_value,
      detail: '',
      name: questionName ?? '',
      order: questionOrder ?? '',
      path: path ?? '',
      placement,
      question,
      question_options: Array.isArray(question_metadata)
        ? question_metadata?.map(({ value, order: optionOrder }) => ({
            value,
            order: optionOrder,
          }))
        : [],
      question_type,
      training_variable_perma_id,
      trigger_value,
      previous_version_of_question_id: null,
      // $FlowIgnoreMe
      children:
        children?.length > 0
          ? transformQuestionsRecursively(children, newQuestionNumbering)
          : [],
      questionNumbering: newQuestionNumbering,
    };

    if (q.children) {
      return {
        ...activeQuestion,
        children: transformQuestionsRecursively(children, questionNumbering),
      };
    }

    return activeQuestion;
  });
};

const transformConditionResponseToClientState = (
  conditions: Array<ConditionWithQuestions>
): Array<ActiveCondition> => {
  return conditions.map(
    ({ id, predicate, location, name, order, questions }, index) => {
      const transformedConditions = transformQuestionsRecursively(questions);
      return {
        id,
        index,
        predicate,
        location,
        name,
        order,
        questions: transformedConditions,
      };
    }
  );
};

/**
 * * Takes in predicate options from response and
 *  transforms payload into usable <Select/> data
 *
 * @param {Array<PredicateOption>} predicateOptions : an array of PredicateOptions
 *
 * @returns {Array<PredicateOptionTransformed>} Array of SelectOption containing MetaData to set Trigger and Operator dropdowns
 *
 */
const predicateOptionsMapToSelect = (
  predicateOptions: Array<PredicateOption>
): Array<PredicateOptionTransformed> => {
  return (
    predicateOptions?.map(({ label, operators, options, deprecated, path }) => {
      return {
        value: path,
        label,
        metaData: {
          operators,
          options,
          deprecated,
          path,
        },
      };
    }) || []
  );
};

/**
 *
 * @param {Array<PredicateOptionTransformed>} mappedPredicateOptions predicate options after transformation
 * @param {PredicateOption} selectedPredicateOperands current Predicate option in order to filter for dropdown
 *
 * @returns a Predicate Option if it finds a match in the array
 */
const findOptionsByPath = (
  mappedPredicateOptions: Array<PredicateOptionTransformed> = [],
  selectedPredicateOperands: Operand
): ?PredicateOptionTransformed => {
  return mappedPredicateOptions?.find(
    (option) => option.value === selectedPredicateOperands?.path
  );
};

/**
 *
 * @param {Array<PredicateOptionTransformed>} mappedPredicateOptions predicate options after transformation
 * @param {Operand} selectedPredicateOperands current Predicate Operands in order to filter for dropdown
 *
 * @returns an array of options suitable to <Select/>
 */
const triggerOptionsToSelect = (
  mappedPredicateOptions: Array<PredicateOptionTransformed> = [],
  selectedPredicateOperands: Operand
): Array<SelectOption> =>
  findOptionsByPath(
    mappedPredicateOptions,
    selectedPredicateOperands
  )?.metaData?.options?.map(({ label, value }) => ({
    label,
    value: value?.toString(),
  })) || [];

/**
 *
 * @param {Array<PredicateOptionTransformed>} mappedPredicateOptions predicate options after transformation
 * @param {Operand} selectedPredicateOperands current Predicate Operands in order to filter for dropdown
 *
 * @returns an array of options suitable to <Select/>
 */

const operatorOptionsToSelect = (
  mappedPredicateOptions: Array<PredicateOptionTransformed> = [],
  selectedPredicateOperands: Operand
): Array<SelectOption> =>
  findOptionsByPath(mappedPredicateOptions, selectedPredicateOperands)?.metaData
    .operators || [];

const getRulesetTitle = ({
  propTitle,
  rtkTitle,
}: {
  propTitle: ?string,
  rtkTitle: ?string,
}) => {
  if (!isEmptyString(rtkTitle)) {
    return rtkTitle;
  }
  if (!isEmptyString(propTitle)) {
    return propTitle;
  }
  return '--';
};

const getConditionsContext = (
  issue: IssueOccurrenceRequested
): Conditions | null => {
  const issueClassName =
    !issue.isChronicIssue && issue.issueType
      ? issue.issueType?.toLowerCase()
      : null;

  const isMultipleCodingOn = window.featureFlags['emr-multiple-coding-systems'];

  if (isMultipleCodingOn && !issue.coding) {
    return null;
  }

  const coding = getCodingSystemFromIssue(issue);
  const secondaryPathologies = coding?.secondary_pathologies || [];

  const conditions: Conditions = {
    athlete_id: issue.athlete_id,
    activity_id: issue.activity_id,
    activity_group_id: null,
    published_before: issue.created_at,
    clinical_impression_code: isMultipleCodingOn
      ? issue.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]?.code
      : null,
    osics_classification_id: isMultipleCodingOn
      ? issue.coding[codingSystemKeys.OSICS_10]?.osics_classification_id || null
      : issue.osics?.osics_classification_id,
    osics_pathology_id: isMultipleCodingOn
      ? issue.coding[codingSystemKeys.OSICS_10]?.osics_pathology_id || null
      : issue.osics?.osics_pathology_id,
    osics_body_area_id: isMultipleCodingOn
      ? issue.coding[codingSystemKeys.OSICS_10]?.osics_body_area_id || null
      : issue.osics?.osics_body_area_id,
    event_type_id: issue.activity_type || null,
    illness_onset_id: issue.onset_id || null,
    pathology_codes:
      isMultipleCodingOn && coding
        ? [
            // $FlowIgnore flow should know that coding.code will be a number or undefined
            coding?.code || null,
            // $FlowIgnore secondaryPathologies will be an array
            ...secondaryPathologies.map((pathology) => pathology.record?.code),
          ].filter((val) => typeof val !== 'undefined' && val)
        : [],
    issue_type_name: getIssueTypeFromPayload(issue),
    issue_class_name: issueClassName,
    reported_date: issue.reported_date,
    occurrence_date: issue.occurrence_date,
    other_event_value: isInfoEvent(issue.activity_type)
      ? null
      : issue.activity_type,
  };
  return conditions;
};

/**
 * A recursive function that traverses the Questions tree in order
 * to extract the answers of all questions regardless of depth
 *
 * A Questions tree can look like this:
 *
 *                  Parent Question
 *            ____________|_____________________
 *            |           |                   |
 *           Child      Child w/children    Child
 *                            |
 *            ________________|________________
 *    Child w/Children        Child            Child
 *       |
 *       |_____________________
 *     Child              Child w/children
 *                                |
 *                                etc.
 *
 *
 * @param {Array<SerializedQuestion>} questions
 * @param {number} screeningVersionId
 *
 * @returns a mixed array containing Objects or Arrays;
 *            can be ConditionalFieldAnswer object
 *            or an Array<ConditionalFieldAnswer>
 *            or nested Array of Arrays
 *            ultimately terminating with an ConditionalFieldAnswer object
 */
const mapQuestionsToAnswers = ({
  questions,
  screeningVersionId,
  parentId,
}: {
  questions: Array<SerializedQuestion>,
  screeningVersionId: number,
  parentId?: number,
}): any => {
  const completeAnswersArray = questions.map(({ question, children }) => {
    if (children.length) {
      // need to dig until there are no more children
      const mappedChildren = mapQuestionsToAnswers({
        questions: children,
        screeningVersionId,
        parentId: question.id,
      });
      // need to return parent along with children
      return [
        ...mappedChildren,
        {
          question_id: question.id,
          answers: question.answers,
          screening_ruleset_version_id: screeningVersionId,
        },
      ];
    }
    return {
      question_id: question.id,
      answers: question.answers,
      screening_ruleset_version_id: screeningVersionId,
      ...(parentId && { parent_question_id: parentId }),
    };
  });

  return completeAnswersArray;
};

/**
 * Iterates through the Conditions in order to access the questions and screening_ruleset_version_id
 * to pass into mapping function: mapQuestionsToAnswers
 *
 * @param {Array<ConditionWithQuestions>} conditionWithQuestions Array of Conditions which contain questions array
 *
 * @returns a mixed array containing Objects or Arrays;
 *            can be ConditionalFieldAnswer object
 *            or an Array<ConditionalFieldAnswer>
 *            or nested Array of Arrays
 *            ultimately terminating with an ConditionalFieldAnswer object
 */
const getAllConditionsAnswers = ({
  conditionWithQuestions,
}: {
  conditionWithQuestions: Array<ConditionWithQuestions>,
}): Array<mixed> => {
  return (
    conditionWithQuestions?.map(
      ({
        questions,
        screening_ruleset_version_id: screeningVersionId,
      }: {
        questions: Array<SerializedQuestion>,
        screening_ruleset_version_id: number,
      }) => {
        // each set of Questions needs to be mapped recursively
        return mapQuestionsToAnswers({ questions, screeningVersionId });
      }
    ) || []
  );
};

/**
 * Takes in an Array of Conditions w/Questions
 * Questions can be arbitrarily nested
 *
 * returns a simple, flat array
 *
 * @param {IssueOccurrenceRequested} issue issue that contains an array of Conditions which contain questions array
 * @param {boolean} isConditionalFieldsV2Flow if false we are in V1 flow and should return empty array
 *
 * @returns an array of ConditionalFieldAnswer object
 *
 */
const getFlattenedInitialConditionalFieldsAnswers = ({
  issue,
  isConditionalFieldsV2Flow,
}: {
  issue: IssueOccurrenceRequested,
  isConditionalFieldsV2Flow: boolean,
}): Array<ConditionalFieldAnswer> => {
  if (!isConditionalFieldsV2Flow) {
    return [];
  }
  // need to flatten to account for nested children
  const flattenedAnswers = _flattenDeep(
    getAllConditionsAnswers({
      conditionWithQuestions: issue.screening_conditions,
    })
  ).filter(({ answers }) => {
    return answers?.length;
  });

  return flattenedAnswers;
};

const flatMapV2AnswersToRule = (
  results: Array<BasicConditionalFieldAnswer>,
  questions: Array<SerializedQuestion>,
  conditionalFieldsAnswers: Array<ConditionalFieldAnswer>
): Array<BasicConditionalFieldAnswer> => {
  questions.forEach(({ question, children }) => {
    const answersToCurrentQuestion =
      conditionalFieldsAnswers?.find((answer) => {
        return answer.question_id === question.id;
      })?.answers || [];

    // NOTE: In future if question can be optional we would not push it or check its children
    results.push({
      question_id: question.id,
      answers: answersToCurrentQuestion,
    });

    if (children?.length > 0) {
      const triggeredChildQuestions = children
        .filter((child) => {
          return !!answersToCurrentQuestion?.find(
            ({ value }) => value === child.question.trigger_value
          );
        })
        .map((child) => ({
          ...child,
          question: {
            ...child.question,
            parent_question_id: question.id,
          },
        }));
      flatMapV2AnswersToRule(
        results,
        triggeredChildQuestions,
        conditionalFieldsAnswers
      );
    }
  });

  return results;
};

export const flatMapV2AnswersToConditions = (
  issue: IssueOccurrenceRequested
): Array<BasicConditionalFieldAnswer> => {
  const conditionalFieldsAnswers = getFlattenedInitialConditionalFieldsAnswers({
    issue,
    isConditionalFieldsV2Flow: true,
  });

  return (
    issue.conditions_with_questions?.flatMap((rule) => {
      const ruleResults = [];
      return flatMapV2AnswersToRule(
        ruleResults,
        rule.questions,
        conditionalFieldsAnswers
      );
    }) || []
  );
};

const getOnlyRequiredValuesFromQuestionForPayload = (
  question: ActiveQuestion
): NewQuestion => {
  return {
    answer_datatype: question.answer_datatype,
    default_required_for_complete_record:
      question.default_required_for_complete_record,
    question_options: question.question_options,
    question_type: question.question_type,
    question: question.question,
    placement: question.placement,
    csv_header: question.csv_header,
    default_value: question.default_value,
    name: question.name,
    previous_version_of_question_id: question.previous_version_of_question_id,
    training_variable_perma_id: question.training_variable_perma_id,
    trigger_value: question.trigger_value,
  };
};

const transformedQuestionsToPayload = (
  questionsToTransform: Array<ActiveQuestion>
): Array<NewQuestionTree> => {
  return questionsToTransform.map((question) => {
    const children =
      question.children?.length > 0
        ? transformedQuestionsToPayload(question.children)
        : [];
    return {
      question: getOnlyRequiredValuesFromQuestionForPayload(question),
      children,
    };
  });
};

const transformConditionForPayload = (
  conditionToTransform: ActiveCondition
): NewCondition => {
  return {
    location: conditionToTransform.location,
    name: conditionToTransform.name,
    questions: transformedQuestionsToPayload(conditionToTransform.questions),
    predicate: conditionToTransform.predicate,
  };
};

const validateAndFlattenQuestions = (
  questions: Array<NewQuestionTree>
): { flattenedNames: Array<string>, questionsValidations: Array<boolean> } => {
  let flattenedNames = [];
  let questionsValidations = [];

  // Base case === no more questions
  if (!questions.length) {
    return { flattenedNames, questionsValidations };
  }

  questions.forEach(({ question, children }) => {
    let isValid = true;

    if (!question.name || !question.question_type || !question.question) {
      isValid = false;
    }

    // Additional validation needed to ensure option values are unique
    if (question.question_type === 'multiple-choice') {
      if (question.question_options?.length) {
        // using Set for performance - constant lookup and insertion time
        const uniqueOptionValues = new Set();
        question.question_options.forEach((option) => {
          if (option.value && !uniqueOptionValues.has(option.value)) {
            // if the value exists and is unique so far, add it
            uniqueOptionValues.add(option.value);
          } else {
            // if value doesn't exist or is not unique then invalid
            isValid = false;
          }
        });
      } else {
        // if no options for multi-choice then invalid
        isValid = false;
      }
    }

    if (typeof question.name !== 'string') {
      return;
    }
    // push current question name and validation
    flattenedNames.push(question.name);
    questionsValidations.push(isValid);

    // Recursively call to handle children
    if (children?.length) {
      const result = validateAndFlattenQuestions(children);
      flattenedNames = flattenedNames.concat(result?.flattenedNames);
      questionsValidations = questionsValidations.concat(
        result?.questionsValidations
      );
    }
  });

  return { flattenedNames, questionsValidations };
};

const hasDuplicates = (arr: Array<any>): boolean =>
  new Set(arr).size !== arr.length;

const validateData = ({
  data,
}: {
  data: NewCondition,
}): { passedValidation: boolean, flattenedNames: Array<string> } => {
  const { flattenedNames, questionsValidations } = validateAndFlattenQuestions(
    data.questions
  );

  const requiredFields = {
    name: data.name,
    operator: data.predicate?.operator,
    operands: data.predicate?.operands.every(
      (operand) => operand.operator && operand.path && operand.value
    ),
    questions: questionsValidations.every((boolean) => boolean),
  };

  const allRequiredFieldsAreValid = Object.values(requiredFields).every(
    (item) => item
  );
  const allQuestionNamesAreUnique = !hasDuplicates(flattenedNames);

  return {
    passedValidation: allRequiredFieldsAreValid && allQuestionNamesAreUnique,
    flattenedNames,
  };
};

/**
 *
 * @param {string[]} stringArray - The array of strings to search.
 * @param {string} targetString - The string to search for.
 * @returns {boolean} - True if the string appears twice, false otherwise.
 *
 * Determines if a given string appears twice in an array of strings.
 */

const stringAppearsTwice = (
  stringArray: Array<string>,
  targetString: string
): boolean => {
  if (!Array.isArray(stringArray) || typeof targetString !== 'string') {
    throw new Error('Invalid input. Expected array of strings and a string.');
  }
  const APPEARANCE_THRESHOLD = 2;
  let appearanceCount = 0;

  return stringArray.some((str) => {
    if (str === targetString) {
      appearanceCount += 1;
      return appearanceCount === APPEARANCE_THRESHOLD;
    }

    return false;
  });
};

export {
  blankOperandGenerator,
  blankConditionGenerator,
  blankQuestionGenerator,
  isEmptyString,
  transformConditionResponseToClientState,
  predicateOptionsMapToSelect,
  triggerOptionsToSelect,
  operatorOptionsToSelect,
  getRulesetTitle,
  getConditionsContext,
  getFlattenedInitialConditionalFieldsAnswers,
  getAllConditionsAnswers,
  mapQuestionsToAnswers,
  transformConditionForPayload,
  getOnlyRequiredValuesFromQuestionForPayload,
  transformedQuestionsToPayload,
  validateData,
  validateAndFlattenQuestions,
  hasDuplicates,
  stringAppearsTwice,
  createNestedFollowupQuestion,
  updateNestedFollowupQuestion,
  addNestedFollowupQuestionMetadata,
  updateNestedFollowupQuestionMetadata,
  updateNestedFollowupQuestionTrigger,
};
