// @flow
import { orderPlayersByGroupAndPositionAndId } from '../utils';

export const mockAthleteEventsAthleteData = [
  {
    id: 1,
    user_id: 1,
    firstname: 'John',
    lastname: 'Doe',
    fullname: 'John Doe',
    shortname: 'J. Doe',
    availability: 'available',
    avatar_url: 'avatar_url',
    position: {
      id: 3,
      name: 'Forward',
      order: 1,
      abbreviation: '',
      position_group: {
        id: 2,
        name: 'Forward Group',
        order: 1,
      },
    },
  },
  {
    id: 2,
    user_id: 2,
    firstname: 'John',
    lastname: 'Doe',
    fullname: 'John Doe',
    shortname: 'J. Doe',
    availability: 'available',
    avatar_url: 'avatar_url',
    position: {
      id: 3,
      name: 'Forward',
      abbreviation: '',
      order: 2,
      position_group: {
        id: 2,
        name: 'Forward Group',
        order: 2,
      },
    },
  },
  {
    id: 3,
    user_id: 3,
    firstname: 'John',
    lastname: 'Doe',
    fullname: 'John Doe',
    shortname: 'J. Doe',
    availability: 'available',
    avatar_url: 'avatar_url',
    position: {
      id: 3,
      name: 'Forward',
      abbreviation: '',
      order: 2,
      position_group: {
        id: 2,
        name: 'Center',
        order: 3,
      },
    },
  },
];

export const mockOrderedPlayerData = [
  ...orderPlayersByGroupAndPositionAndId(mockAthleteEventsAthleteData),
];
