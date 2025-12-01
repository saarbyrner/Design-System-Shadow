import $ from 'jquery';
import serverResponse from '@kitman/services/src/mocks/handlers/rehab/updateExercise/updateData.mock';
import updateExercise from '../rehab/updateExercise';

describe('updateExercise', () => {
  let updateExerciseRequest;
  const updatedExercise = {
    exercise_instances: [
      {
        exercise_template_id: 56,
        exercise_instance_id: 47,
        session_id: 26,
        section_id: 3,
        order_index: 3,
        variations: [
          {
            key: 'sets-reps-weight',
            parameters: [
              {
                key: 'sets',
                value: 3,
              },
              {
                key: 'reps',
                value: 3,
              },
              {
                key: 'weight',
                value: 10,
                config: {
                  unit: 'lb',
                },
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    const deferred = $.Deferred();
    updateExerciseRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await updateExercise(updatedExercise);
    expect(returnedData).toEqual(serverResponse);

    expect(updateExerciseRequest).toHaveBeenCalledTimes(1);
    expect(updateExerciseRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/ui/medical/rehab/session_exercises',
      contentType: 'application/json',
      data: JSON.stringify(updatedExercise),
    });
  });
});
