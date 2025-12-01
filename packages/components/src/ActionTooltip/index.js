// @flow
import type { Node } from 'react';

import { useState } from 'react';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';
import TextButton from '../TextButton';

type ActionSettings = {
  text: string,
  onCallAction: Function,
  preventCloseOnActionClick?: boolean,
};
type Props = {
  placement?: string,
  content: Node,
  triggerElement: Node,
  triggerFullWidth?: boolean,
  scrollable?: boolean,
  actionSettings: ActionSettings,
  onVisibleChange: Function,
  onClickOutside?: Function,
  kitmanDesignSystem?: boolean,
};

const ActionTooltip = (props: Props) => {
  const [tooltipInstance, setTooltipInstance] = useState(null);

  return (
    <div
      className={classNames('actionTooltip', {
        'actionTooltip--kitmanDesignSystem': props.kitmanDesignSystem,
      })}
    >
      <Tippy
        placement={props.placement}
        trigger="click"
        content={
          <div
            className={classNames('actionTooltip__content', {
              'actionTooltip__content--scrollable': props.scrollable,
            })}
          >
            <div className="actionTooltip__body">{props.content}</div>
            <div
              className={classNames('actionTooltip__footer', {
                'actionTooltip__footer--scrollable': props.scrollable,
              })}
            >
              <TextButton
                text={props.actionSettings.text}
                onClick={() => {
                  if (
                    tooltipInstance &&
                    !props.actionSettings.preventCloseOnActionClick
                  ) {
                    tooltipInstance.hide();
                  }
                  props.actionSettings.onCallAction();
                }}
                type="primary"
                kitmanDesignSystem={props.kitmanDesignSystem}
              />
            </div>
          </div>
        }
        theme={
          props.kitmanDesignSystem
            ? 'neutral-tooltip--kitmanDesignSystem'
            : 'blue-border-tooltip'
        }
        interactive
        onCreate={setTooltipInstance}
        onHide={() => props.onVisibleChange(false)}
        onShow={() => props.onVisibleChange(true)}
        appendTo={document.body}
        // z-index is 1 over the slidingPanel, which is 1 over than intercom frame
        zIndex={2147483006}
        onClickOutside={props.onClickOutside}
      >
        <button
          className={classNames('actionTooltip__trigger', {
            'actionTooltip__trigger--fullWidth': props.triggerFullWidth,
          })}
          type="button"
        >
          {props.triggerElement}
        </button>
      </Tippy>
    </div>
  );
};

ActionTooltip.defaultProps = {
  placement: 'bottom-end',
  onVisibleChange: () => {},
  scrollable: false,
  kitmanDesignSystem: false,
};

export default ActionTooltip;
