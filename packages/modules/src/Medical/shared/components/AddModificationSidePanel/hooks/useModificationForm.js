// @flow

import { useReducer } from 'react';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { AttachedTransformedFile } from '@kitman/common/src/utils/fileHelper';
import type { Dispatch } from '../../../types';

export type FormState = {
  annotationable_type:
    | 'Athlete'
    | 'Diagnostic'
    | 'Emr::Private::Models::Procedure',
  organisation_annotation_type_id: ?number,
  document_note_category_ids?: Array<number>,
  athlete_id?: ?number,
  diagnostic_id?: ?number,
  procedure_id?: ?number,
  annotationable_id: ?number,
  title: string,
  annotation_date: ?string,
  expiration_date?: ?string,
  content: string,
  illness_occurrence_ids: number[],
  injury_occurrence_ids: number[],
  chronic_issue_ids?: number[],
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  attachments_attributes: AttachedTransformedFile[],
  annotation_actions_attributes: Array<{
    content: string,
    completed: boolean,
    user_ids: number,
    due_date: string,
  }>,
  scope_to_org: boolean,
  squad_id?: ?number,
  author_id?: ?number,
};

export type FormAction =
  | { type: 'SET_MODIFICATION_TYPE_ID', modificationTypeId: number }
  | { type: 'SET_ATHLETE_ID', athleteId: number }
  | { type: 'SET_TITLE', title: string }
  | { type: 'SET_START_DATE', startDate: string }
  | { type: 'SET_END_DATE', endDate: string }
  | { type: 'SET_DETAILS', details: string }
  | { type: 'SET_ILLNESS_IDS', illnessIds: number[] }
  | { type: 'SET_INJURY_IDS', injuryIds: number[] }
  | { type: 'SET_CHRONIC_IDS', chronicIds: number[] }
  | { type: 'SET_VISIBILITY', visibilityId: string }
  | { type: 'CLEAR_FORM' };

export const initialFormState: FormState = {
  annotationable_type: 'Athlete',
  organisation_annotation_type_id: null,
  document_note_category_ids: [],
  annotationable_id: null,
  title: '',
  annotation_date: moment().format(dateTransferFormat),
  content: '',
  illness_occurrence_ids: [],
  injury_occurrence_ids: [],
  chronic_issue_ids: [],
  restricted_to_doc: false,
  restricted_to_psych: false,
  attachments_attributes: [],
  annotation_actions_attributes: [],
  scope_to_org: true,
};

const formReducer = (
  state: FormState = initialFormState,
  action: FormAction
) => {
  switch (action.type) {
    case 'SET_MODIFICATION_TYPE_ID':
      return {
        ...state,
        organisation_annotation_type_id: action.modificationTypeId,
      };

    case 'SET_ATHLETE_ID':
      return {
        ...state,
        annotationable_id: action.athleteId,
      };

    case 'SET_TITLE':
      return {
        ...state,
        title: action.title,
      };

    case 'SET_START_DATE':
      return {
        ...state,
        annotation_date: action.startDate,
      };

    case 'SET_END_DATE':
      return {
        ...state,
        expiration_date: action.endDate,
      };

    case 'SET_DETAILS':
      return {
        ...state,
        content: action.details,
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

    case 'SET_CHRONIC_IDS':
      return {
        ...state,
        chronic_issue_ids: action.chronicIds,
      };

    case 'SET_VISIBILITY':
      return {
        ...state,
        restricted_to_doc: action.visibilityId === 'DOCTORS',
        restricted_to_psych: action.visibilityId === 'PSYCH_TEAM',
      };

    case 'CLEAR_FORM':
      return initialFormState;

    default:
      return state;
  }
};

const useModificationForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    initialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useModificationForm;
