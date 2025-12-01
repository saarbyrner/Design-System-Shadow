// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const getDrawerTranslations = () => ({
  title: i18n.t('Assign Free Agents'),
  saveButton: i18n.t('Save'),
  athletes: i18n.t('Athletes'),
  searchFreeAgents: i18n.t('Search for a free agent...'),
  noAthletesFound: i18n.t('No athletes matching search'),
  updateAssignmentsErrorMessage: i18n.t(
    'Failed to update form assignments. Please try again'
  ),
  updateAssignmentsSuccessMessage: i18n.t(
    'Successfully updated form assignments'
  ),
  typeToSearch: i18n.t('Type at least 3 characters to search'),
});
