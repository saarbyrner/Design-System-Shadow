// @flow
import type { Annotation } from '@kitman/common/src/types/Annotation';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';

type populateNoteModal = {
  type: 'POPULATE_NOTE_MODAL',
  payload: {
    annotation: Annotation,
    options: {
      isEditing: boolean,
      isDuplicating: boolean,
      isAthleteProfile: boolean,
    },
  },
};

type closeNotesModal = {
  type: 'CLOSE_NOTES_MODAL',
  payload: {
    annotationTypes: ?Array<Object>,
  },
};

type noteTypeChange = {
  type: 'NOTE_TYPE_CHANGE',
  payload: {
    typeId: number,
  },
};

type noteTitleChange = {
  type: 'NOTE_TITLE_CHANGE',
  payload: {
    title: string,
  },
};

type noteTextChange = {
  type: 'NOTE_TEXT_CHANGE',
  payload: {
    text: string,
  },
};

type noteRichTextChange = {
  type: 'NOTE_RICH_TEXT_CHANGE',
  payload: {
    content: string,
  },
};

type noteDateChange = {
  type: 'NOTE_DATE_CHANGE',
  payload: {
    date: string,
  },
};

type noteAthleteChange = {
  type: 'NOTE_ATHLETE_CHANGE',
  payload: {
    athleteId: string,
    athleteName: string,
  },
};

type updateNoteActionText = {
  type: 'UPDATE_NOTE_ACTION_TEXT',
  payload: {
    text: string,
    actionIndex: number,
  },
};

type updateNoteActionAssignee = {
  type: 'UPDATE_NOTE_ACTION_ASSIGNEE',
  payload: {
    selectedId: string,
    actionIndex: number,
  },
};

type addNoteAction = {
  type: 'ADD_NOTE_ACTION',
};

type removeNoteAction = {
  type: 'REMOVE_NOTE_ACTION',
  payload: {
    actionIndex: number,
  },
};

type toggleActionCheckbox = {
  type: 'TOGGLE_ACTION_CHECKBOX',
  payload: {
    actionIndex: number,
  },
};

type updateActionDueDate = {
  type: 'UPDATE_ACTION_DUE_DATE',
  payload: {
    dueDate: string,
    actionIndex: number,
  },
};

type saveAnnotationLoading = {
  type: 'SAVE_ANNOTATION_LOADING',
};

type saveAnnotationSuccess = {
  type: 'SAVE_ANNOTATION_SUCCESS',
};

type saveAnnotationFailure = {
  type: 'SAVE_ANNOTATION_FAILURE',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type updateAnnotation = {
  type: 'UPDATE_ANNOTATION',
  payload: {
    widgetId: number,
    annotation: Annotation,
  },
};

type editAnnotationLoading = {
  type: 'EDIT_ANNOTATION_LOADING',
};

type editAnnotationSuccess = {
  type: 'EDIT_ANNOTATION_SUCCESS',
};

type editAnnotationFailure = {
  type: 'EDIT_ANNOTATION_FAILURE',
};

type updateFiles = {
  type: 'UPDATE_FILES',
  payload: {
    files: Array<?AttachedFile>,
  },
};

type removeUploadedFile = {
  type: 'REMOVE_UPLOADED_FILE',
  payload: {
    fileId: number,
  },
};

export type Action =
  | closeNotesModal
  | noteTypeChange
  | noteTitleChange
  | noteTextChange
  | noteRichTextChange
  | noteDateChange
  | noteAthleteChange
  | updateNoteActionText
  | updateNoteActionAssignee
  | removeUploadedFile
  | addNoteAction
  | removeNoteAction
  | saveAnnotationLoading
  | saveAnnotationSuccess
  | saveAnnotationFailure
  | toggleActionCheckbox
  | updateActionDueDate
  | populateNoteModal
  | hideAppStatus
  | editAnnotationLoading
  | editAnnotationSuccess
  | editAnnotationFailure
  | updateFiles
  | updateAnnotation;
