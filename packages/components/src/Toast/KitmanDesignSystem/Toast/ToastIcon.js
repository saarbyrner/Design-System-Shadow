// @flow
import { useMemo } from 'react';
import { css } from '@emotion/react';
import LoadingSpinner from '@kitman/components/src/LoadingSpinner';
import { useToastStatusContext } from '../contexts/ToastStatusContext';
import { iconByStatus, colorByStatus } from '../utils';

const ToastIcon = () => {
  const toastStatus = useToastStatusContext();
  const statusColor = colorByStatus[toastStatus];

  const style = {
    wrapper: css`
      display: flex;
      justify-content: center;
      i {
        color: ${statusColor};
        font-size: 18px;
        &.icon-tick-active {
          font-size: 23px;
        }
        &.icon-error-active {
          font-size: 20px;
        }
        &.icon-warning-active {
          font-size: 16px;
        }
      }
      span {
        margin: 0;
      }
    `,
  };

  const selectedIcon = useMemo(() => {
    if (toastStatus === 'LOADING') {
      return <LoadingSpinner size={18} />;
    }

    return <i className={iconByStatus[toastStatus]} />;
  }, [toastStatus]);

  return <div css={style.wrapper}>{selectedIcon}</div>;
};

export default ToastIcon;
