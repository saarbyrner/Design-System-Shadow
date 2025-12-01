// @flow
import type { FormCategory } from '@kitman/services/src/services/formTemplates/api/types';

export const sortFormCategories = (
  a: FormCategory,
  b: FormCategory
): number => {
  const productAreaCompare = a.productArea.localeCompare(b.productArea);
  if (productAreaCompare !== 0) return productAreaCompare;

  if (a.deleted !== b.deleted) {
    return a.deleted ? 1 : -1;
  }

  return a.name.localeCompare(b.name);
};
