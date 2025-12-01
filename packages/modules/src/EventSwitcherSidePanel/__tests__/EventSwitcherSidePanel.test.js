import { render, screen } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';

import {
  useGetPlanningHubEventQuery,
  useGetEventsQuery,
} from '@kitman/modules/src/EventSwitcherSidePanel/services/api/eventSwitchApi';
import { Provider } from 'react-redux';
import { data as surroundingEventData } from '@kitman/services/src/mocks/handlers/planningHub/getEvents';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import EventSwitcherSidePanel from '../EventSwitcherSidePanel';

jest.mock(
  '@kitman/modules/src/EventSwitcherSidePanel/services/api/eventSwitchApi'
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  eventSwitcherSlice: {
    isEventSwitcherOpen: true,
    searchState: {
      filters: {
        dateRange: {
          start_date: '2023-11-04T16:37:04+00:00',
          end_date: '2024-01-03T16:37:04+00:00',
        },
        eventTypes: [],
        competitions: [],
        gameDays: [],
        oppositions: [],
      },
      nextId: null,
    },
  },
});

const eventDataWithRepeatingEvents = {
  ...surroundingEventData,
  events: surroundingEventData.events.map((event, index) => ({
    ...event,
    ...(event.type === 'session_event'
      ? {
          id: `${event.id}VIRTUAL_EVENT${index + 1}`,
          name: `Virtual session ${event.id}`,
          isVirtualEvent: true,
          recurrence: {
            ...event.recurrence,
            rule: 'FREQ=WEEKLY;BYDAY=TH',
            rrule_instances: [
              '20211023T111334Z',
              '20211025T111334Z',
              '20211027T111334Z',
            ],
          },
        }
      : event.recurrence),
  })),
};

describe('EventSwitcherSidePanel', () => {
  const mockRefetchFn = jest.fn();
  beforeEach(() => {
    window.setFlag('repeat-sessions', false);
    useGetPlanningHubEventQuery.mockReturnValue({
      data: {
        competitions: [],
        dateRange: {
          start_date: '2023-11-04T16:37:04+00:00',
          end_date: '2024-01-03T16:37:04+00:00',
        },
        eventTypes: [],
        oppositions: [],
        gameDays: [],
      },
      isError: false,
      isFetching: false,
      refetch: mockRefetchFn,
    });
    i18nextTranslateStub();

    useGetEventsQuery.mockReturnValue({
      data: surroundingEventData,
      isError: false,
      isFetching: false,
      refetch: mockRefetchFn,
    });
  });

  const props = {
    isOpen: true,
    eventId: 3692,
    onClosePanel: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderEventSwitcherSidePanel = () =>
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 1200, itemHeight: 40 }}
      >
        <Provider store={defaultStore}>
          <EventSwitcherSidePanel {...props} />
        </Provider>
      </VirtuosoMockContext.Provider>
    );

  it('renders the EventSwitcherSidePanel correctly', () => {
    renderEventSwitcherSidePanel();
    expect(
      screen.getByRole('button', {
        name: '4 Nov 2023 - 3 Jan 2024',
      })
    ).toBeInTheDocument();
    const exercises = screen.getAllByRole('link');

    expect(exercises.length).toEqual(surroundingEventData.events.length);
    expect(exercises[0]).toHaveTextContent('Chelsea (Home), Champions League');
    expect(
      screen.getByText(/sat, oct 23, 2021 \| 11:02 am/i)
    ).toBeInTheDocument();

    expect(exercises[1]).toHaveTextContent('Captains Run');
    expect(
      screen.getByText(/wed, jun 23, 2021 \| 11:10 am/i)
    ).toBeInTheDocument();
  });

  it('correctly handles loading state', async () => {
    useGetEventsQuery.mockReturnValue({
      data: {
        competitions: [],
        dateRange: {
          start_date: '2023-11-04T16:37:04+00:00',
          end_date: '2024-01-03T16:37:04+00:00',
        },
        eventTypes: [],
        oppositions: [],
        gameDays: [],
      },
      isFetching: true,
      refetch: mockRefetchFn,
    });
    renderEventSwitcherSidePanel();
    await expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('correctly handles error state', async () => {
    useGetEventsQuery.mockReturnValue({
      data: { events: [] },
      isFetching: false,
      isError: true,
      refetch: mockRefetchFn,
    });
    renderEventSwitcherSidePanel();
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  it('correctly handles no data', async () => {
    useGetEventsQuery.mockReturnValue({
      data: { events: [] },
      isFetching: false,
      isError: false,
      refetch: mockRefetchFn,
    });
    renderEventSwitcherSidePanel();
    expect(
      screen.getByText('No events scheduled for this period')
    ).toBeInTheDocument();
  });

  it('correctly handles null for returned data', async () => {
    useGetEventsQuery.mockReturnValue({
      data: null,
      isFetching: false,
      isError: false,
      refetch: mockRefetchFn,
    });
    renderEventSwitcherSidePanel();
    expect(
      screen.getByText('No events scheduled for this period')
    ).toBeInTheDocument();
  });

  describe('link href', () => {
    it('should set the correct href for a non repeating event type', () => {
      renderEventSwitcherSidePanel();
      const exercises = screen.getAllByRole('link', { name: 'Captains Run' });

      expect(exercises[0]).toHaveAttribute('href', '/planning_hub/events/2');
    });

    it('should set the correct href for a virtual repeating session', () => {
      useGetEventsQuery.mockReturnValue({
        data: eventDataWithRepeatingEvents,
        isError: false,
        isFetching: false,
        refetch: mockRefetchFn,
      });
      window.setFlag('repeat-sessions', true);
      renderEventSwitcherSidePanel();
      const exercises = screen.getAllByRole('link', {
        name: 'Virtual session 2',
      });

      expect(exercises[0]).toHaveAttribute(
        'href',
        '/planning_hub/events/2/transform_event?include_rrule_instance=true&original_start_time=2021-06-23T11%3A10%3A00.000Z&open_event_switcher_panel=true'
      );
    });
  });
});
