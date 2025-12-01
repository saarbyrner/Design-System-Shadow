// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';

type EventSelectedDateRange = {
  start_date: string,
  end_date: string,
};
export type EventSwitchFilters = {
  date_range: EventSelectedDateRange,
};
type SetFiltersAction = {
  payload: Array<EventSwitchFilters>,
};

type EventSwitchSearchState = {
  filters: EventFilters,
  nextId: ?number,
};
export type EventSwitcherSlice = {
  isEventSwitcherOpen: boolean,
  searchState: EventSwitchSearchState,
};

const initialState: EventSwitcherSlice = {
  isEventSwitcherOpen: false,
  searchState: {
    filters: {
      dateRange: {
        start_date: '',
        end_date: '',
      },
      eventTypes: [],
      competitions: [],
      gameDays: [],
      oppositions: [],
    },
    nextId: null,
  },
};

const EventSelectSlice = createSlice({
  name: 'eventSelectSlice',
  initialState,
  reducers: {
    onOpenEventSelect: (state: EventSelectSlice) => {
      state.isEventSwitcherOpen = true;
    },
    onCloseEventSelect: () => initialState,
    onUpdateFilters: (state: EventSelectSlice, action: SetFiltersAction) => {
      state.searchState = action.payload;
    },
  },
});

export const { onOpenEventSelect, onCloseEventSelect, onUpdateFilters } =
  EventSelectSlice.actions;

export default EventSelectSlice;
