// @flow
import { css } from '@emotion/react';
import colors from '@kitman/common/src/variables/colors';
import type { Node } from 'react';

type Props = {
  radius: number, // this is used to scale height/width as well as font-size
  strokeWidth: number,
  progress: number,
  progressColour: string,
  showProgressIndicator?: boolean,
};

const UploadProgress = (props: Props) => {
  const normalizedRadius: number = props.radius - props.strokeWidth * 2;
  const circumference: number = normalizedRadius * 2 * Math.PI;
  const normalizedProgress: number =
    props.progress > 100 ? 100 : props.progress; // preventing progress going above 100
  const progress: number =
    circumference - (normalizedProgress / 100) * circumference;

  const styles = {
    container: css`
      height: ${props.radius * 2}px;
      width: ${props.radius * 2}px;
      position: relative;
    `,
    circle: css`
      stroke-dasharray: ${circumference} ${circumference};
      stroke-dashoffset: ${progress};
      transition: stroke-dashoffset 0.5s;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    `,
    progressIndicator: css`
      position: absolute;
      display: flex;
      height: ${props.radius * 2}px;
      width: ${props.radius * 2}px;
      justify-content: center;
      align-items: center;
      font-size: ${props.radius / 2}px;
      font-weight: 600;
      color: ${props.progressColour};
    `,
  };

  const renderProgressIndicator = (): Node | null => {
    if (props.showProgressIndicator) {
      return (
        <span css={styles.progressIndicator}>{`${normalizedProgress}%`}</span>
      );
    }
    return null;
  };

  return (
    <div css={styles.container} data-testid="UploadProgress">
      {renderProgressIndicator()}
      <svg
        height={props.radius * 2}
        width={props.radius * 2}
        data-testid="UploadProgress|Progress"
      >
        <circle
          strokeWidth={props.strokeWidth}
          fill="transparent"
          stroke={colors.grey_disabled}
          r={normalizedRadius}
          cx={props.radius}
          cy={props.radius}
        />
        <circle
          css={styles.circle}
          strokeWidth={props.strokeWidth}
          fill="transparent"
          stroke={props.progressColour}
          r={normalizedRadius}
          cx={props.radius}
          cy={props.radius}
        />
      </svg>
    </div>
  );
};

UploadProgress.defaultProps = {
  radius: 20,
  strokeWidth: 2,
  progressColour: colors.grey_200,
};

export default UploadProgress;
