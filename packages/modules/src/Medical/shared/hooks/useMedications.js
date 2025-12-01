// @flow
import { useState } from 'react';
import { getDrFirstMedications } from '@kitman/services';
import type { DrFirstMedicationsFilter } from '@kitman/modules/src/Medical/shared/types';

const useMedications = () => {
  const [medications, setMedications] = useState([]);
  const [nextPage, setNextPage] = useState(null);

  const fetchMedications = async (
    filters: DrFirstMedicationsFilter,
    resetList: boolean
  ) => {
    const medicationsResponse = await getDrFirstMedications(
      filters,
      resetList ? undefined : nextPage
    );
    if (medicationsResponse?.medications) {
      setMedications((prevMedications) =>
        resetList
          ? medicationsResponse.medications
          : [...prevMedications, ...medicationsResponse.medications]
      );
    }
    setNextPage(medicationsResponse?.next_id);
  };

  const resetMedications = () => setMedications([]);
  const resetNextPage = () => setNextPage(null);

  return {
    medications,
    fetchMedications,
    resetMedications,
    resetNextPage,
    nextPage,
  };
};

export default useMedications;
