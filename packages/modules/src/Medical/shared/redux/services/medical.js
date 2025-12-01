// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import {
  bulkUpdateNotes,
  getActiveSquad,
  getActivityGroups,
  getAnnotationAuthors,
  getAnnotationMedicalTypes,
  getAthleteIssues,
  getClinicalImpressionsBodyAreas,
  getConcussionFormTypes,
  getCovidAntibodyResultTypes,
  getCovidResultTypes,
  getDiagnosticReasons,
  getDiagnosticResultTypes,
  getDiagnosticStatuses,
  getDiagnosticTypes,
  getExaminerUsers,
  getGrades,
  getInjuryMechanisms,
  getInjuryStatuses,
  getMedicalAlerts,
  getMedicalAttachmentsEntityTypes,
  getMedicalLocations,
  getModificationAuthors,
  getNonMedicalAllergies,
  getOrderProviders,
  getPermittedSquads,
  getPositionGroups,
  getPresentationTypes,
  getProceduresFormData,
  getReopeningReasons,
  getReportColumns,
  getSides,
  getSquadAthletes,
  getSquads,
  getStaffUsers,
  getStockMedications,
  getTreatmentSessionOptions,
  resolveChronicIssue,
  getMedicalIssues,
  saveMedicalNote,
  saveBulkMedicalNotes,
  getAthleteRoster,
} from '@kitman/services';
import createIssueEvent from '@kitman/services/src/services/medical/createIssueEvent';
import getIssueContactTypes from '@kitman/services/src/services/medical/getIssueContactTypes';
import getFormTypes from '@kitman/services/src/services/humanInput/api/genericForms/fetchFormTypes';
import getPreliminarySchema from '@kitman/services/src/services/medical/getPreliminarySchema';

import {
  getMedicationProviders,
  getConditionalFieldsForm,
  getPastAthletes,
  getCoachesReportData,
  getMultipleCoachesNotes,
  getLastCoachesReportNote,
} from '@kitman/services/src/services/medical';

const awaitMedicalNoteSaved = async (_, { queryFulfilled }) => {
  await queryFulfilled;
};

const awaitBulkMedicalNotesSaved = async (_, { queryFulfilled }) => {
  await queryFulfilled;
};

export const TAGS = {
  ATHLETE_ROSTER: 'ATHLETE_ROSTER',
};

export const medicalApi = createApi({
  reducerPath: 'medicalApi',
  tagTypes: [TAGS.ATHLETE_ROSTER],
  endpoints: (builder) => ({
    getAnnotationMedicalTypes: builder.query({
      queryFn: serviceQueryFactory(getAnnotationMedicalTypes),
    }),
    getSquads: builder.query({
      queryFn: serviceQueryFactory(getSquads),
    }),
    getMedicalLocations: builder.query({
      queryFn: serviceQueryFactory(async (scope) => getMedicalLocations(scope)),
    }),
    getSquadAthletes: builder.query({
      queryFn: serviceQueryFactory(
        async ({
          athleteList = true,
          minimalAthleteListData = true,
          includePreviousOrganisationInformation = false,
          includeOrgTransferRecords = false,
        } = {}) =>
          getSquadAthletes({
            athleteList,
            minimalAthleteListData,
            includePreviousOrganisationInformation,
            includeOrgTransferRecords,
          })
      ),
    }),
    getAnnotationAuthors: builder.query({
      queryFn: serviceQueryFactory(getAnnotationAuthors),
    }),
    getModificationAuthors: builder.query({
      queryFn: serviceQueryFactory(async (scope) =>
        getModificationAuthors(scope)
      ),
    }),
    getCovidResultTypes: builder.query({
      queryFn: serviceQueryFactory(getCovidResultTypes),
    }),
    getCovidAntibodyResultTypes: builder.query({
      queryFn: serviceQueryFactory(getCovidAntibodyResultTypes),
    }),
    getDiagnosticTypes: builder.query({
      queryFn: serviceQueryFactory(getDiagnosticTypes),
    }),
    getDiagnosticResultTypes: builder.query({
      queryFn: serviceQueryFactory(getDiagnosticResultTypes),
    }),
    getDiagnosticReasons: builder.query({
      queryFn: serviceQueryFactory(getDiagnosticReasons),
    }),
    getDiagnosticStatuses: builder.query({
      queryFn: serviceQueryFactory(getDiagnosticStatuses),
    }),
    getOrderProviders: builder.query({
      queryFn: serviceQueryFactory(async (scope) => getOrderProviders(scope)),
    }),
    getStaffUsers: builder.query({
      queryFn: serviceQueryFactory(getStaffUsers),
    }),
    getStockMedications: builder.query({
      queryFn: serviceQueryFactory(getStockMedications),
    }),
    getExaminerUsers: builder.query({
      queryFn: serviceQueryFactory((group) => getExaminerUsers(group)),
    }),
    getConcussionFormTypes: builder.query({
      queryFn: serviceQueryFactory((filter) => getConcussionFormTypes(filter)),
    }),
    getTreatmentSessionOptions: builder.query({
      queryFn: serviceQueryFactory((athleteId) =>
        getTreatmentSessionOptions(athleteId)
      ),
    }),
    getClinicalImpressionsBodyAreas: builder.query({
      queryFn: serviceQueryFactory(getClinicalImpressionsBodyAreas),
    }),
    getAthleteIssues: builder.query({
      queryFn: serviceQueryFactory(getAthleteIssues),
    }),
    getSides: builder.query({
      queryFn: serviceQueryFactory(getSides),
    }),
    getActivityGroups: builder.query({
      queryFn: serviceQueryFactory(getActivityGroups),
    }),
    getPositionGroups: builder.query({
      queryFn: serviceQueryFactory(getPositionGroups),
    }),
    getBamicGrades: builder.query({
      queryFn: serviceQueryFactory(getGrades),
    }),
    getInjuryStatuses: builder.query({
      queryFn: serviceQueryFactory(getInjuryStatuses),
    }),
    getReopeningReasons: builder.query({
      queryFn: serviceQueryFactory(getReopeningReasons),
    }),
    getReportColumns: builder.query({
      queryFn: serviceQueryFactory(getReportColumns),
    }),
    getPresentationTypes: builder.query({
      queryFn: serviceQueryFactory(getPresentationTypes),
    }),
    getIssueContactTypes: builder.query({
      queryFn: serviceQueryFactory(getIssueContactTypes),
    }),
    getInjuryMechanisms: builder.query({
      queryFn: serviceQueryFactory(getInjuryMechanisms),
    }),
    getNonMedicalAllergies: builder.query({
      queryFn: serviceQueryFactory(getNonMedicalAllergies),
    }),
    getMedicalAlerts: builder.query({
      queryFn: serviceQueryFactory(getMedicalAlerts),
    }),
    getMedicalAttachmentsEntityTypes: builder.query({
      queryFn: serviceQueryFactory(getMedicalAttachmentsEntityTypes),
    }),
    getProceduresFormData: builder.query({
      queryFn: serviceQueryFactory(async (scope) =>
        getProceduresFormData(scope)
      ),
    }),
    getActiveSquad: builder.query({
      queryFn: serviceQueryFactory(getActiveSquad),
    }),
    getPermittedSquads: builder.query({
      queryFn: serviceQueryFactory(getPermittedSquads),
    }),
    getFormTypes: builder.query({
      queryFn: serviceQueryFactory(getFormTypes),
    }),
    getMedicationProviders: builder.query({
      queryFn: serviceQueryFactory(getMedicationProviders),
    }),
    bulkUpdateNotes: builder.query({
      queryFn: serviceQueryFactory((notes) => bulkUpdateNotes(notes)),
    }),
    resolveChronicIssue: builder.query({
      queryFn: serviceQueryFactory((params) => resolveChronicIssue(params)),
    }),
    getConditionalFieldsForm: builder.query({
      queryFn: serviceQueryFactory((args) => getConditionalFieldsForm(args)),
    }),
    getPastAthletes: builder.query({
      queryFn: serviceQueryFactory(getPastAthletes),
    }),
    getCoachesReportGrid: builder.query({
      queryFn: serviceQueryFactory(getCoachesReportData),
      keepUnusedDataFor: 0,
    }),
    getMedicalIssues: builder.query({
      queryFn: serviceQueryFactory(getMedicalIssues),
    }),
    getMultipleCoachesNotes: builder.query({
      queryFn: serviceQueryFactory(
        ({ athleteIds, organisationAnnotationTypes, annotationDate }) =>
          getMultipleCoachesNotes(
            athleteIds,
            organisationAnnotationTypes,
            annotationDate
          )
      ),
    }),
    getLastCoachesReportNote: builder.query({
      queryFn: serviceQueryFactory(
        ({ athleteId, organisationAnnotationTypes, beforeDate }) =>
          getLastCoachesReportNote(
            athleteId,
            organisationAnnotationTypes,
            beforeDate
          )
      ),
    }),
    saveMedicalNote: builder.mutation({
      queryFn: serviceQueryFactory(async (annotation) =>
        saveMedicalNote(annotation)
      ),
      onQueryStarted: awaitMedicalNoteSaved,
    }),
    saveBulkMedicalNotes: builder.mutation({
      queryFn: serviceQueryFactory(async (bulkPayload) =>
        saveBulkMedicalNotes(bulkPayload)
      ),
      onQueryStarted: awaitBulkMedicalNotesSaved,
    }),
    createIssueEvent: builder.mutation({
      queryFn: serviceQueryFactory(async (eventData) =>
        createIssueEvent(eventData)
      ),
    }),
    getAthleteRoster: builder.query({
      queryFn: serviceQueryFactory(({ nextId, filters }) =>
        getAthleteRoster(nextId, filters)
      ),
      keepUnusedDataFor: 180, // Seconds = 3 mins
      refetchOnMountOrArgChange: false,
      providesTags: [TAGS.ATHLETE_ROSTER],
      serializeQueryArgs: ({ queryArgs }) => {
        const { filters } = queryArgs;
        return JSON.stringify(filters);
      },
      // eslint-disable-next-line consistent-return
      merge: (currentCache, newData, { arg }) => {
        // Merge will only be called if the existing currentCacheData is not undefined
        const isPaginationFetch = arg.nextId != null;
        // RTK Query uses Immer internally, which allows direct mutation of the currentCache object within the merge function without causing issues
        // You may either mutate the currentCacheValue directly, or return a new value, but not both at once.
        if (newData?.rows && isPaginationFetch && currentCache?.rows) {
          currentCache.rows.push(...newData.rows);
          // eslint-disable-next-line no-param-reassign
          currentCache.next_id = newData.next_id; // Update the cursor for the next fetch
        } else if (newData?.rows) {
          // Immer wants either direct mutation or return a new value. Returning newData would be mixing approach, so need reassign
          return newData;
        }
      },
      forceRefetch({ currentArg, previousArg, state }) {
        // Stringify to match serializeQueryArgs but also for deep compare
        const currentFilters = JSON.stringify(currentArg.filters);
        const previousFilters = JSON.stringify(previousArg?.filters);

        const hasCachedData =
          state.medicalApi.queries[currentFilters]?.data?.rows != null; // Just check rows exist as Zero rows are possible

        // Scenario 1: A reload of first page
        if (currentArg.nextId === null && currentFilters === previousFilters) {
          return !hasCachedData; // Refetch if no cached data, otherwise don't
        }

        // Scenario 2: Filters or nextId have changed
        // We need to refetch if the arguments are different OR if the cache for the current arguments is empty (e.g., due to keepUnusedDataFor expiration)
        return currentArg !== previousArg || !hasCachedData;
      },
    }),
    getPreliminarySchema: builder.query({
      queryFn: serviceQueryFactory((args) => getPreliminarySchema(args)),
    }),
  }),
});

export const {
  useGetAnnotationMedicalTypesQuery,
  useGetConditionalFieldsFormQuery,
  useGetSquadsQuery,
  useGetMedicalLocationsQuery,
  useGetSquadAthletesQuery,
  useGetAnnotationAuthorsQuery,
  useGetModificationAuthorsQuery,
  useGetCovidResultTypesQuery,
  useGetCovidAntibodyResultTypesQuery,
  useGetOrderProvidersQuery,
  useGetDiagnosticTypesQuery,
  useGetDiagnosticResultTypesQuery,
  useGetDiagnosticReasonsQuery,
  useGetDiagnosticStatusesQuery,
  useGetStaffUsersQuery,
  useGetStockMedicationsQuery,
  useGetExaminerUsersQuery,
  useGetConcussionFormTypesQuery,
  useGetTreatmentSessionOptionsQuery,
  useGetAthleteIssuesQuery,
  useGetSidesQuery,
  useGetActivityGroupsQuery,
  useGetPositionGroupsQuery,
  useGetBamicGradesQuery,
  useGetInjuryStatusesQuery,
  useGetReopeningReasonsQuery,
  useGetReportColumnsQuery,
  useGetPresentationTypesQuery,
  useGetIssueContactTypesQuery,
  useGetInjuryMechanismsQuery,
  useGetNonMedicalAllergiesQuery,
  useGetMedicalAlertsQuery,
  useGetMedicalAttachmentsEntityTypesQuery,
  useGetProceduresFormDataQuery,
  useGetActiveSquadQuery,
  useGetClinicalImpressionsBodyAreasQuery,
  useGetPermittedSquadsQuery,
  useGetFormTypesQuery,
  useGetMedicationProvidersQuery,
  useBulkUpdateNotesQuery,
  useResolveChronicIssueQuery,
  useGetPastAthletesQuery,
  useGetCoachesReportGridQuery,
  useGetMedicalIssuesQuery,
  useGetMultipleCoachesNotesQuery,
  useGetLastCoachesReportNoteQuery,
  useSaveMedicalNoteMutation,
  useSaveBulkMedicalNotesMutation,
  useCreateIssueEventMutation,
  useGetAthleteRosterQuery,
  useGetPreliminarySchemaQuery,
} = medicalApi;
