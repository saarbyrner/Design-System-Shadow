import $ from 'jquery';
import serverResponse from '@kitman/services/src/mocks/handlers/rehab/deleteExercise/deleteData.mock';
import deleteExercise from '../rehab/deleteExercise';

describe('deleteExercise', () => {
  let deleteEventRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    deleteEventRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await deleteExercise(5, 35, 6);
    expect(returnedData).toEqual(serverResponse);

    expect(deleteEventRequest).toHaveBeenCalledTimes(1);
    expect(deleteEventRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/ui/medical/rehab/session_exercises',
      data: {
        rehab_session_id: 5,
        rehab_session_section_id: 6,
        session_exercise_id: 35,
      },
    });
  });
});
