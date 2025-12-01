// @flow
import { useReducer } from 'react';
import moment from 'moment';
import type { Option } from '@kitman/components/src/Select';
import type { AnnotationForm } from '@kitman/modules/src/Medical/shared/types';
import type { Dispatch } from '../../../types';

export type LastActivePeriod = { start: string, end: string };

type UnuploadedFile = {
  filename: string,
  fileType: string,
  fileSize: string,
  file: File,
};

type DefaultFormValues = {
  medicalNoteType: ?number,
  athlete_id?: ?number,
  annotationable_id?: ?number,
  diagnostic_id?: ?number,
  procedure_id?: ?number,
  title?: ?string,
  annotationDate?: ?string,
  lastActivePeriod?: ?LastActivePeriod,
  noteContent?: ?string,
  visibility?: ?string,
  illnessIds?: ?Array<number>,
  injuryIds?: ?Array<number>,
  chronicIds?: ?Array<number>,
  attachments?: ?Array<UnuploadedFile>,
  rehabSessionIds?: ?Array<number>,
  author_id: ?number,
  noteVisibilityIds?: ?Array<Option>,
  squad_id: ?number,
};

export type FormState = AnnotationForm;

export type FormAction =
  | { type: 'SET_MEDICAL_NOTE_TYPE_ID', medicalNoteTypeId: number }
  | {
      type: 'SET_DOCUMENT_NOTE_CATEGORY_IDS',
      categoryIds: Array<number>,
    }
  | {
      type: 'SET_ANNOTATIONABLE_TYPE',
      annotationableType:
        | 'Athlete'
        | 'Diagnostic'
        | 'Emr::Private::Models::Procedure',
    }
  | { type: 'SET_ATHLETE_ID', athleteId: number }
  | { type: 'SET_DIAGNOSTIC_ID', diagnosticId: number }
  | { type: 'SET_PROCEDURE_ID', procedureId: number }
  | { type: 'SET_TITLE', title: string }
  | { type: 'SET_DATE', date: string }
  | { type: 'SET_CONTENT', content: string }
  | { type: 'SET_ILLNESS_IDS', illnessIds: number[] }
  | { type: 'SET_INJURY_IDS', injuryIds: number[] }
  | { type: 'SET_CHRONIC_IDS', chronicIds: number[] }
  | { type: 'SET_AUTHOR_ID', userId: number }
  | { type: 'SET_NOTE_VISIBILITY_IDS', noteVisibilityIds: Array<Option> }
  | { type: 'SET_VISIBILITY', visibilityId: string }
  | { type: 'SET_SQUAD_ID', squadId: ?number }
  | { type: 'RESET_ATTACHMENTS' }
  | { type: 'CLEAR_FORM', defaultFormValues: DefaultFormValues };

export const init = ({
  /* eslint-disable camelcase */
  athlete_id,
  annotationable_id,
  diagnostic_id,
  procedure_id,
  medicalNoteType,
  title,
  noteContent,
  visibility,
  illnessIds,
  injuryIds,
  rehabSessionIds,
  chronicIds,
  annotationDate,
  lastActivePeriod,
  noteVisibilityIds,
}: DefaultFormValues) => ({
  annotationable_type: 'Athlete',
  organisation_annotation_type_id: medicalNoteType,
  document_note_category_ids: [],
  annotationable_id,
  athlete_id,
  diagnostic_id,
  procedure_id,
  title: title || '',
  annotation_date: annotationDate || moment(),
  athlete_active_period: lastActivePeriod,
  content: noteContent || '',
  illness_occurrence_ids: illnessIds || [],
  injury_occurrence_ids: injuryIds || [],
  chronic_issue_ids: chronicIds || [],
  restricted_to_doc: visibility === 'DOCTORS' || false,
  restricted_to_psych: visibility === 'PSYCH_TEAM' || false,
  attachments_attributes: [],
  annotation_actions_attributes: [],
  scope_to_org: true,
  rehab_session_ids: rehabSessionIds,
  author_id: null,
  note_visibility_ids: noteVisibilityIds || [],
  squad_id: null,
});

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_MEDICAL_NOTE_TYPE_ID':
      return {
        ...state,
        organisation_annotation_type_id: action.medicalNoteTypeId,
      };

    case 'SET_DOCUMENT_NOTE_CATEGORY_IDS':
      return {
        ...state,
        document_note_category_ids: action.categoryIds,
      };

    case 'SET_ANNOTATIONABLE_TYPE':
      return {
        ...state,
        annotationable_type: action.annotationableType,
        annotationable_id:
          // eslint-disable-next-line no-nested-ternary
          action.annotationableType === 'Diagnostic'
            ? state.diagnostic_id
            : action.annotationableType === 'Procedure'
            ? state.procedure_id
            : state.athlete_id,
      };

    case 'SET_ATHLETE_ID':
      return {
        ...state,
        athlete_id: action.athleteId,
        annotationable_id:
          state.annotationable_type === 'Diagnostic'
            ? state.annotationable_id
            : action.athleteId,
      };
    case 'SET_DIAGNOSTIC_ID':
      return {
        ...state,
        diagnostic_id: action.diagnosticId,
        annotationable_id: action.diagnosticId,
      };

    case 'SET_PROCEDURE_ID':
      return {
        ...state,
        procedure_id: action.procedureId,
        annotationable_id: action.procedureId,
      };

    case 'SET_TITLE':
      return {
        ...state,
        title: action.title,
      };

    case 'SET_DATE':
      return {
        ...state,
        annotation_date: action.date,
      };
    case 'SET_AUTHOR_ID':
      return {
        ...state,
        author_id: action.userId,
      };

    case 'SET_NOTE_VISIBILITY_IDS': {
      return {
        ...state,
        note_visibility_ids: action.noteVisibilityIds,
      };
    }

    case 'SET_SQUAD_ID':
      return {
        ...state,
        squad_id: action.squadId,
      };

    case 'SET_CONTENT':
      return {
        ...state,
        content: action.content,
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

    case 'RESET_ATTACHMENTS':
      return {
        ...state,
        attachments_attributes: [],
      };

    case 'CLEAR_FORM':
      return init(action.defaultFormValues);

    default:
      return state;
  }
};

const useMedicalNoteForm = (defaultFormValues: DefaultFormValues) => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    defaultFormValues,
    init
  );

  return {
    formState,
    dispatch,
  };
};

export default useMedicalNoteForm;
