// @flow
import { createApi } from '@reduxjs/toolkit/query/react';

import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getSquadAthletes } from '@kitman/services/src';
import getPermittedSquads, {
  type Squad,
} from '@kitman/services/src/services/getPermittedSquads';
import getCompetitions, {
  type Competitions,
} from '@kitman/services/src/services/getCompetitions';
import getTeams, { type Teams } from '@kitman/services/src/services/getTeams';
import getVenueTypes, {
  type VenueTypes,
} from '@kitman/services/src/services/getVenueTypes';
import getEventLocations, {
  type EventLocationFull,
} from '@kitman/services/src/services/planning/getEventLocations';
import getStaffUsers, {
  type StaffUserType,
} from '@kitman/services/src/services/medical/getStaffUsers';
import getSessionTypesList, {
  type SessionTypeNames,
} from '@kitman/services/src/services/getSessionTypesList';
import getPermissions, {
  type Permissions,
} from '@kitman/services/src/services/getPermissions';
import type { SquadAthletes } from '@kitman/components/src/Athletes/types';

export const calendarFiltersApi = createApi({
  reducerPath: 'calendarFiltersApi',
  endpoints: (builder) => ({
    getSquads: builder.query<Array<Squad>, void>({
      queryFn: serviceQueryFactory(getPermittedSquads),
    }),
    getSquadAthletes: builder.query<{ squads: SquadAthletes }, void>({
      queryFn: serviceQueryFactory(getSquadAthletes),
    }),
    getStaffUsers: builder.query<Array<StaffUserType>, void>({
      queryFn: serviceQueryFactory(getStaffUsers),
    }),
    getEventLocations: builder.query<Array<EventLocationFull>, void>({
      queryFn: serviceQueryFactory(getEventLocations),
    }),
    getVenueTypes: builder.query<VenueTypes, void>({
      queryFn: serviceQueryFactory(getVenueTypes),
    }),
    getCompetitions: builder.query<Competitions, void>({
      queryFn: serviceQueryFactory(getCompetitions),
    }),
    getOppositions: builder.query<Teams, void>({
      queryFn: serviceQueryFactory(getTeams),
    }),
    getPermissions: builder.query<Permissions, void>({
      queryFn: serviceQueryFactory(getPermissions),
    }),
    getSessionTypes: builder.query<SessionTypeNames, void>({
      queryFn: serviceQueryFactory(getSessionTypesList),
    }),
  }),
});

export const {
  useGetSquadsQuery,
  useGetCompetitionsQuery,
  useGetOppositionsQuery,
  useGetSquadAthletesQuery,
  useGetStaffUsersQuery,
  useGetEventLocationsQuery,
  useGetVenueTypesQuery,
  useGetPermissionsQuery,
  useGetSessionTypesQuery,
} = calendarFiltersApi;
