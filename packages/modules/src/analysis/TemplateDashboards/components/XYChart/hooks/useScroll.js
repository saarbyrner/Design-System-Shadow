// @flow
import { useState, useMemo } from 'react';
import type {
  ChartType,
  ChartOrientation,
} from '@kitman/modules/src/analysis/shared/types/charts';
import type { Scroll } from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import { HORIZONTAL_PX_PER_LABEL } from '../constants';

/**
 * Hook which stores the scroll state of the chart. It is designed to be
 * used at the root of the chart and then passed into the <ScrollControls />
 * as props. It returns 3 properties in an object
 *
 * @property {Scroll} scroll the scroll object containing if scroll isActive, and the start and end indeces
 * @property {Function} setScroll the function which sets the scroll object
 * @property {boolean} shouldScroll boolean which determines if there are too many bars in the chart and if it should scroll or not
 *
 * @param {number} numItems number of bars
 * @param {number} chartWidth width of the chart
 * @param {ChartType} chartType the chart type
 * @returns Object
 */

export default function useScroll(
  numItems: number,
  chartWidth: number,
  chartType: ChartType,
  orientation: ChartOrientation
): { shouldScroll: boolean, scroll: Scroll, setScroll: Function } {
  const shouldScroll = useMemo(() => {
    if (chartType === 'bar' || chartType === 'summary_stack') {
      if (orientation === 'horizontal') {
        return false;
      }

      const minWidth = numItems * HORIZONTAL_PX_PER_LABEL;

      return minWidth > chartWidth;
    }

    return false;
  }, [chartType, chartWidth, numItems, orientation]);

  const [scroll, setScroll] = useState<Scroll>({
    startIndex: 0,
    endIndex: Math.ceil(chartWidth / HORIZONTAL_PX_PER_LABEL),
    isActive: false,
  });

  return {
    shouldScroll,
    scroll,
    setScroll,
  };
}
