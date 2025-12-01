// @flow

export type Athlete = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
};

export type Squad = {
  id: string,
  name: string,
  athletes: Athlete[],
};

export type Organization = {
  id: number,
  name: string,
  squads: Squad[],
};

export type Association = {
  id: number,
  name: string,
  organisations: Organization[],
};

export type AthletesInAssociationHierarchy = {
  association: Association,
};
