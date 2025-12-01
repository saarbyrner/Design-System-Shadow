// @flow
import { useNavigate } from 'react-router-dom';
import { SentryCaptureMessage } from '@kitman/common/src/utils';

/**
 * Hook that returns useNavigate when on the single page application,
 * otherwise, it returns location.assign
 */
export default function useLocationAssign() {
  /**
   * useNavigate() is the only way to navigate programmatically with react-router v6
   * useNavigate uses useInRouterContext in the background and throws an error when used outside
   * of a react-router context
   *
   * As hooks can't be called conditionally, we catch the thrown error and return location.assign
   * instead of letting the app crash.
   */
  try {
    const navigate = useNavigate();
    return (path: string) => navigate(path);
  } catch (err) {
    return (path: string) => {
      if (window.getFlag('single-page-application')) {
        SentryCaptureMessage(
          `useLocationAssign: error navigating to ${path}`,
          'error'
        );
      }

      window.location.assign(path);
    };
  }
}
