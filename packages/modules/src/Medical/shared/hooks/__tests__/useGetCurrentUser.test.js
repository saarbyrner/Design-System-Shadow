import $ from 'jquery';
import { renderHook } from '@testing-library/react-hooks';

import useGetCurrentUser from '../useGetCurrentUser';

describe('useGetCurrentUser', () => {
  const mockedUser = {
    firstname: 'firstname',
    id: 1,
    lastname: 'lastname',
    username: 'username',
  };

  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => $.Deferred().resolveWith(null, [mockedUser]));
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
  });

  it('returns the expected data when fetching the current user', async () => {
    const { result } = renderHook(() => useGetCurrentUser());

    result.current.fetchCurrentUser();
    await Promise.resolve();

    expect(result.current.currentUser).toEqual(mockedUser);
  });
});
