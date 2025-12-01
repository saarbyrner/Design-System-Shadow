// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  OnUpdateAction,
  AdditionalUserSlice,
} from '@kitman/modules/src/AdditionalUsers/shared/types';

const initialState: AdditionalUserSlice = {
  formState: {
    firstname: '',
    lastname: '',
    email: '',
    date_of_birth: null,
    locale: '',
    is_active: true,
    primary_squad: null,
    assign_squad_ids: null,
  },
};

export const REDUCER_KEY: string = 'additionalUsersSlice';

const additionalUsersSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onUpdateForm: (
      state: AdditionalUserSlice,
      action: PayloadAction<OnUpdateAction>
    ) => {
      state.formState = {
        ...state.formState,
        ...action.payload,
      };
    },
    onReset: () => initialState,
  },
});

export const { onUpdateForm, onReset } = additionalUsersSlice.actions;
export default additionalUsersSlice;
