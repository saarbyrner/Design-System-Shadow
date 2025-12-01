// @flow
import $ from 'jquery';
import type { ExerciseVariation } from '../../../../modules/src/Medical/shared/components/RehabTab/types';

type Exercise = {
  id: number,
  name: string,
  variations_type: string,
  variations_title: string,
  variations_default: ExerciseVariation,
  notes: ?string,
  rehab_category: ?string,
  reason: ?string,
};

const getRehabExercise = (id: number): Promise<Exercise> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/medical/rehab/exercises/${id}`,
      contentType: 'application/json',
    })
      .done(resolve)
      .fail(reject);
  });

export default getRehabExercise;
