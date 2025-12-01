// @flow
import { useState, useEffect } from 'react';
import { useLazyGetExercisesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { isCanceledError } from '@kitman/common/src/utils/services';

// Types:
import type {
  Exercise,
  ExerciseSearchParams,
} from '@kitman/services/src/services/rehab/getExercises';
import type { RequestStatus } from '@kitman/common/src/types';

const useExerciseList = (
  exerciseSearchParams: ExerciseSearchParams,
  combinePages: boolean
) => {
  const [initialRequestStatus, setInitialRequestStatus] =
    useState<RequestStatus>('PENDING');
  const [loadedExercises, setLoadedExercises] = useState<Array<Exercise>>([]);
  const [nextPage, setNextPage] = useState<?number>(0);
  const [currentPage, setCurrentPage] = useState<?number>(0);
  const [getExercises] = useLazyGetExercisesQuery();

  useEffect(() => {
    const search = async () => {
      // Check exercise name has a least 1 character entered
      if (
        exerciseSearchParams.rehabExerciseName != null &&
        exerciseSearchParams.rehabExerciseName.trim() !== '' &&
        exerciseSearchParams.rehabExerciseName.length < 1
      ) {
        return;
      }

      try {
        setInitialRequestStatus('PENDING');
        const queryResult = await getExercises(exerciseSearchParams, true); // preferCacheValue
        if (queryResult.isError) {
          setInitialRequestStatus('FAILURE');
          return;
        }
        const paginatedExercises = queryResult.data;
        setNextPage(paginatedExercises.meta.next_page);
        setCurrentPage(paginatedExercises.meta.current_page);
        setLoadedExercises((prev) =>
          paginatedExercises.meta.current_page === 1 || !combinePages
            ? [...paginatedExercises.rehab_exercises]
            : [...prev, ...paginatedExercises.rehab_exercises]
        );
        setInitialRequestStatus('SUCCESS');
      } catch (error) {
        if (!isCanceledError(error)) {
          setInitialRequestStatus('FAILURE');
        }
      }
    };

    search();

    // Cleanup function to abort the request if the component unmounts
    return () => {
      getExercises?.abort?.();
    };
  }, [exerciseSearchParams, combinePages]);

  return {
    nextPage,
    loadedExercises,
    initialRequestStatus,
    currentPage,
  };
};

export default useExerciseList;
