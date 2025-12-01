// @flow
import { useDispatch } from 'react-redux';

import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { colors } from '@kitman/common/src/variables';
import type { InitialData } from '@kitman/services/src/services/getInitialData';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { Select } from '@kitman/components';
import switchOrganisation from '@kitman/services/src/services/settings/organisation_switcher/put';
import { setLastKnownOrg } from '@kitman/modules/src/initialiseProfiler/modules/utilities/openLastKnownPageOnSignIn';
import { isConnectedToStaging } from '@kitman/common/src/variables/isConnectedToStaging';

type Props = {
  adminBar: $PropertyType<InitialData, 'admin_bar'>,
  currentUserId: string,
};

// Tested indirectly in
// packages/modules/src/AppHeader/__tests__/AppHeader.test.js.
const OrganisationSelector = (props: Props) => {
  const dispatch = useDispatch();
  const { organisation } = useOrganisation();

  const changeOrganisation = async (orgId: number): Promise<void> => {
    try {
      await switchOrganisation(orgId);
    } catch (error) {
      dispatch(
        add({
          status: 'ERROR',
          title: error.response.data.error_message,
        })
      );
      return;
    }
    setLastKnownOrg(orgId, props.currentUserId);

    if (isConnectedToStaging) {
      window.location.reload();
    } else window.location.href = '/';
  };

  return (
    <div className="appHeader__orgSelector" data-testid="OrganisationSelector">
      <Select
        placeholder={organisation.name}
        value={null}
        onChange={changeOrganisation}
        options={props.adminBar.organisation_list}
        isDisabled={false}
        customSelectStyles={
          props.adminBar.use_danger_style
            ? {
                placeholder: (base) => ({
                  ...base,
                  color: `${colors.white} !important`,
                }),
                control: (base) => ({
                  ...base,
                  backgroundColor: `${colors.s25} !important`,
                }),
              }
            : {}
        }
        isSearchable
      />
    </div>
  );
};

export default OrganisationSelector;
