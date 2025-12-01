// ADR: packages/modules/src/HumanInput/shared/documentation/adr/001.registration-form-state.md
// ADR: packages/modules/src/HumanInput/shared/documentation/adr/003.registration-element-state.md

// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type {
  FieldState,
  FormAnswer,
  FormConfig,
  Mode,
  FormElement,
  ElementState,
  HumanInputForm,
  HumanInputAthlete,
} from '@kitman/modules/src/HumanInput/types/forms';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import {
  setFormAnswer,
  buildFormState,
  createElementMap,
} from '@kitman/modules/src/HumanInput/shared/utils';

export type FormState = {
  originalForm: FieldState,
  form: FieldState,
  elements: ElementState,
  structure: HumanInputForm,
  config: FormConfig,
};

export const REDUCER_KEY: string = 'formStateSlice';

export const initialState: FormState = {
  originalForm: {}, // needed to restore the form values if the user wants to discard their changes.
  form: {},
  elements: {},
  structure: {},
  config: {
    mode: MODES.VIEW,
    showMenuIcons: false,
    showUnsavedChangesModal: false,
    shouldShowMenu: true,
    lastSaved: null,
    showRecoveryModal: false,
    localDraft: null,
  },
};

type OnBuildFormStateAction = {
  payload: {
    elements: Array<FormElement>,
  },
};

type OnShowRecoveryModalAction = {
  payload: {
    timestamp: string,
    data: FieldState,
  },
};

type OnRestoreDraftAction = {
  payload: {
    answers: FieldState,
  },
};

type OnSetFormAnswerSetAction = {
  payload: {
    formAnswers: Array<FormAnswer>,
  },
};

type OnSetFormStructure = {
  payload: {
    structure: HumanInputForm,
  },
};

type OnUpdateFormStructure = {
  payload: {
    updatedStructure: $Shape<HumanInputForm>,
  },
};

type OnUpdateFieldAction = {
  payload: {
    [id: number]: string | number | boolean | [] | null,
  },
};

type OnUpdateShowIconsAction = {
  payload: {
    showMenuIcons: boolean,
  },
};

type OnUpdateShowUnsavedChangesModalAction = {
  payload: {
    showUnsavedChangesModal: boolean,
  },
};

type OnRestoreFormAction = {
  payload: {
    originalForm: FieldState,
  },
};

type SetModeAction = {
  payload: {
    mode: Mode,
  },
};

type OnSetFormAnswersSetIdAction = {
  payload: {
    id: number,
  },
};

type OnSyncOriginalStateAction = {
  payload: {
    answers: FieldState,
  },
};

type SetAthleteDataAction = {
  payload: {
    athlete: HumanInputAthlete,
  },
};

const formStateSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onResetForm() {
      return initialState;
    },
    onSetFormStructure: (
      state: FormState,
      action: PayloadAction<OnSetFormStructure>
    ) => {
      state.structure = action.payload.structure;
    },
    onUpdateFormStructure: (
      state: FormState,
      action: PayloadAction<OnUpdateFormStructure>
    ) => {
      state.structure = { ...state.structure, ...action.payload.structure };
    },
    onBuildFormState: (
      state: FormState,
      action: PayloadAction<OnBuildFormStateAction>
    ) => {
      state.form = Object.assign(
        {},
        ...action.payload.elements.map(buildFormState)
      );
      state.elements = Object.assign(
        {},
        ...action.payload.elements.map(createElementMap)
      );
    },
    onSetFormAnswersSet: (
      state: FormState,
      action: PayloadAction<OnSetFormAnswerSetAction>
    ) => {
      state.form = Object.assign(
        state.form,
        ...action.payload.formAnswers.map(setFormAnswer)
      );
      // if the user decides to discard changes we need to restore
      // the form values to its original values, we need to save a copy of the initial/un-modified values.
      state.originalForm = JSON.parse(JSON.stringify(state.form));
    },
    onSetFormAnswersSetId: (
      state: FormState,
      action: PayloadAction<OnSetFormAnswersSetIdAction>
    ) => {
      state.structure.id = action.payload.id;
    },
    onClearFormAnswersSetId: (state) => {
      state.structure.id = null;
    },
    onSyncOriginalState: (
      state: FormState,
      action: PayloadAction<OnSyncOriginalStateAction>
    ) => {
      state.originalForm = {
        ...state.originalForm,
        ...action.payload.answers,
      };
    },
    onSetLastSaved: (state: FormState, action: PayloadAction<string>) => {
      state.config.lastSaved = action.payload;
    },
    onUpdateField: (
      state: FormState,
      action: PayloadAction<OnUpdateFieldAction>
    ) => {
      state.form = {
        ...state.form,
        ...action.payload,
      };
    },
    onUpdateShowMenuIcons: (
      state: FormState,
      action: PayloadAction<OnUpdateShowIconsAction>
    ) => {
      state.config = {
        ...state.config,
        ...action.payload,
      };
    },
    onUpdateShouldShowMenu: (
      state: FormState,
      action: PayloadAction<boolean>
    ) => {
      state.config = {
        ...state.config,
        shouldShowMenu: action.payload,
      };
    },
    onSetAthleteData: (state: FormState, action: SetAthleteDataAction) => {
      state.structure.athlete = action.payload.athlete;
    },
    onSetMode: (state: FormState, action: SetModeAction) => {
      state.config.mode = action.payload.mode;
    },
    onUpdateShowUnsavedChangesModal: (
      state: FormState,
      action: OnUpdateShowUnsavedChangesModalAction
    ) => {
      state.config.showUnsavedChangesModal =
        action.payload.showUnsavedChangesModal;
    },
    onRestoreForm: (state: FormState, action: OnRestoreFormAction) => {
      state.form = action.payload.originalForm;
    },
    onShowRecoveryModal: (
      state: FormState,
      action: PayloadAction<OnShowRecoveryModalAction>
    ) => {
      state.config.showRecoveryModal = true;
      state.config.localDraft = action.payload;
    },
    onHideRecoveryModal: (state: FormState) => {
      state.config.showRecoveryModal = false;
      state.config.localDraft = null;
    },
    onRestoreDraft: (
      state: FormState,
      action: PayloadAction<OnRestoreDraftAction>
    ) => {
      state.form = {
        ...state.form,
        ...action.payload.answers,
      };
    },
  },
});

export const {
  onSetFormStructure,
  onBuildFormState,
  onUpdateField,
  onResetForm,
  onSetFormAnswersSet,
  onSetFormAnswersSetId,
  onClearFormAnswersSetId,
  onSyncOriginalState,
  onSetLastSaved,
  onUpdateShowMenuIcons,
  onUpdateShowUnsavedChangesModal,
  onSetMode,
  onRestoreForm,
  onUpdateFormStructure,
  onUpdateShouldShowMenu,
  onSetAthleteData,
  onShowRecoveryModal,
  onHideRecoveryModal,
  onRestoreDraft,
} = formStateSlice.actions;

export default formStateSlice;
