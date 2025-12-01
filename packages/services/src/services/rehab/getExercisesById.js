// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Exercise } from '@kitman/services/src/services/rehab/getExercises';

export const url = '/ui/medical/rehab/exercises/list';

const getExercisesById = async (
  ids: Array<number>,
  abortSignal?: AbortSignal
): Promise<Array<Exercise>> => {
  const { data } = await axios.post(
    url,
    { ids },
    abortSignal ? { signal: abortSignal } : {}
  );

  return data;
};

export default getExercisesById;
