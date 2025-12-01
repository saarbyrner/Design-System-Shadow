import matchDayEmailSlice, {
  onTogglePanel,
  initialState,
} from '../matchDayEmailSlice';

describe('[matchDayEmailSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(matchDayEmailSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly onTogglePanel', () => {
    const action = onTogglePanel({ isOpen: true, mode: 'DMN' });
    const updatedState = matchDayEmailSlice.reducer(initialState, action);
    expect(updatedState.panel).toEqual({
      isOpen: true,
      mode: 'DMN',
    });
  });
});
