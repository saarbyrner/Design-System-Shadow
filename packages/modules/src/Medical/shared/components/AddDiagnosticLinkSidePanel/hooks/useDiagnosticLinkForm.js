// @flow

import { useReducer } from 'react';
import type { Dispatch } from '../../../types';

export type QueuedLink = {
  title: string,
  uri: string,
  id?: number,
};

export type FormState = {
  athleteId: ?number,
  diagnosticId: ?number,
  queuedLinks: Array<QueuedLink>,
  linkTitle: string,
  linkUri: string,
};

export type FormAction =
  | { type: 'SET_ATHLETE_ID', athleteId: number }
  | { type: 'SET_DIAGNOSTIC_ID', diagnosticId: number }
  | { type: 'CLEAR_QUEUED_LINKS' }
  | { type: 'SET_LINK_TITLE', linkTitle: string }
  | { type: 'SET_LINK_URI', linkUri: string }
  | {
      type: 'UPDATE_QUEUED_LINKS',
      queuedLinks: QueuedLink[],
    }
  | { type: 'REMOVE_QUEUED_LINK', id: ?number }
  | { type: 'REMOVE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'UPDATE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'CLEAR_FORM' };

export const initialFormState = {
  athleteId: null,
  diagnosticId: null,
  queuedAttachmentTypes: [],
  linkTitle: '',
  linkUri: '',
  queuedLinks: [],
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
    case 'SET_LINK_TITLE':
      return {
        ...state,
        linkTitle: action.linkTitle,
      };
    case 'SET_LINK_URI':
      return {
        ...state,
        linkUri: action.linkUri,
      };
    case 'UPDATE_QUEUED_LINKS': {
      const copiedQueuedLinks = [...state.queuedLinks, ...action.queuedLinks];

      return {
        ...state,
        queuedLinks: copiedQueuedLinks.map((queuedLink, index) => {
          return { ...queuedLink, id: index };
        }),
      };
    }
    case 'CLEAR_QUEUED_LINKS': {
      return {
        ...state,
        queuedLinks: [],
      };
    }
    case 'REMOVE_QUEUED_LINK':
      return {
        ...state,
        queuedLinks: state.queuedLinks.filter(
          (queuedLink) => queuedLink.id !== action.id
        ),
      };
    case 'CLEAR_FORM':
      return initialFormState;

    default:
      return state;
  }
};

const useDiagnosticLinkForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    initialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useDiagnosticLinkForm;
