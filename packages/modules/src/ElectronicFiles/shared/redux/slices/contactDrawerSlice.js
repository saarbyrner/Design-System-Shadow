// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { State, PayloadAction } from '@reduxjs/toolkit';
import type { Option } from '@kitman/playbook/types';
import {
  type Validation,
  type Errors,
  type ContactFormData,
} from '@kitman/modules/src/ElectronicFiles/shared/types';

export const CONTACT_DRAWER_DATA_KEY = {
  contact: 'contact',
};

export type DataKey = $Keys<typeof CONTACT_DRAWER_DATA_KEY>;

type Payload = {
  [key: DataKey]: string | number | Option,
};

type DrawerSlice = {
  open: boolean,
  data: ContactFormData,
  validation: Validation,
};

export const initialState: DrawerSlice = {
  open: false,
  data: {
    contact: null,
  },
  validation: {
    errors: null,
  },
};

export const REDUCER_KEY: string = 'contactDrawerSlice';

const contactDrawerSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    updateOpen: (state: DrawerSlice, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    updateData: (state: DrawerSlice, action: PayloadAction<Payload>) => {
      state.data = { ...state.data, ...action.payload };
    },
    updateValidation: (state: DrawerSlice, action: PayloadAction<Errors>) => {
      state.validation.errors = {
        ...state.validation.errors,
        ...action.payload,
      };
    },
    reset: () => initialState,
  },
});

export const { updateOpen, updateData, updateValidation, reset } =
  contactDrawerSlice.actions;

export const selectOpen = (state: State) => state.contactDrawerSlice.open;
export const selectData = (state: State) => state.contactDrawerSlice.data;
export const selectValidation = (state: State) =>
  state.contactDrawerSlice.validation;

export default contactDrawerSlice;
