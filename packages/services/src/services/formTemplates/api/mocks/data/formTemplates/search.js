// @flow
import { getObjectWithKeysInSnakeCase } from '@kitman/common/src/utils/objectKeysTransformers';

import type { FormTemplate } from '@kitman/services/src/services/formTemplates/api/types';

const formTemplate1: FormTemplate = {
  id: 123,
  name: 'Pikachu Treating',
  version: 1,
  formCategory: {
    id: 1,
    name: 'Good',
    productArea: 'Medical',
    productAreaId: 1,
  },
  category: 'medical',
  editor: {
    id: 123,
    name: 'Ash Ketchum',
  },
  createdAt: '2022-05-11T15:49:27Z',
  updatedAt: '2022-05-12T15:49:27Z',
  fullname: '',
};

const formTemplate2: FormTemplate = {
  id: 124,
  name: 'Pikachu Harming',
  version: 4,
  formCategory: {
    id: 2,
    name: 'Evil',
    productArea: 'Pokemon',
    productAreaId: 1,
  },
  category: 'evil',
  editor: {
    id: 123,
    name: 'Gary',
  },
  createdAt: '2022-05-13T15:49:27Z',
  updatedAt: '2022-05-15T15:49:27Z',
  fullname: '',
};

const formTemplateMocks = [formTemplate1, formTemplate2];

const formTemplateMocksSnakeCase = [
  getObjectWithKeysInSnakeCase(formTemplate1),
  getObjectWithKeysInSnakeCase(formTemplate2),
];

export { formTemplateMocks, formTemplateMocksSnakeCase };
