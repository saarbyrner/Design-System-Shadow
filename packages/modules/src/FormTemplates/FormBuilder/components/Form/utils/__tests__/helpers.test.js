import {
  generateDefaultMenuGroupTitleByIndex,
  generateDefaultMenuItemTitleByIndex,
} from '../helpers';

describe('helpers', () => {
  describe('generateDefaultMenuGroupTitleByIndex', () => {
    it('should generate the right title for the menu group', () => {
      const index = 2;
      expect(generateDefaultMenuGroupTitleByIndex(index)).toBe(
        `Section ${index + 1}`
      );
    });
  });

  describe('generateDefaultMenuItemTitleByIndex', () => {
    it('should generate the right title for the menu group', () => {
      const menuGroupIndex = 2;
      const menuItemIndex = 2;
      expect(
        generateDefaultMenuItemTitleByIndex({ menuGroupIndex, menuItemIndex })
      ).toBe(`Sub-section ${menuGroupIndex + 1}.${menuItemIndex + 1}`);
    });
  });
});
