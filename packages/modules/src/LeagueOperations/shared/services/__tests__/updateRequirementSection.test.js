import { axios } from '@kitman/common/src/utils/services';

import updateRequirementSection from '../updateRequirementSection';

describe('updateRequirementSection', () => {
  let updateRequirementSectionRequest;

  const args = {
    user_id: 123,
    id: 123,
    requirement_id: 1,
    answers: [{ form_element_id: 1, value: 42 }],
  };

  describe('when the request succeeds', () => {
    beforeEach(() => {
      updateRequirementSectionRequest = jest
        .spyOn(axios, 'put')
        .mockImplementation(() => Promise.resolve({ data: { message: 'OK' } }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('fetches the requirements', async () => {
      const returnedData = await updateRequirementSection(args);

      expect(returnedData).toEqual({ message: 'OK' });

      expect(updateRequirementSectionRequest).toHaveBeenCalledTimes(1);
      expect(updateRequirementSectionRequest).toHaveBeenCalledWith(
        `/registration/registrations/${args.registration_id}/sections/${args.id}`,
        {
          user_id: args.user_id,
          answers: args.answers,
        }
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      updateRequirementSectionRequest = jest
        .spyOn(axios, 'put')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(updateRequirementSection(args)).rejects.toThrow();
    });
  });
});
