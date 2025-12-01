import { axios } from '@kitman/common/src/utils/services';
import deleteCondition from '../deleteCondition';

describe('deleteCondition', () => {
  let request;

  beforeEach(() => {
    request = jest.spyOn(axios, 'delete');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns nothing', async () => {
    const requestParams = { rulesetId: '1', versionId: '1', conditionId: '1' };
    const response = await deleteCondition(requestParams);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(
      `/conditional_fields/rulesets/${requestParams.rulesetId}/versions/${requestParams.versionId}/conditions/${requestParams.conditionId}`
    );
    expect(response).toEqual({ message: 'Rule deleted' });
  });
});
