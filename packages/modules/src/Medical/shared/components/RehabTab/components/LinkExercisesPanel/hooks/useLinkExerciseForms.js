// @flow
import { useReducer } from 'react';
import type { IssueType } from '../../../../../types';

type Dispatch<T> = (action: T) => any;

type FormState = {
  athlete_id: ?number,
  issue_id: ?number,
  issue_type: ?IssueType,
};

export type FormAction =
  | {
      type: 'SET_SELECTED_ISSUE_DETAILS',
      selectedIssueType: ?IssueType,
      selectedIssueId: ?number,
    }
  | { type: 'CLEAR_FORM' };

export const getInitialFormState = (athleteId: ?number) => {
  return {
    athlete_id: athleteId,
    issue_id: null,
    issue_type: null,
  };
};

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_SELECTED_ISSUE_DETAILS':
      return {
        ...state,
        issue_type: action.selectedIssueType,
        issue_id: action.selectedIssueId,
      };

    case 'CLEAR_FORM':
      return { ...getInitialFormState(null) };

    default:
      return state;
  }
};

const useLinkExercisesForm = (athleteId: number) => {
  const initialState = getInitialFormState(athleteId);
  const init = () => {
    return initialState;
  };

  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    initialState,
    init
  );

  return {
    formState,
    dispatch,
  };
};

export default useLinkExercisesForm;
