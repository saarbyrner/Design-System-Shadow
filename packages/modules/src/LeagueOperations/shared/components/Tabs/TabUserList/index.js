// @flow
import i18n from '@kitman/common/src/utils/i18n';

import type { Filters as SearchUserListFilters } from '@kitman/modules/src/LeagueOperations/shared/services/searchUserList';

import { DEFAULT_PAGE_SIZE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { UserRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import { useSearchUserListQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';

import withGridDataManagement from '@kitman/modules/src/LeagueOperations/shared/components/withGridDataManagement';
import type { TabProps } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import GridFilterAutocomplete from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterAutocomplete';
import GridFiltersContainer from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFiltersContainer';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';
import useGridActions from '../../../hooks/useGridActions';

import transformToStaffRows from './utils';
import { GridSearchTranslated as GridSearch } from '../../GridSearch';
import { GridStatusSelectTranslated as GridStatusSelect } from '../../GridStatusSelect';
import type { RequestStatus } from '../../../hooks/useManageGridData';

const TabUserList = (props: TabProps<SearchUserListFilters>) => {
  const initialFilters: SearchUserListFilters = {
    search_expression: '',
    registration_status: '',
    registration_system_status_id: null,
    squad_id: null,
    organisation_ids: null,
    per_page: DEFAULT_PAGE_SIZE,
    page: 1,
  };

  const { actions } = useGridActions();
  const {
    registrationFilterStatuses,
    isLoadingRegistrationFilterStatusesData,
    isErrorRegistrationFilterStatusesData,
  } = useRegistrationStatus({
    permissionGroup: 'staff',
  });

  const shouldDisableRegistrationStatusDropdown =
    isLoadingRegistrationFilterStatusesData ||
    isErrorRegistrationFilterStatusesData;

  const useResponsiveFilters = window.getFlag('lops-grid-filter-enhancements');

  const renderFilters = ({
    onUpdate,
    filters,
    requestStatus,
  }: {
    onUpdate: Function,
    filters: SearchUserListFilters,
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
        <GridStatusSelect
          value={filters.registration_status}
          onUpdate={(value) =>
            onUpdate({
              registration_status: value?.value ?? '',
              registration_system_status_id: value?.id ?? null,
              page: 1,
            })
          }
          userType="staff"
        />
      </>
    );
  };

  const renderResponsiveFilters = ({
    onUpdate,
    filters,
    requestStatus,
  }: {
    onUpdate: Function,
    filters: SearchUserListFilters,
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
            param="search_expression"
            onChange={(value) => {
              onUpdate({
                search_expression: value,
                page: 1,
              });
            }}
            value={filters.search_expression || ''}
            showSearchIcon
            disabled={isRequestPending}
          />
        }
        showClearAllButton
      >
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
      </GridFiltersContainer>
    );
  };

  return withGridDataManagement<User, UserRow, SearchUserListFilters>({
    useSearchQuery: useSearchUserListQuery,
    initialFilters,
    title: i18n.t('Staff'),
    onTransformData: transformToStaffRows,
    slots: {
      filters: useResponsiveFilters ? renderResponsiveFilters : renderFilters,
      onGetActions: ({ row }) => actions(row),
    },
    gridName: props.gridName,
    enableFiltersPersistence: props.enableFiltersPersistence,
  })({
    filterOverrides: props.filterOverrides ?? {},
    gridQueryParams: props.gridQueryParams,
  });
};

export default TabUserList;
