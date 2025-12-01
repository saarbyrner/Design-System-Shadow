// @flow
import { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _debounce from 'lodash/debounce';
import { withNamespaces } from 'react-i18next';
import { AppStatus, DateRangePicker } from '@kitman/components';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getTurnarounds } from '@kitman/services';
import { useIsMountedCheck } from '@kitman/common/src/hooks';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import SearchBar from './searchBar';
import { ClubFilterTranslated as ClubFilter } from '../ClubFilter';
import styles from './styles';

const status = {
  FAILURE: 'FAILURE',
};

type Props = {
  isLeague?: boolean,
  filters: EventFilters,
  setFilters: (partialState: $Shape<EventFilters>) => void,
};

function MatchdayManagementFilters({
  isLeague,
  filters,
  setFilters,
  t,
}: I18nProps<Props>) {
  const checkIsMounted = useIsMountedCheck();
  const currentSquad = useSelector(getActiveSquad());
  const [requestStatus, setRequestStatus] = useState();
  const [turnarounds, setTurnarounds] = useState([]);
  const query = useRef(filters.search_expression);

  useEffect(() => {
    getTurnarounds()
      .then((result) => {
        if (!checkIsMounted()) return;
        setTurnarounds(result);
      })
      .catch(() => setRequestStatus(status.FAILURE));
  }, []);

  const debounceByMatchId = useCallback(
    (value) => {
      if (query.current !== value) {
        query.current = value;
        setFilters({ search_expression: value });
      }
    },
    [setFilters]
  );
  const handleSearchByMatchId = _debounce(debounceByMatchId, 500);

  const debounceByRound = useCallback(
    (value) => {
      if (query.current !== value) {
        query.current = value;
        setFilters({ round_number: value });
      }
    },
    [setFilters]
  );

  const handleSearchByRound = _debounce(debounceByRound, 500);

  if (requestStatus === status.FAILURE)
    return <AppStatus status="error" isEmbed />;

  return (
    <div className="filters" css={styles.filterContainer}>
      <div css={styles.filter}>
        <SearchBar
          onChange={handleSearchByMatchId}
          placeholder={t('Search by match #')}
          value={filters.search_expression || ''}
        />
      </div>

      <div data-testid="date-filter" css={styles.filter}>
        <DateRangePicker
          position="right"
          onChange={(selectedDateRange) => {
            setFilters({ dateRange: selectedDateRange });
          }}
          value={filters.dateRange}
          turnaroundList={turnarounds || []}
          allowFutureDate
          allowAllPastDates
          kitmanDesignSystem
        />
      </div>

      {isLeague && (
        <ClubFilter
          setFilters={setFilters}
          filters={filters}
          currentClub={currentSquad?.division[0]?.id}
        />
      )}

      <div data-testid="round-filter" css={styles.filter}>
        <SearchBar
          onChange={handleSearchByRound}
          placeholder={t('Search by match day')}
          value={filters.round_number || ''}
          inputType="number"
        />
      </div>
    </div>
  );
}

export const MatchdayManagementFiltersTranslated = withNamespaces()(
  MatchdayManagementFilters
);
export default MatchdayManagementFilters;
