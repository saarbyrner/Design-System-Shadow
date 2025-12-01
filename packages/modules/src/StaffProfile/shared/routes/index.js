// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const StaffProfile = lazy(() => import('@kitman/modules/src/StaffProfile'));

const renderStaffProfileRoutes = () => {
  return (
    <>
      <Route path="administration/staff/new" element={<StaffProfile />} exact />
      <Route
        path="administration/staff/:staffId"
        element={<StaffProfile />}
        exact
      />
    </>
  );
};

export default renderStaffProfileRoutes;
