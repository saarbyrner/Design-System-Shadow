// @flow

import type {
  FormCategory,
  FormCategories,
} from '@kitman/services/src/services/formTemplates/api/types';
import type { PaginationMeta } from '@kitman/services/src/services/humanInput/api/assignedForms/fetchAssignedForms';

export const formCategoryData: FormCategory = {
  id: 1,
  name: 'General Physio',
  key: 'general-physio',
  productArea: 'medical',
  productAreaId: 1,
  organisation_id: 1,
  created_by: {
    id: 1,
    firstname: 'Cathal',
    lastname: 'Diver',
    fullname: 'Cathal Diver',
  },
  created_at: '2022-12-05T09:40:59Z',
  updated_at: '2022-12-05T09:40:59Z',
  deleted: false,
};

export const formCategoriesData: FormCategories = [
  {
    id: 2,
    name: 'General Physio',
    key: 'general-physio',
    productArea: 'medical',
    productAreaId: 1,
    organisation_id: 1,
    created_by: {
      id: 1,
      firstname: 'Cathal',
      lastname: 'Diver',
      fullname: 'Cathal Diver',
    },
    created_at: '2022-12-05T09:40:59Z',
    updated_at: '2022-12-05T09:40:59Z',
    deleted: false,
  },
  {
    id: 3,
    name: 'Head Injury',
    key: 'head-injury',
    productArea: 'medical',
    productAreaId: 1,
    organisation_id: 1,
    created_by: {
      id: 1,
      firstname: 'Cathal',
      lastname: 'Diver',
      fullname: 'Cathal Diver',
    },
    created_at: '2023-12-05T09:40:59Z',
    updated_at: '2023-12-05T09:40:59Z',
    deleted: false,
  },
  {
    id: 4,
    name: 'Food Tracking',
    key: 'food-tracking',
    productArea: 'general',
    productAreaId: 1,
    organisation_id: 1,
    created_by: {
      id: 1,
      firstname: 'Cathal',
      lastname: 'Diver',
      fullname: 'Cathal Diver',
    },
    created_at: '2024-12-05T09:40:59Z',
    updated_at: '2024-12-05T09:40:59Z',
    deleted: false,
  },
];

export const paginatedFormCategoriesData: {
  data: FormCategories,
  pagination: PaginationMeta,
} = {
  data: formCategoriesData,
  pagination: {
    current_page: 1,
    next_page: 2,
    prev_page: null,
    total_pages: 2,
    total_count: 3,
  },
};
