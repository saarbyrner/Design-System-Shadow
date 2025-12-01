import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as SaveDraftOshaForm from '@kitman/services/src/services/medical/saveDraftOshaForm';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import AddOshaFormSidePanel from '../index';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../contexts/IssueContext/utils/mocks';
import useCurrentUser from '../../../hooks/useGetCurrentUser';
import { getPathologyTitle, getAmericanStateOptions } from '../../../utils';

jest.mock('../../../hooks/useGetCurrentUser');
jest.mock('@kitman/services/src/services/medical/saveDraftOshaForm');
jest.mock('../../../utils');

describe('<AddOshaFormSidePanel />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const defaultOshaData = {
    initialInformation: {
      issueDate: null,
      reporter: {
        value: null,
        label: null,
      },
      reporterPhoneNumber: null,
      title: null,
    },
    employeeDrInformation: {
      city: null,
      dateHired: null,
      dateOfBirth: null,
      emergencyRoom: false,
      facilityCity: null,
      facilityName: null,
      facilityState: null,
      facilityStreet: null,
      facilityZip: null,
      fullName: null,
      hospitalized: false,
      physicianFullName: null,
      sex: 'M',
      state: null,
      street: null,
      zip: null,
    },
    caseInformation: {
      athleteActivity: null,
      caseNumber: null,
      dateInjured: null,
      dateOfDeath: null,
      issueDescription: null,
      noTimeEvent: false,
      objectSubstance: null,
      timeBeganWork: null,
      timeEvent: null,
      whatHappened: null,
    },
    showPrintPreview: {
      sidePanel: false,
      card: false,
    },
  };

  const mockStore = storeFake({
    addOshaFormSidePanel: {
      isOpen: true,
      page: 1,
      ...defaultOshaData,
    },
  });

  const mockStaffUsers = [
    { value: 1, label: 'Name One' },
    { value: 2, label: 'Name Two' },
    { value: 3, label: 'Name Three' },
    { value: 4, label: 'Name Four' },
  ];

  const props = {
    isOpen: true,
    onClose: jest.fn(),
    t: i18nextTranslateStub(),
    athleteData: {
      firstname: 'John',
      lastname: 'Doe',
      date_of_birth: '23/08/1997',
      id: 1,
      position: 'Forward',
    },
    staffUsers: mockStaffUsers,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    const fifthOfJanuary = new Date('2023-01-05');
    jest.setSystemTime(fifthOfJanuary);
    useCurrentUser.mockReturnValue({
      currentUser: {
        fullname: 'Name One',
        id: 1,
      },
      fetchCurrentUser: jest.fn(),
    });
    getAmericanStateOptions.mockReturnValue([
      {
        value: 'New York',
        label: 'NY',
      },
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it('should render <AddOshaFormSidePanel />', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <AddOshaFormSidePanel {...props} />
      </Provider>
    );

    expect(
      screen.getByTestId('AddOshaFormSidePanel__container')
    ).toBeInTheDocument();

    const titleSpan = container.querySelector('span');
    expect(titleSpan).toHaveTextContent(
      `OSHA’s Form 301 - Injury and Illness Incident Report`
    );
  });

  it('should render base contents (progress bar, title, nav buttons)', () => {
    render(
      <Provider store={mockStore}>
        <AddOshaFormSidePanel {...props} />
      </Provider>
    );

    expect(
      screen.getByTestId('AddOshaFormSidePanel|ProgressBar')
    ).toBeInTheDocument();

    // Nav buttons
    expect(
      screen.queryByTestId('AddOshaFormSidePanel|BackButton')
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaFormSidePanel|SaveProgressButton')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaFormSidePanel|NextButton')
    ).toBeInTheDocument();
  });

  it('should call props.onClose on click of close button', () => {
    render(
      <Provider store={mockStore}>
        <AddOshaFormSidePanel {...props} />
      </Provider>
    );

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(props.onClose).toHaveBeenCalled();
  });

  it('should render back button if currentPage is not 1', () => {
    const mockStoreUpdated = storeFake({
      addOshaFormSidePanel: {
        isOpen: true,
        page: 2,
        ...defaultOshaData,
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AddOshaFormSidePanel {...props} />
      </Provider>
    );

    expect(
      screen.getByTestId('AddOshaFormSidePanel|BackButton')
    ).toBeInTheDocument();
  });

  describe('content', () => {
    it('should render <InitialInformation /> if current page is 1', () => {
      render(
        <Provider store={mockStore}>
          <AddOshaFormSidePanel {...props} />
        </Provider>
      );

      expect(screen.getByTestId('InitialInformation')).toBeInTheDocument();
      expect(
        screen.queryByTestId('EmployeeDrInformation')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('CaseInformation')).not.toBeInTheDocument();
      expect(screen.queryByTestId('PreviewAndPrint')).not.toBeInTheDocument();
    });

    it('should render <EmployeeDrInformation /> if current page is 2', () => {
      const mockStoreUpdated = storeFake({
        addOshaFormSidePanel: {
          isOpen: true,
          page: 2,
          ...defaultOshaData,
        },
      });

      render(
        <Provider store={mockStoreUpdated}>
          <AddOshaFormSidePanel {...props} />
        </Provider>
      );

      expect(
        screen.queryByTestId('InitialInformation')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('EmployeeDrInformation')).toBeInTheDocument();
      expect(screen.queryByTestId('CaseInformation')).not.toBeInTheDocument();
      expect(screen.queryByTestId('PreviewAndPrint')).not.toBeInTheDocument();
    });

    it('should render <CaseInformation /> if current page is 3', () => {
      const mockStoreUpdated = storeFake({
        addOshaFormSidePanel: {
          isOpen: true,
          page: 3,
          ...defaultOshaData,
        },
      });

      render(
        <Provider store={mockStoreUpdated}>
          <AddOshaFormSidePanel {...props} />
        </Provider>
      );

      expect(
        screen.queryByTestId('InitialInformation')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('EmployeeDrInformation')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('CaseInformation')).toBeInTheDocument();
      expect(screen.queryByTestId('PreviewAndPrint')).not.toBeInTheDocument();
    });

    it('should render <PrintPreview /> if current page is 4', () => {
      const mockStoreUpdated = storeFake({
        addOshaFormSidePanel: {
          isOpen: true,
          page: 4,
          ...defaultOshaData,
        },
      });

      render(
        <Provider store={mockStoreUpdated}>
          <AddOshaFormSidePanel {...props} />
        </Provider>
      );

      expect(
        screen.queryByTestId('InitialInformation')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('EmployeeDrInformation')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('CaseInformation')).not.toBeInTheDocument();
      expect(screen.getByTestId('PrintPreview')).toBeInTheDocument();
    });
  });

  it('should call goToPreviousOshaPanelPage action on click of Back button', () => {
    const mockStoreWithPage2 = storeFake({
      addOshaFormSidePanel: {
        isOpen: true,
        page: 2,
        ...defaultOshaData,
      },
    });

    const useDispatchMock = jest.fn();
    mockStoreWithPage2.dispatch = useDispatchMock;

    render(
      <Provider store={mockStoreWithPage2}>
        <AddOshaFormSidePanel {...props} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Back'));
    expect(useDispatchMock).toHaveBeenNthCalledWith(4, {
      type: 'GO_TO_PREVIOUS_OSHA_PANEL_PAGE',
    });
  });

  it('should call goToNextOshPanelPage action on click of Back button', () => {
    const mockStoreWithPage2 = storeFake({
      addOshaFormSidePanel: {
        isOpen: true,
        page: 2,
        ...defaultOshaData,
      },
    });

    const useDispatchMock = jest.fn();
    mockStoreWithPage2.dispatch = useDispatchMock;

    render(
      <Provider store={mockStoreWithPage2}>
        <AddOshaFormSidePanel {...props} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Next'));
    expect(useDispatchMock).toHaveBeenNthCalledWith(4, {
      type: 'GO_TO_NEXT_OSHA_PANEL_PAGE',
    });
  });

  describe('intialise values', () => {
    const mockStoreNew = storeFake({
      addOshaFormSidePanel: {
        isOpen: true,
        page: 1,
        ...defaultOshaData,
      },
    });

    const useDispatchMockNew = jest.fn();
    mockStoreNew.dispatch = useDispatchMockNew;

    it('should not call dispatch if isOpen is false', () => {
      render(
        <Provider store={mockStoreNew}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddOshaFormSidePanel {...props} isOpen={false} />
          </MockedIssueContextProvider>
        </Provider>
      );

      expect(useDispatchMockNew).not.toHaveBeenCalled();
    });

    it('should call dispatch if isOpen is true', async () => {
      render(
        <Provider store={mockStoreNew}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddOshaFormSidePanel {...props} isOpen />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMockNew).toHaveBeenCalled();
      });
    });

    it('should update store with values from issue if exists', async () => {
      render(
        <Provider store={mockStoreNew}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddOshaFormSidePanel {...props} isOpen />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMockNew).toHaveBeenNthCalledWith(1, {
          initialInformationValues: {
            issueDate: '2022-10-06',
            reporter: {
              value: 1,
              label: 'Reporter full name',
            },
            reporterPhoneNumber: '12355678912',
            title: 'OSHA Title',
          },
          type: 'UPDATE_OSHA_INITIAL_INFORMATION',
        });
        expect(useDispatchMockNew).toHaveBeenNthCalledWith(2, {
          employeeDrInformationValues: {
            city: 'Test city',
            dateHired: '2023-01-26T13:54:51Z',
            dateOfBirth: '2000-01-08',
            emergencyRoom: false,
            facilityCity: 'Facility city',
            facilityName: 'Facility name',
            facilityState: 'New York',
            facilityStreet: 'Facility street',
            facilityZip: '11111',
            fullName: 'Albornoz, Tomas',
            hospitalized: false,
            physicianFullName: 'John Doe',
            sex: 'M',
            state: 'New York',
            street: 'Test street',
            zip: '11111',
          },
          type: 'UPDATE_OSHA_EMPLOYEE_DR_INFORMATION',
        });
        expect(useDispatchMockNew).toHaveBeenNthCalledWith(3, {
          caseInformationValues: {
            athleteActivity: 'Athlete activity',
            caseNumber: '12345',
            dateInjured: '2022-01-13T00:00:00+00:00',
            dateOfDeath: '2023-01-26T13:54:51Z',
            issueDescription: 'Test description',
            noTimeEvent: false,
            objectSubstance: 'Something',
            timeBeganWork: '2023-01-05T20:54:00+00:00',
            timeEvent: '2023-01-05T20:54:00+00:00',
            whatHappened: 'Accident',
          },
          type: 'UPDATE_OSHA_CASE_INFORMATION',
        });
      });
    });

    it('should use address values from org, if exists and issue does not exists', async () => {
      render(
        <Provider store={mockStoreNew}>
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
                  osha: {},
                },
              }}
            >
              <AddOshaFormSidePanel {...props} isOpen />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMockNew).toHaveBeenNthCalledWith(2, {
          employeeDrInformationValues: {
            city: 'New York City',
            dateHired: null,
            dateOfBirth: '23/08/1997',
            emergencyRoom: false,
            facilityCity: null,
            facilityName: null,
            facilityState: null,
            facilityStreet: null,
            facilityZip: null,
            fullName: 'John Doe',
            hospitalized: false,
            physicianFullName: null,
            sex: 'M',
            state: 'New York',
            street: 'Line 1, Line 2',
            zip: '11111',
          },
          type: 'UPDATE_OSHA_EMPLOYEE_DR_INFORMATION',
        });
      });
    });

    it('should update store with correct default values if value from issue doesnt exists', async () => {
      getPathologyTitle.mockReturnValue('Ankle Fracture');

      render(
        <Provider store={mockStoreNew}>
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              issue: {
                ...mockedIssueContextValue.issue,
                osha: {},
                occurrence_date: undefined,
              },
            }}
          >
            <AddOshaFormSidePanel {...props} isOpen />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(useDispatchMockNew).toHaveBeenNthCalledWith(1, {
          initialInformationValues: {
            issueDate: '2023-01-05T00:00:00+00:00',
            reporter: {
              value: 1,
              label: 'Name One',
            },
            reporterPhoneNumber: null,
            title: 'OSHA - Ankle Fracture',
          },
          type: 'UPDATE_OSHA_INITIAL_INFORMATION',
        });
        expect(useDispatchMockNew).toHaveBeenNthCalledWith(2, {
          employeeDrInformationValues: {
            city: null,
            dateHired: null,
            dateOfBirth: '23/08/1997',
            emergencyRoom: false,
            facilityCity: null,
            facilityName: null,
            facilityState: null,
            facilityStreet: null,
            facilityZip: null,
            fullName: 'John Doe',
            hospitalized: false,
            physicianFullName: null,
            sex: 'M',
            state: null,
            street: null,
            zip: null,
          },
          type: 'UPDATE_OSHA_EMPLOYEE_DR_INFORMATION',
        });
        expect(useDispatchMockNew).toHaveBeenNthCalledWith(3, {
          caseInformationValues: {
            athleteActivity: null,
            caseNumber: null,
            dateInjured: null,
            dateOfDeath: null,
            issueDescription: 'Ankle Fracture', // doesnt have null default value
            noTimeEvent: false,
            objectSubstance: null,
            timeBeganWork: null,
            timeEvent: null,
            whatHappened: null,
          },
          type: 'UPDATE_OSHA_CASE_INFORMATION',
        });
      });
    });

    describe('loss description default value', () => {
      it('should use value from osha issue if exists', async () => {
        render(
          <Provider store={mockStoreNew}>
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <AddOshaFormSidePanel {...props} isOpen />
            </MockedIssueContextProvider>
          </Provider>
        );

        await waitFor(() => {
          expect(useDispatchMockNew).toHaveBeenNthCalledWith(3, {
            caseInformationValues: {
              athleteActivity: 'Athlete activity',
              caseNumber: '12345',
              dateInjured: '2022-01-13T00:00:00+00:00',
              dateOfDeath: '2023-01-26T13:54:51Z',
              issueDescription: 'Test description',
              noTimeEvent: false,
              objectSubstance: 'Something',
              timeBeganWork: '2023-01-05T20:54:00+00:00',
              timeEvent: '2023-01-05T20:54:00+00:00',
              whatHappened: 'Accident',
            },
            type: 'UPDATE_OSHA_CASE_INFORMATION',
          });
        });
      });

      it('should use value from issue title if osha issue doesnt exists and isChronicIssue', async () => {
        render(
          <Provider store={mockStoreNew}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                isChronicIssue: true,
                issue: {
                  ...mockedIssueContextValue.issue,
                  title: 'Test value from issue title',
                  osha: {},
                },
              }}
            >
              <AddOshaFormSidePanel {...props} isOpen />
            </MockedIssueContextProvider>
          </Provider>
        );

        await waitFor(() => {
          expect(useDispatchMockNew).toHaveBeenNthCalledWith(3, {
            caseInformationValues: {
              athleteActivity: null,
              caseNumber: null,
              dateInjured: '2022-01-13T00:00:00+00:00',
              dateOfDeath: null,
              issueDescription: 'Test value from issue title',
              noTimeEvent: false,
              objectSubstance: null,
              timeBeganWork: null,
              timeEvent: null,
              whatHappened: null,
            },
            type: 'UPDATE_OSHA_CASE_INFORMATION',
          });
        });
      });

      it('should use value from pathology title if isChronicIssue is false', async () => {
        getPathologyTitle.mockReturnValue('Ankle Fracture');

        render(
          <Provider store={mockStoreNew}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                isChronicIssue: false,
                issue: {
                  ...mockedIssueContextValue.issue,
                  osha: {},
                },
              }}
            >
              <AddOshaFormSidePanel {...props} isOpen />
            </MockedIssueContextProvider>
          </Provider>
        );

        await waitFor(() => {
          expect(useDispatchMockNew).toHaveBeenNthCalledWith(3, {
            caseInformationValues: {
              athleteActivity: null,
              caseNumber: null,
              dateInjured: '2022-01-13T00:00:00+00:00',
              dateOfDeath: null,
              issueDescription: 'Ankle Fracture',
              noTimeEvent: false,
              objectSubstance: null,
              timeBeganWork: null,
              timeEvent: null,
              whatHappened: null,
            },
            type: 'UPDATE_OSHA_CASE_INFORMATION',
          });
        });
      });
    });

    describe('Title default value', () => {
      it('should set value to OSHA if no data is present', async () => {
        getPathologyTitle.mockReturnValue(undefined);

        render(
          <Provider store={mockStoreNew}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  osha: {},
                  occurrence_date: undefined,
                },
              }}
            >
              <AddOshaFormSidePanel {...props} isOpen />
            </MockedIssueContextProvider>
          </Provider>
        );

        await waitFor(() => {
          expect(useDispatchMockNew).toHaveBeenNthCalledWith(1, {
            initialInformationValues: {
              issueDate: '2023-01-05T00:00:00+00:00',
              reporter: { label: 'Name One', value: 1 },
              reporterPhoneNumber: null,
              title: 'OSHA',
            },
            type: 'UPDATE_OSHA_INITIAL_INFORMATION',
          });
        });
      });

      it('should set value to OSHA - Pathology title if no date is present', async () => {
        getPathologyTitle.mockReturnValue('Pathology title');

        render(
          <Provider store={mockStoreNew}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  osha: {},
                  occurrence_date: undefined,
                },
              }}
            >
              <AddOshaFormSidePanel {...props} isOpen />
            </MockedIssueContextProvider>
          </Provider>
        );

        await waitFor(() => {
          expect(useDispatchMockNew).toHaveBeenNthCalledWith(1, {
            initialInformationValues: {
              issueDate: '2023-01-05T00:00:00+00:00',
              reporter: { label: 'Name One', value: 1 },
              reporterPhoneNumber: null,
              title: 'OSHA - Pathology title',
            },
            type: 'UPDATE_OSHA_INITIAL_INFORMATION',
          });
        });
      });

      it('should set value to OSHA - Pathology - Occurence date if all data is present', async () => {
        getPathologyTitle.mockReturnValue('Pathology title');

        render(
          <Provider store={mockStoreNew}>
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  osha: {},
                  occurrence_date: '2023-01-05T00:00:00+00:00',
                },
              }}
            >
              <AddOshaFormSidePanel {...props} isOpen />
            </MockedIssueContextProvider>
          </Provider>
        );

        await waitFor(() => {
          expect(useDispatchMockNew).toHaveBeenNthCalledWith(1, {
            initialInformationValues: {
              issueDate: '2023-01-05T00:00:00+00:00',
              reporter: { label: 'Name One', value: 1 },
              reporterPhoneNumber: null,
              title: 'OSHA - Pathology title - 01/05/2023',
            },
            type: 'UPDATE_OSHA_INITIAL_INFORMATION',
          });
        });
      });
    });
  });

  it('should succesfully pass values from store to endpoint if they are null or null', async () => {
    const mockStoreWithNullValues = storeFake({
      addOshaFormSidePanel: {
        isOpen: true,
        page: 1,
        ...defaultOshaData,
      },
    });

    const spy = jest.spyOn(SaveDraftOshaForm, 'saveDraftOshaForm');

    render(
      <Provider store={mockStoreWithNullValues}>
        <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
          <AddOshaFormSidePanel {...props} isOpen />
        </MockedIssueContextProvider>
      </Provider>
    );

    SaveDraftOshaForm.saveDraftOshaForm.mockResolvedValue('working');
    fireEvent.click(screen.getByText('Save progress'));

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        athlete_activity: null,
        athlete_id: 1, // default value
        case_number: null,
        city: null,
        date_hired: null,
        date_of_death: null,
        dob: null,
        emergency_room: false, // default value
        facility_city: null,
        facility_name: null,
        facility_state: null,
        facility_street: null,
        facility_zip: null,
        full_name: null,
        hospitalized: false, // default value
        issue_date: null,
        issue_description: null,
        issue_id: 3, // default value
        issue_type: 'injury', // default value
        object_substance: null,
        physician_full_name: null,
        reporter_full_name: null,
        reporter_phone_number: null,
        sex: 'M', // default value
        state: null,
        street: null,
        time_began_work: null,
        time_event: null,
        title: null,
        what_happened: null,
        zip: null,
      });
    });
  });

  describe('staff user logic', () => {
    const mockDispatch = jest.fn();
    mockStore.dispatch = mockDispatch;

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return null for reporter if currentUser and userExists is false', async () => {
      useCurrentUser.mockReturnValue({
        currentUser: null,
        fetchCurrentUser: jest.fn(),
      });

      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddOshaFormSidePanel
              {...props}
              isOpen
              staffUsers={mockStaffUsers}
            />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          initialInformationValues: {
            issueDate: '2022-10-06',
            reporter: {
              value: null,
              label: null,
            },
            reporterPhoneNumber: '12355678912',
            title: 'OSHA Title',
          },
          type: 'UPDATE_OSHA_INITIAL_INFORMATION',
        });
      });
    });

    it('should use current user if exists and issue does not exists', async () => {
      useCurrentUser.mockReturnValue({
        currentUser: {
          fullname: 'Name One',
          id: 1,
        },
        fetchCurrentUser: jest.fn(),
      });

      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              isChronicIssue: false,
              issue: {
                ...mockedIssueContextValue.issue,
                osha: {},
                occurrence_date: undefined,
              },
            }}
          >
            <AddOshaFormSidePanel
              {...props}
              isOpen
              staffUsers={mockStaffUsers}
            />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          initialInformationValues: {
            issueDate: '2023-01-05T00:00:00+00:00',
            reporter: {
              value: 1,
              label: 'Name One',
            },
            reporterPhoneNumber: null,
            title: 'OSHA',
          },
          type: 'UPDATE_OSHA_INITIAL_INFORMATION',
        });
      });
    });

    it('should should use reporter from issue if exists', async () => {
      useCurrentUser.mockReturnValue({
        currentUser: {
          fullname: 'Name One',
          id: 1,
        },
        fetchCurrentUser: jest.fn(),
      });

      render(
        <Provider store={mockStore}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddOshaFormSidePanel
              {...props}
              isOpen
              staffUsers={[
                ...mockStaffUsers,
                { value: 5, label: 'Reporter full name' },
              ]}
            />
          </MockedIssueContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          initialInformationValues: {
            issueDate: '2022-10-06',
            reporter: {
              value: 5,
              label: 'Reporter full name',
            },
            reporterPhoneNumber: '12355678912',
            title: 'OSHA Title',
          },
          type: 'UPDATE_OSHA_INITIAL_INFORMATION',
        });
      });
    });
  });

  describe('Print preview logic', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    const mockStoreUpdated = storeFake({
      addOshaFormSidePanel: {
        ...defaultOshaData,
        isOpen: true,
        page: 4,
        showPrintPreview: {
          sidePanel: false,
        },
      },
    });

    const useDispatchMockUpdated = jest.fn();
    mockStoreUpdated.dispatch = useDispatchMockUpdated;

    const mockStoreUpdatedWithPrintPreview = storeFake({
      addOshaFormSidePanel: {
        ...defaultOshaData,
        isOpen: true,
        page: 4,
        showPrintPreview: {
          sidePanel: true,
        },
      },
    });

    const useDispatchMockUpdatedWithPrintPreview = jest.fn();
    mockStoreUpdatedWithPrintPreview.dispatch =
      useDispatchMockUpdatedWithPrintPreview;

    it('should trigger print if showPrintPreview is true', async () => {
      jest.spyOn(window, 'print').mockImplementation(() => {});

      render(
        <Provider store={mockStoreUpdatedWithPrintPreview}>
          <AddOshaFormSidePanel {...props} />
        </Provider>
      );

      await waitFor(() => {
        expect(window.print).toHaveBeenCalled();
      });
    });

    it('should save draft osha form and call dispatch to set showPrintPreview to true on click of print button', async () => {
      render(
        <Provider store={mockStoreUpdated}>
          <AddOshaFormSidePanel {...props} />
        </Provider>
      );

      SaveDraftOshaForm.saveDraftOshaForm.mockResolvedValue('working');
      fireEvent.click(screen.getByText('Print'));

      await waitFor(() => {
        expect(SaveDraftOshaForm.saveDraftOshaForm).toHaveBeenCalled();
        expect(useDispatchMockUpdated).toHaveBeenNthCalledWith(4, {
          showPrintPreview: true,
          type: 'PRINT_OSHA_FORM_FROM_SIDE_PANEL',
        });
      });
    });

    it('should call dispatch to set showPrintPreview to false on afterprint', async () => {
      jest.spyOn(window, 'print').mockImplementation(() => {});

      render(
        <Provider store={mockStoreUpdatedWithPrintPreview}>
          <AddOshaFormSidePanel {...props} />
        </Provider>
      );

      const addEvt = new Event('afterprint');
      document.dispatchEvent(addEvt);

      await waitFor(() => {
        expect(useDispatchMockUpdatedWithPrintPreview).toHaveBeenNthCalledWith(
          1,
          {
            showPrintPreview: false,
            type: 'PRINT_OSHA_FORM_FROM_SIDE_PANEL',
          }
        );
      });
    });
  });
});
