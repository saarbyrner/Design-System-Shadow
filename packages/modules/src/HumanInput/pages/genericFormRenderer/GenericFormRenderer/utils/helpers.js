// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const getDeleteFormAnswersSetConfirmationModalText = (
  isDeleteDraftAction: boolean
) => ({
  title: isDeleteDraftAction ? i18n.t('Delete draft') : i18n.t('Delete form'),
  content: isDeleteDraftAction
    ? i18n.t('Deleting this draft will erase all associated data.')
    : i18n.t(
        'Deleting this completed form will erase all associated data. You will not be able to recover it.'
      ),
  actions: {
    ctaButton: i18n.t('Delete'),
    cancelButton: i18n.t('Cancel'),
  },
});

export const getDeleteToastsText = (isDeleteDraftAction: boolean) => ({
  success: {
    title: i18n.t('Delete successful'),
    description: isDeleteDraftAction
      ? i18n.t('The draft has been deleted successfully.')
      : i18n.t('The form has been deleted successfully.'),
  },
  error: {
    title: i18n.t('Failed to delete. Please try again.'),
  },
});

export const alertUser = (e: Event) => {
  e.preventDefault();
};
