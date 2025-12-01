// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useGetCompetitionsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi';
import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';
import { useSelector } from 'react-redux';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import SearchableSelect from '../SearchableSelect/SearchableSelect';

const CompetitionSelect = ({
  searchQuery,
  requestStatus,
}: {
  searchQuery: (query: string | Array<string> | null) => void,
  requestStatus: RequestStatus,
}) => {
  const currentSquad = useSelector(getActiveSquad());
  const divisionId = currentSquad?.division[0]?.id;

  return (
    <SearchableSelect
      isMultiselect
      label={i18n.t('Competitions')}
      useQueryHook={useGetCompetitionsQuery}
      queryHookArgs={{
        divisionIds: divisionId,
      }}
      searchQuery={searchQuery}
      requestStatus={requestStatus}
      getOptionLabel={(option) => option.name || ''}
      getOptionValue={(option) => option.id}
      sx={{
        flex: '1 1 auto',
        minWidth: 124,
        maxWidth: 240,
      }}
    />
  );
};

export default CompetitionSelect;
