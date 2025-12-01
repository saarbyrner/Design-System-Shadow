// @flow
import { useRef, useEffect } from 'react';
import type { Node } from 'react';
import { animations, colors, shadows } from '@kitman/common/src/variables';
import type { ToastId, ToastStatus } from '@kitman/components/src/types';
import { ToastStatusContextProvider } from '../contexts/ToastStatusContext';
import { colorByStatus, REMOVE_TOAST_DELAY } from '../utils';
import ToastIcon from './ToastIcon';
import ToastTitle from './ToastTitle';
import ToastDescription from './ToastDescription';
import ToastLinks from './ToastLinks';

type Props = {
  id: ToastId,
  status: ToastStatus,
  onClose: (id: ToastId) => void,
  children: Node,
};

const Toast = (props: Props) => {
  const toastTimer = useRef<TimeoutID | null>(null);
  const statusColor = colorByStatus[props.status];

  const style = {
    wrapper: {
      alignItems: 'flex-start',
      animation: `${animations.toastIn} 0.2s ease-out forwards`,
      backgroundColor: colors.white,
      borderRadius: '4px',
      borderLeft: `4px solid ${statusColor}`,
      boxShadow: shadows.elevation_1,
      columnGap: '16px',
      display: 'grid',
      gridTemplateColumns: '20px 284px 20px',
      padding: '20px',
      rowGap: '4px',
      maxWidth: '100%',
      width: '400px',
    },
  };

  const { status, id, onClose } = props;

  useEffect(() => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    // the toast is automatically closed after 5s when the status is not LOADING
    if (status !== 'LOADING') {
      toastTimer.current = setTimeout(() => {
        onClose(id);
      }, REMOVE_TOAST_DELAY);
    }

    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, [id, onClose, status]);

  return (
    <ToastStatusContextProvider status={props.status}>
      <div data-testid="Toast" css={style.wrapper}>
        {props.children}
      </div>
    </ToastStatusContextProvider>
  );
};

Toast.defaultProps = {
  status: 'INFO',
};

Toast.Icon = ToastIcon;
Toast.Title = ToastTitle;
Toast.Description = ToastDescription;
Toast.Links = ToastLinks;

export default Toast;
