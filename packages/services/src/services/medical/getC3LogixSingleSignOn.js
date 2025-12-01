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

export const C3_LOGIX_SSO_URL = '/emr/c3_logix/sso_url';

const getC3LogixSingleSignOn = async (): Promise<C3LogixSingleSignOn> => {
  const { data } = await axios.get(C3_LOGIX_SSO_URL);

  return data;
};

export default getC3LogixSingleSignOn;
