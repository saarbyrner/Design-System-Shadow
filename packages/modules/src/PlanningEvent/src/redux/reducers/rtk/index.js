// @flow
import { notificationsApi } from '@kitman/services/src/services/OrganisationSettings/Notifications';
import { athleteEventAPI } from './athleteEventApi';
import { fixturesAPI } from './fixturesAPI';
import { organisationFormatsApi } from './organisationFormatsApi';
import { positionGroupsApi } from './positionGroupsApi';
import { formationsApi } from './formationsApi';
import { participationLevelsApi } from './participationLevelsApi';
import { eventPeriodsApi } from './eventPeriodsApi';
import { gameActivitiesApi } from './gameActivitiesApi';
import { disciplinaryReasonsApi } from './disciplinaryReasonsApi';
import { eventSquadsApi } from './eventSquadsApi';
import { gameFieldsApi } from './gameFieldsApi';
import { formationPositionsCoordinatesApi } from './formationPositionsCoordinatesApi';
import { planningEventApi } from './planningEventApi';
import { gameKitMatricesApi } from './gameKitMatricesApi';
import { officialsApi } from './officialsApi';
import { tvChannelsApi } from './tvChannelsApi';
import { competitionsApi } from './competitionsApi';
import { eventLocationsApi } from './eventLocationsApi';
import { notificationsRecipientsApi } from './notificationsRecipientsApi';

export default {
  middlewares: [
    athleteEventAPI.middleware,
    fixturesAPI.middleware,
    positionGroupsApi.middleware,
    organisationFormatsApi.middleware,
    formationsApi.middleware,
    participationLevelsApi.middleware,
    eventPeriodsApi.middleware,
    gameActivitiesApi.middleware,
    disciplinaryReasonsApi.middleware,
    eventSquadsApi.middleware,
    gameFieldsApi.middleware,
    formationPositionsCoordinatesApi.middleware,
    planningEventApi.middleware,
    gameKitMatricesApi.middleware,
    officialsApi.middleware,
    tvChannelsApi.middleware,
    competitionsApi.middleware,
    eventLocationsApi.middleware,
    notificationsRecipientsApi.middleware,
    notificationsApi.middleware,
  ],
  reducers: {
    athleteEventAPI: athleteEventAPI.reducer,
    fixturesAPI: fixturesAPI.reducer,
    positionGroupsApi: positionGroupsApi.reducer,
    organisationFormatsApi: organisationFormatsApi.reducer,
    formationsApi: formationsApi.reducer,
    participationLevelsApi: participationLevelsApi.reducer,
    eventPeriodsApi: eventPeriodsApi.reducer,
    gameActivitiesApi: gameActivitiesApi.reducer,
    disciplinaryReasonsApi: disciplinaryReasonsApi.reducer,
    eventSquadsApi: eventSquadsApi.reducer,
    gameFieldsApi: gameFieldsApi.reducer,
    formationPositionsCoordinatesApi: formationPositionsCoordinatesApi.reducer,
    planningEventApi: planningEventApi.reducer,
    gameKitMatricesApi: gameKitMatricesApi.reducer,
    officialsApi: officialsApi.reducer,
    tvChannelsApi: tvChannelsApi.reducer,
    competitionsApi: competitionsApi.reducer,
    eventLocationsApi: eventLocationsApi.reducer,
    notificationsRecipientsApi: notificationsRecipientsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
};
