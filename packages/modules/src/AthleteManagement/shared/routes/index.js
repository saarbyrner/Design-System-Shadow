// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const ListAthleteApp = lazy(() =>
  import('@kitman/modules/src/AthleteManagement/ListAthleteApp')
);

const renderAthleteManagementRoutes = () => {
  return (
    <>
      <Route path="settings/athletes" element={<ListAthleteApp />} />
      <Route path="administration/athletes" element={<ListAthleteApp />} />
    </>
  );
};

export default renderAthleteManagementRoutes;
