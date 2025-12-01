const genDisciplinaryIssue = (params) => {
  return {
    user_id: 1,
    firstname: 'Roy',
    lastname: 'Keane',
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
    organisations: [
      {
        id: 1267,
        name: 'KL Galaxy',
        logo_full_path:
          'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
      },
    ],
    squads: [
      {
        id: 1,
        name: 'U13',
      },
    ],
    jersey_number: 16,
    disciplinary_issues: [
      {
        type: 'red_card',
        count: 3,
        division: {
          id: 1,
          association_id: 1,
          name: 'KLS',
        },
      },
      {
        type: 'yellow_card',
        count: 8,
        division: {
          id: 1,
          association_id: 1,
          name: 'KLS',
        },
      },
    ],

    ...params,
  };
};

export const data = [
  genDisciplinaryIssue({
    firstname: 'Roy',
    lastname: 'Keane',
    jersey_number: 16,
    user_id: 16,
    disciplinary_issues: [],
    total_disciplines: 0,
    active_discipline_end_date: null,
    discipline_status: 'Eligible',
    suspensions: [],
    active_discipline: null,
  }),
  genDisciplinaryIssue({
    firstname: 'Vinnie',
    lastname: 'Jones',
    jersey_number: 4,
    user_id: 4,
    total_disciplines: 1,
    active_discipline_end_date: '2024-06-15 00:00:00',
    discipline_status: 'Suspended',
    active_discipline: null,
  }),
  genDisciplinaryIssue({
    firstname: 'Patrick',
    lastname: 'Viera',
    jersey_number: 4,
    user_id: 44,
    total_disciplines: 3,
    active_discipline_end_date: '2024-06-27 00:00:00',
    discipline_status: 'Suspended',
    active_discipline: null,
    number_of_active_disciplines: 1,
  }),
  genDisciplinaryIssue({
    firstname: 'Test',
    lastname: 'Test',
    jersey_number: 5,
    user_id: 5,
    disciplinary_issues: [],
    total_disciplines: 0,
    active_discipline_end_date: null,
    discipline_status: 'Suspended',
    active_discipline: null,
    number_of_active_disciplines: 5,
  }),
  genDisciplinaryIssue({
    firstname: 'Test',
    lastname: 'Test',
    jersey_number: 5,
    user_id: 5,
    disciplinary_issues: [],
    total_disciplines: 0,
    active_discipline_end_date: null,
    discipline_status: 'Suspended',
    active_discipline: {
      kind: 'number_of_games',
      number_of_games: 2,
    },
    number_of_active_disciplines: 1,
  }),
];
export const meta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 2,
};

export const response = {
  data,
  meta,
};
