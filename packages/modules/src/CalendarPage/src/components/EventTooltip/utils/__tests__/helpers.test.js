import { VIRTUAL_EVENT_ID_SEPARATOR } from '@kitman/common/src/consts/events';
import { calendarEventTypeEnumLike } from '@kitman/components/src/Calendar/utils/enum-likes';
import { creatableEventTypeEnumLike } from '@kitman/modules/src/PlanningEventSidePanel/src/enumLikes';

import { createPlanningEventUrl } from '../helpers';

describe('helpers', () => {
  describe('createPlanningEventUrl', () => {
    const event = {
      id: '1',
      start: '2024-03-21T09:00:00Z',
      url: '/planning_hub/events/1',
    };

    it('should create the URL without original start time or include_rrule_instances - FFs are off', () => {
      const url = createPlanningEventUrl(event);
      expect(url).toEqual(event.url);
    });

    it('should create the url with open_event_switcher_panel if passed', () => {
      const url = createPlanningEventUrl({
        ...event,
        openEventSwitcherSidePanel: true,
      });
      expect(url).toEqual(`${event.url}?open_event_switcher_panel=true`);
    });

    it('should create the url with hash if passed', () => {
      const url = createPlanningEventUrl({
        ...event,
        openEventSwitcherSidePanel: true,
        hash: 'collection',
      });
      expect(url).toEqual(
        `${event.url}?open_event_switcher_panel=true#collection`
      );
    });

    describe('with the repeat-events FF on', () => {
      beforeEach(() => {
        window.featureFlags['repeat-events'] = true;
      });

      afterEach(() => {
        window.featureFlags['repeat-events'] = false;
      });

      it('should create the URL without original start time but with include_rrule_instances - not a virtual event', () => {
        const url = createPlanningEventUrl(event);
        expect(url).toEqual(event.url);
      });

      it('should create the URL with original start time and include_rrule_instances - a virtual event', () => {
        const url = createPlanningEventUrl({
          ...event,
          id: `1${VIRTUAL_EVENT_ID_SEPARATOR}0`,
          extendedProps: {
            type: calendarEventTypeEnumLike.CustomEvent,
          },
        });
        expect(url).toEqual(
          `${event.url}?include_rrule_instance=true&original_start_time=2024-03-21T09%3A00%3A00.000Z`
        );
      });

      it('should create the URL with original start time and include_rrule_instances - a virtual event from planning_hub', () => {
        const url = createPlanningEventUrl({
          ...event,
          id: `1${VIRTUAL_EVENT_ID_SEPARATOR}0`,
          extendedProps: {
            type: creatableEventTypeEnumLike.CustomEvent,
          },
        });
        expect(url).toEqual(
          `${event.url}?include_rrule_instance=true&original_start_time=2024-03-21T09%3A00%3A00.000Z`
        );
      });
    });

    describe('with the repeat-sessions FF on', () => {
      beforeEach(() => {
        window.setFlag('repeat-sessions', true);
      });

      afterEach(() => {
        window.setFlag('repeat-sessions', false);
      });

      it('should create the URL without original start time but with include_rrule_instances - not a virtual event', () => {
        const url = createPlanningEventUrl(event);
        expect(url).toEqual(event.url);
      });

      it('should create the URL with original start time, include_rrule_instances and transform_event - a virtual session', () => {
        const url = createPlanningEventUrl({
          ...event,
          id: `1${VIRTUAL_EVENT_ID_SEPARATOR}0`,
          extendedProps: {
            type: calendarEventTypeEnumLike.TrainingSession,
          },
        });
        expect(url).toEqual(
          `${event.url}/transform_event?include_rrule_instance=true&original_start_time=2024-03-21T09%3A00%3A00.000Z`
        );
      });

      it('should create the URL with original start time, include_rrule_instances and transform_event - a virtual session from planning_hub', () => {
        const url = createPlanningEventUrl({
          ...event,
          id: `1${VIRTUAL_EVENT_ID_SEPARATOR}0`,
          extendedProps: {
            type: creatableEventTypeEnumLike.Session,
          },
        });
        expect(url).toEqual(
          `${event.url}/transform_event?include_rrule_instance=true&original_start_time=2024-03-21T09%3A00%3A00.000Z`
        );
      });
    });
  });
});
