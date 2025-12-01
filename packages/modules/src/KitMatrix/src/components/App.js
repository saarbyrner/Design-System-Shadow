// @flow
import { useCallback, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Stack,
  Typography,
  Button,
  GridActionsCellItem,
  ConfirmationModal,
} from '@kitman/playbook/components';
import style from '@kitman/modules/src/KitMatrix/style';
import ScrollTop from '@kitman/components/src/ScrollTop';
import Container from '@kitman/modules/src/Contacts/shared/Container';
import type { KitMatrix } from '@kitman/services/src/services/kitMatrix/searchKitMatrices';
import { useUpdateKitMatrixMutation } from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';

import { useKitMatrixDataGrid } from '@kitman/modules/src/KitMatrix/shared/hooks';
import { useSeamlessInfiniteScroll } from '@kitman/common/src/hooks/useSeamlessInfiniteScroll';
import { getTranslations } from '@kitman/modules/src/KitMatrix/shared/utils';
import { dismissToasts } from '@kitman/modules/src/AthleteReviews/src/shared/utils';

import AddKitMatrixDrawer from './AddKitMatrixDrawer';
import { columnHeaders, commonColDef } from '../grid/config';

type Props = {};

const KitMatrixApp = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { isLeague } = useLeagueOperations();
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [kitForDeletion, setKitForDeletion] = useState<?KitMatrix>(null);

  const canManageKits = permissions?.leagueGame.manageKits;

  const textEnum = getTranslations();
  const [updateKitMatrix, { isLoading: isDeletingKit }] =
    useUpdateKitMatrixMutation();

  const openDeletionModal = (kit: KitMatrix) => {
    setKitForDeletion(kit);
  };

  const closeDeletionModal = () => {
    setKitForDeletion(null);
  };

  const onDeleteKit = async () => {
    try {
      await updateKitMatrix({
        id: kitForDeletion?.id,
        updates: { archived: true },
      }).unwrap();
    } catch {
      closeDeletionModal();
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: textEnum.kitDeletedError,
        })
      );
      setTimeout(() => dismissToasts(dispatch), 2500);
      return;
    }

    closeDeletionModal();
    dispatch(
      add({
        status: toastStatusEnumLike.Success,
        title: textEnum.kitDeletedSuccess,
      })
    );
  };

  const openEditKitDrawer = useCallback(
    (row: KitMatrix) => () => {
      setSelectedRow(row);
      setIsDrawerOpen(true);
    },
    []
  );

  const customColumns = useCallback(() => {
    const tmpColumns = { ...columnHeaders };

    tmpColumns.actions = {
      ...commonColDef,
      field: 'actions',
      headerName: '',
      width: 30,
      type: 'actions',
      getActions: (params: { row: KitMatrix }) => {
        const columnActions = canManageKits
          ? [
              <GridActionsCellItem
                key="edit"
                label={props.t('Edit')}
                onClick={openEditKitDrawer(params.row)}
                showInMenu
              />,
              <GridActionsCellItem
                key="delete"
                label={props.t('Delete')}
                showInMenu
                onClick={() => {
                  openDeletionModal(params.row);
                }}
              />,
            ]
          : [];

        return params.row.games_count ? [] : columnActions;
      },
    };

    return Object.values(tmpColumns);
  }, [openEditKitDrawer, props]);

  const { setNextId, searchKitMatricesQuery, renderFilter, renderDataGrid } =
    useKitMatrixDataGrid({
      t: props.t,
      customColumns,
    });

  const { watchRef } = useSeamlessInfiniteScroll({
    enabled: !!searchKitMatricesQuery.data?.next_id,
    onEndReached: () => {
      setNextId(searchKitMatricesQuery.data?.next_id ?? null);
    },
  });

  const onClose = () => {
    setIsDrawerOpen(false);
    setSelectedRow(undefined);
  };

  const onSave = () => {
    searchKitMatricesQuery.refetch();
  };

  const renderAddKitButton = () => {
    if (!canManageKits) return null;

    return (
      <Button onClick={() => setIsDrawerOpen(true)}>
        {props.t('Add Kit Set')}
      </Button>
    );
  };

  return (
    <Container>
      <Container.Header>
        <Stack gap={2}>
          <Typography variant="h2" css={style.title}>
            {props.t('Kit Sets')}
          </Typography>
          <Stack direction="row" gap={1}>
            {renderFilter('search')}
            {isLeague && renderFilter('clubs')}
            {renderFilter('colors')}
            {renderFilter('types')}
          </Stack>
        </Stack>
        {renderAddKitButton()}
      </Container.Header>

      {renderDataGrid()}
      {!!searchKitMatricesQuery.data?.next_id && <div ref={watchRef} />}
      <AddKitMatrixDrawer
        isOpen={isDrawerOpen}
        onSave={onSave}
        onClose={onClose}
        data={selectedRow}
      />

      <ConfirmationModal
        isModalOpen={!!kitForDeletion}
        isLoading={isDeletingKit}
        translatedText={{
          title: props.t('Delete Kit Set'),
          actions: {
            ctaButton: props.t('Confirm'),
            cancelButton: props.t('Cancel'),
          },
        }}
        dialogContent={
          <>
            <p>{props.t('Are you sure you want to delete this kit?')}</p>
            <p>
              {props.t('Kit Name: {{kitName}}', {
                kitName: kitForDeletion?.name,
                interpolation: { escapeValue: false },
              })}
            </p>
          </>
        }
        onClose={closeDeletionModal}
        onCancel={closeDeletionModal}
        onConfirm={onDeleteKit}
      />

      <ScrollTop threshold={300} sx={{ bottom: 78, right: 38 }} />
    </Container>
  );
};

export default withNamespaces()(KitMatrixApp);
