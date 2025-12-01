import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { useGetAthleteIdFromPath } from '../useGetAthleteIdFromPath';

jest.mock('@kitman/common/src/hooks/useLocationPathname');
const mockAthleteId = 40211;
const mockPath = `/athletes/${mockAthleteId}/profile`;

describe('useGetAthleteIdFromPath', () => {
  const store = storeFake({});
  let renderHookResult;

  it('should dispatch the right actions with data', async () => {
    useLocationPathname.mockReturnValue(mockPath);
    await act(async () => {
      renderHookResult = renderHook(() => useGetAthleteIdFromPath(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }).result;
    });
    expect(renderHookResult.current).toBe(mockAthleteId);
  });
});
