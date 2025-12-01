// @flow
import $ from 'jquery';

const deleteExercise = (
  rehabSessionId: number,
  exerciseSessionId: number,
  rehabSessionSectionId: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `/ui/medical/rehab/session_exercises`,
      data: {
        rehab_session_id: rehabSessionId,
        session_exercise_id: exerciseSessionId,
        rehab_session_section_id: rehabSessionSectionId,
      },
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default deleteExercise;
