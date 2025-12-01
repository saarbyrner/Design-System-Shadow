import $ from 'jquery';
import serverResponse from '@kitman/services/src/mocks/handlers/rehab/deleteExercise/deleteData.mock';
import deleteSession from '../rehab/deleteSession';

describe('deleteSession', () => {
  let deleteSessionRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    deleteSessionRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const deleteParams = {
      rehab_sessions: [
        {
          id: 806,
          section_ids: [805],
        },
      ],
    };
    const returnedData = await deleteSession(deleteParams);
    expect(returnedData).toEqual(serverResponse);

    expect(deleteSessionRequest).toHaveBeenCalledTimes(1);
    expect(deleteSessionRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/ui/medical/rehab/session_exercises/bulk_destroy',
      contentType: 'application/json',
      data: JSON.stringify(deleteParams),
    });
  });

  it('includes issues details when provided', async () => {
    const deleteParams = {
      rehab_sessions: [
        {
          id: 806,
          section_ids: [805],
        },
      ],
      issues: [{ issue_type: 'injury', issue_id: 1 }],
    };
    const returnedData = await deleteSession(deleteParams);
    expect(returnedData).toEqual(serverResponse);

    expect(deleteSessionRequest).toHaveBeenCalledTimes(1);
    expect(deleteSessionRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/ui/medical/rehab/session_exercises/bulk_destroy',
      contentType: 'application/json',
      data: JSON.stringify(deleteParams),
    });
  });
});
