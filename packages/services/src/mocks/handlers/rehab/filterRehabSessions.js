import { rest } from 'msw';

const data = [
  {
    id: 8,
    start_time: '2022-11-26T12:00:00+00:00',
    end_time: '2022-11-26T12:00:00+00:00',
    timezone: 'Europe/Dublin',
    title: 'General',
    sections: [
      {
        id: 8,
        title: 'General',
        theme_color: null,
        order_index: 1,
        exercise_instances: [
          {
            id: 2,
            exercise_template_id: 78,
            exercise_name: '3 Way SLR',
            variations: [
              {
                key: 'duration',
                parameters: [
                  {
                    key: 'duration',
                    value: '5444',
                    config: {
                      unit: 'min',
                    },
                  },
                ],
              },
              {
                key: 'sets_reps_distance',
                parameters: [
                  {
                    key: 'distance',
                    value: '66576',
                    config: {
                      unit: 'ft',
                    },
                  },
                  {
                    key: 'reps',
                    value: '155',
                    config: {},
                  },
                  {
                    key: 'sets',
                    value: '1',
                    config: {},
                  },
                ],
              },
              {
                key: 'sets_reps_distance',
                parameters: [
                  {
                    key: 'distance',
                    value: '1',
                    config: {
                      unit: 'ft',
                    },
                  },
                  {
                    key: 'reps',
                    value: '1',
                    config: {},
                  },
                  {
                    key: 'sets',
                    value: '1',
                    config: {},
                  },
                ],
              },
            ],
            comment: 'dfgdfdf',
            order_index: 1,
            section_id: 8,
            session_id: 8,
            tags: [
              {
                id: 4,
                theme_colour: '#2586ff',
                name: 'Cool down',
              },
            ],
          },
          {
            id: 3,
            exercise_template_id: 56,
            exercise_name: '3 Way Band Walks',
            variations: [
              {
                key: 'sets_reps_distance',
                parameters: [
                  {
                    key: 'distance',
                    value: '1',
                    config: {
                      unit: 'ft',
                    },
                  },
                  {
                    key: 'reps',
                    value: '1',
                    config: {},
                  },
                  {
                    key: 'sets',
                    value: '1',
                    config: {},
                  },
                ],
              },
            ],
            comment: null,
            order_index: 2,
            section_id: 8,
            session_id: 8,
            tags: [
              {
                id: 5,
                theme_colour: '#2586ff',
                name: 'Warm up & stetch',
              },
            ],
          },
        ],
      },
    ],
    annotations: [],
    constraints: {
      read_only: false,
    },
  },
  {
    id: 5,
    start_time: '2022-11-27T12:00:00+00:00',
    end_time: '2022-11-27T12:00:00+00:00',
    timezone: 'Europe/Dublin',
    title: 'General',
    sections: [
      {
        id: 5,
        title: 'General',
        theme_color: null,
        order_index: 1,
        exercise_instances: [
          {
            id: 11,
            exercise_template_id: 59,
            exercise_name: 'Active Stretch',
            variations: [
              {
                key: 'duration',
                parameters: [
                  {
                    key: 'duration',
                    value: '5',
                    config: {
                      unit: 'min',
                    },
                  },
                ],
              },
            ],
            comment: null,
            order_index: 1,
            section_id: 5,
            session_id: 5,
            tags: [
              {
                id: 6,
                theme_colour: '#2583ff',
                name: 'Stretch',
              },
            ],
          },
          {
            id: 12,
            exercise_template_id: 59,
            exercise_name: 'Active Stretch',
            variations: [
              {
                key: 'duration',
                parameters: [
                  {
                    key: 'duration',
                    value: '5',
                    config: {
                      unit: 'min',
                    },
                  },
                ],
              },
            ],
            comment: null,
            order_index: 2,
            section_id: 5,
            session_id: 5,
            tags: [
              {
                id: 8,
                theme_colour: '#2586ff',
                name: 'Strength',
              },
            ],
          },
          {
            id: 13,
            exercise_template_id: 80,
            exercise_name: '1/2 Kneeling Ankle Mobility',
            variations: [
              {
                key: 'sets_reps',
                parameters: [
                  {
                    key: 'reps',
                    value: '1',
                    config: {},
                  },
                  {
                    key: 'sets',
                    value: '1',
                    config: {},
                  },
                ],
              },
            ],
            comment: null,
            order_index: 3,
            section_id: 5,
            session_id: 5,
            tags: [
              {
                id: 9,
                theme_colour: '#2589ff',
                name: 'Warm down conditioning',
              },
            ],
          },
        ],
      },
    ],
    annotations: [],
    constraints: {
      read_only: false,
    },
  },
  {
    id: 16,
    start_time: '2022-11-28T12:00:00+00:00',
    end_time: '2022-11-28T12:00:00+00:00',
    timezone: 'Europe/Dublin',
    title: 'General',
    sections: [
      {
        id: 16,
        title: 'General',
        theme_color: null,
        order_index: 1,
        exercise_instances: [
          {
            id: 9,
            exercise_template_id: 78,
            exercise_name: '3 Way SLR',
            variations: [
              {
                key: 'sets_reps',
                parameters: [
                  {
                    key: 'reps',
                    value: '1',
                    config: {},
                  },
                  {
                    key: 'sets',
                    value: '1',
                    config: {},
                  },
                ],
              },
            ],
            comment: null,
            order_index: 1,
            section_id: 16,
            session_id: 16,
            tags: [
              {
                id: 1,
                theme_colour: '#2586ff',
                name: 'Warm up',
              },
            ],
          },
        ],
      },
    ],
    annotations: [],
    constraints: {
      read_only: false,
    },
  },
  {
    id: 17,
    start_time: '2022-11-29T12:00:00+00:00',
    end_time: '2022-11-29T12:00:00+00:00',
    timezone: 'Europe/Dublin',
    title: 'General',
    sections: [
      {
        id: 17,
        title: 'General',
        theme_color: null,
        order_index: 1,
        exercise_instances: [
          {
            id: 7,
            exercise_template_id: 29,
            exercise_name: '4 Way Ankle',
            variations: [
              {
                key: 'duration_time',
                parameters: [
                  {
                    key: 'duration',
                    value: '5',
                    config: {
                      unit: 'min',
                    },
                  },
                  {
                    key: 'time',
                    value: '1',
                    config: {
                      unit: 'min',
                    },
                  },
                ],
              },
            ],
            comment: null,
            order_index: 1,
            section_id: 17,
            session_id: 17,
            tags: [
              {
                id: 2,
                theme_colour: '#2586ff',
                name: 'Warm up',
              },
            ],
          },
        ],
      },
    ],
    annotations: [],
    constraints: {
      read_only: false,
    },
  },
  {
    id: 18,
    start_time: '2022-11-30T12:00:00+00:00',
    end_time: '2022-11-30T12:00:00+00:00',
    timezone: 'Europe/Dublin',
    title: 'General',
    sections: [
      {
        id: 18,
        title: 'General',
        theme_color: null,
        order_index: 1,
        exercise_instances: [
          {
            id: 10,
            exercise_template_id: 81,
            exercise_name: '4 Way Ankle Theraband',
            variations: [
              {
                key: 'sets_reps',
                parameters: [
                  {
                    key: 'reps',
                    value: '1',
                    config: {},
                  },
                  {
                    key: 'sets',
                    value: '1',
                    config: {},
                  },
                ],
              },
            ],
            comment: null,
            order_index: 1,
            section_id: 18,
            session_id: 18,
            tags: [
              {
                id: 3,
                theme_colour: '#2586ff',
                name: 'Warm down',
              },
            ],
          },
        ],
      },
    ],
    annotations: [],
    constraints: {
      read_only: false,
    },
  },
];

const handler = rest.post(
  '/ui/medical/rehab/sessions/filter',
  (req, res, ctx) => res(ctx.json(data.slice(1, 4)))
);

export { handler, data };
