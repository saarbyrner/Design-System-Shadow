// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  SetFilterActionPayload,
  SharedFilters,
} from '@kitman/modules/src/DynamicCohorts/shared/utils/types';
import { getInitialFilters } from '@kitman/modules/src/DynamicCohorts/shared/utils/consts';

export type ManageSegmentsState = {
  nextId: number | null,
  filters: SharedFilters,
};

export const getInitialState = (): ManageSegmentsState => {
  return {
    nextId: null,
    filters: {
      ...getInitialFilters(),
      labels: [],
    },
  };
};

const manageSegmentsSlice = createSlice({
  name: 'manageSegmentsSlice',
  initialState: getInitialState(),
  reducers: {
    setNextId: (
      state: ManageSegmentsState,
      { payload }: { payload: number }
    ) => {
      state.nextId = payload;
    },
    resetNextId: (state: ManageSegmentsState) => {
      state.nextId = null;
    },
    setFilter: (
      state: ManageSegmentsState,
      { payload: { key, value } }: PayloadAction<SetFilterActionPayload>
    ) => {
      // always set next id to null when changing the filter
      state.nextId = null;
      state.filters[key] = value;
    },
  },
});

export const { setNextId, resetNextId, setFilter } =
  manageSegmentsSlice.actions;

export default manageSegmentsSlice;
