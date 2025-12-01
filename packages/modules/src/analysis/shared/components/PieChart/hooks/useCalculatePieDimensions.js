// @flow
import type { DefaultMarginType, PieSeriesType } from '../types';
import { INNER_RADIUS_RATIO, PAD_ANGLE, PIE_SERIES_TYPES } from '../constants';

type Props = {
  width: number,
  height: number,
  margin: DefaultMarginType,
  type: PieSeriesType,
};

const useCalculatePieDimensions = ({ width, height, margin, type }: Props) => {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;
  const innerRadius =
    type === PIE_SERIES_TYPES.donut ? radius * INNER_RADIUS_RATIO : 0; // controls the thickness of the donut
  const padAngle = type === PIE_SERIES_TYPES.donut ? PAD_ANGLE : 0;

  return {
    radius,
    innerRadius,
    centerX,
    centerY,
    padAngle,
  };
};

export default useCalculatePieDimensions;
