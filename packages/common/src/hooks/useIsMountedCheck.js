// @flow
import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns a function that keeps track of a components mounted state.
 *
 * e.g.
 * ```ts
 * const checkIsMounted = useIsMountedCheck();
 *
 * if (checkIsMounted()) {
 *   // Do something while mounted
 * }
 * ```
 *
 * @returns {function} function that returns the mounted status of a given component at any one time
 */
export default function useIsMountedCheck(): () => boolean {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const checker = useCallback((): boolean => {
    return isMounted.current;
  }, []);

  return checker;
}
