import registrationHistorySlice, {
  onTogglePanel,
} from '../registrationHistorySlice';

const initialState = {
  panel: {
    isOpen: false,
  },
};

describe('[registrationHistorySlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(registrationHistorySlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should onTogglePanel', () => {
    const action = onTogglePanel({ isOpen: true });

    const updatedState = registrationHistorySlice.reducer(initialState, action);
    expect(updatedState.panel).toStrictEqual({ isOpen: true });
  });
});
