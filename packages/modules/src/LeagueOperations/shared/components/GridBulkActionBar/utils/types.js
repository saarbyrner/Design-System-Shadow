// @flow
export type BulkActionsData = {
  selectedAthleteIds: Array<{ id: number, userId: number }>,
  originalSelectedLabelIds: Array<number>,
  selectedLabelIds: Array<number>,
};
export type SelectedAthleteIds = $PropertyType<
  BulkActionsData,
  'selectedAthleteIds'
>;
