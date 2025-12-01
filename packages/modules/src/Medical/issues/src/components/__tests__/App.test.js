import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';
import { useGetConcussionFormTypesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import getAthleteData from '@kitman/services/src/services/getAthleteData';
import getAthleteAssessments from '@kitman/modules/src/Medical/rosters/src/services/getAthleteAssessments';
import getAthleteConcussionAssessmentResults from '@kitman/services/src/services/medical/getAthleteConcussionAssessmentResults';
import { MockedIssueContextProvider } from '../../../../shared/contexts/IssueContext/utils/mocks';
import * as IssueContextMocks from '../../../../shared/contexts/IssueContext/utils/mocks';
import App from '../App';

jest.mock(
  '@kitman/modules/src/Medical/rosters/src/services/getAthleteAssessments'
);

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetConcussionFormTypesQuery: jest.fn(),
}));

jest.mock('@kitman/services/src/services/getAthleteData');
jest.mock(
  '@kitman/services/src/services/medical/getAthleteConcussionAssessmentResults'
);

describe('<App />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const waitForContentToRender = async () => {
    await waitFor(() => {
      expect(screen.getByText('Player overview')).toBeInTheDocument();
    });
  };

  let defaultConcussionPermissions;
  let defaultRehabPermissions;
  let mockedPermissionsContextValue;
  let mockedIssueContextValue = IssueContextMocks.mockedIssueContextValue;
  let mockedIssueWithICDContextValue =
    IssueContextMocks.mockedIssueWithICDContextValue;
  let mockedIssueWithDATALYSContextValue =
    IssueContextMocks.mockedIssueWithDATALYSContextValue;
  let mockedIssueWithConcussionICDCoding =
    IssueContextMocks.mockedIssueWithConcussionICDCoding;
  let dispatchSpy;
  let store;
  let mockedSCAT5Results;
  let originalHash = '';

  beforeEach(() => {
    originalHash = window.location.hash;
    defaultConcussionPermissions = DEFAULT_CONTEXT_VALUE.permissions.concussion;
    defaultRehabPermissions = DEFAULT_CONTEXT_VALUE.permissions.rehab;
    getAthleteAssessments.mockResolvedValue([]);
    mockedPermissionsContextValue = {
      permissions: {
        medical: {
          ...defaultMedicalPermissions,
        },
        concussion: {
          ...defaultConcussionPermissions,
        },
        rehab: {
          ...defaultRehabPermissions,
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    };
    window.setFlag('rehab-tab-injury', true);

    dispatchSpy = jest.fn();
    store = storeFake({
      addDiagnosticSidePanel: {
        isOpen: false,
        initialInfo: {},
      },
      addDiagnosticAttachmentSidePanel: {
        isOpen: false,
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
        initialInfo: {},
      },
      addConcussionTestResultsSidePanel: {
        isOpen: false,
        initialInfo: {
          testProtocol: 'NPC',
          isAthleteSelectable: false,
        },
      },
      addConcussionAssessmentSidePanel: {
        isOpen: false,
        initialInfo: {
          isAthleteSelectable: false,
        },
      },
      addTUESidePanel: {
        isOpen: false,
        initialInfo: {
          isAthleteSelectable: false,
        },
      },
      addWorkersCompSidePanel: {
        isOpen: false,
        initialInfo: {},
        page: 1,
        submitModal: {
          isOpen: false,
        },
        showPrintPreview: {
          sidePanel: false,
          card: false,
        },
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
      },
      addOshaFormSidePanel: {
        isOpen: false,
        page: 1,
        initialInformation: {},
        employeeDrInformation: {},
        caseInformation: {},
        showPrintPreview: {
          sidePanel: false,
          card: false,
        },
      },
      selectAthletesSidePanel: {
        isOpen: false,
      },
      treatmentCardList: {
        athleteTreatments: {},
        invalidEditTreatmentCards: [],
      },
      medicalApi: {},
      toasts: [],
      medicalHistory: {},
      globalApi: {
        useGetOrganisationQuery: jest.fn(),
      },
      medicalSharedApi: {
        useGetAthleteDataQuery: jest.fn(),
      },
    });

    useGetConcussionFormTypesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    mockedSCAT5Results = [
      {
        column_section: 'Total number of symptoms:',
        column_baseline: '3/22',
        'column_2022-04-01': '10',
        'column_2022-04-02': '22',
        'column_2022-04-03': '33',
        'column_2022-04-04': '44',
        'column_2022-04-05': '55',
        'column_2022-04-06': '55',
        'column_2022-04-07': '55',
        'column_2022-04-08': '55',
        'column_2022-04-09': '55',
      },
      {
        column_section: 'Symptom severity score:',
        column_baseline: '3/132',
        'column_2022-04-01': '10',
        'column_2022-04-02': '22',
        'column_2022-04-03': '33',
        'column_2022-04-04': '44',
        'column_2022-04-05': '55',
        'column_2022-04-06': '55',
        'column_2022-04-07': '55',
        'column_2022-04-08': '55',
        'column_2022-04-09': '55',
      },
    ];

    store.dispatch = dispatchSpy;

    // Re-initialize issue context values for each test
    mockedIssueContextValue = IssueContextMocks.mockedIssueContextValue;
    mockedIssueWithICDContextValue =
      IssueContextMocks.mockedIssueWithICDContextValue;
    mockedIssueWithDATALYSContextValue =
      IssueContextMocks.mockedIssueWithDATALYSContextValue;
    mockedIssueWithConcussionICDCoding =
      IssueContextMocks.mockedIssueWithConcussionICDCoding;

    // Override Sinon spies with Jest mocks for this test file
    mockedIssueContextValue.updateIssue = jest.fn();
    mockedIssueWithICDContextValue.updateIssue = jest.fn();
    mockedIssueWithDATALYSContextValue.updateIssue = jest.fn();
  });

  afterEach(() => {
    window.location.hash = originalHash;
    window.setFlag('rehab-tab-injury', false);
    jest.clearAllMocks(); // Clear mocks for dispatchSpy and other jest.fn()
  });

  it('renders a loader initially', () => {
    getAthleteData.mockResolvedValue(mockAthleteData);

    render(
      <Provider store={store}>
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <App {...props} />
          </MockedIssueContextProvider>
        </MockedPermissionContextProvider>
      </Provider>
    );

    expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      getAthleteData.mockRejectedValue(new Error('whoops'));
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('shows an error message', async () => {
      render(
        <Provider store={store}>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedPermissionsContextValue,
              permissionsRequestStatus: 'FAILURE',
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <App {...props} />
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });
    });
  });

  describe('when the initial request is successful', () => {
    beforeEach(() => {
      getAthleteData.mockResolvedValue(mockAthleteData);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('[permissions] default permissions', () => {
      it('renders the correct content', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        expect(screen.getByText('Injury overview')).toBeInTheDocument();
      });

      it('renders the correct tab name', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        expect(screen.getByText('Injury overview')).toBeInTheDocument();
      });
    });

    describe('when the issue uses ICD', () => {
      beforeEach(() => {
        window.setFlag('emr-multiple-coding-systems', true);
      });

      afterEach(() => {
        window.setFlag('emr-multiple-coding-systems', false);
      });

      it('renders the correct pathology name', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueWithICDContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        expect(screen.getAllByRole('heading')[0]).toHaveTextContent(
          'John Doe - Fracture of foot and toe, except ankle'
        );
      });

      describe('when concussion-medical-area flag is true', () => {
        let issueContextConcussion;

        beforeEach(() => {
          window.setFlag('concussion-medical-area', true);
          issueContextConcussion = { ...mockedIssueWithICDContextValue };
          issueContextConcussion.issue = {
            ...(mockedIssueWithICDContextValue &&
              mockedIssueWithICDContextValue.issue),
            ...mockedIssueWithConcussionICDCoding,
          };
          window.location.hash = '#concussion';
          getAthleteConcussionAssessmentResults.mockResolvedValue(
            mockedSCAT5Results
          );
        });
        afterEach(() => {
          window.setFlag('concussion-medical-area', false);
          jest.resetAllMocks();
        });

        it('renders the AddConcussionTestResultsSidePanel when have canManageKingDevickAssessments permission', async () => {
          render(
            <Provider store={store}>
              <MockedPermissionContextProvider
                permissionsContext={{
                  ...mockedPermissionsContextValue,
                  permissions: {
                    ...mockedPermissionsContextValue.permissions,
                    concussion: {
                      ...defaultConcussionPermissions,
                      canViewConcussionAssessments: true,
                      canManageKingDevickAssessments: true,
                      canManageConcussionAssessments: true,
                    },
                  },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={issueContextConcussion}
                >
                  <App {...props} />
                </MockedIssueContextProvider>
              </MockedPermissionContextProvider>
            </Provider>
          );

          await waitForContentToRender();

          expect(
            screen.getByTestId('AddConcussionResultSidePanel|TestTypeSelector')
          ).toBeInTheDocument();
        });
      });
    });

    describe('when the issue uses the DATALYS coding system', () => {
      beforeEach(() => {
        window.setFlag('emr-multiple-coding-systems', true);
        getAthleteData.mockResolvedValue(mockAthleteData);
      });

      afterEach(() => {
        window.setFlag('emr-multiple-coding-systems', false);
        jest.resetAllMocks();
      });

      it('renders the correct pathology name', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueWithDATALYSContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        expect(screen.getAllByRole('heading')[0]).toHaveTextContent(
          'John Doe - Fracture of foot and toe, except ankle'
        );
      });
    });

    describe('when concussion-medical-area flag is true', () => {
      beforeEach(() => {
        window.setFlag('concussion-medical-area', true);
      });
      afterEach(() => {
        window.setFlag('concussion-medical-area', false);
      });

      describe('when the issue is concussion', () => {
        const issueContextConcussion = { ...mockedIssueContextValue };
        issueContextConcussion.issue = {
          ...mockedIssueContextValue.issue,
          osics: {
            osics_pathology: 'Acute Concussion with visual symptoms',
            osics_body_area: 'Head',
            osics_pathology_id: 419,
            osics_classification: 'Concussion/ Brain Injury',
            ocics_id: 'HNCO',
            groups: ['concussion'],
          },
        };

        beforeEach(() => {
          window.location.hash = '#concussion';
          getAthleteConcussionAssessmentResults.mockResolvedValue(
            mockedSCAT5Results
          );
        });
        afterEach(() => {
          jest.resetAllMocks();
        });

        it('renders the concussion tab when have canViewConcussionAssessments permission', async () => {
          render(
            <Provider store={store}>
              <MockedPermissionContextProvider
                permissionsContext={{
                  ...mockedPermissionsContextValue,
                  permissions: {
                    ...mockedPermissionsContextValue.permissions,
                    concussion: {
                      ...defaultConcussionPermissions,
                      canViewConcussionAssessments: true,
                    },
                  },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={issueContextConcussion}
                >
                  <App {...props} />
                </MockedIssueContextProvider>
              </MockedPermissionContextProvider>
            </Provider>
          );

          await waitForContentToRender();

          expect(
            screen.getByRole('tab', { name: 'Assessments' })
          ).toBeInTheDocument();
        });

        it('renders the AddConcussionTestResultsSidePanel when have canManageKingDevickAssessments permission', async () => {
          render(
            <Provider store={store}>
              <MockedPermissionContextProvider
                permissionsContext={{
                  ...mockedPermissionsContextValue,
                  permissions: {
                    ...mockedPermissionsContextValue.permissions,
                    concussion: {
                      ...defaultConcussionPermissions,
                      canViewConcussionAssessments: true,
                      canManageKingDevickAssessments: true,
                      canManageConcussionAssessments: true,
                    },
                  },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={issueContextConcussion}
                >
                  <App {...props} />
                </MockedIssueContextProvider>
              </MockedPermissionContextProvider>
            </Provider>
          );

          await waitForContentToRender();

          expect(
            screen.getByText('Add near point of convergence (NPC) results')
          ).toBeInTheDocument();
        });
      });

      describe('when the issue is not a concussion and the tab hash is #concussion', () => {
        beforeEach(() => {
          window.location.hash = '#concussion';
          getAthleteConcussionAssessmentResults.mockResolvedValue(
            mockedSCAT5Results
          );
        });
        afterEach(() => {
          jest.resetAllMocks();
        });

        it('does not render the concussion tab', async () => {
          render(
            <Provider store={store}>
              <MockedPermissionContextProvider
                permissionsContext={{
                  ...mockedPermissionsContextValue,
                  permissions: {
                    ...mockedPermissionsContextValue.permissions,
                    concussion: {
                      ...defaultConcussionPermissions,
                      canViewConcussionAssessments: true,
                    },
                  },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={mockedIssueContextValue}
                >
                  <App {...props} />
                </MockedIssueContextProvider>
              </MockedPermissionContextProvider>
            </Provider>
          );

          await waitForContentToRender();

          expect(
            screen.queryByRole('tab', { name: 'Treatments' })
          ).not.toBeInTheDocument();
        });

        it('does not render the AddConcussionTestResultsSidePanel', async () => {
          const { container } = render(
            <Provider store={store}>
              <MockedPermissionContextProvider
                permissionsContext={{
                  ...mockedPermissionsContextValue,
                  permissions: {
                    ...mockedPermissionsContextValue.permissions,
                    concussion: {
                      ...defaultConcussionPermissions,
                      canViewConcussionAssessments: true,
                      canManageKingDevickAssessments: true,
                      canManageConcussionAssessments: true,
                    },
                  },
                }}
              >
                <MockedIssueContextProvider
                  issueContext={mockedIssueContextValue}
                >
                  <App {...props} />
                </MockedIssueContextProvider>
              </MockedPermissionContextProvider>
            </Provider>
          );

          await waitForContentToRender();

          expect(
            screen.queryByTestId('concussionList')
          ).not.toBeInTheDocument();

          expect(
            container.querySelector(
              'AddConcussionTestResultsSidePanelContainer'
            )
          ).not.toBeInTheDocument();
        });
      });
    });

    describe('when the hash is #issues', () => {
      beforeEach(() => {
        window.location.hash = '#issues';
      });

      it('renders the issues tab', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        expect(
          screen.getByRole('tab', { name: 'Injury overview' })
        ).toBeInTheDocument();
      });
    });

    describe('when the hash is #modifications', () => {
      beforeEach(() => {
        window.location.hash = '#modifications';
      });

      // IS THIS THE ISSUE, seems to be impacted by renders the issues tab
      it('renders the modifications tab', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedPermissionsContextValue,
                permissions: {
                  ...mockedPermissionsContextValue.permissions,
                  medical: {
                    ...defaultMedicalPermissions,
                    modifications: { canView: true },
                  },
                },
              }}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <App {...props} />
                </LocalizationProvider>
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        expect(
          screen.getByRole('tab', { name: 'Modifications' })
        ).toBeInTheDocument();
      });
    });

    describe('when the hash is #forms with necessary feature flags on', () => {
      beforeEach(() => {
        window.setFlag('medical-forms-tab-iteration-1', true);
        window.setFlag('medical-forms-new-endpoints', false);
        window.location.hash = '#forms';
      });
      afterEach(() => {
        window.setFlag('medical-forms-tab-iteration-1', false);
        window.setFlag('medical-forms-new-endpoints', false);
      });

      it('renders the forms tab', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedPermissionsContextValue,
                permissions: {
                  ...mockedPermissionsContextValue.permissions,
                  medical: {
                    ...defaultMedicalPermissions,
                    forms: { canView: true },
                  },
                },
              }}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        expect(screen.getByRole('tab', { name: 'Forms' })).toBeInTheDocument();
      });
    });

    describe('when the hash is #forms with medical-forms-tab-iteration-1 feature flag off', () => {
      beforeEach(() => {
        window.setFlag('medical-forms-tab-iteration-1', false);
        window.setFlag('medical-forms-new-endpoints', false);
        window.location.hash = '#forms';
      });
      afterEach(() => {
        window.setFlag('medical-forms-tab-iteration-1', false);
        window.setFlag('medical-forms-new-endpoints', false);
      });

      // SEEMS impacted by renders the forms tab
      it('does not render the forms tab', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedPermissionsContextValue,
                permissions: {
                  ...mockedPermissionsContextValue.permissions,
                  medical: {
                    ...defaultMedicalPermissions,
                    forms: { canView: true },
                  },
                },
              }}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        expect(
          screen.queryByRole('tab', { name: 'Forms' })
        ).not.toBeInTheDocument();
      });
    });

    describe('when the hash is #forms with medical-forms-new-endpoints feature flag on', () => {
      beforeEach(() => {
        window.setFlag('medical-forms-tab-iteration-1', true);
        window.setFlag('medical-forms-new-endpoints', true);
        window.location.hash = '#forms';
      });
      afterEach(() => {
        window.setFlag('medical-forms-tab-iteration-1', false);
        window.setFlag('medical-forms-new-endpoints', false);
      });

      // SEEMS impacted by renders the forms tab
      it('does not render the forms tab', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedPermissionsContextValue,
                permissions: {
                  ...mockedPermissionsContextValue.permissions,
                  medical: {
                    ...defaultMedicalPermissions,
                    forms: { canView: true },
                  },
                },
              }}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        expect(
          screen.queryByRole('tab', { name: 'Forms' })
        ).not.toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.notes.canView', () => {
      beforeEach(() => {
        window.location.hash = '#medical_notes';
      });

      it('renders the correct content', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedPermissionsContextValue,
                permissions: {
                  ...mockedPermissionsContextValue.permissions,
                  medical: {
                    ...defaultMedicalPermissions,
                    notes: { canView: true },
                    forms: { canView: true },
                  },
                },
              }}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );
        await waitForContentToRender();

        expect(
          screen.getByRole('tabpanel', { name: 'Notes' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tabpanel', { name: 'Notes' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { name: 'Notes', level: 3 })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.rehab.canView', () => {
      beforeEach(() => {
        window.location.hash = '#rehab';
      });

      it('renders the correct content', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedPermissionsContextValue,
                permissions: {
                  ...mockedPermissionsContextValue.permissions,
                  rehab: {
                    canView: true,
                  },
                },
              }}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );
        await waitForContentToRender();

        expect(
          screen.getByRole('tabpanel', { name: 'Rehab' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tabpanel', { name: 'Rehab' })
        ).toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.treatments.canView', () => {
      beforeEach(() => {
        window.location.hash = '#treatments';
      });

      it('renders the correct content', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedPermissionsContextValue,
                permissions: {
                  ...mockedPermissionsContextValue.permissions,
                  medical: {
                    ...defaultMedicalPermissions,
                    treatments: {
                      canEdit: true,
                      canCreate: true,
                      canView: true,
                    },
                  },
                },
              }}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );
        await waitForContentToRender();

        expect(
          screen.getByRole('tab', { name: 'Treatments' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tabpanel', { name: 'Treatments' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { name: 'Treatments', level: 3 })
        ).toBeInTheDocument();
      });
    });

    describe('[FEATURE FLAG] dr-first-integration ON', () => {
      beforeEach(() => {
        window.setFlag('dr-first-integration', true);
        window.setFlag('medications-general-availability', false);
      });
      afterEach(() => {
        window.setFlag('dr-first-integration', false);
      });

      it('renders the correct content', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        await waitFor(() => {
          expect(
            screen.getByRole('tab', { name: 'Medications' })
          ).toBeInTheDocument();
        });
      });
    });

    describe('[FEATURE FLAG] medications-general-availability ON', () => {
      beforeEach(() => {
        window.setFlag('medications-general-availability', true);
        window.setFlag('dr-first-integration', false);
      });
      afterEach(() => {
        window.setFlag('medications-general-availability', false);
      });

      it('renders the correct content', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        await waitFor(() => {
          expect(
            screen.getByRole('tab', { name: 'Medications' })
          ).toBeInTheDocument();
        });
      });
    });

    describe('[FEATURE FLAG] dr-first-integration AND medications-general-availability OFF', () => {
      beforeEach(() => {
        window.setFlag('medications-general-availability', false);
        window.setFlag('dr-first-integration', false);
      });

      it('renders the correct content', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <MockedIssueContextProvider
                issueContext={mockedIssueContextValue}
              >
                <App {...props} />
              </MockedIssueContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitForContentToRender();

        await waitFor(() => {
          expect(
            screen.queryByRole('tab', { name: 'Medications' })
          ).not.toBeInTheDocument();
        });
      });
    });
  });
});
