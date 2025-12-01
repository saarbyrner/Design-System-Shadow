// @flow
import { withNamespaces } from 'react-i18next';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import OrganisationApp from '../../OrganisationApp';

const App = () => {
  const { data: organisation } = useGetOrganisationQuery();
  const { data: permissions } = useGetPermissionsQuery();

  const canViewConditionalFields =
    window.featureFlags['conditional-fields-creation-in-ip'] &&
    (permissions.injurySurveillance?.canAdmin ||
      permissions.logicBuilder?.canAdmin);

  // If the user has the permission to view the CF area
  // currently only organisation level but will add association
  if (canViewConditionalFields && organisation) {
    // If the organisation the user has signed into is at an association level - MLS:
    const isAssociationLevelAdmin = !!organisation?.association_admin;
    if (isAssociationLevelAdmin) {
      // We render the AssociationApp.
      // Visible tabs and requests will be different from Organisation level
      return null;
    }

    // If user is not admin we are at an organisation level - Liverpool
    if (!isAssociationLevelAdmin) {
      // We render the OrganisationApp.
      // Visible tabs and requests will be different than to the Association level
      return <OrganisationApp />;
    }
  }

  // Otherwise, we're not allowed to view Conditional Fields
  return null;
};

export const AppTranslated = withNamespaces()(App);
export default App;
