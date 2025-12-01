import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import moment from 'moment';
import $ from 'jquery';

import { data } from '@kitman/services/src/mocks/handlers/planningHub/getEvents';
import { setupStore } from '@kitman/modules/src/AppRoot/store';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';

import { useGetEventsQuery, INITIAL_FILTERS } from '../eventSwitchApi';

describe('eventSwitchApi', () => {
  const AppReduxWrapper = ({ children }) => (
    <Provider store={setupStore()}>{children}</Provider>
  );

  describe('useGetEventsQuery', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('without repeating events', () => {
      beforeEach(() => {
        jest
          .spyOn($, 'ajax')
          .mockImplementation(() => $.Deferred().resolve(data));
        window.setFlag('repeat-events', false);
        window.setFlag('repeat-sessions', false);
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('should return a list of events including repeating event types when FFs are truthy', async () => {
        const { result, waitForNextUpdate } = renderHook(
          () =>
            useGetEventsQuery({
              filters: INITIAL_FILTERS,
              next_id: null,
            }),
          { wrapper: AppReduxWrapper }
        );

        await waitForNextUpdate();

        await waitFor(() =>
          expect(result.current.data.events).toEqual(
            data.events?.map((event) => ({
              ...event,
              id: event.id.toString(),
              isVirtualEvent: false,
              start_date: moment(event.start_date).format(dateTransferFormat),
            }))
          )
        );
        expect(result.current.data.events).toHaveLength(data.events.length);
      });
    });

    describe('with repeating events', () => {
      const rruleInstances = [
        '20211023T111334Z',
        '20211025T111334Z',
        '20211027T111334Z',
      ];
      const eventDataWithRepeatingEvents = {
        ...data,
        events: data.events.map((event) => ({
          ...event,
          ...(event.type === 'session_event'
            ? {
                recurrence: {
                  ...event.recurrence,
                  rule: 'FREQ=WEEKLY;BYDAY=TH',
                  rrule_instances: rruleInstances,
                },
              }
            : event.recurrence),
        })),
      };

      beforeEach(() => {
        jest
          .spyOn($, 'ajax')
          .mockImplementation(() =>
            $.Deferred().resolve(eventDataWithRepeatingEvents)
          );
        window.setFlag('repeat-events', true);
        window.setFlag('repeat-sessions', true);
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('should return a list of events including repeating event types when FFs are truthy', async () => {
        const { result, waitForNextUpdate } = renderHook(
          () =>
            useGetEventsQuery({
              filters: INITIAL_FILTERS,
              next_id: null,
            }),
          { wrapper: AppReduxWrapper }
        );

        await waitForNextUpdate();

        await waitFor(() =>
          expect(result.current.data.events).toHaveLength(
            data.events.length + (rruleInstances.length - 1) // first event of instances is parent
          )
        );
      });
    });
  });
});
