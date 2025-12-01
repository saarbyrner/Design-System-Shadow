// @flow
import { lazy } from 'react';
import { Route } from 'react-router-dom';

const EmailLogApp = lazy(() => import('@kitman/modules/src/EmailLog'));
const Root = lazy(() => import('@kitman/profiler/src/routes/Root'));

const renderEmailLogRoutes = (canViewEmailLogs: boolean) => {
  return (
    <Route>
      <Route
        path="settings/email-log"
        element={canViewEmailLogs ? <EmailLogApp /> : <Root />}
      />
    </Route>
  );
};

export default renderEmailLogRoutes;
