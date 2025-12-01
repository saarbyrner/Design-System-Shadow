/* eslint-disable camelcase */
// @flow
import { useState, useMemo, useEffect } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';

import buildCellContent from '@kitman/modules/src/AdditionalUsers/ListAdditionalUsers/src/components/cellBuilder';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useSearchAdditionalUsersQuery } from '../redux/services';

import type {
  Filters,
  GridConfig,
  Row,
  Column,
  Meta,
  AdditionalUserTypes,
} from '../types';
import { AdditionalUserManagementHeaders } from '../consts';

type InitialData = {
  data: Array<Object>,
  meta: Object,
};

export type ReturnType = {
  grid: GridConfig,
  isAdditionalUsersListError: boolean,
  isAdditionalUsersListFetching: boolean,
  isAdditionalUsersListLoading: boolean,
  filteredSearchParams: Filters,
  onHandleFilteredSearch: Function,
  onUpdateFilter: Function,
  meta: Meta,
  manageableUserTypes: Array<AdditionalUserTypes>,
};

export const getEmptyTableText = (filters: Filters, isActive: boolean) => {
  if (filters.search_expression.length > 0) {
    return i18n.t('No users match the search criteria');
  }
  if (isActive) {
    return i18n.t('No users have been registered yet');
  }
  return i18n.t('No inactive users found');
};

const gridId = 'ManageAdditionalUsersGrid';

const initialData: InitialData = {
  data: [],
  meta: {
    current_page: 0,
    next_page: null,
    prev_page: null,
    total_count: 0,
    total_pages: 0,
  },
};

const useManageAdditionalUsersGrid = ({
  is_active = true,
}: {
  is_active: boolean,
}): ReturnType => {
  const { permissions } = usePermissions();

  const initialFilters: Filters = {
    search_expression: '',
    per_page: 30,
    page: 1,
    include_inactive: false,
    is_active,
    types: [],
  };

  const [filteredSearchParams, setFilteredSearchParams] =
    useState<Filters>(initialFilters);
  const [debouncedFilteredSearchParams, setDebouncedFilteredSearchParams] =
    useState<Filters>(initialFilters);

  const {
    data: additionalUsersList = initialData,
    isFetching: isAdditionalUsersListFetching,
    isLoading: isAdditionalUsersListLoading,
    isError: isAdditionalUsersListError,
  } = useSearchAdditionalUsersQuery({ ...debouncedFilteredSearchParams });

  const columns: Array<Column> = useMemo(
    () => AdditionalUserManagementHeaders,
    []
  );

  const manageableUserTypes = [];
  const {
    settings: {
      canManageOfficials,
      canManageScouts,
      canManageMatchDirectors,
      canManageMatchMonitors,
    },
  } = permissions;

  if (canManageOfficials) manageableUserTypes.push('official');
  if (canManageScouts) manageableUserTypes.push('scout');
  if (canManageMatchDirectors) manageableUserTypes.push('match_director');
  if (canManageMatchMonitors) manageableUserTypes.push('match_monitor');

  const buildRowData = (additionalUsers): Array<Row> => {
    return (
      additionalUsers?.map((additionalUser) => ({
        id: additionalUser.id,
        cells: columns.map((column) => ({
          id: column.row_key,
          content: buildCellContent(
            column,
            additionalUser,
            permissions?.settings
          ),
        })),
      })) || []
    );
  };

  const rows = useMemo(
    () => buildRowData(additionalUsersList.data),
    [additionalUsersList.data]
  );

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(filteredSearchParams, is_active),
    id: gridId,
  };

  const onUpdateFilter = (partialFilter: $Shape<Filters>) => {
    setFilteredSearchParams((state) => ({
      ...state,
      ...partialFilter,
    }));
  };

  const handleDebounceSearch = useDebouncedCallback(
    () => setDebouncedFilteredSearchParams(filteredSearchParams),
    400
  );

  useEffect(handleDebounceSearch, [filteredSearchParams]);

  const onHandleFilteredSearch = (newFilters = {}) => {
    onUpdateFilter(newFilters);
  };

  return {
    isAdditionalUsersListFetching,
    isAdditionalUsersListError,
    isAdditionalUsersListLoading,
    onHandleFilteredSearch,
    filteredSearchParams,
    onUpdateFilter,
    grid,
    meta: additionalUsersList.meta,
    manageableUserTypes,
  };
};

export default useManageAdditionalUsersGrid;
