// @flow
export type Availability = 'unavailable' | 'available' | 'medical_attention';

export type Athlete = {
  id: string,
  full_name: string,
  availabilities: Array<Availability>,
};

export type InjuryStatus = {
  id: number,
  description: string,
  cause_unavailability: boolean,
  restore_availability: boolean,
  order: number,
  color: string,
  injury_status_system_id: number,
};

export type IssueEvent = {
  duration: number,
  event_date: string,
  id: number,
  injury_status_id: number,
};

export type AvailabilityIssue = {
  availabilities: Array<string>,
  duration: string,
  end: string,
  id: number,
  start: string,
  title: string,
  type: 'injury' | 'illness' | 'absence',
  events: Array<IssueEvent>,
};

export type ExpandedAthlete = {
  id: string,
  full_name: string,
  absences: Array<AvailabilityIssue>,
  illnesses: Array<AvailabilityIssue>,
  injuries: Array<AvailabilityIssue>,
};
