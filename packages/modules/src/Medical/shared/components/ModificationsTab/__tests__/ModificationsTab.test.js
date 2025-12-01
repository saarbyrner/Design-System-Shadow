import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { getClinicalImpressionsBodyAreas } from '@kitman/services';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useCurrentUser from '@kitman/modules/src/Medical/shared/hooks/useGetCurrentUser';
import useModificationNotes from '@kitman/modules/src/Medical/shared/hooks/useModificationNotes';
import { medicalGlobalAddButtonMenuItems } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { data as mockedModifications } from '@kitman/services/src/mocks/handlers/medical/getModifications';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';
import ModificationsTab from '@kitman/modules/src/Medical/shared/components/ModificationsTab';

jest.mock('@kitman/services');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useGetCurrentUser');
jest.mock(
  '@kitman/modules/src/Medical/shared/containers/AddModificationSidePanel',
  () => ({
    __esModule: true,
    default: jest.fn(({ onSaveModification }) => {
      global.mockOnSaveModification = onSaveModification;
      return 'Add modification'; // Test checks for title.
    }),
  })
);
jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));
jest.mock('@kitman/modules/src/Medical/shared/hooks/useModificationNotes');
jest.mock('@kitman/common/src/hooks/useEventTracking');

const trackEventMock = jest.fn();
const props = {
  athleteData: {
    id: 1,
  },
  t: i18nextTranslateStub(), // Correct way to add translation prop
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
  medicalApi: {},
  globalApi: {}, // Add globalApi to the store to resolve "No data found at `state.globalApi`" error
});

describe('ModificationsTab', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
    getClinicalImpressionsBodyAreas.mockResolvedValue([
      { id: 1, name: 'Head' },
      { id: 2, name: 'Arm' },
    ]);
    useCurrentUser.mockReturnValue({
      currentUser: {
        fullname: 'Name One',
        id: 1,
      },
      fetchCurrentUser: jest.fn(),
    });
    usePermissions.mockReturnValue({
      permissions: {
        medical: {
          modifications: {
            canCreate: true,
          },
          issues: { canView: true },
          documents: { canCreate: false },
          alerts: { canCreate: false },
          allergies: { canCreate: false },
          privateNotes: { canCreate: false },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    });
    useModificationNotes.mockReturnValue({
      modificationNotes: mockedModifications.medical_notes,
      fetchModificationNotes: jest.fn(() =>
        Promise.resolve(mockedModifications.medical_notes)
      ),
      resetNextPage: jest.fn(),
      resetModificationNotes: jest.fn(),
    });
  });
  it('renders the correct content', async () => {
    render(
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ModificationsTab {...props} />
        </LocalizationProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Modifications', level: 3 })
      ).toBeInTheDocument();
      // Assuming ModificationsFiltersContainer has a heading or a distinct element
      expect(screen.getAllByPlaceholderText('Search')[0]).toBeInTheDocument(); // Use getAllByPlaceholderText and select the first one
      // Assuming InfiniteScrollLayout renders the modification items
      expect(
        screen.getByText(mockedModifications.medical_notes[0].title)
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedModifications.medical_notes[1].title)
      ).toBeInTheDocument();
    });
  });

  describe('when the issue is an injury', () => {
    it('fetches modifications with the correct injuryId', async () => {
      const mockFetchModificationNotes = jest.fn(() =>
        Promise.resolve(mockedModifications.medical_notes)
      );
      useModificationNotes.mockReturnValue({
        modificationNotes: mockedModifications.medical_notes,
        fetchModificationNotes: mockFetchModificationNotes,
        resetNextPage: jest.fn(),
        resetModificationNotes: jest.fn(),
      });

      render(
        <Provider store={store}>
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              issue: { ...mockedIssueContextValue.issue, id: '456' },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <ModificationsTab {...props} />
            </LocalizationProvider>
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(mockFetchModificationNotes).toHaveBeenCalledWith(
          expect.objectContaining({
            issue_occurrence: { id: '456', type: 'injury' },
            organisation_annotation_type: [
              'OrganisationAnnotationTypes::Modification',
            ],
            organisation_annotation_type_ids: [],
            squads: [],
          }),
          true
        );
      });
    });
  });

  describe('when the issue is an illness', () => {
    it('fetches modifications with the correct illnessId', async () => {
      const mockFetchModificationNotes = jest.fn(() =>
        Promise.resolve(mockedModifications.medical_notes)
      );
      useModificationNotes.mockReturnValue({
        modificationNotes: mockedModifications.medical_notes,
        fetchModificationNotes: mockFetchModificationNotes,
        resetNextPage: jest.fn(),
        resetModificationNotes: jest.fn(),
      });

      render(
        <Provider store={store}>
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              issue: {
                ...mockedIssueContextValue.issue,
                id: '789',
              },
              issueType: 'Illness',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <ModificationsTab {...props} />
            </LocalizationProvider>
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(mockFetchModificationNotes).toHaveBeenCalledWith(
          expect.objectContaining({
            issue_occurrence: {
              id: '789',
              type: 'illness',
            },
          }),
          true
        );
      });
    });
  });

  describe('when the user creates a new modification', () => {
    it('refetches the modifications', async () => {
      const mockFetchModificationNotes = jest.fn(() =>
        Promise.resolve(mockedModifications.medical_notes)
      );
      useModificationNotes.mockReturnValue({
        modificationNotes: mockedModifications.medical_notes,
        fetchModificationNotes: mockFetchModificationNotes,
        resetNextPage: jest.fn(),
        resetModificationNotes: jest.fn(),
      });

      render(
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ModificationsTab {...props} />
          </LocalizationProvider>
        </Provider>
      );

      // Wait for initial fetch
      await waitFor(() => {
        expect(mockFetchModificationNotes).toHaveBeenCalledTimes(1);
      });

      // Simulate saving a new modification
      if (global.mockOnSaveModification) {
        global.mockOnSaveModification();
      }

      // Wait for refetch
      await waitFor(() => {
        expect(mockFetchModificationNotes).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('when there are no modifications', () => {
    it('renders the no modifications text', async () => {
      useModificationNotes.mockReturnValue({
        modificationNotes: [],
        fetchModificationNotes: jest.fn(() => Promise.resolve([])),
        resetNextPage: jest.fn(),
        resetModificationNotes: jest.fn(),
      });

      render(
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ModificationsTab {...props} />
          </LocalizationProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(
          screen.getByText('No modifications for this period')
        ).toBeInTheDocument();
      });
    });
  });

  describe('when the initial request fails', () => {
    it('shows an error message', async () => {
      useModificationNotes.mockReturnValue({
        modificationNotes: [],
        fetchModificationNotes: jest.fn(() =>
          Promise.reject(new Error('API Error'))
        ),
        resetNextPage: jest.fn(),
        resetModificationNotes: jest.fn(),
        isError: true, // Indicate error state
      });

      render(
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ModificationsTab {...props} />
          </LocalizationProvider>
        </Provider>
      );
      await waitForElementToBeRemoved(screen.queryByText('Loading ...'));

      await waitFor(() => {
        // AppStatus error status
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });
    });
  });

  describe('[feature-flag] medical-global-add-button-fix', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: {
            modifications: {
              canCreate: true,
            },
            issues: { canView: true },
            documents: { canCreate: false },
            alerts: { canCreate: false },
            allergies: { canCreate: false },
            privateNotes: { canCreate: false },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
    });

    it('renders correctly when FF is off', () => {
      window.setFlag('medical-global-add-button-fix', false);

      render(
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ModificationsTab {...props} scopeToLevel="issue" />
          </LocalizationProvider>
        </Provider>
      );

      medicalGlobalAddButtonMenuItems
        .filter((item) => !['modification', 'document'].includes(item.id))
        .forEach((item) => {
          expect(screen.queryAllByText(item.modalTitle).length).toEqual(0);
        });
    });

    it('renders correctly when FF is on', async () => {
      window.featureFlags['medical-global-add-button-fix'] = true;
      window.setFlag('pm-show-tue', true);

      render(
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ModificationsTab {...props} scopeToLevel="issue" />
          </LocalizationProvider>
        </Provider>
      );

      await waitFor(() => {
        medicalGlobalAddButtonMenuItems
          .filter((item) => item.id !== 'document')
          .forEach((item) => {
            expect(
              screen.getAllByText(item.modalTitle).length
            ).toBeGreaterThanOrEqual(1);
          });
      });
    });
  });
});
