// @flow

import i18n from '@kitman/common/src/utils/i18n';
import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';
import SearchableSelect from '../SearchableSelect/SearchableSelect';

type OptionValue = {
  min: number | null,
  max: number | null,
};

type YellowCardOption = {
  id: number,
  label: string,
  value: OptionValue,
};

const options: YellowCardOption[] = [
  {
    id: 0,
    label: '0',
    value: {
      min: 0,
      max: 0,
    },
  },
  {
    id: 5,
    label: '1-5',
    value: {
      min: 1,
      max: 5,
    },
  },
  {
    id: 10,
    label: '6-10',
    value: {
      min: 6,
      max: 10,
    },
  },
  {
    id: 15,
    label: '11-15',
    value: {
      min: 11,
      max: 15,
    },
  },
  {
    id: 20,
    label: '16-20',
    value: {
      min: 16,
      max: 20,
    },
  },
  {
    id: 21,
    label: '21+',
    value: {
      min: 21,
      max: null,
    },
  },
];

const YellowsCards = ({
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
      label={i18n.t('Yellow cards')}
      useQueryHook={useQuery}
      searchQuery={searchQuery}
      requestStatus={requestStatus}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      sx={{
        flex: '1 1 auto',
        minWidth: 100,
        maxWidth: 145,
      }}
    />
  );
};

export default YellowsCards;
