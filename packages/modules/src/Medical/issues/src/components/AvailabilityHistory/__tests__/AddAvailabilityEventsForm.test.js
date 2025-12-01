import $ from 'jquery';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import '@testing-library/jest-dom';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { data as mockedReopeningReasons } from '@kitman/services/src/mocks/handlers/medical/getReopeningReasons';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment-timezone';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';

import AddAvailabilityEventsForm from '../AddAvailabilityEventsForm';

jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetAthleteDataQuery: jest.fn(),
  useGetAnnotationMedicalTypesQuery: jest.fn(),
}));

const store = storeFake({
  medicalApi: {
    useGetAnnotationMedicalTypesQuery: jest.fn(),
    useGetAthleteDataQuery: jest.fn(),
  },
});

describe('AddAvailabilityEventsForm', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  const props = {
    injuryStatuses: [
      {
        cause_unavailability: true,
        description: 'Causing unavailability (time-loss)',
        id: 1,
        injury_status_system_id: 1,
        order: 1,
        restore_availability: false,
      },
      {
        cause_unavailability: false,
        description: 'Not affecting availability (medical attention)',
        id: 2,
        injury_status_system_id: 1,
        order: 2,
        restore_availability: true,
      },
      {
        cause_unavailability: false,
        description: 'Resolved',
        id: 3,
        injury_status_system_id: 1,
        order: 3,
        restore_availability: true,
      },
    ],
    reopeningReasons: [],
    lastEventId: 3, // This will be set as the default value by the component if lastEvent is null, derived from the length of injuryStatuses
    editStatusOpen: false,
    setEditStatusOpen: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const nflProps = {
    ...props,
    injuryStatuses: [
      {
        cause_unavailability: true,
        description: 'Out',
        id: 1,
        injury_status_system_id: 1,
        order: 1,
        restore_availability: false,
      },
      {
        cause_unavailability: false,
        description: 'Limited',
        id: 2,
        injury_status_system_id: 2,
        order: 2,
        restore_availability: false,
      },
      {
        cause_unavailability: false,
        description: 'Full',
        id: 3,
        injury_status_system_id: 3,
        order: 3,
        restore_availability: false,
      },
      {
        cause_unavailability: true,
        description: 'Resolved',
        id: 4,
        injury_status_system_id: 4,
        order: 4,
        restore_availability: true,
        is_resolver: true,
      },
    ],
    reopeningReasons: mockedReopeningReasons,
    lastEventId: 4,
    editStatusOpen: false,
    setEditStatusOpen: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const mockedPermissionsContextValue = {
    permissions: {
      medical: {
        ...defaultMedicalPermissions,
        issues: {
          canEdit: true,
        },
      },
    },
    permissionsRequestStatus: 'SUCCESS',
  };

  const renderWithContext = ({
    mockedIssueEvents,
    mockedProps = props,
    mockedIssue = mockedIssueContextValue.issue,
  }) => {
    return (
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <MockedIssueContextProvider
          issueContext={{
            ...mockedIssueContextValue,
            issue: {
              ...mockedIssue,
              ...mockedIssueEvents,
            },
          }}
        >
          <Provider store={store}>
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              adapterLocale="en-gb"
            >
              <AddAvailabilityEventsForm {...mockedProps} isFormOpen />
            </LocalizationProvider>
          </Provider>
        </MockedIssueContextProvider>
      </MockedPermissionContextProvider>
    );
  };

  describe('Select injury status dropdown menu (Select)', () => {
    describe('First time usage (there is no lastEventId value)', () => {
      it('Should render all option except the resolver status', async () => {
        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
          mockedProps: {
            ...props,
            lastEventId: null,
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        selectEvent.openMenu(
          addAvailabilityEventsForm.querySelector('.kitmanReactSelect input')
        );
        expect(
          screen.getByText('Causing unavailability (time-loss)')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Not affecting availability (medical attention)')
        ).toBeInTheDocument();
        expect(() => screen.getByText('Resolved')).toThrow();
      });
    });
    describe('Nth time usage (we have an initial status)', () => {
      it('renders all available options expect the previous status', async () => {
        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        selectEvent.openMenu(
          addAvailabilityEventsForm.querySelector('.kitmanReactSelect input')
        );
        expect(
          screen.getByText('Causing unavailability (time-loss)')
        ).toBeInTheDocument();
        expect(screen.getByText('Resolved')).toBeInTheDocument();
        expect(() =>
          screen.getByText('Not affecting availability (medical attention)')
        ).toThrow();
      });
    });

    describe('[NFL ONLY] Available statuses', () => {
      beforeEach(() => {
        window.setFlag('preliminary-injury-illness', true);
      });
      afterEach(() => {
        window.setFlag('preliminary-injury-illness', false);
      });

      it('should render all statuses except the resolver when no status in initially set', async () => {
        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
          mockedProps: nflProps,
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        selectEvent.openMenu(
          addAvailabilityEventsForm.querySelector('.kitmanReactSelect input')
        );
        expect(screen.getByText('Out')).toBeInTheDocument();
        expect(screen.getByText('Limited')).toBeInTheDocument();
        expect(screen.getByText('Full')).toBeInTheDocument();
        expect(() => screen.getByText('Resolved')).toThrow();
      });

      it('should disable the save button when resolver status is set and there are outstanding tasks', async () => {
        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 3, date: '2018-01-01', injury_status_id: 3 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
          mockedProps: { ...nflProps, issueHasOutstandingFields: 1 },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        selectEvent.openMenu(
          addAvailabilityEventsForm.querySelector('.kitmanReactSelect input')
        );

        expect(result.queryByText('Add status')).toBeInTheDocument();
        await userEvent.click(result.getByText('Resolved'));
        expect(result.getByText('Save').parentNode).toBeDisabled();
      });

      const assertions = [
        {
          expected: ['Limited', 'Full', 'Resolved'],
          events: [{ id: 1, date: '2018-01-01', injury_status_id: 1 }],
          currentStatus: 'Out',
        },
        {
          expected: ['Out', 'Full', 'Resolved'],
          events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
          currentStatus: 'Limited',
        },
        {
          expected: ['Out', 'Limited', 'Resolved'],
          events: [{ id: 3, date: '2018-01-01', injury_status_id: 3 }],
          currentStatus: 'Full',
        },
        {
          expected: ['Out', 'Limited', 'Full'],
          events: [{ id: 4, date: '2018-01-01', injury_status_id: 4 }],
          currentStatus: 'Resolved',
        },
      ];

      assertions.forEach((assertion) => {
        it(`should render ${assertion.expected.join(
          ', '
        )} when the current status is ${assertion.currentStatus}`, async () => {
          const wrapper = renderWithContext({
            mockedIssueEvents: {
              events: assertion.events,
              occurrence_date: '2020-01-01T00:00:00.000Z',
            },
            mockedProps: nflProps,
          });

          const result = render(wrapper);
          await userEvent.click(result.getByText('Add'));

          const addAvailabilityEventsForm = await screen.findByTestId(
            'AddAvailabilityEventsForm|Form'
          );
          expect(addAvailabilityEventsForm).toBeInTheDocument();

          selectEvent.openMenu(
            addAvailabilityEventsForm.querySelector('.kitmanReactSelect input')
          );
          assertion.expected.forEach((status) =>
            expect(screen.getByText(status)).toBeInTheDocument()
          );
          expect(() => screen.getByText(assertion.currentStatus)).toThrow();
        });
      });
    });
  });

  describe('[FEATURE FLAG] reason-for-reopening', () => {
    beforeEach(() => {
      window.setFlag('reason-for-reopening', true);
    });
    afterEach(() => {
      window.setFlag('reason-for-reopening', false);
    });
    it('renders the correct actions when the issue has been resolved', async () => {
      const wrapper = renderWithContext({
        mockedIssueEvents: {
          events: [],
          occurrence_date: '2020-01-01T00:00:00.000Z',
        },
        mockedProps: nflProps,
        mockedIssue: {
          ...mockedIssueContextValue.issue,
          closed: true,
        },
      });
      const result = render(wrapper);

      expect(result.getByText('Reopen')).toBeInTheDocument();
    });
    it('renders the correct actions when clicking Reopen', async () => {
      const wrapper = renderWithContext({
        mockedIssueEvents: {
          events: [],
          occurrence_date: '2020-01-01T00:00:00.000Z',
        },
        mockedProps: nflProps,
        mockedIssue: {
          ...mockedIssueContextValue.issue,
          closed: true,
        },
      });
      const result = render(wrapper);
      await userEvent.click(result.getByText('Reopen'));

      expect(result.getByText('Discard changes')).toBeInTheDocument();
      expect(result.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Reason for reopening')).toBeInTheDocument();
      expect(
        screen.getByText('Select reason for reopening')
      ).toBeInTheDocument();
    });

    it('renders the correct options for the reopen reason', async () => {
      const wrapper = renderWithContext({
        mockedIssueEvents: {
          events: [],
          occurrence_date: '2020-01-01T00:00:00.000Z',
        },
        mockedProps: nflProps,
        mockedIssue: {
          ...mockedIssueContextValue.issue,
          closed: true,
        },
      });
      const result = render(wrapper);
      await userEvent.click(result.getByText('Reopen'));
      const reopenIssueForm = await screen.findByTestId(
        'AddAvailabilityReopen|ReopenInjury'
      );
      expect(reopenIssueForm).toBeInTheDocument();
      selectEvent.openMenu(
        reopenIssueForm.querySelector('.kitmanReactSelect input')
      );
      mockedReopeningReasons
        .map((i) => i.name)
        .forEach((option) => {
          expect(screen.getByText(option)).toBeInTheDocument();
        });
    });

    it('renders the free text input when the reopening reason is Other', async () => {
      const wrapper = renderWithContext({
        mockedIssueEvents: {
          events: [],
          occurrence_date: '2020-01-01T00:00:00.000Z',
        },
        mockedProps: nflProps,
        mockedIssue: {
          ...mockedIssueContextValue.issue,
          closed: true,
        },
      });
      const result = render(wrapper);
      await userEvent.click(result.getByText('Reopen'));
      const reopenIssueForm = await screen.findByTestId(
        'AddAvailabilityReopen|ReopenInjury'
      );
      expect(reopenIssueForm).toBeInTheDocument();
      selectEvent.openMenu(
        reopenIssueForm.querySelector('.kitmanReactSelect input')
      );
      await userEvent.click(result.getByText('Other'));
      expect(screen.getByText('Other reason')).toBeInTheDocument();
    });
  });

  describe('is in edit status mode', () => {
    let component;
    let mockRequest;
    const nflEditProps = {
      ...nflProps,
      editStatusOpen: true,
      currentEvent: {
        id: 4,
        injury_status_id: 2,
        date: '2022-01-13T00:00:00+00:00',
      },
    };

    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve({}));
      const wrapper = renderWithContext({
        mockedIssueEvents: {
          events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
          occurrence_date: '2020-01-01T00:00:00.000Z',
        },
        mockedProps: nflEditProps,
      });
      component = render(wrapper);
    });

    it('renders out the nfl status options except the resolved ones when status is clicked', async () => {
      expect(component.getByText('1')).toBeInTheDocument();
      expect(component.queryByText('Add')).not.toBeInTheDocument();
      expect(component.queryByText('Add status')).not.toBeInTheDocument();
      selectEvent.openMenu(component.getByText('Limited'));
      expect(component.getByText('Out')).toBeInTheDocument();
      expect(component.getAllByText('Limited')[1]).toBeInTheDocument();
      expect(component.getByText('Full')).toBeInTheDocument();
      expect(component.queryByText('Resolved')).not.toBeInTheDocument();
    });

    it('clicking a new status and hitting save sends an api call to the updateLastEvents', async () => {
      selectEvent.openMenu(component.getByText('Limited'));
      await userEvent.click(component.getByText('Full'));
      await userEvent.click(component.getByText('Save'));
      expect(mockRequest).toHaveBeenCalledWith({
        contentType: 'application/json',
        data: JSON.stringify({
          injury_status_id: 3,
          scope_to_org: true,
        }),
        headers: { 'X-CSRF-Token': undefined },
        method: 'POST',
        url: '/athletes/15642/injuries/3/update_last_event',
      });
      expect(nflEditProps.setEditStatusOpen).toHaveBeenCalled();
    });
  });

  describe('Required label', () => {
    const wrapperContent = {
      mockedIssueEvents: {
        events: [],
        occurrence_date: '2020-01-01T00:00:00.000Z',
      },
      mockedProps: {
        ...nflProps,
        currentEvent: null,
        editStatusOpen: false,
        isValidationCheckAllowed: true,
      },
    };
    it('renders the required label in preview mode when there is no current event and the form is not open', () => {
      const wrapper = renderWithContext(wrapperContent);
      const component = render(wrapper);
      expect(component.getByText('Required')).toBeInTheDocument();
    });
    it('does not render the required label in preview mode when there is a current event and form is not open', () => {
      const wrapper = renderWithContext({
        ...wrapperContent,
        mockedProps: {
          ...wrapperContent.mockedProps,
          currentEvent: {
            id: 4,
            injury_status_id: 2,
            date: '2022-01-13T00:00:00+00:00',
          },
        },
      });

      const component = render(wrapper);
      expect(component.queryByText('Required')).not.toBeInTheDocument();
    });

    it('does not render the required label when isValidationCheckAllowed is false', () => {
      const wrapper = renderWithContext({
        ...wrapperContent,
        mockedProps: {
          ...wrapperContent.mockedProps,
          isValidationCheckAllowed: false,
        },
      });

      const component = render(wrapper);
      expect(component.queryByText('Required')).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] pm-default-injury-status-date', () => {
    describe('Movement Aware date picker component', () => {
      // Default behaviour: event.date || previousStatus?.date
      it('displays the correct date value when the flag is OFF', async () => {
        window.setFlag('player-movement-aware-datepicker', true);
        window.setFlag('pm-default-injury-status-date', false);

        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        const datePickerInput = screen.getByPlaceholderText('DD/MM/YYYY');
        expect(datePickerInput).toHaveValue('01/01/2018');
      });

      // Date value should not be set
      it('displays the correct date value when the flag is ON', async () => {
        window.setFlag('player-movement-aware-datepicker', true);
        window.setFlag('pm-default-injury-status-date', true);

        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        const datePickerInput = screen.getByPlaceholderText('DD/MM/YYYY');
        expect(datePickerInput.value).toEqual('');
      });

      // Default behaviour for past players
      it('displays the correct date value (event or prev status date) when the player is a past player and the flag is OFF', async () => {
        window.setFlag('player-movement-aware-datepicker', true);
        window.setFlag('pm-default-injury-status-date', false);

        const pastAthleteTransferDate = '2017-06-15'; // This will not be used as the flag is off
        const eventDate = '2018-01-01'; // This date will be used (and through a formatter first) as this is the default behaviour (without flag)
        const eventDateFormatted = '01/01/2018';

        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: eventDate, injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
          mockedProps: {
            ...props,
            athleteData: {
              org_last_transfer_record: {
                left_at: pastAthleteTransferDate,
              },
            },
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        const datePickerInput = screen.getByPlaceholderText('DD/MM/YYYY');

        expect(datePickerInput).toHaveValue(eventDateFormatted);
      });

      // Feature flag behaviour for past players
      it('displays the correct date value (transfer date) when the player is a past player and the flag is ON', async () => {
        window.setFlag('player-movement-aware-datepicker', true);
        window.setFlag('pm-default-injury-status-date', true);

        const pastAthleteTransferDate = '2019-06-15';
        const pastAthleteTransferDateFormatted = '15/06/2019';

        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
          mockedProps: {
            ...props,
            athleteData: {
              org_last_transfer_record: {
                left_at: pastAthleteTransferDate,
              },
            },
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        const datePickerInput = screen.getByPlaceholderText('DD/MM/YYYY');

        expect(datePickerInput).toHaveValue(pastAthleteTransferDateFormatted);
      });

      // Feature flag behaviour for past players when movement data corrupted/missing
      it('displays an empty date when the player is a past player, the flag is ON, and the athleteData is missing', async () => {
        window.setFlag('player-movement-aware-datepicker', true);
        window.setFlag('pm-default-injury-status-date', true);

        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
          mockedProps: {
            ...props,
            athleteData: null, // Simulate missing athleteData
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        const datePickerInput = screen.getByPlaceholderText('DD/MM/YYYY');
        expect(datePickerInput.value).toEqual('');
      });
    });
    describe('Kitman legacy date picker component', () => {
      // Default behaviour: event.date || previousStatus?.date
      it('displays the correct date value when the flag is OFF', async () => {
        window.setFlag('player-movement-aware-datepicker', false);
        window.setFlag('pm-default-injury-status-date', false);

        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        const datePickerInput = screen.getByLabelText(/Date/);
        // Mock Datepicker will just display supplied value
        expect(datePickerInput).toHaveValue('2018-01-01'); // 01 Jan 2018
      });

      // Date value should not be set
      it('displays the correct date value when the flag is ON', async () => {
        window.setFlag('player-movement-aware-datepicker', false);
        window.setFlag('pm-default-injury-status-date', true);

        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        const datePickerInput = screen.getByLabelText(/Date/);
        expect(datePickerInput.value).toEqual('');
      });

      // Default behaviour for past players
      it('displays the correct date value (event or prev status date) when the player is a past player and the flag is OFF', async () => {
        window.setFlag('player-movement-aware-datepicker', false);
        window.setFlag('pm-default-injury-status-date', false);

        const pastAthleteTransferDate = '2019-06-15'; // This will not be used as the flag is off
        const eventDate = '2018-01-01'; // This date will be used (and through a formatter first) as this is the default behaviour (without flag)

        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: eventDate, injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
          mockedProps: {
            ...props,
            athleteData: {
              org_last_transfer_record: {
                left_at: pastAthleteTransferDate,
              },
            },
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        const datePickerInput = screen.getByLabelText(/Date/);

        // Mock Datepicker will just display supplied value
        expect(datePickerInput).toHaveValue(eventDate);
      });

      // Feature flag behaviour for past players
      it('displays the correct date value (transfer date) when the player is a past player and the flag is ON', async () => {
        window.setFlag('player-movement-aware-datepicker', false);
        window.setFlag('pm-default-injury-status-date', true);

        const pastAthleteTransferDate = '2019-06-15';

        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
          mockedProps: {
            ...props,
            athleteData: {
              org_last_transfer_record: {
                left_at: pastAthleteTransferDate,
              },
            },
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        const datePickerInput = screen.getByLabelText(/Date/);

        expect(datePickerInput).toHaveValue(pastAthleteTransferDate);
      });

      // Feature flag behaviour for past players when movement data corrupted/missing
      it('displays an empty date when the player is a past player, the flag is ON, and the athleteData is missing', async () => {
        window.setFlag('player-movement-aware-datepicker', false);
        window.setFlag('pm-default-injury-status-date', true);

        const wrapper = renderWithContext({
          mockedIssueEvents: {
            events: [{ id: 2, date: '2018-01-01', injury_status_id: 2 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
          mockedProps: {
            ...props,
            athleteData: null, // Simulate missing athleteData
          },
        });

        const result = render(wrapper);
        await userEvent.click(result.getByText('Add'));

        const addAvailabilityEventsForm = await screen.findByTestId(
          'AddAvailabilityEventsForm|Form'
        );
        expect(addAvailabilityEventsForm).toBeInTheDocument();

        const datePickerInput = screen.getByLabelText(/Date/);
        expect(datePickerInput.value).toEqual('');
      });
    });
  });

  describe('Enzyme test conversions', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('renders the correct content (Availability history heading)', () => {
      const mockedIssueContextValueUpdated = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          events: [{ id: 1, date: '2018-01-01', injury_status_id: 3 }],
          occurrence_date: '2020-01-01T00:00:00.000Z',
        },
      };

      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <MockedIssueContextProvider
            issueContext={mockedIssueContextValueUpdated}
          >
            <Provider store={store}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale="en-gb"
              >
                <AddAvailabilityEventsForm {...props} />
              </LocalizationProvider>
            </Provider>
          </MockedIssueContextProvider>
        </MockedPermissionContextProvider>
      );

      expect(
        screen.getByRole('heading', { name: 'Availability history' })
      ).toBeInTheDocument();
    });

    it('sets the min date correctly for new availability events', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const mockedIssueContextValueUpdated = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          events: [{ id: 1, date: '2018-01-01', injury_status_id: 3 }],
          occurrence_date: '2020-01-01T00:00:00.000Z',
        },
      };

      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValueUpdated,
              issue: { ...mockedIssueContextValueUpdated.issue, events: [] },
            }}
          >
            <Provider store={store}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale="en-gb"
              >
                <AddAvailabilityEventsForm {...props} />
              </LocalizationProvider>
            </Provider>
          </MockedIssueContextProvider>
        </MockedPermissionContextProvider>
      );

      // Open the form
      await user.click(screen.getByRole('button', { name: 'Add' }));

      // The first event should not have a min date
      const datePicker = screen.getByLabelText(/Date/);
      expect(datePicker).toHaveDisplayValue(/Wed Jan 01 2020/);
      expect(screen.queryByTestId('minimum-date')).not.toBeInTheDocument();

      // This is the legacy date picker that is mocked
      fireEvent.change(datePicker, {
        target: { value: '2020-03-01' }, // YYYY-MM-DD format
      });

      // Add the second status
      await user.click(screen.getByRole('button', { name: 'Add status' }));

      const dateInputs = screen.getAllByLabelText(/Date/);
      expect(dateInputs[0]).toHaveDisplayValue(/Sun Mar 01 2020/);
      expect(dateInputs[1]).toHaveDisplayValue(/Sun Mar 01 2020/);

      // The second min date should be the first date
      expect(screen.queryByTestId('minimum-date')).toHaveTextContent(
        /Sun Mar 01 2020/
      );
    });

    describe('when it is October 15, 2020', () => {
      beforeEach(() => {
        const fakeDate = new Date('2020-10-15T00:00:00Z'); // October 15th
        jest.setSystemTime(fakeDate);
      });

      it('sets the correct default date for new availability events', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const mockedIssueContextValueUpdated = {
          ...mockedIssueContextValue,
          issue: { ...mockedIssueContextValue.issue, events: [] },
        };

        render(
          <MockedPermissionContextProvider
            permissionsContext={mockedPermissionsContextValue}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValueUpdated,
                issue: { ...mockedIssueContextValueUpdated.issue, events: [] },
              }}
            >
              <Provider store={store}>
                <LocalizationProvider
                  dateAdapter={AdapterMoment}
                  adapterLocale="en-gb"
                >
                  <AddAvailabilityEventsForm {...props} />
                </LocalizationProvider>
              </Provider>
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>
        );

        // Open the form
        await user.click(screen.getByRole('button', { name: 'Add' }));

        // The first date should be the occurrence date
        const dateInputs = screen.getAllByLabelText(/Date/);
        expect(dateInputs[0]).toHaveDisplayValue(/Thu Jan 13 2022/);

        // Add the second status
        await user.click(screen.getByRole('button', { name: 'Add status' }));

        const updatedDateInputs = screen.getAllByLabelText(/Date/);
        expect(updatedDateInputs[0]).toHaveDisplayValue(/Thu Jan 13 2022/);
        expect(updatedDateInputs[1]).toHaveDisplayValue(/Thu Jan 13 2022/);
      });
    });

    describe('When the save request succeed', () => {
      let mockAjax;
      let mockAjaxDeferred; // Declare deferred here
      let mockUpdateIssue;
      const mockedIssueContextValueUpdated = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          events: [{ id: 1, date: '2018-01-01', injury_status_id: 3 }],
          occurrence_date: '2020-01-01T00:00:00.000Z',
        },
      };

      beforeEach(() => {
        mockAjaxDeferred = $.Deferred(); // Initialize deferred in beforeEach
        mockAjax = jest.spyOn($, 'ajax').mockImplementation((options) => {
          if (options.url === '/athletes/15642/injuries/3') {
            return mockAjaxDeferred; // Return the controllable deferred
          }
          return $.Deferred().reject(); // Other calls still reject immediately
        });
        mockUpdateIssue = jest.fn();
        mockedIssueContextValue.updateIssue = mockUpdateIssue;
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('saves the form when adding availability statuses', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });

        render(
          <MockedPermissionContextProvider
            permissionsContext={mockedPermissionsContextValue}
          >
            <MockedIssueContextProvider
              issueContext={mockedIssueContextValueUpdated}
            >
              <Provider store={store}>
                <LocalizationProvider
                  dateAdapter={AdapterMoment}
                  adapterLocale="en-gb"
                >
                  <AddAvailabilityEventsForm {...props} />
                </LocalizationProvider>
              </Provider>
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>
        );

        // At first, the form is not open
        expect(
          screen.queryByTestId('AddAvailabilityEventsForm|Form')
        ).not.toBeInTheDocument();

        // Open the form
        await user.click(screen.getByRole('button', { name: 'Add' }));

        const form = screen.getByTestId('AddAvailabilityEventsForm|Form');
        expect(form).toBeInTheDocument();

        // Fill in the first status
        const firstStatusSelect = screen.getByText('Select status', {
          class: 'kitmanReactSelect__placeholder',
        });
        await selectEvent.openMenu(firstStatusSelect);
        const firstOptionElement = await screen.findByText(
          'Not affecting availability (medical attention)',
          { selector: '.kitmanReactSelect__option' }
        );
        await user.click(firstOptionElement);

        const datePickers = screen.getAllByLabelText(/Date/);
        fireEvent.change(datePickers[0], { target: { value: '2020-03-01' } }); // YYYY-MM-DD format

        // Add the second status
        const statusButton = screen.getByRole('button', { name: 'Add status' });
        await user.click(statusButton);

        // Fill in the second status
        const secondStatusSelect = screen.getByText('Select status', {
          class: 'kitmanReactSelect__placeholder',
        });
        await selectEvent.openMenu(secondStatusSelect);
        const secondOptionElement = await screen.findByText(
          'Causing unavailability (time-loss)',
          { selector: '.kitmanReactSelect__option' }
        );

        await user.click(secondOptionElement);

        const updatedDatePickers = screen.getAllByLabelText(/Date/);
        fireEvent.change(updatedDatePickers[1], {
          target: { value: '2020-06-01' },
        }); // YYYY-MM-DD format

        const saveButton = screen.getByRole('button', { name: 'Save' });
        expect(saveButton).toBeEnabled();

        // Click the save button
        await user.click(saveButton);

        // It disables the fields when the request is in progress

        expect(
          screen.getByRole('button', { name: 'Discard changes' })
        ).toBeDisabled();

        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
        expect(
          screen.getByRole('button', { name: 'Add status' })
        ).toBeDisabled();

        const selectInputs = screen.getAllByRole('textbox');
        expect(selectInputs[0]).toBeDisabled();
        expect(selectInputs[1]).toBeDisabled();

        const disabledDatePickers = screen.getAllByLabelText(/Date/);
        expect(disabledDatePickers[0]).toBeDisabled();
        expect(disabledDatePickers[1]).toBeDisabled();

        expect(mockAjax).toHaveBeenCalledTimes(1);
        const calledData = JSON.parse(mockAjax.mock.calls[0][0].data);
        expect(calledData).toEqual(
          expect.objectContaining({
            events: [
              { id: 1, date: '2018-01-01', injury_status_id: 3 },
              {
                id: '',
                date: moment('2020-03-01').format(dateTransferFormat),
                injury_status_id: 2,
              },
              {
                id: '',
                date: moment('2020-06-01').format(dateTransferFormat),
                injury_status_id: 1,
              },
            ],
          })
        );
      });

      // NOTE: spec test validates the availability statuses correctly was artificially setting multiple status to the same values
      // That does not seem possible any more through user interaction.
      // TEST REMOVED on purpose
    });

    describe('When the save request fails', () => {
      let mockAjaxFailure;

      beforeEach(() => {
        mockAjaxFailure = jest
          .spyOn($, 'ajax')
          .mockImplementation(() => $.Deferred().reject());
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('shows an error message on save failure', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const mockedIssueContextValueUpdated = {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            events: [{ id: 1, date: '2018-01-01', injury_status_id: 3 }],
            occurrence_date: '2020-01-01T00:00:00.000Z',
          },
        };

        render(
          <MockedPermissionContextProvider
            permissionsContext={mockedPermissionsContextValue}
          >
            <MockedIssueContextProvider
              issueContext={mockedIssueContextValueUpdated}
            >
              <Provider store={store}>
                <LocalizationProvider
                  dateAdapter={AdapterMoment}
                  adapterLocale="en-gb"
                >
                  <AddAvailabilityEventsForm {...props} />
                </LocalizationProvider>
              </Provider>
            </MockedIssueContextProvider>
          </MockedPermissionContextProvider>
        );

        // Open the form
        await user.click(screen.getByRole('button', { name: 'Add' }));

        const form = screen.getByTestId('AddAvailabilityEventsForm|Form');
        expect(form).toBeInTheDocument();

        const selectInputs = screen.getAllByText('Select status', {
          class: 'kitmanReactSelect__placeholder',
        });
        await selectEvent.openMenu(selectInputs[0]);
        const firstOptionElement = await screen.findByText(
          'Causing unavailability (time-loss)',
          { selector: '.kitmanReactSelect__option' }
        );
        await user.click(firstOptionElement);

        const datePicker = screen.getByLabelText(/Date/);

        fireEvent.change(datePicker, {
          target: { value: '2020-03-01' },
        }); // YYYY-MM-DD format

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(mockAjaxFailure).toHaveBeenCalledTimes(1);

        await jest.runAllTimers();
        expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
      });
    });

    it('disables the add button when the player has left the club', () => {
      const mockedIssueContextValuePlayerLeftClub = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          events: [{ id: 1, date: '2018-01-01', injury_status_id: 3 }],
          occurrence_date: '2020-01-01T00:00:00.000Z',
          player_left_club: true,
        },
      };

      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <MockedIssueContextProvider
            issueContext={mockedIssueContextValuePlayerLeftClub}
          >
            <Provider store={store}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale="en-gb"
              >
                <AddAvailabilityEventsForm {...props} />
              </LocalizationProvider>
            </Provider>
          </MockedIssueContextProvider>
        </MockedPermissionContextProvider>
      );

      const addButton = screen.getByRole('button', { name: 'Add' });
      expect(addButton).toBeDisabled();
    });

    it('hides the edit button when the user is not an issue admin', () => {
      const mockedPermissionsContextValueNoEdit = {
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              canEdit: false, // User does not have edit permission
            },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      };

      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValueNoEdit}
        >
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <Provider store={store}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale="en-gb"
              >
                <AddAvailabilityEventsForm {...props} />
              </LocalizationProvider>
            </Provider>
          </MockedIssueContextProvider>
        </MockedPermissionContextProvider>
      );

      // The "Add" button is the entry point for editing, so it should be hidden
      expect(
        screen.queryByRole('button', { name: 'Add' })
      ).not.toBeInTheDocument();
    });
  });
  describe('when the issue is read only', () => {
    it('hides the edit button when the issue isReadOnly, regardless of permissions', () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue} // User has edit permissions
        >
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              isReadOnly: true, // But the issue is read-only
            }}
          >
            <Provider store={store}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale="en-gb"
              >
                <AddAvailabilityEventsForm {...props} />
              </LocalizationProvider>
            </Provider>
          </MockedIssueContextProvider>
        </MockedPermissionContextProvider>
      );

      // The "Add" button should be hidden because the issue is read-only
      expect(
        screen.queryByRole('button', { name: 'Add' })
      ).not.toBeInTheDocument();
    });
  });
});
