// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const maxNumberOfFiles = 25;
export const maxFileSize = '70MB';
// 70MB in bytes
export const maxFileSizeInBytes = 73400320;
export const minCharactersToSearch = 3;

export const gridPageSize = 30;

export const emptyValueText = '-';

export const FILTERS_LOCAL_STORAGE_KEY = 'EFILE|FILTERS';

export const TOAST_KEY = {
  SEND_EFILE_SUCCESS_TOAST: 'SEND_EFILE_SUCCESS_TOAST',
  SEND_EFILE_ERROR_TOAST: 'SEND_EFILE_ERROR_TOAST',
  ARCHIVE_EFILE_SUCCESS_TOAST: 'ARCHIVE_EFILE_SUCCESS_TOAST',
  UNARCHIVE_EFILE_SUCCESS_TOAST: 'UNARCHIVE_EFILE_SUCCESS_TOAST',
  BULK_ARCHIVE_EFILE_SUCCESS_TOAST: 'BULK_ARCHIVE_EFILE_SUCCESS_TOAST',
  BULK_UNARCHIVE_EFILE_SUCCESS_TOAST: 'BULK_UNARCHIVE_EFILE_SUCCESS_TOAST',
  CREATE_CONTACT_SUCCESS_TOAST: 'CREATE_CONTACT_SUCCESS_TOAST',
  CREATE_CONTACT_ERROR_TOAST: 'CREATE_CONTACT_ERROR_TOAST',
  UPDATE_CONTACT_SUCCESS_TOAST: 'UPDATE_CONTACT_SUCCESS_TOAST',
  UPDATE_CONTACT_ERROR_TOAST: 'UPDATE_CONTACT_ERROR_TOAST',
  ARCHIVE_CONTACT_SUCCESS_TOAST: 'ARCHIVE_CONTACT_SUCCESS_TOAST',
  UNARCHIVE_CONTACT_SUCCESS_TOAST: 'UNARCHIVE_CONTACT_SUCCESS_TOAST',
  BULK_ARCHIVE_CONTACT_SUCCESS_TOAST: 'BULK_ARCHIVE_CONTACT_SUCCESS_TOAST',
  BULK_UNARCHIVE_CONTACT_SUCCESS_TOAST: 'BULK_UNARCHIVE_CONTACT_SUCCESS_TOAST',
};

export const ACTION_KEY = {
  BACK: 'BACK',
  MARK_AS_UNREAD: 'MARK_AS_UNREAD',
  TOGGLE_VIEWED: 'TOGGLE_VIEWED',
  TOGGLE_ARCHIVED: 'TOGGLE_ARCHIVED',
  PREV: 'PREV',
  NEXT: 'NEXT',
  UPDATE_CONTACT: 'UPDATE_CONTACT',
  TOGGLE_CONTACTS_ARCHIVED: 'TOGGLE_CONTACTS_ARCHIVED',
  DISABLED: 'DISABLED',
};

export const sendSuccessToast = () => ({
  id: TOAST_KEY.SEND_EFILE_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('eFile queued for sending'),
});

export const sendErrorToast = () => ({
  id: TOAST_KEY.SEND_EFILE_ERROR_TOAST,
  status: 'ERROR',
  title: i18n.t(
    'Unable to send eFile. Please review the errors and try again.'
  ),
});

export const archiveSuccessToast = () => ({
  id: TOAST_KEY.ARCHIVE_EFILE_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('eFile archived successfully'),
});

export const unarchiveSuccessToast = () => ({
  id: TOAST_KEY.UNARCHIVE_EFILE_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('eFile unarchived successfully'),
});

export const bulkArchiveSuccessToast = (count: number) => ({
  id: TOAST_KEY.BULK_ARCHIVE_EFILE_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('{{count}} eFiles archived successfully', { count }),
});

export const bulkUnarchiveSuccessToast = (count: number) => ({
  id: TOAST_KEY.BULK_ARCHIVE_EFILE_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('{{count}} eFiles unarchived successfully', { count }),
});

export const createContactSuccessToast = () => ({
  id: TOAST_KEY.CREATE_CONTACT_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('Contact created successfully'),
});

export const createContactErrorToast = () => ({
  id: TOAST_KEY.CREATE_CONTACT_ERROR_TOAST,
  status: 'ERROR',
  title: i18n.t(
    'Unable to create contact. Please review the errors and try again.'
  ),
});

export const updateContactSuccessToast = () => ({
  id: TOAST_KEY.UPDATE_CONTACT_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('Contact updated successfully'),
});

export const updateContactErrorToast = () => ({
  id: TOAST_KEY.UPDATE_CONTACT_ERROR_TOAST,
  status: 'ERROR',
  title: i18n.t(
    'Unable to update contact. Please review the errors and try again.'
  ),
});

export const archiveContactSuccessToast = () => ({
  id: TOAST_KEY.ARCHIVE_CONTACT_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('Contact archived successfully'),
});

export const unarchiveContactSuccessToast = () => ({
  id: TOAST_KEY.UNARCHIVE_CONTACT_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('Contact unarchived successfully'),
});

export const bulkArchiveContactsSuccessToast = (count: number) => ({
  id: TOAST_KEY.BULK_ARCHIVE_CONTACT_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('{{count}} contacts archived successfully', { count }),
});

export const bulkUnarchiveContactsSuccessToast = (count: number) => ({
  id: TOAST_KEY.BULK_ARCHIVE_CONTACT_SUCCESS_TOAST,
  status: 'SUCCESS',
  title: i18n.t('{{count}} contacts unarchived successfully', { count }),
});
