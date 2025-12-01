// @flow
import { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { PIE_SERIES_TYPES, getOtherSegementLabel } from './constants';

import type { PieDatumProps, PieSeriesType, ValueAccessor } from './types';

type Quadrant = 0 | 1 | 2 | 3 | 4;
type HorizontalPosition = 1 | -1;
type VerticalPosition = 1 | -1;
type DisplacementCoordinates = {
  dx: number,
  dy: number,
};
type Transition = {
  startAngle: number,
  endAngle: number,
  opacity: number,
};

/**
 * Returns the quadrant of the pie chart,
 *
 * assuming is it sliced into 4 quaters
 *
 * @param {PieArcDatum<PieDatumProps>} arc the arc/segemnet of the pie chart
 * @returns number value of the quadrant
 */
export const getQuadrant = (arc: PieArcDatum<PieDatumProps>): Quadrant => {
  const midAngle = arc.startAngle + (arc.endAngle - arc.startAngle) / 2;

  if (midAngle < Math.PI * 0.5) {
    return 1;
  }

  if (midAngle < Math.PI) {
    return 2;
  }

  if (midAngle < Math.PI * 1.5) {
    return 3;
  }

  if (midAngle < Math.PI * 2) {
    return 4;
  }

  return 0;
};

/**
 * Defines the state for for pie chart arcs leaving
 *
 * @param {PieArcDatum<PieDatumProps>} arc the arc/segemnet of the pie chart, specifically the end angle
 * @returns Transition an object with the startAngle, endAngle, opacity
 */
export const fromLeaveTransition = ({
  endAngle,
}: PieArcDatum<PieDatumProps>): Transition => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});

/**
 * Defines the state for pie chart arcs entering / updating
 *
 * @param {Array<PieArcDatum<PieDatumProps>} arc the arc/segemnet of the pie chart
 * @returns Transition an object with the startAngle, endAngle, opacity
 */
export const enterUpdateTransition = ({
  startAngle,
  endAngle,
}: PieArcDatum<PieDatumProps>): Transition => ({
  startAngle,
  endAngle,
  opacity: 1,
});

/**
 * Returns the displacement offset values, x and y, for the label annotations
 *
 * @param {HorizontalPosition} horizontalPosition relates to the right side (1) or left side (-1) of the pie
 * @param {VerticalPosition} verticalPosition relates to the top (1) or bottom (-1) of the pie
 * @param {PieSeriesType} type type of visualisation
 * @returns object with the dx, dy coordinates
 */
export const getLabelDisplacementCoordinates = (
  horizontalPosition: HorizontalPosition,
  verticalPosition: VerticalPosition,
  type: PieSeriesType
): DisplacementCoordinates => {
  if (type === PIE_SERIES_TYPES.pie) {
    return {
      dx: 75 * horizontalPosition,
      dy: -85 * verticalPosition,
    };
  }

  return {
    dx: 60 * horizontalPosition,
    dy: -50 * verticalPosition,
  };
};

/**
 * Returns the percentage value of the arc related to the rest of the pie
 *
 * @param {PieArcDatum<PieDatumProps>} arc the arc/segemnet of the pie chart
 * @param {Array<PieArcDatum<PieDatumProps>} arcs array of arc/segemnet of the pie chart
 * @returns string percentage value for the arc
 */
export const getPercentageValueFromArc = (
  arc: PieArcDatum<PieDatumProps>,
  arcs: Array<PieArcDatum<PieDatumProps>>
): string => {
  return (
    (arc.value / arcs.reduce((total, arcDatum) => total + arcDatum.value, 0)) *
    100
  ).toFixed(0);
};

/**
 * Function that handles sorting the pie segments
 * Segments should be sorted high to low, except for the Other Categories segment,
 * which always renders as the last segment.
 *
 * @param {PieDatumProps} a item to be sorted
 * @param {PieDatumProps} b item to be sorted
 * @returns number
 */
export const handlePieSort = (a: PieDatumProps, b: PieDatumProps): number => {
  const otherLabel = getOtherSegementLabel();
  if (a.label === otherLabel && b.label !== otherLabel) {
    return 1;
  }

  if (b.label === otherLabel && a.label !== otherLabel) {
    return -1;
  }

  if (a.value === null) {
    return 1;
  }

  if (b.value === null) {
    return -1;
  }
  return parseFloat(b.value) - parseFloat(a.value);
};

/**
 * Returns the percentage value of the data item related to the rest of the data
 *
 * @param {PieArcDatum<PieDatumProps>} arc the arc/segemnet of the pie chart
 * @param {ValueAccessor} valueAccessor function that returns the value for the data
 * @param {Array<PieArcDatum<PieDatumProps>} arcs array of arc/segemnet of the pie chart
 * @returns string percentage value for the arc
 */
export const getPercentageValueFromData = (
  item: PieDatumProps,
  valueAccessor: ValueAccessor,
  data: Array<PieDatumProps>
): string => {
  const value = valueAccessor(item);
  return (
    (parseFloat(value) /
      data.reduce(
        (total, dataItem) => total + parseFloat(valueAccessor(dataItem)),
        0
      )) *
    100
  ).toFixed(0);
};
