// @flow

export const ExportTypeValues = {
  ATHLETE_PROFILE: 'athlete_profile',
};

export type ExportType = $Values<typeof ExportTypeValues>;

export type Field = {
  label: string,
  field?: string,
  type: string,
  key?: string,
  object?: string,
  children?: Array<Field>,
  subtype?: string,
  address?: string,
};

export type ExportableElements = Array<Field>;
