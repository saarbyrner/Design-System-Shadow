// @flow
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Box, Button, Divider, Stack } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  updateRow,
  deleteRow,
  addRow,
} from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/detailsGridSlice';
import DetailsGrid from '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid';
import { getDefaultColumns } from '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid/Columns';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ComponentType } from 'react';
import type { Option } from '@kitman/playbook/types';
import type {
  DeleteRowPayload,
  DetailsGridRowData,
  DocumentSplitterUsage,
  OnDeleteRowCallback,
  OnUpdateRowCallback,
  UpdateRowPayload,
  ValidationResults,
} from '@kitman/components/src/DocumentSplitter/src/shared/types';

type Props = {
  dataRows: Array<DetailsGridRowData>,
  validationResults: ValidationResults,
  validationFailed: boolean,
  players: Array<Option>,
  documentCategories: Array<Option>,
  isPlayerPreselected: boolean,
  isFetchingPlayers: boolean,
  isFetchingDocumentCategories: boolean,
  isSaving: boolean,
  usage: DocumentSplitterUsage,
};

const DetailsView = ({
  t,
  dataRows,
  validationResults,
  validationFailed,
  players,
  documentCategories,
  isPlayerPreselected,
  isFetchingPlayers,
  isFetchingDocumentCategories,
  isSaving,
  usage,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const onUpdateRow: OnUpdateRowCallback = (payload: UpdateRowPayload) => {
    dispatch(updateRow(payload));
  };

  const onDeleteRow: OnDeleteRowCallback = (
    payload: DeleteRowPayload
  ): void => {
    dispatch(deleteRow(payload));
  };

  const gridConfig = {
    rows: dataRows,
    columns: getDefaultColumns({
      onUpdateRowCallback: onUpdateRow,
      onDeleteRowCallback: onDeleteRow,
      validationResults,
      players,
      isPlayerPreselected,
      documentCategories,
      isFetchingPlayers,
      isFetchingDocumentCategories,
      shouldDisable: isSaving,
      usage,
    }),
    emptyTableText: t('No rows'),
    id: 'details_grid',
  };

  return (
    <Stack
      direction="column"
      gap={0}
      alignItems="left"
      justifyContent="space-between"
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <DetailsGrid
        grid={gridConfig}
        validationResults={validationResults}
        validationFailed={validationFailed}
      />
      <Box pt={1}>
        <Button
          startIcon={<KitmanIcon name={KITMAN_ICON_NAMES.Add} />}
          variant="text"
          disabled={isSaving}
          onClick={() => {
            dispatch(addRow());
          }}
        >
          {t('Add another')}
        </Button>
      </Box>
    </Stack>
  );
};

export const DetailsViewTranslated: ComponentType<Props> =
  withNamespaces()(DetailsView);
export default DetailsView;
