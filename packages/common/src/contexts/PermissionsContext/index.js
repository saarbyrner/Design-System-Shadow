// @flow
import {
  type Node,
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import { getPermissions } from '@kitman/services';
import type { Permissions } from '@kitman/services/src/services/getPermissions';
import {
  setRegistrationPermissions,
  defaultRegistrationPermissions,
  setDisciplinePermissions,
  defaultDisciplinePermissions,
} from '@kitman/modules/src/LeagueOperations/shared/permissions';
import {
  defaultInjurySurveillancePermissions,
  setInjurySurveillancePermissions,
  defaultLogicBuilderPermissions,
  setLogicBuilderPermissions,
} from '@kitman/modules/src/ConditionalFields/shared/permissions';
import {
  defaultUserMovementPermissions,
  setUserMovementPermissions,
} from '@kitman/modules/src/UserMovement/shared/permissions';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';

import type {
  PermissionsContextType,
  PermissionsType,
  MappedPermissions,
} from './types';

import { setMedicalPermissions, defaultMedicalPermissions } from './medical';
import {
  setConcussionPermissions,
  defaultConcussionPermissions,
} from './concussion';
import { setRehabPermissions, defaultRehabPermissions } from './rehab';
import { setSettingsPermissions, defaultSettingsPermissions } from './settings';
import { setGeneralPermissions, defaultGeneralPermissions } from './general';
import { setUserPermissions, defaultUserPermissions } from './user';
import {
  setTSOVideoPermissions,
  setTSODocumentPermissions,
  setTSOEventPermissions,
  setTSOFixtureManagementPermissions,
  setTSOFixtureNegotiationPermissions,
  setTSOJtcFixtureRequestsPermissions,
  setTSOReviewsPermissions,
  setTSORecruitmentPermissions,
  defaultTSOPermissions,
  defaultTSOPermissionsWithManage,
  basicTSOPermission,
} from './tso';
import {
  setHumanInputPermissions,
  defaultHumanInputPermissions,
} from './humanInput';
import {
  setUserAccountsPermissions,
  defaultUserAccountsPermissions,
} from './userAccounts';
import { defaultAnalysisPermissions, setAnalysisPermissions } from './analysis';
import {
  setWorkloadsPermissions,
  defaultWorkloadsPermissions,
} from './workload';
import {
  setAssessmentsPermissions,
  defaultAssessmentsPermissions,
} from './assessments';
import {
  setDevelopmentGoalsPermissions,
  defaultDevelopmentGoalsPermissions,
} from './developmentGoals';
import {
  defaultCalendarSettingsPermissions,
  setCalendarSettingsPermissions,
} from './calendarSettings';
import {
  defaultEventLocationSettingsPermissions,
  setEventLocationSettingsPermissions,
} from './eventLocationSettings';
import {
  defaultMessagingPermissions,
  setMessagingPermissions,
} from './messaging';
import { setEFormsPermissions, defaultEFormsPermissions } from './eForms';
import {
  setElectronicFilesPermissions,
  defaultElectronicFilesPermissions,
} from './electronicFiles';
import {
  defaultLeagueGamePermissions,
  setLeagueGamePermissions,
} from './leagueGame';
import {
  defaultNotificationsPermissions,
  setNotificationsPermissions,
} from './notifications';
import {
  defaultHomegrownPermissions,
  setHomegrownPermissions,
} from './homegrown';
import {
  defaultMatchMonitorPermissions,
  setMatchMonitorPermissions,
} from './matchMonitor';
import {
  defaultGuardianAccessPermissions,
  setGuardianAccessPermissions,
} from './guardianAccess';

import {
  defaultScoutAccessManagementPermissions,
  setScoutAccessManagementPermissions,
} from './scoutAccessManagement';

export const DEFAULT_CONTEXT_VALUE: PermissionsContextType = {
  permissions: {
    analysis: defaultAnalysisPermissions,
    rehab: defaultRehabPermissions,
    medical: defaultMedicalPermissions,
    concussion: defaultConcussionPermissions,
    settings: defaultSettingsPermissions,
    general: defaultGeneralPermissions,
    user: defaultUserPermissions,
    registration: defaultRegistrationPermissions,
    tsoVideo: defaultTSOPermissions,
    tsoDocument: defaultTSOPermissions,
    tsoEvent: defaultTSOPermissionsWithManage,
    tsoFixtureManagement: basicTSOPermission,
    tsoFixtureNegotiation: basicTSOPermission,
    tsoJtcFixtureRequests: basicTSOPermission,
    tsoReviews: defaultTSOPermissions,
    tsoRecruitment: defaultTSOPermissions,
    humanInput: defaultHumanInputPermissions,
    userAccounts: defaultUserAccountsPermissions,
    workloads: defaultWorkloadsPermissions,
    assessments: defaultAssessmentsPermissions,
    developmentGoals: defaultDevelopmentGoalsPermissions,
    calendarSettings: defaultCalendarSettingsPermissions,
    injurySurveillance: defaultInjurySurveillancePermissions,
    userMovement: defaultUserMovementPermissions,
    eventLocationSettings: defaultEventLocationSettingsPermissions,
    messaging: defaultMessagingPermissions,
    efile: defaultElectronicFilesPermissions,
    eforms: defaultEFormsPermissions,
    scoutAccessManagement: defaultScoutAccessManagementPermissions,
    discipline: defaultDisciplinePermissions,
    leagueGame: defaultLeagueGamePermissions,
    notifications: defaultNotificationsPermissions,
    logicBuilder: defaultLogicBuilderPermissions,
    homegrown: defaultHomegrownPermissions,
    matchMonitor: defaultMatchMonitorPermissions,
    guardianAccess: defaultGuardianAccessPermissions,
  },
  permissionsRequestStatus: 'PENDING',
};

const PermissionsContext = createContext<PermissionsContextType>(
  DEFAULT_CONTEXT_VALUE
);

// TODO: Add isInCamelCase: true to packages/services/src/services/getPermissions.js
// the below will then no longer be needed
export const getPermissionsContextMappings = (
  data: Permissions
): MappedPermissions => ({
  analysis: data.analysis ?? [],
  notes: data.notes ?? [],
  rehab: data.rehab ?? [],
  medical: data.medical ?? [],
  general: data.general ?? [],
  concussion: data.concussion ?? [],
  settings: data.settings ?? [],
  user: data.user ?? [],
  registration: data.registration ?? [],
  workloads: data.workloads ?? [],
  tsoVideo: data['tso-video'] ?? [],
  tsoDocument: data['tso-document'] ?? [],
  tsoEvent: data['tso-event'] ?? [],
  tsoFixture: data['tso-fixture'] ?? [],
  tsoJtcFixture: data['tso-jtc-fixture'] ?? [],
  tsoRecruitment: data['tso-recruitment'] ?? [],
  tsoReviews: data['tso-reviews'] ?? [],
  humanInput: data['human-input'] ?? [],
  userAccounts: data['user-accounts'] ?? [],
  calendarSettings: data['calendar-settings'] ?? [],
  injurySurveillance: data['injury-surveillance'] ?? [],
  userMovement: data['user-movement'] ?? [],
  eventLocationSettings: data['event-location-settings'] ?? [],
  developmentGoals: data['development-goals'] ?? [],
  assessments: data.assessments ?? [],
  messaging: data.messaging ?? [],
  efile: data.efile ?? [],
  eforms: data.eforms ?? [],
  scoutAccessManagement: data['scout-access-management'] ?? [],
  discipline: data.discipline ?? [],
  leagueGame: data['league-game'] ?? [],
  notifications: data.notifications ?? [],
  logicBuilder: data['logic-builder'] ?? [],
  homegrown: data.homegrown ?? [],
  matchMonitor: data['match-monitor'] ?? [],
  guardianAccess: data['guardian-access'] ?? [],
});

export const transformDataToPermissions = (
  mappedPermissions: MappedPermissions
): PermissionsType => {
  return {
    analysis: setAnalysisPermissions(mappedPermissions.analysis),
    medical: setMedicalPermissions(
      mappedPermissions.notes,
      mappedPermissions.medical,
      mappedPermissions.general
    ),
    rehab: setRehabPermissions(mappedPermissions.rehab),
    concussion: setConcussionPermissions(mappedPermissions.concussion),
    settings: setSettingsPermissions(mappedPermissions.settings),
    general: setGeneralPermissions(mappedPermissions.general),
    user: setUserPermissions(mappedPermissions.user),
    registration: setRegistrationPermissions(mappedPermissions.registration),
    tsoVideo: setTSOVideoPermissions(mappedPermissions.tsoVideo),
    tsoDocument: setTSODocumentPermissions(mappedPermissions.tsoDocument),
    tsoEvent: setTSOEventPermissions(mappedPermissions.tsoEvent),
    tsoFixtureManagement: setTSOFixtureManagementPermissions(
      mappedPermissions.tsoFixture
    ),
    tsoFixtureNegotiation: setTSOFixtureNegotiationPermissions(
      mappedPermissions.tsoFixture
    ),
    tsoJtcFixtureRequests: setTSOJtcFixtureRequestsPermissions(
      mappedPermissions.tsoJtcFixture
    ),
    tsoReviews: setTSOReviewsPermissions(mappedPermissions.tsoReviews),
    tsoRecruitment: setTSORecruitmentPermissions(
      mappedPermissions.tsoRecruitment
    ),
    humanInput: setHumanInputPermissions(mappedPermissions.humanInput),
    userAccounts: setUserAccountsPermissions(mappedPermissions.userAccounts),
    workloads: setWorkloadsPermissions(mappedPermissions.workloads),
    assessments: setAssessmentsPermissions(mappedPermissions.assessments),
    developmentGoals: setDevelopmentGoalsPermissions(
      mappedPermissions.developmentGoals
    ),
    calendarSettings: setCalendarSettingsPermissions(
      mappedPermissions.calendarSettings
    ),
    injurySurveillance: setInjurySurveillancePermissions(
      mappedPermissions.injurySurveillance
    ),
    userMovement: setUserMovementPermissions(mappedPermissions.userMovement),
    eventLocationSettings: setEventLocationSettingsPermissions(
      mappedPermissions.eventLocationSettings
    ),
    messaging: setMessagingPermissions(mappedPermissions.messaging),
    efile: setElectronicFilesPermissions(mappedPermissions.efile),
    eforms: setEFormsPermissions(mappedPermissions.eforms),
    scoutAccessManagement: setScoutAccessManagementPermissions(
      mappedPermissions.scoutAccessManagement
    ),
    discipline: setDisciplinePermissions(mappedPermissions.discipline),
    leagueGame: setLeagueGamePermissions(mappedPermissions.leagueGame),
    notifications: setNotificationsPermissions(mappedPermissions.notifications),
    logicBuilder: setLogicBuilderPermissions(mappedPermissions.logicBuilder),
    homegrown: setHomegrownPermissions(mappedPermissions.homegrown),
    matchMonitor: setMatchMonitorPermissions(mappedPermissions.matchMonitor),
    guardianAccess: setGuardianAccessPermissions(
      mappedPermissions.guardianAccess
    ),
  };
};

type ProviderProps = {
  children: Node,
};

const PermissionsProvider = ({ children }: ProviderProps) => {
  const checkIsMounted = useIsMountedCheck();

  const [permissions, setPermissions] = useState<PermissionsType>(
    DEFAULT_CONTEXT_VALUE.permissions
  );
  const [permissionsRequestStatus, setPermissionsRequestStatus] =
    useState('PENDING');

  useEffect(() => {
    getPermissions().then(
      (data) => {
        if (!checkIsMounted()) return;
        setPermissions(
          transformDataToPermissions(getPermissionsContextMappings(data))
        );
        setPermissionsRequestStatus('SUCCESS');
      },
      () => {
        if (!checkIsMounted()) return;
        setPermissionsRequestStatus('FAILURE');
      }
    );
  }, []);

  const permissionsValue: PermissionsContextType = {
    permissions,
    permissionsRequestStatus,
  };

  return (
    <PermissionsContext.Provider value={permissionsValue}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = (): PermissionsContextType =>
  useContext(PermissionsContext);

export { PermissionsProvider };
export default PermissionsContext;
