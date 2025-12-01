import { axios } from '@kitman/common/src/utils/services';
import updatePermissionsDetails from '@kitman/services/src/services/permissions/redux/services/api/updatePermissionsDetails';

describe('updatePermissionsDetails', () => {
  let updatePermissionsDetailsRequest;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    updatePermissionsDetailsRequest = jest.spyOn(axios, 'put');

    const staffId = 1;
    const requestBody = {
      permission_group_id: 2,
      permissions: {
        alerts: { 'view-alerts': true, 'add-alerts': false },
        medical: { 'issues-view': true, 'issues-admin': false },
        'athlete-screening': { questionnaires: true },
      },
    };
    const response = {};

    const returnedData = await updatePermissionsDetails(staffId, requestBody);

    expect(returnedData).toEqual(response);
    expect(updatePermissionsDetailsRequest).toHaveBeenCalledTimes(1);
    expect(updatePermissionsDetailsRequest).toHaveBeenCalledWith(
      `/administration/staff/${staffId}/permissions`,
      requestBody
    );
  });

  it('calls the new endpoint - error response', async () => {
    updatePermissionsDetailsRequest = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => {
        throw new Error();
      });

    const staffId = 1;
    const requestBody = {
      permission_group_id: 2,
      permissions: {
        alerts: { 'view-alerts': true, 'add-alerts': false },
        medical: { 'issues-view': true, 'issues-admin': false },
        'athlete-screening': { questionnaires: true },
      },
    };

    await expect(async () => {
      await updatePermissionsDetails(staffId, requestBody);
    }).rejects.toThrow();
  });
});
