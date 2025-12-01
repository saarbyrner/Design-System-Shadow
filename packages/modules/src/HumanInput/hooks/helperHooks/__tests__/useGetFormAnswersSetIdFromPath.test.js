import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { useGetFormAnswersSetIdFromPath } from '../useGetFormAnswersSetIdFromPath';

jest.mock('@kitman/common/src/hooks/useLocationPathname');
const mockFormAnswersSetId = 2341;
const mockPath = `/forms/form_answers_set/${mockFormAnswersSetId}/edit`;

describe('useGetFormAnswersSetIdFromPath', () => {
  const store = storeFake({});
  let renderHookResult;

  it('should dispatch the right actions with data', async () => {
    useLocationPathname.mockReturnValue(mockPath);
    await act(async () => {
      renderHookResult = renderHook(() => useGetFormAnswersSetIdFromPath(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }).result;
    });
    expect(renderHookResult.current).toBe(mockFormAnswersSetId);
  });
});
