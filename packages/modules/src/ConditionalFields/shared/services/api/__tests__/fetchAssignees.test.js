import { axios } from '@kitman/common/src/utils/services';

import { response } from '../../mocks/data/assignees.mock';
import fetchAssignees from '../fetchAssignees';

describe('fetchAssignees', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const versionId = 3;
    const returnedData = await fetchAssignees(versionId);

    expect(returnedData).toEqual(response.data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      const versionId = 3;
      await fetchAssignees(versionId);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/conditional_fields/squad_assignments/${versionId}`,
        {
          headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
          },
        }
      );
    });
  });
});
