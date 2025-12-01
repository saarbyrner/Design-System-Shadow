// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import {
  getAthleteIssues,
  getDrugForms,
  getMedStrengthUnits,
  getMedicationListSources,
  getMedicalAttachmentCategories,
  getDocumentNoteCategories,
  getMedicalAttachmentsFileTypes,
  searchMedicalEntityAttachments,
  getAthleteData,
  saveAncillaryRange,
  getAncillaryEligibleRanges,
  getExercises,
  getExercisesById,
  getBodyAreasMultiCodingV2,
  getPathologiesMultiCodingV2,
  getPathologiesByIds,
} from '@kitman/services';
import searchPastAthletes from '@kitman/services/src/services/medical/searchPastAthletes';
import type { EligibleRanges } from '@kitman/services/src/services/medical/getAncillaryEligibleRanges';

const TAGS = {
  ATHLETES: 'ATHLETES',
  ANCILLARY_ELIGIBLE_RANGES: 'ANCILLARY_ELIGIBLE_RANGES',
};

// A smaller medical api where services are needed across routes
export const medicalSharedApi = createApi({
  reducerPath: 'medicalSharedApi',
  tagTypes: [TAGS.ATHLETES, TAGS.ANCILLARY_ELIGIBLE_RANGES],
  endpoints: (builder) => ({
    getAthleteIssues: builder.query({
      queryFn: serviceQueryFactory(getAthleteIssues),
    }),
    getDrugForms: builder.query({
      queryFn: serviceQueryFactory(getDrugForms),
    }),
    getMedStrengthUnits: builder.query({
      queryFn: serviceQueryFactory(getMedStrengthUnits),
    }),
    getMedicationListSources: builder.query({
      queryFn: serviceQueryFactory(getMedicationListSources),
    }),
    // TODO: rename the service once feature flag becomes default
    getDocumentNoteCategories: builder.query({
      queryFn: serviceQueryFactory(() =>
        window.featureFlags['medical-files-tab-enhancement']
          ? getMedicalAttachmentCategories()
          : getDocumentNoteCategories()
      ),
    }),
    getMedicalAttachmentsFileTypes: builder.query({
      queryFn: serviceQueryFactory(getMedicalAttachmentsFileTypes),
    }),
    searchMedicalEntityAttachments: builder.query({
      queryFn: serviceQueryFactory((args) =>
        searchMedicalEntityAttachments(args.filters, args.nextPageToken)
      ),
    }),
    getAthleteData: builder.query({
      queryFn: serviceQueryFactory((id) => getAthleteData(id)),
      providesTags: [TAGS.ATHLETES],
    }),
    getAncillaryEligibleRanges: builder.query<EligibleRanges, number>({
      queryFn: serviceQueryFactory((id) => getAncillaryEligibleRanges(id)),
      providesTags: [TAGS.ANCILLARY_ELIGIBLE_RANGES],
    }),
    saveAncillaryRange: builder.mutation({
      queryFn: serviceQueryFactory((args) => saveAncillaryRange(args)),
      invalidatesTags: [TAGS.ATHLETES, TAGS.ANCILLARY_ELIGIBLE_RANGES],
    }),
    searchPastAthletes: builder.query({
      queryFn: serviceQueryFactory(searchPastAthletes),
    }),
    getExercises: builder.query({
      queryFn: serviceQueryFactory((args) => getExercises(args)),
    }),
    getExercisesById: builder.query({
      queryFn: serviceQueryFactory((args) => getExercisesById(args)),
    }),
    getBodyAreasMultiCodingV2: builder.query({
      queryFn: serviceQueryFactory(getBodyAreasMultiCodingV2),
    }),
    getPathologiesMultiCodingV2: builder.query({
      queryFn: serviceQueryFactory((args) => getPathologiesMultiCodingV2(args)),
    }),
    getPathologiesByIds: builder.query({
      queryFn: serviceQueryFactory(getPathologiesByIds),
    }),
  }),
});

export const {
  useGetAncillaryEligibleRangesQuery,
  useGetAthleteDataQuery,
  useGetAthleteIssuesQuery,
  useGetDocumentNoteCategoriesQuery,
  useGetDrugFormsQuery,
  useGetMedicalAttachmentsFileTypesQuery,
  useGetMedicationListSourcesQuery,
  useGetMedStrengthUnitsQuery,
  useLazyGetAthleteDataQuery,
  useSaveAncillaryRangeMutation,
  useSearchMedicalEntityAttachmentsQuery,
  useSearchPastAthletesQuery,
  useLazyGetExercisesQuery,
  useGetExercisesByIdQuery,
  useGetBodyAreasMultiCodingV2Query,
  useGetPathologiesMultiCodingV2Query,
  useGetPathologiesByIdsQuery,
} = medicalSharedApi;
