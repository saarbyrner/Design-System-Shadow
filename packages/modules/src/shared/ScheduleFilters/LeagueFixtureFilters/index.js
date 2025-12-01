// @flow
import { useState, useCallback, useRef, useEffect } from 'react';
import _debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { SearchBar } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/components/SearchBarFilter';
import { AppStatus, DateRangePicker, Select } from '@kitman/components';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { userEventRequestStatusFilterOptions } from '@kitman/common/src/consts/userEventRequestConsts';
import {
  getGameStatuses,
  getSquadNames,
  getTurnarounds,
  getCompetitions,
} from '@kitman/services';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { ClubFilterTranslated as ClubFilter } from '../ClubFilter';
import styles from '../../FixtureScheduleView/styles';

const status = {
  FAILURE: 'FAILURE',
};

type Props = {
  filters: EventFilters,
  setFilters: (partialState: $Shape<EventFilters>) => void,
  showAccessFilter: boolean,
};

const customSelectStyles = {
  menu: (base) => ({
    ...base,
    minWidth: '100%',
  }),
};

const Filters = ({
  filters,
  setFilters,
  t,
  showAccessFilter = false,
}: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState();
  const { isLeague, isOfficial, isLeagueStaffUser } = useLeagueOperations();
  const currentSquad = useSelector(getActiveSquad());
  const { preferences } = usePreferences();

  const [{ competitions, turnarounds, squadNames, gameStatuses }, setData] =
    useState({
      competitions: [],
      turnarounds: [],
      squadNames: [],
      gameStatuses: [],
    });

  const query = useRef(filters.search_expression);

  const getSelectOptions = (item) => {
    return {
      value: item.id,
      label: item.name,
    };
  };

  const getCompetitionsByDivisionId = useCallback(() => {
    const divisionId = currentSquad?.division[0]?.id;

    return getCompetitions({
      divisionIds: divisionId,
      allCompetitions: !isLeagueStaffUser,
      hideInactive: preferences?.league_schedule_hide_inactive_competitions,
    });
  }, [currentSquad]);

  useEffect(() => {
    Promise.all([
      getCompetitionsByDivisionId(),
      getTurnarounds(),
      getGameStatuses(),
      getSquadNames(),
    ])
      .then(
        ([
          fetchedCompetitions,
          fetchedTurnarounds,
          fetchedGameStatuses,
          fetchedSquadNames,
        ]) => {
          setData({
            competitions: fetchedCompetitions?.map(getSelectOptions) || [],
            turnarounds: fetchedTurnarounds,
            gameStatuses: Object.keys(fetchedGameStatuses).map((label) => ({
              label,
              value: fetchedGameStatuses[label],
            })),
            squadNames: fetchedSquadNames.map((squadName) => ({
              label: squadName,
              value: squadName,
            })),
          });
        }
      )
      .catch(() => setRequestStatus(status.FAILURE));
  }, [getCompetitionsByDivisionId]);

  const debounceFilters = useCallback(
    (value) => {
      if (query.current !== value) {
        query.current = value;
        setFilters({ search_expression: value });
      }
    },
    [filters]
  );

  const handleSearch = _debounce(debounceFilters, 1000);

  if (requestStatus === status.FAILURE)
    return <AppStatus status="error" isEmbed />;

  return (
    <div className="filters" css={styles.filterContainer}>
      <div css={styles.filter}>
        <SearchBar
          onChange={handleSearch}
          placeholder={t('Search fixtures')}
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

      <div data-testid="squad-filter" css={styles.filter}>
        <Select
          options={squadNames}
          onChange={(selectedSquadName) => {
            setFilters({ squad_names: selectedSquadName });
          }}
          value={filters.squad_names}
          placeholder={t('Squad')}
          isMulti
          customSelectStyles={customSelectStyles}
        />
      </div>

      <ClubFilter
        filters={filters}
        setFilters={setFilters}
        currentClub={currentSquad?.division[0]?.id}
      />

      <div data-testid="competition-filter" css={styles.filter}>
        <Select
          options={competitions}
          onChange={(selectedCompetitions) => {
            setFilters({ competitions: selectedCompetitions });
          }}
          value={filters.competitions}
          placeholder={t('Competitions')}
          isMulti
          customSelectStyles={customSelectStyles}
        />
      </div>

      {(isLeague || isOfficial) && (
        <div data-testid="status-filter" css={styles.filter}>
          <Select
            options={gameStatuses}
            onChange={(selectedStatus) => {
              setFilters({ statuses: selectedStatus });
            }}
            value={filters.statuses}
            placeholder={t('Status')}
            isMulti
            customSelectStyles={customSelectStyles}
          />
        </div>
      )}

      {showAccessFilter && (
        <div data-testid="request-status-filter" css={styles.filter}>
          <Select
            options={userEventRequestStatusFilterOptions}
            onChange={(selectedStatuses) => {
              setFilters({ user_event_requests_statuses: selectedStatuses });
            }}
            value={filters.user_event_requests_statuses}
            placeholder={t('Access')}
            isMulti
            customSelectStyles={customSelectStyles}
          />
        </div>
      )}
    </div>
  );
};

export const FiltersTranslated = withNamespaces()(Filters);
export default Filters;
