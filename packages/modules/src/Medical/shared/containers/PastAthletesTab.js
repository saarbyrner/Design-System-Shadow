// @flow
import { useState, useEffect } from 'react';
import type { RequestStatus } from '@kitman/common/src/types';
import type {
  PastAthletes,
  PastAthletesGridPayload,
} from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/types';
import { useGetPastAthletesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { Paper } from '@kitman/playbook/components';
import { PastAthletesTabTranslated as PastAthletesTab } from '@kitman/modules/src/Medical/shared/components/PastAthletesTab';

const initialData = {
  athletes: [],
  meta: {
    current_page: 0,
    next_page: null,
    prev_page: null,
    total_count: 0,
    total_pages: 0,
  },
};

const PastAthletesTabContainer = () => {
  const [payload, setPayload] = useState<PastAthletesGridPayload>({
    filters: {
      athlete_name: null,
    },
    page: 1,
  });

  const {
    data: pastAthletesData = initialData,
    isLoading: isPastAthletesDataLoading = false,
    isFetching: isPastAthletesDataFetching = false,
    isSuccess: isPastAthletesDataSuccess = false,
    isError: isPastAthletesDataError = false,
  }: {
    data: PastAthletes,
    isLoading: boolean,
    isFetching: boolean,
    isSuccess: boolean,
    isError: boolean,
  } = useGetPastAthletesQuery(payload);

  const getRequestStatus = (): RequestStatus => {
    if (isPastAthletesDataFetching || isPastAthletesDataLoading) {
      return 'PENDING';
    }
    if (isPastAthletesDataSuccess) {
      return 'SUCCESS';
    }
    if (isPastAthletesDataError) {
      return 'FAILURE';
    }
    return null;
  };

  const onSearch = (value) => {
    setPayload((prevState) => ({
      ...prevState,
      filters: {
        athlete_name: value || null,
      },
      page: 1,
    }));
  };

  const onSearchDebounced = useDebouncedCallback(onSearch, 500);

  useEffect(
    () => () => {
      onSearchDebounced?.cancel?.();
    },
    [onSearchDebounced]
  );

  return (
    <Paper variant="outlined" sx={{ width: '100%' }} square>
      <PastAthletesTab
        pastAthletes={pastAthletesData}
        setPayload={setPayload}
        onSearch={(value) => onSearchDebounced(value)}
        requestStatus={getRequestStatus()}
      />
    </Paper>
  );
};

export default PastAthletesTabContainer;
