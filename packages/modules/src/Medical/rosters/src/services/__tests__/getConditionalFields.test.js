import $ from 'jquery';
import {
  getConditionalFields,
  getFollowUpQuestions,
} from '../getConditionalFields';

const mockedQuestions = [
  {
    id: 123,
    parent_question_id: null,
    question: 'Favourite animal?',
    question_type: 'multiple-choice',
    order: 1,
    question_metadata: [
      { value: 'Wombats', order: 2 },
      { value: 'Koalas', order: 1 },
    ],
  },
];

describe('getConditionalFields', () => {
  let getConditionalFieldsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getConditionalFieldsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedQuestions));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getConditionalFields({
      activity_id: 1,
      activity_group_id: 2,
      osics_classification_id: 3,
      osics_pathology_id: 4,
      osics_body_area_id: 5,
      event_type_id: 6,
      illness_onset_id: 7,
    });

    expect(returnedData).toEqual(mockedQuestions);

    expect(getConditionalFieldsRequest).toHaveBeenCalledTimes(1);
    expect(getConditionalFieldsRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/conditional_fields/fetch_questions',
      data: {
        activity_id: 1,
        activity_group_id: 2,
        osics_classification_id: 3,
        osics_pathology_id: 4,
        osics_body_area_id: 5,
        event_type_id: 6,
        illness_onset_id: 7,
      },
    });
  });
});

describe('getFollowUpQuestions', () => {
  let getFollowUpQuestionsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getFollowUpQuestionsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedQuestions));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getFollowUpQuestions({
      question_id: 1,
      value: 'Answer',
    });

    expect(returnedData).toEqual(mockedQuestions);

    expect(getFollowUpQuestionsRequest).toHaveBeenCalledTimes(1);
    expect(getFollowUpQuestionsRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/conditional_fields/fetch_followup_questions',
      data: {
        question_id: 1,
        answer: 'Answer',
      },
    });
  });
});
