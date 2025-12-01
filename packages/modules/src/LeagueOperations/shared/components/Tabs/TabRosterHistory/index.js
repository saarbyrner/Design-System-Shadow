// @flow
import i18n from '@kitman/common/src/utils/i18n';

import type { SquadHistoryItem } from '@kitman/services/src/services/getUserSquadHistory';
import type { RosterHistoryRows } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import { useGetUserSquadHistoryQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import withGridDataManagement from '@kitman/modules/src/LeagueOperations/shared/components/withGridDataManagement';
import type { TabProps } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import transformRosterHistoryRows from './utils';

type UserFetchParam = {
  id: number | string,
};

const TabRosterHistory = (props: TabProps<UserFetchParam>) => {
  const initialFilters: UserFetchParam = {
    id: '',
  };

  return withGridDataManagement<
    SquadHistoryItem,
    RosterHistoryRows,
    UserFetchParam
  >({
    useSearchQuery: useGetUserSquadHistoryQuery,
    initialFilters,
    title: i18n.t('Roster history'),
    onTransformData: transformRosterHistoryRows,
  })({
    filterOverrides: props.filterOverrides ?? {},
    gridQueryParams: props.gridQueryParams,
  });
};

export default TabRosterHistory;
