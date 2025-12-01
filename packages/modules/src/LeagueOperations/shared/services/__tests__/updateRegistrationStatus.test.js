import { axios } from '@kitman/common/src/utils/services';

import { data } from '../mocks/handlers/updateRegistrationStatus';

import updateRegistrationStatus from '../updateRegistrationStatus';

describe('updateRegistrationStatus', () => {
  let updateRegistrationStatusRequest;

  const args = {
    user_id: 123,
    registration_id: 123,
    status: 'approved_organisation',
    annotation: 'yippeekiyay',
    registration_system_status_id: 1,
  };

  describe('when the request succeeds', () => {
    beforeEach(() => {
      updateRegistrationStatusRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('fetches the requirements', async () => {
      const returnedData = await updateRegistrationStatus(args);

      expect(returnedData).toEqual(data);

      expect(updateRegistrationStatusRequest).toHaveBeenCalledTimes(1);
      expect(updateRegistrationStatusRequest).toHaveBeenCalledWith(
        `/registration/users/${args.user_id}/registrations/${args.registration_id}/status`,
        {
          status: args.status,
          annotation: args.annotation,
          registration_system_status_id: args.registration_system_status_id,
        }
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      updateRegistrationStatusRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(updateRegistrationStatus(args)).rejects.toThrow();
    });
  });
});
