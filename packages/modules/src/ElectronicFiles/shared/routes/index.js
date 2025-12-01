// @flow
import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

import { type PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';

const Root = lazy(() => import('@kitman/profiler/src/routes/Root'));

const ListElectronicFilesApp = lazy(() =>
  import('@kitman/modules/src/ElectronicFiles/ListElectronicFiles')
);

const ViewElectronicFileApp = lazy(() =>
  import('@kitman/modules/src/ElectronicFiles/ViewElectronicFile')
);

const ListContactsApp = lazy(() =>
  import('@kitman/modules/src/ElectronicFiles/ListContacts')
);

const paths = {
  empty: '',
  efile: 'efile',
  inbox: 'inbox',
  inboxId: 'inbox/:id',
  sent: 'sent',
  sentId: 'sent/:id',
  contacts: 'contacts',
};

const getRouteElement = ({
  path,
  renderApp,
}: {
  path: string,
  renderApp: boolean,
}) => {
  switch (path) {
    case paths.inbox:
    case paths.sent:
      return renderApp ? <ListElectronicFilesApp /> : <Root />;
    case paths.inboxId:
    case paths.sentId:
      return renderApp ? <ViewElectronicFileApp /> : <Root />;
    case paths.contacts:
      return renderApp ? <ListContactsApp /> : <Root />;
    default:
      return <Root />;
  }
};

const renderElectronicFilesRoutes = (permissions: PermissionsType) => {
  const canView = permissions.efile.canView;
  const canManageContacts = permissions.efile.canManageContacts;

  return (
    <Route path={paths.efile}>
      <Route
        path={paths.empty}
        element={<Navigate to={`/${paths.efile}/${paths.inbox}`} />}
      />
      <Route
        path={paths.inbox}
        element={getRouteElement({
          path: paths.inbox,
          renderApp: canView,
        })}
      />
      <Route
        path={paths.inboxId}
        element={getRouteElement({
          path: paths.inboxId,
          renderApp: canView,
        })}
      />
      <Route
        path={paths.sent}
        element={getRouteElement({
          path: paths.sent,
          renderApp: canView,
        })}
      />
      <Route
        path={paths.sentId}
        element={getRouteElement({
          path: paths.sentId,
          renderApp: canView,
        })}
      />
      <Route
        path={paths.contacts}
        element={getRouteElement({
          path: paths.contacts,
          renderApp: canManageContacts,
        })}
      />
    </Route>
  );
};

export default renderElectronicFilesRoutes;
