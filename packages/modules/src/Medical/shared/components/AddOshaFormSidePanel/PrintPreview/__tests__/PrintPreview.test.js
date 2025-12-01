import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import PrintPreview from '..';
import { getPathologyTitle } from '../../../../utils';

jest.mock('../../../../utils');

describe('<PreviewAndPrint />', () => {
  const defaultProps = {
    issue: { osha: {} },
    t: i18nextTranslateStub(),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const getMockStore = (dateInjured = '2022-12-21T00:00:00.000Z') =>
    storeFake({
      addOshaFormSidePanel: {
        isOpen: true,
        page: 4,
        initialInformation: {
          reporter: {
            value: 1,
            label: 'Bruce Wayne',
          },
          reporterPhoneNumber: '1234567890',
          title: 'DR',
          issueDate: '2022-12-21T00:00:00.000Z',
        },
        employeeDrInformation: {
          fullName: 'John Doe',
          street: 'Test Street',
          city: 'Test City',
          state: 'Test State',
          zip: 'zippy',
          sex: 'M',
          dateOfBirth: '2022-12-21T00:00:00.000Z',
          dateHired: '2022-12-21T00:00:00.000Z',
          physicianFullName: 'Dr. Who',
          facilityName: 'Optional',
          facilityStreet: 'Test Street',
          facilityCity: 'Test City',
          facilityState: 'Test State',
          facilityZip: 'zippy',
          emergencyRoom: false,
          hospitalized: false,
        },
        caseInformation: {
          athleteActivity: 'Test Activity',
          caseNumber: '1',
          dateInjured,
          dateOfDeath: '2022-12-21T00:00:00.000Z',
          issueDescription: 'Optional',
          objectSubstance: 'Ladder',
          timeBeganWork: '2022-12-21T16:25:00.000Z',
          timeEvent: '2022-12-21T16:25:00.000Z',
          whatHappened: 'What Happened?',
        },
      },
    });

  it('should render content as expected', () => {
    render(
      <Provider store={getMockStore()}>
        <PrintPreview {...defaultProps} />
      </Provider>
    );

    expect(screen.getByText('Initial information')).toBeInTheDocument();
    expect(screen.getByText('Completed by:')).toBeInTheDocument();
    expect(
      screen.getByText('Reported person contact phone:')
    ).toBeInTheDocument();
    expect(screen.getByText('Title:')).toBeInTheDocument();
    expect(screen.getByText('Date:')).toBeInTheDocument();

    expect(
      screen.getByText('Information about the employee')
    ).toBeInTheDocument();
    expect(screen.getByText('Full name:')).toBeInTheDocument();
    expect(screen.getByText('Street:')).toBeInTheDocument();
    expect(screen.getByText('City:')).toBeInTheDocument();
    expect(screen.getByText('State:')).toBeInTheDocument();
    expect(screen.getByText('Zipcode:')).toBeInTheDocument();
    expect(screen.getByText('Date of birth:')).toBeInTheDocument();
    expect(screen.getByText('Date hired:')).toBeInTheDocument();
    expect(screen.getByText('Sex:')).toBeInTheDocument();

    expect(
      screen.getByText(
        'Information about the physician or other health care professional'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Name of physician or other health care professional:')
    ).toBeInTheDocument();
    expect(screen.getByText('Facility:')).toBeInTheDocument();
    expect(screen.getByText('Facility city:')).toBeInTheDocument();
    expect(screen.getByText('Facility street:')).toBeInTheDocument();
    expect(screen.getByText('Facility state:')).toBeInTheDocument();
    expect(screen.getByText('Facility zipcode:')).toBeInTheDocument();
    expect(
      screen.getByText('Was employee treated in an emergency room?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Was employee hospitalized overnight as an in-patient?')
    ).toBeInTheDocument();

    expect(screen.getByText('Information about the case')).toBeInTheDocument();
    expect(screen.getByText('Case number from the Log:')).toBeInTheDocument();
    expect(screen.getByText('Date of injury or illness:')).toBeInTheDocument();
    expect(screen.getByText('Time employee began work:')).toBeInTheDocument();
    expect(screen.getByText('Time of event:')).toBeInTheDocument();
    expect(
      screen.getByText(
        'What was the employee doing just before the incident occured?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('What happened?')).toBeInTheDocument();
    expect(
      screen.getByText('What was the injury or illness?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('What object or substance directly harmed the employee?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('If the employee died, when did death occur?')
    ).toBeInTheDocument();
  });

  it('should display data in fields from state', () => {
    getPathologyTitle.mockReturnValue('Test Pathology');

    render(
      <Provider store={getMockStore()}>
        <PrintPreview {...defaultProps} />
      </Provider>
    );

    expect(screen.getByTestId('PrintPreview|OshaTitle')).toHaveTextContent(
      'OSHA - Test Pathology - 12/21/2022'
    );
    expect(screen.getByTestId('PrintPreview|CompletedBy')).toHaveTextContent(
      'Bruce Wayne'
    );
    expect(screen.getByTestId('PrintPreview|Title')).toHaveTextContent('DR');
    expect(
      screen.getByTestId('PrintPreview|ReporterPhoneNumber')
    ).toHaveTextContent('1234567890');
    expect(screen.getByTestId('PrintPreview|IssueDate')).toHaveTextContent(
      'Dec 21, 2022'
    );

    expect(screen.getByTestId('PrintPreview|FullName')).toHaveTextContent(
      'John Doe'
    );
    expect(screen.getByTestId('PrintPreview|Street')).toHaveTextContent(
      'Test Street'
    );
    expect(screen.getByTestId('PrintPreview|City')).toHaveTextContent(
      'Test City'
    );
    expect(screen.getByTestId('PrintPreview|State')).toHaveTextContent(
      'Test State'
    );
    expect(screen.getByTestId('PrintPreview|Zip')).toHaveTextContent('zippy');
    expect(screen.getByTestId('PrintPreview|DateOfBirth')).toHaveTextContent(
      'Dec 21, 2022'
    );
    expect(screen.getByTestId('PrintPreview|DateHired')).toHaveTextContent(
      'Dec 21, 2022'
    );
    expect(screen.getByTestId('PrintPreview|Sex')).toHaveTextContent('Male');
    expect(
      screen.getByTestId('PrintPreview|PhysicianFullName')
    ).toHaveTextContent('Dr. Who');
    expect(screen.getByTestId('PrintPreview|FacilityName')).toHaveTextContent(
      'Optional'
    );
    expect(screen.getByTestId('PrintPreview|FacilityStreet')).toHaveTextContent(
      'Test Street'
    );
    expect(screen.getByTestId('PrintPreview|FacilityCity')).toHaveTextContent(
      'Test City'
    );
    expect(screen.getByTestId('PrintPreview|FacilityState')).toHaveTextContent(
      'Test State'
    );
    expect(screen.getByTestId('PrintPreview|FacilityZip')).toHaveTextContent(
      'zippy'
    );
    expect(screen.getByTestId('PrintPreview|EmergencyRoom')).toHaveTextContent(
      'false'
    );
    expect(screen.getByTestId('PrintPreview|Hospitalized')).toHaveTextContent(
      'false'
    );

    expect(
      screen.getByTestId('PrintPreview|AthleteActivity')
    ).toHaveTextContent('Test Activity');
    expect(screen.getByTestId('PrintPreview|CaseNumber')).toHaveTextContent(
      '1'
    );
    expect(screen.getByTestId('PrintPreview|DateInjured')).toHaveTextContent(
      'Dec 21, 2022'
    );
    expect(screen.getByTestId('PrintPreview|DateOfDeath')).toHaveTextContent(
      'Dec 21, 2022'
    );
    expect(
      screen.getByTestId('PrintPreview|IssueDescription')
    ).toHaveTextContent('Optional');
    expect(
      screen.getByTestId('PrintPreview|ObjectSubstance')
    ).toHaveTextContent('Ladder');
    expect(screen.getByTestId('PrintPreview|TimeBeganWork')).toHaveTextContent(
      '4:25 PM'
    );
    expect(screen.getByTestId('PrintPreview|TimeEvent')).toHaveTextContent(
      '4:25 PM'
    );
    expect(screen.getByTestId('PrintPreview|WhatHappened')).toHaveTextContent(
      'What Happened?'
    );
  });

  it('should display "-" if values are null', () => {
    const mockStoreNullValues = storeFake({
      addOshaFormSidePanel: {
        isOpen: true,
        page: 4,
        initialInformation: {
          reporter: {
            value: null,
            label: null,
          },
          reporterPhoneNumber: null,
          title: null,
          issueDate: null,
        },
        employeeDrInformation: {
          fullName: null,
          street: null,
          city: null,
          state: null,
          zip: null,
          sex: null,
          dateOfBirth: null,
          dateHired: null,
          physicianFullName: null,
          facilityName: null,
          facilityStreet: null,
          facilityCity: null,
          facilityState: null,
          facilityZip: null,
          emergencyRoom: null,
          hospitalized: null,
        },
        caseInformation: {
          athleteActivity: null,
          caseNumber: null,
          dateInjured: null,
          dateOfDeath: null,
          issueDescription: null,
          objectSubstance: null,
          timeBeganWork: null,
          timeEvent: null,
          whatHappened: null,
        },
      },
    });

    render(
      <Provider store={mockStoreNullValues}>
        <PrintPreview {...defaultProps} />
      </Provider>
    );

    expect(screen.getByTestId('PrintPreview|CompletedBy')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|Title')).toHaveTextContent('-');
    expect(
      screen.getByTestId('PrintPreview|ReporterPhoneNumber')
    ).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|IssueDate')).toHaveTextContent('-');

    expect(screen.getByTestId('PrintPreview|FullName')).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|Street')).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|City')).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|State')).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|Zip')).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|DateOfBirth')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|DateHired')).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|Sex')).toHaveTextContent('-');
    expect(
      screen.getByTestId('PrintPreview|PhysicianFullName')
    ).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|FacilityName')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|FacilityStreet')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|FacilityCity')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|FacilityState')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|FacilityZip')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|EmergencyRoom')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|Hospitalized')).toHaveTextContent(
      '-'
    );

    expect(
      screen.getByTestId('PrintPreview|AthleteActivity')
    ).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|CaseNumber')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|DateInjured')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|DateOfDeath')).toHaveTextContent(
      '-'
    );
    expect(
      screen.getByTestId('PrintPreview|IssueDescription')
    ).toHaveTextContent('-');
    expect(
      screen.getByTestId('PrintPreview|ObjectSubstance')
    ).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|TimeBeganWork')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PrintPreview|TimeEvent')).toHaveTextContent('-');
    expect(screen.getByTestId('PrintPreview|WhatHappened')).toHaveTextContent(
      '-'
    );
  });

  describe('title', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should display title as "OSHA" if no data exists', () => {
      getPathologyTitle.mockReturnValue(undefined);

      render(
        <Provider store={getMockStore(undefined, undefined)}>
          <PrintPreview {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('PrintPreview|OshaTitle')).toHaveTextContent(
        'OSHA'
      );
    });

    it('should display title as "OSHA - Pathology" if pathology exists but loss date does not', () => {
      getPathologyTitle.mockReturnValue('Test Pathology');

      render(
        <Provider store={getMockStore(undefined, undefined)}>
          <PrintPreview {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('PrintPreview|OshaTitle')).toHaveTextContent(
        'OSHA - Test Pathology'
      );
    });

    it('should display title as "OSHA - Date injured" if date injured exists but Pathology does not', () => {
      getPathologyTitle.mockReturnValue(undefined);

      render(
        <Provider store={getMockStore()}>
          <PrintPreview {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('PrintPreview|OshaTitle')).toHaveTextContent(
        'OSHA - 12/21/2022'
      );
    });

    it('should display title as "OSHA - Pathology - Loss Date" if all data exists', () => {
      getPathologyTitle.mockReturnValue('Test Pathology');

      render(
        <Provider store={getMockStore()}>
          <PrintPreview {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('PrintPreview|OshaTitle')).toHaveTextContent(
        'OSHA - Test Pathology - 12/21/2022'
      );
    });
  });

  describe('no time event', () => {
    const mockStoreWithTimeEvent = (noTimeEvent) =>
      storeFake({
        addOshaFormSidePanel: {
          isOpen: true,
          page: 4,
          initialInformation: {
            reporter: {
              value: 1,
              label: 'Bruce Wayne',
            },
            reporterPhoneNumber: '1234567890',
            title: 'DR',
            issueDate: '2022-12-21T00:00:00.000Z',
          },
          employeeDrInformation: {
            fullName: 'John Doe',
            street: 'Test Street',
            city: 'Test City',
            state: 'Test State',
            zip: 'zippy',
            sex: 'M',
            dateOfBirth: '2022-12-21T00:00:00.000Z',
            dateHired: '2022-12-21T00:00:00.000Z',
            physicianFullName: 'Dr. Who',
            facilityName: 'Optional',
            facilityStreet: 'Test Street',
            facilityCity: 'Test City',
            facilityState: 'Test State',
            facilityZip: 'zippy',
            emergencyRoom: false,
            hospitalized: false,
          },
          caseInformation: {
            athleteActivity: 'Test Activity',
            caseNumber: '1',
            dateInjured: '2022-12-21T00:00:00.000Z',
            dateOfDeath: '2022-12-21T00:00:00.000Z',
            issueDescription: 'Optional',
            objectSubstance: 'Ladder',
            timeBeganWork: '2022-12-21T16:25:00.000Z',
            timeEvent: '2022-12-21T17:25:00.000Z',
            noTimeEvent,
            whatHappened: 'What Happened?',
          },
        },
      });

    it('should render label if notTimeEvent is true', () => {
      render(
        <Provider store={mockStoreWithTimeEvent(true)}>
          <PrintPreview {...defaultProps} />
        </Provider>
      );

      expect(
        screen.getByText('Time of event could not be determined')
      ).toBeInTheDocument();
    });

    it('should render time value if notTimeEvent is false', () => {
      render(
        <Provider store={mockStoreWithTimeEvent(false)}>
          <PrintPreview {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('PrintPreview|TimeEvent')).toHaveTextContent(
        '5:25 PM'
      );
    });
  });
});
