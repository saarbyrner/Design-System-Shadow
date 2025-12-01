// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { leagueOperationsApi } from './leagueOperations';
import fetchRegistrationRequirements from '../../services/fetchRegistrationRequirements';
import createRegistrationForm from '../../services/createRegistrationForm';
import saveRegistrationForm from '../../services/saveRegistrationForm';
import fetchRegistrationRequirementsProfileForm from '../../services/fetchRegistrationRequirementsProfileForm';
import updateRegistrationStatus from '../../services/updateRegistrationStatus';
import expireRegistration from '../../services/expireRegistration';
import convertNonRegistratedPlayerIntoRegistrated from '../../services/convertNonRegistratedPlayerIntoRegistrated';
import updateRegistrationProfileForm from '../../services/updateRegistrationProfileForm';
import { TAGS } from './utils';

export const registrationFormApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRegistrationRequirements: builder.query({
      queryFn: serviceQueryFactory(fetchRegistrationRequirements),
      providesTags: [TAGS.REGISTRATION_FORM],
    }),

    createRegistrationForm: builder.mutation({
      queryFn: serviceQueryFactory(createRegistrationForm),
      invalidatesTags: [
        TAGS.REGISTRATION_REQUIREMENTS_PROFILE_FORM,
        TAGS.REGISTRATION_PROFILE,
        TAGS.REGISTRATION_PROFILE_FORM,
      ],
    }),
    saveRegistrationForm: builder.mutation({
      queryFn: serviceQueryFactory(saveRegistrationForm),
      invalidatesTags: [
        TAGS.REGISTRATION_REQUIREMENTS_PROFILE_FORM,
        TAGS.REGISTRATION_PROFILE,
        TAGS.REGISTRATION_PROFILE_FORM,
        TAGS.REGISTRATION_FORM,
      ],
    }),
    fetchRegistrationRequirementsProfileForm: builder.query({
      queryFn: serviceQueryFactory(fetchRegistrationRequirementsProfileForm),
      providesTags: [TAGS.REGISTRATION_REQUIREMENTS_PROFILE_FORM],
    }),
    updateRegistrationStatus: builder.mutation({
      queryFn: serviceQueryFactory(updateRegistrationStatus),
      invalidatesTags: [
        TAGS.REQUIREMENT_SECTION,
        TAGS.REGISTRATION_PROFILE,
        TAGS.REQUIREMENTS,
      ],
    }),
    updateRegistrationProfileForm: builder.mutation({
      queryFn: serviceQueryFactory(updateRegistrationProfileForm),
      invalidatesTags: [
        TAGS.REGISTRATION_REQUIREMENTS_PROFILE_FORM,
        TAGS.REGISTRATION_PROFILE,
        TAGS.REGISTRATION_PROFILE_FORM,
      ],
    }),
    expireRegistration: builder.mutation({
      queryFn: serviceQueryFactory(expireRegistration),
    }),
    convertNonRegistratedPlayerIntoRegistrated: builder.mutation({
      queryFn: serviceQueryFactory(convertNonRegistratedPlayerIntoRegistrated),
    }),
  }),

  overrideExisting: false,
});

export const {
  useFetchRegistrationRequirementsQuery,
  useFetchRegistrationRequirementsProfileFormQuery,
  useLazyFetchRegistrationRequirementsProfileFormQuery,
  useCreateRegistrationFormMutation,
  useUpdateRegistrationStatusMutation,
  useSaveRegistrationFormMutation,
  useExpireRegistrationMutation,
  useConvertNonRegistratedPlayerIntoRegistratedMutation,
  useUpdateRegistrationProfileFormMutation,
} = registrationFormApi;
