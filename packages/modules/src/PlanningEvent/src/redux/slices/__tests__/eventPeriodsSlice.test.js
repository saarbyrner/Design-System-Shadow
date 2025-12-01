import eventPeriodsSlice, {
  setUnsavedEventPeriods,
  setSavedEventPeriods,
} from '../eventPeriodsSlice';

const initialState = {
  localEventPeriods: [],
  apiEventPeriods: [],
};

describe('[eventPeriodsSlice]', () => {
  const eventPeriods = [
    {
      name: 'Period 1',
      absolute_duration_start: 1,
      absolute_duration_end: 20,
      duration: 20,
    },
    {
      name: 'Period 2',
      absolute_duration_start: 20,
      absolute_duration_end: 40,
      duration: 20,
    },
  ];
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(eventPeriodsSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update the unsaved local periods', () => {
    const unsavedAction = setUnsavedEventPeriods(eventPeriods);
    const updatedUnsavedEventPeriods = eventPeriodsSlice.reducer(
      initialState,
      unsavedAction
    );

    expect(updatedUnsavedEventPeriods).toEqual({
      ...initialState,
      localEventPeriods: eventPeriods,
    });
  });

  it('should correctly update the saved periods', () => {
    const savedAction = setSavedEventPeriods(eventPeriods);
    const updatedSavedPeriods = eventPeriodsSlice.reducer(
      initialState,
      savedAction
    );

    expect(updatedSavedPeriods).toEqual({
      apiEventPeriods: eventPeriods,
      localEventPeriods: eventPeriods,
    });
  });
});
