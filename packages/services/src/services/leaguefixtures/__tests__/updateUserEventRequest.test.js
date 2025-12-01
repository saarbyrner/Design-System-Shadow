import { axios } from '@kitman/common/src/utils/services';
import updateUserEventRequest from '../updateUserEventRequest';

describe('updateUserEventRequest', () => {
  const mockAttributes = {
    id: 5,
    status: 'approved',
    rejection_reason_id: undefined,
  };

  describe('success', () => {
    beforeEach(() => jest.spyOn(axios, 'patch'));

    afterEach(() => jest.restoreAllMocks());

    it('makes a backend call to save the user event request', async () => {
      await updateUserEventRequest(mockAttributes);

      expect(axios.patch).toHaveBeenCalledWith(
        `/planning_hub/user_event_requests/${mockAttributes.id}`,
        {
          status: mockAttributes.status,
          rejectOption: undefined,
          rejection_reason_id: undefined,
        }
      );
    });

    it('makes a backend call to save the user event request with a reason', async () => {
      await updateUserEventRequest({
        ...mockAttributes,
        rejectOption: {
          value: 1,
          label: 'Conflict of Interest',
          requiresText: true,
        },
      });

      expect(axios.patch).toHaveBeenCalledWith(
        `/planning_hub/user_event_requests/${mockAttributes.id}`,
        {
          status: mockAttributes.status,
          reason: 'Conflict of Interest',
          rejection_reason_id: 1,
        }
      );
    });

    it('makes a backend call to save the user event request with an attachment', async () => {
      const mockAttachment = {
        name: 'testFilename.png',
        url: 'https://image.net/testFilename.png',
        type: 'pdf',
      };
      await updateUserEventRequest({
        id: 1,
        attachment: mockAttachment,
      });

      expect(axios.patch).toHaveBeenCalledWith(
        `/planning_hub/user_event_requests/1`,
        {
          status: undefined,
          reason: undefined,
          rejection_reason_id: undefined,
          attachment: {
            name: mockAttachment.name,
            url: mockAttachment.url,
            type: mockAttachment.type,
          },
        }
      );
    });
  });
});
