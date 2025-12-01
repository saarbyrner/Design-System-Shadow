// @flow
import i18n from '@kitman/common/src/utils/i18n';

import {
  GRID_ROW_FIELD_KEYS as FIELD_KEYS,
  DOCUMENT_SPLITTER_USAGE,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import {
  renderCell,
  renderActions,
  renderPlayerSelect,
  renderCategoriesSelect,
} from '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid/Cells';
import IssuesCell from '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid/IssuesCell';

// Types
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import type { Option } from '@kitman/playbook/types';
import type {
  ColumnValidation,
  OnUpdateRowCallback,
  OnDeleteRowCallback,
  ValidationResults,
  DocumentSplitterUsage,
} from '@kitman/components/src/DocumentSplitter/src/shared/types';

export const getPagesColumn = (
  onUpdateRowCallback: OnUpdateRowCallback,
  columnValidation: ?ColumnValidation,
  shouldDisable: boolean
) => ({
  field: FIELD_KEYS.pages,
  headerName: i18n.t('Pages'),
  minWidth: 116,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams<any>) =>
    renderCell(
      params,
      onUpdateRowCallback,
      columnValidation?.[params.id.toString()] === false,
      shouldDisable
    ),
});

export const getPlayerColumn = (
  onUpdateRowCallback: OnUpdateRowCallback,
  columnValidation: ?ColumnValidation,
  players: Array<Option>,
  shouldShowLoading: boolean,
  shouldDisable: boolean
) => ({
  field: FIELD_KEYS.player,
  headerName: i18n.t('Player'),
  visible: true,
  sortable: false,
  minWidth: 200,
  flex: 1,
  renderCell: (params: GridRenderCellParams<any>) =>
    renderPlayerSelect(
      params,
      onUpdateRowCallback,
      players,
      shouldShowLoading,
      columnValidation?.[params.id.toString()] === false,
      shouldDisable
    ),
});

export const getCategoriesColumn = (
  onUpdateRowCallback: OnUpdateRowCallback,
  columnValidation: ?ColumnValidation,
  categories: Array<Option>,
  shouldShowLoading: boolean,
  shouldDisable: boolean
) => ({
  field: FIELD_KEYS.categories,
  headerName: i18n.t('Categories'),
  flex: 1,
  minWidth: 150,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams<any>) =>
    renderCategoriesSelect(
      params,
      onUpdateRowCallback,
      categories,
      shouldShowLoading,
      columnValidation?.[params.id.toString()] === false,
      shouldDisable
    ),
});

export const getFileNameColumn = (
  onUpdateRowCallback: OnUpdateRowCallback,
  columnValidation: ?ColumnValidation,
  shouldDisable: boolean
) => ({
  field: FIELD_KEYS.fileName,
  headerName: i18n.t('File name'),
  visible: true,
  sortable: false,
  minWidth: 150,
  flex: 1,
  renderCell: (params: GridRenderCellParams<any>) =>
    renderCell(
      params,
      onUpdateRowCallback,
      columnValidation?.[params.id.toString()] === false,
      shouldDisable
    ),
});

export const getDateColumn = (
  onUpdateRowCallback: OnUpdateRowCallback,
  columnValidation: ?ColumnValidation,
  shouldDisable: boolean
) => ({
  field: FIELD_KEYS.dateOfDocument,
  headerName: i18n.t('Date of document'),
  minWidth: 200,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams<any>) =>
    renderCell(
      params,
      onUpdateRowCallback,
      columnValidation?.[params.id.toString()] === false ||
        params.row[FIELD_KEYS.hasConstraintsError],
      shouldDisable
    ),
});

export const getAssociatedIssuesColumn = (
  onUpdateRowCallback: OnUpdateRowCallback,
  columnValidation: ?ColumnValidation,
  shouldDisable: boolean
) => ({
  field: FIELD_KEYS.associatedIssues,
  headerName: i18n.t('Associated injury/illness'),
  minWidth: 310,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams<any>) => (
    <IssuesCell
      params={params}
      onUpdateRowCallback={onUpdateRowCallback}
      shouldShowError={columnValidation?.[params.id.toString()] === false}
      shouldDisable={shouldDisable}
    />
  ),
});

export const getActionsColumn = (
  onDeleteRowCallback: OnDeleteRowCallback,
  shouldDisable: boolean
) => ({
  field: FIELD_KEYS.actions,
  type: 'actions',
  minWidth: 60,
  width: 60,
  visible: true,
  sortable: false,
  getActions: (params: GridRenderCellParams<any>) =>
    renderActions(params, onDeleteRowCallback, shouldDisable),
});

export const getDefaultColumns = ({
  onUpdateRowCallback,
  onDeleteRowCallback,
  validationResults,
  players,
  isPlayerPreselected,
  documentCategories,
  isFetchingPlayers,
  isFetchingDocumentCategories,
  shouldDisable,
  usage,
}: {
  onUpdateRowCallback: OnUpdateRowCallback,
  onDeleteRowCallback: OnDeleteRowCallback,
  validationResults: ValidationResults,
  players: Array<Option>,
  isPlayerPreselected: boolean,
  documentCategories: Array<Option>,
  isFetchingPlayers: boolean,
  isFetchingDocumentCategories: boolean,
  shouldDisable: boolean,
  usage: DocumentSplitterUsage,
}) => {
  const columns = [
    getPagesColumn(
      onUpdateRowCallback,
      validationResults[FIELD_KEYS.pages],
      shouldDisable
    ),
    getPlayerColumn(
      onUpdateRowCallback,
      validationResults[FIELD_KEYS.player],
      players,
      isFetchingPlayers,
      shouldDisable || isPlayerPreselected
    ),
    getCategoriesColumn(
      onUpdateRowCallback,
      validationResults[FIELD_KEYS.categories],
      documentCategories,
      isFetchingDocumentCategories,
      shouldDisable
    ),
    getFileNameColumn(
      onUpdateRowCallback,
      validationResults[FIELD_KEYS.fileName],
      shouldDisable
    ),
    getDateColumn(
      onUpdateRowCallback,
      validationResults[FIELD_KEYS.dateOfDocument],
      shouldDisable
    ),
    getActionsColumn(onDeleteRowCallback, shouldDisable),
  ];
  if (
    (window.getFlag('pm-mass-scan-with-issue') &&
      usage === DOCUMENT_SPLITTER_USAGE.massScanning) ||
    (window.getFlag('pm-efax-with-issue') &&
      usage === DOCUMENT_SPLITTER_USAGE.electronicFiles)
  ) {
    // Add the issue column before the final actions column
    columns.splice(
      columns.length - 1,
      0,
      getAssociatedIssuesColumn(
        onUpdateRowCallback,
        validationResults[FIELD_KEYS.associatedIssues],
        shouldDisable
      )
    );
  }
  return columns;
};
