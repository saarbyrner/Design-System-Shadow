// @flow
import { useState } from 'react';
import { getTreatments } from '@kitman/services/';
import type { TreatmentSession, TreatmentAPIFilter } from '../types';

const useTreatments = () => {
  const [treatments, setTreatments] = useState<Array<TreatmentSession>>([]);
  const [nextPage, setNextPage] = useState(null);

  const fetchTreatments = (
    filters: TreatmentAPIFilter,
    resetList: boolean,
    abortSignal: AbortSignal
  ): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) =>
      getTreatments({
        filters,
        nextPage: resetList ? null : nextPage,
        scopeToSquad: false,
        abortSignal,
      }).then(
        (data) => {
          setTreatments((prevTreatmentSessions) =>
            resetList
              ? data.treatment_sessions
              : [...prevTreatmentSessions, ...data.treatment_sessions]
          );
          setNextPage(data.meta.next_page);
          if (!data.meta.next_page) {
            resolve();
          }
        },
        () => reject()
      )
    );

  const resetTreatments = () => setTreatments([]);
  const resetNextPage = () => setNextPage(null);

  return {
    treatments,
    fetchTreatments,
    resetTreatments,
    resetNextPage,
  };
};

export default useTreatments;
