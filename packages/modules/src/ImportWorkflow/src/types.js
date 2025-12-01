// @flow

export type TrainingSession = {
  eventType: 'TRAINING_SESSION',
  id: number,
  date: string,
  sessionTypeId: string,
  sessionTypeName: ?string,
  workloadType: string,
  workloadTypeName: ?string,
  duration: string,
  localTimezone?: string,
};

export type Fixture = {
  date: string,
  venueTypeId: string,
  venueTypeName: string,
  organisationTeamId: string,
  organisationTeamName: string,
  teamId: string,
  teamName: string,
  competitionId: string,
  competitionName: string,
  roundNumber: string,
  turnaroundPrefix: string,
  createTurnaroundMarker: boolean,
};

export type Game = {
  eventType: 'GAME',
  id: number,
  date: string,
  score: string,
  markerId: string,
  opponentScore: string,
  fixture: Fixture,
  localTimezone?: string,
};

export type IntegrationData = {
  id: number,
  name: string,
  thirdPartySourceId: number,
};

export type FileData = {
  source: string,
  file: ?Object,
};

export type ThirdPartyEvent = {
  type: string,
  datetime: string,
  duration: number,
  uniqueIdentifier: string,
  integrationDate: string,
};

export type EventData = {
  event?: ThirdPartyEvent,
  athletes: Array<{
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  }>,
  nonSetupAthletesIdentifiers: Array<string>,
};

export type SourceData = {
  type: 'FILE' | 'INTEGRATION',
  fileData?: FileData,
  integrationData?: IntegrationData,
  eventData?: ?EventData,
  isEventSelectionNeeded?: boolean,
};

export type EventList = {
  loaded: boolean,
  integrationId: ?number,
  date: string,
  data: Array<EventData>,
};

export type Integration = {
  id: number,
  thirdPartySourceId: number,
  sourceIdentifier: string,
  name: string,
};

export type Integrations = Array<Integration>;

export type SourceFormData = {
  loaded: boolean,
  integrations: Integrations,
  fileSources: { [string]: string },
};

export type Event = TrainingSession | Game;
