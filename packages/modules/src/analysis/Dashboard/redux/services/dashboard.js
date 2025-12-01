// @flow
import { createApi } from '@reduxjs/toolkit/query/react';

import {
  getSquads,
  getSessionTypes,
  getTerminologies,
  getActiveSquad as getPermittedSquad,
  getSquadAthletesById,
  getSquadAthletes,
  getPermittedSquads,
  getMetricVariables,
  getAreCoachingPrinciplesEnabled,
  getPermissions,
} from '@kitman/services';
import getDevelopmentGoalTypes from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalTypes';
import getPrinciples from '@kitman/modules/src/PlanningHub/src/services/getPrinciples';
import {
  type Principles,
  type PrincipleTypes,
  type PrincipleCategories,
  type PrinciplePhases,
} from '@kitman/common/src/types/Principles';
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getActivityTypes, {
  type ActivityType,
} from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import getActivityTypeCategories, {
  type ActivityTypeCategory,
} from '@kitman/services/src/services/getActivityTypeCategories';
import getDrillLabels, {
  type DrillLabel,
} from '@kitman/modules/src/PlanningHub/src/services/getDrillLabels';
import getPrincipleTypes from '@kitman/modules/src/PlanningHub/src/services/getTypes';
import getPhases from '@kitman/modules/src/PlanningHub/src/services/getPhases';
import getCategories from '@kitman/modules/src/PlanningHub/src/services/getCategories';
import getDashboards from '@kitman/services/src/services/getDashboards';
import {
  getLabel,
  getLabels,
} from '@kitman/services/src/services/analysis/labels';
import {
  getGroup,
  getGroups,
} from '@kitman/services/src/services/analysis/groups';
import { getFormations } from '@kitman/services/src/services/analysis/getFormations';
import {
  transformDataToPermissions,
  getPermissionsContextMappings,
} from '@kitman/common/src/contexts/PermissionsContext';
import { getMaturityEstimates } from '@kitman/services/src/services/analysis';
import { type TableWidgetParticipationOption } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME } from '@kitman/common/src/consts/analysis';

export type QueryData<T> = {
  data: ?T,
  isFetching: boolean,
  refetch: Function,
  error: Object,
};

export type ActivitySourceOptions = {
  principles: Principles,
  principleTypes: PrincipleTypes,
  principleCategories: PrincipleCategories,
  activityTypes: Array<ActivityType>,
  phases: PrinciplePhases,
  drillLabels: Array<DrillLabel>,
  activityTypeCategories: Array<ActivityTypeCategory>,
};

export type ParticipationTypeOptions = {
  games: Array<TableWidgetParticipationOption>,
  sessions: Array<TableWidgetParticipationOption>,
};

export type AvailabilityTypeOptions = Array<{
  status: string,
  label: string,
  children: Array<{
    status: string,
    label: string,
    children: Array<{
      status: string,
      label: string,
    }>,
  }>,
}>;

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  endpoints: (builder) => ({
    getSquads: builder.query({
      queryFn: serviceQueryFactory(getSquads),
    }),
    getActiveSquad: builder.query({
      queryFn: serviceQueryFactory(getPermittedSquad),
    }),
    getPermittedSquads: builder.query({
      queryFn: serviceQueryFactory(getPermittedSquads),
    }),
    getSessionTypes: builder.query({
      queryFn: serviceQueryFactory(getSessionTypes),
    }),
    getMetricVariables: builder.query({
      queryFn: serviceQueryFactory(async () => {
        const [benchmarkTestingVariables, metricVariables] = await Promise.all([
          window.getFlag(
            'rep-pac-analysis-dashboards-show-benchmark-testing-under-add-data'
          )
            ? getMetricVariables({ isBenchmarkTesting: true })
            : [],
          getMetricVariables(),
        ]);
        return [
          ...benchmarkTestingVariables.map((variable) => ({
            ...variable,
            source_name: BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
          })),
          ...metricVariables,
        ];
      }),
    }),
    getSquadDashboards: builder.query({
      queryFn: serviceQueryFactory(getDashboards),
    }),
    getDevelopmentGoalTypes: builder.query({
      async queryFn() {
        try {
          const developmentGoalTypes = await getDevelopmentGoalTypes();
          return { data: developmentGoalTypes };
        } catch (error) {
          return {
            error: {
              status: error?.status || -1,
              error: error?.statusText || 'Unknown',
            },
          };
        }
      },
    }),
    getPrinciples: builder.query({
      queryFn: serviceQueryFactory(getPrinciples),
    }),
    getActivitySourceOptions: builder.query({
      queryFn: serviceQueryFactory(async (areCoachingPrinciplesEnabled) => {
        if (areCoachingPrinciplesEnabled) {
          const [
            activityTypes,
            principles,
            phases,
            principleTypes,
            principleCategories,
            drillLabels,
            activityTypeCategories,
          ] = await Promise.all([
            getActivityTypes(),
            getPrinciples(),
            getPhases(),
            getPrincipleTypes(),
            getCategories(),
            getDrillLabels(),
            getActivityTypeCategories(),
          ]);
          return {
            activityTypes,
            principles,
            phases,
            principleTypes,
            principleCategories,
            drillLabels,
            activityTypeCategories,
          };
        }

        const activityTypes = await getActivityTypes();
        return {
          activityTypes,
        };
      }),
    }),
    getParticipationTypeOptions: builder.query({
      queryFn: serviceQueryFactory(async () => {
        const [games, sessions]: [
          Array<TableWidgetParticipationOption>,
          Array<TableWidgetParticipationOption>
        ] = await Promise.all([
          ajaxPromise({
            url: '/participation_levels?event_type=game_event',
            contentType: 'application/json',
            method: 'GET',
          }),
          ajaxPromise({
            url: '/participation_levels?event_type=session_event',
            contentType: 'application/json',
            method: 'GET',
          }),
        ]);

        return {
          games,
          sessions,
        };
      }),
    }),
    getAvailabilityTypeOptions: builder.query({
      queryFn: serviceQueryFactory((): Promise<AvailabilityTypeOptions> =>
        ajaxPromise({
          url: '/ui/availability_statuses',
          contentType: 'application/json',
          method: 'GET',
        })
      ),
    }),
    getTerminologies: builder.query({
      async queryFn() {
        try {
          const terminologies = await getTerminologies();
          return { data: terminologies };
        } catch (error) {
          return {
            error: {
              status: error?.status || -1,
              error: error?.statusText || 'Unknown',
            },
          };
        }
      },
    }),
    getCoachingPrinciplesIsEnabled: builder.query({
      queryFn: serviceQueryFactory(getAreCoachingPrinciplesEnabled),
    }),
    getSquadAthletesById: builder.query({
      async queryFn(id) {
        try {
          const squads = await getSquadAthletesById(id);

          return { data: squads };
        } catch (error) {
          return {
            error: {
              status: error?.status || -1,
              error: error?.statusText || 'Unknown',
            },
          };
        }
      },
    }),
    getPermissions: builder.query({
      queryFn: serviceQueryFactory((args = { returnOriginalData: false }) =>
        getPermissions().then((data) => {
          if (args.returnOriginalData) {
            return data;
          }
          return transformDataToPermissions(
            getPermissionsContextMappings(data)
          );
        })
      ),
    }),
    getAllSquadAthletes: builder.query({
      queryFn: serviceQueryFactory(getSquadAthletes),
    }),
    getAllLabels: builder.query({
      queryFn: serviceQueryFactory(getLabels),
    }),
    getAllGroups: builder.query({
      queryFn: serviceQueryFactory(getGroups),
    }),
    getLabelById: builder.query({
      queryFn: serviceQueryFactory(getLabel),
    }),
    getGroupById: builder.query({
      queryFn: serviceQueryFactory(getGroup),
    }),
    getFormations: builder.query({
      queryFn: serviceQueryFactory(getFormations),
    }),
    getMaturityEstimates: builder.query({
      queryFn: serviceQueryFactory(getMaturityEstimates),
    }),
  }),
});

export const {
  useGetPermittedSquadsQuery,
  useGetSquadDashboardsQuery,
  useGetSessionTypesQuery,
  useGetSquadsQuery,
  useGetDevelopmentGoalTypesQuery,
  useGetPrinciplesQuery,
  useGetActivitySourceOptionsQuery,
  useGetParticipationTypeOptionsQuery,
  useGetAvailabilityTypeOptionsQuery,
  useGetTerminologiesQuery,
  useGetCoachingPrinciplesIsEnabledQuery,
  useGetPermissionsQuery,
  useGetActiveSquadQuery,
  useGetSquadAthletesByIdQuery,
  useGetAllSquadAthletesQuery,
  useGetMetricVariablesQuery,
  useGetAllLabelsQuery,
  useGetAllGroupsQuery,
  useGetLabelByIdQuery,
  useGetGroupByIdQuery,
  useGetFormationsQuery,
  useGetMaturityEstimatesQuery,
} = dashboardApi;

export const useGetSquadAthletesQuery = () => {
  const activeSquadQuery = useGetActiveSquadQuery();
  const squadsQuery = useGetSquadAthletesByIdQuery(activeSquadQuery.data?.id, {
    skip: !activeSquadQuery.data?.id,
  });

  if (activeSquadQuery.isSuccess) {
    return squadsQuery;
  }

  return activeSquadQuery;
};
