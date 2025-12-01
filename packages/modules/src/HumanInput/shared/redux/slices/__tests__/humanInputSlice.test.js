import humanInputSlice from '../humanInputSlice';

describe('humanInputSlice', () => {
  const initialState = {
    exportSidePanel: {
      isOpen: false,
      form: {
        fields: [],
        filename: '',
        ids: [],
      },
    },
  };

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(humanInputSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });
});
