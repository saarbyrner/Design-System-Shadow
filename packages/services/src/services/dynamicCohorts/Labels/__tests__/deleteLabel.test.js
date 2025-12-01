import { axios } from '@kitman/common/src/utils/services';
import deleteLabel from '@kitman/services/src/services/dynamicCohorts/Labels/deleteLabel';
import baseLabelsURL from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/consts';

describe('bulkUpdateAthleteLabels', () => {
  let deleteRequest;

  beforeEach(() => {
    deleteRequest = jest.spyOn(axios, 'delete');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns nothing', async () => {
    const requestParams = 10;
    const response = await deleteLabel(requestParams);

    expect(deleteRequest).toHaveBeenCalledTimes(1);
    expect(deleteRequest).toHaveBeenCalledWith(
      `${baseLabelsURL}/${requestParams}`
    );
    expect(response).toEqual();
  });
});
