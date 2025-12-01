// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants/index';

const ListAdditionalUsersApp = lazy(() =>
  import('@kitman/modules/src/AdditionalUsers/ListAdditionalUsers')
);

const CreateEditAdditionalUsersApp = lazy(() =>
  import('@kitman/modules/src/AdditionalUsers/CreateEditAdditionalUsers')
);

const renderAdditionalUsersRoutes = () => {
  return (
    <>
      <Route
        path="administration/additional_users"
        element={<ListAdditionalUsersApp />}
      />
      <Route
        path="administration/additional_users/official/new"
        element={<CreateEditAdditionalUsersApp mode={MODES.CREATE} />}
      />
      <Route
        path="administration/additional_users/scout/new"
        element={<CreateEditAdditionalUsersApp mode={MODES.CREATE} />}
      />
      <Route
        path="administration/additional_users/match_director/new"
        element={<CreateEditAdditionalUsersApp mode={MODES.CREATE} />}
      />
      <Route
        path="administration/additional_users/match_monitor/new"
        element={<CreateEditAdditionalUsersApp mode={MODES.CREATE} />}
      />
      <Route
        path="administration/additional_users/official/:id/edit"
        element={<CreateEditAdditionalUsersApp mode={MODES.EDIT} />}
      />
      <Route
        path="administration/additional_users/scout/:id/edit"
        element={<CreateEditAdditionalUsersApp mode={MODES.EDIT} />}
      />
      <Route
        path="administration/additional_users/match_director/:id/edit"
        element={<CreateEditAdditionalUsersApp mode={MODES.EDIT} />}
      />
      <Route
        path="administration/additional_users/match_monitor/:id/edit"
        element={<CreateEditAdditionalUsersApp mode={MODES.EDIT} />}
      />
    </>
  );
};

export default renderAdditionalUsersRoutes;
