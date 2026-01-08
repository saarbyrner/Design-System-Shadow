// @flow
import { TextButton } from '@kitman/components';
import { zIndices } from '@kitman/common/src/variables';

import type {
  Toast as ToastType,
  ToastId,
  ToastLink,
} from '@kitman/components/src/types';

import MuiToasts from '@kitman/playbook/components/Toasts';
import Toast from '../Toast';

type Props = {
  toasts: ToastType[],
  onCloseToast: (toastId: ToastId) => void,
  onClickToastLink?: (toastLink: ToastLink) => void,
};

const style = {
  wrapper: {
    alignItems: 'flex-end',
    bottom: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    justifyContent: 'flex-end',
    position: 'fixed',
    right: '24px',
    zIndex: zIndices.toastDialog,
  },
};

const ToastDialog = ({ toasts, onCloseToast, onClickToastLink }: Props) => {
  return window.featureFlags['mui-toasts'] ? (
    <MuiToasts
      toasts={toasts}
      onCloseToast={(toastId) => onCloseToast(toastId)}
      onClickToastLink={onClickToastLink}
    />
  ) : (
    <div css={style.wrapper}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          status={toast.status}
          onClose={onCloseToast}
        >
          <Toast.Icon />
          <Toast.Title>{toast.title}</Toast.Title>
          <TextButton
            iconBefore="icon-close"
            type="textOnly"
            onClick={() => onCloseToast(toast.id)}
          />
          {toast.description && (
            <Toast.Description>{toast.description}</Toast.Description>
          )}
          {toast.links && toast.links.length > 0 && (
            <Toast.Links
              onClickToastLink={onClickToastLink}
              links={toast.links}
            />
          )}
        </Toast>
      ))}
    </div>
  );
};

export default ToastDialog;
