// @flow
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

export type ToastItem = {
  text: string,
  subText?: string,
  status: 'ERROR' | 'SUCCESS' | 'PROGRESS',
  id: number | string,
};

type Props = {
  items: Array<?ToastItem>,
  onClickClose: Function,
  canCloseProgress?: boolean,
};

const Toast = (props: I18nProps<Props>) => {
  const renderToastItems = () => {
    return (
      props.items.length > 0 &&
      props.items.map(
        (item) =>
          item && (
            <div
              role="alert"
              aria-live="assertive"
              className={classNames('reactToast__item', {
                'reactToast__item--success': item.status === 'SUCCESS',
                'reactToast__item--error': item.status === 'ERROR',
                'reactToast__item--progress': item.status === 'PROGRESS',
              })}
              key={item.id}
            >
              {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
              <i
                role="button"
                className={classNames('reactToast__closeButton icon-close', {
                  'reactToast__closeButton--disabled':
                    item.status === 'PROGRESS' && !props.canCloseProgress,
                })}
                onClick={() =>
                  item.status === 'PROGRESS' && !props.canCloseProgress
                    ? {}
                    : props.onClickClose(item.id)
                }
              />
              <div className="reactToast__itemContent">
                <p className="reactToast__itemText">{item.text}</p>
                {item.subText && (
                  <p className="reactToast__itemSubText">{item.subText}</p>
                )}
              </div>
              <div className="reactToast__itemStatus">
                {item.status === 'SUCCESS' && (
                  <i className="icon-tick-active" />
                )}
                {item.status === 'ERROR' && <i className="icon-error" />}
                {item.status === 'PROGRESS' && (
                  <span>{props.t('In progress...')}</span>
                )}
              </div>
            </div>
          )
      )
    );
  };

  return <div className="reactToast">{renderToastItems()}</div>;
};

export const ToastTranslated = withNamespaces()(Toast);
export default Toast;
