// @flow
import { useReducer } from 'react';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { Dispatch } from '../../../types';

type FormState = {
  athlete_name: ?string,
  athlete_id: ?number,
  illness_occurrence_ids: number[],
  injury_occurrence_ids: number[],
  assessment_ids: number[],
};

export type FormAction =
  | { type: 'SET_ATHLETE_ID', athleteId: number, squadAthletes: Array<Option> }
  | { type: 'SET_ILLNESS_IDS', illnessIds: number[] }
  | { type: 'SET_INJURY_IDS', injuryIds: number[] }
  | { type: 'SET_ASSESSMENT_IDS', assessmentIds: number[] }
  | { type: 'CLEAR_FORM' };

export const getInitialFormState = () => {
  return {
    athlete_name: null,
    athlete_id: null,
    illness_occurrence_ids: [],
    injury_occurrence_ids: [],
    assessment_ids: [],
  };
};

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_ATHLETE_ID': {
      let athleteOption;
      // eslint-disable-next-line no-restricted-syntax
      for (const squad of action.squadAthletes) {
        athleteOption = squad.options?.find(
          (option) => option.value === action.athleteId
        );
        if (athleteOption) {
          break;
        }
      }
      return {
        ...state,
        athlete_id: action.athleteId,
        athlete_name: athleteOption?.label,
      };
    }
    case 'SET_ASSESSMENT_IDS':
      return {
        ...state,
        assessment_ids: action.assessmentIds,
      };

    case 'SET_ILLNESS_IDS':
      return {
        ...state,
        illness_occurrence_ids: action.illnessIds,
      };

    case 'SET_INJURY_IDS':
      return {
        ...state,
        injury_occurrence_ids: action.injuryIds,
      };

    case 'CLEAR_FORM':
      return getInitialFormState();

    default:
      return state;
  }
};

const useAddConcussionAssessmentForm = () => {
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

export default useAddConcussionAssessmentForm;
