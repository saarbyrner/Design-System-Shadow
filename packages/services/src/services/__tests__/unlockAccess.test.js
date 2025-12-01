import { axios } from '@kitman/common/src/utils/services';
import unlockAccess from '@kitman/services/src/services/unlockAccess';

describe('unlockAccess', () => {
  it('makes the call to the correct endpoint', async () => {
    const url = '/accounts/unlock';
    axios.patch = jest.fn().mockResolvedValueOnce({ status: 204 });
    await unlockAccess('user');
    expect(axios.patch).toHaveBeenCalledWith(
      url,
      {
        user: {
          username: 'user',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
  });
});
