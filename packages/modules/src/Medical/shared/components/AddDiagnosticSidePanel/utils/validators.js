// @flow
import { validateURL, containsWhitespace } from '@kitman/common/src/utils';

export const isValidUrlNoWhitespace = (uri: string) =>
  validateURL(uri) && !containsWhitespace(uri);

export const areRequiredLinkFieldsValid = (title: string, uri: string) =>
  Boolean(title && title.length > 0) && isValidUrlNoWhitespace(uri);

export const isValidCpt = (cptCode?: string) =>
  !cptCode || cptCode.length === 5;

export const areAllCptsValid = (billableItems: Array<Object> = []) =>
  billableItems.every((item) =>
    item.cptCode?.length ? item.cptCode.length === 5 : true
  );

export const needsAssociatedIssueValidation = (
  reasonId: any,
  injuryIllnessReasonId: any
) => reasonId === injuryIllnessReasonId;

export const hasAssociatedInjuryOrIllness = (state: any) => {
  const injuryIds = state?.injuryIds || [];
  const illnessIds = state?.illnessIds || [];
  const chronicIssueIds = state?.chronicIssueIds || [];
  return (
    injuryIds.length > 0 || illnessIds.length > 0 || chronicIssueIds.length > 0
  );
};
