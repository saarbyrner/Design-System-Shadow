import { useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { getSquadFromPath } from '@kitman/common/src/utils';

const SentryRouteTracker = () => {
  const currentRoute = useLocationPathname();

  useEffect(() => {
    Sentry.configureScope((scope) => {
      scope.setTag('responsible_squad', getSquadFromPath(currentRoute));
    });
  }, [currentRoute]);

  return null;
};

export default SentryRouteTracker;
