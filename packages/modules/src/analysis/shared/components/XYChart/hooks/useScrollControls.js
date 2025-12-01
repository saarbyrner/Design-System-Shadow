// @flow
import { useMemo } from 'react';
import { getChartFullCategoryDomain, getScaleType } from '../utils';

import useChartContext from './useChartContext';
import { AXIS_LABLE_MAX_WIDTH } from '../constants';

function useScrollControls() {
  const {
    parentSize,
    controls: { scroll },
    controlsApi: { setScroll },
    series,
  } = useChartContext();
  const numItems = getChartFullCategoryDomain(series).length;
  const minWidth = numItems * AXIS_LABLE_MAX_WIDTH.horizontal;

  const shouldHaveScrollBar = useMemo(() => {
    const scaleType = getScaleType(series);

    if (scaleType === 'time') {
      return false;
    }

    if (parentSize.width === null) {
      return false;
    }

    if (minWidth < parentSize.width) {
      return false;
    }

    return true;
  }, [minWidth, parentSize.width, series]);

  return {
    scroll,
    setScroll,
    metadata: { shouldHaveScrollBar, numItems },
  };
}

export default useScrollControls;
