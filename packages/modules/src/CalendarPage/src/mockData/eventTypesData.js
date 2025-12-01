// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type {
  EventCategory,
  EventGroup,
  CalendarBaseEvent,
} from '../components/CalendarEventsPanel/types';

const gameEvents: Array<CalendarBaseEvent> = [
  {
    name: 'Home',
    allDay: false,
    templateId: 'game_home',
    type: 'game_event',
    venue_type: {
      id: 1,
    },
  },
  {
    name: 'Away',
    allDay: false,
    templateId: 'game_away',
    type: 'game_event',
    venue_type: {
      id: 2,
    },
  },
];

const gameCategory: EventCategory = {
  defaultDurationMins: 60,
  defaultStartTime: '09:30:00',
  displayName: null,
  events: gameEvents,
  id: 1,
};

const generalTrainingSesssionCategory: EventCategory = {
  defaultDurationMins: 60,
  defaultStartTime: '09:30:00',
  displayName: null,
  events: [],
  id: 2,
};

const eventTypesData: Array<EventGroup> = [
  {
    displayName: i18n.t('Game'),
    id: 'game',
    categories: [gameCategory],
  },
  {
    displayName: i18n.t('Training Session'),
    id: 'training_session',
    categories: [generalTrainingSesssionCategory],
  },
];

export default eventTypesData;
