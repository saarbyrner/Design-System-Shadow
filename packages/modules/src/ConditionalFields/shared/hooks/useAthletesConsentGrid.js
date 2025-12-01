// @flow
import { useState, useEffect, useMemo } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { useSearchConsentAthletesQuery } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import {
  CONSENTABLE_TYPE,
  CONSENTING_TO,
  type Athlete,
  type Meta,
} from '@kitman/common/src/types/Consent';
import type { Filters } from '@kitman/services/src/services/consent/searchAthletes';
import type { GridRow, GridColDef } from '@mui/x-data-grid-pro';
import type { GridConfig } from '@kitman/modules/src/ConditionalFields/shared/types';
import {
  AthleteColumn,
  SquadsColumn,
  ConsentColumn,
  ConsentDateColumn,
  ConsentActionsColumn,
} from '@kitman/modules/src/ConditionalFields/shared/components/AthletesConsentGrid/Columns';

type InitialAthletesData = {
  data: Array<Athlete>,
  meta: Meta,
};

export type ReturnType = {
  grid: GridConfig,
  isAthleteListFetching: boolean,
  isAthleteListLoading: boolean,
  isAthleteListError: boolean,
  isAthleteListSuccess: boolean,
  filters: Filters,
  onSearch: (searchString: string) => void,
  onUpdateFilter: (partialFilter: $Shape<Filters>) => void,
  meta: Meta,
};

export const getEmptyTableText = () => i18n.t('No athletes');

const gridId = 'AthletesConsentGrid';

const initialAthletesData: InitialAthletesData = {
  data: [],
  meta: {
    current_page: 0,
    next_page: null,
    prev_page: null,
    total_count: 0,
    total_pages: 0,
  },
};

const useAthletesConsentGrid = ({
  consentableType,
}: {
  consentableType: $Keys<typeof CONSENTABLE_TYPE>,
}): ReturnType => {
  const initialFilters: Filters = {
    consentable_type: consentableType,
    consenting_to: CONSENTING_TO.injury_surveillance_export,
    search_expression: '',
    include_inactive: false,
    is_active: true,
    consent_status: null,
    squad_ids: null,
    per_page: 100,
    page: 1,
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);

  const {
    data: athleteList = initialAthletesData,
    isFetching: isAthleteListFetching,
    isLoading: isAthleteListLoading,
    isError: isAthleteListError,
    isSuccess: isAthleteListSuccess,
  } = useSearchConsentAthletesQuery(filters, {
    skip: !consentableType,
  });

  const columns: Array<GridColDef> = useMemo(
    () => [
      AthleteColumn,
      SquadsColumn,
      ConsentColumn,
      ConsentDateColumn,
      ConsentActionsColumn,
    ],
    []
  );

  const buildRowData = (athletes): Array<GridRow> => {
    return athletes;
  };

  const rows = useMemo(() => buildRowData(athleteList.data), [athleteList]);

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(),
    id: gridId,
  };

  const onUpdateFilter = (partialFilter: $Shape<Filters>) => {
    setFilters((state) => ({
      ...state,
      ...partialFilter,
    }));
  };

  const onSearch = useDebouncedCallback((searchString: string) => {
    setFilters((state) => ({
      ...state,
      search_expression: searchString,
      page: 1,
    }));
  }, 400);

  // cancel debounce on unmount
  useEffect(() => () => onSearch?.cancel?.(), [onSearch]);

  return {
    isAthleteListFetching,
    isAthleteListError,
    isAthleteListLoading,
    isAthleteListSuccess,
    filters,
    onSearch,
    onUpdateFilter,
    grid,
    meta: athleteList.meta,
  };
};

export default useAthletesConsentGrid;
