import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';

import EventSelection from '../../components/EventSelection';

setI18n(i18n);

describe('Import Workflow <EventSelection /> component', () => {
  const props = {
    orgTimezone: 'Europe/Dublin',
    event: {
      id: null,
      eventType: 'TRAINING_SESSION',
      sessionTypeId: '',
      workloadType: '',
      duration: '',
      date: '2018-02-26',
    },
    events: {
      loaded: true,
      date: '2018-02-26',
      data: [
        {
          event: {
            type: 'any',
            datetime: '2018-02-26T09:00:00.000+01:00',
            duration: 25.333,
            uniqueIdentifier: '123',
          },
          athletes: [
            {
              id: 1,
              firstname: 'Gustavo',
              lastname: 'Stark',
              fullname: 'Gustavo Stark',
            },
          ],
          nonSetupAthletesIdentifiers: ['123456'],
        },
      ],
    },
    onEventsLoad: () => {},
    sourceData: {
      integrationData: { id: 1, date: '2018-02-26', name: 'Statsports' },
      eventData: null,
    },
    onEventDataChange: () => {},
    onForward: () => {},
    onBackward: () => {},
    onIntegrationsLoad: () => {},
    t: (value) => value,
  };

  it('renders', () => {
    render(<EventSelection {...props} />);
    expect(
      screen.getByText('Please select the session you wish to import')
    ).toBeInTheDocument();
  });

  it('renders event radio', () => {
    render(<EventSelection {...props} />);

    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
  });

  it('renders the event time', () => {
    render(<EventSelection {...props} />);

    // Find by text since we don't know the exact structure
    expect(screen.getByText('Session Time')).toBeInTheDocument();
    expect(screen.getByText('8:00 AM')).toBeInTheDocument();
  });

  it('renders the next step button', () => {
    render(<EventSelection {...props} />);

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('renders the Warning component when no athletes is present in some event', () => {
    const events = {
      loaded: true,
      date: '2018-02-26',
      data: [
        {
          event: {
            type: 'any',
            datetime: '2018-02-26 09:00:00',
            duration: 25,
            uniqueIdentifier: '123',
          },
          athletes: [],
          nonSetupAthletesIdentifiers: ['123456'],
        },
      ],
    };

    render(<EventSelection {...props} events={events} />);

    expect(
      screen.getByText('#sport_specific__No_athletes_found_for_this_session')
    ).toBeInTheDocument();
  });

  it('does not render the athlete names when event is not expanded', () => {
    const events = {
      loaded: true,
      date: '2018-02-26',
      data: [
        {
          event: {
            type: 'any',
            datetime: '2018-02-26 09:00:00',
            duration: 25,
            uniqueIdentifier: '123',
          },
          athletes: [
            {
              id: 1,
              firstname: 'Gustavo',
              lastname: 'Stark',
              fullname: 'Gustavo Stark',
            },
          ],
          nonSetupAthletesIdentifiers: [],
        },
      ],
    };

    render(<EventSelection {...props} events={events} />);

    expect(screen.queryByText('Gustavo Stark')).not.toBeInTheDocument();
  });

  it('renders the athlete names when event is expanded', async () => {
    const user = userEvent.setup();

    const events = {
      loaded: true,
      date: '2018-02-26',
      data: [
        {
          event: {
            type: 'any',
            datetime: '2018-02-26 09:00:00',
            duration: 25,
            uniqueIdentifier: '123',
          },
          athletes: [
            {
              id: 1,
              firstname: 'Gustavo',
              lastname: 'Stark',
              fullname: 'Gustavo Stark',
            },
          ],
          nonSetupAthletesIdentifiers: [],
        },
      ],
    };

    render(<EventSelection {...props} events={events} />);

    const expandIcon = screen.getByText(
      (content, element) =>
        content.trim() === '' &&
        element.className === 'icon-down eventSelection__expandIcon'
    );
    await user.click(expandIcon);

    expect(screen.getByText('Gustavo Stark')).toBeInTheDocument();
  });

  it('does not show the expand button when there is no athlete for the event', () => {
    const events = {
      loaded: true,
      date: '2018-02-26',
      data: [
        {
          event: {
            type: 'any',
            datetime: '2018-02-26 09:00:00',
            duration: 25,
            uniqueIdentifier: '123',
          },
          athletes: [],
          nonSetupAthletesIdentifiers: ['123'],
        },
      ],
    };

    render(<EventSelection {...props} events={events} />);

    expect(
      screen.queryByText(
        (content, element) =>
          content.trim() === '' &&
          element.className.includes('eventSelection__expandIcon')
      )
    ).not.toBeInTheDocument();
  });

  it('rounds the event duration', () => {
    render(<EventSelection {...props} />);
    expect(screen.getByText('25 min')).toBeInTheDocument();
  });

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('shows the events dates', () => {
      const events = {
        loaded: true,
        date: '2018-02-26',
        data: [
          {
            event: {
              type: 'any',
              datetime: '2018-02-25T09:00:00',
              localTimezone: 'Europe/Dublin',
              duration: 25,
              uniqueIdentifier: '123',
            },
            athletes: [],
            nonSetupAthletesIdentifiers: ['456'],
          },
          {
            event: {
              type: 'any',
              datetime: '2018-02-25T10:00:00',
              localTimezone: 'Europe/Dublin',
              duration: 25,
              uniqueIdentifier: '456',
            },
            athletes: [],
            nonSetupAthletesIdentifiers: ['456'],
          },
          {
            event: {
              type: 'any',
              datetime: '2018-02-26T09:00:00',
              localTimezone: 'Europe/Dublin',
              duration: 25,
              uniqueIdentifier: '789',
            },
            athletes: [],
            nonSetupAthletesIdentifiers: ['789'],
          },
        ],
      };

      render(<EventSelection {...props} events={events} />);

      expect(screen.getByText('Sun, 25 Feb 2018')).toBeInTheDocument();
      expect(screen.getByText('Mon, 26 Feb 2018')).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });

    it('shows the events dates', () => {
      const events = {
        loaded: true,
        date: '2018-02-26',
        data: [
          {
            event: {
              type: 'any',
              datetime: '2018-02-25T09:00:00',
              localTimezone: 'Europe/Dublin',
              duration: 25,
              uniqueIdentifier: '123',
            },
            athletes: [],
            nonSetupAthletesIdentifiers: ['456'],
          },
          {
            event: {
              type: 'any',
              datetime: '2018-02-25T10:00:00',
              localTimezone: 'Europe/Dublin',
              duration: 25,
              uniqueIdentifier: '456',
            },
            athletes: [],
            nonSetupAthletesIdentifiers: ['456'],
          },
          {
            event: {
              type: 'any',
              datetime: '2018-02-26T09:00:00',
              localTimezone: 'Europe/Dublin',
              duration: 25,
              uniqueIdentifier: '789',
            },
            athletes: [],
            nonSetupAthletesIdentifiers: ['789'],
          },
        ],
      };

      render(<EventSelection {...props} events={events} />);

      expect(screen.getByText('Feb 25, 2018')).toBeInTheDocument();
      expect(screen.getByText('Feb 26, 2018')).toBeInTheDocument();
    });
  });
});
