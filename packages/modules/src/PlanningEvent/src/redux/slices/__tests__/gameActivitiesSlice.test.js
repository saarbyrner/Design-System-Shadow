import gameActivitiesSlice, {
  setUnsavedGameActivities,
  setSavedGameActivities,
  setLocalAndApiGameActivities,
} from '../gameActivitiesSlice';

const initialState = {
  localGameActivities: [],
  apiGameActivities: [],
};

describe('[gameActivitiesSlice]', () => {
  const gameActivities = [
    { kind: 'formation_change', absolute_minute: 1, relation: { id: 1 } },
    { kind: 'goal', absolute_minute: 5, athlete_id: 1111 },
  ];
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(gameActivitiesSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update the unsaved local activities', () => {
    const unsavedAction = setUnsavedGameActivities(gameActivities);
    const updatedUnsavedGameActivities = gameActivitiesSlice.reducer(
      initialState,
      unsavedAction
    );

    expect(updatedUnsavedGameActivities).toEqual({
      ...initialState,
      localGameActivities: gameActivities,
    });
  });

  it('should correctly update the saved activities', () => {
    const savedAction = setSavedGameActivities(gameActivities);
    const updatedSavedActivities = gameActivitiesSlice.reducer(
      initialState,
      savedAction
    );

    expect(updatedSavedActivities).toEqual({
      apiGameActivities: gameActivities,
      localGameActivities: gameActivities,
    });
  });

  it('should correctly update the local and api activities activities', () => {
    const savedAction = setLocalAndApiGameActivities({
      apiGameActivities: gameActivities[0],
      localGameActivities: gameActivities,
    });
    const updatedSavedActivities = gameActivitiesSlice.reducer(
      initialState,
      savedAction
    );

    expect(updatedSavedActivities).toEqual({
      apiGameActivities: gameActivities[0],
      localGameActivities: gameActivities,
    });
  });
});
