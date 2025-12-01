// @flow
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import { spin, loaderDash } from '../../../common/src/variables/animations';

type Props = {
  size: number,
  strokeWidth: number,
  color: string,
  styles?: {
    loadingSpinner?: SerializedStyles,
    svg?: SerializedStyles,
    path?: SerializedStyles,
  },
};

const LoadingSpinner = (props: Props) => {
  const styles = {
    svg: css`
      animation: ${spin} 2s linear infinite;
      width: ${props.size}px;
      height: ${props.size}px;
    `,
    path: css`
      stroke: ${props.color};
      stroke-linecap: round;
      animation: ${loaderDash} 1.5s ease-in-out infinite;
    `,
  };

  return (
    <span
      role="progressbar"
      css={[props.styles?.loadingSpinner]}
      data-testid="LoadingSpinner"
    >
      <svg css={[styles.svg, props.styles?.svg]} viewBox="0 0 50 50">
        <circle
          css={[styles.path, props.styles?.path]}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth={props.strokeWidth}
        />
      </svg>
    </span>
  );
};

LoadingSpinner.defaultProps = {
  size: 16,
  strokeWidth: 2,
  color: '#2A6EBB',
};

export default LoadingSpinner;
