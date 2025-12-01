// @flow

import type {
  Store,
  RegistrationStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export const sharedGetIsPanelOpen = (state: Store, key: string): boolean =>
  state[key].panel.isOpen;

export const sharedGetIsSubmitStatusDisabled = (
  state: Store,
  key: string
): boolean => !state[key].approval.status;

export const sharedGetSelectedApprovalStatus = (
  state: Store,
  key: string
): RegistrationStatus => state[key].approval.status;

export const sharedGetStatuses = (state: Store, key: string) =>
  state[key].statuses;

export const sharedGetSelectedApprovalAnnotation = (
  state: Store,
  key: string
): string => state[key].approval.annotation;

export const sharedGetIsSubmitDisabled = (
  approvalStatus: RegistrationStatus,
  annotation: string
): boolean => {
  if (!approvalStatus) return true;
  return (
    [
      RegistrationStatusEnum.REJECTED_ASSOCIATION,
      RegistrationStatusEnum.REJECTED_ORGANISATION,
    ].includes(approvalStatus) && !annotation.length
  );
};
