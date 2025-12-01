import { data as mockIssueData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue';
import { retrieveNestedAnswers } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { mockedConditionsWithAnswers } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue/data.mock';

import { data as MOCK_RESPONSE_VERSION } from '../../services/mocks/data/mock_version';
import { data as MOCK_PREDICATE_OPTIONS } from '../../services/mocks/data/mock_predicate_options_list';
import {
  MOCK_TRANSFORMED_CONDITIONS,
  MOCKED_TRANSFORMED_PREDICATE_OPTIONS,
  MOCK_ACTIVE_PREDICATE_OPERANDS,
  MOCK_TRANSFORMED_TRIGGER_OPTIONS,
  MOCK_TRANSFORMED_OPERATOR_OPTIONS,
  MOCK_ACTIVE_QUESTION,
  MOCK_TRANSFORMED_QUESTION,
  MOCK_ACTIVE_QUESTIONS_ARRAY,
  MOCK_TRANSFORMED_QUESTIONS_ARRAY,
  MOCK_ACTIVE_CONDITION_TO_TRANSFORM,
  MOCK_TRANSFORMED_CONDITION_FOR_PAYLOAD,
  INVALID_QUESTIONS,
  VALID_QUESTIONS,
  DEEP_INVALID_QUESTIONS,
  DEEP_VALID_QUESTIONS,
  MOCK_DATA_FOR_STRING_APPEARS_TWICE,
  MOCK_4_LEVELS_ACTIVE_QUESTIONS_ARRAY,
  MOCK_TRANSFORMED_4_LEVELS_QUESTIONS_ARRAY,
  MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP,
  MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_UPDATE,
  MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA,
  MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA_UPDATE,
} from '../test_utils.mock';

import {
  isEmptyString,
  blankConditionGenerator,
  blankQuestionGenerator,
  transformConditionResponseToClientState,
  predicateOptionsMapToSelect,
  triggerOptionsToSelect,
  operatorOptionsToSelect,
  getConditionsContext,
  mapQuestionsToAnswers,
  getAllConditionsAnswers,
  getFlattenedInitialConditionalFieldsAnswers,
  getOnlyRequiredValuesFromQuestionForPayload,
  transformedQuestionsToPayload,
  transformConditionForPayload,
  validateData,
  validateAndFlattenQuestions,
  hasDuplicates,
  stringAppearsTwice,
  createNestedFollowupQuestion,
  updateNestedFollowupQuestion,
  addNestedFollowupQuestionMetadata,
  updateNestedFollowupQuestionMetadata,
  flatMapV2AnswersToConditions,
} from '..';

describe('isEmptyString', () => {
  it('returns false when passed a string', () => {
    const isNotEmptyString = isEmptyString('A string');

    expect(isNotEmptyString).toBe(false);
  });
  it('returns true when passed empty string', () => {
    const isEmptyStringString = isEmptyString('');

    expect(isEmptyStringString).toBe(true);
  });
  it('returns true when passed null', () => {
    const isNull = isEmptyString(null);

    expect(isNull).toBe(true);
  });
  it('returns true when passed undefined', () => {
    const isUndefined = isEmptyString(undefined);

    expect(isUndefined).toBe(true);
  });
  it('returns true when nothing passed in', () => {
    const isUndefined = isEmptyString();

    expect(isUndefined).toBe(true);
  });
});

describe('blankConditionGenerator', () => {
  it('returns a blank condition with index 0 when no args passed', () => {
    const conditionWithIndexZero = blankConditionGenerator();

    expect(conditionWithIndexZero.index).toBe(0);
    expect(conditionWithIndexZero.order).toBe(1);
  });
  it('returns a blank condition with correct index and order', () => {
    const conditionWithPositiveIndex = blankConditionGenerator(23);

    expect(conditionWithPositiveIndex.index).toBe(23);
    expect(conditionWithPositiveIndex.order).toBe(24);
  });
});
describe('blankQuestionGenerator', () => {
  it('returns a blank question with order passed in', () => {
    const conditionWithIndexZero = blankQuestionGenerator(12, '1.1');

    expect(conditionWithIndexZero.order).toBe(12);
  });
});
describe('transformConditionResponseToClientState', () => {
  const MOCK_RESPONSE_CONDITIONS = MOCK_RESPONSE_VERSION.conditions;

  it('returns an array of client-side conditions', () => {
    const activeCondition = transformConditionResponseToClientState(
      MOCK_RESPONSE_CONDITIONS
    );

    expect(activeCondition).toEqual(MOCK_TRANSFORMED_CONDITIONS);
  });
});
describe('predicateOptionsMapToSelect', () => {
  const MOCK_PREDICATE_OPTIONS_FROM_RESPONSE =
    MOCK_PREDICATE_OPTIONS.predicate_options;

  it('returns an array of predicate options suitable for <Select/>', () => {
    const transformedPredicateOptions = predicateOptionsMapToSelect(
      MOCK_PREDICATE_OPTIONS_FROM_RESPONSE.slice(0, 3) // only taking first 4 or else mock data would be HUGE
    );

    expect(transformedPredicateOptions).toEqual(
      MOCKED_TRANSFORMED_PREDICATE_OPTIONS
    );
  });
});
describe('triggerOptionsToSelect', () => {
  it('returns an array of trigger options suitable for <Select/>', () => {
    const transformedTriggerOptions = triggerOptionsToSelect(
      MOCKED_TRANSFORMED_PREDICATE_OPTIONS,
      MOCK_ACTIVE_PREDICATE_OPERANDS
    );

    expect(transformedTriggerOptions).toEqual(MOCK_TRANSFORMED_TRIGGER_OPTIONS);
  });
});
describe('operatorOptionsToSelect', () => {
  it('returns a blank question with order passed in', () => {
    const transformedOperatorOptions = operatorOptionsToSelect(
      MOCKED_TRANSFORMED_PREDICATE_OPTIONS,
      MOCK_ACTIVE_PREDICATE_OPERANDS
    );

    expect(transformedOperatorOptions).toEqual(
      MOCK_TRANSFORMED_OPERATOR_OPTIONS
    );
  });
});

describe('getConditionsContext', () => {
  it('returns context even when coding param does not exist', () => {
    const { issue } = mockIssueData;
    const getConditionsContextResult = getConditionsContext(issue);

    expect(getConditionsContextResult).toStrictEqual({
      athlete_id: 15642,
      activity_group_id: null,
      activity_id: 9,
      clinical_impression_code: null,
      event_type_id: 'game',
      illness_onset_id: null,
      issue_class_name: null,
      issue_type_name: '',
      occurrence_date: '2022-01-13T00:00:00+00:00',
      osics_body_area_id: 20,
      osics_classification_id: 9,
      osics_pathology_id: 1394,
      other_event_value: null,
      pathology_codes: [],
      published_before: '2022-02-10T15:42:39+00:00',
      reported_date: '2022-02-09T00:00:00+00:00',
    });
  });
  it('returns parsed osics issue when expected', () => {
    const { issue } = mockIssueData;

    const getConditionsContextResult = getConditionsContext({
      ...issue,
      coding: {},
    });

    expect(getConditionsContextResult).toStrictEqual({
      athlete_id: 15642,
      activity_group_id: null,
      activity_id: 9,
      clinical_impression_code: null,
      event_type_id: 'game',
      illness_onset_id: null,
      issue_class_name: null,
      issue_type_name: '',
      occurrence_date: '2022-01-13T00:00:00+00:00',
      osics_body_area_id: 20,
      osics_classification_id: 9,
      osics_pathology_id: 1394,
      other_event_value: null,
      pathology_codes: [],
      published_before: '2022-02-10T15:42:39+00:00',
      reported_date: '2022-02-09T00:00:00+00:00',
    });
  });
  describe('[FEATURE FLAG] - multi coding system', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = true;
    });

    afterEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('returns null when coding object missing', () => {
      const { issue } = mockIssueData;
      const getConditionsContextResult = getConditionsContext(issue);

      expect(getConditionsContextResult).toBe(null);
    });
    it('returns parsed osics issue when expected', () => {
      const { issue } = mockIssueData;

      const getConditionsContextResult = getConditionsContext({
        ...issue,
        coding: {},
      });

      expect(getConditionsContextResult).toStrictEqual({
        athlete_id: 15642,
        activity_group_id: null,
        activity_id: 9,
        clinical_impression_code: undefined,
        event_type_id: 'game',
        illness_onset_id: null,
        issue_type_name: '',
        issue_class_name: null,
        occurrence_date: '2022-01-13T00:00:00+00:00',
        osics_body_area_id: null,
        osics_classification_id: null,
        osics_pathology_id: null,
        other_event_value: null,
        pathology_codes: [],
        published_before: '2022-02-10T15:42:39+00:00',
        reported_date: '2022-02-09T00:00:00+00:00',
      });
    });

    it('returns parsed ICD issue when expected', () => {
      const { issueWithICD } = mockIssueData;

      const getConditionsContextResult = getConditionsContext(issueWithICD);

      expect(getConditionsContextResult).toStrictEqual({
        athlete_id: 15642,
        activity_group_id: null,
        activity_id: 9,
        clinical_impression_code: undefined,
        event_type_id: 'game',
        illness_onset_id: null,
        issue_type_name: '',
        issue_class_name: null,
        occurrence_date: '2022-01-13T00:00:00+00:00',
        osics_body_area_id: null,
        osics_classification_id: null,
        osics_pathology_id: null,
        other_event_value: null,
        pathology_codes: ['S92'],
        published_before: '2022-02-10T15:42:39+00:00',
        reported_date: '2022-02-09T00:00:00+00:00',
      });
    });
    it('returns parsed CI issue when expected', () => {
      const { issueWithClinicalImpressions } = mockIssueData;

      const getConditionsContextResult = getConditionsContext(
        issueWithClinicalImpressions
      );

      expect(getConditionsContextResult).toStrictEqual({
        athlete_id: 15642,
        activity_group_id: null,
        activity_id: 9,
        clinical_impression_code: 'S92',
        event_type_id: 'game',
        illness_onset_id: null,
        issue_type_name: '',
        issue_class_name: null,
        occurrence_date: '2022-01-13T00:00:00+00:00',
        osics_body_area_id: null,
        osics_classification_id: null,
        osics_pathology_id: null,
        other_event_value: null,
        pathology_codes: ['S92'],
        published_before: '2022-02-10T15:42:39+00:00',
        reported_date: '2022-02-09T00:00:00+00:00',
      });
    });

    it('returns parsed DATALYS issue when expected', () => {
      const { issueWithDATALYS } = mockIssueData;

      const getConditionsContextResult = getConditionsContext(issueWithDATALYS);

      expect(getConditionsContextResult).toStrictEqual({
        athlete_id: 15642,
        activity_group_id: null,
        activity_id: 9,
        clinical_impression_code: undefined,
        event_type_id: 'game',
        illness_onset_id: null,
        issue_type_name: '',
        issue_class_name: null,
        occurrence_date: '2022-01-13T00:00:00+00:00',
        osics_body_area_id: null,
        osics_classification_id: null,
        osics_pathology_id: null,
        other_event_value: null,
        pathology_codes: ['S92'],
        published_before: '2022-02-10T15:42:39+00:00',
        reported_date: '2022-02-09T00:00:00+00:00',
      });
    });
  });
});
describe('getFlattenedInitialConditionalFieldsAnswers & helpers', () => {
  describe('mapQuestionsToAnswers', () => {
    it('retrieves all questions even if value is undefined', () => {
      // Created a CONST by manually counting the answered questions
      // in mockedConditionsWithAnswers[2].questions in order to
      // avoid writing second recursive function (which would need test?)
      // to filter for questions with answers
      // wrote this CONST so that there are no "magic values"
      const COUNT_OF_QUESTIONS_WITH_ANSWERS_IN_MOCKED_DATA = 3;

      const allQuestionsFlattened = mockedConditionsWithAnswers[2].questions;

      // flatten the answers and filtered for the ones answered
      const mappedQuestionsToAnswers = mapQuestionsToAnswers({
        questions: allQuestionsFlattened,
        screeningVersionId: 666,
      })
        .flat(Infinity)
        .filter(({ answers }) => answers?.length);

      expect(mappedQuestionsToAnswers.length).toStrictEqual(
        COUNT_OF_QUESTIONS_WITH_ANSWERS_IN_MOCKED_DATA
      );
    });

    it('retrieves deeply nested child value', () => {
      const questionsWithDeeplyNestedValues =
        mockedConditionsWithAnswers[2].questions;

      const mappedQuestionsToAnswers = mapQuestionsToAnswers({
        questions: questionsWithDeeplyNestedValues,
        screeningVersionId: 666,
      });
      const deeplyNestedObject = retrieveNestedAnswers(
        mappedQuestionsToAnswers.flat(Infinity)
      );

      expect(deeplyNestedObject.answers[0].value).toStrictEqual(
        'Deeply nested followup answer'
      );
    });
  });

  describe('getAllConditionsAnswers', () => {
    it('retrieves all questions even if value is undefined', () => {
      // accounting for ALL questions in ALL mocked data
      // wrote this CONST so that there are no "magic values"
      const COUNT_OF_QUESTIONS_WITH_AND_WITHOUT_ANSWERS_IN_MOCKED_DATA = 8;

      // flatten the answers in order to get a count
      const mappedQuestionsToAnswers = getAllConditionsAnswers({
        conditionWithQuestions: mockedConditionsWithAnswers,
      }).flat(Infinity);

      expect(mappedQuestionsToAnswers.length).toStrictEqual(
        COUNT_OF_QUESTIONS_WITH_AND_WITHOUT_ANSWERS_IN_MOCKED_DATA
      );
    });

    it('retrieves deeply nested child value', () => {
      // flatten the answers and filtered for the ones answered
      const mappedQuestionsToAnswers = getAllConditionsAnswers({
        conditionWithQuestions: mockedConditionsWithAnswers,
      });

      // flatten answers to easier find the deeply nested answer
      const deeplyNestedObject = retrieveNestedAnswers(
        mappedQuestionsToAnswers.flat(Infinity)
      );

      expect(deeplyNestedObject.answers[0].value).toStrictEqual(
        'Deeply nested followup answer'
      );
    });
  });

  describe('getFlattenedInitialConditionalFieldsAnswers', () => {
    const { issue } = mockIssueData;

    it('retrieves ONLY answered questions', () => {
      // accounting for ONLY answered questions in ALL mocked data
      // wrote this CONST so that there are no "magic values"
      const COUNT_OF_QUESTIONS_WITH_ANSWERS_IN_MOCKED_DATA = 6;

      // flatten the answers and filtered for the ones answered
      const mappedQuestionsToAnswers =
        getFlattenedInitialConditionalFieldsAnswers({
          issue,
          isConditionalFieldsV2Flow: true,
        });

      expect(mappedQuestionsToAnswers.length).toStrictEqual(
        COUNT_OF_QUESTIONS_WITH_ANSWERS_IN_MOCKED_DATA
      );
    });

    it('retrieves deeply nested child value', () => {
      // flatten the answers and filtered for the ones answered
      const mappedQuestionsToAnswers =
        getFlattenedInitialConditionalFieldsAnswers({
          issue,
          isConditionalFieldsV2Flow: true,
        });

      // don't need to flatten to find deeply nested object
      const deeplyNestedObject = retrieveNestedAnswers(
        mappedQuestionsToAnswers.flat(Infinity)
      );
      expect(deeplyNestedObject.answers[0].value).toStrictEqual(
        'Deeply nested followup answer'
      );
    });
  });
});

describe('transformConditionForPayload & helpers', () => {
  describe('getOnlyRequiredValuesFromQuestionForPayload', () => {
    it('returns only required Questions params', () => {
      expect(
        getOnlyRequiredValuesFromQuestionForPayload(MOCK_ACTIVE_QUESTION)
      ).toStrictEqual(MOCK_TRANSFORMED_QUESTION);
    });
  });

  describe('transformedQuestionsToPayload', () => {
    it('transforms questions to contain question and children properties', () => {
      expect(
        transformedQuestionsToPayload(MOCK_ACTIVE_QUESTIONS_ARRAY)
      ).toStrictEqual(MOCK_TRANSFORMED_QUESTIONS_ARRAY);
    });
    it('transforms questions with children up to 4 levels deep', () => {
      expect(
        transformedQuestionsToPayload(MOCK_4_LEVELS_ACTIVE_QUESTIONS_ARRAY)
      ).toStrictEqual(MOCK_TRANSFORMED_4_LEVELS_QUESTIONS_ARRAY);
    });
  });

  describe('transformConditionForPayload', () => {
    it('Transforms an ActiveCondition to usable payload', () => {
      expect(
        transformConditionForPayload(MOCK_ACTIVE_CONDITION_TO_TRANSFORM)
      ).toStrictEqual(MOCK_TRANSFORMED_CONDITION_FOR_PAYLOAD);
    });
  });
});

describe('hasDuplicates', () => {
  it('should return true if array has duplicates', () => {
    const arrayWithDuplicates = [1, 2, 3, 4, 4];
    expect(hasDuplicates(arrayWithDuplicates)).toBe(true);
  });

  it('should return false if array does not have duplicates', () => {
    const arrayWithoutDuplicates = [1, 2, 3, 4, 5];
    expect(hasDuplicates(arrayWithoutDuplicates)).toBe(false);
  });

  it('should handle empty arrays', () => {
    const emptyArray = [];
    expect(hasDuplicates(emptyArray)).toBe(false);
  });

  it('should handle arrays with one element', () => {
    const arrayWithOneElement = [1];
    expect(hasDuplicates(arrayWithOneElement)).toBe(false);
  });

  it('should handle arrays with multiple types of elements', () => {
    const arrayWithMultipleTypes = [
      1,
      'two',
      { three: 3 },
      { three: 3 },
      'two',
      1,
    ];
    expect(hasDuplicates(arrayWithMultipleTypes)).toBe(true);
  });
});

describe('flatMapV2AnswersToConditions', () => {
  const { issue } = mockIssueData;

  it('returns a flattened array of answers for each mandatory question', () => {
    const COUNT_OF_QUESTIONS_PRESENTED_IN_MOCKED_DATA = 7;

    const mappedQuestionsToAnswers = flatMapV2AnswersToConditions(issue);

    expect(mappedQuestionsToAnswers.length).toStrictEqual(
      COUNT_OF_QUESTIONS_PRESENTED_IN_MOCKED_DATA
    );

    [225, 226, 228, 210, 212, 211].forEach((questionId, index) => {
      expect(mappedQuestionsToAnswers[index].question_id).toEqual(questionId);
      expect(mappedQuestionsToAnswers[index].answers).toHaveLength(1);
    });

    // Last question has no answer value, and its child question will not be asked
    expect(mappedQuestionsToAnswers[6].question_id).toEqual(405);
    expect(mappedQuestionsToAnswers[6].answers).toHaveLength(0);
  });
});

describe('validateAndFlattenQuestions', () => {
  it('should return empty arrays for empty questions', () => {
    const { flattenedNames, questionsValidations } =
      validateAndFlattenQuestions([]);
    expect(flattenedNames).toHaveLength(0);
    expect(questionsValidations).toHaveLength(0);
  });

  it('should correctly flatten and validate questions', () => {
    const questions = [
      {
        question: { name: 'q1', question_type: 'text', question: 'Question 1' },
        children: [
          {
            question: {
              name: 'q2',
              question_type: 'multiple-choice',
              question: 'Question 2',
              question_options: [{ value: 'a' }, { value: 'b' }],
            },
            children: [],
          },
          {
            question: {
              name: 'q3',
              question_type: 'multiple-choice',
              question: 'Question 3',
              question_options: [{ value: 'a' }, { value: 'b' }],
            },
            children: [],
          },
        ],
      },
    ];

    const { flattenedNames, questionsValidations } =
      validateAndFlattenQuestions(questions);

    expect(flattenedNames).toEqual(['q1', 'q2', 'q3']);
    expect(questionsValidations).toEqual([true, true, true]);
  });

  it('should handle invalid questions', () => {
    const questions = [
      {
        question: { name: 'q1', question_type: 'text', question: 'Question 1' },
        children: [
          {
            question: {
              name: 'q2',
              question_type: 'multiple-choice',
              question: 'Question 2',
              question_options: [{ value: 'a' }, { value: 'a' }],
            },
            children: [],
          },
        ],
      },
    ];

    const { flattenedNames, questionsValidations } =
      validateAndFlattenQuestions(questions);

    expect(flattenedNames).toEqual(['q1', 'q2']);
    expect(questionsValidations).toEqual([true, false]);
  });
  it('should correctly flatten and validate questions with 2 levels deep children', () => {
    const questions = [
      {
        question: { name: 'q1', question_type: 'text', question: 'Question 1' },
        children: [
          {
            question: {
              name: 'q2',
              question_type: 'multiple-choice',
              question: 'Question 2',
              question_options: [{ value: 'a' }, { value: 'b' }],
            },
            children: [
              {
                question: {
                  name: 'q4',
                  question_type: 'multiple-choice',
                  question: 'Question 4',
                  question_options: [{ value: 'a' }, { value: 'b' }],
                },
                children: [],
              },
            ],
          },
          {
            question: {
              name: 'q3',
              question_type: 'multiple-choice',
              question: 'Question 3',
              question_options: [{ value: 'a' }, { value: 'b' }],
            },
            children: [],
          },
        ],
      },
    ];

    const { flattenedNames, questionsValidations } =
      validateAndFlattenQuestions(questions);

    expect(flattenedNames).toEqual(['q1', 'q2', 'q4', 'q3']);
    expect(questionsValidations).toEqual([true, true, true, true]);
  });

  it('should correctly flatten and validate questions with 3 levels deep children', () => {
    const questions = [
      {
        question: { name: 'q1', question_type: 'text', question: 'Question 1' },
        children: [
          {
            question: {
              name: 'q2',
              question_type: 'multiple-choice',
              question: 'Question 2',
              question_options: [{ value: 'a' }, { value: 'b' }],
            },
            children: [
              {
                question: {
                  name: 'q3',
                  question_type: 'multiple-choice',
                  question: 'Question 3',
                  question_options: [{ value: 'a' }, { value: 'b' }],
                },
                children: [
                  {
                    question: {
                      name: 'q4',
                      question_type: 'multiple-choice',
                      question: 'Question 4',
                      question_options: [{ value: 'a' }, { value: 'b' }],
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const { flattenedNames, questionsValidations } =
      validateAndFlattenQuestions(questions);

    expect(flattenedNames).toEqual(['q1', 'q2', 'q3', 'q4']);
    expect(questionsValidations).toEqual([true, true, true, true]);
  });

  it('should correctly flatten and validate questions with 4 levels deep children', () => {
    const questions = [
      {
        question: { name: 'q1', question_type: 'text', question: 'Question 1' },
        children: [
          {
            question: {
              name: 'q2',
              question_type: 'multiple-choice',
              question: 'Question 2',
              question_options: [{ value: 'a' }, { value: 'b' }],
            },
            children: [
              {
                question: {
                  name: 'q3',
                  question_type: 'multiple-choice',
                  question: 'Question 3',
                  question_options: [{ value: 'a' }, { value: 'b' }],
                },
                children: [
                  {
                    question: {
                      name: 'q4',
                      question_type: 'multiple-choice',
                      question: 'Question 4',
                      question_options: [{ value: 'a' }, { value: 'b' }],
                    },
                    children: [
                      {
                        question: {
                          name: 'q5',
                          question_type: 'multiple-choice',
                          question: 'Question 5',
                          question_options: [{ value: 'a' }, { value: 'b' }],
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const { flattenedNames, questionsValidations } =
      validateAndFlattenQuestions(questions);

    expect(flattenedNames).toEqual(['q1', 'q2', 'q3', 'q4', 'q5']);
    expect(questionsValidations).toEqual([true, true, true, true, true]);
  });
});

describe('validateData', () => {
  it('should return true when all data is valid', () => {
    const { passedValidation } = validateData({
      data: {
        location: 'some location',
        name: 'some name',
        predicate: {
          operator: 'some operator',
          operands: [
            {
              operator: 'some operator',
              path: 'some path',
              value: 'some value',
            },
          ],
        },
        questions: VALID_QUESTIONS,
      },
    });

    expect(passedValidation).toBe(true);
  });

  it('should return false when data is invalid', () => {
    const { passedValidation } = validateData({
      data: {
        location: 'some location',
        name: 'some name',
        predicate: {
          operator: 'some operator',
          operands: [
            {
              operator: 'some operator',
              path: 'some path',
              value: 'some value',
            },
          ],
        },
        questions: INVALID_QUESTIONS,
      },
    });

    expect(passedValidation).toBe(false);
  });
  it('should return true when all data is valid with 2 levels deep children', () => {
    const { passedValidation } = validateData({
      data: {
        location: 'some location',
        name: 'some name',
        predicate: {
          operator: 'some operator',
          operands: [
            {
              operator: 'some operator',
              path: 'some path',
              value: 'some value',
            },
          ],
        },
        questions: VALID_QUESTIONS,
      },
    });

    expect(passedValidation).toBe(true);
  });
  it('should return true when data is valid with 3 levels deep children', () => {
    const { passedValidation } = validateData({
      data: {
        location: 'some location',
        name: 'some name',
        predicate: {
          operator: 'some operator',
          operands: [
            {
              operator: 'some operator',
              path: 'some path',
              value: 'some value',
            },
          ],
        },
        questions: DEEP_VALID_QUESTIONS,
      },
    });

    expect(passedValidation).toBe(true);
  });

  it('should return true when data is valid with 4 levels deep children', () => {
    const { passedValidation } = validateData({
      data: {
        location: 'some location',
        name: 'some name',
        predicate: {
          operator: 'some operator',
          operands: [
            {
              operator: 'some operator',
              path: 'some path',
              value: 'some value',
            },
          ],
        },
        questions: DEEP_VALID_QUESTIONS,
      },
    });

    expect(passedValidation).toBe(true);
  });
  it('should return false when data is invalid with 3 levels deep children', () => {
    const { passedValidation } = validateData({
      data: {
        location: 'some location',
        name: 'some name',
        predicate: {
          operator: 'some operator',
          operands: [
            {
              operator: 'some operator',
              path: 'some path',
              value: 'some value',
            },
          ],
        },
        questions: INVALID_QUESTIONS,
      },
    });

    expect(passedValidation).toBe(false);
  });

  it('should return false when data is invalid with 4 levels deep children', () => {
    const { passedValidation } = validateData({
      data: {
        location: 'some location',
        name: 'some name',
        predicate: {
          operator: 'some operator',
          operands: [
            {
              operator: 'some operator',
              path: 'some path',
              value: 'some value',
            },
          ],
        },
        questions: DEEP_INVALID_QUESTIONS,
      },
    });

    expect(passedValidation).toBe(false);
  });
});

describe('stringAppearsTwice', () => {
  it('should return true if the string appears twice in the array', () => {
    expect(
      stringAppearsTwice(
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.ARRAY_WITH_TWO_OCCURRENCES,
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.TARGET_STRING
      )
    ).toBe(true);
  });
  it('should return false if the string appears less than twice in the array', () => {
    expect(
      stringAppearsTwice(
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.ARRAY_WITH_ONE_OCCURRENCE,
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.TARGET_STRING
      )
    ).toBe(false);
  });
  it('should return false if the string does not appear in the array', () => {
    expect(
      stringAppearsTwice(
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.ARRAY_WITHOUT_OCCURRENCE,
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.TARGET_STRING
      )
    ).toBe(false);
  });
  it('should handle empty array', () => {
    expect(
      stringAppearsTwice(
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.EMPTY_ARRAY,
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.TARGET_STRING
      )
    ).toBe(false);
  });
  it('should handle non-string inputs', () => {
    expect(() =>
      stringAppearsTwice(
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.ARRAY_WITH_TWO_OCCURRENCES,
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.NON_STRING_INPUT
      )
    ).toThrow();
  });
});

describe('createNestedFollowupQuestion', () => {
  it('should create nested followup questions, followup second level', () => {
    expect(
      createNestedFollowupQuestion(MOCK_ACTIVE_QUESTIONS_ARRAY, '1.1')
    ).toEqual(MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP);
  });
});

describe('updateNestedFollowupQuestion', () => {
  it('should update nested followup, questions followup second level', () => {
    expect(
      updateNestedFollowupQuestion(
        MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP,
        '1.1.1',
        'name',
        'new name'
      )
    ).toEqual(MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_UPDATE);
  });
});

describe('addNestedFollowupQuestionMetadata', () => {
  it('should add nested followup metadata, questions followup second level', () => {
    expect(
      addNestedFollowupQuestionMetadata(
        MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP,
        '1.1.1'
      )
    ).toEqual(MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA);
  });
});

describe('updateNestedFollowupQuestionMetadata', () => {
  it('should update nested followup metadata, questions followup second level', () => {
    expect(
      updateNestedFollowupQuestionMetadata(
        MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA,
        '1.1.1',
        1,
        'new option'
      )
    ).toEqual(MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA_UPDATE);
  });
});
