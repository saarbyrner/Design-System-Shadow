import { tagAnExercisesResponseData as serverResponse } from '@kitman/services/src/mocks/handlers/rehab/addGroupsToRehabSessionExercise';
import { axios } from '@kitman/common/src/utils/services';
import addGroupsToRehabSessionExercise from '../rehab/addGroupsToRehabSessionExercise';

describe('addGroupsToRehabSessionExercise', () => {
  let request;
  const dataToSend = { session_exercise_ids: [892], tag_ids: [25] };

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedDataFromGroup = await addGroupsToRehabSessionExercise(
      dataToSend
    );

    expect(returnedDataFromGroup).toEqual(serverResponse);
    expect(returnedDataFromGroup).toEqual({ success: true });
    expect(request).toHaveBeenCalledWith(
      '/ui/medical/rehab/session_exercises/tag',
      dataToSend
    );
  });
});
