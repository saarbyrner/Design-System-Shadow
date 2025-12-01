// @flow
import { useState } from 'react';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { ToastId, Toast } from '@kitman/components/src/Toast/types';
import i18n from '@kitman/common/src/utils/i18n';
import type { RequestStatus } from '@kitman/common/src/types';
import type { ImportsItem } from '@kitman/common/src/types/Imports';

const useImports = (isImportEnabled: boolean) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [isToastDisplayed, setIsToastDisplayed] = useState(false);

  const { toasts, toastDispatch } = useToasts();

  const importFeedback = (id = 1) => ({
    id,
    status: 'INFO',
    title: i18n.t('Import in progress'),
    description: i18n.t('You can find the download link here:'),
    ...(window.featureFlags['league-ops-mass-create-athlete-staff'] &&
      isImportEnabled && {
        links: [
          {
            id,
            text: i18n.t('Imports'),
            link: '/settings/imports',
          },
        ],
      }),
  });

  const importReports = (
    importRequest: () => Promise<ImportsItem>,
    onSuccess?: (ImportsItem) => $Shape<Toast> | void,
    onError?: (any) => $Shape<Toast> | void
  ) => {
    setRequestStatus('PENDING');
    setIsToastDisplayed(true);

    toastDispatch({
      type: 'CREATE_TOAST',
      toast: importFeedback(),
    });

    importRequest()
      .then((data) => {
        setRequestStatus('SUCCESS');
        let toastOverrides: $Shape<Toast> = {};

        if (typeof onSuccess === 'function') {
          toastOverrides = onSuccess(data) || {};
        }

        toastDispatch({
          type: 'UPDATE_TOAST',
          toast: {
            ...importFeedback(),
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
            ...importFeedback(),
            status: 'ERROR',
            title: i18n.t('Import failed'),
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
    importReports,
    toasts,
    isToastDisplayed,
    closeToast,
  };
};

export default useImports;
