// @flow
import { useState, useLayoutEffect, useEffect } from 'react';
import type { ElementRef } from 'react';
import useWindowSize from './useWindowSize';
import useDebouncedCallback from './useDebouncedCallback';

/**
 * @typeof {'scroll'|'client'} DimensionType
 */
type DimensionType = 'scroll' | 'client';

/**
 * @typeof {Object} Dimension
 * @property {string} width width of the dimension
 * @property {string} height height of the dimension
 */
type Dimension = {
  width: number,
  height: number,
};

/**
 *
 * @param {ElementRef} ref ref to be attached to element to get dimensions
 * @param {DimensionType} dimensionType client | scroll to get elments clientWidth/height or scrollWidth/Height
 */
const useComponentDimensions = (
  ref: ElementRef<any>,
  dimensionType: DimensionType
) => {
  const [dims, setDims] = useState(({ width: 0, height: 0 }: Dimension));
  const { windowWidth, windowHeight } = useWindowSize();

  // Uses ResizeObserver to listen to container resizes
  useEffect(() => {
    if (!ref.current) return () => {};

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        setDims({ width, height });
      });
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  const onDimsChange = () => {
    const newState = { ...dims };
    let shouldUpdate = false;

    if (
      ref.current !== null &&
      dims.width !== ref.current[`${dimensionType}Width`]
    ) {
      newState.width = ref.current[`${dimensionType}Width`];
      shouldUpdate = true;
    }

    if (
      ref.current !== null &&
      dims.height !== ref.current[`${dimensionType}Height`]
    ) {
      newState.height = ref.current[`${dimensionType}Height`];
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      setDims(newState);
    }
  };

  const onDimsChangeDebounced = useDebouncedCallback(onDimsChange, 500);

  useLayoutEffect(() => {
    onDimsChange();
  });

  // Debouncing callback when window resizes
  useEffect(() => {
    onDimsChangeDebounced();
  }, [windowWidth, windowHeight]);

  return dims;
};

/**
 * Returns the scrollHeight and scrollWidth of the element reference supplied
 *
 * @param {ElementRef} ref ref to be attached to element for dimensions
 *
 * @returns {Dimension}
 */
export const useScrollDimensions = (ref: ElementRef<any>) => {
  return useComponentDimensions(ref, 'scroll');
};

/**
 * Returns the clientWidth and clientHeight of the element reference supplied
 *
 * @param {ElementRef} ref ref to be attached to element for dimensions
 *
 * @returns {Dimension}
 */
export const useClientDimensions = (ref: ElementRef<any>) => {
  return useComponentDimensions(ref, 'client');
};

export default useComponentDimensions;
