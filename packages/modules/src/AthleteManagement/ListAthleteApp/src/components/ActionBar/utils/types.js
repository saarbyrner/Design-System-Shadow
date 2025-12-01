// @flow
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import type {
  BulkAssignAthleteSquadsRequestBody,
  BulkAssignAthleteSquadsReturnType,
} from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/bulkAssignAthleteSquads';
import type {
  BulkUpdatePrimarySquadRequestBody,
  BulkUpdatePrimarySquadReturnType,
} from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/bulkUpdatePrimarySquad';
import type { BulkUpdatePayload as BulkUpdateAthleteLabelsRequestBody } from '@kitman/services/src/services/dynamicCohorts/Labels/bulkUpdateAthleteLabels';
import type {
  BulkUpdateActiveStatusRequestBody,
  BulkUpdateActiveStatusReturnType,
} from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/bulkUpdateActiveStatus';
import type { BulkActionsData } from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';

export type BulkAssignAthleteSquads = ReduxMutation<
  BulkAssignAthleteSquadsRequestBody,
  BulkAssignAthleteSquadsReturnType
>;

export type BulkAssignPrimarySquad = ReduxMutation<
  BulkUpdatePrimarySquadRequestBody,
  BulkUpdatePrimarySquadReturnType
>;

export type BulkUpdateAthleteLabels = ReduxMutation<
  BulkUpdateAthleteLabelsRequestBody,
  {}
>;
export type BulkUpdateActiveStatus = ReduxMutation<
  BulkUpdateActiveStatusRequestBody,
  BulkUpdateActiveStatusReturnType
>;

export type Option = { label: string, value: number };

export type SelectedAthleteIds = $PropertyType<
  BulkActionsData,
  'selectedAthleteIds'
>;
