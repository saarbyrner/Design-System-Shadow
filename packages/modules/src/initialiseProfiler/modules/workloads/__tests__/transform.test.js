import { transformTrainingSession } from '../transform';

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
      sessionTypeName: 'Warmup',
      localTimezone: 'America/New_York',
      workloadType: '11',
      workloadTypeName: 'Individual',
      gameDays: [],
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
