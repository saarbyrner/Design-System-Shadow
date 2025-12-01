// @flow
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';

export type CSVAthlete = {
  FirstName: string,
  LastName: string,
  Email: string,
  DOB: string,
  SquadName: string,
  Country: string,
  Position: string,
};

export type AthleteValidationState = {
  FirstName: ?string,
  LastName: ?string,
  Email: ?string,
  DOB: ?string,
  SquadName: ?string,
  Country: ?string,
  Position: ?string,
};

export type CSVStaff = {
  FirstName: string,
  LastName: string,
  Email: string,
  DOB: string,
  SquadName: string,
};

export type StaffValidationState = {
  FirstName: ?string,
  LastName: ?string,
  Email: ?string,
  DOB: ?string,
  SquadName: ?string,
};

export type CSVOfficial = {
  FirstName: string,
  LastName: string,
  Email: string,
  DOB: string,
  Language: string,
};

export type CSVStaffAssignment = {
  'Game ID': string,
  Email: string,
};

export type CSVScouts = CSVOfficial & {
  Type: string,
};

export type OfficialValidationState = {
  FirstName: ?string,
  LastName: ?string,
  Email: ?string,
  DOB: ?string,
  Language: ?string,
};

export type CSVStaffAssignmentValidationState = {
  'Game ID': ?string,
  Email: ?string,
};

export type ScoutValidationState = OfficialValidationState & {
  Type: ?string,
};

export type CSVMatchMonitor = CSVStaff & {
  Language: string,
  Type: string,
};
export type MatchMonitorValidationState = StaffValidationState & {
  Language: ?string,
  Type: ?string,
};

export type ValidationState = {
  [key: string]: ?string,
};

export type UploadQueue = {
  attachment: ?AttachedFile,
};

export type ParseState =
  | 'DORMANT'
  | 'PROCESSING'
  | 'COMPLETE'
  | 'ERROR'
  | 'FILE_POND_ERROR'
  | 'SUCCESS';

export type PapaParseError = {
  type: 'FieldMismatch' | 'Quotes' | 'Delimiter',
  code:
    | 'MissingQuotes'
    | 'UndetectableDelimiter'
    | 'TooFewFields'
    | 'TooManyFields'
    | 'TooManyFields',
  message: string,
  row: number,
};

export type PapaParseMeta = {
  delimiter: string,
  linebreak: string,
  aborted: boolean,
  fields: Array<string>,
  truncated: boolean,
  renamedHeaders: Array<string>,
};

export type ParseResult = {
  data: Array<{ [key: string]: string }>,
  errors: Array<PapaParseError>,
  meta: ?PapaParseMeta,
};

export type ReturnType = {
  onHandleParseCSV: Function,
  onRemoveCSV: Function,
  queueState: UploadQueue,
  parseResult: ParseResult,
  setParseState: Function,
  parseState: ParseState,
  isDisabled: boolean,
};

// https://www.papaparse.com/docs#config
export type PapaParseConfig = {
  delimiter?: string,
  newline?: string,
  quoteChar?: string,
  escapeChar?: string,
  header?: boolean,
  transformHeader?: null,
  dynamicTyping?: boolean,
  preview?: number,
  encoding?: string,
  worker?: boolean,
  comments?: boolean,
  step?: null,
  complete?: null,
  error?: null,
  download?: boolean,
  downloadRequestHeaders?: null,
  downloadRequestBody?: null,
  skipEmptyLines?: boolean,
  chunk?: null,
  chunkSize?: null,
  fastMode?: null,
  beforeFirstChunk?: null,
  withCredentials?: null,
  transform?: null,
  delimitersToGuess?: Array<string>,
};

export type RuleSet = {
  description: string,
  exampleText: string,
  exampleList: Array<string | number | boolean>,
};

export type UserTypes =
  | 'official'
  | 'official_assignment'
  | 'match_monitor_assignment'
  | 'athlete'
  | 'scout'
  | 'user'
  | 'growth_and_maturation'
  | 'baselines'
  | 'league_benchmarking'
  | 'training_variable_answer'
  | 'match_monitor';

export type DataTypeGuideline = {
  label: string,
  acceptedValues: Array<string>,
  isRequired?: boolean,
  caseInsensitive?: boolean,
  key?: string,
};
