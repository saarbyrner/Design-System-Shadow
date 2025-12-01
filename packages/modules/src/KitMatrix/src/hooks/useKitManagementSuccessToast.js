// @flow
import useToasts from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import { useEffect } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';

const useKitManagementSuccessToast = () => {
  const { toasts, toastDispatch } = useToasts();
  const actionId = 'kit-management-success-toast';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldShowToast = params.get('action') === actionId;

    if (!shouldShowToast) return;

    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: actionId,
        status: 'INFO',
        title: i18n.t('Import in progress'),
        links: [
          {
            id: 1,
            text: i18n.t('Go to imports'),
            link: '/settings/imports',
          },
        ],
      },
    });

    // Clean up URL after showing the toast
    params.delete('action');
    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${
      newSearch ? `?${newSearch}` : ''
    }`;
    window.history.replaceState({}, '', newUrl);
  }, [toastDispatch]);

  const handleCloseToast = (id) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  return {
    toastDialog: (
      <ToastDialog toasts={toasts} onCloseToast={handleCloseToast} />
    ),
  };
};

export default useKitManagementSuccessToast;
