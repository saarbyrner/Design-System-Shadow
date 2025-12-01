import { REDUCER_KEY as movementHistorySlice } from '../../slices/movementHistorySlice';

import { usePostMovementRecordHistoryQuery } from '../../services';
import { response } from '../../services/mocks/data/mock_post_movement_record_history';

import { getDrawerState } from '../movementHistorySelectors';

jest.mock('@kitman/modules/src/UserMovement/shared/redux/services');

const MOCK_STATE = {
  [movementHistorySlice]: {
    drawer: {
      isOpen: false,
    },
  },
};

describe('[movementProfileSelectors] - selectors', () => {
  beforeEach(() => {
    usePostMovementRecordHistoryQuery.mockReturnValue({
      data: response,
      isError: false,
      isLoading: false,
      isSuccess: true,
      isUninitialized: false,
    });
  });
  test('getDrawerState()', () => {
    expect(getDrawerState(MOCK_STATE)).toBe(
      MOCK_STATE[movementHistorySlice].drawer
    );
  });
});
