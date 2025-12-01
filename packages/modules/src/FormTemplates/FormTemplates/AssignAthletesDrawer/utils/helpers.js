// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const getDrawerTranslations = () => ({
  title: i18n.t('Athletes'),
  saveButton: i18n.t('Save'),
  athletes: i18n.t('Athletes'),
  updateAssignmentsErrorMessage:
    'Failed to update form assignments. Please try again',
  updateAssignmentsSuccessMessage: 'Successfully updated form assignments',
});
