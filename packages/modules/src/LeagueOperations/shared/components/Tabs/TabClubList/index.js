// @flow
import i18n from '@kitman/common/src/utils/i18n';

import type { Filters as SearchOrganisationListFilters } from '@kitman/modules/src/LeagueOperations/shared/services/searchOrganisationList';
import { DEFAULT_PAGE_SIZE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import type { Organisation } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { OrganisationRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import { useSearchOrganisationListQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';

import withGridDataManagement from '@kitman/modules/src/LeagueOperations/shared/components/withGridDataManagement';
import type { TabProps } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';

import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import transformToOrganisationRows from './utils';
import { GridSearchTranslated as GridSearch } from '../../GridSearch';

const TabClubList = (props: TabProps<SearchOrganisationListFilters>) => {
  const initialFilters: SearchOrganisationListFilters = {
    search_expression: '',
    per_page: DEFAULT_PAGE_SIZE,
    page: 1,
  };

  const useResponsiveFilters = window.getFlag('lops-grid-filter-enhancements');

  return withGridDataManagement<
    Organisation,
    OrganisationRow,
    SearchOrganisationListFilters
  >({
    useSearchQuery: useSearchOrganisationListQuery,
    initialFilters,
    title: i18n.t('Clubs'),
    onTransformData: transformToOrganisationRows,
    slots: {
      filters: ({ onUpdate, filters, requestStatus }) => {
        const isRequestPending =
          requestStatus.isFetching ||
          requestStatus.isLoading ||
          requestStatus.isError;
        return (
          <>
            {useResponsiveFilters ? (
              <GridFilterSearch
                label={i18n.t('Search')}
                param="search_expression"
                onChange={(value) => {
                  onUpdate({
                    search_expression: value,
                    page: 1,
                  });
                }}
                value={filters.search_expression || ''}
                showSearchIcon
                disabled={isRequestPending}
              />
            ) : (
              <GridSearch
                value={filters.search_expression}
                onUpdate={(value) =>
                  onUpdate({
                    search_expression: value,
                    page: 1,
                  })
                }
                requestStatus={requestStatus}
              />
            )}
          </>
        );
      },
    },
    gridName: props.gridName,
    enableFiltersPersistence: props.enableFiltersPersistence,
  })({
    filterOverrides: props.filterOverrides ?? {},
    gridQueryParams: props.gridQueryParams,
  });
};

export default TabClubList;
