// @flow
import { useReducer } from 'react';
import type { IssueType } from '../../../../../types';

type Dispatch<T> = (action: T) => any;

type FormState = {
  athlete_id: ?number,
  session_dates: Array<string>,
  issue_id: ?number,
  issue_type: ?IssueType,
  copy_comments: boolean,
  copy_uncompressed: boolean,
  copy_maintenance: boolean,
};

export type FormAction =
  | {
      type: 'SET_ATHLETE_AND_ISSUE_DETAILS',
      athleteId: number,
      selectedIssueType: ?IssueType,
      selectedIssueId: ?number,
    }
  | { type: 'SET_SESSION_DATES', sessionDates: Array<string> }
  | {
      type: 'SET_SELECTED_ISSUE_DETAILS',
      selectedIssueType: ?IssueType,
      selectedIssueId: ?number,
    }
  | { type: 'SET_COPY_COMMENTS', copy: boolean }
  | { type: 'SET_COPY_UNCOMPRESSED', uncompressed: boolean }
  | { type: 'SET_COPY_MAINTENANCE', maintenance: boolean }
  | { type: 'CLEAR_FORM' };

export const getInitialFormState = () => {
  return {
    athlete_id: null,
    session_dates: [],
    issue_id: null,
    issue_type: null,
    copy_comments: false,
    copy_uncompressed: false,
    copy_maintenance: false,
  };
};

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_COPY_COMMENTS':
      return {
        ...state,
        copy_comments: action.copy,
      };

    case 'SET_COPY_UNCOMPRESSED':
      return {
        ...state,
        copy_uncompressed: action.uncompressed,
      };

    case 'SET_COPY_MAINTENANCE':
      return {
        ...state,
        copy_maintenance: action.maintenance,
      };

    case 'SET_ATHLETE_AND_ISSUE_DETAILS':
      return {
        ...state,
        athlete_id: action.athleteId,
        issue_type: action.selectedIssueType,
        issue_id: action.selectedIssueId,
      };

    case 'SET_SELECTED_ISSUE_DETAILS':
      return {
        ...state,
        issue_type: action.selectedIssueType,
        issue_id: action.selectedIssueId,
      };

    case 'SET_SESSION_DATES':
      return {
        ...state,
        session_dates: action.sessionDates,
      };

    case 'CLEAR_FORM':
      return { ...getInitialFormState() };

    default:
      return state;
  }
};

const useCopyExercisesForm = () => {
  const initialState = getInitialFormState();
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

export default useCopyExercisesForm;
