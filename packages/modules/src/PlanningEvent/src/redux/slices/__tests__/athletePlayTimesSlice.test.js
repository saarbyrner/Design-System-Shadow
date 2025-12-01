import { athletePlayTimesData } from '@kitman/services/src/mocks/handlers/planningEvent/data.mock';
import athletePlayTimesSlice, {
  setUnsavedAthletePlayTimes,
  setSavedAthletePlayTimes,
} from '../athletePlayTimesSlice';

const initialState = {
  localAthletePlayTimes: [],
  apiAthletePlayTimes: [],
};

describe('[athletePlayTimesSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };

    expect(athletePlayTimesSlice.reducer(initialState, action)).toEqual(
      initialState
    );
  });

  it('should correctly update the unsaved athlete play times', () => {
    const unsavedAction = setUnsavedAthletePlayTimes(athletePlayTimesData);
    const updatedUnsavedAthletePlayTimes = athletePlayTimesSlice.reducer(
      initialState,
      unsavedAction
    );

    expect(updatedUnsavedAthletePlayTimes).toEqual({
      ...initialState,
      localAthletePlayTimes: athletePlayTimesData,
    });
  });

  it('should correctly update the saved athlete play times', () => {
    const savedAction = setSavedAthletePlayTimes(athletePlayTimesData);
    const updatedSavedAthletePlayTimes = athletePlayTimesSlice.reducer(
      initialState,
      savedAction
    );

    expect(updatedSavedAthletePlayTimes).toEqual({
      apiAthletePlayTimes: athletePlayTimesData,
      localAthletePlayTimes: athletePlayTimesData,
    });
  });
});
