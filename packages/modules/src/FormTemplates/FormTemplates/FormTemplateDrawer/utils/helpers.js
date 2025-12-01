// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const getDrawerTranslations = () => ({
  createTitle: i18n.t('Create Form'),
  editTitle: i18n.t('Edit Form'),
  createButton: i18n.t('Create'),
  cancelButton: i18n.t('Cancel'),
  saveButton: i18n.t('Save'),
  templateTitle: i18n.t('Template Title'),
  category: i18n.t('Category'),
  description: i18n.t('Description'),
  optional: i18n.t('Optional'),
  updatedFormTemplateMetadataSuccessMessage: i18n.t(
    'Successfully updated form template'
  ),
  updateFormTemplateMetadataErrorMessage: i18n.t(
    'Failed to update form template. Please try again'
  ),
  maxCharacters100Message: i18n.t('100 character maximum.'),
});
