// @flow
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  type GenericDocument,
  type OrganisationGenericDocumentCategory,
} from '@kitman/services/src/services/documents/generic/redux/services/types';

export const REDUCER_KEY = 'genericDocumentsSlice';
export type GenericDocumentsState = {
  genericDocuments: { [key: string]: GenericDocument },
  genericDocumentsCategories: Array<OrganisationGenericDocumentCategory>,
};

type OnBuildGenericDocumentsStateAction = {
  payload: { documents: Array<GenericDocument> },
};

type OnBuildGenericDocumentsCategoriesStateAction = {
  payload: Array<OrganisationGenericDocumentCategory>,
};

const initialState: GenericDocumentsState = {
  genericDocuments: {},
  genericDocumentsCategories: [],
};

const genericDocumentsSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onReset: () => initialState,
    onBuildGenericDocumentsState: (
      state: GenericDocumentsState,
      action: PayloadAction<OnBuildGenericDocumentsStateAction>
    ) => {
      // build a map { [id]: Document } to quick access O(1) when we need a specific document
      state.genericDocuments = action.payload?.documents?.reduce(
        (map, document) => {
          const key = document?.id;

          if (!map[key]) {
            map[key] = document;
          }

          return map;
        },
        {}
      );
    },
    onBuildGenericDocumentsCategoriesState: (
      state: GenericDocumentsState,
      action: PayloadAction<OnBuildGenericDocumentsCategoriesStateAction>
    ) => {
      state.genericDocumentsCategories = action.payload || [];
    },
  },
});

export const {
  onReset,
  onBuildGenericDocumentsState,
  onBuildGenericDocumentsCategoriesState,
} = genericDocumentsSlice.actions;
export default genericDocumentsSlice;
