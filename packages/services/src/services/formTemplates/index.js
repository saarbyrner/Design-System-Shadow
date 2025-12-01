// @flow
import { createApi } from '@reduxjs/toolkit/query/react';

import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import {
  getCategories,
  getProductAreas,
  searchFormTemplates,
  createFormTemplate,
  fetchFormTemplate,
  fetchFormAssignments,
  updateFormAssignments,
  updateFormTemplate,
  updateFormTemplateMetadata,
  deleteFormTemplate,
  getQuestionBanks,
  getFormHeaderDefaults,
  createFormCategory,
  deleteFormCategory,
  getFormCategory,
  listFormCategories,
  updateFormCategory,
  getUnassignedAthletes
} from './api';

export const reducerPath = 'formTemplatesApi';

const tagsEnumLike = {
  formTemplates: 'formTemplates',
  formAssignments: 'formAssignments',
  formCategories: 'formCategories',
  productAreas: 'ProductAreas',
};

export const formTemplatesApi = createApi({
  reducerPath,
  tagTypes: [
    tagsEnumLike.formTemplates,
    tagsEnumLike.formAssignments,
    tagsEnumLike.formCategories,
    tagsEnumLike.productAreas,
  ],
  endpoints: (builder) => ({
    searchFormTemplates: builder.query({
      queryFn: serviceQueryFactory((requestProps) =>
        searchFormTemplates(requestProps)
      ),
      providesTags: [tagsEnumLike.formTemplates],
    }),
    getCategories: builder.query({
      queryFn: serviceQueryFactory(getCategories),
      providesTags: [tagsEnumLike.productAreas],
    }),
    getProductAreas: builder.query({
      queryFn: serviceQueryFactory(getProductAreas),
      providesTags: [tagsEnumLike.productAreas],
    }),
    createFormTemplate: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        createFormTemplate(requestProps)
      ),
      invalidatesTags: [tagsEnumLike.formTemplates],
    }),
    getQuestionBanks: builder.query({
      queryFn: serviceQueryFactory(getQuestionBanks),
    }),
    getFormHeaderDefaults: builder.query({
      queryFn: serviceQueryFactory(getFormHeaderDefaults),
    }),
    fetchFormTemplate: builder.query({
      queryFn: serviceQueryFactory(fetchFormTemplate),
    }),
    fetchFormAssignments: builder.query({
      queryFn: serviceQueryFactory(fetchFormAssignments),
      providesTags: [tagsEnumLike.formAssignments],
    }),
    updateFormAssignments: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        updateFormAssignments(requestProps)
      ),
      invalidatesTags: [tagsEnumLike.formAssignments],
    }),
    updateFormTemplate: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        updateFormTemplate(requestProps)
      ),
      invalidatesTags: [tagsEnumLike.formTemplates],
    }),
    updateFormTemplateMetadata: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        updateFormTemplateMetadata(requestProps)
      ),
      invalidatesTags: [tagsEnumLike.formTemplates],
    }),
    deleteFormTemplate: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        deleteFormTemplate(requestProps)
      ),
      invalidatesTags: [tagsEnumLike.formTemplates],
    }),
    createFormCategory: builder.mutation({
      queryFn: serviceQueryFactory(createFormCategory),
      invalidatesTags: [tagsEnumLike.formCategories],
    }),
    deleteFormCategory: builder.mutation({
      queryFn: serviceQueryFactory(deleteFormCategory),
      invalidatesTags: [tagsEnumLike.formCategories],
    }),
    getFormCategory: builder.query({
      queryFn: serviceQueryFactory(getFormCategory),
    }),
    listFormCategories: builder.query({
      queryFn: serviceQueryFactory(listFormCategories),
      providesTags: [tagsEnumLike.formCategories],
    }),
    updateFormCategory: builder.mutation({
      queryFn: serviceQueryFactory(updateFormCategory),
      invalidatesTags: [tagsEnumLike.formCategories],
    }),
    getUnassignedAthletes: builder.query({
      queryFn: serviceQueryFactory(getUnassignedAthletes),
    }),
  }),
});

export const {
  useSearchFormTemplatesQuery,
  useGetCategoriesQuery,
  useGetProductAreasQuery,
  useCreateFormTemplateMutation,
  useGetQuestionBanksQuery,
  useGetFormHeaderDefaultsQuery,
  useFetchFormTemplateQuery,
  useFetchFormAssignmentsQuery,
  useUpdateFormAssignmentsMutation,
  useUpdateFormTemplateMutation,
  useUpdateFormTemplateMetadataMutation,
  useDeleteFormTemplateMutation,
  useCreateFormCategoryMutation,
  useDeleteFormCategoryMutation,
  useGetFormCategoryQuery,
  useListFormCategoriesQuery,
  useUpdateFormCategoryMutation,
  useGetUnassignedAthletesQuery,
} = formTemplatesApi;
