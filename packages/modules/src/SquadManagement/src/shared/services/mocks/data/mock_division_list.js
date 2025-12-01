export const data = [
  {
    id: 1,
    name: 'MLS Next',
    markers: {
      start_season: '2023-02-17T14:33:01.620Z',
      in_season: '2023-02-15T17:33:01.620Z',
      end_season: '2023-11-03T14:33:01.620Z',
    },
    squads: ['U13', 'U14', 'U15', 'U16', 'U17', 'U19'],
  },
  {
    id: 2,
    name: 'LOI',
    markers: {
      start_season: '2023-02-17T14:33:01.620Z',
      in_season: '2023-02-15T17:33:01.620Z',
      end_season: '2023-11-03T14:33:01.620Z',
    },
    squads: ['LOI Premier division', 'LOI First division'],
  },
  {
    id: 1,
    name: 'Next2',
    markers: {
      start_season: '2024-07-01',
      in_season: '2024-08-01',
      end_season: '2025-06-01',
    },
    squads: ['U9', 'U10', 'U11'],
    child_divisions: [
      {
        id: 7,
        name: 'Conference A',
        child_divisions: [
          { id: 9, name: 'North', child_divisions: [] },
          { id: 10, name: 'South', child_divisions: [] },
          { id: 11, name: 'East', child_divisions: [] },
          { id: 12, name: 'West', child_divisions: [] },
        ],
      },
    ],
  },
];

export const response = data;
