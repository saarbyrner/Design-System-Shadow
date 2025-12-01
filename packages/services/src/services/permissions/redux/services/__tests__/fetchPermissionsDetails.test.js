import { data } from '@kitman/services/src/services/permissions/redux/services/mocks/data/fetchPermissionsDetails';
import { axios } from '@kitman/common/src/utils/services';
import fetchPermissionsDetails from '@kitman/services/src/services/permissions/redux/services/api/fetchPermissionsDetails';

describe('fetchPermissionsDetails', () => {
  let fetchPermissionsDetailsRequest;

  beforeEach(() => {
    fetchPermissionsDetailsRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    const staffId = 1;
    const returnedData = await fetchPermissionsDetails(staffId);

    expect(returnedData).toEqual(data);
    expect(fetchPermissionsDetailsRequest).toHaveBeenCalledTimes(1);
    expect(fetchPermissionsDetailsRequest).toHaveBeenCalledWith(
      `/administration/staff/${staffId}/permissions/edit`,
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      }
    );
  });
});
