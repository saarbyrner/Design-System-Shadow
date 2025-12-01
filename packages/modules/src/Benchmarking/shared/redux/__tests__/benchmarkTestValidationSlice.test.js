import benchmarkTestValidationSlice, {
  onSelection,
  resetSelections,
} from '../benchmarkTestValidationSlice';

describe('benchmarkTestValidationSlice', () => {
  const initialState = {
    selections: {
      club: { label: '', value: '' },
      season: { label: '', value: '' },
      window: { label: '', value: '' },
    },
    title: '',
  };

  it('should have correct initial state', () => {
    const action = { type: 'unknown' };

    expect(benchmarkTestValidationSlice.reducer(initialState, action)).toEqual(
      initialState
    );
  });

  describe('actions', () => {
    it('should correctly update values when onSelection is called', () => {
      const action = onSelection({
        type: 'club',
        value: 'Liverpool',
      });
      const updatedState = benchmarkTestValidationSlice.reducer(
        initialState,
        action
      );

      expect(updatedState.selections.club).toEqual({
        label: 'Liverpool',
        value: 'Liverpool',
      });
    });

    it('should correctly update values when resetSelections is called', () => {
      const action = resetSelections();
      const updatedState = benchmarkTestValidationSlice.reducer(
        initialState,
        action
      );

      expect(updatedState.selections).toEqual(initialState.selections);
    });
  });
});
