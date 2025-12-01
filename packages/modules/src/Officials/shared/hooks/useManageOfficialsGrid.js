/* eslint-disable camelcase */
// @flow
import { useState, useMemo, useEffect } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';

import { OfficialManagementHeaders } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle/headers';
import buildCellContent from '@kitman/modules/src/Officials/ListOfficials/src/components/cellBuilder';
import { useSearchOfficialsQuery } from '../redux/services';

import type { Filters, GridConfig, Row, Column, Meta } from '../types';

type InitialData = {
  data: Array<Object>,
  meta: Object,
};

export type ReturnType = {
  grid: GridConfig,
  isOfficialsListError: boolean,
  isOfficialsListFetching: boolean,
  isOfficialsListLoading: boolean,
  filteredSearchParams: Filters,
  onHandleFilteredSearch: Function,
  onUpdateFilter: Function,
  meta: Meta,
};

export const getEmptyTableText = (filters: Filters, isActive: boolean) => {
  if (filters.search_expression.length > 0) {
    return i18n.t('No officials match the search criteria');
  }
  if (isActive) {
    return i18n.t('No officials have been registered yet');
  }
  return i18n.t('No inactive officials found');
};

const gridId = 'ManageOfficialsGrid';

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

const useManageOfficialsGrid = ({
  is_active = true,
}: {
  is_active: boolean,
}): ReturnType => {
  const initialFilters: Filters = {
    search_expression: '',
    per_page: 30,
    page: 1,
    is_active,
  };

  const [filteredSearchParams, setFilteredSearchParams] =
    useState<Filters>(initialFilters);
  const [debouncedFilteredSearchParams, setDebouncedFilteredSearchParams] =
    useState<Filters>(initialFilters);

  const {
    data: officialsList = initialData,
    isFetching: isOfficialsListFetching,
    isLoading: isOfficialsListLoading,
    isError: isOfficialsListError,
  } = useSearchOfficialsQuery({ ...debouncedFilteredSearchParams });

  const columns: Array<Column> = useMemo(() => OfficialManagementHeaders, []);

  const buildRowData = (officials): Array<Row> => {
    return (
      officials?.map((official) => ({
        id: official.id,
        cells: columns.map((column) => ({
          id: column.row_key,
          content: buildCellContent(column, official),
        })),
      })) || []
    );
  };

  const rows = useMemo(
    () => buildRowData(officialsList.data),
    [officialsList.data]
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
    isOfficialsListFetching,
    isOfficialsListError,
    isOfficialsListLoading,
    onHandleFilteredSearch,
    filteredSearchParams,
    onUpdateFilter,
    grid,
    meta: officialsList.meta,
  };
};

export default useManageOfficialsGrid;
