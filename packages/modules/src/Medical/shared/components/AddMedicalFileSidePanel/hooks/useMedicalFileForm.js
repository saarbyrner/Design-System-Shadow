// @flow
import { useReducer } from 'react';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { Dispatch } from '../../../types';

export type LastActivePeriod = { start: string, end: string };

export type FormState = {
  selectedAthlete: ?number,
  selectedDate: string,
  lastActivePeriod?: LastActivePeriod,
  selectedCategories: Array<number>,
  noteTitle: string,
  noteContent: string,
  selectedIssues: Array<string>,
  updatedFileName: string,
  filesToUpload: Array<AttachedFile>,
};

export type FormAction =
  | { type: 'SET_SELECTED_ATHLETE', selectedAthlete: number }
  | { type: 'SET_SELECTED_DATE', selectedDate: string }
  | { type: 'SET_SELECTED_CATEGORIES', selectedCategories: number[] }
  | { type: 'SET_UPDATED_FILENAME', updatedFileName: string }
  | { type: 'SET_SELECTED_ISSUES', selectedIssues: string[] }
  | { type: 'SET_NOTE_SECTION', noteTitle: string, noteContent: string }
  | { type: 'SET_FILES_TO_UPLOAD', filesToUpload: AttachedFile[] }
  | {
      type: 'AUTOPOPULATE_SELECTED_FILE',
      selectedAthlete: number,
      selectedDate: string,
      selectedCategories: number[],
      updatedFileName: string,
      selectedIssues: Array<string>,
    }
  | { type: 'CLEAR_FORM' };

export const InitialFormState = {
  selectedAthlete: null,
  selectedDate: '',
  lastActivePeriod: { start: '', end: '' },
  selectedCategories: [],
  noteTitle: '',
  noteContent: '',
  selectedIssues: [],
  updatedFileName: '',
  filesToUpload: [],
};

const formReducer = (
  state: FormState = InitialFormState,
  action: FormAction
) => {
  switch (action.type) {
    case 'SET_SELECTED_ATHLETE':
      return {
        ...state,
        selectedAthlete: action.selectedAthlete,
      };
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        selectedDate: action.selectedDate,
      };
    case 'SET_SELECTED_CATEGORIES':
      return {
        ...state,
        selectedCategories: action.selectedCategories,
      };
    case 'SET_UPDATED_FILENAME':
      return {
        ...state,
        updatedFileName: action.updatedFileName,
      };
    case 'SET_FILES_TO_UPLOAD':
      return {
        ...state,
        filesToUpload: action.filesToUpload,
      };
    case 'SET_SELECTED_ISSUES':
      return {
        ...state,
        selectedIssues: action.selectedIssues,
      };
    case 'SET_NOTE_SECTION':
      return {
        ...state,
        noteTitle: action.noteTitle,
        noteContent: action.noteContent,
      };
    case 'AUTOPOPULATE_SELECTED_FILE':
      return {
        ...state,
        selectedAthlete: action.selectedAthlete,
        selectedDate: action.selectedDate,
        selectedCategories: action.selectedCategories,
        updatedFileName: action.updatedFileName,
        selectedIssues: action.selectedIssues,
      };
    case 'CLEAR_FORM':
      return InitialFormState;
    default:
      return state;
  }
};

const useMedicalFileForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    InitialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useMedicalFileForm;
