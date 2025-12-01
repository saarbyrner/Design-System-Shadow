import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import TemplateHeader from '../index';

describe('<TemplateHeader />', () => {
  const baseProps = {
    orgLogoPath: 'logo.png',
    orgName: 'Test Org',
    squadName: 'Test Squad',
    orgTimezone: 'UTC',
    t: i18nextTranslateStub(),
  };

  const trainingEvent = {
    id: '454565',
    type: 'session_event',
    session_type: { id: 1, name: 'Speed' },
    duration: 30,
    local_timezone: 'Europe/Berlin',
    start_date: '2020-12-19T17:00:00+00:00',
  };

  describe('when the event is a training session', () => {
    describe('when the standard-date-formatting flag is off', () => {
      beforeEach(() => {
        window.featureFlags = { 'standard-date-formatting': false };
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('renders the correct header content', () => {
        render(<TemplateHeader {...baseProps} event={trainingEvent} />);
        expect(screen.getByText('Speed (Dec 19, 2020)')).toBeInTheDocument();
        expect(screen.getByText('19th Dec 20')).toBeInTheDocument();
        expect(screen.getByText('6:00 pm (Europe/Berlin)')).toBeInTheDocument();
      });
    });

    describe('when the standard-date-formatting flag is on', () => {
      beforeEach(() => {
        window.featureFlags = { 'standard-date-formatting': true };
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('renders the correct header content', () => {
        render(<TemplateHeader {...baseProps} event={trainingEvent} />);
        expect(screen.getByText('Speed (Dec 19, 2020)')).toBeInTheDocument();
        expect(screen.getByText('December 19, 2020')).toBeInTheDocument();
        expect(screen.getByText('6:00 PM (Europe/Berlin)')).toBeInTheDocument();
      });
    });
  });

  it('renders meta informations', () => {
    const eventWithMeta = {
      ...trainingEvent,
      game_day_plus: 2,
      game_day_minus: 3,
      surface_type: { name: 'Artificial Turf' },
      weather: { title: 'Drizzle' },
      theme: { name: 'theme name' },
    };
    render(<TemplateHeader {...baseProps} event={eventWithMeta} />);

    expect(screen.getByText('+2, -3')).toBeInTheDocument();
    expect(screen.getByText('Artificial Turf')).toBeInTheDocument();
    expect(screen.getByText('Drizzle')).toBeInTheDocument();
    expect(screen.getByText('theme name')).toBeInTheDocument();
  });

  it('does not render meta informations when the event does not contain them', () => {
    render(<TemplateHeader {...baseProps} event={trainingEvent} />);

    expect(screen.queryByText('+2, -3')).not.toBeInTheDocument();
    expect(screen.queryByText('Artificial Turf')).not.toBeInTheDocument();
    expect(screen.queryByText('Drizzle')).not.toBeInTheDocument();
    expect(screen.queryByText('theme name')).not.toBeInTheDocument();
  });
});
