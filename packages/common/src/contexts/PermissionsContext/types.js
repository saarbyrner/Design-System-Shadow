// @flow
import type {
  RegistrationPermissions,
  DisciplinePermissions,
} from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import type {
  InjurySurveillancePermissions,
  LogicBuilderPermissions,
} from '@kitman/modules/src/ConditionalFields/shared/permissions/types';
import type { MovementPermissions } from '@kitman/modules/src/UserMovement/shared/types';
import type { MedicalPermissions } from './medical/types';
import type { ConcussionPermissions } from './concussion/types';
import type { SettingsPermissions } from './settings/types';
import type { RehabPermissions } from './rehab/types';
import type { GeneralPermissions } from './general/types';
import type { UserPermissions } from './user/types';
import type {
  TSOBasicPermission,
  TSOPermissions,
  TSOPermissionsWithManage,
} from './tso/types';
import type { HumanInputPermissions } from './humanInput/types';
import type { DevelopmentGoalsPermissions } from './developmentGoals/types';
import type { UserAccountsPermissions } from './userAccounts/types';
import type { AnalysisPermissions } from './analysis/types';
import type { CalendarSettingsPermissions } from './calendarSettings/types';
import type { EventLocationSettingsPermissions } from './eventLocationSettings/types';
import type { WorkloadsPermissions } from './workload/types';
import type { AssessmentsPermissions } from './assessments/types';
import type { MessagingPermissions } from './messaging/types';
import type { ElectronicFilesPermissions } from './electronicFiles/types';
import type { EFormsPermissions } from './eForms/types';
import type { LeagueGamePermissions } from './leagueGame/types';
import type { NotificationsPermissions } from './notifications/types';
import type { HomegrownPermissions } from './homegrown/types';
import type { MatchMonitorPermissions } from './matchMonitor/types';
import type { GuardianAccessPermissions } from './guardianAccess/types';
import type { ScoutAccessManagementPermissions } from './scoutAccessManagement/types';

export type PermissionsType = {|
  analysis: AnalysisPermissions,
  assessments: AssessmentsPermissions,
  medical: MedicalPermissions,
  rehab: RehabPermissions,
  concussion: ConcussionPermissions,
  settings: SettingsPermissions,
  general: GeneralPermissions,
  user: UserPermissions,
  workloads: WorkloadsPermissions,
  registration: RegistrationPermissions,
  tsoVideo: TSOPermissions,
  tsoDocument: TSOPermissions,
  tsoEvent: TSOPermissionsWithManage,
  tsoFixtureManagement: TSOBasicPermission,
  tsoFixtureNegotiation: TSOBasicPermission,
  tsoJtcFixtureRequests: TSOBasicPermission,
  tsoReviews: TSOPermissions,
  tsoRecruitment: TSOPermissions,
  humanInput: HumanInputPermissions,
  userAccounts: UserAccountsPermissions,
  developmentGoals: DevelopmentGoalsPermissions,
  calendarSettings: CalendarSettingsPermissions,
  injurySurveillance: InjurySurveillancePermissions,
  eventLocationSettings: EventLocationSettingsPermissions,
  userMovement: MovementPermissions,
  messaging: MessagingPermissions,
  efile: ElectronicFilesPermissions,
  eforms: EFormsPermissions,
  scoutAccessManagement: ScoutAccessManagementPermissions,
  discipline: DisciplinePermissions,
  leagueGame: LeagueGamePermissions,
  notifications: NotificationsPermissions,
  logicBuilder: LogicBuilderPermissions,
  homegrown: HomegrownPermissions,
  matchMonitor: MatchMonitorPermissions,
  guardianAccess: GuardianAccessPermissions,
|};

// TODO: Add isInCamelCase: true to packages/services/src/services/getPermissions.js
// the below will then no longer be needed

// Permissions come in from the BE in kebab-case, so we convert them to camelCase
export type MappedPermissions = {|
  analysis: Array<string>,
  assessments: Array<string>,
  general: Array<string>,
  medical: Array<string>,
  user: Array<string>,
  concussion: Array<string>,
  rehab: Array<string>,
  notes: Array<string>,
  settings: Array<string>,
  workloads: Array<string>,
  registration: Array<string>,
  tsoVideo: Array<string>,
  tsoDocument: Array<string>,
  tsoEvent: Array<string>,
  tsoFixture: Array<string>,
  tsoJtcFixture: Array<string>,
  tsoReviews: Array<string>,
  tsoRecruitment: Array<string>,
  humanInput: Array<string>,
  developmentGoals: Array<string>,
  calendarSettings: Array<string>,
  injurySurveillance: Array<string>,
  eventLocationSettings: Array<string>,
  userAccounts: Array<string>,
  userMovement: Array<string>,
  messaging: Array<string>,
  efile: Array<string>,
  eforms: Array<string>,
  scoutAccessManagement: Array<string>,
  discipline: Array<string>,
  leagueGame: Array<string>,
  notifications: Array<string>,
  logicBuilder: Array<string>,
  homegrown: Array<string>,
  matchMonitor: Array<string>,
  guardianAccess: Array<string>,
|};

export type PermissionsContextType = {
  permissions: PermissionsType,
  permissionsRequestStatus: 'PENDING' | 'SUCCESS' | 'FAILURE',
};
