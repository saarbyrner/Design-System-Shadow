// @flow
import {
  GRID_ROW_FIELD_KEYS,
  SPLIT_DOCUMENT_MODES,
  DOCUMENT_SPLITTER_USAGE,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';

// Types
import type { GridColDef, GridRow } from '@mui/x-data-grid-pro';
import type { Option } from '@kitman/playbook/types';

export type DocumentSplitterUsage = $Values<typeof DOCUMENT_SPLITTER_USAGE>;

export type DocumentSplitterStep = 'documentDetails' | 'allocations';

export type SplitDocumentMode = $Values<typeof SPLIT_DOCUMENT_MODES>;

export type GridConfig = {
  rows: Array<GridRow>,
  columns: Array<GridColDef>,
  emptyTableText: string,
  id: string,
};

export type DetailsGridRowData = {
  id: number,
  pages: string,
  player: ?Option,
  categories: Array<Option>,
  fileName: string,
  dateOfDocument: string,
  associatedIssues: Array<Option>,
  hasConstraintsError: boolean,
};
export type DetailsGridRowDataPartial = $Shape<DetailsGridRowData>;

export type GridRowDataKey = $Keys<typeof GRID_ROW_FIELD_KEYS>;

// NOTE:
// string key will be row id
// When value is false that means failed validation
export type ColumnValidation = { [string]: boolean };

export type ValidationResults = {
  [GridRowDataKey]: ColumnValidation,
};

export type UpdateRowPayload = {
  rowId: number,
  data: DetailsGridRowDataPartial,
};

export type DeleteRowPayload = {
  rowId: number,
};

export type SetupDefaultsPayload = {
  defaultCategories: Array<Option>,
  defaultFileName: string,
  defaultDateOfDocument: string,
};

export type OnUpdateRowCallback = (payload: UpdateRowPayload) => void;

export type OnDeleteRowCallback = (payload: DeleteRowPayload) => void;
