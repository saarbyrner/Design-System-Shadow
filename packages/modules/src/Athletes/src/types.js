// @flow

export type AthleteAvailability =
  | 'available'
  | 'returning'
  | 'injured'
  | 'unavailable';

export type Athlete = {
  id: number,
  availability: AthleteAvailability,
  avatar_url?: string,
  fullname: string,
  position: string,
};
