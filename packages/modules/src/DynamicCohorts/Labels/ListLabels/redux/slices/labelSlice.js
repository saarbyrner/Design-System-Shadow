// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Validation } from '@kitman/common/src/types';

export type LabelFormState = {
  id: ?number,
  name: ?string,
  description: ?string,
  color: ?string,
};

type LabelSlice = {
  formState: LabelFormState,
  errorState: Array<Validation>,
  isEditing: boolean,
};

type OnUpdateFormAction = {
  payload: $Shape<LabelFormState>,
};

type OnUpdateErrorAction = {
  payload: $Shape<string>,
};

export const getInitialState = (): LabelSlice => {
  return {
    formState: {
      id: undefined,
      name: '',
      description: '',
      color: '',
    },
    errorState: [],
    isEditing: false,
  };
};

const labelSlice = createSlice({
  name: 'labelSlice',
  initialState: getInitialState(),
  reducers: {
    onUpdateForm: (
      state: LabelSlice,
      action: PayloadAction<OnUpdateFormAction>
    ) => {
      state.formState = {
        ...state.formState,
        ...action.payload,
      };
    },
    onUpdateErrorState: (
      state: LabelSlice,
      action: PayloadAction<OnUpdateErrorAction>
    ) => {
      state.errorState = [
        {
          isValid: false,
          message: action.payload,
        },
      ];
    },
    onClearErrorState: (state: LabelSlice) => {
      state.errorState = [];
    },
    onStartEditing: (state: LabelSlice) => {
      state.isEditing = true;
    },
    onReset: () => getInitialState(),
  },
});

export const {
  onUpdateForm,
  onUpdateErrorState,
  onClearErrorState,
  onStartEditing,
  onReset,
} = labelSlice.actions;
export default labelSlice;
