import { axios } from '@kitman/common/src/utils/services';
import response from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registrations_sections';

import fetchRequirementSections from '../fetchRequirementSections';

describe('fetchRequirementSections', () => {
  let fetchRequirementSectionsRequest;

  const args = {
    registration_id: 2,
    user_id: 3,
    search_expression: '',
  };

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchRequirementSectionsRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data: response }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('fetches the requirements', async () => {
      const returnedData = await fetchRequirementSections(args);

      expect(returnedData).toEqual(response);

      expect(fetchRequirementSectionsRequest).toHaveBeenCalledTimes(1);
      expect(fetchRequirementSectionsRequest).toHaveBeenCalledWith(
        `/registration/registrations/${args.registration_id}/sections/search`,
        {
          search_expression: args.search_expression,
          user_id: 3,
        }
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchRequirementSectionsRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(fetchRequirementSections(args)).rejects.toThrow();
    });
  });
});
