// @flow

export const getLoadMoreDailyStatusReportData = (
  nextSetOfRowsToFetch: ?number
): { nextSetOfRowsToFetch: ?number } => ({
  nextSetOfRowsToFetch,
});

export const getCreateBulkDailyStatusReportNotesData = (
  athleteIds: Array<number>
): { athleteIds: Array<number> } => ({
  athleteIds,
});

export const getCreateSingleDailyStatusReportNoteData = (
  athleteId: number
): { athleteId: number } => ({
  athleteId,
});
