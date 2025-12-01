// @flow

import type { ProductArea } from '@kitman/services/src/services/formTemplates/api/types';

const productArea1: ProductArea = {
  id: 1,
  key: 'pokémon',
  name: 'Pokémon',
};

const productArea2: ProductArea = {
  id: 2,
  key: 'trainer',
  name: 'Trainer',
};

export const productAreasMock = [productArea1, productArea2];
