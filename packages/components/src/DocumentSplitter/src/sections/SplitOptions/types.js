// @flow
import { SPLIT_OPTIONS_DATA_KEY } from '@kitman/components/src/DocumentSplitter/src/shared/consts';

// Types
import type { SplitDocumentMode } from '@kitman/components/src/DocumentSplitter/src/shared/types';

export type DataKey = $Keys<typeof SPLIT_OPTIONS_DATA_KEY>;

export type Data = {
  splitDocument: SplitDocumentMode,
  numberOfSections: ?number,
  splitEvery: ?number,
  splitFrom: ?number,
};

export type PartialData = $Shape<Data>;

type ValidationErrors = {
  [DataKey]: Array<string>,
};

export type Validation = {
  errors: ValidationErrors,
  hasErrors: boolean,
};
