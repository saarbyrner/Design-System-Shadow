import { screen, render, waitFor } from '@testing-library/react';
import moment from 'moment';

import { server, rest } from '@kitman/services/src/mocks/server';
import { data as mockEventsData } from '@kitman/services/src/mocks/handlers/planningHub/getEvents';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import EventsSchedule from '..';
import style from '../style';

describe('EventsSchedule component', () => {
  const props = {
    eventFilters: {
      dateRange: {
        start_date: '',
        end_date: '',
      },
      eventTypes: [],
      competitions: [],
      gameDays: [],
      oppositions: [],
    },
    orgTimezone: 'Europe/Dublin',
    t: i18nextTranslateStub(),
  };

  const waitForLoadingRemoval = async () => {
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  };

  const checkTablesFirstRowConsistentCells = () => {
    expect(
      screen.getByRole('cell', {
        name: '90 mins',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'Champions League' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', {
        name: 'U16 Opponent Squad 1 (Home), Champions League',
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('link', {
        name: 'U16 Opponent Squad 1 (Home), Champions League',
      })
    ).toHaveAttribute('href', '/planning_hub/events/1');
  };

  describe('when there is no event', () => {
    beforeEach(() => {
      server.use(
        rest.post('/planning_hub/events/search', (req, res, ctx) =>
          res(ctx.json({ events: [], next_id: null }))
        )
      );
    });

    it('renders an empty list text when there are no events', async () => {
      render(<EventsSchedule {...props} />);
      await waitForLoadingRemoval();

      expect(
        screen.getByText('No events scheduled for this period')
      ).toBeInTheDocument();
    });
  });

  describe('when there are events and events are valid', () => {
    describe('when the standard-date-formatting flag is off', () => {
      beforeEach(() => {
        window.featureFlags['standard-date-formatting'] = false;
        jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));
      });

      it('renders the list of events grouped by date', async () => {
        render(<EventsSchedule {...props} />);
        await waitForLoadingRemoval();
        expect(
          screen.getByRole('columnheader', {
            name: '23 Oct, Sat',
          })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('cell', {
            name: '12:02 pm - 1:32 pm',
          })
        ).toBeInTheDocument();
        checkTablesFirstRowConsistentCells();
      });

      it('greys out events in the past', async () => {
        render(<EventsSchedule {...props} />);
        await waitForLoadingRemoval();

        expect(
          screen.getAllByTestId('planningEventsSchedule__row')[0]
        ).toHaveClass('planningEventsSchedule__row--past');
      });
    });

    describe('when the standard-date-formatting flag is on', () => {
      beforeEach(() => {
        window.featureFlags['standard-date-formatting'] = true;
      });

      afterEach(() => {
        window.featureFlags['standard-date-formatting'] = false;
      });

      it('renders the list of events grouped by date', async () => {
        render(<EventsSchedule {...props} />);

        await waitForLoadingRemoval();
        expect(
          screen.getByRole('columnheader', {
            name: 'Oct 23, 2021',
          })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('cell', {
            name: '12:02 PM - 1:32 PM',
          })
        ).toBeInTheDocument();
        checkTablesFirstRowConsistentCells();
      });
    });
  });

  describe('when there are mls events', () => {
    beforeEach(() => {
      server.use(
        rest.post('/planning_hub/events/search', (req, res, ctx) =>
          res(
            ctx.json({
              events: [
                {
                  ...mockEventsData.events[0],
                  id: 37197,
                  type: 'game_event',
                  mls_game_key: 'mls-2554405',
                },
              ],
              next_id: null,
            })
          )
        )
      );
    });

    it('renders out the mls_game_key specifically', async () => {
      render(<EventsSchedule {...props} />);
      await waitForLoadingRemoval();

      expect(
        screen.getByRole('cell', {
          name: '2554405',
        })
      ).toBeInTheDocument();
    });
  });

  describe('when there is an event today', () => {
    beforeEach(() => {
      server.use(
        rest.post('/planning_hub/events/search', (req, res, ctx) =>
          res(
            ctx.json({
              events: [
                {
                  ...mockEventsData.events[0],
                  start_date: moment(),
                },
              ],
              next_id: null,
            })
          )
        )
      );
    });

    it('highlights the current date', async () => {
      render(<EventsSchedule {...props} />);
      await waitForLoadingRemoval();

      expect(
        screen.getAllByTestId('planningEventsSchedule__row')[0]
      ).toHaveClass('planningEventsSchedule__row--today');
    });
  });

  describe('when event-collection-complete is on', () => {
    beforeEach(() => {
      server.use(
        rest.post('/planning_hub/events/search', (req, res, ctx) =>
          res(
            ctx.json({
              events: [
                {
                  ...mockEventsData.events[0],
                  event_collection_complete: true,
                },
              ],
              next_id: null,
            })
          )
        )
      );
      window.setFlag('event-collection-complete', true);
    });

    it('corretly displays the "Complete" chip when event is marked as complete', async () => {
      render(<EventsSchedule {...props} />);
      await waitForLoadingRemoval();
      expect(
        screen.getByRole('cell', {
          name: 'Complete',
        })
      ).toBeInTheDocument();
      expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      server.use(
        rest.post('/planning_hub/events/search', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
    });

    it('shows an error message', async () => {
      render(<EventsSchedule {...props} events={[]} />);

      await waitForLoadingRemoval();
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: 'Go back and try again',
        })
      ).toBeInTheDocument();
    });
  });

  describe('repeating events', () => {
    describe.each([
      { flags: ['repeat-events', 'custom-events'], type: 'custom_event' },
      { flags: ['repeat-sessions'], type: 'session_event' },
    ])('repeating $type', ({ flags, type }) => {
      beforeEach(() => {
        server.use(
          rest.post('/planning_hub/events/search', (req, res, ctx) =>
            res(
              ctx.json({
                events: [
                  {
                    ...mockEventsData.events[0],
                    type,
                    session_type:
                      type === 'session_event'
                        ? { name: 'Running' }
                        : undefined,
                    local_timezone: 'UTC',
                  },
                ],
                next_id: null,
              })
            )
          )
        );
      });

      describe('is on', () => {
        beforeEach(() => {
          flags.forEach((flag) => {
            window.setFlag(flag, true);
          });
        });

        it('shows repeated event info with the correct styles and href', async () => {
          render(<EventsSchedule {...props} />);
          await waitForLoadingRemoval();

          const repeatedEventInfo = screen.getByText(
            'Every Monday, Tuesday, until 29th June, 2024'
          );

          expect(repeatedEventInfo).toBeInTheDocument();
          expect(repeatedEventInfo).toHaveStyle(style.repeatedEventInfo);

          const repeatedEventIcon = screen.getByTestId('SyncOutlinedIcon');

          expect(repeatedEventIcon).toBeInTheDocument();
          expect(repeatedEventIcon).toHaveStyle(style.repeatedEventIcon);

          expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            '/planning_hub/events/1?include_rrule_instance=true'
          );
        });
      });

      describe('is off', () => {
        it('doesn’t show repeated event info', async () => {
          render(<EventsSchedule {...props} />);
          await waitForLoadingRemoval();

          expect(
            screen.queryByText('Every Monday, Tuesday, until 30th June, 2024')
          ).not.toBeInTheDocument();
        });
      });
    });
  });
});
