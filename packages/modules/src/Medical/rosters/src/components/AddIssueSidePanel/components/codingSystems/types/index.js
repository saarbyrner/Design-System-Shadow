// @flow

import type {
  Coding,
  SecondaryPathology,
  CodingSystemKey,
} from '@kitman/common/src/types/Coding';
import type { Side } from '@kitman/services/src/services/medical/getSides';
import type { Grade } from '@kitman/services/src/services/medical/getGrades';
import type { MultiCodingV2Pathology } from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';

export type IssueType = 'injury' | 'illness';

export type ExaminationDateProps = {
  selectedExaminationDate: string,
  selectedDiagnosisDate: string,
  maxPermittedExaminationDate: string,
  onSelectExaminationDate: Function,
};

export type RootCodingSystemProps = {
  selectedCoding: Coding,
  onSelectCoding: Function,
  isPathologyFieldDisabled: boolean,
};

export type CiCodeProps = {
  ...RootCodingSystemProps,
  selectedSupplementalCoding: Coding,
  onSelectSupplementalCoding: Function,
};

export type DatalysCodeProps = RootCodingSystemProps;
export type ICDCodeProps = RootCodingSystemProps;
export type OSICS10CodeProps = RootCodingSystemProps;

export type SupplementalPathologyProps = {
  enteredSupplementalPathology: string,
  onEnterSupplementalPathology: Function,
  onRemoveSupplementalPathology: Function,
};

export type CodingSystemProps = {
  selectedCoding: Coding,
  onSelectCoding: Function,
  onSelectPathology: Function,
  onSelectClassification: Function,
  onSelectBodyArea: Function,
};
export type OnsetProps = {
  selectedOnset: string,
  onSelectOnset: Function,
  onsetFreeText: string,
  onUpdateOnsetFreeText: (string) => void,
};

export type OnsetDescriptionProps = {
  selectedOnsetDescription: string,
  onSelectOnsetDescription: (description: string) => void,
};

export type SideProps = {
  sides: Array<Side>,
  onSelectSide: (codingSystemName: CodingSystemKey, sideId: string) => void,
  selectedSide: string,
};

export type CodingSystemSideProps = {
  onSelectSide: (sideId: number) => void,
  selectedSide: ?number,
};

type BamicOption = {
  value: number,
  label: string,
};

export type BamicProps = {
  selectedBamicGrade: number,
  grades: Array<Grade>,
  onSelectBamicGrade: Function,
  selectedBamicSite: number,
  onSelectBamicSite: Function,
  bamicSiteOptions: ?Array<BamicOption>,
};

export type SecondaryPathologyProps = {
  secondaryPathologies: Array<SecondaryPathology>,
  onEditSecondaryPathology: (
    secondaryPathology: SecondaryPathology,
    index: number
  ) => void,
  onAddSecondaryPathology: (SecondaryPathology) => void,
  onRemoveSecondaryPathology: (number) => void,
};

export type StandardCodingSystemProps = {
  onSelectCodingSystemPathology: (pathology: ?MultiCodingV2Pathology) => void,
  selectedCodingSystemPathology?: ?MultiCodingV2Pathology,
  isPathologyFieldDisabled?: boolean,
};
