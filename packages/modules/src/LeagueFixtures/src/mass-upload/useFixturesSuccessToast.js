// @flow
import useToasts from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import { useEffect } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';

const useFixturesSuccessToast = () => {
  const { toasts, toastDispatch } = useToasts();

  const actionId = 'league-game-success-toast';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('action') !== actionId) {
      return;
    }

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

    params.delete('action');

    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${
      newSearch ? `?${newSearch}` : ''
    }`;
    window.history.replaceState({}, '', newUrl);
  }, [toastDispatch]);

  const toastDialog = (
    <ToastDialog
      toasts={toasts}
      onCloseToast={(id) => {
        toastDispatch({
          type: 'REMOVE_TOAST_BY_ID',
          id,
        });
      }}
    />
  );

  return {
    toastDialog,
  };
};

export default useFixturesSuccessToast;
