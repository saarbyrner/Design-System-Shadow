import 'core-js/stable/structured-clone';
import moment from 'moment-timezone';
import { Provider } from 'react-redux';
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { data as mockSquads } from '@kitman/services/src/mocks/handlers/getPermittedSquads';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { VIRTUAL_EVENT_ID_SEPARATOR } from '@kitman/common/src/consts/events';
import { resetFullCalendarEventState } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';

import EventTooltip from '../EventTooltip';
import { fetchEvent } from '../../actions';
import { emptyRecurrence } from '../../utils/eventUtils';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetActiveSquadQuery: jest.fn(),
}));
jest.mock('../../actions', () => ({
  ...jest.requireActual('../../actions'),
  fetchEvent: jest.fn(),
  deleteEvent: jest.fn((...args) => ({
    type: 'MOCK_DELETE_EVENT_THUNK',
    payload: args,
  })),
}));
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/modules/src/CalendarPage/src/utils/eventUtils', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/CalendarPage/src/utils/eventUtils'
  ),
  resetFullCalendarEventState: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('Calendar Page <EventTooltip /> Container', () => {
  let store;
  const dispatchMock = jest.fn();

  const props = {
    orgTimeZone: 'Europe/Dublin',
    defaultEventDuration: 45,
    defaultGameDuration: 55,
    calendarRef: { current: { getApi: jest.fn() } },
  };

  const textColor = '#5f7089';
  const backgroundColor = 'rgba(182, 201, 212, 0.3)';
  const borderColor = '#afb7c4';
  const title = 'My Event';

  let tippyTargetElement;
  let container;

  const tippyTargetElementId = 'tippyTargetElement';
  const containerClassName = 'fc-view-harness';

  const eventDate = new Date('2022-06-10T18:00:00Z'); // UTC FORMAT
  const testEvent = {
    allDay: false,
    title,
    extendedProps: {
      incompleteEvent: true,
      type: 'UNKNOWN',
      recurrence: { ...emptyRecurrence },
    },
    id: undefined,
    start: eventDate,
    end: null,
    setEnd: null,
  };

  const expectedAction1 = {
    type: 'REMOVE_INCOMPLETE_EVENTS',
  };

  const expectedAction2Event = {
    backgroundColor,
    borderColor,
    editable: true,
    end: '2022-06-10T18:55:00.000Z',
    id: undefined,
    incompleteEvent: true,
    start: '2022-06-10T18:00:00.000Z',
    textColor,
    title: 'New event',
    type: 'GAME',
    url: '',
    description: null,
    recurrence: { ...emptyRecurrence },
  };

  const expectedAction3Event = {
    allDay: false,
    background_color: backgroundColor,
    border_color: borderColor,
    calendarEventId: undefined,
    duration: props.defaultGameDuration,
    incompleteEvent: true,
    local_timezone: props.orgTimeZone,
    start_date: '2022-06-10T18:00:00+00:00',
    text_color: textColor,
    type: 'game_event',
    recurrence: { ...emptyRecurrence },
  };

  const expectedAction4 = {
    type: 'HIDE_EVENT_TOOLTIP',
  };

  beforeEach(() => {
    const fakeTime = new Date('2022-06-10T09:12:00Z'); // UTC FORMAT
    jest.useFakeTimers(fakeTime.getTime());
    moment.tz.setDefault('UTC');

    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
    useLeagueOperations.mockReturnValue({ isLeague: false });

    useGetActiveSquadQuery.mockReturnValue({
      data: {
        ...mockSquads[0],
      },
      isSuccess: true,
    });

    container = document.createElement('div');
    container.setAttribute('class', containerClassName);
    document.body.appendChild(container);

    tippyTargetElement = document.createElement('div');
    tippyTargetElement.setAttribute('id', tippyTargetElementId);
    document.body.appendChild(tippyTargetElement);

    store = storeFake({
      appStatus: {
        status: 'IDLE',
      },
      calendarPage: {
        currentView: 'dayGridMonth',
      },
      eventTooltip: {
        active: true,
        calendarEvent: window.structuredClone(testEvent),
        element: tippyTargetElement,
      },
      deleteEvent: {
        event: null,
      },
      eventsPanel: { event: null },
    });
    store.dispatch = dispatchMock;
  });

  afterEach(() => {
    moment.tz.setDefault();

    const existingDiv = document.getElementById(tippyTargetElementId);
    if (existingDiv) {
      document.body.removeChild(existingDiv);
    }

    const existingContainer =
      document.getElementsByClassName(containerClassName);
    if (existingContainer.length > 0) {
      document.body.removeChild(existingContainer[0]);
    }
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <EventTooltip {...props} />
      </Provider>
    );
  };

  it('initially renders DelayedLoadingFeedback', async () => {
    renderComponent();
    expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
    await waitForElementToBeRemoved(
      screen.queryByTestId('DelayedLoadingFeedback')
    );
  });

  it('renders the EventTooltip component', async () => {
    renderComponent();
    expect(await screen.findByText(testEvent.title)).toBeInTheDocument();
  });

  it('dispatches expected events onEditNewEvent with game_event type', async () => {
    renderComponent();
    const button = await screen.findByRole('button', { name: 'Game' });
    fireEvent.click(button);

    expect(dispatchMock).toHaveBeenNthCalledWith(1, expectedAction1);

    const expectedAction2 = {
      payload: {
        event: expectedAction2Event,
      },
      type: 'ADD_CALENDAR_EVENT',
    };
    expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedAction2);

    const expectedAction3 = {
      payload: {
        event: expectedAction3Event,
        mode: 'CREATE',
      },
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
    };
    expect(dispatchMock).toHaveBeenNthCalledWith(3, expectedAction3);

    expect(dispatchMock).toHaveBeenNthCalledWith(4, expectedAction4);
  });

  it('dispatches expected events onEditNewEvent with session_event type', async () => {
    renderComponent();
    const button = await screen.findByRole('button', {
      name: 'Session',
    });
    fireEvent.click(button);

    expect(dispatchMock).toHaveBeenNthCalledWith(1, expectedAction1);

    const expectedAction2 = {
      payload: {
        event: {
          ...expectedAction2Event,
          end: '2022-06-10T18:45:00.000Z',
          type: 'TRAINING_SESSION',
        },
      },
      type: 'ADD_CALENDAR_EVENT',
    };
    expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedAction2);

    const expectedAction3 = {
      payload: {
        event: {
          ...expectedAction3Event,
          duration: props.defaultEventDuration,
          type: 'session_event',
        },
        mode: 'CREATE',
      },
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
    };
    expect(dispatchMock).toHaveBeenNthCalledWith(3, expectedAction3);

    expect(dispatchMock).toHaveBeenNthCalledWith(4, expectedAction4);
  });

  it('dispatches expected events onEditNewEvent with custom_event type', async () => {
    window.featureFlags['custom-events'] = true;
    renderComponent();
    const button = await screen.findByRole('button', {
      name: 'Event',
    });
    fireEvent.click(button);

    expect(dispatchMock).toHaveBeenNthCalledWith(1, expectedAction1);

    const expectedAction2 = {
      payload: {
        event: {
          ...expectedAction2Event,
          end: '2022-06-10T18:45:00.000Z',
          type: 'CUSTOM_EVENT',
        },
      },
      type: 'ADD_CALENDAR_EVENT',
    };
    expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedAction2);

    const expectedAction3 = {
      payload: {
        event: {
          ...expectedAction3Event,
          duration: props.defaultEventDuration,
          type: 'custom_event',
        },
        mode: 'CREATE',
      },
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
    };
    expect(dispatchMock).toHaveBeenNthCalledWith(3, expectedAction3);

    expect(dispatchMock).toHaveBeenNthCalledWith(4, expectedAction4);
    window.featureFlags['custom-events'] = false;
  });

  describe('existing event', () => {
    describe('custom-events', () => {
      const squad = mockSquads[0];
      const id = '112';
      const existingCustomEvent = {
        backgroundColor,
        borderColor,
        start: eventDate,
        title,
        id,
        url: `/planning_hub/events/${id}`,
        extendedProps: {
          description: 'My description',
          incompleteEvent: false,
          eventCollectionComplete: true,
          type: 'CUSTOM_EVENT',
          visibilityIds: [12345],
          squad,
          recurrence: { ...emptyRecurrence },
        },
      };
      beforeEach(() => {
        window.featureFlags['custom-events'] = true;
      });
      afterEach(() => {
        window.featureFlags['custom-events'] = false;
      });

      it('should call fetch without adding startTime - original event', async () => {
        store.getState().eventTooltip.calendarEvent = existingCustomEvent;
        renderComponent();
        fireEvent.click(await screen.findByRole('button', { name: 'Edit' }));
        expect(fetchEvent).toHaveBeenCalledWith({
          calendarEventId: existingCustomEvent.id,
          isDeletingEvent: false,
          isDuplicate: false,
          shouldOpenEditEventSidePanel: true,
          type: existingCustomEvent.extendedProps.type,
        });
      });

      it('should call fetch with adding startTime and virtualEventId - virtual event', async () => {
        const virtualId = `${existingCustomEvent.id}${VIRTUAL_EVENT_ID_SEPARATOR}0`;
        const startTime = '2022-06-11T18:00:00+00:00';
        store.getState().eventTooltip.calendarEvent = {
          ...existingCustomEvent,
          id: virtualId,
          start: startTime,
        };
        renderComponent();
        fireEvent.click(await screen.findByRole('button', { name: 'Edit' }));
        expect(fetchEvent).toHaveBeenCalledWith({
          calendarEventId: existingCustomEvent.id,
          isDeletingEvent: false,
          isDuplicate: false,
          shouldOpenEditEventSidePanel: true,
          startTime: moment(startTime).toISOString(),
          type: existingCustomEvent.extendedProps.type,
          virtualEventId: virtualId,
        });
      });

      describe('onEditEvent', () => {
        it(
          'should reset full calendar state, removeIncompleteEvents and fetchEventById if' +
            'eventDataInSidePanel exists',
          async () => {
            store.getState().eventTooltip.calendarEvent = existingCustomEvent;
            store.getState().eventsPanel.event = testEvent;
            renderComponent();
            fireEvent.click(
              await screen.findByRole('button', { name: 'Edit' })
            );

            expect(resetFullCalendarEventState).toHaveBeenCalled();
            expect(fetchEvent).toHaveBeenCalled();
            expect(dispatchMock).toHaveBeenNthCalledWith(1, expectedAction1);
          }
        );

        it(
          'should not reset full calendar state but should removeIncompleteEvents and fetchEventById if' +
            'eventDataInSidePanel does not exist',
          async () => {
            store.getState().eventTooltip.calendarEvent = existingCustomEvent;
            renderComponent();
            fireEvent.click(
              await screen.findByRole('button', { name: 'Edit' })
            );

            expect(resetFullCalendarEventState).not.toHaveBeenCalled();
            expect(fetchEvent).toHaveBeenCalled();
            expect(dispatchMock).toHaveBeenNthCalledWith(1, expectedAction1);
          }
        );
      });
    });
  });
});
