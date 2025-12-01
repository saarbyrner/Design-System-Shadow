import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { getMatchDayEmailMode } from '@kitman/modules/src/PlanningEvent/src/redux/selectors/matchDayEmailSelectors';
import {
  REDUCER_KEY as MATCH_DAY_EMAIL_SLICE,
  initialState,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/matchDayEmailSlice';

import useMatchDayEmail from '../useMatchDayEmail';

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/selectors/matchDayEmailSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlanningEvent/src/redux/selectors/matchDayEmailSelectors'
    ),
    getMatchDayEmailMode: jest.fn(),
    getIsPanelOpen: jest.fn(),
  })
);

const mockSelectors = ({ mode = 'DMN' }) => {
  getMatchDayEmailMode.mockReturnValue(mode);
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  [MATCH_DAY_EMAIL_SLICE]: initialState,
};

describe('useMatchDayEmail', () => {
  describe('initial state', () => {
    beforeEach(() => {
      mockSelectors({
        mode: 'DMN',
      });
    });
    it('should return initial state correctly', () => {
      const { result } = renderHook(() => useMatchDayEmail(), {
        wrapper: ({ children }) => (
          <Provider store={storeFake(defaultStore)}>{children}</Provider>
        ),
      });
      expect(result.current.mode).toBe('DMN');
    });
  });
});
