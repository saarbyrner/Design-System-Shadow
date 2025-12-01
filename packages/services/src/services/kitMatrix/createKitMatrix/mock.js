// @flow

export default {
  kind: 'player',
  organisation_id: 101,
  squads: [1],
  name: 'Home Kit',
  primary_color: `#${'FF5733'}`,
  secondary_color: `#${'C70039'}`,
  kit_matrix_items: [
    {
      kind: 'jersey',
      kit_matrix_color_id: 1,
      attachment: {
        url: 'https://admin.injuryprofiler.com/jersey1.png',
        name: 'jersey1.png',
        type: 'image/png',
      },
    },
    {
      kind: 'shorts',
      kit_matrix_color_id: 2,
      attachment: {
        id: 202,
        url: 'https://admin.injuryprofiler.com/shorts1.png',
        name: 'shorts1.png',
        type: 'image/png',
      },
    },
    {
      kind: 'socks',
      kit_matrix_color_id: 3,
      attachment: {
        id: 203,
        url: 'https://admin.injuryprofiler.com/socks1.png',
        name: 'socks1.png',
        type: 'image/png',
      },
    },
  ],
  division_id: 10,
  league_season_id: 1,
};
