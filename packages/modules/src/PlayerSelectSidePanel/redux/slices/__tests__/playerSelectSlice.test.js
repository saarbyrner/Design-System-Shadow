import playerSelectSlice, {
  onOpenPlayerSelect,
  onClosePlayerSelect,
} from '../playerSelectSlice';

describe('playerSelectSlice', () => {
  const initialState = {
    filters: [],
    grouping: [],
    isPlayerSelectOpen: false,
  };

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(playerSelectSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on onOpenPlayerSelect', () => {
    const action = onOpenPlayerSelect();
    const expectedState = {
      ...initialState,
      isPlayerSelectOpen: true,
    };

    expect(playerSelectSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on onOpen', () => {
    const action = onClosePlayerSelect();

    expect(playerSelectSlice.reducer(initialState, action)).toEqual(
      initialState
    );
  });
});
