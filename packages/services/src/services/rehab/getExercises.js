// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExerciseVariation } from '../../../../modules/src/Medical/shared/components/RehabTab/types';

export type Exercise = {
  id: number,
  name: string,
  variations_type: string,
  variations_title: string,
  variations_default: ExerciseVariation,
  notes: ?string,
  rehab_category: ?string,
  reason: ?string,
};

export type PaginatedExercises = {
  rehab_exercises: Array<Exercise>,
  meta: {
    current_page: number,
    next_page: ?number,
    prev_page: ?number,
    total_pages: number,
    total_count: number,
  },
};

export type SearchMode = 'contains' | 'starts_with';
export type ExerciseSearchParams = {
  rehabExerciseName: ?string,
  rehabExerciseCategory: ?string,
  organisationId: ?number,
  page: number,
  resultsPerPage: ?number,
  searchMode: SearchMode,
};

export const url = '/ui/medical/rehab/exercises/search';

const getExercises = async (
  searchParams: ExerciseSearchParams,
  abortSignal?: AbortSignal
): Promise<PaginatedExercises> => {
  const params = {};
  if (
    searchParams.rehabExerciseName &&
    searchParams.rehabExerciseName.trim() !== ''
  ) {
    params.rehab_exercise_name = searchParams.rehabExerciseName;
  }
  if (
    searchParams.rehabExerciseCategory &&
    searchParams.rehabExerciseCategory.trim() !== ''
  ) {
    params.rehab_category_name = searchParams.rehabExerciseCategory;
  }
  if (searchParams.organisationId != null) {
    params.organisation_id = searchParams.organisationId;
  }

  if (searchParams.searchMode === 'starts_with') {
    params.starts_with = true;
  }

  params.page = searchParams.page;
  params.per_page = searchParams.resultsPerPage || 60;

  const { data } = await axios.post(
    url,
    params,
    abortSignal ? { signal: abortSignal } : {}
  );

  return data;
};

export default getExercises;
