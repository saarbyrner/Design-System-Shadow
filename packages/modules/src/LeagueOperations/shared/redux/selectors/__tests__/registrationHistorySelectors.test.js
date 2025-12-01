import { REDUCER_KEY as registrationHistorySlice } from '../../slices/registrationHistorySlice';

import { getIsPanelOpen } from '../registrationHistorySelectors';

const MOCK_STATE = {
  [registrationHistorySlice]: {
    panel: {
      isOpen: false,
    },
  },
};

describe('[registrationHistorySelectors] - selectors', () => {
  test('getIsPanelOpen()', () => {
    expect(getIsPanelOpen(MOCK_STATE)).toStrictEqual(false);
  });
});
