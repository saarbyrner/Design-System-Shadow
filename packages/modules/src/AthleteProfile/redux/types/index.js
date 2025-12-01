// @flow

export type GenericGuardian = {
  id: number,
  name: string,
  email: string,
  created_at: string | null,
};

export type CreateGuardianRequestBody = {
  athleteId: number,
  first_name: string,
  surname: string,
  email: string,
};

export type UpdateGuardianRequestBody = {
  id: number,
  athleteId: number,
  first_name: string,
  surname: string,
  email: string,
};

export type DeleteGuardianRequestBody = {
  id: number,
};
