import { render, screen, waitFor } from '@testing-library/react';

import { creatableEventTypeEnumLike } from '@kitman/modules/src/PlanningEventSidePanel/src/enumLikes';
import { data as eventData } from '@kitman/services/src/mocks/handlers/planningHub/getEvent';

import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import Attendance from '../Attendance';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
}));

describe('<Attendance />', () => {
  const mockProps = {
    onUpdateEventDetails: jest.fn(),
    event: eventData.event,
    eventValidity: {},
  };

  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Liverpool',
        association_name: 'Premier League',
      },
    });
  });

  it('should not render when all flags are falsy and event type is not custom_event', () => {
    render(<Attendance {...mockProps} />);
    expect(screen.queryByText('Attendance')).not.toBeInTheDocument();
  });

  it('should render accordion', async () => {
    render(
      <Attendance
        {...mockProps}
        event={{ ...mockProps.event, type: 'custom_event' }}
      />
    );
    await waitFor(() => {
      expect(screen.getByText('Attendance')).toBeInTheDocument();
    });
  });

  describe('Athlete selection', () => {
    describe.each([
      {
        eventType: creatableEventTypeEnumLike.Session,
        flags: ['pac-event-sidepanel-sessions-games-show-athlete-dropdown'],
      },
      {
        eventType: creatableEventTypeEnumLike.Game,
        flags: ['pac-event-sidepanel-sessions-games-show-athlete-dropdown'],
      },
      { eventType: creatableEventTypeEnumLike.CustomEvent, flags: [] },
    ])('$eventType', ({ eventType, flags }) => {
      // Athlete selection always renders when eventType is custom_event
      if (eventType !== creatableEventTypeEnumLike.CustomEvent) {
        it('should not render when flags are falsy', () => {
          render(
            <Attendance
              {...mockProps}
              event={{ ...mockProps.events, type: eventType }}
            />
          );
          expect(screen.queryByLabelText('Athletes')).not.toBeInTheDocument();
        });
      }

      it('should render when flags are truthy', async () => {
        flags.forEach((flag) => window.setFlag(flag, true));
        render(
          <Attendance
            {...mockProps}
            event={{ ...mockProps.events, type: eventType }}
          />
        );
        await waitFor(() => {
          expect(screen.getByText('Attendance')).toBeInTheDocument();
        });
        expect(screen.getByLabelText('Athletes')).toBeInTheDocument();
      });
    });
  });

  describe('Staff selection', () => {
    describe.each([
      {
        eventType: creatableEventTypeEnumLike.Session,
        flags: [
          'pac-event-sidepanel-sessions-games-show-athlete-dropdown',
          'planning-selection-tab',
        ],
      },
      {
        eventType: creatableEventTypeEnumLike.Game,
        flags: ['game-details', 'staff-selection-games'],
      },
      { eventType: creatableEventTypeEnumLike.CustomEvent, flags: [] },
    ])('$eventType', ({ eventType, flags }) => {
      // Staff selection always renders when eventType is custom_event
      if (eventType !== creatableEventTypeEnumLike.CustomEvent) {
        it('should not render when flags are falsy', () => {
          render(
            <Attendance
              {...mockProps}
              event={{ ...mockProps.events, type: eventType }}
            />
          );
          expect(screen.queryByLabelText('Staff')).not.toBeInTheDocument();
        });
      }

      it('should render when flags are truthy', async () => {
        flags.forEach((flag) => window.setFlag(flag, true));
        render(
          <Attendance
            {...mockProps}
            event={{ ...mockProps.events, type: eventType }}
          />
        );
        await waitFor(() => {
          expect(screen.getByText('Attendance')).toBeInTheDocument();
        });
        expect(screen.getByLabelText('Staff')).toBeInTheDocument();
      });
    });
  });
});
