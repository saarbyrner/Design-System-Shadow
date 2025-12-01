// @flow
import type { Side } from '@kitman/services/src/services/medical/getSides';
import type { MultiCodingV2Pathology } from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';

type Value = {
  id: number,
  name: string,
};

export type BodyArea = Value;
export type Classification = Value;

export type Record = {
  id: number,
  code: number,
  pathology: string,
  clinical_impression_body_area: BodyArea,
  clinical_impression_body_area_id: number,
  clinical_impression_classification: Classification,
  clinical_impression_classification_id: number,
};

export type SecondaryPathology = {
  id: ?number,
  record: ?Record,
  side: ?Side,
};
export type ICD = {
  icd_id: number,
  code: string,
  diagnosis: string,
  body_part: ?number,
  body_area: ?string,
  osics_body_area_id: ?number,
  osics_body_area: ?string,
  pathology_type: ?null,
  side_id: ?number,
  side: ?string,
  groups: ?Array<string>,
};

export type DATALYS = {
  id: number,
  code: number,
  pathology: string,
  datalys_body_area: ?string,
  datalys_body_area_id: ?string,
  datalys_classification: ?string,
  datalys_classification_id: ?string,
  datalys_tissue_type: ?string,
  datalys_tissue_type_id: ?string,
  side_id: ?number,
  side: ?null,
  groups: ?Array<string>,
};

export type CLINICAL_IMPRESSIONS = {
  id: number,
  code: number,
  pathology: string,
  clinical_impression_body_area: ?string,
  clinical_impression_body_area_id: ?number,
  clinical_impression_classification: ?string,
  clinical_impression_classification_id: ?string,
  side_id: ?number,
  side: ?null,
  groups: ?Array<string>,
  secondary_pathologies: ?Array<SecondaryPathology>,
};

export type OSICS = {
  osics_id: string,
  osics_pathology_id: string,
  osics_pathology: string,
  osics_classification_id: string,
  osics_classification: string,
  osics_body_area_id: string,
  osics_body_area: string,
  side_id: string,
  icd: ?string,
  groups: ?Array<string>,
};

export type OSIICS15 = {
  coding_system_pathology_id: string,
  groups: ?Array<string>,
};

export type CodingSystem =
  | ICD
  | DATALYS
  | CLINICAL_IMPRESSIONS
  | OSICS
  | OSIICS15;

export type Coding = {
  icd_10_cm?: ICD,
  osics_10?: OSICS,
  datalys?: DATALYS,
  clinical_impressions?: CLINICAL_IMPRESSIONS,
  pathologies?: Array<MultiCodingV2Pathology>,
  osiics_15?: MultiCodingV2Pathology,
};

export type CodingSystemKey =
  | 'icd_10_cm'
  | 'osics_10'
  | 'osiics_15'
  | 'datalys'
  | 'clinical_impressions';
