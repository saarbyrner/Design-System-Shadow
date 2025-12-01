// @flow
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { Filters } from '@kitman/modules/src/UserMovement/shared/redux/services/api/searchAthletes';

import type {
  SearchAthleteProfile,
  Meta,
} from '@kitman/modules/src/UserMovement/shared/types';
import type { Squad } from '@kitman/services/src/services/getActiveSquad';
import {
  getOrganisation,
  getActiveSquad,
} from '@kitman/common/src/redux/global/selectors';
import {
  useSearchMovementOrganisationsListQuery,
  useLazySearchAthletesQuery,
  useGetPositionGroupsQuery,
  useGetDivisionsQuery,
} from '@kitman/modules/src/UserMovement/shared/redux/services';
import type {
  ActiveStatus,
  CareerStatus,
} from '@kitman/modules/src/AthleteManagement/shared/types';
import type {
  GridConfig,
  Row,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/types';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import { onSetStatuses } from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import buildCellContent from '../utils/cellBuilder';
import {
  getCellHeaders,
  getEmptyTableText,
  convertPositionsToOptions,
  mapToOption,
} from './utils';

type InitialData = {
  data: Array<SearchAthleteProfile>,
  meta: Meta,
};
export type Options = {
  value: number,
  label: string,
};
export type ReturnType = {
  grid: GridConfig,
  isManageAthletesGridError: boolean,
  isManageAthletesGridFetching: boolean,
  isManageAthletesGridLoading: boolean,
  filteredSearchParams: Filters,
  onHandleFilteredSearch: Function,
  onUpdateFilter: Function,
  onHandleRefetch: () => void,
  meta: Meta,
  data: Array<SearchAthleteProfile>,
  positionsOptions?: ?Array<Options> | [],
  organisationOptions: ?Array<Options> | [],
  divisionsOptions: ?Array<Options> | [],
};

const gridId = 'AthleteManagementGrid';

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

export const initialFilters = ({
  isActive,
  squadIds,
  canManageGameStatus,
}: {
  isActive: boolean,
  squadIds: null | Array<number>,
  canManageGameStatus?: boolean,
}): Filters => ({
  is_active: isActive,
  search_expression: '',
  division_ids: null,
  organisation_ids: null,
  position_ids: null,
  career_status: null,
  label_ids: null,
  squad_ids: squadIds,
  page: 1,
  per_page: 30,
  'include_athlete_game_status?': !!canManageGameStatus,
});

export const getActiveSquadID = (
  isAssociationAdmin: boolean,
  currentSquad: ?Squad
) => {
  return !isAssociationAdmin && currentSquad ? [currentSquad.id] : null;
};

// const useManageAthletesGrid = ({
//   careerStatus = 'ACTIVE_CAREER',
//   activeStatus = 'ACTIVE',
// }: {
//   activeStatus: ActiveStatus,
//   careerStatus: CareerStatus,
// }): ReturnType => {

/**
 * Custom hook to manage the athletes grid.
 * @param {Object} params - The parameters for the hook.
 * @param {ActiveStatus} params.activeStatus - active status of the athletes.
 * @param {CareerStatus} params.careerStatus - career status of the athletes.
 * @returns {ReturnType} - The return type of the hook.
 */
const useManageAthletesGrid = ({
  careerStatus = 'ACTIVE_CAREER',
  activeStatus = 'ACTIVE',
}: {
  activeStatus: ActiveStatus,
  careerStatus: CareerStatus,
}): ReturnType => {
  const dispatch = useDispatch();
  const currentOrganisation = useSelector(getOrganisation());
  const squadIds = useSelector(getActiveSquad());
  const isAssociationAdmin = !!currentOrganisation?.association_admin;
  const { preferences } = usePreferences();
  const initialFilterData = initialFilters({
    isActive: activeStatus === 'ACTIVE',
    squadIds: getActiveSquadID(isAssociationAdmin, squadIds),
    canManageGameStatus:
      preferences?.manage_athlete_game_status === 'athlete_game_status',
  });
  const [positionsOptions, setPositionsOptions] = useState<?Array<Options>>([]);
  const [organisationOptions, setOrganisationOptions] =
    useState<?Array<Options>>([]);
  const [divisionsOptions, setDivisionsOptions] = useState<?Array<Options>>([]);
  const [filteredSearchParams, setFilteredSearchParams] =
    useState<Filters>(initialFilterData);

  const [debouncedFilteredSearchParams, setDebouncedFilteredSearchParams] =
    useState<Filters>(initialFilterData);

  const [
    lazyFetchManageAthletesData,
    {
      data: manageAthletesData = initialData,
      isFetching: isManageAthletesGridFetching,
      isLoading: isManageAthletesGridLoading,
      isError: isManageAthletesGridError,
    },
  ] = useLazySearchAthletesQuery();

  const { data: positions } = useGetPositionGroupsQuery(undefined, {
    skip: false,
  });
  const { data: organisationData } = useSearchMovementOrganisationsListQuery();
  const { data: divisionsData } = useGetDivisionsQuery({
    childDivisionsOnly: true,
  });

  const columns: Array<Object> = getCellHeaders(isAssociationAdmin);

  /**
   * Builds the row data for the grid.
   * @param {Array<SearchAthleteProfile>} athletes - The list of athletes.
   * @returns {Array<Row>} - The row data for the grid.
   */
  const buildRowData = (athletes): Array<Row> => {
    return (
      athletes?.map((athlete) => ({
        id: athlete.user_id,
        cells: columns.map((column) => ({
          id: column.row_key,
          content: buildCellContent(column, athlete, currentOrganisation),
        })),
      })) || []
    );
  };

  const rows = buildRowData(manageAthletesData.data);

  useEffect(() => {
    dispatch(
      onSetStatuses({
        activeStatus,
        careerStatus,
      })
    );
  }, []);

  /**
   * useEffect to fetch athletes data when debouncedFilteredSearchParams changes.
   */
  useEffect(() => {
    lazyFetchManageAthletesData({ ...debouncedFilteredSearchParams });
  }, [debouncedFilteredSearchParams]);

  /**
   * useEffect to set options for positions, organisations, and divisions when their data changes.
   */
  useEffect(() => {
    setPositionsOptions(convertPositionsToOptions(positions));
    setOrganisationOptions(
      (organisationData && organisationData.map(mapToOption)) || []
    );
    setDivisionsOptions(
      (divisionsData && divisionsData.map(mapToOption)) || []
    );
  }, [positions, organisationData, divisionsData]);

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(filteredSearchParams, activeStatus),
    id: gridId,
  };

  /**
   * Updates the filter parameters.
   * @param {Object} partialFilter - The partial filter to update.
   */
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

  /**
   * useEffect to handle debounced search.
   */
  useEffect(handleDebounceSearch, [filteredSearchParams, handleDebounceSearch]);

  /**
   * Handles the filtered search.
   * @param {Object} newFilters - The new filters to apply.
   */
  const onHandleFilteredSearch = (newFilters = {}) => {
    onUpdateFilter(newFilters);
  };

  /**
   * Handles refetching the data.
   */
  const onHandleRefetch = () =>
    lazyFetchManageAthletesData({ ...initialFilterData });

  return {
    isManageAthletesGridFetching,
    isManageAthletesGridError,
    isManageAthletesGridLoading,
    onHandleFilteredSearch,
    filteredSearchParams,
    onUpdateFilter,
    grid,
    meta: manageAthletesData.meta,
    data: manageAthletesData.data,
    positionsOptions,
    organisationOptions,
    divisionsOptions,
    onHandleRefetch,
  };
};

export default useManageAthletesGrid;
