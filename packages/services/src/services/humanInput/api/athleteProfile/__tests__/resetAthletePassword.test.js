import { axios } from '@kitman/common/src/utils/services';
import { requestBody } from '@kitman/services/src/services/humanInput/api/mocks/data/athleteProfile/resetAthletePassword';
import resetAthletePassword, {
  createResetPasswordRoute,
} from '../resetAthletePassword';

describe('resetAthletePassword', () => {
  let resetAthletePasswordRequest;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    resetAthletePasswordRequest = jest.spyOn(axios, 'post');

    const { email, athleteId } = requestBody;

    const returnedData = await resetAthletePassword(requestBody);

    expect(returnedData).toEqual(undefined);
    expect(resetAthletePasswordRequest).toHaveBeenCalledTimes(1);
    expect(resetAthletePasswordRequest).toHaveBeenCalledWith(
      createResetPasswordRoute(athleteId),
      { email },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
  });
});
