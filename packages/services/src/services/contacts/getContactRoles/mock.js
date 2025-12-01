// @flow
import type { ContactRole } from '@kitman/modules/src/Contacts/shared/types';

const mock: Array<ContactRole> = [
  {
    id: 1,
    name: 'Match Director',
    gameday_role: 'required',
    gameday_role_kind: 'home_contact',
    gameday_role_order: 1,
  },
  {
    id: 2,
    name: 'MLS Competition Contact',
    gameday_role: 'required',
    gameday_role_kind: 'home_contact',
    gameday_role_order: 2,
  },
  {
    id: 3,
    name: 'MLS Operations Contac',
    gameday_role: 'optional',
    gameday_role_kind: 'home_contact',
    gameday_role_order: 3,
  },
  {
    id: 4,
    name: 'Home Team Contact',
    gameday_role: 'optional',
    gameday_role_kind: 'home_contact',
    gameday_role_order: 4,
  },
];

export const transformedContactRoles = [
  {
    id: 1,
    role: 'Match Director',
    __reorder__: 'Match Director',
    required: true,
    kind: 'league_contact',
    order: 1,
  },
  {
    id: 2,
    role: 'MLS Competition Contact',
    __reorder__: 'MLS Competition Contact',
    required: true,
    kind: 'league_contact',
    order: 2,
  },
  {
    id: 3,
    role: 'MLS Operations Contact',
    __reorder__: 'MLS Operations Contact',
    required: false,
    kind: 'league_contact',
    order: 3,
  },
  {
    id: 4,
    role: 'Home Team Contact',
    __reorder__: 'Home Team Contact',
    required: false,
    kind: 'home_contact',
    order: 4,
  },
];

export default mock;
