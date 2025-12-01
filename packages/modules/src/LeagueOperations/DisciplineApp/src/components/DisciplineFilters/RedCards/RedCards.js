// @flow

import i18n from '@kitman/common/src/utils/i18n';
import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';
import SearchableSelect from '../SearchableSelect/SearchableSelect';

type OptionValue = {
  min: number | null,
  max: number | null,
};

type RedCardOption = {
  id: number,
  label: string,
  value: OptionValue,
};

const options: RedCardOption[] = [
  {
    id: 0,
    label: '0',
    value: {
      min: 0,
      max: 0,
    },
  },
  {
    id: 1,
    label: '1',
    value: {
      min: 1,
      max: 1,
    },
  },
  {
    id: 2,
    label: '2',
    value: {
      min: 2,
      max: 2,
    },
  },
  {
    id: 3,
    label: '3',
    value: {
      min: 3,
      max: 3,
    },
  },
  {
    id: 4,
    label: '4',
    value: {
      min: 4,
      max: 4,
    },
  },
  {
    id: 5,
    label: '5+',
    value: {
      min: 5,
      max: null,
    },
  },
];

const RedCards = ({
  searchQuery,
  requestStatus,
}: {
  searchQuery: (query: OptionValue | Array<OptionValue> | null) => void,
  requestStatus: RequestStatus,
}) => {
  const useQuery = () => {
    return {
      data: options,
      isLoading: false,
    };
  };

  return (
    <SearchableSelect
      label={i18n.t('Red cards')}
      useQueryHook={useQuery}
      searchQuery={searchQuery}
      requestStatus={requestStatus}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      sx={{
        flex: '1 1 auto',
        minWidth: 80,
        maxWidth: 124,
      }}
    />
  );
};

export default RedCards;
