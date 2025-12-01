// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { DEFAULT_PAGE_SIZE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import type { Filters as SearchAthleteListFilters } from '@kitman/modules/src/LeagueOperations/shared/services/searchAthleteList';
import type { Athlete } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { AthleteRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import {
  useSearchAthleteListQuery,
  useGetAllLabelsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';

import { transformToAthleteRows } from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabAthleteList/utils';
import withGridDataManagement from '@kitman/modules/src/LeagueOperations/shared/components/withGridDataManagement';
import type { TabProps } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import useGridActions from '@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions';
import GridFiltersContainer from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFiltersContainer';

import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import GridFilterAutocomplete from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterAutocomplete';

import GridFilterDateRange from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterDateRange';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import GridLabelSelect from '../../GridLabelSelect';
import GridDateRangePicker from '../../GridDateRangePicker';

import { GridSearchTranslated as GridSearch } from '../../GridSearch';
import { GridStatusSelectTranslated as GridStatusSelect } from '../../GridStatusSelect';
import type { RequestStatus } from '../../../hooks/useManageGridData';

const TabAthleteList = (props: TabProps<SearchAthleteListFilters>) => {
  const { permissions } = usePermissions();
  const canViewLabels = permissions?.homegrown?.canViewHomegrown;
  const initialFilters: SearchAthleteListFilters = {
    search_expression: '',
    registration_status: '',
    date_range: null,
    label_ids: null,
    registration_system_status_id: null,
    squad_ids: null,
    organisation_ids: null,
    per_page: DEFAULT_PAGE_SIZE,
    page: 1,
  };

  // const getExpandRowKey = () => {
  //   return props.currentUserType === USER_TYPES.ASSOCIATION_ADMIN
  //     ? 'registrations'
  //     : 'squads';
  // };
  const { actions } = useGridActions();

  const {
    registrationFilterStatuses,
    isLoadingRegistrationFilterStatusesData,
    isErrorRegistrationFilterStatusesData,
  } = useRegistrationStatus({
    permissionGroup: 'athlete',
  });

  const shouldDisableRegistrationStatusDropdown =
    isLoadingRegistrationFilterStatusesData ||
    isErrorRegistrationFilterStatusesData;

  const useResponsiveFilters = window.getFlag('lops-grid-filter-enhancements');
  const labelsFeatureFlag = window.getFlag(
    'league-ops-homegrown-registrations'
  );

  const renderFilters = ({
    onUpdate,
    filters,
    requestStatus,
  }: {
    onUpdate: Function,
    filters: SearchAthleteListFilters,
    requestStatus: RequestStatus,
  }) => {
    return (
      <>
        <GridSearch
          value={filters.search_expression}
          onUpdate={(value) =>
            onUpdate({
              search_expression: value,
              page: 1,
            })
          }
          requestStatus={requestStatus}
        />
        {canViewLabels && (
          <GridDateRangePicker
            value={
              filters?.date_range
                ? {
                    start_date: filters.date_range.start_date || null,
                    end_date: filters.date_range.end_date || null,
                  }
                : null
            }
            onUpdate={(value) =>
              onUpdate({
                date_range: value ?? null,
                page: 1,
              })
            }
            requestStatus={requestStatus}
          />
        )}
        <GridStatusSelect
          value={filters.registration_status}
          onUpdate={(value) =>
            onUpdate({
              registration_status: value?.value ?? '',
              registration_system_status_id: value?.id ?? null,
              page: 1,
            })
          }
          userType="athlete"
        />
        {canViewLabels && (
          <GridLabelSelect
            value={filters?.label_ids ?? null}
            onUpdate={(value) => {
              onUpdate({
                label_ids: value,
                page: 1,
              });
            }}
          />
        )}
      </>
    );
  };

  const renderResponsiveFilters = ({
    onUpdate,
    filters,
    requestStatus,
  }: {
    onUpdate: Function,
    filters: SearchAthleteListFilters,
    requestStatus: RequestStatus,
  }) => {
    const isRequestPending =
      requestStatus.isFetching ||
      requestStatus.isLoading ||
      requestStatus.isError;
    return (
      <GridFiltersContainer
        sx={{
          width: '100%',
        }}
        searchField={
          <GridFilterSearch
            label={i18n.t('Search')}
            onChange={(value) => {
              onUpdate({
                search_expression: value,
                page: 1,
              });
            }}
            param="search_expression"
            value={filters.search_expression || ''}
            showSearchIcon
            disabled={isRequestPending}
          />
        }
        showClearAllButton
      >
        {labelsFeatureFlag && permissions.homegrown.canViewHomegrown && (
          <GridFilterDateRange
            label={i18n.t('DOB range')}
            value={filters.date_range ?? null}
            param="date_range"
            defaultValue={null}
            onChange={(value) => {
              if (value?.start_date && value?.end_date) {
                onUpdate({
                  date_range: value,
                  page: 1,
                });
              } else {
                // backend doesn't accept { start_date: null, end_date: null }
                onUpdate({
                  date_range: null,
                  page: 1,
                });
              }
            }}
          />
        )}

        <GridFilterAutocomplete
          label={i18n.t('Status')}
          placeholder={i18n.t('Status')}
          param="registration_system_status_id"
          defaultValue={null}
          value={filters?.registration_system_status_id ?? null}
          optionsOverride={
            registrationFilterStatuses?.map((option) => {
              return {
                id: option.id ?? '',
                name: option.label,
                value: option.value,
              };
            }) || []
          }
          onChange={(value) => {
            if (value) {
              onUpdate({
                registration_status: value?.value,
                registration_system_status_id: value?.id,
                page: 1,
              });
            } else {
              onUpdate({
                registration_status: '',
                registration_system_status_id: null,
                page: 1,
              });
            }
          }}
          disabled={shouldDisableRegistrationStatusDropdown || isRequestPending}
        />

        {labelsFeatureFlag && permissions.homegrown.canViewHomegrown && (
          <GridFilterAutocomplete
            label={i18n.t('Labels')}
            placeholder={i18n.t('Labels')}
            param="label_ids"
            defaultValue={null}
            value={filters?.label_ids?.[0] ?? null}
            useOptionsQuery={useGetAllLabelsQuery}
            queryArgs={{ isSystemManaged: true }}
            transformOptions={(options) => {
              return (
                options?.map((option) => ({
                  id: option.id,
                  name: option.name,
                })) || []
              );
            }}
            onChange={(value) => {
              if (value) {
                onUpdate({
                  // although its a single select, backend expects an array of ids
                  label_ids: [value.id],
                  page: 1,
                });
              } else {
                onUpdate({
                  label_ids: null,
                  page: 1,
                });
              }
            }}
            disabled={isRequestPending}
          />
        )}
      </GridFiltersContainer>
    );
  };
  // TODO; the commented code is to be revisited at a later date, as some BE work is required for Multi-registration
  return withGridDataManagement<Athlete, AthleteRow, SearchAthleteListFilters>({
    useSearchQuery: useSearchAthleteListQuery,
    initialFilters,
    title: i18n.t('Players'),
    onTransformData: (rowData) =>
      transformToAthleteRows({
        rawRowData: rowData,
        currentUserType: props.currentUserType,
      }),
    // expandRowKey: getExpandRowKey(),
    slots: {
      filters: useResponsiveFilters ? renderResponsiveFilters : renderFilters,

      ...(window.getFlag('league-ops-expire-registration-profiles') && {
        onGetActions: ({ row }) => actions(row),
      }),
      bulkAction: 'athlete',
      // expandableRow: (row: AthleteRow) => {
      //   if (
      //     props.currentUserType === USER_TYPES.ASSOCIATION_ADMIN &&
      //     row?.registrations &&
      //     row?.registrations?.length > 1
      //   ) {
      //     return (
      //       <ExpandContent
      //         gridParams={{
      //           key: GRID_TYPES.ATHLETE_REGISTRATION,
      //           userType: props.currentUserType,
      //         }}
      //         gridStartColumn="organisations"
      //         onTransformData={transformMultiRegistrationToRows}
      //         rows={row?.registrations || []}
      //       />
      //     );
      //   }

      //   if (
      //     props.currentUserType === USER_TYPES.ORGANISATION_ADMIN &&
      //     row?.squads &&
      //     row?.squads?.length > 1
      //   ) {
      //     return (
      //       <ExpandContent
      //         gridParams={{
      //           key: GRID_TYPES.ATHLETE_SQUAD,
      //           userType: props.currentUserType,
      //         }}
      //         gridStartColumn="teams"
      //         onTransformData={transformMultiSquadToRows}
      //         rows={row?.squads || []}
      //       />
      //     );
      //   }

      //   return <></>;
      // },
    },
    gridName: props.gridName,
    enableFiltersPersistence: props.enableFiltersPersistence,
  })({
    filterOverrides: props.filterOverrides ?? {},
    gridQueryParams: props.gridQueryParams,
  });
};

export default TabAthleteList;
