// @flow
import { handler as createDrill } from './createDrill';
import { handler as createEventActivity } from './createEventActivity';
import { handler as getAthleteEvents } from './getAthleteEvents';
import { handler as searchAthletes } from './searchAthletes';
import { handler as getEventActivities } from './getEventActivities';
import { handler as getEventActivityStates } from './getEventActivityStates';
import saveEventActivities from './saveEventActivities';
import saveEventParticipants from './saveEventParticipants';
import { handler as saveSessionEvaluationFeedback } from './savePlanningFreeTextValues';
import { handler as searchDrills } from './searchDrills';
import saveEventsUsers from './saveEventsUsers';
import { handler as getOrgCustomLocationsHandler } from './getOrgCustomLocations';
import { handler as getOrgCustomSurfaceTypesHandler } from './getOrgCustomSurfaceTypes';
import { handler as getSurfaceCompositionsByFieldType } from './getSurfaceCompositionsByFieldType';
import { handler as getActivityLocations } from './getActivityLocations';
import { handler as getOrgCustomEquipmentHandler } from './getOrgCustomEquipment';
import { handler as getFieldConditionsHandler } from './getFieldConditions';
import { handler as getSeasonTypesHandler } from './getSeasonTypes';
import { handler as updateEventAttributes } from './updateEventAttributes';
import { handler as updateEventActivityDrill } from './updateEventActivityDrill';
import { handler as deleteEventAttachment } from './deleteEventAttachment';
import { handler as deleteEventLink } from './deleteEventLink';
import { handler as getEventAttachmentCategories } from './getEventAttachmentCategories';
import { handler as getPlanningFreeTextValues } from './getPlanningFreeTextValues';
import { handler as getEventLocations } from './getEventLocations';
import { handler as getEventSquads } from './getEventSquads';
import { handler as getCustomEventTypes } from './getCustomEventTypes';
import { handler as getEventLocationsSurface } from './getEventLocationsSurface';
import { handler as getEventsUsers } from './getEventsUsers';
import updateEventActivity from './updateEventActivity';
import archiveLibraryDrill from './archiveLibraryDrill';
import unarchiveLibraryDrill from './unarchiveLibraryDrill';
import { handler as getIsAddMovedPlayersEnabled } from './getIsAddMovedPlayersEnabled';
import { handler as getMovedPlayers } from './getMovedPlayers';
import { handler as updateNflParticipationLevels } from './updateNflParticipationLevels';
import { handler as getFixtureRatingHandler } from './getFixtureRating';
import { handler as getOrganisationFormatsHandler } from './getOrganisationFormats';

export default [
  createDrill,
  createEventActivity,
  deleteEventAttachment,
  deleteEventLink,
  getAthleteEvents,
  searchAthletes,
  getEventActivities,
  getEventActivityStates,
  saveEventActivities,
  saveSessionEvaluationFeedback,
  saveEventParticipants,
  saveEventsUsers,
  searchDrills,
  getOrgCustomLocationsHandler,
  getOrgCustomSurfaceTypesHandler,
  getSurfaceCompositionsByFieldType,
  getIsAddMovedPlayersEnabled,
  getMovedPlayers,
  getActivityLocations,
  getOrgCustomEquipmentHandler,
  getFieldConditionsHandler,
  getSeasonTypesHandler,
  updateEventAttributes,
  updateEventActivityDrill,
  getEventAttachmentCategories,
  getPlanningFreeTextValues,
  getEventLocations,
  getEventLocationsSurface,
  getEventSquads,
  getCustomEventTypes,
  getEventsUsers,
  updateEventActivity,
  archiveLibraryDrill,
  unarchiveLibraryDrill,
  updateNflParticipationLevels,
  getFixtureRatingHandler,
  getOrganisationFormatsHandler,
];
