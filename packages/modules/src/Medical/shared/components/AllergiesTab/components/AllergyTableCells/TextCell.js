// @flow
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';

const style = {
  cell: css`
    display: flex;
    align-content: start;
    justify-content: start;
    color: ${colors.grey_300};
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    background: ${colors.white};
    text-align: left;
  `,
};

type Props = {
  value: string,
};

const TextCell = (props: Props) => {
  return <div css={style.cell}>{props.value}</div>;
};

export default TextCell;
