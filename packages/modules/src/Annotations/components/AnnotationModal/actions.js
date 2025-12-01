// @flow
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { Annotation } from '@kitman/common/src/types/Annotation';
import type { Action } from './types';

export const closeNotesModal = (
  annotationTypes: ?Array<Object> = null
): Action => ({
  type: 'CLOSE_NOTES_MODAL',
  payload: {
    annotationTypes,
  },
});

export const noteTypeChange = (typeId: number): Action => ({
  type: 'NOTE_TYPE_CHANGE',
  payload: {
    typeId,
  },
});

export const noteTitleChange = (title: string): Action => ({
  type: 'NOTE_TITLE_CHANGE',
  payload: {
    title,
  },
});

export const noteTextChange = (text: string): Action => ({
  type: 'NOTE_TEXT_CHANGE',
  payload: {
    text,
  },
});

export const noteRichTextChange = (content: string): Action => ({
  type: 'NOTE_RICH_TEXT_CHANGE',
  payload: {
    content,
  },
});

export const noteDateChange = (date: string): Action => ({
  type: 'NOTE_DATE_CHANGE',
  payload: {
    date,
  },
});

export const noteAthleteChange = (
  athleteId: string,
  athleteName: string
): Action => ({
  type: 'NOTE_ATHLETE_CHANGE',
  payload: {
    athleteId,
    athleteName,
  },
});

export const updateNoteActionText = (
  text: string,
  actionIndex: number
): Action => ({
  type: 'UPDATE_NOTE_ACTION_TEXT',
  payload: {
    text,
    actionIndex,
  },
});

export const updateNoteActionAssignee = (
  selectedId: string,
  actionIndex: number
): Action => ({
  type: 'UPDATE_NOTE_ACTION_ASSIGNEE',
  payload: {
    selectedId,
    actionIndex,
  },
});

export const addNoteAction = (): Action => ({
  type: 'ADD_NOTE_ACTION',
});

export const removeNoteAction = (actionIndex: number): Action => ({
  type: 'REMOVE_NOTE_ACTION',
  payload: {
    actionIndex,
  },
});

export const toggleActionCheckbox = (actionIndex: number): Action => ({
  type: 'TOGGLE_ACTION_CHECKBOX',
  payload: {
    actionIndex,
  },
});

export const updateActionDueDate = (
  dueDate: string,
  actionIndex: number
): Action => ({
  type: 'UPDATE_ACTION_DUE_DATE',
  payload: {
    dueDate,
    actionIndex,
  },
});

export const updateAnnotation = (
  widgetId: number,
  annotation: Annotation
): Action => ({
  type: 'UPDATE_ANNOTATION',
  payload: {
    widgetId,
    annotation,
  },
});

export const updateFiles = (files: Array<?AttachedFile>): Action => ({
  type: 'UPDATE_FILES',
  payload: {
    files,
  },
});

export const saveAnnotationLoading = (): Action => ({
  type: 'SAVE_ANNOTATION_LOADING',
});

export const saveAnnotationSuccess = (): Action => ({
  type: 'SAVE_ANNOTATION_SUCCESS',
});

export const saveAnnotationFailure = (): Action => ({
  type: 'SAVE_ANNOTATION_FAILURE',
});

export const editAnnotationLoading = (): Action => ({
  type: 'EDIT_ANNOTATION_LOADING',
});

export const editAnnotationSuccess = (): Action => ({
  type: 'EDIT_ANNOTATION_SUCCESS',
});

export const editAnnotationFailure = (): Action => ({
  type: 'EDIT_ANNOTATION_FAILURE',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const populateNoteModal = (
  annotation: Annotation,
  options: {
    isEditing: boolean,
    isDuplicating: boolean,
    isAthleteProfile: boolean,
  }
): Action => ({
  type: 'POPULATE_NOTE_MODAL',
  payload: {
    annotation,
    options,
  },
});

export const removeUploadedFile = (fileId: number): Action => ({
  type: 'REMOVE_UPLOADED_FILE',
  payload: {
    fileId,
  },
});
