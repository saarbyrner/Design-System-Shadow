// @flow
import { axios } from '@kitman/common/src/utils/services';

export const createResetPasswordRoute = (athleteId: number) =>
  `/settings/athletes/${athleteId}/user_details/reset_password`;

export type ResetAthletePasswordRequestBody = {
  athleteId: number,
  email: string,
};

const resetAthletePassword = async ({
  athleteId,
  email,
}: ResetAthletePasswordRequestBody): Promise<void> => {
  const route = createResetPasswordRoute(athleteId);
  await axios.post(
    route,
    { email },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
};

export default resetAthletePassword;
