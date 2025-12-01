// @flow
import type { Node } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  description: css`
    color: ${colors.grey_200};
    grid-column: 2 / 4;
  `,
};

type Props = {
  children: Node,
};

const ToastDescription = (props: Props) => (
  <p css={style.description}>{props.children}</p>
);

export default ToastDescription;
