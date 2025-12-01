// @flow

import type { DropdownItem } from '@kitman/components/src/types';
import type { Game as GameEvent } from '@kitman/common/src/types/Event';
import type { Game } from './types';

export const transformGameRequest = (game: Game) => ({
  type: 'game_event',
  start_time: game.fixture.date,
  duration: game.duration,
  local_timezone: game.localTimezone,
  venue_type_id: game.fixture.venueTypeId,
  competition_id: game.fixture.competitionId,
  organisation_team_id: game.fixture.organisationTeamId,
  team_id: game.fixture.teamId,
  score: game.score,
  opponent_score: game.opponentScore,
  surface_type: game.surfaceType,
  surface_quality: game.surfaceQuality,
  weather: game.weather,
  temperature: game.temperature,
  round_number: game.fixture.roundNumber,
  turnaround_prefix: game.fixture.turnaroundPrefix,
  turnaround_fixture: game.fixture.createTurnaroundMarker,
});

export const fromArrayToDropdownItems = (
  array: Array<Object>
): Array<DropdownItem> => {
  const items = array.map((item) => ({
    id: item[1].toString(),
    title: item[0],
  }));
  return items;
};

type GameData = {
  id: number,
  date: string,
  score: string,
  opponent_score: string,
  local_timezone: string,
  duration: string,
  is_active: boolean,
  fixture: {
    id: string,
    marker_date: string,
    round_number: string,
    turnaround_prefix: string,
    venue_type: { id: string, name: string },
    organisation_team: { id: string, name: string },
    team: { id: string, name: string },
    competition: { id: string, name: string },
  },
  surface_type: ?string,
  surface_quality: ?string,
  weather: ?string,
  temperature: ?string,
};

export const transformFixture = (
  fixture: $PropertyType<GameData, 'fixture'>
) => ({
  id: fixture.id || null,
  date: fixture.marker_date,
  venueTypeId: fixture.venue_type.id,
  venueTypeName: fixture.venue_type.name,
  organisationTeamId: fixture.organisation_team.id,
  organisationTeamName: fixture.organisation_team.name,
  teamId: fixture.team.id,
  teamName: fixture.team.name,
  competitionId: fixture.competition.id,
  competitionName: fixture.competition.name,
  roundNumber: fixture.round_number,
  turnaroundPrefix: fixture.turnaround_prefix,
  createTurnaroundMarker: true,
});

export const transformGameEvent = (event: GameEvent) => {
  const transformedGame = {
    eventType: 'GAME',
    id: event.id,
    date: event.start_date,
    score: event.score,
    opponentScore: event.opponent_score,
    localTimezone: event.local_timezone,
    duration: event.duration,
    fixture: {
      id: null,
      date: event.start_date,
      venueTypeId: event.venue_type.id,
      organisationTeamId: event.organisation_team.id,
      teamId: event.opponent_squad?.id || event.opponent_team?.id,
      competitionId: event.competition.id,
      roundNumber: event.round_number,
    },
    surfaceType: event.surface_type?.id || null,
    surfaceQuality: event.surface_quality?.id || null,
    weather: event.weather?.id || null,
    temperature: event.temperature,
  };

  return transformedGame;
};

export const transformGame = (game: GameData): Game => {
  const transformedGame = {
    eventType: 'GAME',
    id: game.id,
    date: game.date,
    markerId: game.fixture.id,
    score: game.is_active ? game.score : null,
    opponentScore: game.is_active ? game.opponent_score : null,
    localTimezone: game.local_timezone,
    duration: game.duration,
    isActive: game.is_active,
    fixture: transformFixture(game.fixture),
    surfaceType: game.surface_type,
    surfaceQuality: game.surface_quality,
    weather: game.weather,
    temperature: game.temperature,
  };

  return transformedGame;
};
