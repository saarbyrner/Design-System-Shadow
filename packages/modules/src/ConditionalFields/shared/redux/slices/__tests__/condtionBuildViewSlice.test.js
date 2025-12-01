import conditionBuildViewSlice, {
  onSetActiveCondition,
  onAddCondition,
  onSetAllConditions,
  onResetFormState,
  onUpdateActiveCondition,
  onUpdateActiveConditionQuestions,
  onUpdateQuestionMetaData,
  onAddQuestionMetaData,
  onAddQuestion,
  onUpdateActivePredicate,
  onSetRequestStatus,
  onAddOperand,
  onDeleteOperand,
  onUpdatePredicateOperator,
  onAddFollowupQuestion,
  onUpdateFollowupQuestion,
  onAddFollowupQuestionMetaData,
  onUpdateFollowupQuestionMetaData,
  onUpdateFollowupTrigger,
  onSetValidationStatus,
  onSetFlattenedNames,
} from '../conditionBuildViewSlice';
import {
  blankConditionGenerator,
  blankQuestionGenerator,
} from '../../../utils';
import {
  MOCK_ACTIVE_CONDITION,
  MOCK_CONDITIONS,
  MOCK_DATA_FOR_STRING_APPEARS_TWICE,
} from '../../../utils/test_utils.mock';

const initialState = {
  activeCondition: {},
  allConditions: [],
  requestStatus: 'SUCCESS',
  validationStatus: 'DORMANT',
  flattenedNames: [],
};

const initialStateWithActiveCondition = {
  activeCondition: MOCK_ACTIVE_CONDITION,
  allConditions: [MOCK_ACTIVE_CONDITION],
  requestStatus: 'SUCCESS',
  validationStatus: 'DORMANT',
  flattenedNames: [],
};

describe('[conditionBuildViewSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(conditionBuildViewSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly setActiveCondition', () => {
    const action = onSetActiveCondition({
      activeCondition: MOCK_ACTIVE_CONDITION,
    });
    const expectedState = {
      ...initialState,
      activeCondition: MOCK_ACTIVE_CONDITION,
    };

    expect(conditionBuildViewSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly set all conditions', () => {
    const action = onSetAllConditions({
      conditions: MOCK_CONDITIONS,
    });
    const expectedState = {
      ...initialState,
      allConditions: MOCK_CONDITIONS,
    };

    expect(conditionBuildViewSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly add a condition to allConditions state', () => {
    // add some conditions
    const preloadStateWithConditionsAction = onSetAllConditions({
      conditions: MOCK_CONDITIONS,
    });

    const updatedState = conditionBuildViewSlice.reducer(
      initialState,
      preloadStateWithConditionsAction
    );

    // add a new condition
    const action = onAddCondition();

    const expectedState = {
      ...initialState,
      allConditions: [
        ...MOCK_CONDITIONS,
        blankConditionGenerator(MOCK_CONDITIONS.length),
      ],
    };

    expect(conditionBuildViewSlice.reducer(updatedState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset state to initialState', () => {
    // add some conditions
    const preloadStateWithConditionsAction = onSetAllConditions({
      conditions: MOCK_CONDITIONS,
    });

    const updatedState = conditionBuildViewSlice.reducer(
      initialState,
      preloadStateWithConditionsAction
    );

    // add an active condition
    const preloadStateWithActiveConditionAction = onSetActiveCondition({
      activeCondition: MOCK_ACTIVE_CONDITION,
    });

    const updatedStateAgain = conditionBuildViewSlice.reducer(
      updatedState,
      preloadStateWithActiveConditionAction
    );

    // add a new condition
    const preloadWithNewConditionAction = onAddCondition();

    const expectedStateBeforeReset = {
      ...initialState,
      activeCondition: MOCK_ACTIVE_CONDITION,
      allConditions: [
        ...MOCK_CONDITIONS,
        blankConditionGenerator(MOCK_CONDITIONS.length),
      ],
    };

    expect(
      conditionBuildViewSlice.reducer(
        updatedStateAgain,
        preloadWithNewConditionAction
      )
    ).toEqual(expectedStateBeforeReset);

    // reset to initial state
    const action = onResetFormState();
    expect(
      conditionBuildViewSlice.reducer(expectedStateBeforeReset, action)
    ).toEqual(initialState);
  });
  it('should correctly update activeCondition', () => {
    const action = onUpdateActiveCondition({
      key: 'name',
      value: 'new condition name',
    });

    const expectedState = {
      ...initialStateWithActiveCondition,
      activeCondition: { ...MOCK_ACTIVE_CONDITION, name: 'new condition name' },
    };

    expect(
      conditionBuildViewSlice.reducer(initialStateWithActiveCondition, action)
    ).toEqual(expectedState);
  });
  it('should correctly update activeCondition questions', () => {
    const action = onUpdateActiveConditionQuestions({
      key: 'name',
      value: 'new question name',
      index: 0,
    });

    const expectedState = {
      ...initialStateWithActiveCondition,
      activeCondition: {
        ...MOCK_ACTIVE_CONDITION,
        questions: [
          {
            ...MOCK_ACTIVE_CONDITION.questions[0],
            name: 'new question name',
          },
        ],
      },
    };

    expect(
      conditionBuildViewSlice.reducer(initialStateWithActiveCondition, action)
    ).toEqual(expectedState);
  });
  it('should correctly update question metaData', () => {
    const orderToUpdate = 2;
    const action = onUpdateQuestionMetaData({
      index: 0,
      value: 'new option value',
      order: orderToUpdate,
    });

    const copyOfQuestionOptions =
      MOCK_ACTIVE_CONDITION.questions[0].question_options.slice();
    copyOfQuestionOptions[orderToUpdate - 1] = {
      order: orderToUpdate,
      value: 'new option value',
    };

    const expectedState = {
      ...initialStateWithActiveCondition,
      activeCondition: {
        ...MOCK_ACTIVE_CONDITION,
        questions: [
          {
            ...MOCK_ACTIVE_CONDITION.questions[0],
            question_options: copyOfQuestionOptions,
          },
        ],
      },
    };

    expect(
      conditionBuildViewSlice.reducer(initialStateWithActiveCondition, action)
    ).toEqual(expectedState);
  });
  it('should correctly add an option to question metaData', () => {
    const INDEX = 0;

    const initialLengthOfQuestionMetaDataOptions =
      initialStateWithActiveCondition.activeCondition.questions[INDEX]
        .question_options.length;

    const action = onAddQuestionMetaData({ index: INDEX });

    const endState = conditionBuildViewSlice.reducer(
      initialStateWithActiveCondition,
      action
    );

    const endStateLengthOfMetaDataOptions =
      endState.activeCondition.questions[INDEX].question_options.length;

    expect(endStateLengthOfMetaDataOptions).toEqual(
      initialLengthOfQuestionMetaDataOptions + 1
    );
  });

  it('should correctly add a question to condition', () => {
    const initialLengthOfQuestionMetaDataOptions =
      initialStateWithActiveCondition.activeCondition.questions.length;

    const action = onAddQuestion();

    const endState = conditionBuildViewSlice.reducer(
      initialStateWithActiveCondition,
      action
    );

    const endStateLengthOfMetaDataOptions =
      endState.activeCondition.questions.length;

    expect(endStateLengthOfMetaDataOptions).toEqual(
      initialLengthOfQuestionMetaDataOptions + 1
    );
  });
  it('should correctly set requestStatus', () => {
    const action = onSetRequestStatus({
      requestStatus: 'ERROR',
    });
    const expectedState = {
      ...initialStateWithActiveCondition,
      requestStatus: 'ERROR',
    };

    expect(
      conditionBuildViewSlice.reducer(initialStateWithActiveCondition, action)
    ).toEqual(expectedState);
  });

  it('should correctly set predicate values', () => {
    const INDEX = 0;
    const action = onUpdateActivePredicate({
      value: 'eq',
      key: 'operator',
      index: INDEX,
    });

    const expectedState = {
      ...initialStateWithActiveCondition,
      activeCondition: {
        ...MOCK_ACTIVE_CONDITION,
        predicate: {
          ...MOCK_ACTIVE_CONDITION.predicate,
          operands: [
            {
              ...MOCK_ACTIVE_CONDITION.predicate.operands[INDEX],
              operator: 'eq',
            },
          ],
        },
      },
    };

    expect(
      conditionBuildViewSlice.reducer(initialStateWithActiveCondition, action)
    ).toEqual(expectedState);
  });
  it('should correctly add an operand to predicate', () => {
    const initialLengthOfOperands =
      initialStateWithActiveCondition.activeCondition.predicate.operands.length;

    const action = onAddOperand();

    const endState = conditionBuildViewSlice.reducer(
      initialStateWithActiveCondition,
      action
    );

    const endStateLengthOfOperands =
      endState.activeCondition.predicate.operands.length;

    expect(endStateLengthOfOperands).toEqual(initialLengthOfOperands + 1);
  });

  it('should correctly deletes an operand from predicate', () => {
    const multiOperandsCondition = {
      ...MOCK_ACTIVE_CONDITION,
      predicate: {
        operator: 'and',
        operands: [
          {
            operator: null,
            path: '',
            value: 'string',
          },
          {
            operator: null,
            path: '',
            value: 'string',
          },
        ],
      },
    };
    const initialStateWithMultiOperands = {
      activeCondition: multiOperandsCondition,
      allConditions: [multiOperandsCondition],
      requestStatus: 'SUCCESS',
    };

    const initialLengthOfOperands =
      initialStateWithMultiOperands.activeCondition.predicate.operands.length;

    const action = onDeleteOperand({ index: 1 });

    const endState = conditionBuildViewSlice.reducer(
      initialStateWithMultiOperands,
      action
    );

    const endStateLengthOfOperands =
      endState.activeCondition.predicate.operands.length;

    expect(endStateLengthOfOperands).toEqual(initialLengthOfOperands - 1);
  });
  it('should correctly set predicate operator', () => {
    const action = onUpdatePredicateOperator({
      value: 'or',
    });

    const expectedState = {
      ...initialStateWithActiveCondition,
      activeCondition: {
        ...MOCK_ACTIVE_CONDITION,
        predicate: {
          ...MOCK_ACTIVE_CONDITION.predicate,
          operator: 'or',
        },
      },
    };

    expect(
      conditionBuildViewSlice.reducer(initialStateWithActiveCondition, action)
    ).toEqual(expectedState);
  });
  it('should correctly add a followup question to root question', () => {
    const action = onAddFollowupQuestion({ questionNumbering: '1' });

    const expectedState = {
      ...initialStateWithActiveCondition,
      activeCondition: {
        ...MOCK_ACTIVE_CONDITION,
        questions: [
          {
            ...MOCK_ACTIVE_CONDITION.questions[0],
            children: [...[blankQuestionGenerator(1, '1.1')]],
          },
        ],
      },
    };

    expect(
      conditionBuildViewSlice.reducer(initialStateWithActiveCondition, action)
    ).toEqual(expectedState);
  });
  it('should correctly set followup question values', () => {
    const onAddFollowupQuestionAction = onAddFollowupQuestion({
      questionNumbering: '1',
    });
    const stateWithFollowupQuestion = conditionBuildViewSlice.reducer(
      initialStateWithActiveCondition,
      onAddFollowupQuestionAction
    );
    const action = onUpdateFollowupQuestion({
      questionNumbering: '1.1',
      value: 'free_text',
      key: 'question_type',
    });

    const expectedState = {
      ...stateWithFollowupQuestion,
      activeCondition: {
        ...stateWithFollowupQuestion.activeCondition,
        questions: [
          {
            ...stateWithFollowupQuestion.activeCondition.questions[0],
            children: [
              {
                ...stateWithFollowupQuestion.activeCondition.questions[0]
                  .children[0],
                question_type: 'free_text',
              },
            ],
          },
        ],
      },
    };

    expect(
      conditionBuildViewSlice.reducer(stateWithFollowupQuestion, action)
    ).toEqual(expectedState);
  });
  it('should correctly set followup trigger value', () => {
    const onAddFollowupQuestionAction = onAddFollowupQuestion({
      questionNumbering: '1',
    });

    const stateWithFollowupQuestion = conditionBuildViewSlice.reducer(
      initialStateWithActiveCondition,
      onAddFollowupQuestionAction
    );
    const action = onUpdateFollowupTrigger({
      questionNumbering: '1.1',
      value: 'mock_trigger_value',
    });

    const expectedState = {
      ...stateWithFollowupQuestion,
      activeCondition: {
        ...stateWithFollowupQuestion.activeCondition,
        questions: [
          {
            ...stateWithFollowupQuestion.activeCondition.questions[[0]],
            children: [
              {
                ...stateWithFollowupQuestion.activeCondition.questions[[0]]
                  .children[0],
                trigger_value: 'mock_trigger_value',
              },
            ],
          },
        ],
      },
    };

    expect(
      conditionBuildViewSlice.reducer(stateWithFollowupQuestion, action)
    ).toEqual(expectedState);
  });
  describe('[FOLLOWUP QUESTIONS] set multiple-choice', () => {
    const onAddFollowupQuestionAction = onAddFollowupQuestion({
      questionNumbering: '1',
    });
    const stateWithFollowupQuestion = conditionBuildViewSlice.reducer(
      initialStateWithActiveCondition,
      onAddFollowupQuestionAction
    );
    const action = onUpdateFollowupQuestion({
      questionNumbering: '1.1',
      value: 'multiple-choice',
      key: 'question_type',
    });

    const stateWithMultiChoiceFollowupQuestion =
      conditionBuildViewSlice.reducer(stateWithFollowupQuestion, action);

    it('should correctly add question_options when setting multiple-choice', () => {
      const expectedState = {
        ...stateWithFollowupQuestion,
        activeCondition: {
          ...stateWithFollowupQuestion.activeCondition,
          questions: [
            {
              ...stateWithFollowupQuestion.activeCondition.questions[[0]],
              children: [
                {
                  ...stateWithFollowupQuestion.activeCondition.questions[[0]]
                    .children[0],
                  question_type: 'multiple-choice',
                  question_options: [
                    {
                      order: 1,
                      value: '',
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      expect(stateWithMultiChoiceFollowupQuestion).toEqual(expectedState);
    });
    it('should correctly add an option to followup question meta data', () => {
      const updateMetaDataAction = onAddFollowupQuestionMetaData({
        questionNumbering: '1.1',
      });
      const initialLengthOfFollowupQuestions =
        stateWithMultiChoiceFollowupQuestion.activeCondition.questions[0]
          .children[0].question_options.length;

      const endState = conditionBuildViewSlice.reducer(
        stateWithMultiChoiceFollowupQuestion,
        updateMetaDataAction
      );

      const endStateLengthOfFollowupQuestionOptions =
        endState.activeCondition.questions[0].children[0].question_options
          .length;

      expect(endStateLengthOfFollowupQuestionOptions).toEqual(
        initialLengthOfFollowupQuestions + 1
      );
    });
    it('should correctly update followup question meta data', () => {
      const updateMetaDataAction = onUpdateFollowupQuestionMetaData({
        questionNumbering: '1.1',
        value: 'this is a new multi choice question',
        order: 1,
      });

      const expectedState = {
        ...stateWithFollowupQuestion,
        activeCondition: {
          ...stateWithFollowupQuestion.activeCondition,
          questions: [
            {
              ...stateWithFollowupQuestion.activeCondition.questions[[0]],
              children: [
                {
                  ...stateWithFollowupQuestion.activeCondition.questions[[0]]
                    .children[0],
                  question_type: 'multiple-choice',
                  question_options: [
                    {
                      order: 1,
                      value: 'this is a new multi choice question',
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
      const updatedStateWithFollowupQuestionMetaData =
        conditionBuildViewSlice.reducer(
          stateWithMultiChoiceFollowupQuestion,
          updateMetaDataAction
        );
      expect(updatedStateWithFollowupQuestionMetaData).toEqual(expectedState);
    });
  });
  it('should correctly set validationStatus', () => {
    const action = onSetValidationStatus({
      validationStatus: 'SUCCESS',
    });
    const expectedState = {
      ...initialStateWithActiveCondition,
      validationStatus: 'SUCCESS',
    };

    expect(
      conditionBuildViewSlice.reducer(initialStateWithActiveCondition, action)
    ).toEqual(expectedState);
  });
  it('should correctly set flattenedNames', () => {
    const action = onSetFlattenedNames({
      flattenedNames:
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.ARRAY_WITH_THREE_OCCURRENCES,
    });
    const expectedState = {
      ...initialStateWithActiveCondition,
      flattenedNames:
        MOCK_DATA_FOR_STRING_APPEARS_TWICE.ARRAY_WITH_THREE_OCCURRENCES,
    };

    expect(
      conditionBuildViewSlice.reducer(initialStateWithActiveCondition, action)
    ).toEqual(expectedState);
  });
});
