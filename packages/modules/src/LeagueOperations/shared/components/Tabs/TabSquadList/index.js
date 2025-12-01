// @flow
import i18n from '@kitman/common/src/utils/i18n';

import type { Filters as SearchSquadListFilters } from '@kitman/modules/src/LeagueOperations/shared/services/searchSquadList';

import { DEFAULT_PAGE_SIZE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import type { Squad } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { SquadRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import { useSearchSquadListQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';

import withGridDataManagement from '@kitman/modules/src/LeagueOperations/shared/components/withGridDataManagement';
import type { TabProps } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';

import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import transformToSquadRows from './utils';
import { GridSearchTranslated as GridSearch } from '../../GridSearch';

const TabSquadList = (props: TabProps<SearchSquadListFilters>) => {
  const initialFilters: SearchSquadListFilters = {
    search_expression: '',
    registration_status: '',
    per_page: DEFAULT_PAGE_SIZE,
    squad_ids: null,
    organisation_ids: null,
    page: 1,
  };

  const useResponsiveFilters = window.getFlag('lops-grid-filter-enhancements');

  return withGridDataManagement<Squad, SquadRow, SearchSquadListFilters>({
    useSearchQuery: useSearchSquadListQuery,
    initialFilters,
    title: i18n.t('Teams'),
    onTransformData: transformToSquadRows,
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

export default TabSquadList;
