// @flow
export default {
  kit_matrices: [
    {
      id: 1,
      games_count: 1,
      kind: 'player',
      organisation: {
        id: 101,
        name: 'KL Toronto',
        logo_full_path: 'logo_full_path',
      },
      squads: [
        { id: 1, name: 'Squad A' },
        { id: 2, name: 'Squad B' },
      ],
      name: 'Home Kit',
      primary_color: 'FF5733',
      secondary_color: 'C70039',
      division: {
        id: 1,
        name: 'KLS Next',
      },
      kit_matrix_items: [
        {
          kind: 'jersey',
          kit_matrix_color_id: 1,
          kit_matrix_color: {
            id: 1,
            name: 'Blue Navy',
          },
          attachment: {
            id: 201,
            url: 'https://admin.injuryprofiler.com/jersey1.png',
            filename: 'jersey1.png',
            filetype: 'image/png',
          },
        },
        {
          kind: 'shorts',
          kit_matrix_color_id: 2,
          kit_matrix_color: {
            id: 2,
            name: 'Pinky Pink',
          },
          attachment: {
            id: 202,
            url: 'https://admin.injuryprofiler.com/shorts1.png',
            filename: 'shorts1.png',
            filetype: 'image/png',
          },
        },
        {
          kind: 'socks',
          kit_matrix_color_id: 3,
          kit_matrix_color: {
            id: 3,
            name: 'Forest Green',
          },
          attachment: {
            id: 203,
            url: 'https://admin.injuryprofiler.com/socks1.png',
            filename: 'socks1.png',
            filetype: 'image/png',
          },
        },
      ],
      league_season: {
        id: 2,
        name: '25/26 Season',
        start_date: '2025-08-01',
        end_date: '2026-05-31',
        division_id: 3,
      },
      league_season_id: 2,
    },
    {
      id: 2,
      games_count: 0,
      kind: 'player',
      organisation: {
        id: 102,
        name: 'KL Club',
        logo_full_path: 'logo_full_path',
      },
      squads: [{ id: 3, name: 'Squad C' }],
      name: 'Away Kit',
      primary_color: '33FF57',
      archived_at: '2023-10-01',
      division: {
        id: 1,
        name: 'KLS Next',
      },
      kit_matrix_items: [
        {
          kind: 'jersey',
          kit_matrix_color_id: 3,
          kit_matrix_color: {
            id: 3,
            name: 'Forest Green',
          },
          attachment: {
            id: 204,
            url: 'https://admin.injuryprofiler.com/jersey2.png',
            filename: 'jersey2.png',
            filetype: 'image/png',
          },
        },
        {
          kind: 'shorts',
          kit_matrix_color_id: 2,
          kit_matrix_color: {
            id: 2,
            name: 'Pinky Pink',
          },
          attachment: {
            id: 205,
            url: 'https://admin.injuryprofiler.com/shorts2.png',
            filename: 'shorts2.png',
            filetype: 'image/png',
          },
        },
        {
          kind: 'socks',
          kit_matrix_color_id: 1,
          kit_matrix_color: {
            id: 1,
            name: 'Blue Navy',
          },
          attachment: {
            id: 206,
            url: 'https://admin.injuryprofiler.com/socks2.png',
            filename: 'socks2.png',
            filetype: 'image/png',
          },
        },
      ],
      league_season: {
        id: 2,
        name: '25/26 Season',
        start_date: '2025-08-01',
        end_date: '2026-05-31',
        division_id: 3,
      },
      league_season_id: 2,
    },
    {
      id: 3,
      games_count: 0,
      kind: 'goalkeeper',
      organisation: {
        id: 103,
        name: 'KL Galaxy',
        logo_full_path: 'logo_full_path',
      },
      squads: [
        { id: 1, name: 'Squad A' },
        { id: 2, name: 'Squad B' },
        { id: 3, name: 'Squad C' },
      ],
      name: 'Training Kit',
      primary_color: '3357FF',
      secondary_color: '5733FF',
      division: {
        id: 1,
        name: 'KLS Next',
      },
      kit_matrix_items: [
        {
          kind: 'jersey',
          kit_matrix_color_id: 1,
          kit_matrix_color: {
            id: 1,
            name: 'Blue Navy',
          },
          attachment: {
            id: 207,
            url: 'https://admin.injuryprofiler.com/jersey3.png',
            filename: 'jersey3.png',
            filetype: 'image/png',
          },
        },
        {
          kind: 'shorts',
          kit_matrix_color_id: 3,
          kit_matrix_color: {
            id: 3,
            name: 'Forest Green',
          },
          attachment: {
            id: 208,
            url: 'https://admin.injuryprofiler.com/shorts3.png',
            filename: 'shorts3.png',
            filetype: 'image/png',
          },
        },
        {
          kind: 'socks',
          kit_matrix_color_id: 3,
          kit_matrix_color: {
            id: 3,
            name: 'Forest Green',
          },
          attachment: {
            id: 209,
            url: 'https://admin.injuryprofiler.com/socks3.png',
            filename: 'socks3.png',
            filetype: 'image/png',
          },
        },
      ],
      league_season: {
        id: 2,
        name: '25/26 Season',
        start_date: '2025-08-01',
        end_date: '2026-05-31',
        division_id: 3,
      },
      league_season_id: 2,
    },
  ],
  next_id: null,
};
