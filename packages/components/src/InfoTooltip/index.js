// @flow
import type { Node } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import Tippy from '@tippyjs/react';

type Props = {
  content?: Node,
  placement?: string,
  errorStyle?: boolean,
  delay?: number,
  onVisibleChange: Function,
  children?: Node,
};

const InfoTooltip = (props: Props) => {
  const style = {
    wrapper: css`
      background-color: ${props.errorStyle
        ? colors.red_100
        : colors.neutral_200};
      color: ${props.errorStyle ? colors.white : colors.grey_300};
      font-size: 12px;
      line-height: 20px;

      .tippy-content {
        max-width: 240px;
        padding: 2px 6px;
        overflow-wrap: break-word;
      }

      .tippy-arrow {
        display: none;
      }
    `,
  };

  return (
    <Tippy
      className="infoTooltip"
      placement={props.placement}
      content={props.content}
      delay={[props.delay ?? 200, 0]}
      onHide={() => props.onVisibleChange(false)}
      onShow={() => props.onVisibleChange(true)}
      css={style.wrapper}
      // z-index is 1 over the slidingPanel, which is 1 over than intercom frame
      zIndex={2147483005}
    >
      {props.children}
    </Tippy>
  );
};

InfoTooltip.defaultProps = {
  placement: 'bottom',
  onVisibleChange: () => {},
};

export default InfoTooltip;
