// @flow
import { useReducer } from 'react';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type {
  UpdateAnnotationForm,
  Attachment,
} from '@kitman/services/src/services/updateAnnotation';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { Dispatch } from '@kitman/modules/src/Medical/shared/types';

type DefaultFormValues = {
  annotationableType?: ?string,
  documentCategoryIds: Array<number>,
  medicalNoteType: ?number,
  title?: ?string,
  annotationDate: string,
  noteContent: string,
  visibility: string,
  squadId: number,
  illnessIds: Array<number>,
  injuryIds: Array<number>,
  chronicIds: Array<number>,
  attachments: Array<Attachment>,
  rehabSessionIds: ?Array<number>,
  authorId: ?number,
  noteVisibilityIds?: ?Array<Option>,
};

export type FormState = UpdateAnnotationForm;

export type FormAction =
  | { type: 'SET_ANNOTATIONABLE_TYPE', annotationableType: string }
  | { type: 'SET_MEDICAL_NOTE_TYPE_ID', medicalNoteTypeId: number }
  | { type: 'SET_ATHLETE_ID', athleteId: number }
  | { type: 'SET_TITLE', title: string }
  | { type: 'SET_DATE', date: string }
  | { type: 'SET_CONTENT', content: string }
  | { type: 'SET_ILLNESS_IDS', illnessIds: number[] }
  | { type: 'SET_INJURY_IDS', injuryIds: number[] }
  | { type: 'SET_CHRONIC_IDS', chronicIds: number[] }
  | { type: 'SET_VISIBILITY', id: string }
  | {
      type: 'SET_NOTE_VISIBILITY_IDS',
      noteVisibilityIds: Array<Option>,
    }
  | { type: 'SET_SQUAD', id: number }
  | { type: 'SET_AUTHOR_ID', userId: number }
  | { type: 'RESET_ATTACHMENTS' }
  | { type: 'CLEAR_FORM', defaultFormValues: DefaultFormValues };

export const init = ({
  annotationableType,
  documentCategoryIds,
  medicalNoteType,
  title,
  annotationDate,
  noteContent,
  visibility,
  squadId,
  illnessIds,
  injuryIds,
  chronicIds,
  rehabSessionIds,
  authorId,
  noteVisibilityIds,
}: DefaultFormValues) => ({
  annotationable_type: annotationableType,
  organisation_annotation_type_id: medicalNoteType,
  document_note_category_ids: documentCategoryIds,
  title: title || '',
  annotation_date: moment(annotationDate).format(dateTransferFormat),
  content: noteContent,
  illness_occurrence_ids: illnessIds,
  injury_occurrence_ids: injuryIds,
  chronic_issue_ids: chronicIds || [],
  restricted_to_doc: visibility === 'DOCTORS' || false,
  restricted_to_psych: visibility === 'PSYCH_TEAM' || false,
  attachments_attributes: [],
  annotation_actions_attributes: [],
  squad_id: squadId,
  scope_to_org: true,
  rehab_session_ids: rehabSessionIds,
  author_id: authorId,
  note_visibility_ids: noteVisibilityIds,
});

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_ANNOTATIONABLE_TYPE':
      return {
        ...state,
        annotation_type_id: action.annotationableType,
      };
    case 'SET_MEDICAL_NOTE_TYPE_ID':
      return {
        ...state,
        organisation_annotation_type_id: action.medicalNoteTypeId,
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
        restricted_to_doc: action.id === 'DOCTORS',
        restricted_to_psych: action.id === 'PSYCH_TEAM',
      };

    case 'SET_NOTE_VISIBILITY_IDS':
      return {
        ...state,
        note_visibility_ids: action.noteVisibilityIds,
      };

    case 'SET_SQUAD':
      return {
        ...state,
        squad_id: action.id,
      };

    case 'SET_AUTHOR_ID':
      return {
        ...state,
        author_id: action.userId,
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

const useEditMedicalNoteForm = (defaultFormValues: DefaultFormValues) => {
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

export default useEditMedicalNoteForm;
