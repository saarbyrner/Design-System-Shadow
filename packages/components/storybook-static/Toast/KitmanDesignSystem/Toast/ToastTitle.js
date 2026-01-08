// @flow
import type { Node } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  title: css`
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 16px;
  `,
};

type Props = {
  children: Node,
};

const ToastTitle = (props: Props) => (
  <h6 css={style.title}>{props.children}</h6>
);

export default ToastTitle;
