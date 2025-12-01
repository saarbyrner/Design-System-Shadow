// @flow

export const eventActivityGlobalStates = {
  AllIn: 'all_in',
  Indeterminate: 'indeterminate',
  AllOut: 'all_out',
};
export type EventActivityGlobalStates = $Values<
  typeof eventActivityGlobalStates
>;

export type EventActivityGlobalStateResponse = {
  event_activity_id: number,
  state: EventActivityGlobalStates,
  count: number,
  total_count: number,
};

export type EventActivityGlobalState = {
  eventActivityId: number,
  state: EventActivityGlobalStates,
  count: number,
  totalCount: number,
};
