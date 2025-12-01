// @flow
export default {
  id: 1,
  updates: {
    active: true,
    organisation_id: 1,
    squad_ids: [1, 2, 3],
    name: 'new name',
    primary_color: '',
    secondary_color: '',
    archived: false,
    kit_matrix_items: [
      {
        kind: 'shorts',
        kit_matrix_color_id: 1,
        attachment: {
          url: 'url',
          name: 'name',
          type: 'image/jpg',
        },
      },
    ],
    league_season_id: 1,
  },
};
