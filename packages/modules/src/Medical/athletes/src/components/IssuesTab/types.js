// @flow
import type { MedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { Issue } from '@kitman/modules/src/Medical/shared/types';

export type ClosedIssueTableProps = {
  athleteId: string,
  issues: Array<Issue>,
  isLoading: boolean,
  isFullyLoaded: boolean,
  isPastAthlete: boolean,
  fetchMoreIssues: Function,
  setShowArchiveModal: Function,
  setSelectedRow: Function,
  permissions: MedicalPermissions,
  isAthleteOnTrial?: boolean,
  t: Translation,
};
export type OpenIssueTableProps = {
  athleteId: string,
  issues: Array<Issue>,
  setShowArchiveModal: Function,
  setSelectedRow: Function,
  permissions: MedicalPermissions,
  isAthleteOnTrial?: boolean,
  t: Translation,
};
