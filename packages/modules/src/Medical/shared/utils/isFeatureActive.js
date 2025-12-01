// @flow

export const issueExaminationDatePickerFlowIsActive = () =>
  window.getFlag('pm-editing-examination-and-date-of-injury');
export const movementAwareDatePickerIsActive = () =>
  window.getFlag('player-movement-aware-datepicker');
export const preliminaryConfigurationFlowIsActive = () =>
  window.getFlag('pm-preliminary-ga');
