import { rest } from 'msw';

const data = [
  {
    athlete_id: 40211,
    firstname: 'Tomas',
    lastname: 'Albornoz',
    fullname: 'Tomas Albornoz',
    sessions: [
      {
        id: 9,
        start_time: '2023-02-15T12:00:00.000+00:00',
        end_time: '2023-02-15T12:00:00.000+00:00',
        timezone: 'Europe/Dublin',
        title: 'General',
        sections: [
          {
            id: 9,
            title: 'General',
            theme_color: null,
            order_index: 1,
            issues: [
              {
                id: 13899,
                type: 'IllnessOccurrence',
                exercise_instances: [
                  {
                    id: 132,
                    exercise_template_id: 343,
                    exercise_name: '4 Way Ankle Theraband',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '10',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: 'This is a test component',
                    order_index: 1,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 133,
                    exercise_template_id: 291,
                    exercise_name: '4 Way Ankle',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '10',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '20',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: 'Commenty comment',
                    order_index: 2,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 134,
                    exercise_template_id: 318,
                    exercise_name: '3 Way Band Walks',
                    variations: [
                      {
                        key: 'sets_reps_distance',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '10',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                          {
                            key: 'distance',
                            value: '15',
                            config: { unit: 'ft' },
                            order_index: 3,
                            label: 'Distance',
                          },
                        ],
                        label: 'Sets x Reps x Distance',
                      },
                    ],
                    comment: 'Commenty comment again',
                    order_index: 3,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 135,
                    exercise_template_id: 316,
                    exercise_name: 'Active Hamstring Stretch',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '4',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: null,
                    order_index: 4,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 136,
                    exercise_template_id: 320,
                    exercise_name: 'Agility Ladder Drills',
                    variations: [
                      {
                        key: 'duration',
                        parameters: [
                          {
                            key: 'duration',
                            value: '2',
                            config: { unit: 'min' },
                            order_index: 1,
                            label: 'Duration',
                          },
                        ],
                        label: 'Duration',
                      },
                    ],
                    comment: 'Test',
                    order_index: 5,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 137,
                    exercise_template_id: 338,
                    exercise_name: 'Ankle Joint Mobilization',
                    variations: [
                      {
                        key: 'time',
                        parameters: [
                          {
                            key: 'time',
                            value: '10',
                            config: { unit: 'min' },
                            order_index: 1,
                            label: 'Time',
                          },
                        ],
                        label: 'Time',
                      },
                      {
                        key: 'time',
                        parameters: [
                          {
                            key: 'time',
                            value: '2',
                            config: { unit: 'min' },
                            order_index: 1,
                            label: 'Time',
                          },
                        ],
                        label: 'Time',
                      },
                    ],
                    comment: null,
                    order_index: 6,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 138,
                    exercise_template_id: 327,
                    exercise_name: 'Ankle Alphabet',
                    variations: [
                      {
                        key: 'sets',
                        parameters: [
                          {
                            key: 'sets',
                            value: '20',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                        ],
                        label: 'Sets',
                      },
                    ],
                    comment: null,
                    order_index: 7,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 139,
                    exercise_template_id: 379,
                    exercise_name: 'ASLR',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '10',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: null,
                    order_index: 8,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 140,
                    exercise_template_id: 271,
                    exercise_name: 'AROM',
                    variations: [
                      {
                        key: 'range-of-motion',
                        parameters: [
                          {
                            key: 'range-of-motion',
                            value: '20',
                            config: { unit: 'in' },
                            order_index: 1,
                            label: 'Range of motion',
                          },
                        ],
                        label: 'Range of motion',
                      },
                    ],
                    comment: null,
                    order_index: 9,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 141,
                    exercise_template_id: 338,
                    exercise_name: 'Ankle Joint Mobilization',
                    variations: [
                      {
                        key: 'time',
                        parameters: [
                          {
                            key: 'time',
                            value: '10',
                            config: { unit: 'min' },
                            order_index: 1,
                            label: 'Time',
                          },
                        ],
                        label: 'Time',
                      },
                    ],
                    comment: null,
                    order_index: 10,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 142,
                    exercise_template_id: 296,
                    exercise_name: 'Banded TKE',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '10',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '20',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '5',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '20',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: null,
                    order_index: 11,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 111,
                    reason: 'reason val here',
                    comment: null,
                    order_index: 12,
                    section_id: 15,
                    session_id: 15,
                    maintenance: true,
                  },
                ],
                full_pathology: 'Abcess Ankle (excl. Joint) [Left]',
                occurrence_date: '2022-10-05T23:00:00Z',
                body_area: 'Head',
                body_side: 'N/A',
                title: null,
              },
              {
                id: 1,
                type: 'InjuryOccurrence',
                exercise_instances: [
                  {
                    id: 154,
                    exercise_template_id: 356,
                    exercise_name: '4 Way Ankle Bands',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '4',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: null,
                    order_index: 1,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 155,
                    exercise_template_id: 367,
                    exercise_name: '4 Way SLR',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '5',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '10',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: 'Commenty comment',
                    order_index: 2,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 156,
                    exercise_template_id: 316,
                    exercise_name: 'Active Hamstring Stretch',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '10',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: null,
                    order_index: 3,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 157,
                    exercise_template_id: 306,
                    exercise_name: 'Bicep Curls',
                    variations: [
                      {
                        key: 'sets_reps_weight',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '5',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                          {
                            key: 'weight',
                            value: '10',
                            config: { unit: 'lb' },
                            order_index: 3,
                            label: 'Weight',
                          },
                        ],
                        label: 'Sets x Reps x Weight',
                      },
                    ],
                    comment: 'Test test test',
                    order_index: 4,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 158,
                    exercise_template_id: 371,
                    exercise_name: 'Glute Ham Raises',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '5',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '10',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: null,
                    order_index: 5,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 159,
                    exercise_template_id: 308,
                    exercise_name: 'LE Stretching',
                    variations: [
                      {
                        key: 'time',
                        parameters: [
                          {
                            key: 'time',
                            value: '10',
                            config: { unit: 'min' },
                            order_index: 1,
                            label: 'Time',
                          },
                        ],
                        label: 'Time',
                      },
                    ],
                    comment: null,
                    order_index: 6,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 160,
                    exercise_template_id: 278,
                    exercise_name: 'Jump Rope',
                    variations: [
                      {
                        key: 'time',
                        parameters: [
                          {
                            key: 'time',
                            value: '10',
                            config: { unit: 'min' },
                            order_index: 1,
                            label: 'Time',
                          },
                        ],
                        label: 'Time',
                      },
                    ],
                    comment: null,
                    order_index: 7,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                  {
                    id: 161,
                    exercise_template_id: 312,
                    exercise_name: 'Low Back Exercises/Core Work',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '5',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: 'He should do this lightly',
                    order_index: 8,
                    section_id: 9,
                    session_id: 9,
                    maintenance: false,
                  },
                ],
                issue_occurrence_title: 'Injury with title',
                full_pathology: 'ACL graft rupture [Left]',
                occurrence_date: '2023-02-15T00:00:00Z',
                body_area: 'Leg',
                body_side: 'Left',
                title: null,
              },
            ],
            maintenance_exercise_instances: [
              {
                id: 216,
                exercise_template_id: 316,
                exercise_name: 'Active Hamstring Stretch',
                variations: [
                  {
                    key: 'sets_reps',
                    parameters: [
                      {
                        key: 'sets',
                        value: null,
                        config: {},
                        order_index: 1,
                        label: 'Sets',
                      },
                      {
                        key: 'reps',
                        value: null,
                        config: {},
                        order_index: 2,
                        label: 'Reps',
                      },
                    ],
                  },
                ],
                comment: null,
                order_index: 1,
                section_id: 15,
                session_id: 15,
                maintenance: true,
                issue_title: null,
              },
              {
                id: 217,
                exercise_template_id: 329,
                exercise_name: 'Alter G Interval Walk/Run Intervals',
                variations: [
                  {
                    key: 'duration_time',
                    parameters: [
                      {
                        key: 'duration',
                        value: null,
                        config: {
                          unit: 'min',
                        },
                        order_index: 1,
                        label: 'Duration',
                      },
                      {
                        key: 'time',
                        value: null,
                        config: {
                          unit: 'min',
                        },
                        order_index: 2,
                        label: 'Time',
                      },
                    ],
                  },
                ],
                comment: null,
                order_index: 2,
                section_id: 15,
                session_id: 15,
                maintenance: true,
                issue_title: null,
              },

              {
                id: 218,
                exercise_template_id: 358,
                exercise_name: 'Ankle Steamboats (4 Way)',
                variations: [
                  {
                    key: 'sets_reps',
                    parameters: [
                      {
                        key: 'sets',
                        value: null,
                        config: {},
                        order_index: 1,
                        label: 'Sets',
                      },
                      {
                        key: 'reps',
                        value: null,
                        config: {},
                        order_index: 2,
                        label: 'Reps',
                      },
                    ],
                  },
                ],
                comment: null,
                order_index: 3,
                section_id: 15,
                session_id: 15,
                maintenance: true,
                issue_title: null,
              },
              {
                id: 219,
                exercise_template_id: 333,
                exercise_name: 'Band Chest Press',
                variations: [
                  {
                    key: 'sets_reps_weight',
                    parameters: [
                      {
                        key: 'sets',
                        value: null,
                        config: {},
                        order_index: 1,
                        label: 'Sets',
                      },
                      {
                        key: 'reps',
                        value: null,
                        config: {},
                        order_index: 2,
                        label: 'Reps',
                      },
                      {
                        key: 'weight',
                        value: null,
                        config: {
                          unit: 'lb',
                        },
                        order_index: 3,
                        label: 'Weight',
                      },
                    ],
                  },
                ],
                comment: null,
                order_index: 4,
                section_id: 15,
                session_id: 15,
                maintenance: true,
                issue_title: null,
              },
              {
                id: 220,
                exercise_template_id: 311,
                exercise_name: 'Band TKE',
                variations: [
                  {
                    key: 'sets_reps',
                    parameters: [
                      {
                        key: 'sets',
                        value: null,
                        config: {},
                        order_index: 1,
                        label: 'Sets',
                      },
                      {
                        key: 'reps',
                        value: null,
                        config: {},
                        order_index: 2,
                        label: 'Reps',
                      },
                    ],
                  },
                ],
                comment: null,
                order_index: 5,
                section_id: 15,
                session_id: 15,
                maintenance: true,
                issue_title: null,
              },
              {
                id: 221,
                exercise_template_id: 338,
                exercise_name: 'Ankle Joint Mobilization',
                variations: [
                  {
                    key: 'time',
                    parameters: [
                      {
                        key: 'time',
                        value: null,
                        config: {
                          unit: 'min',
                        },
                        order_index: 1,
                        label: 'Time',
                      },
                    ],
                  },
                ],
                comment: null,
                order_index: 6,
                section_id: 15,
                session_id: 15,
                maintenance: true,
                issue_title: null,
              },
              {
                id: 222,
                exercise_template_id: 316,
                exercise_name: 'Active Hamstring Stretch',
                variations: [
                  {
                    key: 'sets_reps',
                    parameters: [
                      {
                        key: 'sets',
                        value: null,
                        config: {},
                        order_index: 1,
                        label: 'Sets',
                      },
                      {
                        key: 'reps',
                        value: null,
                        config: {},
                        order_index: 2,
                        label: 'Reps',
                      },
                    ],
                  },
                ],
                comment: null,
                order_index: 7,
                section_id: 15,
                session_id: 15,
                maintenance: true,
                issue_title: null,
              },
              {
                id: 223,
                exercise_template_id: 318,
                exercise_name: '3 Way Band Walks',
                variations: [
                  {
                    key: 'sets_reps_distance',
                    parameters: [
                      {
                        key: 'sets',
                        value: null,
                        config: {},
                        order_index: 1,
                        label: 'Sets',
                      },
                      {
                        key: 'reps',
                        value: null,
                        config: {},
                        order_index: 2,
                        label: 'Reps',
                      },
                      {
                        key: 'distance',
                        value: null,
                        config: {
                          unit: 'ft',
                        },
                        order_index: 3,
                        label: 'Distance',
                      },
                    ],
                  },
                ],
                comment: null,
                order_index: 8,
                section_id: 15,
                session_id: 15,
                maintenance: true,
                issue_title: null,
              },
              {
                id: 224,
                exercise_template_id: 366,
                exercise_name: 'Adductor Ball Squeeze',
                variations: [
                  {
                    key: 'sets_reps',
                    parameters: [
                      {
                        key: 'sets',
                        value: null,
                        config: {},
                        order_index: 1,
                        label: 'Sets',
                      },
                      {
                        key: 'reps',
                        value: null,
                        config: {},
                        order_index: 2,
                        label: 'Reps',
                      },
                    ],
                  },
                ],
                comment: null,
                order_index: 9,
                section_id: 15,
                session_id: 15,
                maintenance: true,
                issue_title: null,
              },
              {
                id: 225,
                exercise_template_id: 391,
                exercise_name: 'AROM F/E',
                variations: [
                  {
                    key: 'range-of-motion',
                    parameters: [
                      {
                        key: 'range-of-motion',
                        value: null,
                        config: {
                          unit: 'in',
                        },
                        order_index: 1,
                        label: 'Range-of-motion',
                      },
                    ],
                  },
                ],
                comment: null,
                order_index: 10,
                section_id: 15,
                session_id: 15,
                maintenance: true,
                issue_title: null,
              },
            ],
          },
        ],
        annotations: [
          {
            id: 1,
            title: 'Test',
            content:
              '<p>This is a test note with some <strong>bold text</strong></p>',
            created_by: {
              id: 106778,
              fullname: "Ian O'Connor",
            },
            annotation_date: '2023-02-20T00:00:00Z',
          },
          {
            id: 2,
            title: 'Rehab note',
            content:
              '<p>Test Rehab note with <strong>bold text. </strong>And some<em> italic text</em></p>\n<p><br></p>',
            created_by: {
              id: 106778,
              fullname: "Ian O'Connor",
            },
            annotation_date: '2023-02-20T00:00:00Z',
          },
        ],
      },
    ],
  },
  {
    athlete_id: 15642,
    firstname: 'hugo',
    lastname: 'beuzeboc',
    fullname: 'hugo beuzeboc',
    sessions: [
      {
        id: 10,
        start_time: '2023-02-15T12:00:00.000+00:00',
        end_time: '2023-02-15T12:00:00.000+00:00',
        timezone: 'Europe/Dublin',
        title: 'General',
        sections: [
          {
            id: 10,
            title: 'General',
            theme_color: null,
            order_index: 1,
            issues: [
              {
                id: 11531,
                type: 'IllnessOccurrence',
                exercise_instances: [
                  {
                    id: 143,
                    exercise_template_id: 303,
                    exercise_name: 'AAROM',
                    variations: [
                      {
                        key: 'range-of-motion',
                        parameters: [
                          {
                            key: 'range-of-motion',
                            value: '10',
                            config: { unit: 'in' },
                            order_index: 1,
                            label: 'Range of motion',
                          },
                        ],
                        label: 'Range of motion',
                      },
                    ],
                    comment: null,
                    order_index: 1,
                    section_id: 10,
                    session_id: 10,
                    maintenance: false,
                  },
                  {
                    id: 144,
                    exercise_template_id: 305,
                    exercise_name: '4 Way Hip',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '15',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: 'Commenty comment',
                    order_index: 2,
                    section_id: 10,
                    session_id: 10,
                    maintenance: false,
                  },
                  {
                    id: 145,
                    exercise_template_id: 291,
                    exercise_name: '4 Way Ankle',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '10',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: null,
                    order_index: 3,
                    section_id: 10,
                    session_id: 10,
                    maintenance: false,
                  },
                  {
                    id: 146,
                    exercise_template_id: 303,
                    exercise_name: 'AAROM',
                    variations: [
                      {
                        key: 'range-of-motion',
                        parameters: [
                          {
                            key: 'range-of-motion',
                            value: '20',
                            config: { unit: 'in' },
                            order_index: 1,
                            label: 'Range of motion',
                          },
                        ],
                        label: 'Range of motion',
                      },
                    ],
                    comment: null,
                    order_index: 4,
                    section_id: 10,
                    session_id: 10,
                    maintenance: false,
                  },
                  {
                    id: 147,
                    exercise_template_id: 365,
                    exercise_name: 'Ankle CARs',
                    variations: [
                      {
                        key: 'sets',
                        parameters: [
                          {
                            key: 'sets',
                            value: '10',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                        ],
                        label: 'Sets',
                      },
                    ],
                    comment: null,
                    order_index: 5,
                    section_id: 10,
                    session_id: 10,
                    maintenance: false,
                  },
                  {
                    id: 148,
                    exercise_template_id: 275,
                    exercise_name: 'Calf Raises',
                    variations: [
                      {
                        key: 'sets_reps_weight',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '10',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                          {
                            key: 'weight',
                            value: '3',
                            config: { unit: 'lb' },
                            order_index: 3,
                            label: 'Weight',
                          },
                        ],
                        label: 'Sets x Reps x Weight',
                      },
                    ],
                    comment: 'Commenty commenty comment',
                    order_index: 6,
                    section_id: 10,
                    session_id: 10,
                    maintenance: false,
                  },
                ],
                full_pathology: 'Anaemia [N/A]',
                occurrence_date: '2022-06-30T23:00:00Z',
                body_area: 'N/A',
                body_side: 'N/A',
                title: null,
              },
            ],
          },
        ],
        annotations: [],
      },
    ],
  },
  {
    athlete_id: 2942,
    firstname: 'Adam',
    lastname: 'Conway',
    fullname: 'Adam Conway',
    sessions: [
      {
        id: 11,
        start_time: '2023-02-15T12:00:00.000+00:00',
        end_time: '2023-02-15T12:00:00.000+00:00',
        timezone: 'Europe/Dublin',
        title: 'General',
        sections: [
          {
            id: 11,
            title: 'General',
            theme_color: null,
            order_index: 1,
            issues: [
              {
                id: 7855,
                type: 'IllnessOccurrence',
                exercise_instances: [
                  {
                    id: 149,
                    exercise_template_id: 356,
                    exercise_name: '4 Way Ankle Bands',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '2',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '4',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: 'This should work with something',
                    order_index: 1,
                    section_id: 11,
                    session_id: 11,
                    maintenance: false,
                  },
                  {
                    id: 150,
                    exercise_template_id: 303,
                    exercise_name: 'AAROM',
                    variations: [
                      {
                        key: 'range-of-motion',
                        parameters: [
                          {
                            key: 'range-of-motion',
                            value: '5',
                            config: { unit: 'in' },
                            order_index: 1,
                            label: 'Range of motion',
                          },
                        ],
                        label: 'Range of motion',
                      },
                    ],
                    comment: 'This is another comment',
                    order_index: 2,
                    section_id: 11,
                    session_id: 11,
                    maintenance: false,
                  },
                  {
                    id: 151,
                    exercise_template_id: 379,
                    exercise_name: 'ASLR',
                    variations: [
                      {
                        key: 'sets_reps',
                        parameters: [
                          {
                            key: 'sets',
                            value: '5',
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: '2',
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                        ],
                        label: 'Sets x Reps',
                      },
                    ],
                    comment: 'Test',
                    order_index: 3,
                    section_id: 11,
                    session_id: 11,
                    maintenance: false,
                  },
                  {
                    id: 152,
                    exercise_template_id: 285,
                    exercise_name: 'Leg Swings',
                    variations: [
                      {
                        key: 'sets',
                        parameters: [
                          {
                            key: 'sets',
                            value: null,
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                        ],
                        label: 'Sets',
                      },
                    ],
                    comment: null,
                    order_index: 4,
                    section_id: 11,
                    session_id: 11,
                    maintenance: false,
                  },
                  {
                    id: 153,
                    exercise_template_id: 373,
                    exercise_name: 'Step-Ups',
                    variations: [
                      {
                        key: 'sets_reps_weight',
                        parameters: [
                          {
                            key: 'sets',
                            value: null,
                            config: {},
                            order_index: 1,
                            label: 'Sets',
                          },
                          {
                            key: 'reps',
                            value: null,
                            config: {},
                            order_index: 2,
                            label: 'Reps',
                          },
                          {
                            key: 'weight',
                            value: null,
                            config: { unit: 'lb' },
                            order_index: 3,
                            label: 'Weight',
                          },
                        ],
                        label: 'Sets x Reps x Weight',
                      },
                    ],
                    comment: null,
                    order_index: 5,
                    section_id: 11,
                    session_id: 11,
                    maintenance: false,
                  },
                ],
                full_pathology: 'Accessory bone foot [Left]',
                occurrence_date: '2021-10-18T23:00:00Z',
                body_area: 'Foot',
                body_side: 'Left',
                title: null,
              },
            ],
          },
        ],
        annotations: [],
      },
    ],
  },
];

const handler = rest.post(
  '/ui/medical/rehab/sessions/multi_athlete_report',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
