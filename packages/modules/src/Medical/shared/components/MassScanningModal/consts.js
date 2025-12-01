// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { toastStatusEnumLike as toastStatuses } from '@kitman/components/src/Toast/enum-likes';

export const confirmFileURLPrefix = '/medical/scanning';

export const headerHeight = 71;
export const thumbnailsContainerHeightAdjustment = 135;
export const documentDetailsWidth = 435;

export const TOAST_KEY = {
  UPLOAD_SCAN_PROGRESS_TOAST: 'UPLOAD_SCAN_PROGRESS_TOAST',
  UPLOAD_SCAN_ERROR_TOAST: 'UPLOAD_SCAN_ERROR_TOAST',
};

export const uploadScanErrorToast = () => ({
  id: TOAST_KEY.UPLOAD_SCAN_ERROR_TOAST,
  status: toastStatuses.Error,
  title: i18n.t('Unable to upload scan. Please review settings and try again.'),
});

export const uploadScanProgressToast = () => ({
  id: TOAST_KEY.UPLOAD_SCAN_PROGRESS_TOAST,
  status: toastStatuses.Loading,
  title: i18n.t('Preparing document.'),
});
