import { handler as createSquadHandler } from './createSquad';
import { handler as fetchSquadSettingsHandler } from './fetchSquadSettings';
import { handler as searchOrganisationDivisionListHandler } from './searchOrganisationDivisionList';
import { handler as searchSquadListHandler } from './searchSquadList';

export default [
  createSquadHandler,
  fetchSquadSettingsHandler,
  searchOrganisationDivisionListHandler,
  searchSquadListHandler,
];
