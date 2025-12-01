// @flow

import { Fragment } from 'react';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { zIndices } from '@kitman/common/src/variables';
import { Stack } from '@kitman/playbook/components';
import Toast from '@kitman/playbook/components/Toasts/Toast';

import type {
  Toast as ToastType,
  ToastId,
  ToastLink,
} from '@kitman/components/src/types';
import { TOAST_TYPE } from '@kitman/components/src/Toast/types';
import { MessageToastTranslated as MessageToast } from '@kitman/modules/src/Messaging/src/components/MessageToast';

type Props = {
  toasts: ToastType[],
  onCloseToast: (toastId: ToastId) => void,
  onClickToastLink?: (toastLink: ToastLink) => void,
};

const Toasts = ({ toasts, onCloseToast, onClickToastLink }: Props) => {
  const renderToast = (toast) => {
    switch (toast.type) {
      case TOAST_TYPE.MESSAGE:
        return <MessageToast toast={toast} onClose={onCloseToast} />;
      case TOAST_TYPE.DEFAULT:
      default:
        return (
          <Toast
            toast={toast}
            onClose={onCloseToast}
            onLinkClick={onClickToastLink}
          />
        );
    }
  };

  return (
    <Stack
      sx={{
        position: 'fixed',
        bottom: convertPixelsToREM(24),
        right: convertPixelsToREM(24),
        zIndex: zIndices.toastDialog,
      }}
      spacing={1.5}
    >
      {[...toasts]
        .slice()
        .reverse()
        .map((toast) => (
          <Fragment key={toast.id}>{renderToast(toast)}</Fragment>
        ))}
    </Stack>
  );
};

export default Toasts;
