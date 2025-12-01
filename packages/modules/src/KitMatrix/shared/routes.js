// @flow
import { lazy } from 'react';
import { Route } from 'react-router-dom';

const KitMatrixApp = lazy(() => import('@kitman/modules/src/KitMatrix'));
const Root = lazy(() => import('@kitman/profiler/src/routes/Root'));

const renderKitMatrixRoutes = (canViewKits: boolean) => {
  return (
    <Route
      path="settings/kit-matrix"
      element={canViewKits ? <KitMatrixApp /> : <Root />}
    />
  );
};

export default renderKitMatrixRoutes;
