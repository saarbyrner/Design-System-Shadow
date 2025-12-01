import { data as athleteEventsData } from '@kitman/services/src/mocks/handlers/planning/getAthleteEvents';
import athleteEventsSlice, {
  setApiAthleteEvents,
  updateAthleteEvent,
} from '../athleteEventsSlice';

const initialState = { apiAthleteEvents: [] };

describe('[athleteEventsSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };

    expect(athleteEventsSlice.reducer(initialState, action)).toEqual(
      initialState
    );
  });

  it('should correctly set the retrieved athlete events', () => {
    const unsavedAction = setApiAthleteEvents(athleteEventsData.athlete_events);
    const retrievedAthleteEvents = athleteEventsSlice.reducer(
      initialState,
      unsavedAction
    );

    expect(retrievedAthleteEvents).toEqual({
      ...initialState,
      apiAthleteEvents: athleteEventsData.athlete_events,
    });
  });

  it('should correctly update the athlete event', () => {
    const modifiedAthleteEvent = {
      ...athleteEventsData.athlete_events[0],
      duration: 100,
    };
    const restOfEvents = athleteEventsData.athlete_events.filter(
      (athleteEvent) => athleteEvent.id !== modifiedAthleteEvent.id
    );

    const apiInitialState = {
      apiAthleteEvents: athleteEventsData.athlete_events,
    };
    const savedAction = updateAthleteEvent(modifiedAthleteEvent);
    const updatedAthleteEvent = athleteEventsSlice.reducer(
      apiInitialState,
      savedAction
    );

    expect(updatedAthleteEvent).toEqual({
      apiAthleteEvents: [modifiedAthleteEvent, ...restOfEvents],
    });
  });
});
