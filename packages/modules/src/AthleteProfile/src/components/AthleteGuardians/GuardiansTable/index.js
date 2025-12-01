// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { formatCellDate } from '@kitman/modules/src/AthleteProfile/src/components/AthleteGuardians/GuardiansTable/utils';
import {
  DataGrid,
  Box,
  Alert,
  GridActionsCellItem,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useFetchGuardiansQuery } from '@kitman/services/src/services/humanInput/humanInput';
import { useGetAthleteIdFromPath } from '@kitman/modules/src/HumanInput/hooks/helperHooks/useGetAthleteIdFromPath';
import { useDispatch } from 'react-redux';
import type {
  FetchGuardiansResponse,
  GuardianUser,
} from '@kitman/services/src/services/humanInput/api/types';
import {
  onSetMode,
  onUpdateGuardianForm,
  onDeleteGuardianForm,
  onOpenGuardianSidePanel,
  onOpenDeleteGuardianModal,
} from '@kitman/modules/src/AthleteProfile/redux/slices/guardiansTabSlice';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';

const GuardiansTable = ({ t }: I18nProps<{}>) => {
  const dispatch = useDispatch();
  const athleteId = useGetAthleteIdFromPath();
  const {
    data: guardiansData,
    isLoading,
    isDeleteLoading,
    isError,
  }: {
    data: ?FetchGuardiansResponse,
    isLoading: boolean,
    isDeleteLoading: boolean,
    isError: boolean,
  } = useFetchGuardiansQuery(athleteId);

  const rowActions = [
    {
      id: 'edit',
      text: t('Edit'),
      onCallAction: (row: Object) => {
        dispatch(onSetMode({ mode: MODES.EDIT }));
        dispatch(onUpdateGuardianForm({ ...row, first_name: row.firstName }));
        dispatch(onOpenGuardianSidePanel());
      },
      disabled: false,
    },
    {
      id: 'delete',
      text: t('Delete'),
      onCallAction: (row: Object) => {
        dispatch(
          onDeleteGuardianForm({ id: row.id, name: row.name, email: row.email })
        );
        dispatch(onOpenDeleteGuardianModal());
      },
      disabled: isDeleteLoading,
    },
  ];

  const getActions = ({ row }: { row: Object }) => {
    return rowActions.map(({ id: key, text, onCallAction, disabled }) => (
      <GridActionsCellItem
        showInMenu
        label={text}
        onClick={() => onCallAction(row)}
        key={key}
        disabled={disabled}
      />
    ));
  };

  const guardiansRow = guardiansData?.map(
    ({
      id,
      name,
      first_name: firstName,
      surname,
      email,
      created_at: createdAt,
    }: GuardianUser) => {
      return {
        id,
        name,
        firstName,
        surname,
        email,
        createdAt,
      };
    }
  );

  const columns = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1,
    },
    {
      field: 'email',
      headerName: t('Email'),
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: t('Added'),
      flex: 1,
      valueFormatter: (params) => formatCellDate(params?.value),
    },
    {
      type: 'actions',
      field: 'actions',
      getActions,
      minWidth: 40,
      width: 40,
    },
  ];

  return isError ? (
    <Box display="flex" justifyContent="center" alignItems="center" p={4}>
      <Alert severity="error" sx={{ mt: 2 }}>
        {t('Error connecting to the database. Please try again.')}
      </Alert>
    </Box>
  ) : (
    <DataGrid
      columns={columns}
      rows={guardiansRow || []}
      noRowsMessage={t('No guardians added')}
      loading={isLoading}
      rowSelection={false}
    />
  );
};

export const GuardiansTableTranslated: ComponentType<{}> =
  withNamespaces()(GuardiansTable);
export default GuardiansTable;
