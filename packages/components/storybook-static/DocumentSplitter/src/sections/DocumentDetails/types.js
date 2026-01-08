// @flow
import { DOCUMENT_DETAILS_DATA_KEY } from '@kitman/components/src/DocumentSplitter/src/shared/consts';

// Types
import type { Option } from '@kitman/playbook/types';

export type DataKey = $Keys<typeof DOCUMENT_DETAILS_DATA_KEY>;

export type Data = {
  fileName: string,
  documentDate: ?string,
  documentCategories: Array<Option>,
  players: Array<Option>,
  playerIsPreselected: boolean,
  hasConstraintsError: boolean,
};

export type PartialData = $Shape<Data>;

type ValidationErrors = {
  [DataKey]: Array<string>,
};

export type Validation = {
  errors: ValidationErrors,
  hasErrors: boolean,
};
