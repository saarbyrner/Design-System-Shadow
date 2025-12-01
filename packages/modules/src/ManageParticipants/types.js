// @flow

export type Event = {
  id: string,
  type: 'TRAINING_SESSION' | 'GAME',
  name: string,
  rpe_collection_kiosk: boolean,
  rpe_collection_athlete: boolean,
  mass_input: boolean,
};

export type Squad = {
  id: number,
  name: string,
};

export type Participant = {
  athlete_id: number,
  athlete_fullname: string,
  duration: string,
  rpe: string,
  squads: Array<number>,
  availability: 'unavailable' | 'injured' | 'returning' | 'available',
  participation_level_id: number,
  include_in_group_calculations: boolean,
  primary_squad_id?: ?number,
};

export type ParticipationLevel = {
  id: number,
  name: string,
  canonical_participation_level: 'full' | 'partial' | 'modified' | 'none',
  include_in_group_calculations: boolean,
};

export type AthletesFilter = {
  squadId: number,
  filteredAthletes: Array<number>,
};
