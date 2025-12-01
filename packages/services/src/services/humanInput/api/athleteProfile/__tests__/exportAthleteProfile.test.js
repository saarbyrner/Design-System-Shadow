import { axios } from '@kitman/common/src/utils/services';
import exportAthleteProfile from '@kitman/services/src/services/humanInput/api/athleteProfile/exportAthleteProfile';
import { requestBody } from '@kitman/services/src/services/humanInput/api/mocks/data/athleteProfile/exportAthleteProfile';

describe('exportAthleteProfile', () => {
  let exportAthleteProfileRequest;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    exportAthleteProfileRequest = jest.spyOn(axios, 'post');

    const returnedData = await exportAthleteProfile(requestBody);

    expect(returnedData).toEqual({});
    expect(exportAthleteProfileRequest).toHaveBeenCalledTimes(1);
    expect(exportAthleteProfileRequest).toHaveBeenCalledWith(
      '/administration/athletes/export_profile',
      requestBody
    );
  });

  it('calls the new endpoint - error response', async () => {
    exportAthleteProfileRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await exportAthleteProfile(requestBody);
    }).rejects.toThrow();
  });
});
