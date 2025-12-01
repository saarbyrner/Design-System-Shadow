// @flow
import { createSlice } from '@reduxjs/toolkit';

import { SPLIT_DOCUMENT_MODES } from '@kitman/components/src/DocumentSplitter/src/shared/consts';

// Types
import type { State, PayloadAction } from '@reduxjs/toolkit';
import type {
  Data as DocumentDetailsData,
  PartialData as DocumentDetailsPartialData,
} from '@kitman/components/src/DocumentSplitter/src/sections/DocumentDetails/types';
import type {
  Data as SplitOptionsData,
  PartialData as SplitOptionsPartialData,
} from '@kitman/components/src/DocumentSplitter/src/sections/SplitOptions/types';

type SplitSetupSlice = {
  documentDetails: DocumentDetailsData,
  splitOptions: SplitOptionsData,
};

export const initialState: SplitSetupSlice = {
  documentDetails: {
    fileName: '',
    documentDate: '',
    documentCategories: [],
    players: [],
    playerIsPreselected: false,
    hasConstraintsError: false,
  },
  splitOptions: {
    splitDocument: SPLIT_DOCUMENT_MODES.noSplitting,
    numberOfSections: 1,
    splitEvery: null,
    splitFrom: 1,
  },
};

export const REDUCER_KEY: string = 'documentSplitterSplitSetupSlice';

const splitSetupSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    reset: (
      state: SplitSetupSlice,
      action: ?PayloadAction<DocumentDetailsPartialData>
    ) => ({
      ...initialState,
      documentDetails: {
        ...initialState.documentDetails,
        ...(action?.payload ? action.payload : {}),
      },
    }),
    updateDetails: (
      state: SplitSetupSlice,
      action: PayloadAction<DocumentDetailsPartialData>
    ) => {
      state.documentDetails = { ...state.documentDetails, ...action.payload };
    },
    updateSplitOptions: (
      state: SplitSetupSlice,
      action: PayloadAction<SplitOptionsPartialData>
    ) => {
      state.splitOptions = { ...state.splitOptions, ...action.payload };
    },
  },
});

export const { updateDetails, updateSplitOptions, reset } =
  splitSetupSlice.actions;

export const selectDocumentDetails = (state: State) =>
  state.splitSetupSlice.documentDetails;
export const selectSplitOptions = (state: State) =>
  state.splitSetupSlice.splitOptions;

export default splitSetupSlice;
