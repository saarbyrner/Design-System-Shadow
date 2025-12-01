import { axios } from '@kitman/common/src/utils/services';
import updateUserStatus from '@kitman/modules/src/StaffProfile/shared/redux/services/api/updateUserStatus';

describe('updateUserStatus', () => {
  const userId = 1;
  const requestBody = { is_active: true };
  let updateUserStatusRequest;

  beforeEach(() => {
    updateUserStatusRequest = jest.spyOn(axios, 'patch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await updateUserStatus(userId, requestBody);

    expect(returnedData).toEqual({});
    expect(updateUserStatusRequest).toHaveBeenCalledTimes(1);
    expect(updateUserStatusRequest).toHaveBeenCalledWith(
      `/users/${userId}`,
      requestBody,
      { headers: { Accept: 'application/json' } }
    );
  });

  it('calls the new endpoint - error response', async () => {
    updateUserStatusRequest = jest
      .spyOn(axios, 'patch')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await updateUserStatus(userId, requestBody);
    }).rejects.toThrow();
  });
});
