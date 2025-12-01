export const transformTrainingSession = (trainingSession) => {
  const gameDays = [];
  if (trainingSession.game_day_plus && trainingSession.game_day_plus !== '0') {
    gameDays.push(`+${trainingSession.game_day_plus}`);
  }

  if (
    trainingSession.game_day_minus &&
    trainingSession.game_day_minus !== '0'
  ) {
    gameDays.push(`-${trainingSession.game_day_minus}`);
  }

  if (
    trainingSession.game_day_minus === '0' ||
    trainingSession.game_day_plus === '0'
  ) {
    gameDays.push('0');
  }

  return {
    eventType: 'TRAINING_SESSION',
    id: trainingSession.id,
    date: trainingSession.date,
    sessionTypeId: trainingSession.session_type_id,
    sessionTypeName: trainingSession.session_type_name,
    workloadType: trainingSession.workload_type,
    workloadTypeName: trainingSession.workload_type_name,
    duration: trainingSession.duration,
    localTimezone: trainingSession.local_timezone,
    gameDays,
  };
};

export const transformFixture = (fixture) => ({
  date: fixture.date,
  venueTypeId: fixture.venue_type_id,
  venueTypeName: fixture.venue_type_name,
  organisationTeamId: fixture.organisation_team_id,
  organisationTeamName: fixture.organisation_team_name,
  teamId: fixture.team_id,
  teamName: fixture.team_name,
  competitionId: fixture.competition_id,
  competitionName: fixture.competition_name,
  roundNumber: fixture.round_number,
  turnaroundPrefix: fixture.turnaround_prefix,
});

export const transformGame = (game) => {
  const transformedGame = {
    eventType: 'GAME',
    id: game.id,
    date: game.date,
    markerId: game.marker_id,
    score: game.score,
    opponentScore: game.opponent_score,
    localTimezone: game.local_timezone,
    duration: game.duration,
  };

  if (game.fixture) {
    transformedGame.fixture = transformFixture(game.fixture);
  }

  return transformedGame;
};

export const transformEvent = (event) => {
  switch (event.event_type) {
    case 'TrainingSession':
      return transformTrainingSession(event);
    case 'Game':
      return transformGame(event);
    default:
      return null;
  }
};
