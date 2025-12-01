// @flow

import type {
  Answer,
  FormUpdateRequestBody,
} from '@kitman/services/src/services/humanInput/api/types';
import type { FieldState } from '@kitman/modules/src/HumanInput/types/forms';
import { FORM_STATUS } from '@kitman/modules/src/HumanInput/types/forms';

export const createFormAnswersRequestBody = (
  formAnswersSetId: number,
  answers: FieldState,
  isSavingProgress: boolean = false
): FormUpdateRequestBody => {
  let formAnswers: Array<Answer> = Object.keys(answers).map((key) => {
    const numericKey = +key;
    return {
      form_element_id: numericKey,
      value: answers[numericKey],
    };
  });

  /**
   * Filter out the falsy values (undefined, null, empty strings, and empty arrays) from the form answers.
   * When saving progress, only non-empty amd boolean values are retained.
   * Note: This may need to be updated in the future to handle cases where falsy values
   * need to be sent to the backend.
   */

  formAnswers = isSavingProgress
    ? formAnswers.filter(
        ({ value }) =>
          typeof value === 'boolean' ||
          (value && (Array.isArray(value) ? value.length > 0 : true))
      )
    : formAnswers.filter(({ value }) => typeof value === 'boolean' || value);

  return {
    form_answers_set: {
      id: formAnswersSetId,
    },
    answers: formAnswers,
    isSavingProgress,
    status: isSavingProgress ? FORM_STATUS.DRAFT : FORM_STATUS.COMPLETE,
  };
};

/**
 * Transforms a FieldState object into an array of Answer objects for a PATCH autosave request.
 * Unlike createFormAnswersRequestBody, this function DOES NOT filter out falsy values,
 * which is critical for notifying the backend when a field has been cleared.
 * @param {FieldState} answers - The object containing only the changed answers.
 * @param {number} formAnswersSetId - The ID of the form answers set.
 * @returns {Object} - The formatted payload for the PATCH request.
 */
export const createPatchAnswersPayload = (
  answers: FieldState,
  formAnswersSetId: number
) => {
  const formAnswers: Array<Answer> = Object.keys(answers).map((key) => {
    const numericKey = +key;
    return {
      form_element_id: numericKey,
      value: answers[numericKey],
    };
  });

  return {
    form_answers_set: {
      id: formAnswersSetId,
    },
    answers: formAnswers,
    status: FORM_STATUS.DRAFT,
  };
};

export default createFormAnswersRequestBody;
