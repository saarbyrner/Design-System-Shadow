// @flow
import { createSelector } from '@reduxjs/toolkit';

import type {
  HumanInputState,
  ExportSidePanelState,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/humanInputSlice';

import { REDUCER_KEY } from '@kitman/modules/src/HumanInput/shared/redux/slices/humanInputSlice';

type Store = {
  humanInputSlice: HumanInputState,
};

export const getExportSidePanelState = (state: Store): ExportSidePanelState =>
  state[REDUCER_KEY].exportSidePanel;

export const getExportFormState = (state: Store): ExportSidePanelState =>
  state[REDUCER_KEY].exportSidePanel.form;

export const getIsOpenExportSidePanelFactory = (): boolean =>
  createSelector(
    [getExportSidePanelState],
    (exportSidePanelState) => exportSidePanelState?.isOpen
  );

export const getExportFormFactory = (): boolean =>
  createSelector(
    [getExportFormState],
    (exportFormState) => exportFormState || {}
  );
