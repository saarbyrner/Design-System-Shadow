// @flow
import { createSelector } from '@reduxjs/toolkit';
import {
  type GenericDocument,
  type OrganisationGenericDocumentCategory,
} from '@kitman/services/src/services/documents/generic/redux/services/types';
import {
  type GenericDocumentsState,
  REDUCER_KEY,
} from '@kitman/services/src/services/documents/generic/redux/slices/genericDocumentsSlice';

type Store = {
  genericDocumentsSlice: GenericDocumentsState,
};

export const getGenericDocumentsState = (state: Store): GenericDocumentsState =>
  state[REDUCER_KEY] || {};

export const getGenericDocumentsFactory = (): Array<GenericDocument> =>
  createSelector(
    [getGenericDocumentsState],
    (genericDocumentsState) =>
      Object.values(genericDocumentsState?.genericDocuments || {}) || []
  );

export const getGenericDocumentFactory = (id: number): GenericDocument =>
  createSelector([getGenericDocumentsState], (genericDocumentsState) => {
    const genericDocumentsMap = genericDocumentsState?.genericDocuments || {};

    return genericDocumentsMap[id] || {};
  });

export const getGenericDocumentsCategoriesFactory =
  (): Array<OrganisationGenericDocumentCategory> =>
    createSelector(
      [getGenericDocumentsState],
      (genericDocumentsState) =>
        genericDocumentsState?.genericDocumentsCategories || []
    );
