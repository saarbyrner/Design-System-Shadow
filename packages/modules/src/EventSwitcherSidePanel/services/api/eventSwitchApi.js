// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import moment from 'moment';

import getPlanningHubEvent from '@kitman/modules/src/PlanningHub/src/services/getPlanningHubEvent';
import getEvents from '@kitman/modules/src/PlanningHub/src/services/getEvents';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { addEventRecurrencesForRepeatingEvents } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';

export const INITIAL_FILTERS = {
  dateRange: {
    start_date: '',
    end_date: '',
  },
  eventTypes: [],
  competitions: [],
  gameDays: [],
  oppositions: [],
  areRecurringEventsIncluded: true,
};

export const eventSwitchApi = createApi({
  reducerPath: 'eventSwitchApi',
  endpoints: (builder) => ({
    getPlanningHubEvent: builder.query({
      queryFn: async (args) => {
        const { event: eventData } = await getPlanningHubEvent(args);
        const startDate = eventData?.start_date;
        // return initial filters
        return {
          data: {
            ...INITIAL_FILTERS,
            dateRange: {
              start_date: moment(startDate)
                .subtract(45, 'days')
                .format(DateFormatter.dateTransferFormat),
              end_date: moment(startDate)
                .add(15, 'days')
                .format(DateFormatter.dateTransferFormat),
            },
          },
        };
      },
    }),
    getEvents: builder.query({
      queryFn: serviceQueryFactory(async ({ filters, nextId }) => {
        // $FlowIgnore[incompatible-call] promise will be resolved
        const eventData = await getEvents(filters, nextId);
        return {
          ...eventData,
          events: addEventRecurrencesForRepeatingEvents(eventData?.events)
            .map((event) => {
              const eventToParse = event;
              // Object construction from above util is different to typical event object
              // This ensures that the date properties are aligned for sorting
              if (eventToParse.start) {
                eventToParse.start_date = eventToParse.start;
                // $FlowIgnore[incompatible-type]
                delete eventToParse.start;
              }
              // Ensure that all date formats are consistent to be correctly formatted
              eventToParse.start_date = moment(eventToParse.start_date).format(
                dateTransferFormat
              );
              return eventToParse;
            })
            // $FlowIgnore[incompatible-call] start_date will be defined here
            .sort((a, b) => b.start_date?.localeCompare(a.start_date)),
        };
      }),
      serializeQueryArgs: ({ queryArgs: { filters }, endpointName }) => {
        return `${JSON.stringify(filters)}_${endpointName}`;
      },
      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },
      merge: (currentCache, newItems, meta) => {
        if (meta.arg.nextId) {
          currentCache.events.push(...newItems.events);
          // eslint-disable-next-line no-param-reassign
          currentCache.events = currentCache.events.sort((a, b) =>
            b.start_date.localeCompare(a.start_date)
          );
        } else {
          // eslint-disable-next-line no-param-reassign
          currentCache.events = newItems.events;
        }
      },
    }),
  }),
});

export const { useGetPlanningHubEventQuery, useGetEventsQuery } =
  eventSwitchApi;
