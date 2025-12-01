// @flow

import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type { Store } from '../types/store';

export const getSelectedIssueType = (state: Store) =>
  state.addIssuePanel.initialInfo.type;

export const getEnteredSupplementalPathology = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.enteredSupplementalPathology;

export const getIsBamic = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.isBamic;

export const getSelectedBamicSite = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.bamicSite;

export const getAttachedConcussionAssessments = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.concussion_assessments;

export const getSelectedAthlete = (state: Store) =>
  state.addIssuePanel.initialInfo.athlete;

export const getSelectedBamicGrade = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.bamicGrade;

export const getSelectedCoding = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.coding;

export const getSelectedSupplementalCoding = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.supplementaryCoding;

export const getSelectedDiagnosisDate = (state: Store) =>
  state.addIssuePanel.initialInfo.diagnosisDate;

export const getSelectedOnset = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.onset;

export const getSelectedOnsetDescription = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.onsetDescription;

export const getOnsetFreeText = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.onsetFreeText;

export const getInjuryMechanismFreeText = (state: Store) =>
  state.addIssuePanel.eventInfo.injuryMechanismFreetext;

export const getPrimaryMechanismFreeText = (state: Store) =>
  state.addIssuePanel.eventInfo.primaryMechanismFreetext;

export const getIssueContactFreeText = (state: Store) =>
  state.addIssuePanel.eventInfo.issueContactFreetext;

export const getSelectedExaminationDate = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.examinationDate;

export const getRelatedChronicIssues = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.relatedChronicIssues || [];

export const getSelectedIssueID = (state: Store) =>
  state.addIssuePanel.initialInfo.issueId;

export const getIsExternalRecurrance = (state: Store) =>
  state.addIssuePanel.initialInfo.recurrenceOutsideSystem;

export const getSelectedCodingSystemSide = (state: Store) => {
  const coding = state.addIssuePanel.diagnosisInfo.coding;
  const pathology = coding?.pathologies?.[0] ?? {};
  return pathology?.coding_system_side_id ?? null;
};

export const getSelectedCodingSystemPathology = (state: Store) => {
  return (
    state.addIssuePanel.diagnosisInfo.coding?.pathologies?.[0] ??
    state.addIssuePanel.diagnosisInfo.selectedCodingSystemPathology ??
    null
  );
};

export const getSelectedSide = (state: Store) => {
  if (!window.featureFlags['emr-multiple-coding-systems']) {
    return state.addIssuePanel.diagnosisInfo.side;
  }

  if (state.addIssuePanel.diagnosisInfo.coding[codingSystemKeys.OSICS_10]) {
    return state.addIssuePanel.diagnosisInfo.coding[codingSystemKeys.OSICS_10]
      .side_id;
  }
  if (state.addIssuePanel.diagnosisInfo.coding[codingSystemKeys.DATALYS]) {
    return state.addIssuePanel.diagnosisInfo.coding[codingSystemKeys.DATALYS]
      .side_id;
  }
  if (
    state.addIssuePanel.diagnosisInfo.coding[
      codingSystemKeys.CLINICAL_IMPRESSIONS
    ]
  ) {
    return state.addIssuePanel.diagnosisInfo.coding[
      codingSystemKeys.CLINICAL_IMPRESSIONS
    ].side_id;
  }

  return null;
};

export const getSecondaryPathologies = (state: Store) =>
  state.addIssuePanel.diagnosisInfo.secondary_pathologies;
