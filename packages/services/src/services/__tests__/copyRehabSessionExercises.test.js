import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/rehab/copyRehabSessionExercises';
import copyRehabSessionExercises from '../rehab/copyRehabSessionExercises';

describe('copyRehabSessionExercises', () => {
  let copyRehabSessionExercisesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    copyRehabSessionExercisesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await copyRehabSessionExercises({
      athlete_id: 300,
      exercise_instances_ids: [53, 51],
      destination_session_dates: ['2022-10-27T12:00:00.000+01:00'],
      issue_type: 'Injury',
      issue_id: 1,
    });
    expect(returnedData).toEqual(serverResponse);

    expect(copyRehabSessionExercisesRequest).toHaveBeenCalledTimes(1);
    expect(copyRehabSessionExercisesRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/rehab/session_exercises/copy',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 300,
        exercise_instances_ids: [53, 51],
        destination_session_dates: ['2022-10-27T12:00:00.000+01:00'],
        issue_type: 'injury',
        issue_id: 1,
      }),
    });
  });
});
