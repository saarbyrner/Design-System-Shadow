import { axios } from '@kitman/common/src/utils/services';
import createUserEventRequest from '../createUserEventRequest';

describe('createUserEventRequest', () => {
  const eventIdRequest = {
    eventId: 5,
  };

  describe('success', () => {
    beforeEach(() => jest.spyOn(axios, 'post'));

    afterEach(() => jest.restoreAllMocks());

    it('makes a backend call to save the user event request', async () => {
      await createUserEventRequest(eventIdRequest);

      expect(axios.post).toHaveBeenCalledWith(
        '/planning_hub/user_event_requests',
        {
          event_id: eventIdRequest.eventId,
        }
      );
    });
  });
});
