// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { State, PayloadAction } from '@reduxjs/toolkit';
import type { Option } from '@kitman/playbook/types';
import {
  DATA_KEY,
  type Validation,
  type Errors,
  type ExistingContact,
  type NewContact,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import type { DateRange } from '@kitman/common/src/types';

export const SEND_DRAWER_DATA_KEY = {
  sendTo: 'sendTo',
  savedContact: 'savedContact',
  newContact: 'newContact',
  subject: 'subject',
  message: 'message',
  includeCoverPage: 'includeCoverPage',
  athlete: 'athlete',
  documentDateRange: 'documentDateRange',
  documentFileTypes: 'documentFileTypes',
  documentCategories: 'documentCategories',
  selectedFiles: 'selectedFiles',
  attachedFiles: 'attachedFiles',
};

export type DataKey =
  | $Keys<typeof DATA_KEY>
  | $Keys<typeof SEND_DRAWER_DATA_KEY>;

export const SEND_TO_KEY = {
  savedContact: 'savedContact',
  newContact: 'newContact',
};

export type SendToKey = $Keys<typeof SEND_TO_KEY>;

export type DrawerData = {
  sendTo: SendToKey,
  savedContact: ?ExistingContact,
  newContact: ?NewContact,
  subject: ?string,
  message: ?string,
  includeCoverPage: boolean,
  athlete: ?Option,
  documentDateRange: ?DateRange,
  documentFileTypes: Array<Option>,
  documentCategories: Array<Option>,
  selectedFiles: Array<Option>,
  attachedFiles: Array<Attachment>,
};

type Payload = {
  [key: DataKey]: string | number | Option,
};

type DrawerSlice = {
  open: boolean,
  data: DrawerData,
  validation: Validation,
};

export const initialState: DrawerSlice = {
  open: false,
  data: {
    sendTo: SEND_TO_KEY.savedContact,
    savedContact: null,
    newContact: null,
    subject: null,
    message: null,
    includeCoverPage: true,
    athlete: null,
    documentDateRange: null,
    documentFileTypes: [],
    documentCategories: [],
    selectedFiles: [],
    attachedFiles: [],
  },
  validation: {
    errors: null,
  },
};

export const REDUCER_KEY: string = 'sendDrawerSlice';

const sendDrawerSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    updateOpen: (state: DrawerSlice, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    updateData: (state: DrawerSlice, action: PayloadAction<Payload>) => {
      state.data = { ...state.data, ...action.payload };
      // reset new contact data when changing to saved contact
      if (action.payload.sendTo === SEND_TO_KEY.savedContact) {
        state.data.newContact = null;
        state.validation.errors = {
          ...state.validation.errors,
          faxNumber: [],
          firstName: [],
          lastName: [],
          companyName: [],
        };
        // reset saved contact when changing to new contact
      } else if (action.payload.sendTo === SEND_TO_KEY.newContact) {
        state.data.savedContact = null;
        state.validation.errors = {
          ...state.validation.errors,
          savedContact: [],
        };
      }
    },
    attachSelectedFiles: (state: DrawerSlice) => {
      state.data.athlete = null;
      state.data.attachedFiles = [
        ...state.data.attachedFiles,
        ...state.data.selectedFiles
          .filter((option: Option) => option.file?.download_url)
          .map((option: Option) => option.file || {}),
      ];
      state.data.selectedFiles = [];
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

export const {
  updateOpen,
  updateData,
  attachSelectedFiles,
  updateValidation,
  reset,
} = sendDrawerSlice.actions;

export const selectOpen = (state: State) => state.sendDrawerSlice.open;
export const selectData = (state: State) => state.sendDrawerSlice.data;
export const selectValidation = (state: State) =>
  state.sendDrawerSlice.validation;

export default sendDrawerSlice;
