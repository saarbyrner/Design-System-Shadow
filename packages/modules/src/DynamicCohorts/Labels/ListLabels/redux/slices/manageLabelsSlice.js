// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  SetFilterActionPayload,
  SharedFilters,
} from '@kitman/modules/src/DynamicCohorts/shared/utils/types';
import { getInitialFilters } from '@kitman/modules/src/DynamicCohorts/shared/utils/consts';

export type ManageLabelsState = {
  isLabelModalOpen: boolean,
  filters: SharedFilters,
  nextId: number | null,
};

const initialState: ManageLabelsState = {
  isLabelModalOpen: false,
  nextId: null,
  filters: {
    ...getInitialFilters(),
  },
};

const manageLabelsSlice = createSlice({
  name: 'manageLabelsSlice',
  initialState,
  reducers: {
    onOpenLabelModal: (state: ManageLabelsState) => {
      state.isLabelModalOpen = true;
    },
    onCloseLabelModal: (state: ManageLabelsState) => {
      state.isLabelModalOpen = false;
    },
    setFilter: (
      state: ManageLabelsState,
      { payload: { key, value } }: PayloadAction<SetFilterActionPayload>
    ) => {
      // always set next id to null when changing the filter
      state.nextId = null;
      state.filters[key] = value;
    },
    setNextId: (state: ManageLabelsState, { payload }: { payload: number }) => {
      state.nextId = payload;
    },
    resetNextId: (state: ManageLabelsState) => {
      state.nextId = null;
    },
  },
});

export const {
  onOpenLabelModal,
  onCloseLabelModal,
  setFilter,
  setNextId,
  resetNextId,
} = manageLabelsSlice.actions;

export default manageLabelsSlice;
