// @flow

import useChartContext from '../hooks/useChartContext';
import useScrollControls from '../hooks/useScrollControls';
import { AXIS_LABLE_MAX_WIDTH } from '../constants';
import ScrollControls from './ScrollControls';

function ScrollBar() {
  const { parentSize } = useChartContext();
  const {
    scroll,
    setScroll,
    metadata: { numItems, shouldHaveScrollBar },
  } = useScrollControls();

  if (!shouldHaveScrollBar || parentSize.width === null) {
    return null;
  }

  return (
    <ScrollControls
      numItems={numItems}
      width={parentSize.width}
      scroll={scroll}
      setScroll={setScroll}
      maxLabelWidth={AXIS_LABLE_MAX_WIDTH.horizontal}
    />
  );
}

export default ScrollBar;
