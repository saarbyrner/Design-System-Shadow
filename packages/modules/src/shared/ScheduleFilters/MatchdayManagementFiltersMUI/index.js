// @flow
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import GridFilterDateRange from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterDateRange';
import GridFilterAutocompleteMultiple from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterAutocompleteMulti';
import GridFiltersContainer from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFiltersContainer';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';

type Props = {
  isLeague?: boolean,
  filters: EventFilters,
  initialFilters: EventFilters,
  setFilters: (partialState: $Shape<EventFilters>) => void,
};

function MatchdayManagementFiltersMUI({
  isLeague,
  filters,
  setFilters,
  initialFilters,
  t,
}: Props & I18nProps<Props>) {
  const currentSquad = useSelector(getActiveSquad());

  return (
    <GridFiltersContainer
      sx={{
        width: '100%',
      }}
      showClearAllButton
      searchField={
        <GridFilterSearch
          label={t('Search by match #')}
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

      {isLeague && (
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
      )}

      <GridFilterSearch
        label={t('Search by match day')}
        param="round_number"
        onChange={(value) => setFilters({ round_number: value })}
        value={filters.round_number || ''}
        showSearchIcon
        sx={{ width: '100%', maxWidth: '100%' }}
        inputType="number"
      />
    </GridFiltersContainer>
  );
}

export const MatchdayManagementFiltersMUITranslated = withNamespaces()(
  MatchdayManagementFiltersMUI
);
export default MatchdayManagementFiltersMUI;
