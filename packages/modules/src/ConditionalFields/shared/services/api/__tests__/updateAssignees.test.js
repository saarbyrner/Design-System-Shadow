import { axios } from '@kitman/common/src/utils/services';

import { response } from '../../mocks/data/assignees.mock';
import updateAssignees from '../updateAssignees';

describe('updateAssignees', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const versionId = 3;
    const returnedData = await updateAssignees({
      rulesetCurrentVersionId: versionId,
      assignments: {
        squad_id: 73,
        active: true,
      },
    });

    expect(returnedData).toEqual(response.data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'patch');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      const versionId = 3;
      await updateAssignees({
        rulesetCurrentVersionId: versionId,
        assignments: {
          squad_id: 73,
          active: true,
        },
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/conditional_fields/squad_assignments/${versionId}`,
        {
          assignments: { active: true, squad_id: 73 },
          screening_ruleset_version_id: 3,
        }
      );
    });
  });
});
