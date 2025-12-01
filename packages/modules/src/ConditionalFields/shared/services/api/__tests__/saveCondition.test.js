import { axios } from '@kitman/common/src/utils/services';
import { response } from '../../mocks/data/mock_version';
import saveCondition from '../saveCondition';

const MOCK_CONDITION = response.data.conditions[0];

describe('saveCondition', () => {
  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await saveCondition({
        rulesetId: 58,
        versionId: 1,
        condition: MOCK_CONDITION,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/conditional_fields/rulesets/58/versions/1/conditions',
        MOCK_CONDITION
      );
    });
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveCondition({
      rulesetId: 58,
      versionId: 1,
      condition: MOCK_CONDITION,
    });

    expect(returnedData).toEqual(response.data.conditions[0]);
  });
});
