import { render, screen } from '@testing-library/react';

import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import userEvent from '@testing-library/user-event';

import AthleteAvailabilityHistory from '@kitman/modules/src/AthleteInjury/athleteIssueEditor/src/components/AthleteAvailabilityHistory';

describe('AthleteAvailabilityHistory', () => {
  let props;

  beforeEach(() => {
    props = {
      injuryStatusOptions: [
        {
          cause_unavailability: true,
          id: 'option_1234',
          order: 1,
          restore_availability: false,
          title: 'Not fit for training or match',
        },
        {
          cause_unavailability: false,
          id: 'option_1235',
          order: 2,
          restore_availability: false,
          title: 'Fit for rehab / non-team training',
        },
        {
          cause_unavailability: false,
          id: 'option_1236',
          order: 3,
          restore_availability: true,
          title: 'Fit for modified team training, but not match selection',
        },
      ],
      initialEventsOrder: ['id_1234', 'id_1235'],
      events: {
        id_1234: {
          injury_status_id: 'option_1234',
          date: '2018-05-05',
        },
        id_1235: {
          injury_status_id: 'option_1235',
          date: '2018-10-05',
        },
        new_status: {
          injury_status_id: null,
          date: null,
        },
      },
      updatedEventsOrder: ['id_1234', 'id_1235', 'new_status'],
      onInjuryStatusEventDateChange: jest.fn(),
      onInjuryStatusChange: jest.fn(),
      addInjuryStatusEvent: jest.fn(),
      removeInjuryStatusEvent: jest.fn(),
      isDisabled: false,
      t: (key) => key,
    };
  });

  it('renders', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <AthleteAvailabilityHistory {...props} />
        </LocalizationProvider>
      </I18nextProvider>
    );
    expect(screen.getByText('Availability History')).toBeInTheDocument();
  });

  it('renders the correct amount of existing injury status events', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <AthleteAvailabilityHistory {...props} />
        </LocalizationProvider>
      </I18nextProvider>
    );
    const rows = document.querySelectorAll('.athleteAvailabilityHistory__row');
    expect(rows).toHaveLength(props.updatedEventsOrder.length);
  });

  it('disables the injury status dropdown on previously saved injury status events', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <AthleteAvailabilityHistory {...props} />
        </LocalizationProvider>
      </I18nextProvider>
    );
    const dropdownButtons = document.querySelectorAll(
      '.athleteAvailabilityHistory__statusSelect .btn.btn-default'
    );
    expect(dropdownButtons[0]).toBeDisabled();
    expect(dropdownButtons[1]).toBeDisabled();
    expect(dropdownButtons[2]).toBeEnabled();
  });

  it('disables the datepicker on previously saved injury status events', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <AthleteAvailabilityHistory {...props} />
        </LocalizationProvider>
      </I18nextProvider>
    );
    const datepickers = document.querySelectorAll(
      '.athleteAvailabilityHistory__datePicker input'
    );
    expect(datepickers[0]).toBeDisabled();
    expect(datepickers[1]).toBeDisabled();
    expect(datepickers[2]).toBeEnabled();
  });

  it('does not render a delete injury status event button on previously saved injury status events', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <AthleteAvailabilityHistory {...props} />
        </LocalizationProvider>
      </I18nextProvider>
    );
    const deleteButtons = document.querySelectorAll(
      '.athleteAvailabilityHistory__row .iconButton.icon-close'
    );
    expect(deleteButtons).toHaveLength(1); // Only the new_status event should have a delete button
    expect(deleteButtons[0]).toBeInTheDocument();
  });

  describe('when there are multiple events present', () => {
    it('displays the correct number of datepickers', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AthleteAvailabilityHistory {...props} />
          </LocalizationProvider>
        </I18nextProvider>
      );
      const datepickers = document.querySelectorAll(
        '.athleteAvailabilityHistory__datePicker'
      );
      expect(datepickers).toHaveLength(3);
    });

    it('does not display a date for the first (disabled) injury status event', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AthleteAvailabilityHistory {...props} />
          </LocalizationProvider>
        </I18nextProvider>
      );
      const datepickerInput = document.querySelectorAll(
        '.athleteAvailabilityHistory__datePicker input'
      )[0];
      // The DatePicker component does not display a value when it is disabled.
      // This test verifies that the value is empty.
      expect(datepickerInput).toHaveValue('');
    });
  });

  describe('when there is only one event present', () => {
    beforeEach(() => {
      props.updatedEventsOrder = ['id_1234'];
      props.events = {
        id_1234: {
          injury_status_id: 'option_1234',
          date: '2018-05-05',
        },
      };
    });

    it('displays a disabled datepicker', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AthleteAvailabilityHistory {...props} />
          </LocalizationProvider>
        </I18nextProvider>
      );
      const datepickers = document.querySelectorAll(
        '.athleteAvailabilityHistory__datePicker'
      );
      const datepickerInput = document.querySelector(
        '.athleteAvailabilityHistory__datePicker input'
      );
      expect(datepickers).toHaveLength(1);
      expect(datepickerInput).toBeDisabled();
    });

    it('does not display a delete button for the event', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AthleteAvailabilityHistory {...props} />
          </LocalizationProvider>
        </I18nextProvider>
      );
      const deleteButtons = document.querySelectorAll(
        '.athleteAvailabilityHistory__row .iconButton.icon-close'
      );
      expect(deleteButtons).toHaveLength(0);
    });
  });

  describe('when adding a new injury status event', () => {
    let user;
    beforeEach(() => {
      user = userEvent.setup();
    });

    it('calls a callback', async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AthleteAvailabilityHistory {...props} />
          </LocalizationProvider>
        </I18nextProvider>
      );

      const addButton = document.querySelector('.icon-add');
      await user.click(addButton);

      expect(props.addInjuryStatusEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('when deleting an injury status event', () => {
    let user;
    beforeEach(() => {
      user = userEvent.setup();
      props.initialEventsOrder = ['id_1234', 'id_1235'];
      props.updatedEventsOrder = ['id_1234', 'id_1235', 'new_status'];
      props.events = {
        id_1234: {
          injury_status_id: 'option_1234',
          date: '2018-05-05',
        },
        id_1235: {
          injury_status_id: 'option_1235',
          date: '2018-05-10',
        },
        new_status: {
          injury_status_id: 'option_1234',
          date: '2018-05-05',
        },
      };
    });

    it('calls a callback with the correct arguments', async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AthleteAvailabilityHistory {...props} />
          </LocalizationProvider>
        </I18nextProvider>
      );

      const deleteButtons = document.querySelectorAll('.icon-close');
      await user.click(deleteButtons[0]);

      expect(props.removeInjuryStatusEvent).toHaveBeenCalledWith('new_status');
      expect(props.removeInjuryStatusEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('when isDisabled is true', () => {
    beforeEach(() => {
      props.isDisabled = true;
    });

    it('disables the titles and fields', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AthleteAvailabilityHistory {...props} />
          </LocalizationProvider>
        </I18nextProvider>
      );

      const container = document.querySelector('.athleteAvailabilityHistory');
      expect(container).toHaveClass('athleteAvailabilityHistory--disabled');

      const sectionTitle = document.querySelector(
        '.athleteIssueEditor__sectionTitle'
      );
      expect(sectionTitle).toHaveClass(
        'athleteIssueEditor__sectionTitle--disabled'
      );

      // Check if the add button is disabled
      const addButton = document.querySelector('.icon-add');
      expect(addButton).toBeDisabled();
    });
  });

  describe('when there are no injury occurrence events added', () => {
    beforeEach(() => {
      props.updatedEventsOrder = ['new_status'];
      props.events = {
        new_status: {
          injury_status_id: null,
          date: null,
        },
      };
    });

    it('does not disable the default row', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AthleteAvailabilityHistory {...props} />
          </LocalizationProvider>
        </I18nextProvider>
      );
      const dropdownButton = document.querySelector(
        '.athleteAvailabilityHistory__statusSelect .btn.btn-default'
      );
      expect(dropdownButton).toBeEnabled();
    });

    it('passes the right options to <IssueStatusSelect />', async () => {
      const user = userEvent.setup();
      render(
        <I18nextProvider i18n={i18n}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AthleteAvailabilityHistory {...props} />
          </LocalizationProvider>
        </I18nextProvider>
      );

      const dropdownButton = document.querySelector(
        '.athleteAvailabilityHistory__statusSelect .btn.btn-default'
      );
      await user.click(dropdownButton);

      // Check if the expected options are visible
      expect(
        screen.getByText('Not fit for training or match')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Fit for rehab / non-team training')
      ).toBeInTheDocument();
      // The third option 'Fit for modified team training, but not match selection' is not expected for 'new_status'
      expect(
        screen.queryByText(
          'Fit for modified team training, but not match selection'
        )
      ).not.toBeInTheDocument();
    });
  });

  describe('when adding a new injury occurrence', () => {
    beforeEach(() => {
      props.initialEventsOrder = ['new_status'];
      props.updatedEventsOrder = ['new_status'];
      props.events = {
        new_status: {
          injury_status_id: null,
          date: null,
        },
      };
    });

    it('has an empty event row', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <AthleteAvailabilityHistory {...props} />
          </LocalizationProvider>
        </I18nextProvider>
      );
      const dropdownButton = document.querySelector(
        '.athleteAvailabilityHistory__statusSelect .btn.btn-default'
      );
      const datepickerInput = document.querySelector(
        '.athleteAvailabilityHistory__datePicker input'
      );
      expect(dropdownButton).toBeEnabled();
      expect(datepickerInput).toBeDisabled(); // The first datepicker is disabled
      expect(datepickerInput).toHaveValue('');
    });
  });
});
