import { handler as searchMovementOrganisationsListHandler } from './searchMovementOrganisationsList';
import { handler as postMovementRecordHandler } from './postMovementRecord';
import { handler as searchAthletesHandler } from './searchAthletes';
import { handler as searchAvailableSquadsHandler } from './searchAvailableSquads';
import { handler as postMovementRecordHistory } from './postMovementRecordHistory';

export default [
  searchMovementOrganisationsListHandler,
  postMovementRecordHandler,
  searchAthletesHandler,
  searchAvailableSquadsHandler,
  postMovementRecordHistory,
];
