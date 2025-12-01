// @flow
import { useState } from 'react';
import { getAllergies } from '@kitman/services';
import type { AllergyDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';
import type { AllergiesFilter } from '../types';

const useAllergies = () => {
  const [allergies, setAllergies] = useState<Array<AllergyDataResponse>>([]);
  const [nextAllergiesPage, setNextPage] = useState(null);

  const fetchAllergies = ({
    filters,
    resetList,
  }: {
    filters: AllergiesFilter,
    resetList: boolean,
  }): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) => {
      let fetchPromise;

      if (nextAllergiesPage !== null || resetList) {
        fetchPromise = getAllergies(filters, nextAllergiesPage);
      } else {
        resolve();
        return;
      }

      fetchPromise
        .then((data) => {
          if (data === undefined) {
            resolve();
            return;
          }

          setNextPage(data.next_id);

          if (resetList) {
            setAllergies(data.allergies || []);
          } else if (data.allergies) {
            setAllergies((prevAllergies) =>
              resetList
                ? data.allergies
                : [...prevAllergies, ...(data.allergies || [])]
            );
          }
          resolve();
        })
        .catch(() => {
          reject();
        });
    });

  const resetAllergies = () => setAllergies([]);
  const resetNextPage = () => setNextPage(null);

  return {
    allergies,
    fetchAllergies,
    resetAllergies,
    resetNextPage,
    nextAllergiesPage,
  };
};

export default useAllergies;
