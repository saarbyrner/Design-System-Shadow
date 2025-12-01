// @flow
export type SourceType = 'CSV' | string;
export type Row = {
  id: string,
  submissionDate: string,
  sourceNameAndImportTypeAndName: {
    sourceName: SourceType,
    importTypeAndName: string,
  },
  submissionStatus: string,
  exportSuccessCsv: null,
};
export type SourceToDelete = {
  id: string,
  type: SourceType,
};
