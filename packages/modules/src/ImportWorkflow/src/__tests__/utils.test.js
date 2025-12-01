import { transformTrainingSessionRequest } from '../utils';

describe('transformTrainingSessionRequest', () => {
  it('creates the training session structure expected by the backend', () => {
    const trainingSession = {
      id: 12,
      eventType: 'TRAINING_SESSION',
      sessionTypeId: '5',
      workloadType: '11',
      duration: '3',
      date: '2018-02-26T01:00:00-05:00',
      localTimezone: 'America/New_York',
      sessionTypeName: 'Warmup',
      workloadTypeName: 'Individual',
    };

    const transformedTrainingSession =
      transformTrainingSessionRequest(trainingSession);

    expect(transformedTrainingSession).toEqual({
      id: 12,
      duration: '3',
      event_type: 'TrainingSession',
      session_date: '2018-02-26T01:00:00-05:00',
      session_type_id: '5',
      timezone: 'America/New_York',
      workload_type: '11',
    });
  });
});
