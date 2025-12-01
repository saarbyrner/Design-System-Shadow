// @flow

import type {
  FormCategory,
  FormCategorySelect,
} from '@kitman/services/src/services/formTemplates/api/types';

const category1: FormCategory = {
  id: 1,
  key: 'pokémon',
  name: 'Pokémon',
  productArea: 'Pokémon',
  productAreaId: 1,
  organisation_id: 1,
  created_by: {
    id: 1,
    firstname: 'Ash',
    lastname: 'Ketchum',
    fullname: 'Ash Ketchum',
  },
  created_at: '2023-10-01T12:00:00Z',
  updated_at: '2023-10-01T12:00:00Z',
  deleted: false,
};

const category2: FormCategory = {
  id: 2,
  key: 'trainer',
  name: 'Trainer',
  productArea: 'Trainer',
  productAreaId: 2,
  organisation_id: 1,
  created_by: {
    id: 1,
    firstname: 'Ash',
    lastname: 'Ketchum',
    fullname: 'Ash Ketchum',
  },
  created_at: '2023-10-02T12:00:00Z',
  updated_at: '2023-10-02T12:00:00Z',
  deleted: false,
};

const category3: FormCategorySelect = {
  value: 'pokémon',
  label: 'Pokémon',
};

const category4: FormCategorySelect = {
  value: 'trainer',
  label: 'Trainer',
};

export const formCategoriesMock = [category1, category2];

export const formCategoriesSelectMock = [category3, category4];
