// @flow
import type { Response } from '.';

const mock: Response = [
  {
    id: 2,
    game_contact_role_id: 2,
    game_contact_role: {
      id: 2,
      name: 'MLS Competition Contact',
      gameday_role: 'required',
      gameday_role_kind: 'league_contact',
      gameday_role_order: 2,
    },
    game_contact_id: 2,
    game_contact: {
      id: 2,
      name: 'John Smith',
      email: 'jsmith@kitmanlabs.com',
      phone_number: '+447366141129',
      dmn: true,
      dmr: false,
    },
    order: 0,
    tv_channel_id: 1,
  },
  {
    id: 3,
    game_contact_role_id: 1,
    game_contact_role: {
      id: 1,
      name: 'Match Director',
      gameday_role: 'required',
      gameday_role_kind: 'league_contact',
      gameday_role_order: 1,
    },
    game_contact_id: 12,
    game_contact: {
      id: 12,
      name: 'Noah Wright',
      email: 'nwright@kitmanlabs.com',
      phone_number: '+447366141139',
      dmn: true,
      dmr: false,
    },
    order: 1,
    tv_channel_id: 2,
  },
];

export default mock;
