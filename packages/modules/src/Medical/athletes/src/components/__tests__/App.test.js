import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  i18nextTranslateStub,
  renderWithProvider,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import {
  defaultMedicalPermissions,
  mockedDefaultPermissionsContextValue,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { data as mockAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';
import getAthleteData from '@kitman/services/src/services/getAthleteData';
import { useGetMedicationProvidersQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import {
  useGetOrganisationQuery,
  useGetCurrentUserQuery,
  useGetPermissionsQuery,
  useFetchOrganisationPreferenceQuery,
  useGetSportQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useDiagnostics from '@kitman/modules/src/Medical/shared/hooks/useDiagnostics';
import getDefaultAddIssuePanelStore from '@kitman/modules/src/Medical/shared/redux/stores/addIssuePanel';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';

import { AppTranslated as App } from '../App';

jest.mock('@kitman/modules/src/Medical/shared/hooks/useDiagnostics');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
  useGetCurrentUserQuery: jest.fn(),
  useGetPermissionsQuery: jest.fn(),
  useFetchOrganisationPreferenceQuery: jest.fn(),
  useGetSportQuery: jest.fn(),
  useGetActiveSquadQuery: jest.fn(),
}));
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetMedicationProvidersQuery: jest.fn(),
}));

jest.mock('@kitman/services/src/services/getAthleteData');

const i18nT = i18nextTranslateStub();
const defaultConcussionPermissions =
  DEFAULT_CONTEXT_VALUE.permissions.concussion;
const defaultGeneralPermissions = DEFAULT_CONTEXT_VALUE.permissions.general;
const props = {
  athleteId: 1,
  t: i18nT,
};

const store = {
  addIssuePanel: getDefaultAddIssuePanelStore(),
  addMedicalNotePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addModificationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addAllergySidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addMedicalAlertSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addProcedureSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addTreatmentsSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addDiagnosticSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addDiagnosticAttachmentSidePanel: {
    isOpen: false,
    diagnosticId: null,
    athleteId: null,
  },
  addTUESidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: false,
    },
  },
  addVaccinationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: false,
    },
  },
  selectAthletesSidePanel: {
    isOpen: false,
  },
  treatmentCardList: {
    athleteTreatments: {},
    invalidEditTreatmentCards: [],
  },
  addConcussionTestResultsSidePanel: {
    isOpen: false,
    initialInfo: {
      testProtocol: 'NPC',
    },
  },
  medicalApi: {
    useGetMedicationProvidersQuery: jest.fn(),
  },
  global: {
    useGetOrganisationQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useFetchOrganisationPreferenceQuery: jest.fn(),
    useGetSportQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  },
  medicalSharedApi: jest.fn(),
  toasts: [],
  medicalHistory: {},
};

describe('<App />', () => {
  const renderTestComponent = (permissions, appProps = props) => {
    renderWithProvider(
      <MockedPermissionContextProvider permissionsContext={permissions}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <App {...appProps} />
        </LocalizationProvider>
      </MockedPermissionContextProvider>,
      storeFake(store)
    );
  };

  beforeEach(() => {
    useDiagnostics.mockReturnValue({
      diagnostics: [],
      resetNextPage: jest.fn(),
      resetDiagnostics: jest.fn(),
      fetchDiagnostics: jest.fn().mockResolvedValue([]),
    });
    useGetMedicationProvidersQuery.mockReturnValue({
      refetch: jest.fn(),
    });
    useGetOrganisationQuery.mockReturnValue({
      data: [],
      isError: false,
      isSuccess: true,
    });
    useGetCurrentUserQuery.mockReturnValue({
      data: {},
      isError: false,
      isSuccess: true,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: {},
      error: false,
      isLoading: false,
    });
    useFetchOrganisationPreferenceQuery.mockReturnValue({
      data: {},
      error: false,
      isLoading: false,
    });
    useGetSportQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Football',
      },
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: {},
      error: false,
      isLoading: false,
    });
  });

  describe('rendering content', () => {
    beforeEach(() => {
      getAthleteData.mockResolvedValue(mockAthleteData);
    });
    it('renders a loader initially', async () => {
      renderTestComponent(mockedDefaultPermissionsContextValue);
      await waitFor(() => {
        expect(
          screen.getByTestId('DelayedLoadingFeedback')
        ).toBeInTheDocument();
      });
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      server.use(
        rest.get(`/medical/athletes/${mockAthleteData.id}`, (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      getAthleteData.mockRejectedValue(new Error('whoops'));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('shows an error message', async () => {
      renderTestComponent({
        ...mockedDefaultPermissionsContextValue,
        permissions: {
          ...mockedDefaultPermissionsContextValue.permissions,
        },
        permissionsRequestStatus: 'FAILURE',
      });

      await waitFor(() => {
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });
    });
  });

  describe('when the initial request is successful', () => {
    beforeEach(() => {
      window.setFlag('pm-show-tue', true);
      getAthleteData.mockResolvedValue(mockAthleteData, true);
    });

    describe('[permissions] default permissions', () => {
      it('renders the correct content', async () => {
        renderTestComponent(mockedDefaultPermissionsContextValue);

        await waitFor(() => {
          expect(screen.getByTestId('AppHeader')).toBeInTheDocument();
        });

        expect(screen.queryByTestId('TabBarCompPane')).not.toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.issues.canView', () => {
      beforeEach(() => {
        window.location.hash = tabHashes.ISSUES;
      });
      afterEach(() => {
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            concussion: {
              ...defaultConcussionPermissions,
            },
            general: {
              ...defaultGeneralPermissions,
            },
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                canView: true,
              },
            },
          },
        });

        expect(
          await screen.findByRole('tab', { name: 'Injury/ Illness' })
        ).toBeInTheDocument();

        const tabPanel = await screen.findByRole('tabpanel', {
          name: 'Injury/ Illness',
        });

        expect(tabPanel).toBeInTheDocument();
        expect(
          screen.getByRole('heading', {
            name: 'Injury/ Illness',
            level: 3,
          })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.notes.canView', () => {
      beforeEach(() => {
        window.location.hash = tabHashes.MEDICAL_NOTES;
      });
      afterEach(() => {
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              notes: {
                canView: true,
              },
            },
            general: {
              ...defaultGeneralPermissions,
            },
          },
        });

        expect(
          await screen.findByRole('tab', { name: 'Notes' })
        ).toBeInTheDocument();

        const tabPanel = screen.getByRole('tabpanel', { name: 'Notes' });

        expect(tabPanel).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { name: 'Notes', level: 3 })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.modifications.canView', () => {
      beforeEach(() => {
        window.location.hash = tabHashes.MODIFICATIONS;
      });
      afterEach(() => {
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              modifications: {
                canView: true,
              },
            },
          },
        });

        expect(
          await screen.findByRole('tab', { name: 'Modifications' })
        ).toBeInTheDocument();

        const tabPanel = screen.getByRole('tabpanel', {
          name: 'Modifications',
        });

        expect(tabPanel).toBeInTheDocument();
        expect(
          screen.getByRole('heading', {
            name: 'Modifications',
            level: 3,
          })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.treatments.canView', () => {
      beforeEach(() => {
        window.location.hash = tabHashes.TREATMENTS;
      });
      afterEach(() => {
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              treatments: {
                canView: true,
              },
            },
          },
        });

        expect(
          await screen.findByRole('tab', { name: 'Treatments' })
        ).toBeInTheDocument();

        const tabPanel = screen.getByRole('tabpanel', { name: 'Treatments' });

        expect(tabPanel).toBeInTheDocument();
        expect(
          screen.getByRole('heading', {
            name: 'Treatments',
            level: 3,
          })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.diagnostics.canView', () => {
      beforeEach(() => {
        window.location.hash = tabHashes.DIAGNOSTICS;
      });
      afterEach(() => {
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          permissions: {
            general: {
              ancillaryRange: {
                canManage: true,
              },
            },
            medical: {
              ...defaultMedicalPermissions,
              diagnostics: {
                canView: true,
              },
            },
          },
        });

        await waitFor(() => {
          expect(
            screen.queryByTestId('DelayedLoadingFeedback')
          ).not.toBeInTheDocument();
        });

        const diagnosticsTab = await screen.findByRole(
          'tab',
          {
            name: 'Diagnostics',
          },
          { timeout: 3000 }
        );
        expect(diagnosticsTab).toBeInTheDocument();
        const tabPanel = screen.getByRole('tabpanel', {
          name: 'Diagnostics',
        });

        expect(tabPanel).toBeInTheDocument();
        expect(
          screen.getByRole('heading', {
            name: 'Diagnostics',
            level: 3,
          })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.forms.canView', () => {
      beforeEach(() => {
        window.featureFlags['medical-forms-tab-iteration-1'] = true;
        window.location.hash = tabHashes.FORMS;
      });
      afterEach(() => {
        window.featureFlags['medical-forms-tab-iteration-1'] = false;
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            concussion: {
              ...defaultConcussionPermissions,
            },
            medical: {
              ...defaultMedicalPermissions,
              forms: {
                canView: true,
              },
            },
          },
        });

        expect(
          await screen.findByRole('tab', { name: 'Forms' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tabpanel', { name: 'Forms' })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.tue.canView', () => {
      beforeEach(() => {
        window.featureFlags['performance-medicine-medical-history'] = true;
        window.location.hash = tabHashes.MEDICAL_HISTORY;
      });

      afterEach(() => {
        window.featureFlags['performance-medicine-medical-history'] = false;
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              tue: {
                canView: true,
              },
            },
          },
        });

        expect(
          await screen.findByRole('tab', { name: 'Medical history' })
        ).toBeInTheDocument();

        const tabPanel = screen.getByRole('tabpanel', {
          name: 'Medical history',
        });

        expect(tabPanel).toBeInTheDocument();
        expect(
          screen.getByRole('heading', {
            name: 'Therapeutic use exemptions',
            level: 3,
          })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.vaccinations.canView', () => {
      beforeEach(() => {
        window.featureFlags['performance-medicine-medical-history'] = true;
        window.location.hash = tabHashes.MEDICAL_HISTORY;
      });

      afterEach(() => {
        window.featureFlags['performance-medicine-medical-history'] = false;
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              vaccinations: {
                canView: true,
              },
            },
          },
        });

        expect(
          await screen.findByRole('tab', { name: 'Medical history' })
        ).toBeInTheDocument();

        const tabPanel = screen.getByRole('tabpanel', {
          name: 'Medical history',
        });

        expect(tabPanel).toBeInTheDocument();
        expect(
          screen.getByRole('heading', {
            name: 'Vaccinations',
            level: 3,
          })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.documents.canView', () => {
      beforeEach(() => {
        window.featureFlags['medical-documents-files-area'] = true;
        window.location.hash = tabHashes.FILES;
      });

      afterEach(() => {
        window.featureFlags['medical-documents-files-area'] = false;
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              documents: {
                canView: true,
              },
            },
          },
        });

        expect(
          await screen.findByRole('tab', { name: 'Documents' })
        ).toBeInTheDocument();

        const tabPanel = screen.getByRole('tabpanel', { name: 'Documents' });

        expect(tabPanel).toBeInTheDocument();
        expect(
          screen.getByRole('heading', {
            name: 'Documents',
            level: 3,
          })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.rehab.canView', () => {
      beforeEach(() => {
        window.featureFlags['rehab-tab-athlete'] = true;
        window.location.hash = tabHashes.MAINTENANCE;
      });
      afterEach(() => {
        window.featureFlags['rehab-tab-athlete'] = false;
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            rehab: {
              canView: true,
            },
          },
        });

        expect(
          await screen.findByRole('tab', { name: 'Maintenance' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tabpanel', { name: 'Maintenance' })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.rehab.canView false', () => {
      beforeEach(() => {
        window.featureFlags['medical-forms-tab-iteration-1'] = true;
        window.featureFlags['concussion-web-iteration-2'] = true;
        window.featureFlags['performance-medicine-medical-history'] = true;
        window.featureFlags['rehab-tab-athlete'] = true;
        window.location.hash = tabHashes.ISSUES;
      });

      afterEach(() => {
        window.featureFlags['medical-forms-tab-iteration-1'] = false;
        window.featureFlags['concussion-web-iteration-2'] = false;
        window.featureFlags['performance-medicine-medical-history'] = false;
        window.featureFlags['rehab-tab-athlete'] = false;
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent({
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            concussion: {
              ...defaultConcussionPermissions,
              canViewConcussionAssessments: true,
              canManageConcussionAssessments: true,
              canViewKingDevickAssessments: true,
              canViewNpcAssessments: true,
            },
            medical: {
              ...defaultMedicalPermissions,
              diagnostics: {
                canView: true,
              },
              treatments: {
                canView: true,
              },
              modifications: {
                canView: true,
              },
              notes: {
                canView: true,
              },
              issues: {
                canView: true,
              },
              forms: {
                canView: true,
              },
              vaccinations: {
                canView: true,
              },
              tue: {
                canView: true,
              },
            },
            rehab: {
              canView: false,
            },
          },
        });

        expect(
          await screen.findByRole('tab', { name: 'Injury/ Illness' })
        ).toBeInTheDocument();

        const tabPanes = screen.getAllByRole('tab');
        expect(tabPanes).toHaveLength(8);

        expect(screen.getByRole('tab', { name: 'Notes' })).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Modifications' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Treatments' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Diagnostics' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Medical history' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Concussions' })
        ).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Forms' })).toBeInTheDocument();
        expect(
          screen.queryByRole('tab', { name: 'Maintenance' })
        ).not.toBeInTheDocument();
      });
    });

    describe('[permissions] full permissions', () => {
      const allPermissions = {
        ...mockedDefaultPermissionsContextValue,
        permissions: {
          ...mockedDefaultPermissionsContextValue.permissions,
          concussion: {
            ...defaultConcussionPermissions,
            canManageConcussionAssessments: true,
            canViewConcussionAssessments: true,
            canViewKingDevickAssessments: true,
            canViewNpcAssessments: true,
          },
          medical: {
            ...defaultMedicalPermissions,
            diagnostics: {
              canView: true,
            },
            documents: {
              canView: true,
            },
            treatments: {
              canView: true,
            },
            modifications: {
              canView: true,
            },
            notes: {
              canView: true,
            },
            issues: {
              canView: true,
            },
            forms: {
              canView: true,
            },
            vaccinations: {
              canView: true,
            },
            tue: {
              canView: true,
            },
          },
          rehab: {
            canView: true,
          },
        },
      };

      beforeEach(() => {
        window.featureFlags['medical-forms-tab-iteration-1'] = true;
        window.featureFlags['concussion-web-iteration-2'] = true;
        window.featureFlags['performance-medicine-medical-history'] = true;
        window.featureFlags['rehab-tab-athlete'] = true;
        window.featureFlags['medical-documents-files-area'] = true;
        window.featureFlags['medical-files-tab-enhancement'] = true;
        window.featureFlags['medications-general-availability'] = true;
        window.location.hash = tabHashes.ISSUES;
      });

      afterEach(() => {
        window.featureFlags['medical-forms-tab-iteration-1'] = false;
        window.featureFlags['concussion-web-iteration-2'] = false;
        window.featureFlags['performance-medicine-medical-history'] = false;
        window.featureFlags['rehab-tab-athlete'] = false;
        window.featureFlags['medical-documents-files-area'] = false;
        window.featureFlags['medical-files-tab-enhancement'] = false;
        window.featureFlags['medications-general-availability'] = false;
        window.location.hash = '';
      });

      it('renders the correct content', async () => {
        renderTestComponent(allPermissions);

        expect(
          await screen.findByRole('tab', { name: 'Injury/ Illness' })
        ).toBeInTheDocument();

        const tabPanes = screen.getAllByRole('tab');

        expect(tabPanes).toHaveLength(11);

        expect(
          screen.getByRole('tab', { name: 'Injury/ Illness' })
        ).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Notes' })).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Modifications' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Treatments' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Diagnostics' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Medical history' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Concussions' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Documents' })
        ).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Forms' })).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Maintenance' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Medications' })
        ).toBeInTheDocument();
      });

      it('can switch tab', async () => {
        const user = userEvent.setup();
        renderTestComponent(allPermissions);
        await screen.findByRole('tab', { name: 'Injury/ Illness' });

        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
          'Injury/ Illness'
        );
        const medicationsTab = screen.getByRole('tab', { name: 'Medications' });
        await user.click(medicationsTab);
        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
          'Medications'
        );
      });

      it('can switch tab with FF medical-mui-tabs', async () => {
        window.featureFlags['medical-mui-tabs'] = true;
        const user = userEvent.setup();
        renderTestComponent(allPermissions);
        await screen.findByRole('tab', { name: 'Injury/ Illness' });

        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
          'Injury/ Illness'
        );
        const medicationsTab = screen.getByRole('tab', { name: 'Medications' });
        await user.click(medicationsTab);
        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
          'Medications'
        );
        window.featureFlags['medical-mui-tabs'] = false;
      });
    });

    describe('[FEATURE FLAG] dr-first-integration ON', () => {
      beforeEach(() => {
        window.featureFlags['dr-first-integration'] = true;
        window.featureFlags['medications-general-availability'] = false;
      });
      afterEach(() => {
        window.featureFlags['dr-first-integration'] = false;
      });

      it('renders the correct content', async () => {
        renderTestComponent(mockedDefaultPermissionsContextValue);

        await waitFor(() => {
          expect(
            screen.getByRole('tab', { name: 'Medications' })
          ).toBeInTheDocument();
        });
      });
    });

    describe('[FEATURE FLAG] medications-general-availability ON', () => {
      beforeEach(() => {
        window.featureFlags['medications-general-availability'] = true;
        window.featureFlags['dr-first-integration'] = false;
      });
      afterEach(() => {
        window.featureFlags['medications-general-availability'] = false;
      });

      it('renders the correct content', async () => {
        renderTestComponent(mockedDefaultPermissionsContextValue);

        await waitFor(() => {
          expect(
            screen.getByRole('tab', { name: 'Medications' })
          ).toBeInTheDocument();
        });
      });
    });

    describe('[FEATURE FLAG] dr-first-integration AND medications-general-availability OFF', () => {
      beforeEach(() => {
        window.featureFlags['medications-general-availability'] = false;
        window.featureFlags['dr-first-integration'] = false;
      });

      it('renders the correct content', async () => {
        renderTestComponent(mockedDefaultPermissionsContextValue);

        await waitFor(() => {
          expect(
            screen.queryByRole('tab', { name: 'Medications' })
          ).not.toBeInTheDocument();
        });
      });
    });
  });
});
