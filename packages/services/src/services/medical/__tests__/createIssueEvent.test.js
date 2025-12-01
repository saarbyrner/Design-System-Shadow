import { axios } from '@kitman/common/src/utils/services';
import createIssueEvent, { createIssueEventUrl } from '../createIssueEvent';

describe('createIssueEvent', () => {
  let axiosPostSpy;

  beforeEach(() => {
    axiosPostSpy = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const eventData = {
      issue_occurrence_id: 132240,
      issue_occurrence_type: 'injury',
      issue_status_id: 4,
      event_date: '2025-08-08 05:00:00',
    };

    await createIssueEvent(eventData);

    expect(axiosPostSpy).toHaveBeenCalledTimes(1);
    expect(axiosPostSpy).toHaveBeenCalledWith(createIssueEventUrl, {
      event: eventData,
    });
  });

  it('handles axios errors correctly', async () => {
    const errorMessage = 'Server Error';
    axiosPostSpy.mockRejectedValueOnce(new Error(errorMessage));

    const eventData = {
      issue_occurrence_id: 132240,
      issue_occurrence_type: 'injury',
      issue_status_id: 4,
      event_date: '2025-08-08 05:00:00',
    };

    await expect(createIssueEvent(eventData)).rejects.toThrow(errorMessage);
  });
});
