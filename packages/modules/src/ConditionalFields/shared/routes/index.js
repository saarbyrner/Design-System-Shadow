// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const ConditionalFieldsApp = lazy(() =>
  import('@kitman/modules/src/ConditionalFields/ConditionalFields')
);

const OrganisationApp = lazy(() =>
  import('@kitman/modules/src/ConditionalFields/OrganisationApp')
);

const OrganisationRulesetApp = lazy(() =>
  import('@kitman/modules/src/ConditionalFields/RulesetLevel')
);

const OrganisationRulesetVersionApp = lazy(() =>
  import('@kitman/modules/src/ConditionalFields/VersionLevel')
);

const renderConditionalFieldsRoutes = () => {
  return (
    <Route path="administration/conditional_fields">
      <Route path="" element={<ConditionalFieldsApp />} />
      <Route path="organisations/:id" element={<OrganisationApp />} />
      <Route
        path="organisations/:id/rulesets/:id"
        element={<OrganisationRulesetApp />}
      />
      <Route
        path="organisations/:id/rulesets/:id/versions/:id"
        element={<OrganisationRulesetVersionApp />}
      />
    </Route>
  );
};

export default renderConditionalFieldsRoutes;
