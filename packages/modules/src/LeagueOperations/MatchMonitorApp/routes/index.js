// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const MatchMonitorReport = lazy(() =>
  import(
    '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport'
  )
);

const renderMatchMonitorRoutes = () => {
  return (
    <Route path="match_monitor/report/:id" element={<MatchMonitorReport />} />
  );
};

export default renderMatchMonitorRoutes;
