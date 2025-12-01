// @flow
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';

const style = {
  header: css`
    display: flex;
    color: ${colors.grey_100};
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  `,
};

type Props = {
  value: string,
};

const TextHeader = (props: Props) => {
  return <div css={style.header}>{props.value}</div>;
};

export default TextHeader;
