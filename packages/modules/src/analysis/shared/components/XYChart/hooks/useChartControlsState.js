// @flow

import { useState } from 'react';

type Scroll = {
  startIndex: number,
  endIndex: number,
  isActive: boolean,
};

export type SeriesLabel = {
  datum: string,
  index: number,
  text: string,
  value: string,
};

export type ChartControls = {
  scroll: Scroll,
  hiddenSeries: Array<SeriesLabel>,
};

export type ControlsApi = {
  setScroll: (newScroll: Scroll) => void,
  setHiddenSeries: (label: Array<SeriesLabel>) => void,
};

export const INITIAL_CONTROLS_API: ControlsApi = {
  setScroll: () => {},
  setHiddenSeries: () => {},
};
export const INITIAL_CONTROLS: ChartControls = {
  scroll: {
    startIndex: 0,
    endIndex: 0,
    isActive: false,
  },
  hiddenSeries: [],
};

/**
 * This hook holds the state and the means to manipulate the state. Its sole purpose is to
 * be consumed by the global context. Its not for general use.
 *
 * To use controls, useChartContext will be in place.
 *
 * @returns {controls: ChartControls,controlsApi: ControlsApi,}
 */
export default function useChartControlsState(): {
  controls: ChartControls,
  controlsApi: ControlsApi,
} {
  // initially defining this as a state object but the structure is there to expand
  // it to maybe a useReducer as the controls get more complex
  const [scroll, setScroll] = useState<Scroll>(INITIAL_CONTROLS.scroll);
  const [hiddenSeries, setHiddenSeries] = useState<Array<SeriesLabel>>(
    INITIAL_CONTROLS.hiddenSeries
  );

  return {
    controls: {
      scroll,
      hiddenSeries,
    },
    controlsApi: {
      setScroll,
      setHiddenSeries,
    },
  };
}
