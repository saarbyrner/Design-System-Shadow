import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useToasts from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import { medicalGlobalAddButtonMenuItems } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import useDocuments from '@kitman/modules/src/Medical/shared/hooks/useDocuments';
import useEntityAttachments from '@kitman/modules/src/Medical/shared/hooks/useEntityAttachments';
import MedicalFilesTab from '..';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));
jest.mock('@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useDocuments');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useEntityAttachments');

const props = {
  athleteData: {
    id: 1,
  },
  issueId: 'Injury_1',
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  addDiagnosticSidePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addMedicalNotePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addModificationSidePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addTreatmentsSidePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addAllergySidePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addMedicalAlertSidePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addProcedureSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addConcussionTestResultsSidePanel: {
    isOpen: false,
    initialInfo: {
      testProtocol: 'NPC',
    },
  },
  addTUESidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: false,
    },
  },
  addWorkersCompSidePanel: {
    initialInfo: {},
    isOpen: false,
    page: 1,
    submitModal: {
      isOpen: true,
      formState: {},
    },
    claimInformation: {
      personName: null,
      contactNumber: null,
      policyNumber: null,
      lossDate: null,
      lossTime: null,
      lossCity: null,
      lossState: null,
      lossJurisdiction: null,
      lossDescription: null,
    },
    additionalInformation: {
      firstName: null,
      lastName: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      zipCode: null,
      phoneNumber: null,
    },
    showPrintPreview: {
      card: false,
      sidePanel: false,
    },
  },
  addOshaFormSidePanel: {
    isOpen: false,
    page: 1,
    initialInformation: {},
    employeeDrInformation: {},
    caseInformation: {},
    showPrintPreview: {
      card: false,
      sidePanel: false,
    },
  },
  medicalHistory: {},
  globalApi: {},
  medicalApi: {},
  medicalSharedApi: {},
  toasts: [],
});

describe('MedicalFilesTab', () => {
  const mockFetchDocuments = jest.fn().mockResolvedValue(undefined);
  const mockFetchAttachments = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        medical: {
          documents: {
            canCreate: true,
          },
          alerts: { canCreate: false },
          allergies: { canCreate: false },
          privateNotes: { canCreate: false },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    });
    useToasts.mockReturnValue({
      toasts: [],
    });

    useDocuments.mockReturnValue({
      documents: [],
      fetchDocuments: mockFetchDocuments,
      resetDocuments: jest.fn(),
      resetNextPage: jest.fn(),
      nextPage: null,
    });

    useEntityAttachments.mockReturnValue({
      attachments: [],
      fetchAttachments: mockFetchAttachments,
      resetAttachments: jest.fn(),
      resetNextPageToken: jest.fn(),
      nextPageToken: null,
    });
  });
  it('renders correctly', async () => {
    render(
      <Provider store={store}>
        <MedicalFilesTab {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Documents', level: 3 })
      ).toBeInTheDocument();
    });
  });

  describe('[feature-flag] medical-global-add-button-fix', () => {
    beforeEach(() => {
      window.setFlag('pm-show-tue', true);
      usePermissions.mockReturnValue({
        permissions: {
          medical: {
            documents: { canCreate: true },
            alerts: { canCreate: false },
            allergies: { canCreate: false },
            privateNotes: { canCreate: false },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
    });

    it('renders correctly when FF is off', async () => {
      window.featureFlags['medical-global-add-button-fix'] = false;
      
      render(
        <Provider store={store}>
          <MedicalFilesTab {...props} scopeToLevel="issue" />
        </Provider>
      );

      await screen.findByRole('heading', { name: 'Documents', level: 3 });

      medicalGlobalAddButtonMenuItems
        .filter((item) => !['document'].includes(item.id))
        .forEach((item) => {
          expect(screen.queryAllByText(item.modalTitle).length).toEqual(0);
        });
    });

    it('renders correctly when FF is on', async () => {
      window.featureFlags['medical-global-add-button-fix'] = true;

      render(
        <Provider store={store}>
          <MedicalFilesTab {...props} scopeToLevel="issue" />
        </Provider>
      );

      await waitFor(() => {
        medicalGlobalAddButtonMenuItems.forEach((item) => {
          expect(
            screen.getAllByText(item.modalTitle).length
          ).toBeGreaterThanOrEqual(1);
        });
      });

      window.featureFlags['medical-global-add-button-fix'] = false;
    });
  });

  describe('createIssueOccurrence behavior', () => {
    afterEach(() => {
      // Clean up feature flags
      window.featureFlags['medical-files-tab-enhancement'] = false;
    });

    it('correctly sets issue_occurrence for a regular issue when enhancedFilesFlow is off', async () => {
      window.featureFlags['medical-files-tab-enhancement'] = false;
      const issueId = 'Issue_123';
      render(
        <Provider store={store}>
          <MedicalFilesTab {...props} issueId={issueId} />
        </Provider>
      );

      await waitFor(() => {
        expect(mockFetchDocuments).toHaveBeenCalledWith(
          expect.objectContaining({
            issue_occurrence: { id: 123, type: 'issue' },
          }),
          true
        );
      });
    });

    it('correctly sets issue_occurrence for a chronic issue when enhancedFilesFlow is off', async () => {
      window.featureFlags['medical-files-tab-enhancement'] = false;
      const issueId = 'ChronicIssue_456';
      render(
        <Provider store={store}>
          <MedicalFilesTab {...props} issueId={issueId} />
        </Provider>
      );

      await waitFor(() => {
        expect(mockFetchDocuments).toHaveBeenCalledWith(
          expect.objectContaining({
            issue_occurrence: {
              id: 456,
              type: 'chronic_issue',
            },
          }),
          true
        );
      });
    });

    it('correctly sets issue_occurrence for a regular issue when enhancedFilesFlow is on', async () => {
      window.featureFlags['medical-files-tab-enhancement'] = true;
      const issueId = 'Issue_789';
      render(
        <Provider store={store}>
          <MedicalFilesTab {...props} issueId={issueId} />
        </Provider>
      );

      await waitFor(() => {
        expect(mockFetchAttachments).toHaveBeenCalledWith(
          expect.objectContaining({
            issue_occurrence: { id: 789, type: 'issue' },
          }),
          true
        );
      });
    });

    it('correctly sets issue_occurrence for a chronic issue when enhancedFilesFlow is on', async () => {
      window.featureFlags['medical-files-tab-enhancement'] = true;
      const issueId = 'ChronicIssue_1011';
      render(
        <Provider store={store}>
          <MedicalFilesTab {...props} issueId={issueId} />
        </Provider>
      );

      await waitFor(() => {
        expect(mockFetchAttachments).toHaveBeenCalledWith(
          expect.objectContaining({
            issue_occurrence: {
              id: 1011,
              type: 'Emr::Private::Models::ChronicIssue',
            },
          }),
          true
        );
      });
    });
  });
});
