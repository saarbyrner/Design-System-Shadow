// @flow
import { useLocation } from 'react-router-dom';

/**
 * Hook that returns the location path from useLocation when on the single page application,
 * otherwise, it returns window.location.pathname
 */
export default function useLocationPathname() {
  /**
   * useLocation uses useInRouterContext in the background and throws an error when used outside
   * of a react-router context
   *
   * As hooks can't be called conditionally, we catch the thrown error and return window.location.pathname
   * instead of letting the app crash.
   */
  try {
    const location = useLocation();
    return location.pathname;
  } catch (err) {
    return window.location.pathname;
  }
}
