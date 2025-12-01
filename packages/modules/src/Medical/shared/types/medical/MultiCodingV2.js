// @flow

import type { CodingSystemSide } from '@kitman/services/src/services/medical/getCodingSystemSides';

export type Classification = {
  id: number,
  name: string,
  coding_system_id?: number,
};
export type Classifications = Array<Classification>;
// Check this
export type BodyArea = {
  id: number,
  name: string,
};

export type BodyAreas = Array<BodyArea>;

export type Side = {
  side_id: number,
  side_name: string,
};

export type Sides = Array<Side>;

export type CodingSystem = {
  id: number,
  name: string,
  key: string,
};

export type CodingSystemVersion = {
  id: number,
  coding_system: CodingSystem,
  name: string | null,
  order: number | null,
};

export type CodingSystemBodyRegion = {
  id: number,
  coding_system_id: number,
  name: string,
};

// TODO we need to check the types, this should be CodingSystemBodyArea?
export type CodingSystemBodyPart = {
  id: number,
  coding_system_id: number,
  coding_system_body_region: CodingSystemBodyRegion,
  name: string,
};

export type CodingSystemTissue = {
  id: number,
  coding_system_id: number,
  name: string,
};

export type CodingSystemClassification = {
  id: number,
  coding_system_id: number,
  name: string,
};

export type MultiCodingV2Pathology = {
  id: number,
  code: string,
  name: string,
  pathology?: string,
  groups?: ?Array<string>,
  coding_system?: CodingSystem,
  coding_system_body_area?: CodingSystemBodyPart,
  coding_system_version?: CodingSystemVersion,
  coding_system_body_region?: CodingSystemBodyRegion | null,
  coding_system_body_part?: CodingSystemBodyPart | null,
  coding_system_tissue?: CodingSystemTissue | null,
  coding_system_classification?: CodingSystemClassification,
  coding_system_side?: CodingSystemSide | null,
  coding_system_side_id?: number | null,
};

export type Pathology = MultiCodingV2Pathology;
export type Pathologies = Array<Pathology>;
