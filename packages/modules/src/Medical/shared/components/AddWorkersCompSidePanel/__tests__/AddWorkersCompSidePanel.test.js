import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  within,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  saveDraftWorkersComp,
  getClinicalImpressionsBodyAreas,
} from '@kitman/services';
import { useFetchOrganisationPreferenceQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import {
  MockedIssueContextProvider,
  mockedIssueContextValue,
} from '../../../contexts/IssueContext/utils/mocks';
import AddWorkersCompSidePanel from '../index';
import { getPathologyTitle } from '../../../utils';
import useCurrentUser from '../../../hooks/useGetCurrentUser';
import { useGetSidesQuery } from '../../../redux/services/medical';

jest.mock('@kitman/services');
jest.mock('../../../utils');
jest.mock('@kitman/components/src/Select');
jest.mock('../../../hooks/useGetCurrentUser');
jest.mock('../../../redux/services/medical');
jest.mock('@kitman/common/src/redux/global/services/globalApi');

describe('<AddWorkersCompSidePanel />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockStore = storeFake({
    addWorkersCompSidePanel: {
      isOpen: true,
      page: 1,
      showPrintPreview: {
        sidePanel: false,
        card: false,
      },
      claimInformation: {
        personName: 'Option 1',
        policyNumber: '12345',
        contactNumber: '07827162731',
        lossDate: '20 Dec 2022',
        lossTime: '5:35 pm',
        lossCity: 'Test City',
        lossState: 'Test State',
        lossJurisdiction: 'Optional',
        lossDescription: 'Test',
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
    globalApi: {
      useFetchOrganisationPreferenceQuery: jest.fn(),
    },
  });

  const mockStoreWithPrintPreview = storeFake({
    addWorkersCompSidePanel: {
      isOpen: true,
      page: 3,
      showPrintPreview: {
        sidePanel: true,
        card: false,
      },
      claimInformation: {
        personName: 'Option 1',
        policyNumber: '12345',
        contactNumber: '07827162731',
        lossDate: '20 Dec 2022',
        lossTime: '5:35 pm',
        lossCity: 'Test City',
        lossState: 'Test State',
        lossJurisdiction: 'Optional',
        lossDescription: 'Test',
        side: 1,
        bodyArea: 1,
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
  });

  const props = {
    isOpen: true,
    onClose: jest.fn(),
    athleteData: {
      firstname: 'John',
      lastname: 'Doe',
      date_of_birth: '23/08/1997',
      social_security_number: '12345',
      position: 'Forward',
    },
    staffUsers: [{ value: 666, label: 'Ball Boy' }],
    t: i18nextTranslateStub(),
  };

  const useDispatchMock = jest.fn();
  mockStore.dispatch = useDispatchMock;

  beforeEach(() => {
    jest.useFakeTimers();
    const fifthOfJanuary = new Date('2023-01-05');
    jest.setSystemTime(fifthOfJanuary);
    useCurrentUser.mockReturnValue({
      currentUser: null,
      fetchCurrentUser: jest.fn(),
    });
    useGetSidesQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Left' },
        { id: 2, name: 'Right' },
      ],
    });
    getClinicalImpressionsBodyAreas.mockResolvedValue([
      { id: 1, name: 'Head' },
      { id: 2, name: 'Arm' },
    ]);

    useFetchOrganisationPreferenceQuery.mockReturnValue({
      data: { isOptionalWorkersCompClaimPolicyNumber: false },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render <AddWorkersCompSidePanel />', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <AddWorkersCompSidePanel {...props} />
      </Provider>
    );

    expect(
      screen.getByTestId('AddWorkersCompSidePanel__container')
    ).toBeInTheDocument();

    const titleSpan = container.querySelector('span');
    expect(titleSpan).toHaveTextContent(`Workers' comp claim`);
  });

  it('should render base contents (progress bar, title, nav buttons)', () => {
    render(
      <Provider store={mockStore}>
        <AddWorkersCompSidePanel {...props} />
      </Provider>
    );

    expect(
      screen.getByTestId('AddWorkersCompSidePanel|ProgressBar')
    ).toBeInTheDocument();

    // Nav buttons
    expect(
      screen.queryByTestId('AddWorkersCompSidePanel|BackButton')
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|SaveDraftButton')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|NextButton')
    ).toBeInTheDocument();
  });

  it('should call props.onClose on click of close button', () => {
    render(
      <Provider store={mockStore}>
        <AddWorkersCompSidePanel {...props} />
      </Provider>
    );

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(props.onClose).toHaveBeenCalled();
  });

  it('should render back button if currentPage is not 1', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 2,
        showPrintPreview: {
          sidePanel: false,
          card: false,
        },
        claimInformation: {
          personName: 'Option 1',
          policyNumber: '12345',
          contactNumber: '07827162731',
          lossDate: '20 Dec 2022',
          lossTime: '5:35 pm',
          lossCity: 'Test City',
          lossState: 'Test State',
          lossJurisdiction: 'Optional',
          lossDescription: 'Test',
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
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AddWorkersCompSidePanel {...props} />
      </Provider>
    );

    expect(
      screen.getByTestId('AddWorkersCompSidePanel|BackButton')
    ).toBeInTheDocument();
  });

  it('should not render next button if currentPage is 3', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 3,
        showPrintPreview: {
          sidePanel: false,
          card: false,
        },
        claimInformation: {
          personName: 'Option 1',
          policyNumber: '12345',
          contactNumber: '07827162731',
          lossDate: '20 Dec 2022',
          lossTime: '5:35 pm',
          lossCity: 'Test City',
          lossState: 'Test State',
          lossJurisdiction: 'Optional',
          lossDescription: 'Test',
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
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AddWorkersCompSidePanel {...props} />
      </Provider>
    );

    expect(
      screen.queryByTestId('AddWorkersCompSidePanel|NextButton')
    ).not.toBeInTheDocument();
  });

  it('should not render print and submit button if current page is 3', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 3,
        showPrintPreview: {
          sidePanel: false,
          card: false,
        },
        claimInformation: {
          personName: 'Option 1',
          policyNumber: '12345',
          contactNumber: '07827162731',
          lossDate: '20 Dec 2022',
          lossTime: '5:35 pm',
          lossCity: 'Test City',
          lossState: 'Test State',
          lossJurisdiction: 'Optional',
          lossDescription: 'Test',
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
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AddWorkersCompSidePanel {...props} />
      </Provider>
    );

    expect(
      screen.queryByTestId('AddWorkersCompSidePanel|PrintButton')
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('AddWorkersCompSidePanel|SubmitToInsuranceButton')
    ).toBeInTheDocument();
  });

  describe('content', () => {
    it('should render <ClaimInformation /> if current page is 1', () => {
      render(
        <Provider store={mockStore}>
          <AddWorkersCompSidePanel {...props} />
        </Provider>
      );

      expect(screen.getByTestId('ClaimInformation')).toBeInTheDocument();
      expect(
        screen.queryByTestId('AdditionalInformation')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('PreviewAndPrint')).not.toBeInTheDocument();
    });

    it('should render <AdditionalInformation /> if current page is 2', () => {
      const mockStoreUpdated = storeFake({
        addWorkersCompSidePanel: {
          isOpen: true,
          page: 2,
          showPrintPreview: {
            sidePanel: false,
            card: false,
          },
          claimInformation: {
            personName: 'Option 1',
            policyNumber: '12345',
            contactNumber: '07827162731',
            lossDate: '20 Dec 2022',
            lossTime: '5:35 pm',
            lossCity: 'Test City',
            lossState: 'Test State',
            lossJurisdiction: 'Optional',
            lossDescription: 'Test',
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
      });

      render(
        <Provider store={mockStoreUpdated}>
          <AddWorkersCompSidePanel {...props} />
        </Provider>
      );

      expect(screen.queryByTestId('ClaimInformation')).not.toBeInTheDocument();
      expect(screen.getByTestId('AdditionalInformation')).toBeInTheDocument();
      expect(screen.queryByTestId('PreviewAndPrint')).not.toBeInTheDocument();
    });

    it('should render <PreviewAndPrint /> if current page is 3', () => {
      const mockStoreUpdated = storeFake({
        addWorkersCompSidePanel: {
          isOpen: true,
          page: 3,
          showPrintPreview: {
            sidePanel: false,
            card: false,
          },
          claimInformation: {
            personName: 'Option 1',
            policyNumber: '12345',
            contactNumber: '07827162731',
            lossDate: '20 Dec 2022',
            lossTime: '5:35 pm',
            lossCity: 'Test City',
            lossState: 'Test State',
            lossJurisdiction: 'Optional',
            lossDescription: 'Test',
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
      });

      render(
        <Provider store={mockStoreUpdated}>
          <AddWorkersCompSidePanel {...props} />
        </Provider>
      );

      expect(screen.queryByTestId('ClaimInformation')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('AdditionalInformation')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('PreviewAndPrint')).toBeInTheDocument();
    });

    it('should render InvalidList if current page is 3 & missing req. fields', () => {
      const mockStoreUpdated = storeFake({
        addWorkersCompSidePanel: {
          isOpen: true,
          page: 3,
          showPrintPreview: {
            sidePanel: false,
            card: false,
          },
          claimInformation: {
            personName: 'Option 1',
            policyNumber: '12345',
            contactNumber: '07827162731',
            lossDate: '20 Dec 2022',
            lossTime: '5:35 pm',
            lossCity: 'Test City',
            lossState: 'Test State',
            lossJurisdiction: 'Optional',
            lossDescription: 'Test',
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
      });

      render(
        <Provider store={mockStoreUpdated}>
          <AddWorkersCompSidePanel {...props} />
        </Provider>
      );

      expect(screen.queryByTestId('ClaimInformation')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('AdditionalInformation')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('PreviewAndPrint')).toBeInTheDocument();
      expect(
        screen.getByTestId('AddWorkersCompSidePanel|InvalidList')
      ).toBeInTheDocument();
    });

    it('should NOT render InvalidList if current page is 3 & NOT missing req. fields', () => {
      const mockStoreUpdated = storeFake({
        addWorkersCompSidePanel: {
          isOpen: true,
          page: 3,
          showPrintPreview: {
            sidePanel: false,
            card: false,
          },
          claimInformation: {
            personName: 'Option 1',
            policyNumber: '12345',
            contactNumber: '07827162731',
            lossDate: '20 Dec 2022',
            lossTime: '5:35 pm',
            lossCity: 'Test City',
            lossState: 'Test State',
            lossJurisdiction: 'Optional',
            lossDescription: 'Test',
          },
          additionalInformation: {
            firstName: 'Athlete',
            lastName: 'Athlete-Lastname',
            address1: '1234 Address rd.',
            address2: 'Apt. 1',
            city: 'LA',
            state: 'CA',
            zipCode: '90210',
            phoneNumber: '695-555-1234',
          },
        },
      });

      render(
        <Provider store={mockStoreUpdated}>
          <AddWorkersCompSidePanel {...props} />
        </Provider>
      );

      expect(screen.queryByTestId('ClaimInformation')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('AdditionalInformation')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('AddWorkersCompSidePanel|InvalidList')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('PreviewAndPrint')).toBeInTheDocument();
    });
  });

  describe('<AppStatus />', () => {
    it('should render <AppStatus /> error component if save draft call fails', async () => {
      render(
        <Provider store={mockStore}>
          <AddWorkersCompSidePanel {...props} />
        </Provider>
      );

      act(() => {
        saveDraftWorkersComp.mockRejectedValue('not working');
        fireEvent.click(screen.getByText('Save draft'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
      });
    });

    it('should render <AppStatus /> error component if staff user request fails', async () => {
      render(
        <Provider store={mockStore}>
          <AddWorkersCompSidePanel
            {...props}
            staffUsersRequestStatus="FAILURE"
          />
        </Provider>
      );

      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });

    it('should render <AppStatus /> loading component if staff user request is pending', async () => {
      render(
        <Provider store={mockStore}>
          <AddWorkersCompSidePanel
            {...props}
            staffUsersRequestStatus="PENDING"
          />
        </Provider>
      );

      expect(screen.getByTestId('AppStatus-loading')).toBeInTheDocument();
    });
  });

  describe('workers comp status dependant', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 3,
        showPrintPreview: {
          sidePanel: false,
          card: false,
        },
        claimInformation: {
          personName: 'Option 1',
          policyNumber: '12345',
          contactNumber: '07827162731',
          lossDate: '20 Dec 2022',
          lossTime: '5:35 pm',
          lossCity: 'Test City',
          lossState: 'Test State',
          lossJurisdiction: 'Optional',
          lossDescription: 'Test',
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
    });

    it('should render progress bar if status is draft', () => {
      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider
            issueContext={{
              issue: { workers_comp: { status: 'draft' } },
              issueType: 'Illness',
              isChronicIssue: true,
            }}
          >
            <AddWorkersCompSidePanel {...props} />
          </MockedIssueContextProvider>
        </Provider>
      );

      expect(
        screen.getByTestId('AddWorkersCompSidePanel|ProgressBar')
      ).toBeInTheDocument();
    });

    it('should not render progress bar if status is submitted', () => {
      render(
        <MockedIssueContextProvider
          issueContext={{
            issue: { workers_comp: { status: 'submitted' } },
            issueType: 'Illness',
            isChronicIssue: true,
          }}
        >
          <Provider store={mockStore}>
            <AddWorkersCompSidePanel {...props} />
          </Provider>
        </MockedIssueContextProvider>
      );

      expect(
        screen.queryByTestId('AddWorkersCompSidePanel|ProgressBar')
      ).not.toBeInTheDocument();
    });

    it('should render 4 buttons on preview page if status is draft', () => {
      render(
        <Provider store={mockStoreUpdated}>
          <MockedIssueContextProvider
            issueContext={{
              issue: { workers_comp: { status: 'draft' } },
              issueType: 'Illness',
              isChronicIssue: true,
            }}
          >
            <AddWorkersCompSidePanel {...props} />
          </MockedIssueContextProvider>
        </Provider>
      );

      const buttonsContainer = screen.getByTestId(
        'AddWorkersCompSidePanel|ButtonsContainer'
      );

      expect(within(buttonsContainer).getAllByRole('button')).toHaveLength(4);
    });

    it('should render 1 button (Print) on preview page if status is submitted', () => {
      render(
        <Provider store={mockStoreUpdated}>
          <MockedIssueContextProvider
            issueContext={{
              issue: { workers_comp: { status: 'submitted' } },
              issueType: 'Illness',
              isChronicIssue: true,
            }}
          >
            <AddWorkersCompSidePanel {...props} />
          </MockedIssueContextProvider>
        </Provider>
      );

      const buttonsContainer = screen.getByTestId(
        'AddWorkersCompSidePanel|ButtonsContainer'
      );

      // Disabled below as I feel checking for length here has better context for the test
      // eslint-disable-next-line jest-dom/prefer-in-document
      expect(within(buttonsContainer).getAllByRole('button')).toHaveLength(1);
    });
  });

  describe('loss description default value', () => {
    beforeEach(() => {
      getPathologyTitle.mockReturnValue('Test value from pathology');
    });

    it('should use value from workers comp issue if exists', async () => {
      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddWorkersCompSidePanel {...props} isOpen />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
          claimInformationValues: {
            bodyArea: 1,
            contactNumber: '(555) 11111',
            lossCity: 'San Francisco',
            lossDate: '2022-12-16',
            lossDescription: 'text text',
            lossJurisdiction: 'CA',
            lossState: 'CA',
            personName: {
              firstName: null,
              label: null,
              lastName: null,
              value: null,
            },
            policyNumber: 'xxxxxx',
            side: 1,
          },
          type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
        });
      });
    });

    it('should use value from issue title if workers comp issue doesnt exists and isChronicIssue', async () => {
      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              isChronicIssue: true,
              issue: {
                ...mockedIssueContextValue.issue,
                title: 'Test value from issue title',
                workers_comp: {},
              },
            }}
          >
            <AddWorkersCompSidePanel {...props} isOpen />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
          claimInformationValues: {
            bodyArea: null,
            contactNumber: null,
            lossCity: null,
            lossDate: '2022-01-13T00:00:00+00:00',
            lossDescription: 'Test value from issue title',
            lossJurisdiction: null,
            lossState: null,
            personName: {
              firstName: null,
              label: null,
              lastName: null,
              value: null,
            },
            policyNumber: null,
            side: null,
          },
          type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
        });
      });
    });

    it('should use value from pathology title if isChronicIssue is false', async () => {
      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              isChronicIssue: false,
              issue: {
                ...mockedIssueContextValue.issue,
                workers_comp: {},
              },
            }}
          >
            <AddWorkersCompSidePanel {...props} isOpen />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
          claimInformationValues: {
            bodyArea: null,
            contactNumber: null,
            lossCity: null,
            lossDate: '2022-01-13T00:00:00+00:00',
            lossDescription: 'Test value from pathology',
            lossJurisdiction: null,
            lossState: null,
            personName: {
              firstName: null,
              label: null,
              lastName: null,
              value: null,
            },
            policyNumber: null,
            side: null,
          },
          type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
        });
      });
    });
  });

  describe('auto population of org details', () => {
    it('should use address values from org, if exists and issue does not exists', async () => {
      render(
        <Provider store={mockStore}>
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: {
                id: 23,
                address: {
                  line1: 'Line 1',
                  line2: 'Line 2',
                  state: 'NY',
                  city: 'New York City',
                  zipcode: '11111',
                },
              },
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  workers_comp: {},
                },
              }}
            >
              <AddWorkersCompSidePanel {...props} isOpen />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMock).toHaveBeenNthCalledWith(2, {
          additionalInformationValues: {
            address1: 'Line 1',
            address2: 'Line 2',
            city: 'New York City',
            dateOfBirth: '23/08/1997',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: null,
            position: 'Forward',
            socialSecurityNumber: '12345',
            state: null,
            zipCode: '11111',
          },
          type: 'UPDATE_WORKERS_COMP_ADDITIONAL_INFORMATION',
        });
      });
    });

    it('should use policy number value from org, if exists and issue does not exist', async () => {
      render(
        <Provider store={mockStore}>
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: {
                id: 23,
                extended_attributes: {
                  berkley_policy_number: '12345',
                },
              },
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  workers_comp: {},
                },
              }}
            >
              <AddWorkersCompSidePanel {...props} isOpen />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
          claimInformationValues: {
            bodyArea: null,
            contactNumber: null,
            lossCity: null,
            lossDate: '2022-01-13T00:00:00+00:00',
            lossDescription: null,
            lossJurisdiction: null,
            lossState: null,
            personName: {
              firstName: null,
              label: null,
              lastName: null,
              value: null,
            },
            policyNumber: '12345',
            side: null,
          },
          type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
        });
      });
    });
  });

  describe('auto population of person name value', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    const mockedStaffUsers = [
      {
        value: 1,
        label: 'Reporter first name Reporter last name',
        firstName: 'Report first name',
        lastName: 'Reporter last name',
      },
      {
        value: 2,
        label: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        value: 3,
        label: 'Mo Salah',
        firstName: 'Mo',
        lastName: 'Salah',
      },
    ];

    it('should use value from workers comp issue, if exists', async () => {
      useCurrentUser.mockReturnValue({
        currentUser: { id: 1 },
        fetchCurrentUser: jest.fn(),
      });

      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddWorkersCompSidePanel
              {...props}
              isOpen
              staffUsers={mockedStaffUsers}
            />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
          claimInformationValues: {
            bodyArea: 1,
            contactNumber: '(555) 11111',
            lossCity: 'San Francisco',
            lossDate: '2022-12-16',
            lossDescription: 'text text',
            lossJurisdiction: 'CA',
            lossState: 'CA',
            personName: {
              firstName: 'Reporter first name',
              label: 'Reporter first name Reporter last name',
              lastName: 'Reporter last name',
              value: 1,
            },
            policyNumber: 'xxxxxx',
            side: 1,
          },
          type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
        });
      });
    });

    it('should use value from created_by on issue, if exists and workers comp issue does not', async () => {
      useCurrentUser.mockReturnValue({
        currentUser: { id: 2 },
        fetchCurrentUser: jest.fn(),
      });

      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              issue: {
                ...mockedIssueContextValue.issue,
                workers_comp: null,
                created_by: 'John Doe',
              },
            }}
          >
            <AddWorkersCompSidePanel
              {...props}
              isOpen
              staffUsers={mockedStaffUsers}
            />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
          claimInformationValues: {
            bodyArea: null,
            contactNumber: null,
            lossCity: null,
            lossDate: '2022-01-13T00:00:00+00:00',
            lossDescription: null,
            lossJurisdiction: null,
            lossState: null,
            personName: {
              firstName: 'John',
              label: 'John Doe',
              lastName: 'Doe',
              value: 2,
            },
            policyNumber: null,
            side: null,
          },
          type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
        });
      });
    });

    it('should use value from current user, if exists and details from issue does not', async () => {
      useCurrentUser.mockReturnValue({
        currentUser: {
          id: 3,
          firstname: 'Mo',
          lastname: 'Salah',
          fullname: 'Mo Salah',
        },
        fetchCurrentUser: jest.fn(),
      });

      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              issue: {
                ...mockedIssueContextValue.issue,
                workers_comp: null,
                created_by: null,
              },
            }}
          >
            <AddWorkersCompSidePanel
              {...props}
              isOpen
              staffUsers={mockedStaffUsers}
            />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
          claimInformationValues: {
            bodyArea: null,
            contactNumber: null,
            lossCity: null,
            lossDate: '2022-01-13T00:00:00+00:00',
            lossDescription: null,
            lossJurisdiction: null,
            lossState: null,
            personName: {
              firstName: 'Mo',
              label: 'Mo Salah',
              lastName: 'Salah',
              value: 3,
            },
            policyNumber: null,
            side: null,
          },
          type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
        });
      });
    });

    it('should use null if current user doesnt exists', async () => {
      useCurrentUser.mockReturnValue({
        currentUser: {
          id: 4,
          firstname: 'Random',
          lastname: 'User',
          fullname: 'Random User',
        },
        fetchCurrentUser: jest.fn(),
      });

      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              issue: {
                ...mockedIssueContextValue.issue,
                workers_comp: null,
                created_by: null,
              },
            }}
          >
            <AddWorkersCompSidePanel
              {...props}
              isOpen
              staffUsers={mockedStaffUsers}
            />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
          claimInformationValues: {
            bodyArea: null,
            contactNumber: null,
            lossCity: null,
            lossDate: '2022-01-13T00:00:00+00:00',
            lossDescription: null,
            lossJurisdiction: null,
            lossState: null,
            personName: {
              firstName: null,
              label: null,
              lastName: null,
              value: null,
            },
            policyNumber: null,
            side: null,
          },
          type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
        });
      });
    });

    it('should use null if user doesnt exist', async () => {
      useCurrentUser.mockReturnValue({
        currentUser: null,
        fetchCurrentUser: jest.fn(),
      });

      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              issue: {
                ...mockedIssueContextValue.issue,
                workers_comp: null,
                created_by: null,
              },
            }}
          >
            <AddWorkersCompSidePanel
              {...props}
              isOpen
              staffUsers={mockedStaffUsers}
            />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
          claimInformationValues: {
            bodyArea: null,
            contactNumber: null,
            lossCity: null,
            lossDate: '2022-01-13T00:00:00+00:00',
            lossDescription: null,
            lossJurisdiction: null,
            lossState: null,
            personName: {
              firstName: null,
              label: null,
              lastName: null,
              value: null,
            },
            policyNumber: null,
            side: null,
          },
          type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
        });
      });
    });
  });

  describe('Printing logic', () => {
    const useDispatchMockUpdated = jest.fn();
    mockStoreWithPrintPreview.dispatch = useDispatchMockUpdated;

    it('should trigger print if showPrintPreview is true', async () => {
      jest.spyOn(window, 'print').mockImplementation(() => {});

      render(
        <Provider store={mockStoreWithPrintPreview}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddWorkersCompSidePanel {...props} isOpen />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(window.print).toHaveBeenCalled();
      });
    });

    it('should call dispatch to set showPrintPreview to true, and with side and body area values on click of print button', async () => {
      render(
        <Provider store={mockStoreWithPrintPreview}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddWorkersCompSidePanel {...props} isOpen />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(getClinicalImpressionsBodyAreas).toHaveBeenCalled();
      });

      saveDraftWorkersComp.mockResolvedValue('working');
      fireEvent.click(screen.getByText('Print'));

      await waitFor(() => {
        expect(saveDraftWorkersComp).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(useDispatchMockUpdated).toHaveBeenNthCalledWith(14, {
          showPrintPreview: true,
          type: 'PRINT_WORKERS_COMP_FROM_SIDE_PANEL',
          side: 'Left',
          bodyArea: 'Head',
        });
      });
    });

    it('should call dispatch to set showPrintPreview to false on afterprint', async () => {
      render(
        <Provider store={mockStoreWithPrintPreview}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddWorkersCompSidePanel {...props} isOpen />
          </MockedIssueContextProvider>
        </Provider>
      );

      jest.spyOn(window, 'print').mockImplementation(() => {});

      await waitFor(() => {
        expect(useDispatchMockUpdated).toHaveBeenNthCalledWith(1, {
          showPrintPreview: false,
          type: 'PRINT_WORKERS_COMP_FROM_SIDE_PANEL',
        });
      });
    });
  });
});
