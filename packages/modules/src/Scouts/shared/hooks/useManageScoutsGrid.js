/* eslint-disable camelcase */
// @flow
import { useState, useMemo, useEffect } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';

import { ScoutManagementHeaders } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle/headers';
import buildCellContent from '@kitman/modules/src/Scouts/ListScouts/src/components/cellBuilder';
import { useSearchScoutsQuery } from '../redux/services';

import type { Filters, GridConfig, Row, Column, Meta } from '../types';

type InitialData = {
  data: Array<Object>,
  meta: Object,
};

export type ReturnType = {
  grid: GridConfig,
  isScoutsListError: boolean,
  isScoutsListFetching: boolean,
  isScoutsListLoading: boolean,
  filteredSearchParams: Filters,
  onHandleFilteredSearch: Function,
  onUpdateFilter: Function,
  meta: Meta,
};

export const getEmptyTableText = (filters: Filters) =>
  filters.search_expression.length > 0
    ? i18n.t('No scouts match the search criteria')
    : i18n.t('No scouts have been registered yet');
const gridId = 'ManageScoutsGrid';

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

const useManageScoutsGrid = ({
  is_active = true,
}: {
  is_active: boolean,
}): ReturnType => {
  const initialFilters: Filters = {
    search_expression: '',
    per_page: 30,
    page: 1,
    is_active,
    types: ['scout'],
  };

  const [filteredSearchParams, setFilteredSearchParams] =
    useState<Filters>(initialFilters);
  const [debouncedFilteredSearchParams, setDebouncedFilteredSearchParams] =
    useState<Filters>(initialFilters);

  const {
    data: scoutsList = initialData,
    isFetching: isScoutsListFetching,
    isLoading: isScoutsListLoading,
    isError: isScoutsListError,
  } = useSearchScoutsQuery({ ...debouncedFilteredSearchParams });

  const columns: Array<Column> = useMemo(() => ScoutManagementHeaders, []);

  const buildRowData = (scouts): Array<Row> => {
    return (
      scouts?.map((scout) => ({
        id: scout.id,
        cells: columns.map((column) => ({
          id: column.row_key,
          content: buildCellContent(column, scout),
        })),
      })) || []
    );
  };

  const rows = useMemo(() => buildRowData(scoutsList.data), [scoutsList.data]);

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(filteredSearchParams),
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
    isScoutsListFetching,
    isScoutsListError,
    isScoutsListLoading,
    onHandleFilteredSearch,
    filteredSearchParams,
    onUpdateFilter,
    grid,
    meta: scoutsList.meta,
  };
};

export default useManageScoutsGrid;
