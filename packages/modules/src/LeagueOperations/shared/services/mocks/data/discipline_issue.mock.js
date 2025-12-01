export const emptyIssue = {
  user_id: null,
  reason_ids: [],
  competition_ids: [],
  start_date: null,
  end_date: null,
  note: '',
  kind: 'date_range',
  squad_id: null,
  number_of_games: null,
};

export const issue = {
  user_id: 1,
  reason_ids: [1],
  competition_ids: [1],
  start_date: '2024-10-19T00:00:00-05:00',
  end_date: '2024-11-19T00:00:00-05:00',
  note: 'This is my note',
  kind: 'date_range',
  squad_id: null,
  number_of_games: null,
};

export const activeIssue = {
  id: 1,
  ...issue,
};

export const profile = {
  user_id: 1,
  name: 'John Doe',
};
