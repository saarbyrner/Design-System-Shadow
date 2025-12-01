import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';

import {
  REDUCER_KEY,
  onTogglePanel,
} from '@kitman/modules/src/LeagueFixtures/src/redux/slices/AssignStaffSlice';

import useAssignStaffPanel from '../useAssignStaffPanel';

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

describe('useAssignStaffPanel', () => {
  describe('onOpenPanel', () => {
    it('should dispatch onOpenPanel correctly', () => {
      const mockDispatch = jest.fn();

      const store = defaultStore;
      store.dispatch = mockDispatch;

      const { result } = renderHook(() => useAssignStaffPanel(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });

      result.current.handleOnToggle({ id: 1 });

      expect(mockDispatch).toHaveBeenCalledWith(
        onTogglePanel({ isOpen: true, game: { id: 1 } })
      );

      result.current.handleOnToggle(null);

      expect(mockDispatch).toHaveBeenCalledWith(
        onTogglePanel({ isOpen: false })
      );
    });
  });
});
