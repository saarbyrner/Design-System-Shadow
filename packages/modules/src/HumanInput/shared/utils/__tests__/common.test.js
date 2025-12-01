import { FORM_STATUS } from '@kitman/modules/src/HumanInput/types/forms';

import {
  createFormAnswersRequestBody,
  createPatchAnswersPayload,
} from '../common';

describe('createFormAnswersRequestBody', () => {
  it('should create a request body with complete status', () => {
    const formAnswersSetId = 1;
    const answers = {
      1: 'answer1',
      2: 'answer2',
      3: '',
      4: null,
      5: undefined,
      6: [],
      7: ['value'],
    };
    const isSavingProgress = false;

    const result = createFormAnswersRequestBody(
      formAnswersSetId,
      answers,
      isSavingProgress
    );

    expect(result).toEqual({
      form_answers_set: {
        id: formAnswersSetId,
      },
      answers: [
        { form_element_id: 1, value: 'answer1' },
        { form_element_id: 2, value: 'answer2' },
        { form_element_id: 6, value: [] },
        { form_element_id: 7, value: ['value'] },
      ],
      isSavingProgress,
      status: FORM_STATUS.COMPLETE,
    });
  });

  it('should create a request body with draft status', () => {
    const formAnswersSetId = 1;
    const answers = {
      1: 'answer1',
      2: 'answer2',
      3: '',
      4: null,
      5: undefined,
      6: [],
      7: ['value'],
    };
    const isSavingProgress = true;

    const result = createFormAnswersRequestBody(
      formAnswersSetId,
      answers,
      isSavingProgress
    );

    expect(result).toEqual({
      form_answers_set: {
        id: formAnswersSetId,
      },
      answers: [
        { form_element_id: 1, value: 'answer1' },
        { form_element_id: 2, value: 'answer2' },
        { form_element_id: 7, value: ['value'] },
      ],
      isSavingProgress,
      status: FORM_STATUS.DRAFT,
    });
  });
});

describe('createPatchAnswersPayload', () => {
  it('should create a patch payload including all falsy values', () => {
    const formAnswersSetId = 123;
    const changedAnswers = {
      1: 'a new string',
      2: '',
      3: null,
      4: 0,
      5: false,
      6: [],
      7: undefined,
    };

    const result = createPatchAnswersPayload(changedAnswers, formAnswersSetId);

    expect(result).toEqual({
      form_answers_set: {
        id: formAnswersSetId,
      },
      answers: [
        { form_element_id: 1, value: 'a new string' },
        { form_element_id: 2, value: '' },
        { form_element_id: 3, value: null },
        { form_element_id: 4, value: 0 },
        { form_element_id: 5, value: false },
        { form_element_id: 6, value: [] },
        { form_element_id: 7, value: undefined },
      ],
      status: FORM_STATUS.DRAFT,
    });
  });

  it('should return an empty answers array if no answers are provided', () => {
    const formAnswersSetId = 456;
    const changedAnswers = {};

    const result = createPatchAnswersPayload(changedAnswers, formAnswersSetId);

    expect(result).toEqual({
      form_answers_set: {
        id: formAnswersSetId,
      },
      answers: [],
      status: FORM_STATUS.DRAFT,
    });
  });
});
