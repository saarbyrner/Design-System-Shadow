import genericExportsSlice, {
  onReset,
  onBuildExportableFieldsState,
} from '@kitman/services/src/services/exports/generic/redux/slices/genericExportsSlice';
import { data } from '@kitman/services/src/services/exports/generic/redux/services/mocks/data/fetchExportableElements';

describe('genericExportsSlice', () => {
  const initialState = {
    exportableFields: [],
  };

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(genericExportsSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on onReset', () => {
    const action = onReset();

    expect(genericExportsSlice.reducer(initialState, action)).toEqual(
      initialState
    );
  });

  it('should correctly update state on onBuildExportableFieldsState', () => {
    const action = onBuildExportableFieldsState(data);

    expect(genericExportsSlice.reducer(initialState, action)).toEqual({
      exportableFields: data,
    });
  });
});
