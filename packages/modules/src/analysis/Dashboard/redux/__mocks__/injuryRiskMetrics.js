/* eslint-disable flowtype/require-valid-file-annotation */
export default [
  {
    archived: false,
    created_at: '2021-04-21T14:28:27Z',
    created_by: { id: 1236, fullname: "Stuart O'Brien" },
    date_range: {
      start_date: '2020-10-21T14:28:27Z',
      end_date: '2021-04-21T14:28:27Z',
    },
    filter: {
      exposure_types: ['game', 'training_session'],
      mechanisms: ['contact', 'non_contact'],
      osics_group_identifiers: ['all_injuries'],
    },
    last_prediction_status: 'completed',
    name: 'Testing 20210421142827',
    snapshot: {
      filter: {
        exposure_types: ['game', 'training_session'],
        mechanisms: ['contact', 'non_contact'],
        osics_group_identifiers: ['all_injuries'],
      },
      summary: {
        date_range: {
          end_date: '2021-04-21T14:28:27Z',
          start_date: '2020-10-21T14:28:27Z',
        },
        graph_group: 'summary_bar',
        metrics: [
          {
            series: [
              {
                datapoints: [
                  { name: 'Oct', y: 0 },
                  { name: 'Nov', y: 1 },
                  { name: 'Dec', y: 5 },
                  { name: 'Jan', y: 5 },
                  { name: 'Feb', y: 5 },
                  { name: 'Mar', y: 0 },
                  { name: 'Apr', y: null },
                ],
                name: 'No of injuries',
              },
            ],
            type: 'metric',
          },
        ],
      },
      value: {
        date_range: {
          end_date: '2021-04-21T14:28:27Z',
          start_date: '2020-10-21T14:28:27Z',
        },
        graph_group: 'value_visualisation',
        metrics: [
          {
            series: [
              {
                name: 'Total Injuries',
                population_id: null,
                population_type: null,
                value: 16,
              },
            ],
            type: 'metric',
          },
        ],
      },
    },
    status: 'completed',
    alarm_threshold: 36.2747,
    variable_uuid: 'ac233802-0c07-4923-8523-8e3da7fa995e',
    id: 2,
  },
];
