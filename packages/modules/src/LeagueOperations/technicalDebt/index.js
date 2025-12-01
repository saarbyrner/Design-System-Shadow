// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  type RegistrationStatus,
  type UserType,
  RegistrationStatusEnum,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  ASSOCIATION_ADMIN,
  ORGANISATION_ADMIN,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

// TODO: update this file to use registration_system_status

export type ApprovalOption = {
  label: string,
  value: RegistrationStatus,
};

export const INCOMPLETE: ApprovalOption = {
  value: RegistrationStatusEnum.INCOMPLETE,
  label: i18n.t('Incomplete'),
};
export const PENDING_ORGANISATION: ApprovalOption = {
  value: RegistrationStatusEnum.PENDING_ORGANISATION,
  label: i18n.t('Pending (Club approval)'),
};
export const PENDING_ASSOCIATION: ApprovalOption = {
  value: RegistrationStatusEnum.PENDING_ASSOCIATION,
  label: i18n.t('Pending (League approval)'),
};
export const REJECTED_ORGANISATION: ApprovalOption = {
  value: RegistrationStatusEnum.REJECTED_ORGANISATION,
  label: i18n.t('Rejected (Club)'),
};
export const REJECTED_ASSOCIATION: ApprovalOption = {
  value: RegistrationStatusEnum.REJECTED_ASSOCIATION,
  label: i18n.t('Rejected (League)'),
};
export const PENDING_PAYMENT: ApprovalOption = {
  value: RegistrationStatusEnum.PENDING_PAYMENT,
  label: i18n.t('Pending (Payment)'),
};
export const APPROVED: ApprovalOption = {
  value: RegistrationStatusEnum.APPROVED,
  label: i18n.t('Approved'),
};

export const getAllOptions = (): Array<ApprovalOption> => {
  return [
    PENDING_ORGANISATION,
    REJECTED_ORGANISATION,
    PENDING_ASSOCIATION,
    REJECTED_ASSOCIATION,
    PENDING_PAYMENT,
    APPROVED,
  ];
};

export const getAssociationAdminOptions = (
  currentStatus: RegistrationStatus
): Array<ApprovalOption> => {
  return [
    PENDING_ORGANISATION,
    REJECTED_ORGANISATION,
    PENDING_ASSOCIATION,
    REJECTED_ASSOCIATION,
    APPROVED,
  ].filter((option) => option.value !== currentStatus);
};

export const getApprovalOptions = ({
  userType,
  currentStatus,
}: {
  userType: UserType,
  currentStatus: RegistrationStatus,
}): Array<ApprovalOption> => {
  if (userType === ASSOCIATION_ADMIN) {
    return getAssociationAdminOptions(currentStatus);
  }
  if (userType === ORGANISATION_ADMIN) {
    return [REJECTED_ORGANISATION, PENDING_ASSOCIATION];
  }

  return [];
};

export const getRequirementApprovalOptions = ({
  userType,
  currentStatus,
}: {
  userType: UserType,
  currentStatus: RegistrationStatus,
}): Array<ApprovalOption> => {
  if (userType === ASSOCIATION_ADMIN) {
    return getAssociationAdminOptions(currentStatus).filter(
      (s) => s.value !== RegistrationStatusEnum.PENDING_PAYMENT
    );
  }
  if (userType === ORGANISATION_ADMIN) {
    return [REJECTED_ORGANISATION, PENDING_ASSOCIATION];
  }

  return [];
};

export const MLS_NEXT_LOGO: string =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/MLS_Next_logo.png/1534px-MLS_Next_logo.png?20210519232756';

export const getLogoByDivision = (division: string): ?string => {
  switch (division) {
    case 'KLS Next':
    case 'MLS Next':
      return MLS_NEXT_LOGO;
    default:
      return null;
  }
};
