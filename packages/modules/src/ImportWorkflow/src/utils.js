// @flow

import type {
  Event,
  TrainingSession,
  Game,
  Integrations,
  SourceData,
  EventData,
} from './types';

export const transformTrainingSessionRequest = (
  trainingSession: TrainingSession
) => ({
  event_type: 'TrainingSession',
  id: trainingSession.id,
  session_type_id: trainingSession.sessionTypeId,
  workload_type: trainingSession.workloadType,
  duration: trainingSession.duration,
  session_date: trainingSession.date,
  timezone: trainingSession.localTimezone,
});

export const transformGameRequest = (game: Game) => ({
  event_type: 'Game',
  id: game.id,
  marker_id: game.markerId,
  score: game.score,
  opponent_score: game.opponentScore,
  fixture: {
    marker_date: game.fixture.date,
    venue_type_id: game.fixture.venueTypeId,
    organisation_team_id: game.fixture.organisationTeamId,
    team_id: game.fixture.teamId,
    competition_id: game.fixture.competitionId,
    round_number: game.fixture.roundNumber,
    turnaround_prefix: game.fixture.turnaroundPrefix,
    turnaround_fixture: game.fixture.createTurnaroundMarker,
  },
});

export const transformSourceFormDataIntegrationsResponse = (
  integrations: Array<Object>
): Integrations =>
  integrations.map((integration) => ({
    id: integration.id,
    thirdPartySourceId: integration.third_party_source_id,
    sourceIdentifier: integration.source_identifier,
    name: integration.name,
  }));

const transformIntegrationSourceDataRequest = (
  sourceData: SourceData,
  event: Event
) => {
  if (
    !sourceData.integrationData ||
    !sourceData.eventData ||
    !sourceData.eventData.event
  ) {
    return null;
  }

  return {
    type: sourceData.type,
    integration_data: {
      id: sourceData.integrationData.id,
      unique_identifier: sourceData.eventData.event.uniqueIdentifier,
      date: event.date,
      integration_date: sourceData.eventData.event.integrationDate,
    },
  };
};

const transformFileSourceDataRequest = (sourceData: SourceData) => {
  if (!sourceData.fileData) {
    return null;
  }

  return {
    type: sourceData.type,
    file_data: {
      file: sourceData.fileData.file,
      source: sourceData.fileData.source,
    },
  };
};

export const transformSourceDataRequest = (
  sourceData: SourceData,
  event: Event
) => {
  switch (sourceData.type) {
    case 'INTEGRATION':
      return transformIntegrationSourceDataRequest(sourceData, event);
    case 'FILE':
      return transformFileSourceDataRequest(sourceData);
    default:
      return null;
  }
};

export const transformEventDataResponse = (event: Object): EventData => {
  const eventData: EventData = {
    athletes: event.athletes.map((athlete) => ({
      id: athlete.id,
      firstname: athlete.firstname,
      lastname: athlete.lastname,
      fullname: athlete.fullname,
    })),
    nonSetupAthletesIdentifiers: event.non_setup_athletes_identifiers,
  };

  if (event.event) {
    eventData.event = {
      type: event.event.type,
      datetime: event.event.datetime,
      duration: event.event.duration,
      uniqueIdentifier: event.event.unique_identifier,
      integrationDate: event.event.integration_date,
    };
  }

  return eventData;
};
