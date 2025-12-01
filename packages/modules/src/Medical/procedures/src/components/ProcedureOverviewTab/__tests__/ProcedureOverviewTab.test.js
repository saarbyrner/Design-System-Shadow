import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  mockedProcedureContextValue,
  MockedProcedureContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext/utils/mocks';

import ProcedureOverviewTab from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab';

const props = {
  t: i18nextTranslateStub(),
};

const mockedPermissionsContextValue = {
  permissions: {
    medical: {
      ...defaultMedicalPermissions,
      procedures: {
        canCreate: true,
        canView: true,
      },
    },
  },
  permissionsRequestStatus: 'SUCCESS',
};

// Tests to be extended on..
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  addProcedureSidePanel: {
    isOpen: false,
  },
  addProcedureAttachmentSidePanel: {
    isOpen: false,
  },
  medicalApi: {},
  toasts: [],
  medicalHistory: {},
});

// Tests to be extended on..
describe('<ProcedureOverviewTab/>', () => {
  beforeEach(() => {
    window.featureFlags['medical-procedure'] = true;
  });

  afterEach(() => {
    window.featureFlags['medical-procedure'] = false;
  });

  it('renders procedure overview sections', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <MockedOrganisationContextProvider
            organisationContext={{ organisation: {} }}
          >
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <MockedProcedureContextProvider
                procedureContext={{
                  ...mockedProcedureContextValue,
                }}
              >
                <ProcedureOverviewTab {...props} />
              </MockedProcedureContextProvider>
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        </Provider>
      );
    });
    const procedureOverview = screen.getByTestId('ProcedureOverviewTab|Main');
    const procedureDetails = screen.getByTestId(
      'ProcedureOverviewTab|ProcedureDetails'
    );
    const procedureSidebar = screen.getByTestId('ProcedureOverviewTab|Sidebar');

    expect(procedureOverview).toBeInTheDocument();
    expect(procedureDetails).toBeInTheDocument();
    expect(procedureSidebar).toBeInTheDocument();
  });
});
