/** @typedef {import("../types").TableCategory} TableCategory */

import { NEW_CATEGORY_ID_PREFIX } from '../consts';
import {
  findCategoriesToUpdateOrCreate,
  mapCategoriesToActiveAndArchived,
} from '../helpers';

describe('helpers', () => {
  /** @type {TableCategory} */
  const activeCategory1 = {
    id: '1',
    name: 'Category 1',
    created_at: '2021-12-07T12:41:45Z',
    updated_at: '2021-12-07T13:41:45Z',
    archived: false,
  };

  /** @type {TableCategory} */
  const activeCategory2 = {
    id: '2',
    name: 'Category 2',
    created_at: '2021-12-07T12:41:45Z',
    updated_at: '2021-12-07T13:41:45Z',
    archived: false,
  };

  describe('findCategoriesToUpdateOrCreate', () => {
    it('should find the new and edited categories', () => {
      const originalCategories = [activeCategory1, activeCategory2];
      const editedCategory2 = { ...activeCategory2, name: 'New Name' };
      const newCategory = {
        id: `${NEW_CATEGORY_ID_PREFIX}-1213`,
        name: 'Category 4',
      };

      const formData = [activeCategory1, editedCategory2, newCategory];

      expect(
        findCategoriesToUpdateOrCreate({ formData, originalCategories })
      ).toEqual({
        categoriesToCreate: [{ name: newCategory.name }],
        categoriesToUpdate: [editedCategory2],
      });
    });
  });

  describe('mapCategoriesToActiveAndArchived', () => {
    it('should return the archived and the active categories', () => {
      /** @type {TableCategory} */
      const archivedCategory = {
        id: '3',
        name: 'Category 3',
        created_at: '2021-12-07T12:41:45Z',
        updated_at: '2021-12-07T13:41:45Z',
        archived: true,
      };

      expect(
        mapCategoriesToActiveAndArchived([
          archivedCategory,
          activeCategory1,
          activeCategory2,
        ])
      ).toEqual({
        activeCategories: [activeCategory1, activeCategory2],
        archivedCategories: [archivedCategory],
      });
    });
  });
});
