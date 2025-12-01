// @flow
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import {
  useSearchDisciplineAthleteListNoMergeStrategyQuery,
  useSearchDisciplineUserListNoMergeStrategyQuery,
  useFetchDisciplineStatusesQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import Grid from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/Grid';
import GridContainer from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridContainer';
import GridFiltersContainer from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFiltersContainer';
import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import GridFilterAutocomplete from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterAutocomplete';
import GridFilterAutocompleteMulti from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterAutocompleteMulti';
import GridFilterDateRange from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterDateRange';
import { useGetCompetitionsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import {
  TRANSLATED_DISCIPLINARY_STATUSES,
  YELLOW_CARD_OPTIONS,
  RED_CARD_OPTIONS,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import { getDisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import type { DisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import {
  getDisciplineColumns,
  mapDataToRows,
  getDefaultFilters,
} from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/DisciplineGrid/utils';

type Props = {
  seasonMarkers: { start_date: string | null, end_date: string | null },
  userType: 'athlete' | 'staff',
};

const DisciplineGrid = ({ seasonMarkers, userType }: Props) => {
  const dispatch = useDispatch();
  const permissions: DisciplinePermissions = useSelector(
    getDisciplinePermissions()
  );
  const currentSquad = useSelector(getActiveSquad());
  const defaultFilters = getDefaultFilters(seasonMarkers);

  const [filters, setFilters] = useState(defaultFilters);

  const updateFilter = (key: string, value, skipPageReset: boolean = false) => {
    setFilters((prev) => ({
      ...prev,
      // Reset the page to one on any filter change, except when the user clicks the pagination controls.
      page: skipPageReset ? prev.page : 1,
      [key]: value,
    }));
  };
  const isAthlete = userType === 'athlete';
  const isStaff = userType === 'staff';

  const athleteQuery = useSearchDisciplineAthleteListNoMergeStrategyQuery(
    filters,
    {
      skip: !isAthlete,
    }
  );

  const staffQuery = useSearchDisciplineUserListNoMergeStrategyQuery(filters, {
    skip: !isStaff,
  });

  const { data, isLoading, isFetching } = isAthlete ? athleteQuery : staffQuery;

  const users = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 0;
  const rows = mapDataToRows(users);
  const columns = getDisciplineColumns({ permissions, dispatch });

  const useResponsiveFilters = window.getFlag('lops-grid-filter-enhancements');

  return (
    <GridContainer>
      <GridFiltersContainer
        sx={{ px: 3 }}
        showClearAllButton={useResponsiveFilters}
        collapseAt={useResponsiveFilters ? 'xl' : 'lg'}
        searchField={
          <GridFilterSearch
            param="search_expression"
            value={filters.search_expression || ''}
            label={i18n.t('Search')}
            showSearchIcon={useResponsiveFilters}
            onChange={(value) => updateFilter('search_expression', value)}
          />
        }
      >
        <GridFilterAutocomplete
          useOptionsQuery={useGetCompetitionsQuery}
          queryArgs={{
            divisionIds: currentSquad?.division[0]?.id,
          }}
          label={i18n.t('Competitions')}
          placeholder={i18n.t('Competitions')}
          param="competition_ids"
          defaultValue={null}
          value={filters.competition_ids[0]}
          maxWidth={150}
          onChange={(selectedCompetition) => {
            const selectedCompetitionId = selectedCompetition?.id;
            updateFilter(
              'competition_ids',
              selectedCompetitionId ? [selectedCompetitionId] : []
            );
          }}
        />

        <GridFilterAutocompleteMulti
          useOptionsQuery={useGetClubsQuery}
          label={i18n.t('Club')}
          placeholder={i18n.t('Club')}
          param="filter_organisation_ids"
          defaultValue={null}
          value={filters.filter_organisation_ids}
          maxWidth={150}
          onChange={(organisations) => {
            const ids = Array.isArray(organisations)
              ? organisations.map((org) => org.id)
              : [];
            updateFilter('filter_organisation_ids', ids);
          }}
        />

        <GridFilterDateRange
          label={i18n.t('Date range')}
          value={filters.date_range}
          param="date_range"
          defaultValue={defaultFilters.date_range}
          onChange={(value) => {
            if (value?.start_date && value?.end_date) {
              updateFilter('date_range', value);
            } else {
              updateFilter('date_range', defaultFilters.date_range);
            }
          }}
        />

        <GridFilterAutocomplete
          label={i18n.t('Yellow cards')}
          placeholder={i18n.t('Yellow cards')}
          optionsOverride={YELLOW_CARD_OPTIONS}
          param="yellow_cards"
          defaultValue={null}
          maxWidth={142}
          value={
            YELLOW_CARD_OPTIONS.find(
              ({ value }) => value.min === filters.yellow_cards?.min
            )?.id || ''
          }
          onChange={(selectedYellowCard) => {
            const value = selectedYellowCard?.value;
            updateFilter('yellow_cards', value || {});
          }}
        />

        <GridFilterAutocomplete
          label={i18n.t('Red cards')}
          placeholder={i18n.t('Red cards')}
          optionsOverride={RED_CARD_OPTIONS}
          param="red_cards"
          defaultValue={null}
          maxWidth={142}
          value={
            RED_CARD_OPTIONS.find(
              ({ value }) => value.min === filters.red_cards?.min
            )?.id || ''
          }
          onChange={(selectedRedCard) => {
            const value = selectedRedCard?.value;
            updateFilter('red_cards', value || {});
          }}
        />

        <GridFilterAutocomplete
          useOptionsQuery={useFetchDisciplineStatusesQuery}
          label={i18n.t('Status')}
          placeholder={i18n.t('Status')}
          param="filter_discipline_status"
          defaultValue={null}
          value={filters.filter_discipline_status}
          maxWidth={142}
          transformOptions={(options = []) => {
            if (!Array.isArray(options)) {
              return [];
            }
            return options.map((option) => ({
              id: option,
              name: TRANSLATED_DISCIPLINARY_STATUSES[option],
            }));
          }}
          onChange={(selectedDisciplineStatus) => {
            const id = selectedDisciplineStatus?.id;
            updateFilter('filter_discipline_status', id || '');
          }}
        />
      </GridFiltersContainer>

      <Grid
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        totalPages={totalPages}
        page={filters.page}
        setPage={(page) => updateFilter('page', page, true)}
        isFetching={isFetching}
      />
    </GridContainer>
  );
};

export default DisciplineGrid;
