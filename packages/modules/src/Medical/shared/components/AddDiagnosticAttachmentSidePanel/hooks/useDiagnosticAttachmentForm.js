// @flow

import { useReducer } from 'react';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { Dispatch } from '../../../types';

export type FormState = {
  athleteId: ?number,
  diagnosticId: ?number,
  queuedAttachments: Array<AttachedFile>,
  queuedAttachmentTypes: Array<string>,
};

export type FormAction =
  | { type: 'SET_ATHLETE_ID', athleteId: number }
  | { type: 'SET_DIAGNOSTIC_ID', diagnosticId: number }
  | {
      type: 'UPDATE_QUEUED_ATTACHMENTS',
      queuedAttachments: AttachedFile[],
    }
  | { type: 'REMOVE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'UPDATE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'CLEAR_FORM' };

export const initialFormState = {
  athleteId: null,
  diagnosticId: null,
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
        athleteId: action.athleteId,
      };
    case 'SET_DIAGNOSTIC_ID':
      return {
        ...state,
        diagnosticId: action.diagnosticId,
      };
    case 'UPDATE_QUEUED_ATTACHMENTS':
      return {
        ...state,
        queuedAttachments: action.queuedAttachments,
      };
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

const useDiagnosticAttachmentForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    initialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useDiagnosticAttachmentForm;
