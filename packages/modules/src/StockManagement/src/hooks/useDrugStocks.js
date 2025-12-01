// @flow
import { useState } from 'react';
import { getDrugLots } from '@kitman/services';
import type {
  DrugLotFilters,
  DrugLot,
} from '@kitman/modules/src/Medical/shared/types/medical';
import type { RequestStatus } from '../../../Medical/shared/types';

const useDrugStocks = () => {
  const [drugListRequestStatus, setDrugListRequestStatus] =
    useState<RequestStatus>(null);

  const [drugList, setDrugList] = useState<Array<DrugLot>>([]);
  const [nextPage, setNextPage] = useState(null);

  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  const fetchDrugList = (
    filters: DrugLotFilters,
    resetList: boolean,
    abortSignal: AbortSignal
  ): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) => {
      getDrugLots(filters, resetList ? null : nextPage, abortSignal)
        .then((data) => {
          setIsInitialDataLoaded(true);
          setDrugList((prevDrugs) =>
            // $FlowIgnore[prop-missing]
            resetList ? data.stock_lots : [...prevDrugs, ...data.stock_lots]
          );

          setNextPage(data.next_id);
          if (!data.next_id) {
            resolve();
          }
        })
        .catch(reject);
    });

  const resetDrugList = () => {
    setDrugListRequestStatus('PENDING');
    setDrugList([]);
  };
  const resetNextPage = () => {
    setDrugListRequestStatus('PENDING');
    setNextPage(null);
  };

  return {
    drugList,
    fetchDrugList,
    resetDrugList,
    resetNextPage,
    nextPage,
    isInitialDataLoaded,
    drugListRequestStatus,
    setDrugListRequestStatus,
  };
};

export default useDrugStocks;
