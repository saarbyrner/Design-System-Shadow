import { axios } from '@kitman/common/src/utils/services';
import { data as response } from '../mocks/handlers/fetchRequirementSectionHistory';

import fetchRequirementSectionHistory from '../fetchRequirementSectionHistory';

describe('fetchRequirementSectionHistory', () => {
  let fetchRequirementSectionHistoryRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchRequirementSectionHistoryRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data: response.data }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the correct params', async () => {
      const returnedData = await fetchRequirementSectionHistory({
        registration_id: 1,
        user_id: 1,
        section_id: 1,
      });

      expect(returnedData).toEqual(response.data);

      expect(fetchRequirementSectionHistoryRequest).toHaveBeenCalledTimes(1);
      expect(fetchRequirementSectionHistoryRequest).toHaveBeenCalledWith(
        '/registration/registrations/1/sections/1/history',
        {
          user_id: 1,
        }
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchRequirementSectionHistoryRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(
        fetchRequirementSectionHistory({
          registration_id: 1,
          user_id: 1,
          section_id: 1,
        })
      ).rejects.toThrow();
    });
  });
});
