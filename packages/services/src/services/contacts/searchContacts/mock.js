// @flow
import type { SearchResponse } from '.';

const mock: SearchResponse = {
  game_contacts: [
    {
      id: 1,
      name: 'Gordon Morales',
      title: 'Assistant & Goalkeeper Coach',
      organisation_id: 1,
      tv_channel_id: 1,
      organisation: {
        id: 1,
        name: 'Atlanta United FC',
        logo_full_path: '',
      },
      game_contact_roles: [
        {
          id: 1,
          name: 'MLS Competition Contact',
          gameday_role: 'required',
          gameday_role_kind: 'league_contact',
          gameday_role_order: 1,
        },
      ],
      phone_number: '+4444444444',
      email: 'john@gmail.com',
      dmn: true,
      dmr: false,
      status: 'pending',
      status_description: 'note',
    },
    {
      id: 2,
      name: 'Anna Smith',
      title: null,
      organisation_id: 2,
      tv_channel_id: 2,
      organisation: {
        id: 2,
        name: 'Los Angeles Galaxy',
        logo_full_path: '',
      },
      game_contact_roles: [
        {
          id: 1,
          name: 'Team Manager',
          gameday_role: 'optional',
          gameday_role_kind: 'home_contact',
          gameday_role_order: 2,
        },
      ],
      phone_number: '+5555555555',
      email: 'anna.smith@gmail.com',
      dmn: true,
      dmr: false,
      status: 'rejected',
      status_description: 'note',
    },
    {
      id: 3,
      name: 'Michael Johnson',
      organisation_id: 3,
      tv_channel_id: 3,
      title: null,
      organisation: {
        id: 3,
        name: 'New York Red Bulls',
        logo_full_path: '',
      },
      game_contact_roles: [
        {
          id: 1,
          name: 'Coach',
          gameday_role: 'optional',
          gameday_role_kind: 'away_contact',
          gameday_role_order: 3,
        },
      ],
      phone_number: '+6666666666',
      email: 'michael.johnson@gmail.com',
      dmr: true,
      dmn: false,
      status: 'pending',
      status_description: 'note',
    },
  ],
  next_id: null,
};

export default mock;
