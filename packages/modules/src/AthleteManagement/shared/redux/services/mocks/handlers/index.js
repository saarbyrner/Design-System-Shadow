import { handler as sendNotificationsHandler } from './sendNotifications';
import { handler as getNonCompliantAthletesHandler } from './getNonCompliantAthletes';
import { handler as getIsActivityTypeCategoryEnabledHandler } from './getIsActivityTypeCategoryEnabled';
import { handler as fetchAdministrationAthletesHandler } from './fetchAdministrationAthletes';
import { handler as bulkAssignAthleteSquads } from './bulkAssignAthleteSquads';
import { handler as bulkUpdatePrimarySquad } from './bulkUpdatePrimarySquad';
import { handler as bulkUpdateActiveStatus } from './bulkUpdateActiveStatus';

export default [
  sendNotificationsHandler,
  getNonCompliantAthletesHandler,
  getIsActivityTypeCategoryEnabledHandler,
  fetchAdministrationAthletesHandler,
  bulkAssignAthleteSquads,
  bulkUpdatePrimarySquad,
  bulkUpdateActiveStatus,
];
