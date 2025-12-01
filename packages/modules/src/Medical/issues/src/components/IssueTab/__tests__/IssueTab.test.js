import { screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import { renderWithProvider } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';

import {
  mockedDefaultPermissionsContextValue,
  medicalGlobalAddButtonMenuItems,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import {
  MockedIssueContextProvider,
  mockedIssueContextValue,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';
import store from '@kitman/modules/src/Medical/issues/src/redux/store';
import { IssueContextProvider } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';
import useCurrentUser from '@kitman/modules/src/Medical/shared/hooks/useGetCurrentUser';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import useIssueFields from '@kitman/modules/src/Medical/shared/hooks/useIssueFields';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import useModificationNotes from '@kitman/modules/src/Medical/shared/hooks/useModificationNotes';
import { data as mockedModifications } from '@kitman/services/src/mocks/handlers/medical/getModifications';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';

import IssueTab from '..';

jest.mock('@kitman/modules/src/Medical/shared/hooks/useGetCurrentUser');
jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useModificationNotes');
let mockFetchModificationNotes;
let mockExpireModification;
const mockSaveIssue = jest.fn(); // Declare and initialize mockSaveIssue here

jest.mock('@kitman/services/src/services/medical/saveIssue', () => ({
  __esModule: true,
  default: (...args) => mockSaveIssue(...args), // Use the mockSaveIssue variable
}));

const mockUseIssueFields = {
  validate: (fields) => {
    const validateArr = [];
    Object.keys(fields).forEach((field) => {
      if (!fields[field]) validateArr.push(field);
    });
    return validateArr;
  },
  getFieldLabel: (name) => name,
  isFieldVisible: () => true,
  fieldConfigRequestStatus: 'SUCCESS',
};

jest.mock('@kitman/modules/src/Medical/shared/hooks/useIssueFields', () =>
  jest.fn(() => mockUseIssueFields)
);

const mockAthleteData = (orgIds) => {
  return {
    org_last_transfer_record: {
      transfer_type: 'Trade',
      joined_at: null,
      left_at: '2022-11-22T05:01:08-05:00',
      data_sharing_consent: true,
    },
    organisation_ids: [...orgIds],
  };
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => Object.assign({}, state, {}),
});

const rootReducer = combineReducers({
  [globalApi.reducerPath]: globalApi.reducer,
  [medicalApi.reducerPath]: medicalApi.reducer,
  [medicalSharedApi.reducerPath]: medicalSharedApi.reducer,
  // Add other reducers from the actual store if needed for specific tests
  addDiagnosticSidePanel: (
    state = { isOpen: false, initialInfo: { isAthleteSelectable: true } }
  ) => state,
  addDiagnosticLinkSidePanel: (
    state = { isOpen: false, diagnosticId: null, athleteId: null }
  ) => state,
  addMedicalNotePanel: (
    state = { isOpen: false, initialInfo: { isAthleteSelectable: true } }
  ) => state,
  addMedicationSidePanel: (
    state = { isOpen: false, initialInfo: { isAthleteSelectable: true } }
  ) => state,
  addModificationSidePanel: (
    state = { isOpen: false, initialInfo: { isAthleteSelectable: true } }
  ) => state,
  addTreatmentsSidePanel: (
    state = { isOpen: false, initialInfo: { isAthleteSelectable: true } }
  ) => state,
  addAllergySidePanel: (
    state = { isOpen: false, initialInfo: { isAthleteSelectable: true } }
  ) => state,
  addMedicalAlertSidePanel: (
    state = { isOpen: false, initialInfo: { isAthleteSelectable: true } }
  ) => state,
  addProcedureSidePanel: (
    state = { isOpen: false, initialInfo: { isAthleteSelectable: true } }
  ) => state,
  addConcussionTestResultsSidePanel: (
    state = {
      isOpen: false,
      initialInfo: { testProtocol: 'NPC', isAthleteSelectable: true },
    }
  ) => state,
  addConcussionAssessmentSidePanel: (
    state = { isOpen: false, initialInfo: { isAthleteSelectable: true } }
  ) => state,
  addTUESidePanel: (
    state = { isOpen: false, initialInfo: { isAthleteSelectable: false } }
  ) => state,
  addWorkersCompSidePanel: (
    state = {
      isOpen: false,
      page: 1,
      submitModal: { isOpen: true, formState: {} },
      showPrintPreview: { sidePanel: false, card: false },
      claimInformation: {
        personName: '',
        contactNumber: '',
        policyNumber: '',
        lossDate: '',
        lossTime: '',
        lossCity: '',
        lossState: '',
        lossJurisdiction: '',
        lossDescription: '',
        side: '',
        sideName: '',
        bodyArea: '',
        bodyAreaName: '',
      },
      additionalInformation: {
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
      },
    }
  ) => state,
  addOshaFormSidePanel: (
    state = {
      isOpen: false,
      page: 1,
      showPrintPreview: { sidePanel: false, card: false },
      initialInformation: {
        issueDate: null,
        reporter: { label: '', value: null },
        reporterPhoneNumber: '',
        title: '',
      },
      employeeDrInformation: {
        city: '',
        dateHired: null,
        dateOfBirth: null,
        emergencyRoom: false,
        facilityCity: '',
        facilityName: '',
        facilityState: '',
        facilityStreet: '',
        facilityZip: '',
        fullName: '',
        hospitalized: false,
        physicianFullName: '',
        sex: 'M',
        state: '',
        street: '',
        zip: '',
      },
      caseInformation: {
        athleteActivity: '',
        caseNumber: '',
        dateInjured: null,
        dateOfDeath: null,
        issueDescription: '',
        noTimeEvent: false,
        objectSubstance: '',
        timeBeganWork: '',
        timeEvent: '',
        whatHappened: '',
      },
    }
  ) => state,
  selectAthletesSidePanel: (state = { isOpen: false }) => state,
  treatmentCardList: (
    state = { athleteTreatments: {}, invalidEditTreatmentCards: [] }
  ) => state,
  toasts: (state = []) => state,
  medicalHistory: (state = {}) => state,
});

const mockStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      globalApi.middleware,
      medicalApi.middleware,
      medicalSharedApi.middleware
    ),
});

describe('<IssueTab />', () => {
  const props = {
    athleteId: mockedIssueContextValue.issue.athlete_id,
    athleteData: { athlete_id: mockedIssueContextValue.issue.athlete_id },
  };
  const organisationId = 1;

  const united = {
    id: 1,
  };

  const madrid = {
    id: 2,
  };

  const mockAthleteDataForPlayerLeftForm = (orgIds = [1]) => {
    return {
      org_last_transfer_record: {
        transfer_type: 'Trade',
        joined_at: null,
        left_at: '2022-11-22T05:01:08-05:00',
        data_sharing_consent: true,
      },
      organisation_ids: [...orgIds],
    };
  };

  const mountWrapper = ({
    issueOwner,
    viewingOrg,
    playerOrg,
    playerLeftClub,
    isClosed = false,
  }) => {
    return renderWithProvider(
      <I18nextProvider i18n={i18n}>
        <MockedPermissionContextProvider
          permissionsContext={mockedDefaultPermissionsContextValue}
        >
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: viewingOrg },
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  organisation_id: issueOwner,
                  player_left_club: playerLeftClub,
                  closed: isClosed,
                },
                issueType: 'Injury',
                requestStatus: 'SUCCESS',
              }}
            >
              <IssueTab
                {...props}
                athleteData={mockAthleteDataForPlayerLeftForm([playerOrg])}
              />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        </MockedPermissionContextProvider>
      </I18nextProvider>,
      mockStore
    );
  };

  const renderIssueTabWithPermissions = (canEditMedicalIssues = true) => {
    return renderWithProvider(
      <I18nextProvider i18n={i18n}>
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...mockedDefaultPermissionsContextValue.permissions.medical,
                issues: { canEdit: canEditMedicalIssues },
              },
            },
          }}
        >
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: organisationId },
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  events: [],
                },
              }}
            >
              <IssueTab
                {...props}
                athleteData={{
                  ...mockAthleteData([2]),
                }}
                scopeToLevel="issue"
              />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        </MockedPermissionContextProvider>
      </I18nextProvider>,
      mockStore
    );
  };

  const getSectionElements = () => {
    const injuryDetailSection =
      screen.getByText('Injury details').parentNode.parentNode;
    const pathologySection =
      screen.getByText('Primary Pathology').parentNode.parentNode;
    const eventDetailsSection =
      screen.getByText('Event details').parentNode.parentNode;
    const additionalInformationSection = screen.getByText(
      'Additional information'
    ).parentNode.parentNode;

    const injuryDetailEditButton = injuryDetailSection.querySelector('button');
    const pathologyEditButton = pathologySection.querySelector('button');
    const eventDetailsEditButton = eventDetailsSection.querySelector('button');
    const additionalInfoEditButton =
      additionalInformationSection.querySelector('button');

    return {
      injuryDetailSection,
      pathologySection,
      eventDetailsSection,
      additionalInformationSection,
      injuryDetailEditButton,
      pathologyEditButton,
      eventDetailsEditButton,
      additionalInfoEditButton,
    };
  };

  beforeEach(() => {
    useCurrentUser.mockReturnValue({
      currentUser: {
        fullname: 'Name One',
        id: 1,
      },
      fetchCurrentUser: jest.fn(),
    });

    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });

    mockFetchModificationNotes = jest.fn();
    mockExpireModification = jest.fn();
    mockSaveIssue.mockResolvedValue({}); // Set mockResolvedValue on the already initialized mockSaveIssue
    useModificationNotes.mockReturnValue({
      modificationNotes: [], // Default to empty array for better isolation
      fetchModificationNotes: mockFetchModificationNotes,
      expireModificationNote: mockExpireModification,
      resetNextPage: jest.fn(),
      resetModificationNotes: jest.fn(),
    });

    window.setFlag('pm-show-tue', true);
    window.setFlag('nfl-player-movement-trade', true);
    window.setFlag('files-and-links-on-injuries', true); // Added from spec file

    server.use(
      rest.patch(
        `/athletes/${props.athleteId}/injuries/${mockedIssueContextValue.issue.id}/player_left_club`,
        (req, res, ctx) =>
          res(
            ctx.json({
              athlete_id: props.athleteId,
              player_left_club: true,
              issueOccurenceId: mockedIssueContextValue.issue.id,
            })
          )
      ),
      rest.put(
        `/athletes/${props.athleteId}/injuries/${mockedIssueContextValue.issue.id}`,
        (req, res, ctx) => {
          return res(ctx.json({ success: true }));
        }
      )
    );
  });

  afterEach(() => {
    window.setFlag('nfl-player-movement-trade', false);
    window.setFlag('files-and-links-on-injuries', false); // Added from spec file
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('[permissions] permissions.medical.modifications.canView', () => {
    beforeEach(() => {
      window.setFlag('nfl-player-movement-trade', false); // Explicitly disable for this block
      server.use(
        rest.get(
          `/athletes/${props.athleteId}/injuries/${mockedIssueContextValue.issue.id}`,
          (req, res, ctx) =>
            res(
              ctx.json({
                ...mockedIssueContextValue.issue,
                organisation_id: organisationId,
                player_left_club: false,
                closed: false,
                events: [],
              })
            )
        )
      );
    });
    afterEach(() => {
      window.setFlag('nfl-player-movement-trade', true); // Reset to global default
    });

    describe('when the permission is false', () => {
      beforeEach(() => {
        mockFetchModificationNotes.mockResolvedValue({
          medical_notes: [],
          meta: { next_page: null },
        });
      });

      it('renders the correct content when modifications permission is false', async () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  modifications: {
                    canView: false,
                  },
                },
              },
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
              }}
            >
              <IssueTab {...props} />
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(
          screen.queryByTestId('IssueTab|SectionLoader')
        ).not.toBeInTheDocument();
        expect(screen.getByText('Injury details')).toBeInTheDocument();
        expect(screen.getByText('Event details')).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByText('Availability history')).toBeInTheDocument();
        });

        const headings = screen.getAllByRole('heading', {
          level: 2,
          hidden: true,
        });

        expect(headings).toHaveLength(5);
        expect(headings[0]).toHaveTextContent('Injury details');
        expect(headings[1]).toHaveTextContent('Primary Pathology');
        expect(headings[2]).toHaveTextContent('Event details');
        expect(headings[3]).toHaveTextContent('Availability history');
        expect(headings[4]).toHaveTextContent('Attachments');

        await waitFor(() => {
          expect(
            screen.queryByText('Active Modifications')
          ).not.toBeInTheDocument();
        });
      });

      it('does not make the request to fetch modifications when modifications permission is false', async () => {
        mockFetchModificationNotes.mockClear(); // Clear previous mock calls

        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={mockedDefaultPermissionsContextValue}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
              }}
            >
              <IssueTab {...props} />
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(mockFetchModificationNotes).not.toHaveBeenCalled();
      });

      it('does not render the event details when the issue type is Illness and modifications permission is false', async () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  modifications: {
                    canView: false,
                  },
                },
              },
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issueType: 'Illness',
              }}
            >
              <IssueTab {...props} />
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(screen.queryByText('Event details')).not.toBeInTheDocument();
      });
    });

    describe('when the permission is true', () => {
      beforeEach(() => {
        mockFetchModificationNotes.mockResolvedValue({
          medical_notes: mockedModifications.medical_notes,
          meta: { next_page: null },
        });
        useModificationNotes.mockReturnValue({
          // Explicitly set modificationNotes for this describe block
          modificationNotes: mockedModifications.medical_notes,
          fetchModificationNotes: mockFetchModificationNotes,
          expireModificationNote: mockExpireModification,
          resetNextPage: jest.fn(),
          resetModificationNotes: jest.fn(),
        });
      });

      it('renders the correct content when modifications permission is true', async () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  modifications: {
                    canView: true,
                    canEdit: true,
                  },
                  alerts: {
                    canView: false,
                  },
                },
              },
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <IssueTab {...props} />
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        await waitFor(() => {
          expect(screen.getByText('Availability history')).toBeInTheDocument();
        });

        const headings = screen.getAllByRole('heading', {
          level: 2,
          hidden: true,
        });

        expect(headings).toHaveLength(6);
        expect(headings[0]).toHaveTextContent('Injury details');
        expect(headings[1]).toHaveTextContent('Primary Pathology');
        expect(headings[2]).toHaveTextContent('Event details');
        expect(headings[3]).toHaveTextContent('Active modifications');
        expect(headings[4]).toHaveTextContent('Availability history');
        expect(headings[5]).toHaveTextContent('Attachments');

        expect(
          screen.getAllByText(mockedModifications.medical_notes[0].title)
        ).toHaveLength(2);
        expect(
          screen.getAllByText(mockedModifications.medical_notes[1].title)
        ).toHaveLength(2);
      });

      describe('when deactivating an active modification', () => {
        it('calls the correct endpoints when deactivating an active modification', async () => {
          mockExpireModification.mockResolvedValue({
            id: mockedModifications.medical_notes[0].id,
            title: mockedModifications.medical_notes[0].title,
            status: 'expired',
          });
          mockFetchModificationNotes.mockResolvedValue({
            medical_notes: mockedModifications.medical_notes,
            meta: { next_page: null },
          });

          const user = userEvent.setup();
          renderWithProvider(
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedDefaultPermissionsContextValue,
                permissions: {
                  ...mockedDefaultPermissionsContextValue.permissions,
                  medical: {
                    ...mockedDefaultPermissionsContextValue.permissions.medical,
                    modifications: {
                      canView: true,
                      canEdit: true,
                    },
                    alerts: {
                      canView: false,
                    },
                  },
                },
              }}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <IssueTab {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>,
            mockStore
          );

          const firstActions = screen.getAllByTestId(
            'PresentationView|Actions'
          )[0];

          const tooltipMenuButton = within(firstActions).getByRole('button', {
            hidden: true,
          });
          await user.click(tooltipMenuButton);
          const deactivateButton = screen.getByTestId(
            'TooltipMenu|ListItemButton'
          );
          expect(deactivateButton).toHaveTextContent('Deactivate');

          await user.click(deactivateButton);

          expect(mockExpireModification).toHaveBeenCalledWith(
            mockedModifications.medical_notes[0].id
          );
        });
      });
    });

    describe('when the request to fetch the active modifications fails', () => {
      beforeEach(() => {
        mockFetchModificationNotes.mockRejectedValue(
          new Error('Error fetching modifications')
        );
      });

      it('shows an error message when the request to fetch active modifications fails', async () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  modifications: {
                    canView: true,
                  },
                },
              },
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <IssueTab {...props} />
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );
        await waitFor(() => {
          expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
          expect(screen.getByText('Go back and try again')).toBeInTheDocument();
        });
      });
    });

    describe('when a user saves a new link in attachments', () => {
      it('sends a request to saveIssue when a new link is saved in attachments', async () => {
        const user = userEvent.setup();
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={mockedDefaultPermissionsContextValue}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                isReadOnly: false,
              }}
            >
              <IssueTab {...props} />
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        await waitFor(() => {
          expect(screen.getByText('Availability history')).toBeInTheDocument();
        });

        const headings = screen.getAllByRole('heading', {
          level: 2,
          hidden: true,
        });

        expect(headings).toHaveLength(5);
        expect(headings[0]).toHaveTextContent('Injury details');
        expect(headings[1]).toHaveTextContent('Primary Pathology');
        expect(headings[2]).toHaveTextContent('Event details');
        expect(headings[3]).toHaveTextContent('Availability history');
        expect(headings[4]).toHaveTextContent('Attachments');

        const addButton = within(headings[4].parentNode).getByRole('button', {
          hidden: true,
        });
        await user.click(addButton);

        const tooltipMenuItems = screen.getAllByTestId(
          'TooltipMenu|ListItemButton'
        );
        expect(tooltipMenuItems[0]).toHaveTextContent('File');
        expect(tooltipMenuItems[1]).toHaveTextContent('Link');
        await user.click(tooltipMenuItems[1]);

        const linkPanel = screen.getByText('Add Link to Injury/Illness')
          .parentNode.parentNode;

        const titleInput = within(linkPanel).getByLabelText('Title');
        const urlInput = within(linkPanel).getByLabelText('Link');

        fireEvent.change(titleInput, {
          target: { value: 'Test Link 1' },
        });

        fireEvent.change(urlInput, {
          target: { value: 'testlink.com' },
        });
        fireEvent.blur(titleInput);
        fireEvent.blur(urlInput);
        const addLinkButton = within(linkPanel).getByRole('button', {
          name: 'Add',
          hidden: true,
        }); // Add button
        await user.click(addLinkButton);

        const saveButton = screen.getByTestId('links-save-button');
        await waitFor(() => expect(saveButton).toBeEnabled()); // Wait for the button to be enabled
        await user.click(saveButton);
        await waitFor(() => {
          expect(mockSaveIssue).toHaveBeenCalledWith(
            mockedIssueContextValue.issueType,
            mockedIssueContextValue.issue,
            { attached_links: [{ title: 'Test Link 1', uri: 'testlink.com' }] }
          );
        });
      });
    });

    describe('when the issue is read only', () => {
      it('renders correct content regardless of permissions when issue is read only', async () => {
        mockFetchModificationNotes.mockResolvedValue({
          medical_notes: mockedModifications.medical_notes,
          meta: { next_page: null },
        });

        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  modifications: {
                    canView: true,
                    canEdit: true,
                  },
                  alerts: {
                    canView: false,
                  },
                },
              },
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                isReadOnly: true,
              }}
            >
              <IssueTab {...props} />
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        await waitFor(() => {
          expect(
            screen.queryByText('Active Modifications')
          ).not.toBeInTheDocument(); // Expect not to be in the document
        });
        expect(
          screen.queryByRole('button', { name: /menu/i })
        ).not.toBeInTheDocument(); // No TooltipMenu (meatball menu)
      });
    });
  });

  describe('[feature flag] nfl-player-movement-trade', () => {
    beforeEach(() => {
      server.use(
        rest.get(
          `/athletes/${props.athleteId}/injuries/${mockedIssueContextValue.issue.id}`,
          (req, res, ctx) =>
            res(
              ctx.json({
                ...mockedIssueContextValue.issue,
                organisation_id: organisationId,
                player_left_club: false,
                closed: false,
                events: [],
              })
            )
        )
      );
    });

    it('resets the availability form when marking a player as leaving the club', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...mockedDefaultPermissionsContextValue.permissions.medical,
                issues: { canEdit: true },
              },
            },
          }}
        >
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: organisationId },
            }}
          >
            <IssueContextProvider
              athleteId={props.athleteId}
              issueType="Injury"
              issueId={mockedIssueContextValue.issue.id}
              isChronicIssue={false}
              organisationId={organisationId}
            >
              <IssueTab
                {...props}
                athleteData={{
                  ...mockAthleteData([2]),
                }}
              />
            </IssueContextProvider>
          </MockedOrganisationContextProvider>
        </MockedPermissionContextProvider>,
        mockStore
      );

      /*
       * When the issue is open and the player is in another organisation owned by the current organisation
       * it shows a banner for updating the status of the player
       */
      await waitFor(() => {
        expect(screen.getByText('Action Required')).toBeInTheDocument();
        expect(
          screen.getByText(
            'Player moved on 22 Nov 2022. Update status or mark as player left club.'
          )
        ).toBeInTheDocument();
      });

      // Start editing the availability history
      const availabilityHistorySection = screen.getByTestId(
        'AvailabilityHistory'
      );
      // Add button
      const addButton = within(availabilityHistorySection).getByRole('button', {
        hidden: true,
      });
      await userEvent.click(addButton);

      // It should show the availability history form
      expect(
        within(availabilityHistorySection).getByRole('button', {
          name: /Save/i,
          hidden: true,
        })
      ).toBeInTheDocument();

      // Mark as player as left club
      await userEvent.click(
        screen.getByRole('button', { name: /Update/i, hidden: true })
      );

      await waitFor(() => {
        expect(
          within(screen.getByTestId('PlayerLeftForm|Wrapper')).getByRole(
            'switch',
            { hidden: true }
          )
        ).toBeInTheDocument();
      });

      await userEvent.click(
        within(screen.getByTestId('PlayerLeftForm|Wrapper')).getByRole(
          'switch',
          { hidden: true }
        )
      );
      await userEvent.click(
        within(screen.getByTestId('PlayerLeftForm|LeftClubState')).getByRole(
          'button',
          {
            name: /Save/i,
            hidden: true,
          }
        )
      );

      // Once saved, the availability history form is reset
      expect(
        within(screen.getByTestId('AvailabilityHistory')).queryByRole(
          'button',
          {
            name: /Save/i,
            hidden: true,
          }
        )
      ).not.toBeInTheDocument();
      expect(
        within(screen.getByTestId('AvailabilityHistory')).getByRole('button', {
          name: /Add/i,
          hidden: true,
        })
      ).toBeInTheDocument();
    }, 30000);

    describe('Rendering of the <PlayerLeftForm/> Component', () => {
      describe('[feature flag] modifiable-player-left-club', () => {
        beforeEach(() => {
          window.setFlag('modifiable-player-left-club', true);
        });

        afterEach(() => {
          window.setFlag('modifiable-player-left-club', false);
        });

        it('NOT RENDERED when issue_owner: UNITED and player_org: UNITED and current_org: UNITED', async () => {
          mountWrapper({
            issueOwner: united.id,
            playerOrg: united.id,
            viewingOrg: united.id,
            playerLeftClub: false,
          });
          await waitFor(() => {
            expect(
              screen.queryByTestId('PlayerLeftForm|LeftClubState')
            ).not.toBeInTheDocument();
          });
        });

        it('NOT RENDERED when issue_owner: MADRID and player_org: UNITED and current_org: UNITED and player_left_club: FALSE', async () => {
          mountWrapper({
            issueOwner: madrid.id,
            playerOrg: united.id,
            viewingOrg: united.id,
            playerLeftClub: false,
          });
          await waitFor(() => {
            expect(
              screen.queryByTestId('PlayerLeftForm|LeftClubState')
            ).not.toBeInTheDocument();
          });
        });

        it('RENDERED when issue_owner: MADRID and player_org: UNITED and current_org: UNITED and player_left_club: TRUE', async () => {
          mountWrapper({
            issueOwner: madrid.id,
            playerOrg: united.id,
            viewingOrg: united.id,
            playerLeftClub: true,
          });
          await waitFor(() => {
            expect(
              screen.getByTestId('PlayerLeftForm|LeftClubState')
            ).toBeInTheDocument();
          });
        });

        it('RENDERED when issue_owner: UNITED and player_org: MADRID and current_org: UNITED and player_left_club: TRUE', async () => {
          mountWrapper({
            issueOwner: united.id,
            playerOrg: madrid.id,
            viewingOrg: united.id,
            playerLeftClub: true,
          });
          await waitFor(() => {
            expect(
              screen.getByTestId('PlayerLeftForm|LeftClubState')
            ).toBeInTheDocument();
          });
        });

        it('RENDERED when issue_owner: UNITED and player_org: UNITED and current_org: UNITED and player_left_club: TRUE', async () => {
          mountWrapper({
            issueOwner: united.id,
            playerOrg: united.id,
            viewingOrg: united.id,
            playerLeftClub: true,
          });
          await waitFor(() => {
            expect(
              screen.getByTestId('PlayerLeftForm|LeftClubState')
            ).toBeInTheDocument();
          });
        });

        it('does not render the component when viewing a closed issue', async () => {
          mountWrapper({
            issueOwner: united.id,
            playerOrg: united.id,
            viewingOrg: united.id,
            playerLeftClub: true,
            isClosed: true,
          });
          await waitFor(() => {
            expect(
              screen.queryByTestId('PlayerLeftForm|LeftClubState')
            ).not.toBeInTheDocument();
          });
        });
      });

      it('NOT RENDERED when issue_owner: UNITED and player_org: UNITED and current_org: UNITED', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: false,
        });
        await waitFor(() => {
          expect(
            screen.queryByTestId('PlayerLeftForm|LeftClubState')
          ).not.toBeInTheDocument();
        });
      });

      it('NOT RENDERED when issue_owner: MADRID and player_org: UNITED and current_org: UNITED and player_left_club: FALSE', async () => {
        mountWrapper({
          issueOwner: madrid.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: false,
        });
        await waitFor(() => {
          expect(
            screen.queryByTestId('PlayerLeftForm|LeftClubState')
          ).not.toBeInTheDocument();
        });
      });

      it('RENDERED when issue_owner: MADRID and player_org: UNITED and current_org: UNITED and player_left_club: TRUE', async () => {
        mountWrapper({
          issueOwner: madrid.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: true,
        });
        await waitFor(() => {
          expect(
            screen.getByTestId('PlayerLeftForm|LeftClubState')
          ).toBeInTheDocument();
        });
      });

      it('RENDERED when issue_owner: UNITED and player_org: MADRID and current_org: UNITED and player_left_club: TRUE', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: madrid.id,
          viewingOrg: united.id,
          playerLeftClub: true,
        });
        await waitFor(() => {
          expect(
            screen.getByTestId('PlayerLeftForm|LeftClubState')
          ).toBeInTheDocument();
        });
      });

      describe('when modifiable-player-left-club is false', () => {
        beforeEach(() => {
          window.setFlag('modifiable-player-left-club', false);
        });

        afterEach(() => {
          window.setFlag('modifiable-player-left-club', true); // Reset to default for parent describe
        });

        it('NOT RENDERED when issue_owner: UNITED and player_org: UNITED and current_org: UNITED and player_left_club: TRUE and modifiable-player-left-club: FALSE', async () => {
          mountWrapper({
            issueOwner: united.id,
            playerOrg: united.id,
            viewingOrg: united.id,
            playerLeftClub: true,
          });
          await waitFor(() => {
            expect(
              screen.queryByTestId('PlayerLeftForm|LeftClubState')
            ).not.toBeInTheDocument();
          });
        });
      });

      it('does not render the component when viewing a closed issue', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: true,
          isClosed: true,
        });
        await waitFor(() => {
          expect(
            screen.queryByTestId('PlayerLeftForm|LeftClubState')
          ).not.toBeInTheDocument();
        });
      });
    });

    describe('[feature flag] display-plc-for-all-injuries', () => {
      beforeEach(() => {
        window.setFlag('modifiable-player-left-club', true);
        window.setFlag('display-plc-for-all-injuries', true);
      });
      afterEach(() => {
        window.setFlag('modifiable-player-left-club', false);
        window.setFlag('display-plc-for-all-injuries', false);
      });

      it('NOT RENDERED when issue_owner: UNITED and player_org: UNITED and current_org: UNITED', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: false,
        });
        await waitFor(() => {
          expect(
            screen.queryByTestId('PlayerLeftForm|LeftClubState')
          ).not.toBeInTheDocument();
        });
      });

      it('NOT RENDERED when issue_owner: MADRID and player_org: UNITED and current_org: UNITED and player_left_club: FALSE', async () => {
        mountWrapper({
          issueOwner: madrid.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: false,
        });
        await waitFor(() => {
          expect(
            screen.queryByTestId('PlayerLeftForm|LeftClubState')
          ).not.toBeInTheDocument();
        });
      });

      it('RENDERED when issue_owner: MADRID and player_org: UNITED and current_org: UNITED and player_left_club: TRUE', async () => {
        mountWrapper({
          issueOwner: madrid.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: true,
        });
        await waitFor(() => {
          expect(
            screen.getByTestId('PlayerLeftForm|LeftClubState')
          ).toBeInTheDocument();
        });
      });

      it('RENDERED when issue_owner: UNITED and player_org: MADRID and current_org: UNITED and player_left_club: TRUE', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: madrid.id,
          viewingOrg: united.id,
          playerLeftClub: true,
        });
        await waitFor(() => {
          expect(
            screen.getByTestId('PlayerLeftForm|LeftClubState')
          ).toBeInTheDocument();
        });
      });

      it('RENDERED when issue_owner: UNITED and player_org: UNITED and current_org: UNITED and player_left_club: TRUE', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: true,
        });
        await waitFor(() => {
          expect(
            screen.getByTestId('PlayerLeftForm|LeftClubState')
          ).toBeInTheDocument();
        });
      });

      it('does not render the component when viewing a closed issue', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: true,
          isClosed: true,
        });
        await waitFor(() => {
          expect(
            screen.queryByTestId('PlayerLeftForm|LeftClubState')
          ).not.toBeInTheDocument();
        });
      });
    });

    describe('when modifiable-player-left-club and display-plc-for-all-injuries are false', () => {
      beforeEach(() => {
        window.setFlag('modifiable-player-left-club', false);
        window.setFlag('display-plc-for-all-injuries', false);
      });

      afterEach(() => {
        window.setFlag('modifiable-player-left-club', true); // Reset to default for parent describe
        window.setFlag('display-plc-for-all-injuries', true); // Reset to default for parent describe
      });

      it('NOT RENDERED when issue_owner: UNITED and player_org: UNITED and current_org: UNITED', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: false,
        });
        await waitFor(() => {
          expect(
            screen.queryByTestId('PlayerLeftForm|LeftClubState')
          ).not.toBeInTheDocument();
        });
      });

      it('NOT RENDERED when issue_owner: MADRID and player_org: UNITED and current_org: UNITED and player_left_club: FALSE', async () => {
        mountWrapper({
          issueOwner: madrid.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: false,
        });
        await waitFor(() => {
          expect(
            screen.queryByTestId('PlayerLeftForm|LeftClubState')
          ).not.toBeInTheDocument();
        });
      });

      it('RENDERED when issue_owner: MADRID and player_org: UNITED and current_org: UNITED and player_left_club: TRUE', async () => {
        mountWrapper({
          issueOwner: madrid.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: true,
        });
        await waitFor(() => {
          expect(
            screen.getByTestId('PlayerLeftForm|LeftClubState')
          ).toBeInTheDocument();
        });
      });

      it('RENDERED when issue_owner: UNITED and player_org: MADRID and current_org: UNITED and player_left_club: TRUE', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: madrid.id,
          viewingOrg: united.id,
          playerLeftClub: true,
        });
        await waitFor(() => {
          expect(
            screen.getByTestId('PlayerLeftForm|LeftClubState')
          ).toBeInTheDocument();
        });
      });

      it('NOT RENDERED when issue_owner: UNITED and player_org: UNITED and current_org: UNITED and player_left_club: TRUE and modifiable-player-left-club: FALSE', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: true,
        });
        await waitFor(() => {
          expect(
            screen.queryByTestId('PlayerLeftForm|LeftClubState')
          ).not.toBeInTheDocument();
        });
      });

      it('does not render the component when viewing a closed issue', async () => {
        mountWrapper({
          issueOwner: united.id,
          playerOrg: united.id,
          viewingOrg: united.id,
          playerLeftClub: true,
          isClosed: true,
        });
        await waitFor(() => {
          expect(
            screen.queryByTestId('PlayerLeftForm|LeftClubState')
          ).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('[feature flag] display-plc-for-all-injuries', () => {
    describe('when modifiable-player-left-club and display-plc-for-all-injuries are true', () => {
      beforeEach(() => {
        window.setFlag('modifiable-player-left-club', true);
        window.setFlag('display-plc-for-all-injuries', true);
        server.use(
          rest.get(
            `/athletes/${props.athleteId}/injuries/${mockedIssueContextValue.issue.id}`,
            (req, res, ctx) =>
              res(
                ctx.json({
                  ...mockedIssueContextValue.issue,
                  organisation_id: organisationId,
                  player_left_club: false,
                  closed: false,
                  events: [],
                })
              )
          )
        );
        // Reset useIssueFields mock for each test in this block
        useIssueFields.mockReturnValue(mockUseIssueFields);
      });
      afterEach(() => {
        window.setFlag('modifiable-player-left-club', false);
        window.setFlag('display-plc-for-all-injuries', false);
      });

      describe('when preliminary-injury-illness is true', () => {
        beforeEach(() => {
          window.setFlag('preliminary-injury-illness', true);
          useIssueFields.mockReturnValue({
            ...mockUseIssueFields,
            fieldConfigRequestStatus: 'PENDING',
          });
        });

        afterEach(() => {
          window.setFlag('preliminary-injury-illness', false);
        });

        it('hides the player left club form is fieldConfigRequestStatus is pending', async () => {
          renderWithProvider(
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {
                  ...mockedDefaultPermissionsContextValue.permissions,
                  medical: {
                    ...mockedDefaultPermissionsContextValue.permissions.medical,
                    issues: { canEdit: true },
                  },
                },
              }}
            >
              <MockedOrganisationContextProvider
                organisationContext={{
                  organisation: { id: organisationId },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={{
                    ...mockedIssueContextValue,
                    issue: {
                      ...mockedIssueContextValue.issue,
                      organisation_id: organisationId,
                      player_left_club: false,
                      closed: false,
                      events: [],
                    },
                  }}
                >
                  <IssueTab
                    {...props}
                    athleteData={{
                      ...mockAthleteData([1]),
                    }}
                  />
                </MockedIssueContextProvider>
              </MockedOrganisationContextProvider>
            </MockedPermissionContextProvider>,
            mockStore
          );

          expect(screen.queryByText('Action Required')).not.toBeInTheDocument();
          expect(
            screen.queryByText(
              'Player moved on 22 Nov 2022. Update status or mark as player left club.'
            )
          ).not.toBeInTheDocument();
        });
      });

      // Not FAILING when run on own
      it('displays the player left club form when player_left_club = false', async () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  issues: { canEdit: true },
                },
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    organisation_id: organisationId,
                    player_left_club: false,
                    closed: false,
                    events: [],
                  },
                }}
              >
                <IssueTab
                  {...props}
                  athleteData={{
                    ...mockAthleteData([1]),
                  }}
                />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(screen.getByText('Action Required')).toBeInTheDocument();
        expect(
          screen.getByText(
            'Player moved on 22 Nov 2022. Update status or mark as player left club.'
          )
        ).toBeInTheDocument();
      });

      it('displays the "Player left club" form when left_at = null', async () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  issues: { canEdit: true },
                },
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    organisation_id: organisationId,
                    player_left_club: false,
                    closed: false,
                    events: [],
                  },
                }}
              >
                <IssueTab
                  {...props}
                  athleteData={{
                    ...mockAthleteData([1]),
                    org_last_transfer_record: {
                      ...mockAthleteData([1]).org_last_transfer_record,
                      left_at: null,
                    },
                  }}
                />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(
          screen.getByText(
            'Ensure all statuses are added and mark "Player left Club" if injury not Resolved when player moved'
          )
        ).toBeInTheDocument();
        await waitFor(() =>
          expect(
            within(screen.getByTestId('PlayerLeftForm|Wrapper')).getByRole(
              'button',
              { hidden: true }
            )
          ).toBeEnabled()
        );
      });
    });

    describe('[feature flag] disable-plc-if-outstanding-questions', () => {
      beforeEach(() => {
        window.setFlag('modifiable-player-left-club', true);
        window.setFlag('display-plc-for-all-injuries', true);
        window.setFlag('preliminary-injury-illness', true);
        window.setFlag('disable-plc-if-outstanding-questions', true);
      });
      afterEach(() => {
        window.setFlag('modifiable-player-left-club', false);
        window.setFlag('display-plc-for-all-injuries', false);
        window.setFlag('preliminary-injury-illness', false);
        window.setFlag('disable-plc-if-outstanding-questions', false);
      });

      it('disables the update button if there are outstanding fields', async () => {
        useIssueFields.mockReturnValue({
          ...mockUseIssueFields,
          validate: () => ['conditional_questions'],
        });

        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  issues: { canEdit: true },
                },
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    organisation_id: organisationId,
                    player_left_club: false,
                    closed: false,
                    events: [],
                  },
                }}
              >
                <IssueTab
                  {...props}
                  athleteData={{
                    ...mockAthleteData([1]),
                    org_last_transfer_record: {
                      ...mockAthleteData([1]).org_last_transfer_record,
                      left_at: null,
                    },
                  }}
                />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          store
        );

        expect(
          screen.getByText(
            'Ensure all statuses are added and mark "Player left Club" if injury not Resolved when player moved'
          )
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /Update/i, hidden: true })
        ).toBeDisabled();
      });
    });

    describe('[feature flag] medical-closed-issue-plc-editing', () => {
      beforeEach(() => {
        window.setFlag('modifiable-player-left-club', true);
        window.setFlag('display-plc-for-all-injuries', true);
        window.setFlag('medical-closed-issue-plc-editing', true);
      });
      afterEach(() => {
        window.setFlag('modifiable-player-left-club', false);
        window.setFlag('display-plc-for-all-injuries', false);
        window.setFlag('medical-closed-issue-plc-editing', false);
      });

      it('displays the "Player left club" form when issue is closed and flag is enabled', async () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  issues: { canEdit: true },
                },
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    organisation_id: organisationId,
                    player_left_club: false,
                    closed: true, // Issue is closed
                    events: [],
                  },
                }}
              >
                <IssueTab
                  {...props}
                  athleteData={{
                    ...mockAthleteData([1]),
                    org_last_transfer_record: {
                      ...mockAthleteData([1]).org_last_transfer_record,
                      left_at: null,
                    },
                  }}
                />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          store
        );

        expect(
          screen.getByText(
            'Ensure all statuses are added and mark "Player left Club" if injury not Resolved when player moved'
          )
        ).toBeInTheDocument();
        await waitFor(() =>
          expect(screen.getByRole('button', { name: /Update/i })).toBeEnabled()
        );
      });

      describe('when medical-closed-issue-plc-editing is false', () => {
        beforeEach(() => {
          window.setFlag('medical-closed-issue-plc-editing', false); // Disable the flag
        });

        afterEach(() => {
          window.setFlag('medical-closed-issue-plc-editing', true); // Reset to default for parent describe
        });

        it('does not display the "Player left club" form when issue is closed and flag is disabled', async () => {
          renderWithProvider(
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {
                  ...mockedDefaultPermissionsContextValue.permissions,
                  medical: {
                    ...mockedDefaultPermissionsContextValue.permissions.medical,
                    issues: { canEdit: true },
                  },
                },
              }}
            >
              <MockedOrganisationContextProvider
                organisationContext={{
                  organisation: { id: organisationId },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={{
                    ...mockedIssueContextValue,
                    issue: {
                      ...mockedIssueContextValue.issue,
                      organisation_id: organisationId,
                      player_left_club: false,
                      closed: true, // Issue is closed
                      events: [],
                    },
                  }}
                >
                  <IssueTab
                    {...props}
                    athleteData={{
                      ...mockAthleteData([1]),
                      org_last_transfer_record: {
                        ...mockAthleteData([1]).org_last_transfer_record,
                        left_at: null,
                      },
                    }}
                  />
                </MockedIssueContextProvider>
              </MockedOrganisationContextProvider>
            </MockedPermissionContextProvider>,
            store
          );

          expect(
            screen.queryByText(
              'Ensure all statuses are added and mark "Player left Club" if injury not Resolved when player moved'
            )
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: /Update/i })
          ).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('[feature-flag] medical-global-add-button-fix', () => {
    beforeEach(() => {
      window.setFlag('medical-global-add-button-fix', true);
    });

    afterEach(() => {
      window.setFlag('medical-global-add-button-fix', false);
    });

    it('renders correctly', () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...mockedDefaultPermissionsContextValue.permissions.medical,
                issues: { canEdit: true },
              },
            },
          }}
        >
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: organisationId },
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  events: [],
                },
              }}
            >
              <IssueTab
                {...props}
                athleteData={{
                  ...mockAthleteData([2]),
                }}
                scopeToLevel="issue"
              />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        </MockedPermissionContextProvider>,
        mockStore
      );

      medicalGlobalAddButtonMenuItems
        .filter((item) => item.id !== 'document')
        .forEach((item) => {
          expect(
            screen.getAllByText(item.modalTitle).length
          ).toBeGreaterThanOrEqual(1);
        });
    });
  });

  describe('[feature-flag] chronic-injury-illness', () => {
    beforeEach(() => {
      window.setFlag('chronic-injury-illness', true);
    });

    afterEach(() => {
      window.setFlag('chronic-injury-illness', false);
    });

    describe('when chronic-injury-illness is false', () => {
      beforeEach(() => {
        window.setFlag('chronic-injury-illness', false);
      });

      afterEach(() => {
        window.setFlag('chronic-injury-illness', true); // Reset to default for parent describe
      });

      it('does not render link chronic issue section when FF is OFF', async () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    has_recurrence: false,
                  },
                }}
              >
                <IssueTab
                  {...props}
                  athleteData={{
                    ...mockAthleteData([1]),
                  }}
                />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(
          screen.queryByText('Linked Chronic condition')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('chronic condition flow', () => {
    beforeEach(() => {
      // Base FF for this panel
      window.setFlag('chronic-injury-illness', true);
    });

    afterEach(() => {
      // Base FF for this panel
      window.setFlag('chronic-injury-illness', false);
    });

    it('renders link chronic condition section when issue IS a recurrence', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
            },
          }}
        >
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: organisationId },
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  has_recurrence: true,
                },
              }}
            >
              <IssueTab
                {...props}
                athleteData={{
                  ...mockAthleteData([1]),
                }}
              />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        </MockedPermissionContextProvider>,
        mockStore
      );
      expect(
        screen.queryByText('Linked Chronic condition')
      ).toBeInTheDocument();
    });

    it('does not render the link chronic condition section when issue is NOT a recurrence', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
            },
          }}
        >
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: organisationId },
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  has_recurrence: false,
                },
              }}
            >
              <IssueTab
                {...props}
                athleteData={{
                  ...mockAthleteData([1]),
                }}
              />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        </MockedPermissionContextProvider>,
        mockStore
      );

      expect(
        screen.queryByText('Linked Chronic condition')
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature flag] conditional-fields-showing-in-ip', () => {
    beforeEach(() => {
      window.setFlag('conditional-fields-showing-in-ip', true);
    });

    afterEach(() => {
      window.setFlag('conditional-fields-showing-in-ip', false);
    });

    it('renders the additional information', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedDefaultPermissionsContextValue}
        >
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
            }}
          >
            <IssueTab {...props} />
          </MockedIssueContextProvider>
        </MockedPermissionContextProvider>,
        mockStore
      );

      expect(screen.getByText('Additional information')).toBeInTheDocument();
    });

    it('does not render the additional information when the issue is a continuation', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedDefaultPermissionsContextValue}
        >
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              isContinuationIssue: true,
            }}
          >
            <IssueTab {...props} />
          </MockedIssueContextProvider>
        </MockedPermissionContextProvider>,
        mockStore
      );

      expect(
        screen.queryByText('Additional information')
      ).not.toBeInTheDocument();
    });
  });

  describe('[permissions] permissions.medical.workersComp.canView', () => {
    describe('[feature flag] workers-comp', () => {
      beforeEach(() => {
        window.setFlag('workers-comp', true);
      });

      afterEach(() => {
        window.setFlag('workers-comp', false);
      });

      it('should render <WorkersComp /> if canView permissions is true', () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  workersComp: {
                    canView: true,
                  },
                  issues: {
                    canView: true,
                    canEdit: true,
                  },
                },
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    events: [],
                  },
                }}
              >
                <IssueTab
                  {...props}
                  athleteData={{
                    ...mockAthleteData([2]),
                  }}
                  scopeToLevel="issue"
                />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(screen.getByTestId('WorkersComp|Container')).toBeInTheDocument();
      });

      it('should not render <WorkersComp /> if canView permissions is false', () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  workersComp: {
                    canView: false,
                  },
                  issues: {
                    canView: true,
                    canEdit: true,
                  },
                },
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    events: [],
                  },
                }}
              >
                <IssueTab
                  {...props}
                  athleteData={{
                    ...mockAthleteData([2]),
                  }}
                  scopeToLevel="issue"
                />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(
          screen.queryByTestId('WorkersComp|Container')
        ).not.toBeInTheDocument();
      });

      describe('Print view', () => {
        const mockStoreWithPrintPreview = storeFake({
          ...mockStore.getState(),
          addWorkersCompSidePanel: {
            ...mockStore.getState().addWorkersCompSidePanel,
            showPrintPreview: {
              card: true,
              sidePanel: false,
            },
          },
        });

        const mockMatchMedia = (matches) => {
          Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
              matches: query === 'print' ? matches : false,
              media: query,
              onchange: null,
              addListener: jest.fn(), // deprecated
              removeListener: jest.fn(), // deprecated
              addEventListener: jest.fn(),
              removeEventListener: jest.fn(),
              dispatchEvent: jest.fn(),
            })),
          });
        };

        beforeEach(() => {
          mockMatchMedia(true);
        });

        afterEach(() => {
          mockMatchMedia(false);
        });

        it('should render PrintView if feature flag, permission, issue exists and showPrintPreview contains a truthy value', async () => {
          renderWithProvider(
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {
                  ...mockedDefaultPermissionsContextValue.permissions,
                  medical: {
                    ...mockedDefaultPermissionsContextValue.permissions.medical,
                    workersComp: { canView: true },
                  },
                },
              }}
            >
              <MockedOrganisationContextProvider
                organisationContext={{
                  organisation: { id: organisationId },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={mockedIssueContextValue}
                >
                  <IssueTab {...props} />
                </MockedIssueContextProvider>
              </MockedOrganisationContextProvider>
            </MockedPermissionContextProvider>,
            mockStoreWithPrintPreview
          );

          expect(screen.getByTestId('section-to-print')).toBeInTheDocument();
        });

        it('should NOT render PrintView if feature flag, permission, issue exists and showPrintPreview doesnt contain a truthy value', async () => {
          renderWithProvider(
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {
                  ...mockedDefaultPermissionsContextValue.permissions,
                  medical: {
                    ...mockedDefaultPermissionsContextValue.permissions.medical,
                    workersComp: { canView: true },
                  },
                },
              }}
            >
              <MockedOrganisationContextProvider
                organisationContext={{
                  organisation: { id: organisationId },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={mockedIssueContextValue}
                >
                  <IssueTab {...props} />
                </MockedIssueContextProvider>
              </MockedOrganisationContextProvider>
            </MockedPermissionContextProvider>,
            mockStore
          );

          expect(
            screen.queryByTestId('section-to-print')
          ).not.toBeInTheDocument();
        });
      });
    });

    describe('[feature flag] pm-mls-emr-demo-froi', () => {
      beforeEach(() => {
        window.setFlag('pm-mls-emr-demo-froi', true);
      });

      afterEach(() => {
        window.setFlag('pm-mls-emr-demo-froi', false);
      });

      it('should render <WorkersComp /> if canView permissions is true', () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  workersComp: {
                    canView: true,
                  },
                  issues: {
                    canView: true,
                    canEdit: true,
                  },
                },
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    events: [],
                  },
                }}
              >
                <IssueTab
                  {...props}
                  athleteData={{
                    ...mockAthleteData([2]),
                  }}
                  scopeToLevel="issue"
                />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(screen.getByTestId('WorkersComp|Container')).toBeInTheDocument();
      });

      it('should not render <WorkersComp /> if canView permissions is false', () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  workersComp: {
                    canView: false,
                  },
                  issues: {
                    canView: true,
                    canEdit: true,
                  },
                },
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    events: [],
                  },
                }}
              >
                <IssueTab
                  {...props}
                  athleteData={{
                    ...mockAthleteData([2]),
                  }}
                  scopeToLevel="issue"
                />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(
          screen.queryByTestId('WorkersComp|Container')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('[permissions] permissions.medical.osha.canView', () => {
    describe('[feature flag] osha-form', () => {
      beforeEach(() => {
        window.setFlag('osha-form', true);
      });

      afterEach(() => {
        window.setFlag('osha-form', false);
      });

      it('renders <OshaCard /> if permission is true', () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  osha: { canView: true },
                },
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <IssueTab {...props} />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(screen.getByTestId('OshaCard|Container')).toBeInTheDocument();
      });

      it('should not render <OshaCard /> if permission is false', () => {
        renderWithProvider(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...mockedDefaultPermissionsContextValue.permissions.medical,
                  osha: { canView: false },
                },
              },
            }}
          >
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { id: organisationId },
              }}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <IssueTab {...props} />
              </MockedIssueContextProvider>
            </MockedOrganisationContextProvider>
          </MockedPermissionContextProvider>,
          mockStore
        );

        expect(
          screen.queryByTestId('OshaCard|Container')
        ).not.toBeInTheDocument();
      });

      describe('Print view', () => {
        const mockStoreWithPrintPreview = storeFake({
          ...mockStore.getState(),
          addOshaFormSidePanel: {
            ...mockStore.getState().addOshaFormSidePanel,
            showPrintPreview: {
              card: true,
              sidePanel: false,
            },
          },
        });

        const mockMatchMedia = (matches) => {
          Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
              matches: query === 'print' ? matches : false,
              media: query,
              onchange: null,
              addListener: jest.fn(), // deprecated
              removeListener: jest.fn(), // deprecated
              addEventListener: jest.fn(),
              removeEventListener: jest.fn(),
              dispatchEvent: jest.fn(),
            })),
          });
        };

        beforeEach(() => {
          mockMatchMedia(true);
        });

        afterEach(() => {
          mockMatchMedia(false);
        });

        it('should render PrintView if feature flag, permission, issue exists and showPrintPreview contains a truthy value', async () => {
          renderWithProvider(
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {
                  ...mockedDefaultPermissionsContextValue.permissions,
                  medical: {
                    ...mockedDefaultPermissionsContextValue.permissions.medical,
                    osha: { canView: true },
                  },
                },
              }}
            >
              <MockedOrganisationContextProvider
                organisationContext={{
                  organisation: { id: organisationId },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={mockedIssueContextValue}
                >
                  <IssueTab {...props} />
                </MockedIssueContextProvider>
              </MockedOrganisationContextProvider>
            </MockedPermissionContextProvider>,
            mockStoreWithPrintPreview
          );

          expect(screen.getByTestId('section-to-print')).toBeInTheDocument();
        });

        it('should NOT render PrintView if feature flag, permission, issue exists and showPrintPreview doesnt contain a truthy value', async () => {
          renderWithProvider(
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {
                  ...mockedDefaultPermissionsContextValue.permissions,
                  medical: {
                    ...mockedDefaultPermissionsContextValue.permissions.medical,
                    osha: { canView: true },
                  },
                },
              }}
            >
              <MockedOrganisationContextProvider
                organisationContext={{
                  organisation: { id: organisationId },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={mockedIssueContextValue}
                >
                  <IssueTab {...props} />
                </MockedIssueContextProvider>
              </MockedOrganisationContextProvider>
            </MockedPermissionContextProvider>,
            mockStore
          );

          expect(
            screen.queryByTestId('section-to-print')
          ).not.toBeInTheDocument();
        });
      });
    });

    it('renders <AddMedicalDocumentSidePanel /> if permission is true', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...mockedDefaultPermissionsContextValue.permissions.medical,
                documents: { canCreate: true },
              },
            },
          }}
        >
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: organisationId },
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <IssueTab {...props} />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        </MockedPermissionContextProvider>,
        mockStore
      );

      expect(
        screen.getByTestId('AddMedicalDocumentSidePanel|Parent')
      ).toBeInTheDocument();
    });

    it('should not render <AddMedicalDocumentSidePanel /> if permission is false', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...mockedDefaultPermissionsContextValue.permissions.medical,
                documents: { canCreate: false },
              },
            },
          }}
        >
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: organisationId },
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <IssueTab {...props} />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        </MockedPermissionContextProvider>,
        mockStore
      );

      expect(
        screen.queryByTestId('AddMedicalDocumentSidePanel|Parent')
      ).not.toBeInTheDocument();
    });
  });

  describe('Edit UI/Functionality', () => {
    beforeEach(() => {
      window.setFlag('conditional-fields-showing-in-ip', true);
      window.setFlag('conditional-fields-v1-stop', true);
    });

    afterEach(() => {
      window.setFlag('conditional-fields-showing-in-ip', false);
      window.setFlag('conditional-fields-v1-stop', false);
    });

    it('renders the edit button and toggles disabled state for field Group "additionalInfo" when section in other Group in edit mode', async () => {
      const user = userEvent.setup();
      renderIssueTabWithPermissions();

      const {
        additionalInformationSection,
        injuryDetailEditButton,
        pathologyEditButton,
        eventDetailsEditButton,
        additionalInfoEditButton,
      } = getSectionElements();

      // All Enabled by default
      expect(injuryDetailEditButton).toBeEnabled();
      expect(pathologyEditButton).toBeEnabled();
      expect(eventDetailsEditButton).toBeEnabled();
      expect(additionalInfoEditButton).toBeEnabled();
      expect(screen.queryByText('Discard changes')).not.toBeInTheDocument(); // Not in edit mode yet

      // Click button from the other group
      await user.click(injuryDetailEditButton);

      await waitFor(() => {
        const updatedAdditionalInfoEditButton =
          additionalInformationSection.querySelector('button');

        expect(screen.getByText('Discard changes')).toBeInTheDocument(); // In edit mode
        expect(updatedAdditionalInfoEditButton).toBeDisabled();
      });
    });

    it('does not enable other Groups Members until ALL the Members in active Group have exited edit mode regardless of order entered', async () => {
      const user = userEvent.setup();
      renderIssueTabWithPermissions();

      const {
        additionalInformationSection,
        injuryDetailEditButton,
        pathologyEditButton,
        eventDetailsEditButton,
        additionalInfoEditButton,
      } = getSectionElements();

      // All Enabled by default
      expect(injuryDetailEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(pathologyEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(eventDetailsEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(additionalInfoEditButton).toBeEnabled(); // Part of AdditionalInfo group
      expect(screen.queryByText('Discard changes')).not.toBeInTheDocument(); // Not in edit mode yet

      // Click button from the other group
      await user.click(injuryDetailEditButton);
      await user.click(pathologyEditButton);

      await waitFor(() => {
        const updatedAdditionalInfoEditButton =
          additionalInformationSection.querySelector('button');

        expect(screen.getAllByText('Discard changes')).toHaveLength(2); // Two Members in edit mode
        expect(updatedAdditionalInfoEditButton).toBeDisabled(); // Member of other group is disabled
      });

      // Close the first member in edit mode (the memeber that trigegred this group as enabled)
      await user.click(screen.getAllByText('Discard changes')[0]);

      await waitFor(() => {
        const updatedAdditionalInfoEditButton =
          additionalInformationSection.querySelector('button');

        expect(screen.getByText('Discard changes')).toBeInTheDocument(); // One Member remains in edit mode
        expect(updatedAdditionalInfoEditButton).toBeDisabled(); // Member of other group is still disabled
      });

      // Close the remaining member in edit mode
      await user.click(screen.getByText('Discard changes'));

      await waitFor(() => {
        const updatedAdditionalInfoEditButton =
          additionalInformationSection.querySelector('button');

        expect(screen.queryByText('Discard changes')).not.toBeInTheDocument(); // No Members in edit mode
        expect(updatedAdditionalInfoEditButton).toBeEnabled(); // Member of other group is now enabled
      });
    });

    it('renders the edit button and toggles disabled state for field Group "eventIssue" correctly when section in other Group in edit mode', async () => {
      const user = userEvent.setup();
      renderIssueTabWithPermissions();

      const {
        injuryDetailSection,
        pathologySection,
        eventDetailsSection,
        injuryDetailEditButton,
        pathologyEditButton,
        eventDetailsEditButton,
        additionalInfoEditButton,
      } = getSectionElements();

      // All Enabled by default
      expect(injuryDetailEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(pathologyEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(eventDetailsEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(additionalInfoEditButton).toBeEnabled(); // Part of AdditionalInfo group
      expect(screen.queryByText('Discard changes')).not.toBeInTheDocument(); // Not in edit mode yet

      // Click button from the other group
      await user.click(additionalInfoEditButton);

      await waitFor(() => {
        const updatedInjuryDetailEditButton =
          injuryDetailSection.querySelector('button');
        const updatedPathologyEditButton =
          pathologySection.querySelector('button');
        const updatedEventDetailsEditButton =
          eventDetailsSection.querySelector('button');

        expect(screen.getByText('Discard changes')).toBeInTheDocument(); // In edit mode
        expect(updatedInjuryDetailEditButton).toBeDisabled();
        expect(updatedPathologyEditButton).toBeDisabled();
        expect(updatedEventDetailsEditButton).toBeDisabled();
      });
    });

    it('additionalInfo group members correctly release the write lock after save function', async () => {
      const user = userEvent.setup();
      renderIssueTabWithPermissions();

      const {
        injuryDetailSection,
        pathologySection,
        eventDetailsSection,
        injuryDetailEditButton,
        pathologyEditButton,
        eventDetailsEditButton,
        additionalInfoEditButton,
        additionalInformationSection,
      } = getSectionElements();

      // All Enabled by default
      expect(injuryDetailEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(pathologyEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(eventDetailsEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(additionalInfoEditButton).toBeEnabled(); // Part of AdditionalInfo group
      expect(screen.queryByText('Discard changes')).not.toBeInTheDocument(); // Not in edit mode yet

      // Click button from the other group (Additional info is now active and other groups disabled)
      await user.click(additionalInfoEditButton);

      await waitFor(
        () => {
          expect(injuryDetailEditButton).toBeDisabled();
          expect(pathologyEditButton).toBeDisabled();
          expect(eventDetailsEditButton).toBeDisabled();
          expect(screen.getByText('Discard changes')).toBeInTheDocument(); // Additional Info is in edit mode
        },
        {
          timeout: 3000,
        }
      );

      // Save button now (2 buttons in edit mode Discard changes and Save)
      const updatedAdditionalInfoButton =
        additionalInformationSection.querySelectorAll('button')[1];

      expect(
        additionalInformationSection.querySelectorAll('button')[0]
      ).toHaveTextContent('Discard changes');
      expect(updatedAdditionalInfoButton).toHaveTextContent('Save');
      expect(
        additionalInformationSection.querySelectorAll('button')
      ).toHaveLength(2);

      // Click save
      await user.click(updatedAdditionalInfoButton);

      await waitFor(
        () => {
          expect(injuryDetailSection.querySelector('button')).toBeEnabled(); // Now enabled
          expect(pathologySection.querySelector('button')).toBeEnabled(); // Now enabled
          expect(eventDetailsSection.querySelector('button')).toBeEnabled(); // Now enabled
          expect(screen.queryByText('Discard changes')).not.toBeInTheDocument(); // Not member/group is in edit mode
        },
        {
          timeout: 3000,
        }
      );
    });

    it('eventIssue group members correctly release the write lock after save function', async () => {
      const user = userEvent.setup();
      renderIssueTabWithPermissions();

      const {
        injuryDetailSection,
        pathologySection,
        eventDetailsSection,
        injuryDetailEditButton,
        pathologyEditButton,
        eventDetailsEditButton,
        additionalInfoEditButton,
        additionalInformationSection,
      } = getSectionElements();

      // All Enabled by default
      expect(injuryDetailEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(pathologyEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(eventDetailsEditButton).toBeEnabled(); // Part of IssueEvent group
      expect(additionalInfoEditButton).toBeEnabled(); // Part of AdditionalInfo group
      expect(screen.queryByText('Discard changes')).not.toBeInTheDocument(); // Not in edit mode yet

      // Click button from the other group (Additional info is now active and other groups disabled)
      await user.click(pathologyEditButton);

      await waitFor(
        () => {
          expect(injuryDetailEditButton).toBeEnabled();
          expect(eventDetailsEditButton).toBeEnabled();
          expect(additionalInfoEditButton).toBeDisabled();
          expect(screen.getByText('Discard changes')).toBeInTheDocument(); // Pathology is in edit mode
        },
        {
          timeout: 3000,
        }
      );

      // Save button now (2 buttons in edit mode Discard changes and Save)
      const updatedPathologySectionButton =
        pathologySection.querySelectorAll('button')[1];

      expect(pathologySection.querySelectorAll('button')[0]).toHaveTextContent(
        'Discard changes'
      );
      expect(updatedPathologySectionButton).toHaveTextContent('Save');
      expect(pathologySection.querySelectorAll('button')).toHaveLength(2);

      // Click save
      await user.click(updatedPathologySectionButton);

      await waitFor(
        () => {
          expect(injuryDetailSection.querySelector('button')).toBeEnabled(); // Still enabled
          expect(eventDetailsSection.querySelector('button')).toBeEnabled(); // Still enabled
          expect(screen.queryByText('Discard changes')).not.toBeInTheDocument(); // Pathology section no longer in edit mode
          expect(
            additionalInformationSection.querySelector('button')
          ).toBeEnabled(); // Now enabled
        },
        {
          timeout: 3000,
        }
      );
    });

    it('does not render the edit buttons when canEdit = False', async () => {
      renderIssueTabWithPermissions(false);

      const editButtons = screen.queryAllByText('Edit');
      expect(editButtons.length).toEqual(0);
    });

    it('maintains the write lock correctly when one member saves while another is activated', async () => {
      const user = userEvent.setup();
      renderIssueTabWithPermissions();

      await screen.findByText('Primary Pathology');

      const {
        pathologyEditButton,
        injuryDetailEditButton,
        eventDetailsEditButton,
        additionalInfoEditButton,
      } = getSectionElements();

      expect(pathologyEditButton).toBeEnabled();
      expect(injuryDetailEditButton).toBeEnabled();
      expect(eventDetailsEditButton).toBeEnabled();
      expect(additionalInfoEditButton).toBeEnabled();

      await user.click(pathologyEditButton);

      expect(injuryDetailEditButton).toBeEnabled();
      expect(eventDetailsEditButton).toBeEnabled();
      expect(additionalInfoEditButton).toBeDisabled();

      const pathologySaveButton =
        getSectionElements().pathologySection.querySelectorAll('button')[1];
      expect(pathologySaveButton).toHaveTextContent('Save');
      expect(additionalInfoEditButton).toBeDisabled();

      await user.click(pathologySaveButton);
      await user.click(injuryDetailEditButton);

      const injuryDetailButton =
        getSectionElements().injuryDetailSection.querySelector('button');

      expect(injuryDetailButton).toHaveTextContent('Discard changes');
      expect(injuryDetailButton).toBeEnabled();

      expect(getSectionElements().additionalInfoEditButton).toBeDisabled();

      await user.click(injuryDetailButton);

      const injuryDetailButtonUpdated =
        getSectionElements().injuryDetailSection;
      expect(injuryDetailButtonUpdated).toHaveTextContent('Edit');
      expect(getSectionElements().additionalInfoEditButton).toBeEnabled();

      expect(getSectionElements().pathologyEditButton).toBeEnabled();
      expect(getSectionElements().injuryDetailEditButton).toBeEnabled();
      expect(getSectionElements().eventDetailsEditButton).toBeEnabled();
      expect(getSectionElements().additionalInfoEditButton).toBeEnabled();
    });
  });
});
