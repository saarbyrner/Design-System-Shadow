// @flow
import { useLocation } from 'react-router-dom';

/**
 * Hook that returns the location search params from useLocation when on the single page application,
 * otherwise, it returns an object
 */
export default function useLocationSearch() {
  /**
   * useLocation uses useInRouterContext in the background and throws an error when used outside
   * of a react-router context
   *
   * As hooks can't be called conditionally, we catch the thrown error and return window.location.pathname
   * instead of letting the app crash.
   */
  try {
    const location = useLocation();
    return new URLSearchParams(location.search);
  } catch (err) {
    return new URLSearchParams(window.location.search);
  }
}
