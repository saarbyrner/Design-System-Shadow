// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';
import SearchableSelect from '../SearchableSelect/SearchableSelect';

const ClubSelect = ({
  searchQuery,
  requestStatus,
}: {
  searchQuery: (query: string | Array<string> | null) => void,
  requestStatus: RequestStatus,
}) => {
  return (
    <SearchableSelect
      label={i18n.t('Club')}
      useQueryHook={useGetClubsQuery}
      searchQuery={searchQuery}
      requestStatus={requestStatus}
      getOptionLabel={(option) => option.name || ''}
      getOptionValue={(option) => option.id}
      wrapQueryValueInArray
      sx={{
        flex: '1 1 auto',
        minWidth: 100,
        maxWidth: 180,
      }}
    />
  );
};

export default ClubSelect;
