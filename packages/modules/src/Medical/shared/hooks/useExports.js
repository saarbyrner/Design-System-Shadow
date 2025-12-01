// @flow
import { useState } from 'react';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { ToastId, Toast } from '@kitman/components/src/Toast/types';
import i18n from '@kitman/common/src/utils/i18n';
import type { RequestStatus } from '@kitman/common/src/types';
import type { ExportsItem } from '@kitman/common/src/types/Exports';
import type { ExportFilter } from '../types';

const useExports = (filters: ExportFilter | null, isExportEnabled: boolean) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [isToastDisplayed, setIsToastDisplayed] = useState(false);

  const { toasts, toastDispatch } = useToasts();

  const exportFeedback = (id = 1) => ({
    id,
    status: isExportEnabled ? 'INFO' : 'ERROR',
    title: isExportEnabled ? i18n.t('Export in progress') : i18n.t('Error!'),
    description: isExportEnabled
      ? i18n.t('You can find the download link here:')
      : i18n.t(
          'Permission error, please contact your account admin or support to assign the correct permissions'
        ),
    ...(isExportEnabled &&
      window.featureFlags['export-page'] && {
        links: [
          {
            id,
            text: i18n.t('Exports'),
            link: window.featureFlags['side-nav-update']
              ? '/administration/exports'
              : '/settings/exports',
          },
        ],
      }),
  });

  const exportReports = (
    exportRequest: () => Promise<ExportsItem>,
    onSuccess?: (ExportsItem) => $Shape<Toast> | void,
    onError?: (any) => $Shape<Toast> | void
  ) => {
    setRequestStatus('PENDING');
    setIsToastDisplayed(true);

    toastDispatch({
      type: 'CREATE_TOAST',
      toast: exportFeedback(),
    });

    if (!isExportEnabled) {
      return;
    }

    exportRequest()
      .then((data) => {
        setRequestStatus('SUCCESS');
        let toastOverrides: $Shape<Toast> = {};

        if (typeof onSuccess === 'function') {
          toastOverrides = onSuccess(data) || {};
        }

        toastDispatch({
          type: 'UPDATE_TOAST',
          toast: {
            ...exportFeedback(),
            status: 'SUCCESS',
            title: i18n.t('Export successful'),
            ...toastOverrides,
          },
        });
      })
      .catch((error) => {
        setRequestStatus('FAILURE');
        let toastOverrides: $Shape<Toast> = {};

        if (typeof onError === 'function') {
          toastOverrides = onError(error) || {};
        }

        toastDispatch({
          type: 'UPDATE_TOAST',
          toast: {
            ...exportFeedback(),
            status: 'ERROR',
            title: i18n.t('Export failed'),
            description: i18n.t('Please try again'),
            ...toastOverrides,
          },
        });
      });
  };

  const closeToast = (id: ToastId) => {
    setIsToastDisplayed(false);
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  return {
    requestStatus,
    exportReports,
    toasts,
    isToastDisplayed,
    closeToast,
  };
};

export default useExports;
