import { render, screen } from '@testing-library/react';

import { data as mockSquads } from '@kitman/services/src/mocks/handlers/getPermittedSquads';
import { sortEvents, getEventContent } from '../helpers';
import { calendarViewOptionEnumLike } from '../enum-likes';

describe('helpers', () => {
  describe('sortEvent', () => {
    it('should sort 2 games by their start date - first event first', () => {
      const firstEvent = {
        id: 12345,
        start: '2020-09-08T13:00:00+01:00',
        title: 'Dublin - Kitman Series',
        type: 'GAME',
      };
      const secondEvent = {
        id: 56789,
        start: '2020-09-08T14:00:00+01:00',
        title: 'Cork - Kitman Series',
        type: 'GAME',
      };
      expect(sortEvents(firstEvent, secondEvent)).toBe(-1);
    });

    it('should sort 2 games by their start date - second event first', () => {
      const firstEvent = {
        id: 12345,
        start: '2020-09-08T15:00:00+01:00',
        title: 'Dublin - Kitman Series',
        type: 'GAME',
      };
      const secondEvent = {
        id: 56789,
        start: '2020-09-08T14:00:00+01:00',
        title: 'Cork - Kitman Series',
        type: 'GAME',
      };
      expect(sortEvents(firstEvent, secondEvent)).toBe(1);
    });

    it('should sort the game to be before the other type of event', () => {
      const firstEvent = {
        id: 56789,
        start: '2020-09-08T14:00:00+01:00',
        title: 'Cork - Kitman Series',
        type: 'GAME',
      };
      const secondEvent = {
        id: 12345,
        start: '2020-09-08T13:00:00+01:00',
        title: 'Fitbit - Monitoring',
        type: 'TRAINING_SESSION',
      };
      expect(sortEvents(firstEvent, secondEvent)).toBe(-1);
    });

    it('should not sort events if none are games', () => {
      const firstEvent = {
        id: 56789,
        start: '2020-09-08T14:00:00+01:00',
        title: 'Cork - Kitman Series',
        type: 'CUSTOM_EVENT',
      };
      const secondEvent = {
        id: 12345,
        start: '2020-09-08T13:00:00+01:00',
        title: 'Fitbit - Monitoring',
        type: 'TRAINING_SESSION',
      };
      expect(sortEvents(firstEvent, secondEvent)).toBe(0);
    });
  });

  // Additional tests for the content have been written in
  // packages/components/src/Calendar/__tests__/Calendar.test.js,
  // inside the 'event data' describe block
  describe('getEventContent', () => {
    const squad = mockSquads[0];

    const color = '#FFFFFF';
    const eventId = 1;

    const commonEventAttributes = {
      backgroundColor: color,
      borderColor: color,
      start: '2024-03-13T15:00:00Z',
      title: 'My Event',
    };
    const calendarEvent = {
      ...commonEventAttributes,
      id: eventId,
      url: `/planning_hub/events/${eventId}`,
      extendedProps: {
        description: 'Went home',
        incompleteEvent: false,
        eventCollectionComplete: false,
        type: 'CUSTOM_EVENT',
        squad,
      },
    };

    const trainingSessionEvent = {
      ...commonEventAttributes,
      extendedProps: {
        type: 'TRAINING_SESSION',
        eventCollectionComplete: false,
      },
    };

    const gameEvent = {
      ...commonEventAttributes,
      extendedProps: {
        type: 'GAME',
        eventCollectionComplete: false,
      },
    };

    const newEvent = {
      ...commonEventAttributes,
      extendedProps: {
        incompleteEvent: true,
        type: 'UNKNOWN',
      },
    };

    const eventRenderArg = {
      borderColor: '#000000',
      backgroundColor: '#FFFFFF',
      textColor: '#AC63FE',
      timeText: '1 AM',
      event: {
        ...calendarEvent,
      },
    };

    const newEventRenderArg = {
      ...eventRenderArg,
      event: newEvent,
    };

    const trainingSessionEventArg = {
      ...eventRenderArg,
      event: trainingSessionEvent,
    };

    const gameEventArg = {
      ...eventRenderArg,
      event: gameEvent,
    };

    it('should not render squad name because it is a new event - day', async () => {
      render(
        getEventContent(
          calendarViewOptionEnumLike.timeGridDay,
          newEventRenderArg
        )
      );

      expect(
        await screen.findByText(commonEventAttributes.title)
      ).toBeInTheDocument();
      expect(screen.getByText(eventRenderArg.timeText)).toBeInTheDocument();
      expect(screen.queryByText(squad.name)).not.toBeInTheDocument();
    });

    it('should not render squad name because it is a new event - week', async () => {
      render(
        getEventContent(
          calendarViewOptionEnumLike.timeGridWeek,
          newEventRenderArg
        )
      );

      expect(
        await screen.findByText(commonEventAttributes.title)
      ).toBeInTheDocument();
      expect(screen.getByText(eventRenderArg.timeText)).toBeInTheDocument();
      expect(screen.queryByText(squad.name)).not.toBeInTheDocument();
    });

    it('should not render squad name because the optimized-calendar FF is off - day', async () => {
      render(
        getEventContent(calendarViewOptionEnumLike.timeGridDay, eventRenderArg)
      );

      expect(
        await screen.findByText(commonEventAttributes.title)
      ).toBeInTheDocument();
      expect(screen.getByText(eventRenderArg.timeText)).toBeInTheDocument();
      expect(screen.queryByText(squad.name)).not.toBeInTheDocument();
    });

    it('should not render squad name because the optimized-calendar FF is off - week', async () => {
      render(
        getEventContent(calendarViewOptionEnumLike.timeGridWeek, eventRenderArg)
      );

      expect(
        await screen.findByText(commonEventAttributes.title)
      ).toBeInTheDocument();
      expect(screen.getByText(eventRenderArg.timeText)).toBeInTheDocument();
      expect(screen.queryByText(squad.name)).not.toBeInTheDocument();
    });

    describe('with optimized-calendar FF on', () => {
      beforeEach(() => {
        window.featureFlags['optimized-calendar'] = true;
      });

      afterEach(() => {
        window.featureFlags['optimized-calendar'] = false;
      });

      it('should render squad name because the optimized-calendar FF is on and is not a new event - day', async () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.timeGridDay,
            eventRenderArg
          )
        );

        expect(
          await screen.findByText(commonEventAttributes.title)
        ).toBeInTheDocument();
        expect(screen.getByText(eventRenderArg.timeText)).toBeInTheDocument();
        expect(screen.getByText(squad.name)).toBeInTheDocument();
      });

      it('should render squad name because the optimized-calendar FF is on and is not a new event - week', async () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.timeGridWeek,
            eventRenderArg
          )
        );

        expect(
          await screen.findByText(commonEventAttributes.title)
        ).toBeInTheDocument();
        expect(screen.getByText(eventRenderArg.timeText)).toBeInTheDocument();
        expect(screen.getByText(squad.name)).toBeInTheDocument();
      });
    });

    describe('with event-collection-complete FF on', () => {
      beforeEach(() => {
        window.setFlag('event-collection-complete', true);
      });

      afterEach(() => {
        window.setFlag('event-collection-complete', false);
      });

      const trainingSessionCompleteEventArg = {
        ...trainingSessionEventArg,
        event: {
          ...trainingSessionEventArg.event,
          extendedProps: {
            ...trainingSessionEventArg.event.extendedProps,
            eventCollectionComplete: true,
          },
        },
      };

      const gameCompleteEventArg = {
        ...gameEventArg,
        event: {
          ...gameEventArg.event,
          extendedProps: {
            ...gameEventArg.event.extendedProps,
            eventCollectionComplete: true,
          },
        },
      };

      it('should render check box icon because the event-collection-complete FF is on, the event type is TRAINING_SESSION and eventCollectionComplete is true - day', () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.timeGridDay,
            trainingSessionCompleteEventArg
          )
        );
        expect(screen.getByTestId('CheckBoxIcon')).toBeInTheDocument();
      });

      it('should render check box icon because the event-collection-complete FF is on, the event type is GAME and eventCollectionComplete is true - day', () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.timeGridDay,
            gameCompleteEventArg
          )
        );
        expect(screen.getByTestId('CheckBoxIcon')).toBeInTheDocument();
      });

      it('should render check box blank icon because the event-collection-complete FF is on, the event type is TRAINING_SESSION and eventCollectionComplete is false - day', () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.timeGridDay,
            trainingSessionEventArg
          )
        );

        expect(
          screen.getByTestId('CheckBoxOutlineBlankIcon')
        ).toBeInTheDocument();
      });

      it('should render check box blank icon because the event-collection-complete FF is on, the event type is GAME and eventCollectionComplete is false - day', () => {
        render(
          getEventContent(calendarViewOptionEnumLike.timeGridDay, gameEventArg)
        );

        expect(
          screen.getByTestId('CheckBoxOutlineBlankIcon')
        ).toBeInTheDocument();
      });

      it('should render check box icon because the event-collection-complete FF is on, the event type is TRAINING_SESSION and eventCollectionComplete is true - week', () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.timeGridWeek,
            trainingSessionCompleteEventArg
          )
        );
        expect(screen.getByTestId('CheckBoxIcon')).toBeInTheDocument();
      });

      it('should render check box icon because the event-collection-complete FF is on, the event type is GAME and eventCollectionComplete is true - week', () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.timeGridWeek,
            gameCompleteEventArg
          )
        );
        expect(screen.getByTestId('CheckBoxIcon')).toBeInTheDocument();
      });

      it('should render check box blank icon because the event-collection-complete FF is on, the event type is TRAINING_SESSION and eventCollectionComplete is false - week', () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.timeGridWeek,
            trainingSessionEventArg
          )
        );

        expect(
          screen.getByTestId('CheckBoxOutlineBlankIcon')
        ).toBeInTheDocument();
      });

      it('should render check box blank icon because the event-collection-complete FF is on, the event type is GAME and eventCollectionComplete is false - week', () => {
        render(
          getEventContent(calendarViewOptionEnumLike.timeGridWeek, gameEventArg)
        );

        expect(
          screen.getByTestId('CheckBoxOutlineBlankIcon')
        ).toBeInTheDocument();
      });

      it('should render check box icon because the event-collection-complete FF is on, the event type is TRAINING_SESSION and eventCollectionComplete is true - month', () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.dayGridMonth,
            trainingSessionCompleteEventArg
          )
        );
        expect(screen.getByTestId('CheckBoxIcon')).toBeInTheDocument();
      });

      it('should render check box icon because the event-collection-complete FF is on, the event type is GAME and eventCollectionComplete is true - month', () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.dayGridMonth,
            gameCompleteEventArg
          )
        );
        expect(screen.getByTestId('CheckBoxIcon')).toBeInTheDocument();
      });

      it('should render check box blank icon because the event-collection-complete FF is on, the event type is TRAINING_SESSION and eventCollectionComplete is false - month', () => {
        render(
          getEventContent(
            calendarViewOptionEnumLike.dayGridMonth,
            trainingSessionEventArg
          )
        );

        expect(
          screen.getByTestId('CheckBoxOutlineBlankIcon')
        ).toBeInTheDocument();
      });

      it('should render check box blank icon because the event-collection-complete FF is on, the event type is GAME and eventCollectionComplete is false - month', () => {
        render(
          getEventContent(calendarViewOptionEnumLike.dayGridMonth, gameEventArg)
        );

        expect(
          screen.getByTestId('CheckBoxOutlineBlankIcon')
        ).toBeInTheDocument();
      });
    });
  });
});
