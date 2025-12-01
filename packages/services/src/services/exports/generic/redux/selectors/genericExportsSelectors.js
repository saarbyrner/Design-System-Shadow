// @flow
import { createSelector } from '@reduxjs/toolkit';

import {
  type GenericExportsState,
  REDUCER_KEY,
} from '@kitman/services/src/services/exports/generic/redux/slices/genericExportsSlice';

type Store = {
  genericExportsSlice: GenericExportsState,
};

export const getExportableFieldsState = (state: Store): GenericExportsState =>
  state[REDUCER_KEY].exportableFields;

export const getExportableFieldsFactory = (): boolean =>
  createSelector(
    [getExportableFieldsState],
    (exportableFields) => exportableFields || []
  );
