// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const generateDefaultMenuGroupTitleByIndex = (
  menuGroupIndex: number
) => {
  const defaultMenuGroupTitle = `Section ${menuGroupIndex + 1}`;
  return (
    i18n.t('Section {{index}}', { index: menuGroupIndex + 1 }) ||
    defaultMenuGroupTitle
  );
};

export const generateDefaultMenuItemTitleByIndex = ({
  menuGroupIndex,
  menuItemIndex,
}: {
  menuGroupIndex: number,
  menuItemIndex: number,
}) => {
  const defaultMenuItemTitle = `Sub-section ${menuGroupIndex + 1}.${
    menuItemIndex + 1
  }`;
  return (
    i18n.t('Sub-section {{menuGroupIndex}}.{{menuItemIndex}}', {
      menuGroupIndex: menuGroupIndex + 1,
      menuItemIndex: menuItemIndex + 1,
    }) || defaultMenuItemTitle
  );
};

export const generateDefaultGroupLayoutElementTitleByIndex = ({
  elementIndex,
}: {
  elementIndex: number,
}) => {
  return i18n.t('Group {{elementIndex}}', {
    elementIndex: elementIndex + 1,
  });
};

export const generateDefaultContentLayoutElementTitleByIndex = ({
  elementIndex,
}: {
  elementIndex: number,
}) => {
  return i18n.t('Paragraph {{elementIndex}}', {
    elementIndex: elementIndex + 1,
  });
};
