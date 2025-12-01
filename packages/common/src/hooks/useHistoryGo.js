// @flow
import { useNavigate } from 'react-router-dom';
import { SentryCaptureMessage } from '@kitman/common/src/utils';

/**
 * Hook that returns useNavigate when on the single page application,
 * otherwise, it returns history.go
 */
export default function useHistoryGo() {
  /**
   * useHistoryGo(0) reloads the page.
   * useHistoryGo(-1) is the same as history.back().
   * useHistoryGo(1) is the same as history.forward().
   * useNavigate() is the only way to navigate programmatically with react-router v6
   * useNavigate uses useInRouterContext in the background and throws an error when used outside
   * of a react-router context
   *
   * As hooks can't be called conditionally, we catch the thrown error and return history.go
   * instead of letting the app crash.
   */
  try {
    const navigate = useNavigate();
    return (steps: number) => navigate(steps);
  } catch (err) {
    return (steps: number) => {
      if (window.getFlag('single-page-application')) {
        SentryCaptureMessage(
          `useHistoryGo: error navigating back ${steps} steps`,
          'error'
        );
      }

      // eslint-disable-next-line no-restricted-globals
      history.go(steps);
    };
  }
}
