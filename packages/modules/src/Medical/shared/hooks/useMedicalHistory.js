// @flow
import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getAthleteMedicalHistory from '@kitman/services/src/services/getAthleteMedicalHistory';
import type { MedicalHistories } from '@kitman/services/src/services/getAthleteMedicalHistory';
import { saveMedicalHistory } from '../redux/actions';

type Data = {
  tue: MedicalHistories,
  vaccinations: MedicalHistories,
};

type UseMedicalHistoryOpts = {
  athleteId?: ?number,
  initialFetch?: boolean,
};

type UseMedicalHistoryReturnValue = {
  isLoading: boolean,
  data: Data,
  fetchMedicalHistory: () => Promise<void>,
};

const medicalHistorySelector = (athleteId) => (state) => {
  return (
    state?.medicalHistory?.[athleteId] || {
      tue: [],
      vaccinations: [],
    }
  );
};

const useMedicalHistory = ({
  athleteId,
  initialFetch,
}: UseMedicalHistoryOpts): UseMedicalHistoryReturnValue => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const data: Data = useSelector(medicalHistorySelector(athleteId));

  const fetchMedicalHistory = useCallback(async () => {
    if (athleteId) {
      try {
        setIsLoading(true);
        const result = await getAthleteMedicalHistory(athleteId);
        dispatch(saveMedicalHistory(athleteId, result));
      } finally {
        setIsLoading(false);
      }
    }
  }, [athleteId, dispatch]);

  useEffect(() => {
    if (initialFetch) {
      fetchMedicalHistory();
    }
  }, [fetchMedicalHistory, initialFetch]);

  return {
    isLoading,
    data,
    fetchMedicalHistory,
  };
};

export default useMedicalHistory;
