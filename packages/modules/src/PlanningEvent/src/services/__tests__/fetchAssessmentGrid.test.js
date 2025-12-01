import $ from 'jquery';
import { data as mockedAssessmentGrid } from '@kitman/services/src/mocks/handlers/planningEvent/fetchWorkloadGrid';
import fetchAssessmentGrid from '../fetchAssessmentGrid';

describe('fetchAssessmentGrid', () => {
  let fetchAssessmentGridRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    fetchAssessmentGridRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedAssessmentGrid));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchAssessmentGrid({
      eventId: 1,
      nextId: null,
      filters: {},
      assessmentGroupId: 1,
    });

    expect(returnedData).toEqual(mockedAssessmentGrid);

    expect(fetchAssessmentGridRequest).toHaveBeenCalledTimes(1);
    expect(fetchAssessmentGridRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/collections/assessments',
      contentType: 'application/json',
      data: JSON.stringify({
        assessment_group_id: 1,
        next_id: null,
        filters: {},
      }),
    });
  });
});
