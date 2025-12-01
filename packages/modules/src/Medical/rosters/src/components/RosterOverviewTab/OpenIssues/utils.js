// @flow
import type { InjuryStatus } from '@kitman/services/src/services/getInjuryStatuses';
import type { RequestStatus } from '@kitman/common/src/types';
import type { SelectOption } from '@kitman/components/src/types';

export const getStatusOptions = (
  injuryStatuses: Array<InjuryStatus>
): Array<SelectOption> => {
  return injuryStatuses.map((status) => ({
    value: status.id,
    label: status.description,
  }));
};

export const getDefaultStatusId = (
  openIssue: { status_id: ?number },
  injuryStatuses: Array<InjuryStatus>
): ?number => {
  if (!openIssue.status_id) {
    return null;
  }
  const matched = injuryStatuses.find(
    (injuryStatus) => injuryStatus.id === openIssue.status_id
  );
  return matched ? matched.id : null;
};

export const checkAllUpdatesCompleted = (changeStatuses: {
  [issueId: number]: RequestStatus,
}): boolean => {
  if (!Object.keys(changeStatuses).length) {
    return false;
  }
  return Object.values(changeStatuses).every((status) =>
    ['SUCCESS', 'FAILURE'].includes(status)
  );
};
