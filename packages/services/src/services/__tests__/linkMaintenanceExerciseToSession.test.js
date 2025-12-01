import $ from 'jquery';
// will import server data
import linkMaintenanceExerciseToSession from '../rehab/linkMaintenanceExerciseToSession';

describe('linkMaintenanceExerciseToSession', () => {
  let linkMaintenanceExerciseToSessionRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    linkMaintenanceExerciseToSessionRequest = jest
      .spyOn($, 'ajax')
      /* will be data from server */
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await linkMaintenanceExerciseToSession({
      session_id: 1,
      issue_type: 'Injury',
      issue_id: 1,
      exercise_instances_ids: [53, 51],
    });
    expect(returnedData).toEqual([]);

    expect(linkMaintenanceExerciseToSessionRequest).toHaveBeenCalledTimes(1);
    expect(linkMaintenanceExerciseToSessionRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/rehab/session_exercises/link',
      contentType: 'application/json',
      data: JSON.stringify({
        session_id: 1,
        issue_type: 'injury',
        issue_id: 1,
        exercise_instances_ids: [53, 51],
      }),
    });
  });

  it('calls the correct endpoint for chronic issue and returns the correct value', async () => {
    const returnedData = await linkMaintenanceExerciseToSession({
      session_id: 1,
      issue_type: 'Emr::Private::Models::ChronicIssue',
      issue_id: 1,
      exercise_instances_ids: [53, 51],
    });
    expect(returnedData).toEqual([]);

    expect(linkMaintenanceExerciseToSessionRequest).toHaveBeenCalledTimes(1);
    expect(linkMaintenanceExerciseToSessionRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/rehab/session_exercises/link',
      contentType: 'application/json',
      data: JSON.stringify({
        session_id: 1,
        issue_type: 'chronic',
        issue_id: 1,
        exercise_instances_ids: [53, 51],
      }),
    });
  });
});
