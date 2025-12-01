// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { useSelector } from 'react-redux';
import type { UserType } from '@kitman/modules/src/LeagueOperations/technicalDebt/types';
import { useState, useEffect } from 'react';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { DEFAULT_META_PARAMS } from '@kitman/modules/src/LeagueOperations/shared/consts';
import type {
  Meta,
  GridQueryParam,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { useSquadScopedPersistentState } from '@kitman/common/src/hooks';

export type DefaultFilterShape = {
  search_expression: string,
  page: number,
  per_page: number,
};

export type RequestStatus = {
  isError: boolean,
  isFetching: boolean,
  isLoading: boolean,
};

type RowIdToUserIdMap = Map<number, number>;

export type Actions<Filters> = {
  onSearch: ($Shape<Filters>) => void,
  onUpdate: ($Shape<Filters>) => void,
  // Prop infiniteLoadingCall in @kitman/playbook/components is inflexible with types.
  // This needs to be explored further.
  onScroll: (number) => void,
};

export type RequestResponse<QueryDataType> = {
  data: Array<QueryDataType>,
  meta: Meta,
};

export type ReturnType<QueryDataType, Filters> = {
  response: RequestResponse<QueryDataType>,
  rowIdToUserIdMap: RowIdToUserIdMap,
  columns: Array<GridColDef>,
  filters: Filters,
  noResultsMessage: string,
  requestStatus: RequestStatus,
  actions: Actions<Filters>,
};
/**
 * Shared grid data manager.
 * Responsilbe for fetching data via the passed RTK query
 * Managing post params and re-fetching when updated
 *
 * @param {FiltersShape} initialFilters service post parameters
 * @param {Function} useSearchQuery RTK query hook
 * @returns {ReturnType<QueryDataType, FiltersShape>}
 * @example
 * const {
 *    grid,
 *    requestStatus,
 *    params,
 *    noResultsMessage
 *    config,
 * }: ReturnType<QueryDataType, FiltersShape> =
 *  useManageGridData<
 *    FiltersShape,
 *    QueryDataType
 *  >({
 *    initialFilters,
 *    useSearchQuery: useMyRTKQuery,
 *  });
 */

const defaultGridQueryParams: GridQueryParam = {
  grid: null,
};

function useManageGridData<QueryDataType, FiltersShape>({
  initialFilters,
  useSearchQuery,
  gridQueryParams = defaultGridQueryParams,
  bulkAction,
  gridName,
  enableFiltersPersistence = false,
}: {
  initialFilters: FiltersShape,
  useSearchQuery: Function,
  gridQueryParams: GridQueryParam,
  bulkAction?: string,
  gridName?: string,
  enableFiltersPersistence?: boolean,
}): ReturnType<QueryDataType, FiltersShape> {
  const { state: filters, updateState: updateGridFilter } =
    useSquadScopedPersistentState({
      initialState: initialFilters,
      sessionKey: gridName ?? undefined,
      enablePersistence: enableFiltersPersistence,
      // $FlowIgnore page is a valid key
      excludeKeys: ['page'],
    });
  const [debouncedFilters, setDebouncedFilters] =
    useState<FiltersShape>(filters);
  const [rowIdToUserIdMap, setRowIdToUserIdMap] = useState<RowIdToUserIdMap>(
    new Map()
  );
  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );

  const currentSquad = useSelector(getActiveSquad());

  const {
    data: rawData = { data: [], meta: DEFAULT_META_PARAMS },
    isFetching: isDataFetching,
    isError: isDataError,
    isLoading: isDataLoading,
  }: {
    data: {
      data: Array<QueryDataType>,
      meta: Meta,
    },
    isFetching: boolean,
    isError: boolean,
    isLoading: boolean,
  } = useSearchQuery({ ...debouncedFilters });

  const {
    data: columns = [],
    isLoading: areColumnsLoading,
    isError: isColumnsError,
    isFetching: areColumnsFetching,
  } = useFetchRegistrationGridsQuery(
    {
      key: gridQueryParams.grid,
      userType: currentUserType,
      orgKey: currentSquad?.division[0]?.name,
    },
    { skip: !(gridQueryParams.grid || currentUserType) }
  );

  const onUpdateFilter = (partialFilter: FiltersShape) => {
    updateGridFilter({ ...partialFilter });
  };

  const handleDebounceSearch = useDebouncedCallback(
    () => setDebouncedFilters(filters),
    1000
  );

  useEffect(() => {
    handleDebounceSearch();
    return () => {
      handleDebounceSearch?.cancel?.();
    };
  }, [handleDebounceSearch]);

  useEffect(handleDebounceSearch, [filters, handleDebounceSearch]);

  const onHandleFilteredSearch = (newFilters: FiltersShape) => {
    onUpdateFilter(newFilters);
  };

  useEffect(() => {
    if (bulkAction === 'athlete' && rawData?.data?.length) {
      // this will allow us to map the row id to the user id
      // this is needed for the bulk action to work
      setRowIdToUserIdMap((prevMap) => {
        const newMap = new Map(prevMap);
        rawData.data.forEach((item) => {
          if (
            // $FlowIgnore item is an object
            !newMap.has(item.id)
          ) {
            // $FlowIgnore item is an object
            newMap.set(item.id, item.user_id);
          }
        });
        return newMap;
      });
    }
  }, [bulkAction, rawData.data]);

  // $FlowIgnore filters will be an object. It's passed in as such
  const noResultsMessage: string = Object.values(filters).map((v) => Boolean(v))
    ? i18n.t('No results match the search criteria.')
    : i18n.t('No results found.');

  const onHandleScroll = (nextPage: number) => {
    if (nextPage === rawData.meta.total_pages) {
      return;
    }
    onUpdateFilter({
      ...filters,
      page: (nextPage ?? 0) + 1,
    });
  };

  const isLoading = [isDataLoading, areColumnsLoading].some((v) => v);

  const isFetching = [isDataFetching, areColumnsFetching].some((v) => v);

  const isError = [isColumnsError, isDataError].some((v) => v);

  const config: ReturnType<QueryDataType, FiltersShape> = {
    response: rawData,
    rowIdToUserIdMap,
    actions: {
      onSearch: onHandleFilteredSearch,
      onUpdate: onUpdateFilter,
      onScroll: (nextPage = 0) => onHandleScroll(nextPage),
    },
    filters,
    noResultsMessage,
    columns,
    requestStatus: {
      isError,
      isFetching,
      isLoading,
    },
  };

  return config;
}

export default useManageGridData;
