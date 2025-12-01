import athleteProfileSlice, {
  onReset,
  onBuildThirdPartySettingsState,
  onUpdateSettingField,
  initialState,
} from '../athleteProfileSlice';

describe('[athleteProfileSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(athleteProfileSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset', () => {
    const action = onReset();
    const updatedState = athleteProfileSlice.reducer(initialState, action);
    expect(updatedState).toEqual(initialState);
  });

  it('should build third party settings map on onBuildThirdPartySettingsState', () => {
    const action = onBuildThirdPartySettingsState([
      { key: 'input_1', value: 'some value', name: 'input test' },
    ]);
    const updatedState = athleteProfileSlice.reducer(initialState, action);
    expect(updatedState).toEqual({
      ...initialState,
      thirdPartySettings: {
        input_1: 'some value',
      },
    });
  });

  it('should update third party setting field on onUpdateSettingField', () => {
    const action = onUpdateSettingField({ input_1: 'value' });
    const updatedState = athleteProfileSlice.reducer(initialState, action);
    expect(updatedState).toEqual({
      ...initialState,
      thirdPartySettings: {
        input_1: 'value',
      },
    });
  });
});
