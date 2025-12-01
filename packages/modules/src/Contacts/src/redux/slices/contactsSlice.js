// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { ContactWithId } from '@kitman/modules/src/Contacts/shared/types';

type ContactsGridSlice = {
  modal: {
    isOpen: boolean,
    contact: ContactWithId | null,
  },
};

export type OnSetModalState = {
  payload: {
    isOpen: boolean,
    contact?: string,
  },
};

export const initialState: ContactsGridSlice = {
  modal: {
    isOpen: false,
    contact: null,
  },
};

export const REDUCER_KEY: string = 'contactsSlice';

const contactsSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onToggleModal: (
      state: ContactsGridSlice,
      action: PayloadAction<OnSetModalState>
    ) => {
      state.modal.isOpen = action.payload.isOpen;
      state.modal.contact = action.payload?.contact;
    },
    reset: () => initialState,
  },
});

export const { onToggleModal, reset } = contactsSlice.actions;

export default contactsSlice;
