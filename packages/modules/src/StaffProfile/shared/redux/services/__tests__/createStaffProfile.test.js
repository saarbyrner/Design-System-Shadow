import { axios } from '@kitman/common/src/utils/services';
import createStaffProfile from '@kitman/modules/src/StaffProfile/shared/redux/services/api/createStaffProfile';
import { data } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/data/fetchStaffProfile';

describe('createStaffProfile', () => {
  let createStaffProfileRequest;

  beforeEach(() => {
    createStaffProfileRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the create staff user endpoint', async () => {
    const requestBody = { answers: [] };

    const returnedData = await createStaffProfile({
      requestBody,
    });

    expect(returnedData).toEqual(data);
    expect(createStaffProfileRequest).toHaveBeenCalledTimes(1);
    expect(createStaffProfileRequest).toHaveBeenCalledWith(
      '/administration/staff',
      requestBody
    );
  });
});
