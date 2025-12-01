// @flow
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type ComponentType,
} from 'react';
import { useDispatch } from 'react-redux';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { gridClasses } from '@mui/x-data-grid';
import type { SetState } from '@kitman/common/src/types/react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import type {
  PastAthletes,
  PastAthletesGridPayload,
} from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/types';
import {
  onToggleDrawer,
  onUpdateMovementForm,
  onReset,
  onUpdateTime,
  onSetProfile as onSetMedicalTrialProfile,
} from '@kitman/modules/src/UserMovement/shared/redux/slices/userMovementDrawerSlice';
import { MEDICAL_TRIAL_V2 } from '@kitman/modules/src/UserMovement/shared/constants';
import type { RequestStatus } from '@kitman/common/src/types';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import { UserMovementDrawerTranslated as UserMovementDrawer } from '@kitman/modules/src/UserMovement/shared/components/UserMovementDrawer';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  getPlayerColumn,
  getPlayerIdColumn,
  getDepartedDateColumn,
  getOpenInjuryIllnessColumn,
} from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/components/Grid/Columns';
import {
  Typography,
  Box,
  GridActionsCellItem,
  DataGrid as MuiDataGrid,
} from '@kitman/playbook/components';
import { SearchFilterTranslated as Search } from '@kitman/modules/src/ElectronicFiles/shared/components/Filters/Search';
import { ReportManagerTranslated as ReportManager } from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/components/ReportManager';
import { MUI_DATAGRID_OVERRIDES } from '@kitman/modules/src/ElectronicFiles/shared/styles';
import type { GridRow } from '../../types';

type Props = {
  pastAthletes: PastAthletes,
  setPayload: SetState<PastAthletesGridPayload>,
  onSearch: (value: string) => void,
  requestStatus: RequestStatus,
};

const PastAthletesTab = ({
  pastAthletes,
  setPayload,
  onSearch,
  requestStatus,
  t,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const locationAssign = useLocationAssign();

  const [searchString, setSearchString] = useState<string>('');

  const {
    data: permissions = {},
    isSuccess: hasPermissionsDataLoaded = false,
  }: { data: PermissionsType, isSuccess: boolean } = useGetPermissionsQuery();

  useEffect(() => {
    if (requestStatus === 'SUCCESS' && searchString) {
      // focus search field after search query completes
      searchInputRef.current?.focus();
    }
  }, [requestStatus, searchString]);

  const showPlayerIdColumn = window.organisationSport === 'nfl';
  const showOpenInjuryIllnessColumn =
    hasPermissionsDataLoaded && permissions.medical?.issues.canView;

  const allowMedicalTrialSharing =
    window.getFlag('past-athletes-medical-trial') &&
    permissions.userMovement?.player.medicalTrial;

  const openMedicalTrialDrawer = (row: GridRow): void => {
    dispatch(onReset());
    const profile = {
      id: row.id,
      user_id: row.user_id,
      name: row.fullname,
      email: row.email,
      organisations: row.organisations || [],
      date_of_birth: row.date_of_birth,
    };

    dispatch(
      onSetMedicalTrialProfile({
        profile,
      })
    );
    dispatch(onUpdateTime());
    dispatch(
      onUpdateMovementForm({
        transfer_type: MEDICAL_TRIAL_V2,
        user_id: row.user_id,
        leave_organisation_ids: [profile?.organisations[0]?.id],
      })
    );
    dispatch(onToggleDrawer());
  };

  const columns: Array<GridColDef> = useMemo(
    () =>
      [
        getPlayerColumn(),
        ...(showPlayerIdColumn ? [getPlayerIdColumn()] : []),
        getDepartedDateColumn(),
        ...(showOpenInjuryIllnessColumn ? [getOpenInjuryIllnessColumn()] : []),
        ...(allowMedicalTrialSharing
          ? [
              {
                field: 'actions',
                type: 'actions',
                visible: true,
                width: 20,
                getActions: ({ row }: { row: GridRow }) => [
                  <GridActionsCellItem
                    key="medical_trial"
                    label={t('Medical trial')}
                    onClick={() => openMedicalTrialDrawer(row)}
                    showInMenu
                  />,
                ],
              },
            ]
          : []),
      ].filter((column) => column.visible),
    [
      showPlayerIdColumn,
      showOpenInjuryIllnessColumn,
      allowMedicalTrialSharing,
      t,
    ]
  );

  const rows = useMemo(() => pastAthletes.athletes, [pastAthletes.athletes]);

  const onRowClick = (params) => {
    locationAssign(`/medical/athletes/${params.id}`);
  };

  const pageSize = 30;
  const pageNumber =
    pastAthletes.meta.current_page === 0
      ? pastAthletes.meta.current_page
      : pastAthletes.meta.current_page - 1;

  return (
    <>
      {allowMedicalTrialSharing && <UserMovementDrawer isPastPlayer />}
      <Box p={3} pb={0}>
        <Box mb={3}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {t('Past athletes')}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Search
            inputRef={searchInputRef}
            onChange={(value) => {
              onSearch(value);
              setSearchString(value);
            }}
            value={searchString}
            disabled={requestStatus === 'PENDING'}
          />
          <Box>
            <ReportManager />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: `calc(100vh - ${convertPixelsToREM(345)})`,
        }}
      >
        <MuiDataGrid
          columns={columns}
          rows={rows}
          rowCount={pastAthletes.meta.total_count}
          pagination
          asyncPagination
          pageSize={pageSize}
          pageNumber={pageNumber}
          onRowClick={onRowClick}
          onPaginationModelChange={(selectedPage) => {
            setPayload((prevState) => ({
              ...prevState,
              page: selectedPage + 1,
            }));
          }}
          pageSizeOptions={[pageSize]}
          loading={requestStatus === 'PENDING'}
          noRowsMessage={
            searchString.length > 0
              ? t('No past players match the search criteria')
              : t('No past players found')
          }
          getRowHeight={() => 'auto'}
          {...MUI_DATAGRID_OVERRIDES}
          sx={{
            ...MUI_DATAGRID_OVERRIDES.sx,
            [`.${gridClasses.cell}`]: {
              paddingTop: '4px',
              paddingBottom: '4px',
            },
            [`.${gridClasses.row}:hover`]: {
              cursor: 'pointer',
            },
          }}
        />
      </Box>
    </>
  );
};

export const PastAthletesTabTranslated: ComponentType<Props> =
  withNamespaces()(PastAthletesTab);
export default PastAthletesTab;
