// ADR: packages/modules/src/HumanInput/shared/documentation/adr/004.registration-form-validation-state.md

// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { ValidationState } from '@kitman/modules/src/HumanInput/types/validation';
import { buildValidationState } from '@kitman/modules/src/HumanInput/shared/utils';

export type FormValidationState = {
  validation: ValidationState,
};

export const REDUCER_KEY: string = 'formValidationSlice';

export const initialState: FormValidationState = {
  validation: {},
};

type OnBuildFormStateAction = {
  payload: {
    elements: Array<FormElement>,
  },
};

type OnUpdateValidationAction = ValidationState;

const formValidationSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onResetValidation() {
      return initialState;
    },
    onBuildValidationState: (
      state: FormValidationState,
      action: PayloadAction<OnBuildFormStateAction>
    ) => {
      state.validation = Object.assign(
        {},
        ...action.payload.elements.map(buildValidationState)
      );
    },

    onUpdateValidation: (
      state: FormValidationState,
      action: PayloadAction<OnUpdateValidationAction>
    ) => {
      state.validation = {
        ...state.validation,
        ...action.payload,
      };
    },
  },
});

export const { onBuildValidationState, onUpdateValidation, onResetValidation } =
  formValidationSlice.actions;

export default formValidationSlice;
