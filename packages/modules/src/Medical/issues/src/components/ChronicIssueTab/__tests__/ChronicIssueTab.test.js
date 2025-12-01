import { within, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { data as mockIssueData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue';
import * as medicalApi from '@kitman/modules/src/Medical/shared/redux/services/medical';

import ChronicIssueTab from '..';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';

jest.mock('@kitman/components/src/DatePicker');

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockStore = storeFake({
  addProcedureSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  medicalApi: {},
  medicalHistory: {},
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
});

const defaultProps = {
  t: i18nextTranslateStub(),
};

describe('<ChronicIssueTab />', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        medical: {
          workersComp: {
            canView: true,
          },
          documents: { canCreate: false },
          alerts: { canCreate: false },
          allergies: { canCreate: false },
          privateNotes: { canCreate: false },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    });
  });

  it('should render default content', () => {
    render(
      <Provider store={mockStore}>
        <MockedIssueContextProvider
          issueContext={{
            ...mockedIssueContextValue,
            issue: {
              ...mockedIssueContextValue.issue,
              ...mockIssueData.chronicIssue,
            },
            isReadOnly: true,
          }}
        >
          <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
        </MockedIssueContextProvider>
      </Provider>
    );

    expect(screen.getByTestId('IssueDetails')).toBeInTheDocument();
    expect(screen.getByTestId('EventDetails')).toBeInTheDocument();
    expect(screen.getByTestId('ChronicOccurences')).toBeInTheDocument();
  });

  describe('[permissions] permissions.medical.workersComp.canView', () => {
    describe('[feature flag] workers-comp', () => {
      beforeEach(() => {
        window.featureFlags['workers-comp'] = true;
      });

      afterEach(() => {
        window.featureFlags['workers-comp'] = false;
      });

      it('should render <WorkersComp /> if canView permissions is true', () => {
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              workersComp: {
                canView: true,
              },
              issues: {
                canView: true,
                canEdit: true,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(screen.getByTestId('WorkersComp|Container')).toBeInTheDocument();
      });

      it('should not render <WorkersComp /> if canView permissions is false', () => {
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              workersComp: {
                canView: false,
              },
              issues: {
                canView: false,
                canEdit: false,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(
          screen.queryByTestId('WorkersComp|Container')
        ).not.toBeInTheDocument();
      });
    });

    describe('[feature flag] pm-mls-emr-demo-froi', () => {
      beforeEach(() => {
        window.featureFlags['pm-mls-emr-demo-froi'] = true;
      });

      afterEach(() => {
        window.featureFlags['pm-mls-emr-demo-froi'] = false;
      });

      it('should render <WorkersComp /> if canView permissions is true', () => {
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              workersComp: {
                canView: true,
              },
              issues: {
                canView: true,
                canEdit: true,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(screen.getByTestId('WorkersComp|Container')).toBeInTheDocument();
      });

      it('should not render <WorkersComp /> if canView permissions is false', () => {
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              workersComp: {
                canView: false,
              },
              issues: {
                canView: false,
                canEdit: false,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
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
        window.featureFlags['osha-form'] = true;
      });

      afterEach(() => {
        window.featureFlags['osha-form'] = false;
      });

      it('should render <OshaCard /> if canView permissions is true', () => {
        usePermissions.mockReturnValue({
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...mockedDefaultPermissionsContextValue.permissions.medical,
              osha: { canView: true },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(screen.getByTestId('OshaCard|Container')).toBeInTheDocument();
      });

      it('should not render <OshaCard /> if canView permissions is false', () => {
        usePermissions.mockReturnValue({
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...mockedDefaultPermissionsContextValue.permissions.medical,
              osha: { canView: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(
          screen.queryByTestId('OshaCard|Container')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('[permissions] permissions.medical.issues (canView & canEdit)', () => {
    describe('[feature flag] chronic-conditions-resolution', () => {
      beforeEach(() => {
        window.featureFlags['chronic-conditions-resolution'] = true;
      });

      afterEach(() => {
        window.featureFlags['chronic-conditions-resolution'] = false;
      });

      it('should render <ChronicIssueStatus />', () => {
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              issues: {
                canView: true,
                canEdit: true,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(screen.getByTestId('ChronicIssueStatus')).toBeInTheDocument();
      });

      it('should render correct UI when inEditMode is true', async () => {
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              issues: {
                canView: true,
                canEdit: true,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        // Not visible by default
        expect(
          screen.queryByTestId('AddAvailabilityEventsForm|Actions')
        ).not.toBeInTheDocument();

        // Click edit button
        const editButton = screen.getByTestId('edit-status-btn');
        await userEvent.click(editButton);

        // Is now visible
        const actionsContainer =
          screen.getByText('Discard changes').parentNode.parentNode;
        expect(actionsContainer).toBeInTheDocument();
      });

      it('should render correct UI when EditMode is exited (inEditMode is false)', async () => {
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              issues: {
                canView: true,
                canEdit: true,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        // Enter edit mode
        const editButton = screen.getByTestId('edit-status-btn');
        await userEvent.click(editButton);

        // Verify in editmode;
        const actionsContainer =
          screen.getByText('Discard changes').parentNode.parentNode;
        expect(actionsContainer).toBeInTheDocument();

        // Exit edit mode
        const discardChangesButton = screen.getByText('Discard changes');
        await userEvent.click(discardChangesButton);

        // Verify NOT in editmode
        // Must use testid; cannot chain on to undefined (.find, .parent, .closest etc)
        expect(
          screen.queryByTestId('AddAvailabilityEventsForm|Actions')
        ).not.toBeInTheDocument();
      });

      it('discards changes correctly', async () => {
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              issues: {
                canView: true,
                canEdit: true,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });

        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(screen.queryByText('Discard changes')).not.toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();

        const editButtons = screen.getAllByText('Edit');
        const editButton = editButtons[0];

        await userEvent.click(editButton);

        const discardChangesButton = await screen.findByText('Discard changes');

        expect(discardChangesButton).toBeInTheDocument();

        await userEvent.click(discardChangesButton);

        expect(screen.queryByText('Discard changes')).not.toBeInTheDocument();
      });

      it('resolves a chronic issue correctly', async () => {
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              issues: {
                canView: true,
                canEdit: true,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });

        jest.spyOn(medicalApi, 'useResolveChronicIssueQuery').mockReturnValue({
          data: null,
        });

        const { rerender } = render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockIssueData.chronicIssue,
                },
                isReadOnly: false,
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(screen.queryByText('Discard changes')).not.toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        const statusPane = screen.queryByTestId('ChronicIssueStatus');
        expect(statusPane).toBeInTheDocument();
        const editButton = within(statusPane).queryByText('Edit');
        expect(editButton).toBeInTheDocument();
        await userEvent.click(editButton);
        const saveButton = within(statusPane).getByText('Save');

        const resolvedButton = within(statusPane).queryByText('Resolved');
        await userEvent.click(resolvedButton);

        expect(screen.getByText('Date of resolution')).toBeInTheDocument();

        const datePicker =
          within(statusPane).queryByLabelText(/Date of resolution/i);
        expect(datePicker).toBeInTheDocument();

        fireEvent.change(datePicker, {
          target: { value: '29 Oct, 2020' },
        });
        const datePickerValue = datePicker.value;
        expect(datePickerValue).toEqual(expect.stringMatching('Oct 29 2020'));

        expect(saveButton).toBeEnabled();

        await userEvent.click(saveButton);

        jest.spyOn(medicalApi, 'useResolveChronicIssueQuery').mockReturnValue({
          data: {
            ...mockedIssueContextValue.issue,
            ...mockIssueData.chronicIssue,
            resolved_date: '2023-11-03 00:00:00',
            resolved_at: '2023-11-13T22:48:04+00:00',
            resolved_by: {
              id: 1,
              firstname: 'Sergiu',
              lastname: 'Tripon-admin-eu',
              fullname: 'Sergiu Tripon-admin-eu',
            },
          },
        });

        rerender(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                  resolved_date: '2023-11-03 00:00:00',
                  resolved_at: '2023-11-13T22:48:04+00:00',
                  resolved_by: {
                    id: 1,
                    firstname: 'Sergiu',
                    lastname: 'Tripon-admin-eu',
                    fullname: 'Sergiu Tripon-admin-eu',
                  },
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(screen.queryByText('Discard changes')).not.toBeInTheDocument();
        expect(screen.getByText('Resolved')).toBeInTheDocument();
      });

      it('activates a chronic issue correctly', async () => {
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              workersComp: {
                canView: false,
              },
              issues: {
                canView: true,
                canEdit: true,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });

        jest.spyOn(medicalApi, 'useResolveChronicIssueQuery').mockReturnValue({
          data: {
            ...mockedIssueContextValue.issue,
            ...mockIssueData.chronicIssue,
            resolved_date: '2023-11-03 00:00:00',
            resolved_at: '2023-11-13T22:48:04+00:00',
            resolved_by: {
              id: 1,
              firstname: 'Sergiu',
              lastname: 'Tripon-admin-eu',
              fullname: 'Sergiu Tripon-admin-eu',
            },
          },
        });

        const { rerender } = render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockIssueData.chronicIssue,
                },
                isReadOnly: false,
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(screen.queryByText('Discard changes')).not.toBeInTheDocument();
        expect(
          screen.queryByText('Date of resolution')
        ).not.toBeInTheDocument();

        const statusPane = screen.queryByTestId('ChronicIssueStatus');
        expect(statusPane).toBeInTheDocument();
        const editButton = within(statusPane).queryByText('Edit');
        expect(editButton).toBeInTheDocument();
        await userEvent.click(editButton);

        expect(screen.getByText('Discard changes')).toBeInTheDocument();

        const resolvedButton = within(statusPane).queryByText('Resolved');
        await userEvent.click(resolvedButton);

        expect(screen.getByText('Date of resolution')).toBeInTheDocument();

        const saveButton = within(statusPane).queryByText('Save');

        const activeButton = within(statusPane).queryByText('Active');
        await userEvent.click(activeButton);

        expect(saveButton).toBeEnabled();

        await userEvent.click(saveButton);

        jest.spyOn(medicalApi, 'useResolveChronicIssueQuery').mockReturnValue({
          data: {
            ...mockedIssueContextValue.issue,
            ...mockIssueData.chronicIssue,
            resolved_date: null,
            resolved_at: '2023-11-13T22:48:04+00:00',
            resolved_by: {
              id: 176973,
              firstname: 'Sergiu',
              lastname: 'Tripon-admin-eu',
              fullname: 'Sergiu Tripon-admin-eu',
            },
          },
        });

        rerender(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        expect(screen.queryByText('Discard changes')).not.toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
      });
      describe('[MEDICAL_TRIAL]', () => {
        beforeEach(() => {
          usePermissions.mockReturnValue({
            permissions: {
              medical: {
                issues: {
                  canView: true,
                  canEdit: true,
                },
                documents: { canCreate: false },
                alerts: { canCreate: false },
                allergies: { canCreate: false },
                privateNotes: { canCreate: false },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          });
        });

        it('should render edit button when isReadOnly is false', () => {
          render(
            <Provider store={mockStore}>
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    ...mockIssueData.chronicIssue,
                  },
                  isReadOnly: false,
                }}
              >
                <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
              </MockedIssueContextProvider>
            </Provider>
          );

          // ensuring ChronicIssueStatus is loaded
          const statusPane = screen.queryByTestId('ChronicIssueStatus'); // Must use testid; cannot chain on to undefined (.find, .parent, .closest etc)
          expect(statusPane).toBeInTheDocument();

          const editButton = within(statusPane).queryByText('Edit');
          expect(editButton).toBeInTheDocument();
        });
        it('should not render edit button when isReadOnly is true', () => {
          render(
            <Provider store={mockStore}>
              <MockedIssueContextProvider
                issueContext={{
                  ...mockedIssueContextValue,
                  issue: {
                    ...mockedIssueContextValue.issue,
                    ...mockIssueData.chronicIssue,
                  },
                  isReadOnly: true,
                }}
              >
                <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
              </MockedIssueContextProvider>
            </Provider>
          );

          // ensuring ChronicIssueStatus is loaded
          const statusPane = screen.queryByTestId('ChronicIssueStatus'); // Must use testid; cannot chain on to undefined (.find, .parent, .closest etc)
          expect(statusPane).toBeInTheDocument();

          const editButton = within(statusPane).queryByRole('button', {
            name: 'Edit',
          });
          expect(editButton).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('[permissions] No permission flow  - permissions.medical.issues(canView & canEdit)', () => {
    describe('[feature flag] No FF flow - chronic-conditions-resolution', () => {
      beforeEach(() => {
        window.featureFlags['chronic-conditions-resolution'] = false;
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              issues: {
                canView: false,
                canEdit: false,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      it('should not render <ChronicIssueStatus />', () => {
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        const statusPane = screen.queryByTestId('ChronicIssueStatus'); // Must use testid; cannot chain on to undefined (.find, .parent, .closest etc)
        expect(statusPane).not.toBeInTheDocument();
      });
    });
    describe('[feature flag] - chronic-conditions-resolution', () => {
      beforeEach(() => {
        window.featureFlags['chronic-conditions-resolution'] = true;
        usePermissions.mockReturnValue({
          permissions: {
            medical: {
              issues: {
                canView: false,
                canEdit: false,
              },
              documents: { canCreate: false },
              alerts: { canCreate: false },
              allergies: { canCreate: false },
              privateNotes: { canCreate: false },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      it('should not render <ChronicIssueStatus /> without permissions regardless of feature flag', () => {
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );
        const statusPane = screen.queryByTestId('ChronicIssueStatus'); // Must use testid; cannot chain on to undefined (.find, .parent, .closest etc)
        expect(statusPane).not.toBeInTheDocument();
      });

      it('should not render the edit button without permissions.medical.issues.canEdit regardless of feature flag', () => {
        render(
          <Provider store={mockStore}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockIssueData.chronicIssue,
                },
              }}
            >
              <ChronicIssueTab {...defaultProps} athleteData={{ id: 1 }} />
            </MockedIssueContextProvider>
          </Provider>
        );

        const editButton = screen.queryByText('Edit');
        expect(editButton).not.toBeInTheDocument();
      });
    });
  });
});
