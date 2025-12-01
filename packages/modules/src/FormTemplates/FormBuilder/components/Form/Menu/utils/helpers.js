// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type {
  ElementTypes,
  HumanInputFormElementConfig,
} from '@kitman/modules/src/HumanInput/types/forms';
import { LAYOUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';

export const getHeaderTranslations = () => ({
  title: i18n.t('Menu'),
  add: i18n.t('Add'),
  menuItem: i18n.t('Sub-section'),
  menuGroup: i18n.t('Section'),
  formHeader: i18n.t('Form Header'),
  duplicate: i18n.t('Duplicate'),
});

export const getDeleteMenuGroupModalText = () => ({
  title: i18n.t('Delete Section'),
  content: i18n.t(
    'All sub-sections, groups and questions within this section will be deleted along with the section.'
  ),
  actions: {
    ctaButton: i18n.t('Delete'),
    cancelButton: i18n.t('Cancel'),
  },
});

export const getDeleteMenuItemModalText = () => ({
  title: i18n.t('Delete Sub-section'),
  content: i18n.t(
    'All groups and questions within this sub-section will be deleted along with the sub-section.'
  ),
  actions: {
    ctaButton: i18n.t('Delete'),
    cancelButton: i18n.t('Cancel'),
  },
});

export const getDeleteLayoutGroupModalText = () => ({
  title: i18n.t('Delete Group'),
  content: i18n.t(
    'All questions within this group will be deleted along with the group.'
  ),
  actions: {
    ctaButton: i18n.t('Delete'),
    cancelButton: i18n.t('Cancel'),
  },
});

export const getElementTitle = (
  config: HumanInputFormElementConfig,
  elementType: ElementTypes
) => {
  if (config.title) {
    return config.title;
  }
  if (elementType === LAYOUT_ELEMENTS.Content) {
    return i18n.t('Paragraph');
  }
  if (elementType === LAYOUT_ELEMENTS.Group) {
    return i18n.t('Group');
  }
  if (config.text) {
    return config.text;
  }
  return i18n.t('Question');
};
