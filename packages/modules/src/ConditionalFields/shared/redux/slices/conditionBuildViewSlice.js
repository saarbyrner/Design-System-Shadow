// @flow
import { createSlice } from '@reduxjs/toolkit';

import type { RequestStatus } from '@kitman/services/src/types';

import {
  blankConditionGenerator,
  blankQuestionGenerator,
  blankOperandGenerator,
  createNestedFollowupQuestion,
  updateNestedFollowupQuestion,
  addNestedFollowupQuestionMetadata,
  updateNestedFollowupQuestionMetadata,
  updateNestedFollowupQuestionTrigger,
} from '../../utils';
import type { ActiveCondition, Operator } from '../../types';

export const REDUCER_KEY: string = 'conditionBuildViewSlice';

type SetAllConditionsStateAction = {
  payload: {
    conditions: Array<ActiveCondition>,
  },
};

type SetActiveCondition = {
  payload: {
    activeCondition: ActiveCondition,
  },
};

type ALLOWED_KEYS_TO_EDIT = 'location' | 'predicate' | 'name';

type ALLOWED_QUESTION_KEYS_TO_EDIT = 'name' | 'question_type' | 'question';

type ALLOWED_PREDICATE_KEYS_TO_EDIT = 'path' | 'value' | 'operator';

type UpdateActiveCondition = {
  payload: {
    key: ALLOWED_KEYS_TO_EDIT,
    value: any,
  },
};

type UpdateActiveConditionQuestions = {
  payload: {
    key: ALLOWED_QUESTION_KEYS_TO_EDIT,
    value: any,
    index: number,
  },
};
type UpdateActivePredicate = {
  payload: {
    key: ALLOWED_PREDICATE_KEYS_TO_EDIT,
    value: any,
    index: number,
  },
};

type UpdatePredicateOperatorAction = {
  payload: {
    value: Operator,
  },
};

type DeleteOperandStateAction = {
  payload: {
    index: number,
  },
};
type UpdateQuestionMetaData = {
  payload: {
    order: number,
    value: any,
    index: number,
  },
};

type UpdateFollowupQuestionMetaData = {
  payload: {
    order: number,
    value: string,
    questionNumbering: string,
  },
};

type UpdateFollowupQuestionTrigger = {
  payload: {
    value: string,
    questionNumbering: string,
  },
};
type OnAddFollowupQuestionAction = {
  payload: {
    questionNumbering: string,
  },
};

type UpdateFollowupQuestionAction = {
  payload: {
    questionNumbering: string,
    key: ALLOWED_QUESTION_KEYS_TO_EDIT,
    value: string,
  },
};

type AddFollowupQuestionMetaDataOption = {
  payload: { questionNumbering: string },
};

type AddQuestionMetaDataOption = { payload: { index: number, order: number } };

type SetRequestStatusAction = {
  payload: { requestStatus: RequestStatus },
};

export type ValidationStatus = 'PENDING' | 'DORMANT';

type SetValidationStatusAction = {
  payload: { validationStatus: ValidationStatus },
};

type SetFlattenedNamesAction = {
  payload: { flattenedNames: Array<string> },
};

export type ConditionBuildViewState = {
  activeCondition: ActiveCondition,
  allConditions: Array<ActiveCondition>,
  requestStatus: RequestStatus,
  validationStatus: ValidationStatus,
  flattenedNames: Array<string>,
};

const initialState: ConditionBuildViewState = {
  activeCondition: {},
  allConditions: [],
  requestStatus: 'SUCCESS',
  validationStatus: 'DORMANT',
  flattenedNames: [],
};

const conditionBuildViewSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onSetActiveCondition: (
      state: ConditionBuildViewState,
      action: SetActiveCondition
    ) => {
      state.activeCondition = {
        ...action.payload.activeCondition,
        questions: action.payload.activeCondition.questions,
      };
    },
    onUpdateActiveCondition: (
      state: ConditionBuildViewState,
      action: UpdateActiveCondition
    ) => {
      const { key, value } = action.payload;
      state.activeCondition[key] = value;
    },
    onUpdateActiveConditionQuestions: (
      state: ConditionBuildViewState,
      action: UpdateActiveConditionQuestions
    ) => {
      const { value, index, key } = action.payload;
      if (
        key === 'question_type' &&
        (value === 'multiple-choice' || value === 'boolean')
      ) {
        state.activeCondition.questions[index].question_options = [
          {
            order: 1,
            value: '',
          },
        ];
      }
      state.activeCondition.questions[index].answer_datatype = 'string';
      state.activeCondition.questions[index][key] = value;
    },
    onUpdatePredicateOperator: (
      state: ConditionBuildViewState,
      action: UpdatePredicateOperatorAction
    ) => {
      const { value } = action.payload;

      state.activeCondition.predicate.operator = value;
    },
    onUpdateActivePredicate: (
      state: ConditionBuildViewState,
      action: UpdateActivePredicate
    ) => {
      const { value, key, index } = action.payload;

      state.activeCondition.predicate.operands[index][key] = value;
    },
    onUpdateQuestionMetaData: (
      state: ConditionBuildViewState,
      action: UpdateQuestionMetaData
    ) => {
      const { value, index, order } = action.payload;

      state.activeCondition.questions[index].question_options[order - 1] = {
        order,
        value,
      };
    },
    onAddQuestionMetaData: (
      state: ConditionBuildViewState,
      action: AddQuestionMetaDataOption
    ) => {
      const { index } = action.payload;
      state.activeCondition.questions[index].question_options.push({
        order:
          state.activeCondition.questions[index].question_options.length + 1,
        value: '',
      });
    },
    onAddQuestion: (state: ConditionBuildViewState) => {
      state.activeCondition.questions.push(
        blankQuestionGenerator(
          state.activeCondition.questions.length + 1,
          `${state.activeCondition.questions.length + 1}`
        )
      );
    },

    onAddFollowupQuestion: (
      state: ConditionBuildViewState,
      action: OnAddFollowupQuestionAction
    ) => {
      const { questionNumbering } = action.payload;
      state.activeCondition = {
        ...state.activeCondition,
        questions: createNestedFollowupQuestion(
          state.activeCondition.questions,
          questionNumbering
        ),
      };
    },
    onUpdateFollowupQuestion: (
      state: ConditionBuildViewState,
      action: UpdateFollowupQuestionAction
    ) => {
      const { questionNumbering, value, key } = action.payload;
      state.activeCondition = {
        ...state.activeCondition,
        questions: updateNestedFollowupQuestion(
          state.activeCondition.questions,
          questionNumbering,
          key,
          value
        ),
      };
    },
    onAddFollowupQuestionMetaData: (
      state: ConditionBuildViewState,
      action: AddFollowupQuestionMetaDataOption
    ) => {
      const { questionNumbering } = action.payload;

      state.activeCondition = {
        ...state.activeCondition,
        questions: addNestedFollowupQuestionMetadata(
          state.activeCondition.questions,
          questionNumbering
        ),
      };
    },
    onUpdateFollowupQuestionMetaData: (
      state: ConditionBuildViewState,
      action: UpdateFollowupQuestionMetaData
    ) => {
      const { questionNumbering, order, value } = action.payload;

      state.activeCondition = {
        ...state.activeCondition,
        questions: updateNestedFollowupQuestionMetadata(
          state.activeCondition.questions,
          questionNumbering,
          order,
          value
        ),
      };
    },
    onUpdateFollowupTrigger: (
      state: ConditionBuildViewState,
      action: UpdateFollowupQuestionTrigger
    ) => {
      const { value, questionNumbering } = action.payload;

      state.activeCondition = {
        ...state.activeCondition,
        questions: updateNestedFollowupQuestionTrigger(
          state.activeCondition.questions,
          questionNumbering,
          value
        ),
      };
    },
    onSetAllConditions: (
      state: ConditionBuildViewState,
      action: SetAllConditionsStateAction
    ) => {
      // add index to be able to track active condition
      const conditionsWithIndex = action.payload.conditions.map(
        (condition, index) => ({
          ...condition,
          index,
        })
      );
      state.allConditions = conditionsWithIndex;
    },
    onAddCondition: (state: ConditionBuildViewState) => {
      state.allConditions.push(
        blankConditionGenerator(state.allConditions.length)
      );
    },
    onAddOperand: (state: ConditionBuildViewState) => {
      state.activeCondition.predicate.operands.push(blankOperandGenerator());
    },
    onDeleteOperand: (
      state: ConditionBuildViewState,
      action: DeleteOperandStateAction
    ) => {
      const { index: indexToRemove } = action.payload;

      const filteredOperands = state.activeCondition.predicate.operands.filter(
        (operand, index) => index !== indexToRemove
      );

      state.activeCondition.predicate.operands = filteredOperands;
    },
    onSetRequestStatus: (
      state: ConditionBuildViewState,
      action: SetRequestStatusAction
    ) => {
      state.requestStatus = action.payload.requestStatus;
    },
    onSetFlattenedNames: (
      state: ConditionBuildViewState,
      action: SetFlattenedNamesAction
    ) => {
      state.flattenedNames = action.payload.flattenedNames;
    },
    onSetValidationStatus: (
      state: ConditionBuildViewState,
      action: SetValidationStatusAction
    ) => {
      state.validationStatus = action.payload.validationStatus;
    },
    onResetFormState: () => initialState,
  },
});

export const {
  onSetActiveCondition,
  onUpdateActiveCondition,
  onUpdateActivePredicate,
  onUpdateActiveConditionQuestions,
  onUpdateQuestionMetaData,
  onAddQuestionMetaData,
  onAddQuestion,
  onAddFollowupQuestion,
  onUpdateFollowupQuestion,
  onAddFollowupQuestionMetaData,
  onUpdateFollowupQuestionMetaData,
  onUpdateFollowupTrigger,
  onAddOperand,
  onDeleteOperand,
  onUpdatePredicateOperator,
  onAddCondition,
  onSetAllConditions,
  onSetRequestStatus,
  onResetFormState,
  onSetValidationStatus,
  onSetFlattenedNames,
} = conditionBuildViewSlice.actions;
export default conditionBuildViewSlice;
