// @flow
import { lazy } from 'react';
import { Route } from 'react-router-dom';

const ContactsApp = lazy(() => import('@kitman/modules/src/Contacts'));
const Root = lazy(() => import('@kitman/profiler/src/routes/Root'));

const renderContactsRoutes = (canViewContacts: boolean) => {
  return (
    <Route
      path="settings/contacts"
      element={canViewContacts ? <ContactsApp /> : <Root />}
    />
  );
};

export default renderContactsRoutes;
