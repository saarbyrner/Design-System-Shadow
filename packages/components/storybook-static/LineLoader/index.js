// @flow
import { css } from '@emotion/react';
import { colors, animations } from '@kitman/common/src/variables';

type Direction = 'right' | 'left';

type Props = {
  direction: Direction,
};

const LineLoader = (props: Props) => {
  const moveXAnimation =
    props.direction === 'right'
      ? animations.inLeftMoveX
      : animations.inRightMoveX;

  const styles = {
    loader: css`
      height: 4px;
      position: relative;
      width: 100%;

      div {
        animation: ${moveXAnimation} 2s linear infinite forwards;
        background: ${colors.neutral_300};
        height: 100%;
        position: absolute;
        width: 100%;
        will-change: transform;
      }
    `,
  };

  return (
    <div css={styles.loader} role="progressbar">
      <div />
    </div>
  );
};

LineLoader.defaultProps = {
  direction: 'right',
};

export default LineLoader;
