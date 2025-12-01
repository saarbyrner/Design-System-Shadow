// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants/index';

const ListScoutsApp = lazy(() =>
  import('@kitman/modules/src/Scouts/ListScouts')
);

const CreateEditScoutApp = lazy(() =>
  import('@kitman/modules/src/Scouts/CreateEditScout')
);

const renderScoutsRoutes = () => {
  return (
    <>
      <Route path="administration/scouts" element={<ListScoutsApp />} />
      <Route
        path="administration/scouts/new"
        element={<CreateEditScoutApp mode={MODES.CREATE} />}
      />
      <Route
        path="administration/scouts/:id/edit"
        element={<CreateEditScoutApp mode={MODES.EDIT} />}
      />
    </>
  );
};

export default renderScoutsRoutes;
