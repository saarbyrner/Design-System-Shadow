// @flow
import { css } from '@emotion/react';

type Props = { value: number | string };

const styles = {
  container: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  value: css`
    font-size: 60px;
    font-weight: 600;
    line-height: 60px;
  `,
};

function Value(props: Props) {
  return (
    <div css={styles.container}>
      <div css={styles.value}>{props.value}</div>
    </div>
  );
}

export default Value;
