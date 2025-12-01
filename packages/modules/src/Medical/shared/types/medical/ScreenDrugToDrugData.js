// @flow
export type ScreenDrugToDrugData = {
  athlete_id: number,
  drug_type: string,
  drug_id?: ?number,
  external_drug_id?: ?number,
};

export type Drug1 = {
  DrugDose: ?string,
  GroupSetID: string,
  Prospective: boolean,
  DrugDesc: string,
  DrugID: string,
  DrugConceptType: number,
};

export type Drug2 = {
  DrugDose: ?string,
  Prospective: boolean,
  DrugDesc: string,
  DrugID: string,
  DrugConceptType: number,
};

export type ClinicalEffect = {
  ClinicalEffectCode: string,
  ClinicalEffectDesc: string,
};

type Response = {
  ScreenMessage: string,
  ClinicalEffects: Array<ClinicalEffect>,
  InteractionDesc: string,
  Severity: string,
  ScreenDrug1: Drug1,
  ScreenDrug2: Drug2,
  HasHumanClinicalTrial: boolean,
  HasCaseReports: boolean,
  HasMeetingAbstract: boolean,
  HasVitroOrAnimalStudy: boolean,
  HasMfgInfo: boolean,
  HasReview: boolean,
  MonographID: number,
  InteractionID: number,
  SeverityDesc: string,
  EDIPageReference: string,
  ScreenDrugs: Array<Drug1 | Drug2>,
  ClinicalEffectsNarrative: string,
};

export type RequestResponse = Array<Response>;
