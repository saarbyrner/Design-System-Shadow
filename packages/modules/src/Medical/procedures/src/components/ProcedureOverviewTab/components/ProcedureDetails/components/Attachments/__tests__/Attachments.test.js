import { act, render, screen, within } from '@testing-library/react';

import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  mockedProcedureContextValue,
  MockedProcedureContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext/utils/mocks';
import Attachments from '..';

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

describe('<Attachments/>', () => {
  describe('Orgs, Permissions', () => {
    it('renders Add attachment button when org matches', async () => {
      act(() => {
        render(
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
                  procedure: mockedProcedureContextValue.procedure,
                }}
              >
                <Attachments {...props} />
              </MockedProcedureContextProvider>
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        );
      });

      const attachmentsContainer = await screen.findByTestId(
        'ProcedureOverviewTab|Attachments'
      );

      expect(attachmentsContainer).toBeInTheDocument();
      expect(attachmentsContainer).toHaveTextContent('Attachments');
      expect(screen.getByText('testfilename.png')).toBeInTheDocument();

      // We expect two lists <ol> to be found; Attachments & Links
      expect(screen.getAllByRole('list')).toHaveLength(2);
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('does not render Add attachment button when org mismatch', async () => {
      act(() => {
        render(
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 5 },
            }}
          >
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <MockedProcedureContextProvider
                procedureContext={{
                  ...mockedProcedureContextValue,
                  procedure: mockedProcedureContextValue.procedure,
                }}
              >
                <Attachments {...props} />
              </MockedProcedureContextProvider>
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        );
      });

      expect(() => screen.getByRole('button', { name: 'Add' })).toThrow();
    });

    it('does not render Add attachment button when permissions.medical.procedures.canCreate is false', async () => {
      act(() => {
        render(
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
                      canCreate: false,
                    },
                  },
                },
                permissionsRequestStatus: 'SUCCESS',
              }}
            >
              <MockedProcedureContextProvider
                procedureContext={{
                  ...mockedProcedureContextValue,
                  procedure: mockedProcedureContextValue.procedure,
                }}
              >
                <Attachments {...props} />
              </MockedProcedureContextProvider>
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        );
      });

      expect(() => screen.getByRole('button', { name: 'Add' })).toThrow();
    });
  });

  describe('Permissions & Feature Flags', () => {
    beforeEach(() => {
      window.featureFlags['remove-attachments'] = true;
    });

    afterEach(() => {
      window.featureFlags['remove-attachments'] = false;
    });

    it('renders button to delete an attachment when feature flag & permissions are on', async () => {
      act(() => {
        render(
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
                    },
                    attachments: {
                      canRemove: true,
                    },
                  },
                },
                permissionsRequestStatus: 'SUCCESS',
              }}
            >
              <MockedProcedureContextProvider
                procedureContext={{
                  ...mockedProcedureContextValue,
                  procedure: mockedProcedureContextValue.procedure,
                }}
              >
                <Attachments {...props} />
              </MockedProcedureContextProvider>
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        );
      });

      // Expect to find icon-bin, which is the prompt to delete an attachment
      const attachmentList = screen.getAllByRole('list')[0];
      const removeAttachmentButton = within(attachmentList).getByRole('button');

      expect(
        removeAttachmentButton.getElementsByClassName('icon-bin')
      ).toHaveLength(1);
    });
  });

  describe('[Links]', () => {
    it('renders correct Links section & children', async () => {
      act(() => {
        render(
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
                    },
                  },
                },
                permissionsRequestStatus: 'SUCCESS',
              }}
            >
              <MockedProcedureContextProvider
                procedureContext={{
                  ...mockedProcedureContextValue,
                  procedure: mockedProcedureContextValue.procedure,
                }}
              >
                <Attachments {...props} />
              </MockedProcedureContextProvider>
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        );
      });

      const linkList = screen.getByTestId('Attachments|CurrentLinksList');
      expect(linkList).toBeInTheDocument();

      expect(
        within(linkList).getByRole('heading', { level: 3 })
      ).toBeInTheDocument();

      expect(
        within(linkList).getByRole('heading', { level: 3 })
      ).toHaveTextContent('Links');

      expect(within(linkList).getByText('rte.ie')).toBeInTheDocument();
      expect(within(linkList).getByRole('link')).toHaveAttribute(
        'href',
        'https://rte.ie'
      );
    });
  });
});
