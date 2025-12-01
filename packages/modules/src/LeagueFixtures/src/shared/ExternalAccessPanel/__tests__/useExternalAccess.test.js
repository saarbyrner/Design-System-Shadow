import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';

import {
  REDUCER_KEY,
  onTogglePanel,
} from '@kitman/modules/src/LeagueFixtures/src/redux/slices/ExternalAccessSlice';

import useExternalAccess from '../hooks/useExternalAccess';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockStore = {
  [REDUCER_KEY]: {},
};

const defaultStore = storeFake(mockStore);

describe('useExternalAccess', () => {
  describe('onOpenPanel', () => {
    it('should dispatch onOpenPanel correctly', () => {
      const mockDispatch = jest.fn();

      const store = defaultStore;
      store.dispatch = mockDispatch;

      const { result } = renderHook(() => useExternalAccess(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });

      result.current.handleOnToggle(true);

      expect(mockDispatch).toHaveBeenCalledWith(
        onTogglePanel({ isOpen: true })
      );
    });
  });
});
