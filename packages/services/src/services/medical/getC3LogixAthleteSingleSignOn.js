// @flow
import { axios } from '@kitman/common/src/utils/services';

export type C3LogixSingleSignOn = {
  url: string,
  token: string, // JWT base64 encoded
};

export type C3LogixDecodedPayload = {
  iss: string,
  aud: string,
  exp: number,
  iat: number,
  sub: string,
};

export const C3_LOGIX_ATHLETE_SSO_URL =
  '/medical/athletes/:athlete_id/c3_logix/sso_url';

const getC3LogixAthleteSingleSignOn = async (
  athleteId: number
): Promise<C3LogixSingleSignOn> => {
  const { data } = await axios.get(
    C3_LOGIX_ATHLETE_SSO_URL.replace(':athlete_id', String(athleteId))
  );

  return data;
};

export default getC3LogixAthleteSingleSignOn;
