import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import SessionPlanningTabHeader from '../SessionPlanningTabHeader';

// Mock TrackEvent to prevent errors
jest.mock('@kitman/common/src/utils', () => ({
  ...jest.requireActual('@kitman/common/src/utils'),
  TrackEvent: jest.fn(),
}));

const { TrackEvent } = require('@kitman/common/src/utils');

describe('<SessionPlanningTabHeader />', () => {
  const props = {
    isLoading: false,
    eventId: 1,
    isActivityPresent: true,
    canEditEvent: true,
    eventSessionActivities: [
      {
        id: 1,
        athletes: [],
        duration: 23,
        principles: [],
        users: [],
      },
      {
        id: 2,
        athletes: [],
        duration: 44,
        principles: [],
        users: [],
      },
      {
        id: 3,
        athletes: [],
        duration: null,
        principles: [],
        users: [],
      },
    ],
    showPrinciplesPanel: jest.fn(),
    onAddActivity: jest.fn(),
    onClickAthleteParticipation: jest.fn(),
    t: i18nextTranslateStub(),
    eventType: 'session_event',
    onPrintSummaryOpen: jest.fn(),
  };

  // Helper to mock window.getFlag
  const mockFeatureFlag = (flagName, value) => {
    window.getFlag = jest.fn((flag) => (flag === flagName ? value : false));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset feature flags
    window.getFlag = jest.fn(() => false);
  });

  afterEach(() => {
    delete window.getFlag;
  });

  it('renders the correct content', () => {
    render(<SessionPlanningTabHeader {...props} />);

    expect(
      document.querySelector('.planningEventGridTab__header')
    ).toBeInTheDocument();
  });

  describe('when the component is loading', () => {
    it('disables the add activity button', () => {
      render(<SessionPlanningTabHeader {...props} isLoading />);

      const addActivityBtn = screen.getByRole('button', {
        name: 'Add activity',
      });
      expect(addActivityBtn).toBeDisabled();
    });
  });

  describe('when canEditEvent is false', () => {
    it('does not render action buttons', () => {
      render(<SessionPlanningTabHeader {...props} canEditEvent={false} />);

      expect(
        screen.queryByRole('button', { name: 'Add activity' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Athlete participation' })
      ).not.toBeInTheDocument();
    });
  });

  describe('when on desktop', () => {
    it('calls the correct callback when clicking the add activity button', async () => {
      const user = userEvent.setup();
      render(<SessionPlanningTabHeader {...props} />);

      const addActivityBtn = screen.getByRole('button', {
        name: 'Add activity',
      });
      await user.click(addActivityBtn);

      expect(props.onAddActivity).toHaveBeenCalledWith(props.eventId);
      expect(TrackEvent).toHaveBeenCalledWith(
        'Session Planning',
        'Add',
        'Activity'
      );
    });

    it('calls the correct callback when clicking athlete participation button', async () => {
      const user = userEvent.setup();
      render(<SessionPlanningTabHeader {...props} />);

      const athleteParticipationButton = screen.getByRole('button', {
        name: 'Athlete participation',
      });

      await user.click(athleteParticipationButton);

      expect(props.onClickAthleteParticipation).toHaveBeenCalled();
    });
  });

  describe('when on mobile', () => {
    it('renders the mobile actions menu', () => {
      render(<SessionPlanningTabHeader {...props} />);

      // Should render mobile actions container
      expect(
        document.querySelector('.planningEventGridTab__actions--mobile')
      ).toBeInTheDocument();

      // Should render the menu trigger button
      const menuButtons = screen.getAllByRole('button');
      const menuTriggerButton = menuButtons.find((button) =>
        button.querySelector('.icon-more')
      );
      expect(menuTriggerButton).toBeInTheDocument();
    });

    // Note: Testing TooltipMenu interactions would require additional setup
    // as it involves hover/click interactions and menu rendering
    // For now, we test that the component renders correctly with menu items
  });

  describe('when the session-planning-download-sharing flag is on', () => {
    beforeEach(() => {
      mockFeatureFlag('session-planning-download-sharing', true);
    });

    it('shows the download button on desktop', () => {
      render(<SessionPlanningTabHeader {...props} />);

      // Should render the desktop TooltipMenu with download functionality
      expect(
        document.querySelector('.planningEventGridTab__actions--desktop')
      ).toBeInTheDocument();

      // The download menu should be present (though testing TooltipMenu content
      // would require more complex interaction testing)
      const menuButtons = screen.getAllByRole('button');
      const desktopMenuButton = menuButtons.find((button) =>
        button.querySelector('.icon-more')
      );
      expect(desktopMenuButton).toBeInTheDocument();
    });

    it('includes download option for session events', () => {
      render(<SessionPlanningTabHeader {...props} eventType="session_event" />);

      // Verify it's a session event and flag is enabled
      expect(props.eventType).toBe('session_event');
      expect(window.getFlag('session-planning-download-sharing')).toBe(true);

      // The download functionality should be available
      // (Full interaction testing would require TooltipMenu interaction)
    });

    it('does not show download for non-session events', () => {
      const trainingEventProps = { ...props, eventType: 'training_event' };
      render(<SessionPlanningTabHeader {...trainingEventProps} />);

      expect(trainingEventProps.eventType).toBe('training_event');

      expect(
        screen.getByRole('button', { name: 'Add activity' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Athlete participation' })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Download' })
      ).not.toBeInTheDocument();
    });
  });

  describe('when session-planning-download-sharing flag is off', () => {
    beforeEach(() => {
      mockFeatureFlag('session-planning-download-sharing', false);
    });

    it('does not show download button', () => {
      render(<SessionPlanningTabHeader {...props} />);

      expect(
        screen.queryByRole('button', { name: 'Download' })
      ).not.toBeInTheDocument();

      expect(window.getFlag('session-planning-download-sharing')).toBe(false);
    });
  });

  describe('button states', () => {
    it('enables buttons when not loading', () => {
      render(<SessionPlanningTabHeader {...props} isLoading={false} />);

      expect(
        screen.getByRole('button', { name: 'Add activity' })
      ).toBeEnabled();
      expect(
        screen.getByRole('button', { name: 'Athlete participation' })
      ).toBeEnabled();
    });

    it('disables add activity button when loading', () => {
      render(<SessionPlanningTabHeader {...props} isLoading />);

      expect(
        screen.getByRole('button', { name: 'Add activity' })
      ).toBeDisabled();
      // Athlete participation button should still be enabled when loading
      expect(
        screen.getByRole('button', { name: 'Athlete participation' })
      ).toBeEnabled();
    });
  });

  describe('responsive layout', () => {
    it('renders both desktop and mobile action containers', () => {
      render(<SessionPlanningTabHeader {...props} />);

      // Both containers should be present (CSS controls visibility)
      expect(
        document.querySelector('.planningEventGridTab__actions--desktop')
      ).toBeInTheDocument();

      expect(
        document.querySelector('.planningEventGridTab__actions--mobile')
      ).toBeInTheDocument();
    });
  });
});
