// @flow
import { useReducer } from 'react';

import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { Dispatch } from '../../../types';

export type FormState = {
  athlete_id: ?number,
  tue_date: string,
  tue_name: string,
  tue_expiration_date: string,
  illness_occurrence_ids: number[],
  injury_occurrence_ids: number[],
  chronic_issue_ids: number[],
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  queuedAttachments: Array<AttachedFile>,
  queuedAttachmentTypes: Array<string>,
};

export type FormAction =
  | { type: 'SET_ATHLETE_ID', athleteId: number }
  | { type: 'SET_TUE_DATE', tue_date: string }
  | { type: 'SET_TUE_NAME', tue_name: string }
  | { type: 'SET_TUE_EXPIRATION_DATE', tue_expiration_date: string }
  | { type: 'SET_ILLNESS_IDS', illnessIds: number[] }
  | { type: 'SET_INJURY_IDS', injuryIds: number[] }
  | { type: 'SET_CHRONIC_IDS', chronicIds: number[] }
  | { type: 'SET_VISIBILITY', visibilityId: string }
  | {
      type: 'UPDATE_QUEUED_ATTACHMENTS',
      queuedAttachments: AttachedFile[],
    }
  | { type: 'REMOVE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'UPDATE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'CLEAR_FORM' };

export const initialFormState = {
  athlete_id: null,
  tue_date: '',
  tue_name: '',
  tue_expiration_date: '',
  illness_occurrence_ids: [],
  injury_occurrence_ids: [],
  chronic_issue_ids: [],
  restricted_to_doc: false,
  restricted_to_psych: false,
  attachment_ids: [],
  queuedAttachments: [],
  queuedAttachmentTypes: [],
};

const formReducer = (
  state: FormState = initialFormState,
  action: FormAction
) => {
  switch (action.type) {
    case 'SET_ATHLETE_ID':
      return {
        ...state,
        athlete_id: action.athleteId,
      };

    case 'SET_TUE_DATE':
      return {
        ...state,
        tue_date: action.tue_date,
      };

    case 'SET_TUE_NAME':
      return {
        ...state,
        tue_name: action.tue_name,
      };

    case 'SET_TUE_EXPIRATION_DATE':
      return {
        ...state,
        tue_expiration_date: action.tue_expiration_date,
      };

    case 'SET_ILLNESS_IDS':
      return {
        ...state,
        illness_occurrence_ids: action.illnessIds,
      };
    case 'SET_CHRONIC_IDS':
      return {
        ...state,
        chronic_issue_ids: action.chronicIds,
      };

    case 'SET_INJURY_IDS':
      return {
        ...state,
        injury_occurrence_ids: action.injuryIds,
      };

    case 'SET_VISIBILITY':
      return {
        ...state,
        restricted_to_doc: action.visibilityId === 'DOCTORS',
        restricted_to_psych: action.visibilityId === 'PSYCH_TEAM',
      };

    case 'UPDATE_QUEUED_ATTACHMENTS':
      return {
        ...state,
        queuedAttachments: action.queuedAttachments,
      };

    // Can be a FILE, LINK or NOTE
    case 'UPDATE_ATTACHMENT_TYPE':
      return {
        ...state,
        queuedAttachmentTypes: [
          ...state.queuedAttachmentTypes,
          action.queuedAttachmentType,
        ],
      };

    case 'REMOVE_ATTACHMENT_TYPE':
      return {
        ...state,
        queuedAttachmentTypes: state.queuedAttachmentTypes.filter(
          (type) => type !== action.queuedAttachmentType
        ),
      };

    case 'CLEAR_FORM':
      return initialFormState;

    default:
      return state;
  }
};

const useTUEForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    initialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useTUEForm;
