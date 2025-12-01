import { axios } from '@kitman/common/src/utils/services';

import { data } from '../mocks/handlers/applyRequirementStatus';

import applyRequirementStatus from '../applyRequirementStatus';

describe('applyRequirementStatus', () => {
  let applyRequirementStatusRequest;

  const args = {
    user_id: 123,
    section_id: 123,
    registration_id: 123,
    status: 'approved_organisation',
    annotation: 'yippeekiyay',
    registration_system_status_id: 1,
  };

  describe('when the request succeeds', () => {
    beforeEach(() => {
      applyRequirementStatusRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('fetches the requirements', async () => {
      const returnedData = await applyRequirementStatus(args);

      expect(returnedData).toEqual(data);

      expect(applyRequirementStatusRequest).toHaveBeenCalledTimes(1);
      expect(applyRequirementStatusRequest).toHaveBeenCalledWith(
        `/registration/registrations/${args.registration_id}/sections/${args.section_id}/status`,
        {
          user_id: args.user_id,
          status: args.status,
          annotation: args.annotation,
          registration_system_status_id: args.registration_system_status_id,
        }
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      applyRequirementStatusRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(applyRequirementStatus(args)).rejects.toThrow();
    });
  });
});
