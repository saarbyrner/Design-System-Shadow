import { axios } from '@kitman/common/src/utils/services';
import deleteUserEventRequest from '../deleteUserEventRequest';

describe('deleteUserEventRequest', () => {
  const params = {
    userEventRequestId: 5,
  };

  describe('success', () => {
    beforeEach(() => jest.spyOn(axios, 'delete'));

    afterEach(() => jest.restoreAllMocks());

    it('makes a backend call to save the user event request', async () => {
      await deleteUserEventRequest(params);

      expect(axios.delete).toHaveBeenCalledWith(
        `/planning_hub/user_event_requests/${params.userEventRequestId}`
      );
    });
  });
});
