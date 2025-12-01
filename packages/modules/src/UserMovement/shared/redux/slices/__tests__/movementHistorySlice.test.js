import movementHistorySlice, {
  onReset,
  onToggleDrawer,
} from '../movementHistorySlice';

const initialState = {
  drawer: {
    isOpen: false,
  },
};

describe('[createMovementSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(movementHistorySlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset', () => {
    const action = onReset();
    const updatedState = movementHistorySlice.reducer(initialState, action);
    expect(updatedState).toEqual(initialState);
  });

  it('should onToggleDrawer', () => {
    const action = onToggleDrawer();
    const updatedState = movementHistorySlice.reducer(initialState, action);
    expect(updatedState.drawer).toEqual({
      isOpen: true,
    });
  });
});
