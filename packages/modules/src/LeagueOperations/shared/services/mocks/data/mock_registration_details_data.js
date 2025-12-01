export default {
  data: [
    {
      id: 1,
      status: 'incomplete',
      user_id: 161616,
      user: {
        id: 161616,
        firstname: 'Kayla',
        lastname: 'Collins',
        squads: [
          { id: 111, name: 'U18' },
          { id: 222, name: 'U21' },
        ],
      },
      athlete: {
        id: 12345,
        squad_numbers: ['4', '6'],
        position: {
          id: 1,
          name: 'RW',
        },
      },
      registration_requirement: {
        id: 14,
        active: true,
      },
      registration_system_status: {
        id: 9,
        name: 'Pending League',
        type: 'pending_league',
      },
      division: {
        id: 1,
        name: 'MLS',
      },
    },

    {
      id: null,
      status: 'incomplete',
      user_id: 161488,
      user: {
        id: 161488,
        firstname: 'Memphis',
        lastname: 'Darin',
        squads: [{ id: 333, name: 'U15' }],
      },
      athlete: {
        id: 6789,
        squad_numbers: ['9'],
        position: {
          id: 4,
          name: 'CF',
        },
      },
      registration_requirement: {
        id: 15,
        active: true,
      },
      registration_system_status: null,
      division: {
        id: 2,
        name: 'MLS NEXT Pro',
      },
    },
  ],
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 2,
  },
};
