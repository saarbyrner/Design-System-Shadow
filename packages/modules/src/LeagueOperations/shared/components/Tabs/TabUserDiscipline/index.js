// @flow
import { useDispatch } from 'react-redux';
import { DEFAULT_PAGE_SIZE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import { type DisciplineSearchItem } from '@kitman/modules/src/LeagueOperations/shared/types/discipline/';
import type { UserDisciplineRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import { useSearchDisciplineUserListQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import withGridDataManagement from '@kitman/modules/src/LeagueOperations/shared/components/withGridDataManagement';
import type { TabProps } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import { renderSharedSlots } from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/DisciplineTabs/utils';
import { defaultDisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/permissions';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';

import transformToUserDisciplineRows from './utils';
import type { DisciplineSearchParams } from '../../../types/discipline';

const TabUserDiscipline = (props: TabProps<DisciplineSearchParams>) => {
  const dispatch = useDispatch();
  const { isLeague } = useLeagueOperations();

  const initialFilters: DisciplineSearchParams = {
    search_expression: '',
    filter_organisation_ids: [],
    squad_ids: [],
    filter_discipline_status: '',
    competition_ids: [],
    yellow_cards: { min: null, max: null },
    red_cards: { min: null, max: null },
    date_range: { start_date: null, end_date: null },
    per_page: DEFAULT_PAGE_SIZE,
    page: 1,
  };

  const overrides = { ...initialFilters, ...(props.filterOverrides ?? {}) };

  const permissions = props.permissions ?? defaultDisciplinePermissions;

  return withGridDataManagement<
    DisciplineSearchItem,
    UserDisciplineRow,
    DisciplineSearchParams
  >({
    useSearchQuery: useSearchDisciplineUserListQuery,
    initialFilters,
    onTransformData: transformToUserDisciplineRows,
    slots: renderSharedSlots(dispatch, permissions, isLeague, overrides),
  })({
    filterOverrides: props.filterOverrides ?? {},
    gridQueryParams: props.gridQueryParams,
  });
};

export default TabUserDiscipline;
