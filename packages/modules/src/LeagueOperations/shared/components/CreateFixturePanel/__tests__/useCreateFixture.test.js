import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';

import {
  REDUCER_KEY as CREATE_FIXTURE_REDUCER_KEY,
  onTogglePanel,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/createFixtureSlice';

import useCreateFixture from '../hooks/useCreateFixture';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockStore = {
  [CREATE_FIXTURE_REDUCER_KEY]: {},
};

const defaultStore = storeFake(mockStore);

describe('useCreateFixture', () => {
  describe('onOpenPanel', () => {
    it('should dispatch onOpenPanel correctly', () => {
      const mockDispatch = jest.fn();

      const store = defaultStore;
      store.dispatch = mockDispatch;

      const { result } = renderHook(() => useCreateFixture(), {
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
