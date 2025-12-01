// @flow
import type { Athlete } from '@kitman/common/src/types/Athlete';

export type AllergyData = {
  allergen: {
    type: string,
    id?: number,
    name?: string,
  },
  athlete_id: ?number,
  diagnosed_on?: string,
  ever_been_hospitalised: boolean,
  name?: string,
  require_epinephrine: boolean,
  severity: string,
  symptoms: string,
};

export type RequestResponse = {
  allergen: {
    allergen_type: string,
    id?: number,
    name?: string,
  },
  allergen_type: string,
  athlete: Athlete,
  athlete_id: number,
  diagnosed_on?: string,
  display_name: string,
  ever_been_hospitalised: boolean,
  id: number,
  name: string,
  require_epinephrine: boolean,
  severity: string,
  symptoms: string,
  created_at?: string,
  created_by?: {
    firstname: string,
    fullname: string,
    id: number,
    lastname: string,
  },
  versions: Object,
};
