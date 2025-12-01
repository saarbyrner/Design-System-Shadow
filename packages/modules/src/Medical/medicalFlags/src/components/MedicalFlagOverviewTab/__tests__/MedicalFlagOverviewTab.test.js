import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  MockedMedicalFlagContextProvider,
  mockedMedicalFlagContextValue,
} from '@kitman/modules/src/Medical/shared/contexts/MedicalFlagContext/utils/mocks';
import MedicalFlagOverviewTab from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab';

const props = {
  t: i18nextTranslateStub(),
};

const mockedPermissionsContextValue = {
  permissions: {
    medical: {
      ...defaultMedicalPermissions,
    },
  },
  permissionsRequestStatus: 'SUCCESS',
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
  toasts: [],
  medicalHistory: {},
});

// Tests to be extended on..
describe('<MedicalFlagOverviewTab/>', () => {
  it('renders medical flag overview sections', async () => {
    render(
      <Provider store={store}>
        <MockedOrganisationContextProvider>
          <MockedPermissionContextProvider
            permissionsContext={mockedPermissionsContextValue}
          >
            <MockedMedicalFlagContextProvider
              medicalFlagContext={{
                ...mockedMedicalFlagContextValue,
              }}
            >
              <MedicalFlagOverviewTab {...props} />
            </MockedMedicalFlagContextProvider>
          </MockedPermissionContextProvider>
        </MockedOrganisationContextProvider>
      </Provider>
    );
    const medicalFlagOverview = screen.getByTestId('MedicalFlag|Main');
    const MedicalFlagSidebar = screen.getByTestId('MedicalFlag|Sidebar');

    expect(medicalFlagOverview).toBeInTheDocument();
    expect(MedicalFlagSidebar).toBeInTheDocument();
  });
});
