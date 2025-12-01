// @flow
import type { ElementRef } from 'react';
import { useState, useEffect, useRef } from 'react';

import { useIsMountedCheck } from '@kitman/common/src/hooks';

type Options = {
  threshold?: number,
  root?: HTMLElement | null,
  rootMargin?: string | '0px',
  disconnectOnFirstRender?: boolean, // only reccomended if you are subscribing to hasBeenVisible
};

type Meta = {
  isVisible: boolean,
  hasBeenVisible: boolean,
};
type ReturnVal = [ElementRef<any>, Meta];

const DEFAULT_OPTIONS: Options = {
  threshold: 0,
  root: null,
  rootMargin: '0px',
  disconnectOnFirstRender: false,
};

/**
 * Uses an intersection observer to track the screen visiblity of the element ref returned
 * in releation to either a supplied root or the page root.
 *
 * @param {Options} options options provided to configure the intersection observer
 * @returns [ElementRef, Metadata]
 */
const useElementVisibilityTracker = (options: Options = {}): ReturnVal => {
  const checkIsMounted = useIsMountedCheck();

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return () => {};

    if (observerRef.current === null) {
      // wrapped in a timeout so that this gets called at the end
      setTimeout(() => {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            const isIntersecting = entry.isIntersecting;

            if (checkIsMounted()) {
              setIsVisible(isIntersecting);
            }

            if (isIntersecting && !hasBeenVisible) {
              if (checkIsMounted()) {
                setHasBeenVisible(true);
              }
              // If you want to automatically disconnect the observer after first visibility
              if (options.disconnectOnFirstRender) {
                observerRef.current?.disconnect();
              }
            }
          },
          { ...DEFAULT_OPTIONS, ...options }
        );

        observerRef.current.observe(element);
      });
    }

    return () => {
      if (element) {
        observerRef.current?.unobserve(element);
      }
    };
  });

  return [elementRef, { isVisible, hasBeenVisible }];
};

export default useElementVisibilityTracker;
