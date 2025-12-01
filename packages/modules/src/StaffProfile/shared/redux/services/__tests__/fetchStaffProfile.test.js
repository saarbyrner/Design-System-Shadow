import { data } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/data/fetchStaffProfile';
import { axios } from '@kitman/common/src/utils/services';

import fetchStaffProfile from '@kitman/modules/src/StaffProfile/shared/redux/services/api/fetchStaffProfile';

describe('fetchStaffProfile', () => {
  let fetchStaffProfileRequest;

  beforeEach(() => {
    fetchStaffProfileRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    const returnedData = await fetchStaffProfile();

    expect(returnedData).toEqual(data);
    expect(fetchStaffProfileRequest).toHaveBeenCalledTimes(1);
    expect(fetchStaffProfileRequest).toHaveBeenCalledWith(
      '/administration/staff/new',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      }
    );
  });

  it('calls the existing staff endpoint', async () => {
    const staffId = 2;
    const returnedData = await fetchStaffProfile(staffId);

    expect(returnedData).toEqual(data);
    expect(fetchStaffProfileRequest).toHaveBeenCalledTimes(1);
    expect(fetchStaffProfileRequest).toHaveBeenCalledWith(
      `/administration/staff/${staffId}/edit`,
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      }
    );
  });
});
