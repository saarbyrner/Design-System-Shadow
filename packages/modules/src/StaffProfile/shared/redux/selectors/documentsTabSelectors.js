// @flow
import { createSelector } from '@reduxjs/toolkit';
import { type Mode } from '@kitman/modules/src/HumanInput/types/forms';
import {
  REDUCER_KEY,
  initialFilters,
} from '@kitman/modules/src/StaffProfile/shared/redux/slices/documentsTabSlice';

import type {
  DocumentsTabState,
  DocumentSidePanelState,
  DocumentsTabFilters,
} from '@kitman/modules/src/StaffProfile/shared/redux/slices/documentsTabSlice';

type Store = {
  documentsTabSlice: DocumentsTabState,
};

export const getDocumentSidePanelState = (
  state: Store
): DocumentSidePanelState => state[REDUCER_KEY].documentSidePanel;

export const getDocumentFormState = (state: Store): DocumentSidePanelState =>
  state[REDUCER_KEY].documentSidePanel.form;

export const getFiltersState = (state: Store): DocumentsTabFilters =>
  state[REDUCER_KEY].filters;

export const getIsOpenDocumentSidePanelFactory = (): boolean =>
  createSelector(
    [getDocumentSidePanelState],
    (documentSidePanelState) => documentSidePanelState?.isOpen
  );

export const getDocumentFormFactory = (): DocumentSidePanelState =>
  createSelector(
    [getDocumentFormState],
    (documentFormState) => documentFormState || {}
  );

export const getFiltersFactory = (): DocumentsTabFilters =>
  createSelector([getFiltersState], (filters) => filters || initialFilters);

export const getModeFactory = (): Mode =>
  createSelector(
    [getDocumentSidePanelState],
    (documentSidePanelState) => documentSidePanelState?.mode
  );
