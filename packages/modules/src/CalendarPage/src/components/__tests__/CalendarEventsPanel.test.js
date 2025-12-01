import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import { data as mockSessionTypes } from '@kitman/services/src/mocks/handlers/getSessionTypes';

import CalendarEventsPanel from '../CalendarEventsPanel';

describe('<CalendarEventsPanel />', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      defaultEventDuration: 22,
      defaultGameDuration: 72,
      onClose: jest.fn(),
      isOpen: true,
      t: i18nextTranslateStub(),
    };
  });

  describe('when the initial data request is successful', () => {
    beforeEach(() => {
      // Setup MSW to handle the getSessionTypes API call successfully
      server.use(
        rest.get('/session_types', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockSessionTypes));
        })
      );
    });

    it('renders the event groups and their draggable events', async () => {
      render(<CalendarEventsPanel {...baseProps} />);

      // The component fetches data, so we wait for the content to appear.
      expect(await screen.findByText('Game')).toBeInTheDocument();
      expect(await screen.findByText('Training Session')).toBeInTheDocument();

      // Verify that the draggable events are rendered within their groups
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Away')).toBeInTheDocument();
      expect(screen.getByText('Agility')).toBeInTheDocument();
      expect(screen.getByText('Strength')).toBeInTheDocument();
    });

    it('applies the correct default event durations to the data-event attribute', async () => {
      render(<CalendarEventsPanel {...baseProps} />);

      // Wait for a specific draggable event to ensure data has loaded
      const homeGameEvent = await screen.findByText('Home');
      const agilitySessionEvent = await screen.findByText('Agility');

      // Parse the data-event attribute and check the duration
      const gameEventData = JSON.parse(
        homeGameEvent.getAttribute('data-event')
      );
      const sessionEventData = JSON.parse(
        agilitySessionEvent.getAttribute('data-event')
      );

      expect(gameEventData.defaultDurationMins).toBe(
        baseProps.defaultGameDuration
      );
      expect(sessionEventData.defaultDurationMins).toBe(
        baseProps.defaultEventDuration
      );
    });

    it('calls the onClose prop when the close button is clicked', async () => {
      render(<CalendarEventsPanel {...baseProps} />);

      const closeButton = screen.getByRole('button');

      await user.click(closeButton);

      expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the initial data request fails', () => {
    beforeEach(() => {
      // Setup MSW to return a server error for the API call
      server.use(
        rest.get('/session_types', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );
    });

    it('shows an error message', async () => {
      render(<CalendarEventsPanel {...baseProps} />);

      // The component renders an <AppStatus status="error" />, which should
      // contain an element with a role of "alert" or specific error text.
      // We wait for it to appear.

      const errorStatus = await screen.findByText('Something went wrong!');

      expect(errorStatus).toBeInTheDocument();
    });
  });
});
