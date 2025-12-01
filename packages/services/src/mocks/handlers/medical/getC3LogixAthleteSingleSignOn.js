import { rest } from 'msw';
import { C3_LOGIX_ATHLETE_SSO_URL } from '@kitman/services/src/services/medical/getC3LogixAthleteSingleSignOn';

export const C3LOGIX_LOGIN_URL = 'https://portal.c3logix.com/kitman_sso';

const data = {
  url: C3LOGIX_LOGIN_URL,
  // Mock token
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhYmMiLCJhdWQiOjEyMywiZXhwIjoxNzUxMjgwMjg5LCJpYXQiOjE1MTYyMzkwMjIsInN1YiI6IjQ1NiJ9.fm0QcuX4c8omR8FnJWuQChu2wck8d5ggWozIBDAPW7w',
};

const handler = rest.get(C3_LOGIX_ATHLETE_SSO_URL, (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
