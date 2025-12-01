// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const RegistrationApp = lazy(() =>
  import('@kitman/modules/src/LeagueOperations/RegistrationApp')
);
const RegistrationProfileApp = lazy(() =>
  import('@kitman/modules/src/LeagueOperations/RegistrationProfileApp')
);
const RegistrationFormApp = lazy(() =>
  import('@kitman/modules/src/LeagueOperations/RegistrationFormApp')
);
const RegistrationSquadApp = lazy(() =>
  import('@kitman/modules/src/LeagueOperations/RegistrationSquadApp')
);
const RegistrationOrganisationApp = lazy(() =>
  import('@kitman/modules/src/LeagueOperations/RegistrationOrganisationApp')
);

const RegistrationRequirementsApp = lazy(() =>
  import('@kitman/modules/src/LeagueOperations/RegistrationRequirementsApp')
);

const renderLeagueOperationsRoutes = () => {
  return (
    <Route path="registration">
      <Route path="" element={<RegistrationApp />} />

      <Route
        path="organisations/:organisation_id"
        element={<RegistrationOrganisationApp />}
      />
      <Route path="squads/:squad_id" element={<RegistrationSquadApp />} />
      <Route path="profile/:user_id" element={<RegistrationProfileApp />} />

      {/* TODO: Update this route in Medinah */}
      {/* <Route
        path="profile/:user_id/requirements/:requirement_id"
        element={<RegistrationRequirementsApp />}
      /> */}
      <Route path="organisations" element={<RegistrationOrganisationApp />} />
      <Route path="squads" element={<RegistrationSquadApp />} />
      <Route path="profile" element={<RegistrationProfileApp />} />
      <Route path="requirements" element={<RegistrationRequirementsApp />} />
      <Route path="complete" element={<RegistrationFormApp />} />
    </Route>
  );
};

export default renderLeagueOperationsRoutes;
