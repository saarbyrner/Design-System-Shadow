// @flow
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { AppStatusTranslated as AppStatus } from '@kitman/components/src/AppStatus';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { userEventRequestStatusFilterOptionsMUI } from '@kitman/common/src/consts/userEventRequestConsts';
import {
  getGameStatuses,
  getSquadNames,
  getCompetitions,
} from '@kitman/services';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import GridFilterAutocompleteMultiple from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterAutocompleteMulti';

import GridFilterDateRange from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterDateRange';
import GridFiltersContainer from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFiltersContainer';
import styles from '../../FixtureScheduleView/styles';

const status = {
  FAILURE: 'FAILURE',
};

type Props = {
  filters: EventFilters,
  setFilters: (partialState: $Shape<EventFilters>) => void,
  initialFilters: EventFilters,
  showAccessFilter: boolean,
};

const LeagueFixtureFiltersMUI = ({
  t,
  filters,
  setFilters,
  initialFilters,
  showAccessFilter = false,
}: Props & I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState();
  const { isLeague, isOfficial, isLeagueStaffUser } = useLeagueOperations();
  const currentSquad = useSelector(getActiveSquad());

  const [{ competitions, squadNames, gameStatuses }, setData] = useState({
    competitions: [],
    squadNames: [],
    gameStatuses: [],
  });

  const getSelectOptions = (item) => {
    return {
      id: item.id,
      name: item.name,
    };
  };

  const getCompetitionsByDivisionId = useCallback(() => {
    const divisionId = currentSquad?.division[0]?.id;
    return getCompetitions({
      divisionIds: divisionId,
      allCompetitions: !isLeagueStaffUser,
    });
  }, [currentSquad]);

  useEffect(() => {
    Promise.all([
      getCompetitionsByDivisionId(),
      getGameStatuses(),
      getSquadNames(),
    ])
      .then(([fetchedCompetitions, fetchedGameStatuses, fetchedSquadNames]) => {
        setData({
          competitions: fetchedCompetitions?.map(getSelectOptions) || [],
          gameStatuses: Object.keys(fetchedGameStatuses).map((label) => ({
            id: fetchedGameStatuses[label],
            name: label,
            value: fetchedGameStatuses[label],
          })),
          squadNames: fetchedSquadNames.map((squadName) => ({
            id: squadName,
            name: squadName,
          })),
        });
      })
      .catch(() => setRequestStatus(status.FAILURE));
  }, [getCompetitionsByDivisionId]);

  if (requestStatus === status.FAILURE)
    return <AppStatus status="error" isEmbed />;

  return (
    <div className="filters" css={styles.filterContainer}>
      <GridFiltersContainer
        sx={{
          width: '100%',
        }}
        showClearAllButton
        searchField={
          <GridFilterSearch
            label={t('Search fixtures')}
            param="search_expression"
            onChange={(value) => setFilters({ search_expression: value })}
            value={filters.search_expression || ''}
            showSearchIcon
            sx={{ minWidth: '300px' }}
          />
        }
      >
        <GridFilterDateRange
          label={t('Date range')}
          value={filters.dateRange}
          param="dateRange"
          defaultValue={initialFilters.dateRange}
          onChange={(value) => {
            if (value?.start_date && value?.end_date) {
              setFilters({ dateRange: value });
            } else {
              setFilters({ dateRange: initialFilters.dateRange });
            }
          }}
        />

        <GridFilterAutocompleteMultiple
          label={t('Squad')}
          placeholder="Squad"
          onChange={(selectedSquadNames) => {
            if (Array.isArray(selectedSquadNames)) {
              const selectedValues = selectedSquadNames?.map(
                (squadName) => squadName.id
              );
              setFilters({
                squad_names: selectedValues,
              });
            }
          }}
          value={filters.squad_names || []}
          defaultValue={initialFilters.squad_names}
          param="squad_names"
          optionsOverride={squadNames}
          disableCloseOnSelect
        />

        <GridFilterAutocompleteMultiple
          label={t('Clubs')}
          placeholder={t('Clubs')}
          useOptionsQuery={useGetClubsQuery}
          queryArgs={{
            divisionIds: currentSquad?.division[0]?.id,
          }}
          transformOptions={(data) =>
            data.map((club) => ({
              id: club.id,
              name: club.name,
            }))
          }
          onChange={(selectedClubs) => {
            if (Array.isArray(selectedClubs)) {
              const selectedValues = selectedClubs?.map((club) =>
                Number(club.id)
              );
              setFilters({ organisations: selectedValues });
            }
          }}
          value={filters?.organisations ?? []}
          defaultValue={initialFilters.organisations}
          param="organisations"
          disableCloseOnSelect
        />

        <GridFilterAutocompleteMultiple
          label={t('Competitions')}
          placeholder={t('Competitions')}
          onChange={(selectedCompetitions) => {
            if (Array.isArray(selectedCompetitions)) {
              const selectedValues = selectedCompetitions?.map(
                (competition) => competition.id
              );
              setFilters({ competitions: selectedValues });
            }
          }}
          value={filters.competitions || []}
          defaultValue={initialFilters.competitions}
          param="competitions"
          optionsOverride={competitions}
          disableCloseOnSelect
        />

        {(isLeague || isOfficial) && (
          <GridFilterAutocompleteMultiple
            label={t('Status')}
            placeholder={t('Status')}
            onChange={(selectedStatuses) => {
              if (Array.isArray(selectedStatuses)) {
                const selectedValues = selectedStatuses?.map(
                  (selectedStatus) => selectedStatus.id
                );
                setFilters({ statuses: selectedValues });
              }
            }}
            value={filters.statuses || []}
            defaultValue={initialFilters.statuses}
            param="statuses"
            optionsOverride={gameStatuses}
            disableCloseOnSelect
          />
        )}

        {showAccessFilter && (
          <GridFilterAutocompleteMultiple
            label={t('Access')}
            placeholder={t('Access')}
            onChange={(selectedStatuses) => {
              if (Array.isArray(selectedStatuses)) {
                const selectedValues = selectedStatuses?.map(
                  (selectedStatus) => selectedStatus.id
                );
                setFilters({ user_event_requests_statuses: selectedValues });
              }
            }}
            value={filters.user_event_requests_statuses || []}
            defaultValue={initialFilters.user_event_requests_statuses}
            param="user_event_requests_statuses"
            optionsOverride={userEventRequestStatusFilterOptionsMUI}
            disableCloseOnSelect
          />
        )}
      </GridFiltersContainer>
    </div>
  );
};

export const LeagueFixtureFiltersMUITranslated = withNamespaces()(
  LeagueFixtureFiltersMUI
);
export default LeagueFixtureFiltersMUI;
