// @flow
import { useMemo } from 'react';
import useChartContext from './useChartContext';
import {
  getChartFullCategoryDomain,
  getScaleType,
  getTimeDomain,
} from '../utils';

/**
 * This hook returns the scales to be used in the XY chart based on the supplied config and series
 * At present this only returns a single band xScale and a single yScale
 *
 *  In the future this should support
 *  - Orientation of axis and which one is category and which one is value axis
 *
 * @returns Object
 */
export default function useScales() {
  const {
    series,
    controls: { scroll },
  } = useChartContext();

  const categoryScale = useMemo(() => {
    const type = getScaleType(series);

    const getDomain = () => {
      if (type === 'time') {
        return getTimeDomain(series);
      }
      const fullDomain: Array<string> = getChartFullCategoryDomain(series);

      return scroll.isActive
        ? // $FlowIgnore(missing-annot) using slice with fullDomain throws this error even though it is annotated. Ignoring for now
          fullDomain.slice(scroll.startIndex, scroll.endIndex)
        : fullDomain;
    };

    return {
      type: 'band',
      domain: getDomain(),
      nice: true,
      padding: 0.7,
    };
  }, [series, scroll]);

  const valueScale = {
    type: 'linear',
    nice: true, // Extends the domain so that it starts and ends on nice round values.
  };

  return {
    xScale: categoryScale,
    yScale: valueScale,
  };
}
