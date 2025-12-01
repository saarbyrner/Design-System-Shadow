// @flow
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectRefreshKey } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/dashboardCache';

type Options = {
  skipInitial?: boolean, // don’t fire on first render
  onlyTruthy?: boolean, // ignore falsy keys
};

const isSame = (a, b) => Object.is(a, b);
/**
 * useShouldRefreshDashboard
 *
 * Returns true exactly once when the dashboard refresh key changes.
 * - If `overrideKey` is omitted, the key is read from Redux via `selectRefreshKey`.
 * - By default, it ignores the first render (`skipInitial`) and falsy keys (`onlyTruthy`).
 *
 * @param {?string} [overrideKey] Optional override; if not provided, the Redux key is used.
 * @param {{skipInitial?: boolean, onlyTruthy?: boolean}} [options]
 * @param {boolean} [options.skipInitial=true] Suppress trigger on the initial render.
 * @param {boolean} [options.onlyTruthy=true] Ignore changes to falsy keys (null/undefined/''/0).
 * @returns {boolean} Whether a dashboard refresh should happen on this render.
 *
 * @example
 * const shouldRefresh = useShouldRefreshDashboard(); // uses Redux key
 * useEffect(() => {
 *   if (shouldRefresh) refetch();
 * }, [shouldRefresh, refetch]);
 */
export default function useShouldRefreshDashboard(
  overrideKey?: ?string,
  options?: Options = {}
): boolean {
  const reduxRefreshKey = useSelector(selectRefreshKey);
  const effectiveKey = overrideKey ?? reduxRefreshKey;

  const { skipInitial = true, onlyTruthy = true } = options;

  const prevRef = useRef<?string>(undefined);
  const isFirstRenderRef = useRef(true);

  const prev = prevRef.current;
  const hasChanged = !isSame(prev, effectiveKey);
  const isKeyValid = onlyTruthy ? Boolean(effectiveKey) : true;

  const initialRenderAllowed = skipInitial ? !isFirstRenderRef.current : true;

  const shouldRefresh = isKeyValid && initialRenderAllowed && hasChanged;

  useEffect(() => {
    prevRef.current = effectiveKey ?? null;
    isFirstRenderRef.current = false;
  }, [effectiveKey]);

  return shouldRefresh;
}
