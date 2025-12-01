// @flow
import i18n from '@kitman/common/src/utils/i18n';
import capitalize from 'lodash/capitalize';
import { MenuItem } from '@kitman/playbook/components';
import { useFetchDisciplineStatusesQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';
import SearchableSelect from '../SearchableSelect/SearchableSelect';

const StatusSelect = ({
  searchQuery,
  requestStatus,
}: {
  searchQuery: (query: string | Array<string> | null) => void,
  requestStatus: RequestStatus,
}) => {
  return (
    <SearchableSelect
      label={i18n.t('Status')}
      useQueryHook={useFetchDisciplineStatusesQuery}
      searchQuery={searchQuery}
      requestStatus={requestStatus}
      getOptionLabel={(option) => capitalize(option)}
      getOptionValue={(option) => option}
      // Custom rendering for the dropdown list items
      renderOption={(props, option) => (
        <MenuItem {...props} key={option} sx={{ textTransform: 'capitalize' }}>
          {option}
        </MenuItem>
      )}
      sx={{
        flex: '1 1 auto',
        minWidth: 100,
        maxWidth: 170,
      }}
    />
  );
};

export default StatusSelect;
