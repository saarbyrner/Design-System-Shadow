// @flow
import { gridClasses } from '@mui/x-data-grid';
import i18n from '@kitman/common/src/utils/i18n';
import { toastStatusEnumLike as toastStatuses } from '@kitman/components/src/Toast/enum-likes';

export const POSITIVE_NUMERIC_REGEX = /^[0-9]+$/; // Positive numbers as no minus sign

export const PAGE_RANGE_REGEX = /^[0-9]+(?:(?:\s*,\s*|-)[0-9]+)*$/; // 1 OR 1-3 OR 1, 3, 4-6
export const GREEDY_NUMBER_REGEX = /\d+/g; // applied to abc12de3 would find 12, 3

export const DOCUMENT_SPLITTER_USAGE = {
  massScanning: 'massScanning',
  electronicFiles: 'electronicFiles',
};

export const SPLIT_DOCUMENT_MODES = {
  noSplitting: 'noSplitting',
  intoSections: 'intoSections',
  everyX: 'everyX',
};

export const TOAST_KEY = {
  SPLIT_DOCUMENT_SUCCESS_TOAST: 'SPLIT_DOCUMENT_SUCCESS_TOAST',
  SPLIT_DOCUMENT_ERROR_TOAST: 'SPLIT_DOCUMENT_ERROR_TOAST',
};

export const splitDocumentSuccessToast = () => ({
  id: TOAST_KEY.SPLIT_DOCUMENT_SUCCESS_TOAST,
  status: toastStatuses.Success,
  title: i18n.t('Document pages assigned to players'),
});

export const splitDocumentErrorToast = (message?: string) => ({
  id: TOAST_KEY.SPLIT_DOCUMENT_ERROR_TOAST,
  status: toastStatuses.Error,
  title: message || i18n.t('Unable to assign document pages to players'),
});

export const DOCUMENT_DETAILS_DATA_KEY = {
  fileName: 'fileName',
  documentDate: 'documentDate',
  documentCategories: 'documentCategories',
  players: 'players',
};

export const SPLIT_OPTIONS_DATA_KEY = {
  splitDocument: 'splitDocument',
  numberOfSections: 'numberOfSections',
  splitEvery: 'splitEvery',
  splitFrom: 'splitFrom',
};

export const GRID_ROW_FIELD_KEYS = {
  pages: 'pages',
  player: 'player',
  categories: 'categories',
  fileName: 'fileName',
  dateOfDocument: 'dateOfDocument',
  associatedIssues: 'associatedIssues',
  hasConstraintsError: 'hasConstraintsError',
  actions: 'actions',
};

export const MUI_DATAGRID_STYLES_OVERRIDE = {
  sx: {
    outline: 'none',
    border: 0,
    boxShadow: 0,
    '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '.MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell': {
      overflow: 'visible',
    },
    '.MuiDataGrid-columnHeader:focus, .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '.MuiDataGrid-columnHeader:first-of-type, .MuiDataGrid-cell:first-of-type':
      {
        paddingLeft: '24px',
      },
    [`.${gridClasses.row}:not(.${gridClasses.row}--dynamicHeight)>.${gridClasses.cell}`]:
      {
        overflow: 'visible',
      },
    [`.${gridClasses.columnHeader}:focus, .${gridClasses.cell}:focus`]: {
      outline: 'none',
    },
    [`.${gridClasses.cell}`]: {
      paddingTop: '4px',
      paddingBottom: '4px',
      paddingLeft: '2px',
      paddingRight: '2px',
    },
  },
};
