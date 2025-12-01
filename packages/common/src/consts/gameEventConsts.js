// @flow

export const sportFormats = {
  soccer: 'soccer',
};

export const pitchViewFormats = {
  gameEvents: 'game_events',
  matchReport: 'match_report',
};

export const timeCellFormat = {
  summary: 'summary',
  period: 'period',
};

export const eventTypes = {
  sub: 'substitution',
  goal: 'goal',
  own_goal: 'own_goal',
  switch: 'position_swap',
  yellow: 'yellow_card',
  red: 'red_card',
  assist: 'assist',
  formation_change: 'formation_change',
  formation_complete: 'formation_complete',
  position_change: 'position_change',
  total_time: 'total_time',
  formation_position_view_change: 'formation_position_view_change',
  penalty_shootout: 'penalty_shootout',
  no_goal: 'no_goal',
  captain_assigned: 'captain_assigned',
};

export const viewableEventTypes = [
  eventTypes.sub,
  eventTypes.goal,
  eventTypes.switch,
  eventTypes.yellow,
  eventTypes.red,
];

export const listViewViewableEventTypes = [
  eventTypes.sub,
  eventTypes.goal,
  eventTypes.assist,
  eventTypes.switch,
  eventTypes.yellow,
  eventTypes.red,
];

export const teamTypes = {
  home: 'home',
  away: 'away',
};

export const venueTypes = {
  home: 'Home',
  away: 'Away',
};

export const SCORED_TYPE = 'SCORED';
export const MISSED_TYPE = 'MISSED';

export const gameViews = {
  list: 'LIST',
  pitch: 'PITCH',
};

export const matchReportEventListGameView = {
  regular: 'REGULAR',
  penalty: 'PENALTY',
};
