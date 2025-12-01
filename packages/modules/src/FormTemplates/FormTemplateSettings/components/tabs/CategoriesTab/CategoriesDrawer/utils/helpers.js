// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const getDrawerTranslations = () => ({
  createCategory: i18n.t('Create Category'),
  editCategory: i18n.t('Edit Category'),
  createButton: i18n.t('Create'),
  saveButton: i18n.t('Save'),
  productAreaName: i18n.t('Product area'),
  cancelButton: i18n.t('Cancel'),
  categoryName: i18n.t('Category name'),
  createdFormCategorySuccessMessage: i18n.t(
    'Successfully created form category'
  ),
  createFormCategoryErrorMessage: i18n.t(
    'Failed to create form category. Please try again'
  ),
  updatedFormCategorySuccessMessage: i18n.t(
    'Successfully updated form category'
  ),
  updateFormCategoryErrorMessage: i18n.t(
    'Failed to update form category. Please try again'
  ),
  maxCharacters100Message: i18n.t('100 character maximum.'),
});
