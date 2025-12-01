// @flow
import { useSelector } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';

import { useGetClubSquadsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';
import { getCurrentOrganisation } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import SearchableSelect from '../SearchableSelect/SearchableSelect';

const TeamSelect = ({
  searchQuery,
  requestStatus,
}: {
  searchQuery: (query: string | Array<string> | null) => void,
  requestStatus: RequestStatus,
}) => {
  const currentOrganisation = useSelector(getCurrentOrganisation());

  return (
    <SearchableSelect
      label={i18n.t('Team')}
      useQueryHook={useGetClubSquadsQuery}
      queryHookArgs={[currentOrganisation.id]}
      searchQuery={searchQuery}
      requestStatus={requestStatus}
      getOptionLabel={(option) => option.name || ''}
      getOptionValue={(option) => option.id}
      wrapQueryValueInArray
      sx={{
        flex: '1 1 auto',
        minWidth: 100,
        maxWidth: 128,
      }}
    />
  );
};

export default TeamSelect;
