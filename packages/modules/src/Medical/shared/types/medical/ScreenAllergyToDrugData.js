// @flow
import type { DrugType } from './Medications';

export type ScreenAllergyToDrugData = {
  athlete_id: number,
  drug_type: 'FdbDispensableDrug' | DrugType,
  drug_id?: number,
  external_drug_id?: number,
};

export type Drug = {
  DrugDose: ?string,
  Prospective: boolean,
  DrugDesc: string,
  DrugID: string,
  DrugConceptType: number,
};

export type Allergen = {
  AllergenID: string,
  AllergenConceptType: number,
  AllergenDesc: string,
  Prospective: boolean,
  Reaction: string,
  ReactionType: ?string,
  Severity: ?string,
  AllergenType: ?string,
  Comment: ?string,
};

type Response = {
  ScreenMessage: string,
  ScreenDrugs: Array<Drug>,
  ScreenAllergen: Allergen,
};

export type RequestResponse = Array<Response>;
