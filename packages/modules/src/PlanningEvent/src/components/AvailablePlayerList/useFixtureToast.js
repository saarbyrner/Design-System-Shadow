// @flow

import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import i18n from '@kitman/common/src/utils/i18n';
import type { ToastId } from '@kitman/components/src/types';

export const toastIds = {
  saved_line_up_template: 'saved_line_up_template',
  line_up_not_found: 'line_up_not_found',
  last_line_up_applied: 'last_line_up_applied',
  generic_error: 'generic_error',
  last_fixture_not_found: 'last_fixture_not_found',
  last_game_not_found: 'last_game_not_found',
  game_format_or_formation_not_supported:
    'game_format_or_formation_not_supported',
};

const useFixtureToast = () => {
  const { toasts, toastDispatch } = useToasts();

  const removeToastById = (toastId: ToastId) => {
    const timeout = setTimeout(() => {
      toastDispatch({
        type: 'REMOVE_TOAST_BY_ID',
        id: toastId,
      });

      clearTimeout(timeout);
    }, 3000);
  };

  const onCloseToast = (toastId: ToastId) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id: toastId,
    });
  };

  const showLineUpTemplateSavedToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.saved_line_up_template,
        title: i18n.t('Line-up template saved'),
        status: 'SUCCESS',
      },
    });
  };

  const showLineUpTemplateSavedErrorToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.saved_line_up_template,
        title: i18n.t('Save line-up template'),
        description: i18n.t(
          'Something went wrong while saving your line-up template'
        ),
        status: 'ERROR',
      },
    });
    removeToastById(toastIds.saved_line_up_template);
  };

  const showEmptyLineUpToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.line_up_not_found,
        title: i18n.t('No line up to copy from the last period'),
        status: 'INFO',
      },
    });
  };

  const showCopyLastLineUpSuccessToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.last_line_up_applied,
        title: i18n.t('Last line up copied with success.'),
        status: 'SUCCESS',
      },
    });
  };

  const showGenericErrorToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.generic_error,
        title: i18n.t('Something went wrong, try again!'),
        status: 'ERROR',
      },
    });
    removeToastById('generic_error');
  };

  const showLastFixtureNotFoundToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.last_fixture_not_found,
        title: i18n.t('Last fixture line up is empty.'),
        status: 'INFO',
      },
    });
    removeToastById('last_fixture_not_found');
  };

  const showCopyLastGameLineUpSuccessToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.last_line_up_applied,
        title: i18n.t('Last fixture line up copied with success.'),
        status: 'SUCCESS',
      },
    });
  };

  const showLastGameNotFoundToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.last_game_not_found,
        title: i18n.t('Last game not found.'),
        status: 'INFO',
      },
    });
  };

  const showUnsupportedConfigErrorToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.game_format_or_formation_not_supported,
        title: i18n.t('Line up game format and/or formation is not supported'),
        status: 'ERROR',
      },
    });
    removeToastById(toastIds.game_format_or_formation_not_supported);
  };

  const showAppliedSavedLineUpSuccessToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.last_line_up_applied,
        title: i18n.t('Line up applied with success.'),
        status: 'SUCCESS',
      },
    });
  };

  return {
    toasts,
    onCloseToast,
    showLineUpTemplateSavedToast,
    showLineUpTemplateSavedErrorToast,
    showEmptyLineUpToast,
    showCopyLastLineUpSuccessToast,
    showGenericErrorToast,
    showLastFixtureNotFoundToast,
    showCopyLastGameLineUpSuccessToast,
    showLastGameNotFoundToast,
    showUnsupportedConfigErrorToast,
    showAppliedSavedLineUpSuccessToast,
  };
};

export default useFixtureToast;
