/* eslint-disable camelcase */
// @flow
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { GridRowSelectionModel } from '@mui/x-data-grid';

import { AppStatus, Select } from '@kitman/components';
import {
  GridActionsCellItem,
  DataGrid as MuiDataGrid,
} from '@kitman/playbook/components';
import TabLayout from '@kitman/components/src/TabLayout';

import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import type {
  MovementType,
  SearchAthleteProfile,
} from '@kitman/modules/src/UserMovement/shared/types';
import {
  onToggleDrawer,
  onUpdateMovementForm,
  onSetDrawerStep,
  onSetProfile as onSetMedicalTrialProfile,
} from '@kitman/modules/src/UserMovement/shared/redux/slices/userMovementDrawerSlice';
import {
  onUpdateSelectedAthleteIds,
  onUpdateOriginalSelectedLabelIds,
  onUpdateSelectedLabelIds,
  onUpdateShouldRemovePrimarySquad,
  type BulkActionsData,
} from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import { onToggleDrawer as onToggleMovementHistoryDrawer } from '@kitman/modules/src/UserMovement/shared/redux/slices/movementHistorySlice';

import {
  onToggleDrawer as onToggleCreateMovementDrawer,
  onUpdateCreateMovementForm,
} from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';
import { onSetId } from '@kitman/modules/src/UserMovement/shared/redux/slices/movementProfileSlice';

import { getPermissionGroupFactory } from '@kitman/common/src/redux/global/selectors';
import { getBulkActionsState } from '@kitman/modules/src/AthleteManagement/shared/redux/selectors';
import { useBulkUpdateLabelsAction } from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar/utils/hooks/useBulkUpdateLabelsAction';
import {
  getMovementRowActions,
  getMovementHistoryAction,
} from '@kitman/modules/src/UserMovement/shared/config';
import { ActionBarTranslated as ActionBar } from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar';
import { ExportSidePanelTranslated as ExportSidePanel } from '@kitman/modules/src/HumanInput/shared/components/ExportSidePanel';
import useExportSidePanel from '@kitman/modules/src/HumanInput/hooks/useExportSidePanel';
import Search from '@kitman/modules/src/Officials/ListOfficials/src/components/Filters/Search';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import useManageAthletesGrid from '../../hooks/useManageAthletesGrid';
import style from './style';
import RegistrationGrid from '../../../../../LeagueOperations/technicalDebt/components/RegistrationGrid';

import type { ActiveStatus, CareerStatus } from '../../../../shared/types';
import {
  getMuiCols,
  generateAthletePageHref,
  getPreselectedLabelsForSelectedIds,
} from './utils/helpers';
import { muiDataGridProps } from './utils/consts';

type RowIdToUserIdMap = Map<number, number>;

type Props = {
  careerStatus: CareerStatus,
  activeStatus: ActiveStatus,
  isAssociationAdmin: boolean,
};

const ManageAthletesTab = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();

  const userMovementPermissions = useSelector(
    getPermissionGroupFactory('userMovement')
  );
  const userSettingsPermissions = useSelector(
    getPermissionGroupFactory('settings')
  );

  const bulkActionsState: BulkActionsData = useSelector(getBulkActionsState);
  const selectedIds = bulkActionsState.selectedAthleteIds;

  const onEditAthlete = (currentAthleteId) => {
    locationAssign(generateAthletePageHref(currentAthleteId));
  };

  // This map is necessary because we need the row ID for the table, but the user ID for actions later on
  const [rowIdToUserIdMap, setRowIdToUserIdMap] = useState<RowIdToUserIdMap>(
    new Map()
  );

  const hasManageAthletesMUIgridFF =
    window.featureFlags['manage-athletes-grid-mui'];

  const {
    isManageAthletesGridFetching,
    isManageAthletesGridError,
    onHandleFilteredSearch,
    grid,
    filteredSearchParams,
    onUpdateFilter,
    meta,
    data,
    positionsOptions,
    organisationOptions,
    divisionsOptions,
    onHandleRefetch,
  } = useManageAthletesGrid({
    activeStatus: props.activeStatus,
    careerStatus: props.careerStatus,
  });

  const { isExportSidePanelOpen, handleCloseExportSidePanel } =
    useExportSidePanel();

  const { labelsOptions } = useBulkUpdateLabelsAction({
    t: props.t,
    selectedAthleteIds: [],
    handleRefetchData: onHandleRefetch,
    canViewLabels: userSettingsPermissions.canViewLabels,
  });

  const canViewLabels =
    userSettingsPermissions.canViewLabels &&
    window.getFlag('labels-and-groups');

  const { preferences } = usePreferences();

  useEffect(() => {
    const newMap: RowIdToUserIdMap = new Map();
    data.forEach(({ id, user_id }) => newMap.set(id, user_id));
    setRowIdToUserIdMap(newMap);
  }, [data]);

  const onViewMovementHistory = (user_id: string) => {
    dispatch(
      onSetId({
        id: user_id,
      })
    );
    dispatch(onToggleMovementHistoryDrawer());
  };

  const onInitiateUserMovement = (user_id: string, type: MovementType) => {
    const profile = data.find((athlete) => athlete.user_id === user_id);

    /**
     * @warning
     * This is only alive as is being actively tested by NFL in demo accounts for medical_trial
     * It will be removed in the next few weeks
     */
    if (type === 'medical_trial') {
      dispatch(
        onSetMedicalTrialProfile({
          profile,
        })
      );
      dispatch(onSetDrawerStep({ step: 0 }));
      dispatch(
        onUpdateMovementForm({
          transfer_type: 'medical_trial',
          user_id: profile?.user_id,
          leave_organisation_ids: [profile?.organisations[0].id],
        })
      );
      dispatch(onToggleDrawer());
    } else {
      dispatch(
        onSetId({
          id: user_id,
        })
      );
      dispatch(
        onUpdateCreateMovementForm({
          transfer_type: type,
          user_id,
        })
      );
      dispatch(onToggleCreateMovementDrawer());
    }
  };

  const canManageGameStatus =
    preferences?.manage_athlete_game_status === 'athlete_game_status';

  const renderContent = () => {
    if (isManageAthletesGridError) return <AppStatus status="error" />;
    if (isManageAthletesGridFetching && filteredSearchParams.page === 1)
      return <TabLayout.Loading />;

    const movementRowActions = getMovementRowActions({
      isAssociationAdmin: props.isAssociationAdmin,
      onClick: onInitiateUserMovement,
      onEditAthlete,
      permissions: userMovementPermissions,
    });

    const movementHistoryRowActions = getMovementHistoryAction({
      permissions: userMovementPermissions,
      onClick: onViewMovementHistory,
    });

    const rowActions = [...movementRowActions, ...movementHistoryRowActions];

    const muiColumns = getMuiCols(
      props.isAssociationAdmin,
      canViewLabels,
      canManageGameStatus
    );

    const getActions = ({ row }: { row: SearchAthleteProfile }) => {
      return rowActions.map(({ id: key, text, onCallAction }) => (
        <GridActionsCellItem
          label={text}
          onClick={() => onCallAction(row.user_id)}
          showInMenu
          key={key}
        />
      ));
    };

    const actionsColumn = {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions,
    };

    const onRowSelectionModelChange = (selection: GridRowSelectionModel) => {
      // Design wanted it to be according to the first row selected
      if (
        selection.length === 1 &&
        bulkActionsState.selectedAthleteIds.length === 0
      ) {
        const selectedRow = data.find((row) => row.id === selection[0]);
        if (selectedRow) {
          const doesAthleteHavePrimarySquad =
            selectedRow.squads.includes('(Primary)');
          dispatch(
            onUpdateShouldRemovePrimarySquad(doesAthleteHavePrimarySquad)
          );
        }
      }
      const mappedIds = selection.map((id) => ({
        id,
        userId: rowIdToUserIdMap.get(id),
      }));
      dispatch(onUpdateSelectedAthleteIds(mappedIds));

      const preselectedLabelsIdForSelection =
        getPreselectedLabelsForSelectedIds(data, selection);

      dispatch(
        onUpdateOriginalSelectedLabelIds(
          preselectedLabelsIdForSelection.map((label) => label.id)
        )
      );
      dispatch(
        onUpdateSelectedLabelIds(
          preselectedLabelsIdForSelection.map((label) => label.id)
        )
      );
    };

    return hasManageAthletesMUIgridFF ? (
      <MuiDataGrid
        checkboxSelection
        columns={[...muiColumns, actionsColumn]}
        rows={data}
        noRowsMessage={grid.emptyTableText}
        {...muiDataGridProps}
        onRowSelectionModelChange={onRowSelectionModelChange}
        rowSelectionModel={bulkActionsState.selectedAthleteIds.map(
          ({ id }) => id
        )}
        infiniteLoading
        pageSize={25}
        pageNumber={meta.current_page - 1} // meta pages start at 1, MUI at 0
        rowCount={meta.total_count}
        infiniteLoadingCall={(nextPage) => {
          // Prevent infinite loading by stopping further requests when we've reached the total page count
          if (nextPage === meta.total_pages) {
            return undefined;
          }

          return onHandleFilteredSearch({
            ...filteredSearchParams,
            page: nextPage + 1, // meta pages start at 1, MUI at 0
          });
        }}
        loading={isManageAthletesGridFetching}
      />
    ) : (
      <RegistrationGrid
        onFetchData={() =>
          onHandleFilteredSearch({
            ...filteredSearchParams,
            page: meta.next_page,
          })
        }
        grid={{
          columns: grid.columns,
          rows: grid.rows,
        }}
        gridId={grid.id}
        emptyTableText={grid.emptyTableText}
        rowActions={rowActions.length > 0 ? rowActions : null}
        isLoading={isManageAthletesGridFetching && meta.current_page > 1}
        meta={meta}
      />
    );
  };

  // For now the ability to filter is available to only associationAdmin
  const canFilterAthletes =
    props.isAssociationAdmin &&
    window.featureFlags['league-ops-player-movement-trade'];

  const canFilterLabels =
    window.getFlag('labels-and-groups') &&
    userSettingsPermissions.canViewLabels;

  const filterConfigs = [
    {
      filterKey: 'division_ids',
      options: divisionsOptions,
      value: filteredSearchParams.division_ids,
      onUpdateFilter,
      placeholder: props.t('Division'),
      isVisible: canFilterAthletes,
    },
    {
      filterKey: 'organisation_ids',
      options: organisationOptions,
      value: filteredSearchParams.organisation_ids,
      onUpdateFilter,
      placeholder: props.t('Club'),
      isVisible: canFilterAthletes,
    },
    {
      filterKey: 'position_ids',
      options: positionsOptions,
      value: filteredSearchParams.position_ids,
      onUpdateFilter,
      placeholder: props.t('Position'),
      isVisible: canFilterAthletes,
    },
    {
      filterKey: 'career_status',
      options: [], // TODO: address this option once the BE is in place
      value: filteredSearchParams.career_status,
      onUpdateFilter,
      placeholder: props.t('Career Status'),
      isVisible: false,
    },
    ...(canFilterLabels
      ? [
          {
            filterKey: 'label_ids',
            options: labelsOptions,
            value: filteredSearchParams.label_ids,
            onUpdateFilter,
            placeholder: props.t('Labels'),
            isVisible: canFilterLabels,
          },
        ]
      : []),
  ];

  const renderAdminFilters = () => {
    return (
      <>
        {filterConfigs.map((config) => {
          return (
            <>
              {config.isVisible && (
                <div css={style.filter}>
                  <Select
                    appendToBody
                    options={config.options}
                    onChange={(selectedItems) =>
                      onUpdateFilter({
                        [`${config.filterKey}`]: selectedItems,
                        page: 1,
                      })
                    }
                    value={config.value}
                    placeholder={config.placeholder}
                    isMulti
                    inlineShownSelection
                    showAutoWidthDropdown
                  />
                </div>
              )}
            </>
          );
        })}
      </>
    );
  };

  const renderFilters = () => {
    return (
      <div
        css={[style.filters, style['filters--desktop']]}
        data-testid="Filters|DesktopFilters"
      >
        <Search
          onUpdateFunction={(value) => {
            onUpdateFilter({
              search_expression: value.search_expression,
              page: 1,
            });
          }}
          searchKey="search_expression"
          value={filteredSearchParams.search_expression}
        />
        {renderAdminFilters()}
      </div>
    );
  };

  return (
    <TabLayout>
      <TabLayout.Body
        gridBottomMarginToHideOverflowOnBody={
          hasManageAthletesMUIgridFF ? '0px' : undefined
        }
        shouldMinimizeEmptySpaces={hasManageAthletesMUIgridFF}
      >
        <TabLayout.Filters
          shouldMinimizeEmptySpaces={hasManageAthletesMUIgridFF}
        >
          {selectedIds.length > 0 && hasManageAthletesMUIgridFF ? (
            <ActionBar
              selectedAthleteIds={selectedIds}
              permissions={userSettingsPermissions}
              canManageGameStatus={canManageGameStatus}
              handleRefetchData={onHandleRefetch}
            />
          ) : (
            <Fragment>{renderFilters()}</Fragment>
          )}
        </TabLayout.Filters>
        <TabLayout.Content
          shouldMinimizeEmptySpaces={hasManageAthletesMUIgridFF}
        >
          {renderContent()}
        </TabLayout.Content>
        {window.featureFlags['form-based-athlete-profile'] && (
          <ExportSidePanel
            isOpen={isExportSidePanelOpen}
            onClose={handleCloseExportSidePanel}
          />
        )}
      </TabLayout.Body>
    </TabLayout>
  );
};

export const ManageAthletesTabTranslated = withNamespaces()(ManageAthletesTab);
export default ManageAthletesTab;
