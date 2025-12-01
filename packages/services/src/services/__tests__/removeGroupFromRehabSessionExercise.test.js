import { archiveGroupResponseData as serverResponse } from '@kitman/services/src/mocks/handlers/rehab/removeGroupFromRehabSessionExercise';
import { axios } from '@kitman/common/src/utils/services';
import removeGroupFromRehabSessionExercise from '../rehab/removeGroupFromRehabSessionExercise';

describe('removeGroupFromRehabSessionExercise', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'delete')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    await removeGroupFromRehabSessionExercise(111);

    expect(request).toHaveBeenCalledWith('/tags/111');
  });
});
