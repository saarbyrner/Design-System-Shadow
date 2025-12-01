import { axios } from '@kitman/common/src/utils/services';

import fetchOrganisationPreference from '@kitman/services/src/services/fetchOrganisationPreference';

describe('fetchOrganisationPreference', () => {
  let fetchRequest;

  beforeEach(() => {
    fetchRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const key = 'my_preference';
    const returnedData = await fetchOrganisationPreference(key);

    expect(returnedData).toEqual({ value: true });
    expect(fetchRequest).toHaveBeenCalledTimes(1);
    expect(fetchRequest).toHaveBeenCalledWith(
      `/organisation_preferences/${key}`
    );
  });
});
