// @flow
import { useReducer } from 'react';
import type { RehabGroup } from '../../../types';

type Dispatch<T> = (action: T) => any;

type FormState = {
  group: RehabGroup, // Create new group/tag to be associated with an exercise
  tag_ids: Array<number>, // Using an existing tag/group to associate with an exercise
};

export type FormAction =
  | {
      type: 'SET_REHAB_GROUP_NAME',

      group: RehabGroup,
    }
  | {
      type: 'SET_REHAB_GROUP_COLOR',

      group: RehabGroup,
    }
  | {
      type: 'SET_REHAB_GROUP_ID',

      tag_ids: Array<number>,
    }
  | { type: 'CLEAR_FORM' };

export const getInitialFormState = () => {
  return {
    group: {},
    tag_ids: [],
  };
};

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_REHAB_GROUP_NAME':
      return {
        ...state,
        group: { ...state.group, name: action.group.name },
      };

    case 'SET_REHAB_GROUP_COLOR':
      return {
        ...state,
        group: { ...state.group, theme_colour: action.group.theme_colour },
      };

    case 'SET_REHAB_GROUP_ID':
      return {
        ...state,
        tag_ids: action.tag_ids,
      };

    case 'CLEAR_FORM':
      return { ...getInitialFormState() };

    default:
      return state;
  }
};

const useRehabGroupForm = () => {
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

export default useRehabGroupForm;
