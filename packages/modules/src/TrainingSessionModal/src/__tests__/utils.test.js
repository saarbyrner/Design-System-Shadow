import {
  transformTrainingSessionRequest,
  transformTrainingSession,
} from '../utils';

describe('transformTrainingSessionRequest', () => {
  const trainingSession = {
    id: 12,
    eventType: 'TRAINING_SESSION',
    sessionTypeId: '5',
    workloadType: '11',
    duration: '3',
    date: '2018-02-26T01:00:00-05:00',
    localTimezone: 'America/New_York',
    gameDays: [],
    surfaceQuality: '1',
    surfaceType: '2',
    temperature: '3',
    weather: '12',
  };

  it('creates the training session structure expected by the backend', () => {
    const transformedTrainingSession =
      transformTrainingSessionRequest(trainingSession);

    expect(transformedTrainingSession).toEqual({
      duration: '3',
      start_time: '2018-02-26T01:00:00-05:00',
      type: 'session_event',
      session_type_id: '5',
      local_timezone: 'America/New_York',
      workload_type: '11',
      game_day_minus: null,
      game_day_plus: null,
      surface_quality: '1',
      surface_type: '2',
      temperature: '3',
      weather: '12',
    });
  });

  describe('when the useNewEventStructure is true', () => {
    it('creates the training session structure expected by the backend', () => {
      const useNewEventStructure = true;
      const transformedTrainingSession = transformTrainingSessionRequest(
        trainingSession,
        useNewEventStructure
      );

      expect(transformedTrainingSession).toEqual({
        type: 'session_event',
        start_time: '2018-02-26T01:00:00-05:00',
        duration: '3',
        local_timezone: 'America/New_York',
        game_day_minus: null,
        game_day_plus: null,
        workload_type: '11',
        session_type_id: '5',
        surface_quality: '1',
        surface_type: '2',
        temperature: '3',
        weather: '12',
      });
    });
  });

  it('creates correct game days structure when gameDays contain only 0', () => {
    const transformedTrainingSession = transformTrainingSessionRequest({
      ...trainingSession,
      gameDays: ['0'],
    });

    expect(transformedTrainingSession.game_day_minus).toBe('0');
    expect(transformedTrainingSession.game_day_plus).toBe('0');
  });

  it('creates correct game days structure when gameDays contains 1 negative and 1 positive value', () => {
    const transformedTrainingSession = transformTrainingSessionRequest({
      ...trainingSession,
      gameDays: ['-3', '+4'],
    });

    expect(transformedTrainingSession.game_day_minus).toBe('3');
    expect(transformedTrainingSession.game_day_plus).toBe('4');
  });

  it('creates correct game days structure when gameDays contains 1 negative value and 0', () => {
    const transformedTrainingSession = transformTrainingSessionRequest({
      ...trainingSession,
      gameDays: ['-3', '0'],
    });

    expect(transformedTrainingSession.game_day_minus).toBe('3');
    expect(transformedTrainingSession.game_day_plus).toBe('0');
  });

  it('creates correct game days structure when gameDays contains 1 positive value and 0', () => {
    const transformedTrainingSession = transformTrainingSessionRequest({
      ...trainingSession,
      gameDays: ['0', '+4'],
    });

    expect(transformedTrainingSession.game_day_minus).toBe('0');
    expect(transformedTrainingSession.game_day_plus).toBe('4');
  });

  it('creates correct game days structure when gameDays is empty', () => {
    const transformedTrainingSession = transformTrainingSessionRequest({
      ...trainingSession,
      gameDays: [],
    });

    expect(transformedTrainingSession.game_day_minus).toBeNull();
    expect(transformedTrainingSession.game_day_plus).toBeNull();
  });
});

describe('transformTrainingSession', () => {
  const trainingSession = {
    id: 12,
    session_type_id: '5',
    workload_type: '11',
    duration: '3',
    date: '2018-02-26T01:00:00-05:00',
    local_timezone: 'America/New_York',
    session_type_name: 'Warmup',
    workload_type_name: 'Individual',
    gameDays: [],
    surface_quality: '1',
    surface_type: '2',
    temperature: '3',
    weather: '12',
  };

  it('creates the training session structure expected by the frontend', () => {
    const transformedTrainingSession =
      transformTrainingSession(trainingSession);

    expect(transformedTrainingSession).toEqual({
      id: 12,
      duration: '3',
      eventType: 'TRAINING_SESSION',
      date: '2018-02-26T01:00:00-05:00',
      sessionTypeId: '5',
      localTimezone: 'America/New_York',
      workloadType: '11',
      gameDays: [],
      surfaceQuality: '1',
      surfaceType: '2',
      temperature: '3',
      weather: '12',
    });
  });

  it('creates correct game days structure when game_day_minus and game_day_plus are 0', () => {
    const transformedTrainingSession = transformTrainingSession({
      ...trainingSession,
      game_day_minus: '0',
      game_day_plus: '0',
    });

    expect(transformedTrainingSession.gameDays).toEqual(['0']);
  });

  it('creates correct game days structure when game_day_minus and game_day_plus are different than 0', () => {
    const transformedTrainingSession = transformTrainingSession({
      ...trainingSession,
      game_day_minus: '7',
      game_day_plus: '3',
    });

    expect(transformedTrainingSession.gameDays).toEqual(['+3', '-7']);
  });

  it('creates correct game days structure when game_day_minus is 0', () => {
    const transformedTrainingSession = transformTrainingSession({
      ...trainingSession,
      game_day_minus: '0',
      game_day_plus: '3',
    });

    expect(transformedTrainingSession.gameDays).toEqual(['+3', '0']);
  });

  it('creates correct game days structure when game_day_plus is 0', () => {
    const transformedTrainingSession = transformTrainingSession({
      ...trainingSession,
      game_day_minus: '4',
      game_day_plus: '0',
    });

    expect(transformedTrainingSession.gameDays).toEqual(['-4', '0']);
  });

  it('creates correct game days structure when game_day_plus and game_day_minus are null', () => {
    const transformedTrainingSession = transformTrainingSession({
      ...trainingSession,
      game_day_minus: null,
      game_day_plus: null,
    });

    expect(transformedTrainingSession.gameDays).toEqual([]);
  });
});
