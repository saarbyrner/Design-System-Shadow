// @flow
import { colors } from '@kitman/common/src/variables';

import { css } from '@emotion/react';

const style = {
  header: css`
    display: flex;
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    background: ${colors.white};
  `,
};

type Props = {
  value: string,
};

const TextHeader = (props: Props) => {
  return (
    <div data-testid="TextHeader" css={style.header}>
      {props.value}
    </div>
  );
};

export default TextHeader;
