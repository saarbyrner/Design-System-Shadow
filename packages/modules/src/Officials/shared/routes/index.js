// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const ListOfficialsApp = lazy(() =>
  import('@kitman/modules/src/Officials/ListOfficials')
);

const EditOfficialApp = lazy(() =>
  import('@kitman/modules/src/Officials/EditOfficial')
);

const CreateOfficialApp = lazy(() =>
  import('@kitman/modules/src/Officials/CreateOfficial')
);

const renderOfficialsRoutes = () => {
  return (
    <>
      <Route path="administration/officials" element={<ListOfficialsApp />} />
      <Route path="settings/officials" element={<ListOfficialsApp />} />
      <Route
        path="administration/officials/new"
        element={<CreateOfficialApp />}
      />
      <Route path="settings/officials/new" element={<CreateOfficialApp />} />
      <Route
        path="administration/officials/:id/edit"
        element={<EditOfficialApp />}
      />
      <Route path="settings/officials/:id/edit" element={<EditOfficialApp />} />
    </>
  );
};

export default renderOfficialsRoutes;
