import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  mockedProcedureContextValue,
  MockedProcedureContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext/utils/mocks';
import ProcedureDetails from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails';

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

describe('<ProcedureDetails/>', () => {
  beforeEach(() => {
    window.featureFlags['medical-procedure'] = true;
  });

  afterEach(() => {
    window.featureFlags['medical-procedure'] = false;
  });

  it('renders primary procedure details', async () => {
    render(
      <Provider store={store}>
        <MockedOrganisationContextProvider
          organisationContext={{
            organisation: { id: 37 },
          }}
        >
          <MockedPermissionContextProvider
            permissionsContext={mockedPermissionsContextValue}
          >
            <MockedProcedureContextProvider
              procedureContext={{
                ...mockedProcedureContextValue,
              }}
            >
              <ProcedureDetails {...props} />
            </MockedProcedureContextProvider>
          </MockedPermissionContextProvider>
        </MockedOrganisationContextProvider>
      </Provider>
    );
    const procedureDetailsContainer = await screen.findByTestId(
      'ProcedureDetails|Container'
    );
    const procedureType = await screen.findByTestId('ProcedureDetails|Type');
    const procedureCode = await screen.findByTestId('ProcedureDetails|Code');

    expect(procedureDetailsContainer).toBeInTheDocument();
    expect(procedureCode).toBeInTheDocument();
    expect(procedureType).toBeInTheDocument();

    expect(screen.getByText('Procedure details')).toBeInTheDocument();
    expect(screen.getByText('Procedure:')).toBeInTheDocument();
    expect(screen.getByText('My Type1')).toBeInTheDocument();
    expect(screen.getByText('Code1')).toBeInTheDocument();
  });

  it('renders additional procedure info', async () => {
    render(
      <Provider store={store}>
        <MockedOrganisationContextProvider
          organisationContext={{
            organisation: { id: 37 },
          }}
        >
          <MockedPermissionContextProvider
            permissionsContext={mockedPermissionsContextValue}
          >
            <MockedProcedureContextProvider
              procedureContext={{
                ...mockedProcedureContextValue,
              }}
            >
              <ProcedureDetails {...props} />
            </MockedProcedureContextProvider>
          </MockedPermissionContextProvider>
        </MockedOrganisationContextProvider>
      </Provider>
    );

    const procedureProvider = await screen.findByTestId(
      'ProcedureDetails|Provider'
    );

    const procedureDate = await screen.findByTestId(
      'ProcedureDetails|ProcedureDate'
    );

    expect(procedureProvider).toBeInTheDocument();
    expect(procedureDate).toBeInTheDocument();

    expect(screen.getByText('Test User 3')).toBeInTheDocument();
  });

  describe('[PERMISSIONS]', () => {
    it('does render the button if procedures.canEdit is true', async () => {
      render(
        <Provider store={store}>
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 37 },
            }}
          >
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {
                  medical: {
                    ...defaultMedicalPermissions,
                    procedures: {
                      canCreate: true,
                      canView: true,
                      canEdit: true,
                    },
                  },
                },
                permissionsRequestStatus: 'SUCCESS',
              }}
            >
              <MockedProcedureContextProvider
                procedureContext={{
                  ...mockedProcedureContextValue,
                }}
              >
                <ProcedureDetails {...props} />
              </MockedProcedureContextProvider>
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        </Provider>
      );
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('does not render the button if procedures.canEdit is false', () => {
      render(
        <Provider store={store}>
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 37 },
            }}
          >
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {
                  medical: {
                    ...defaultMedicalPermissions,
                    procedures: {
                      canCreate: true,
                      canView: true,
                      canEdit: false,
                    },
                  },
                },
                permissionsRequestStatus: 'SUCCESS',
              }}
            >
              <MockedProcedureContextProvider
                procedureContext={{
                  ...mockedProcedureContextValue,
                }}
              >
                <ProcedureDetails {...props} />
              </MockedProcedureContextProvider>
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        </Provider>
      );
      expect(() => screen.getByRole('button', { name: 'Edit' })).toThrow();
    });
  });

  describe('[PLAYER MOVEMENT]', () => {
    it('does render the button if procedures.canEdit is true and the org created the procedure', async () => {
      render(
        <Provider store={store}>
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 37 },
            }}
          >
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {
                  medical: {
                    ...defaultMedicalPermissions,
                    procedures: {
                      canCreate: true,
                      canView: true,
                      canEdit: true,
                    },
                  },
                },
                permissionsRequestStatus: 'SUCCESS',
              }}
            >
              <MockedProcedureContextProvider
                procedureContext={{
                  ...mockedProcedureContextValue,
                }}
              >
                <ProcedureDetails {...props} />
              </MockedProcedureContextProvider>
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        </Provider>
      );
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('does not render the button if the org did not create the procedure, regardless of permissions', () => {
      render(
        <Provider store={store}>
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 999 },
            }}
          >
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {
                  medical: {
                    ...defaultMedicalPermissions,
                    procedures: {
                      canCreate: true,
                      canView: true,
                      canEdit: true,
                    },
                  },
                },
                permissionsRequestStatus: 'SUCCESS',
              }}
            >
              <MockedProcedureContextProvider
                procedureContext={{
                  ...mockedProcedureContextValue,
                }}
              >
                <ProcedureDetails {...props} />
              </MockedProcedureContextProvider>
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        </Provider>
      );
      expect(() => screen.getByRole('button', { name: 'Edit' })).toThrow();
    });
  });
});
