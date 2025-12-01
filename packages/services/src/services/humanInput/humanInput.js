// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import {
  fetchAthleteProfileForm,
  fetchIntegrationSettings,
  updateAthleteProfile,
  updateAthleteIntegrationSettings,
  exportAthleteProfile,
  fetchFormAnswersSet,
  updateFormAnswersSet,
  autosavePatchFormAnswersSet,
  bulkCreateFormAnswersSet,
  deleteFormAnswersSet,
  createFormAnswersSet,
  fetchFormTypes,
  fetchAssignedForms,
  fetchGuardians,
  createGuardian,
  updateGuardian,
  deleteGuardian,
} from '@kitman/services/src/services/humanInput/api';

import { getFormDataSourceItems, getSquadAthletes } from '@kitman/services';
import resetAthletePassword from './api/athleteProfile/resetAthletePassword';

const TAGS = {
  FORMS: 'FORMS',
  THIRD_PARTY_SETTINGS: 'THIRD_PARTY_SETTINGS',
  ASSIGNED_FORMS: 'ASSIGNED_FORMS',
  FORM_ANSWERS_SET: 'FORM_ANSWERS_SET',
  GUARDIANS: 'GUARDIANS',
};
export const humanInputApi = createApi({
  reducerPath: 'humanInputApi',
  tagTypes: Object.keys(TAGS),
  endpoints: (builder) => ({
    getFormDataSourceItems: builder.query({
      queryFn: serviceQueryFactory((type) => getFormDataSourceItems(type)),
    }),
    // athlete profile
    fetchAthleteProfileForm: builder.query({
      queryFn: serviceQueryFactory((athleteId) =>
        fetchAthleteProfileForm(athleteId)
      ),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    fetchIntegrationSettings: builder.query({
      queryFn: serviceQueryFactory((athleteId) =>
        fetchIntegrationSettings(athleteId)
      ),
      providesTags: [TAGS.THIRD_PARTY_SETTINGS],
    }),
    updateAthleteProfile: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        updateAthleteProfile(requestProps)
      ),
    }),
    updateAthleteIntegrationSettings: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        updateAthleteIntegrationSettings(requestProps)
      ),
      invalidatesTags: [TAGS.THIRD_PARTY_SETTINGS],
    }),
    exportAthleteProfile: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        exportAthleteProfile(requestProps)
      ),
    }),
    resetAthletePassword: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        resetAthletePassword(requestProps)
      ),
    }),
    // generic forms
    fetchFormAnswersSet: builder.query({
      queryFn: serviceQueryFactory(fetchFormAnswersSet),
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: [TAGS.FORM_ANSWERS_SET],
    }),
    updateFormAnswersSet: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        updateFormAnswersSet(requestProps)
      ),
      invalidatesTags: [TAGS.ASSIGNED_FORMS, TAGS.FORM_ANSWERS_SET],
    }),
    bulkCreateFormAnswersSet: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        bulkCreateFormAnswersSet(requestProps)
      ),
      invalidatesTags: [TAGS.ASSIGNED_FORMS, TAGS.FORM_ANSWERS_SET],
    }),
    autosavePatchFormAnswersSet: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        autosavePatchFormAnswersSet(requestProps)
      ),
      invalidatesTags: [TAGS.ASSIGNED_FORMS],
    }),
    autosaveBulkCreateFormAnswersSet: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        bulkCreateFormAnswersSet(requestProps)
      ),
      invalidatesTags: [TAGS.ASSIGNED_FORMS],
    }),
    createFormAnswersSet: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        createFormAnswersSet(requestProps)
      ),
    }),
    deleteFormAnswersSet: builder.mutation({
      queryFn: serviceQueryFactory(deleteFormAnswersSet),
      invalidatesTags: [TAGS.ASSIGNED_FORMS],
    }),
    fetchFormTypes: builder.query({
      queryFn: serviceQueryFactory((filters) => fetchFormTypes(filters)),
    }),
    // assigned forms
    fetchAssignedForms: builder.query({
      queryFn: serviceQueryFactory((requestProps) =>
        fetchAssignedForms(requestProps)
      ),
      providesTags: [TAGS.ASSIGNED_FORMS],
    }),
    getAllSquadAthletes: builder.query({
      queryFn: serviceQueryFactory(getSquadAthletes),
    }),
    // guardians
    fetchGuardians: builder.query({
      queryFn: serviceQueryFactory((athleteId) => fetchGuardians(athleteId)),
      providesTags: [TAGS.GUARDIANS],
    }),
    createGuardian: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        createGuardian(requestProps)
      ),
      invalidatesTags: [TAGS.GUARDIANS],
    }),
    updateGuardian: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        updateGuardian(requestProps)
      ),
      invalidatesTags: [TAGS.GUARDIANS],
    }),
    deleteGuardian: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        deleteGuardian(requestProps)
      ),
      invalidatesTags: [TAGS.GUARDIANS],
    }),
  }),
});

export const {
  useFetchFormDetailsQuery,
  useFetchFormResultQuery,
  useGetFormDataSourceItemsQuery,
  useFetchAthleteProfileFormQuery,
  useUpdateAthleteProfileQuery,
  useExportAthleteProfileMutation,
  useResetAthletePasswordMutation,
  useFetchFormAnswersSetQuery,
  useUpdateFormAnswersSetMutation,
  useBulkCreateFormAnswersSetMutation,
  useAutosaveBulkCreateFormAnswersSetMutation,
  useAutosavePatchFormAnswersSetMutation,
  useDeleteFormAnswersSetMutation,
  useCreateFormAnswersSetMutation,
  useFetchIntegrationSettingsQuery,
  useUpdateAthleteIntegrationSettingsMutation,
  useFetchFormTypesQuery,
  useFetchAssignedFormsQuery,
  useGetAllSquadAthletesQuery,
  useFetchGuardiansQuery,
  useCreateGuardianMutation,
  useUpdateGuardianMutation,
  useDeleteGuardianMutation,
} = humanInputApi;
