// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../../utils/index';
import type {
  FormState,
  ValidationState,
  CreateMovementState,
} from '../../types';

type OnUpdateCreateMovementFormAction = {
  payload: $Shape<FormState>,
};

type OnUpdateValidationAction = ValidationState;

export const REDUCER_KEY: string = 'UserMovement.slice.createMovement';

const createMovementSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onToggleDrawer: (state: CreateMovementState) => {
      state.drawer.isOpen = !state.drawer.isOpen;
    },
    onToggleModal: (state: CreateMovementState) => {
      state.modal.isOpen = !state.modal.isOpen;
    },
    onUpdateCreateMovementForm: (
      state: CreateMovementState,
      action: PayloadAction<OnUpdateCreateMovementFormAction>
    ) => {
      state.form = {
        ...state.form,
        ...action.payload,
      };
    },
    onUpdateValidation: (
      state: ValidationState,
      action: PayloadAction<OnUpdateValidationAction>
    ) => {
      state.validation = {
        ...state.validation,
        ...action.payload,
      };
    },

    onReset: () => initialState,
  },
});

export const {
  onReset,
  onToggleDrawer,
  onUpdateCreateMovementForm,
  onToggleModal,
  onUpdateValidation,
} = createMovementSlice.actions;
export default createMovementSlice;
