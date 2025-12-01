// @flow
export default {
  id: 21096,
  organisation_id: 6,
  form: {
    id: 139,
    category: 'medical',
    group: 'nba',
    key: 'nba-ankle-em-2324-v3',
    name: 'Prophylactic Ankle Support (Equipment Manager v3)',
    fullname: 'Prophylactic Ankle Support (Equipment Manager v3)',
    form_type: 'footwear',
    config: null,
    enabled: true,
    created_at: '2024-03-26T16:23:15Z',
    updated_at: '2024-03-26T16:23:15Z',
  },
  form_template_version: {
    id: 116,
    name: 'Prophylactic Ankle Support (Equipment Manager v3)',
    version: 2,
    created_at: '2024-04-03T08:48:29Z',
    updated_at: '2024-04-03T08:48:29Z',
    editor: {
      id: 105694,
      firstname: 'Service',
      lastname: 'User',
      fullname: 'Service User',
    },
    config: {
      post_processors: ['::Forms::Private::PostProcessors::EventProcessor'],
    },
    form_elements: [
      {
        id: 24085,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Game Availability',
          element_id: 'section_game_availability',
          repeatable: false,
          optional: false,
        },
        visible: true,
        order: 1,
        form_elements: [
          {
            id: 24086,
            element_type: 'Forms::Elements::Layouts::Content',
            config: {
              text: 'All the questions in the form are required and must be answered before being submitted.',
              element_id: 'complete_in_full_text',
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 1,
            form_elements: [],
          },
          {
            id: 24087,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              data_source: 'game_events',
              text: 'Game',
              data_point: false,
              element_id: 'event_id',
              custom_params: {
                style: 'searchbar',
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 2,
            form_elements: [],
          },
          {
            id: 24088,
            element_type: 'Forms::Elements::Inputs::Boolean',
            config: {
              text: 'This player is unavailable to play in this game',
              data_point: false,
              default_value: false,
              element_id: 'player_unavailable',
              custom_params: {
                style: 'checkbox',
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 3,
            form_elements: [],
          },
          {
            id: 24089,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'initial_shoe',
                  label: 'Initial Shoe',
                },
                {
                  value: 'shoe_change',
                  label: 'Shoe Change',
                },
              ],
              text: 'Is this an initial shoe submission or a shoe change?',
              data_point: false,
              skip_backend_validation: true,
              element_id: 'submission_type',
              condition: {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 4,
            form_elements: [],
          },
          {
            id: 24090,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              data_source: 'footwear_v2s',
              text: 'Shoe Brand Selection',
              data_point: false,
              skip_backend_validation: true,
              element_id: 'shoe_brand',
              custom_params: {
                style: 'searchbar',
                on_change_update: 'shoe_model',
              },
              condition: {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 5,
            form_elements: [],
          },
          {
            id: 24091,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [],
              data_depends_on: 'shoe_brand',
              text: 'Shoe Model Selection',
              data_point: false,
              skip_backend_validation: true,
              element_id: 'shoe_model',
              custom_params: {
                style: 'searchbar',
                data_depends_on: 'shoe_brand',
              },
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                  {
                    element_id: 'shoe_brand',
                    type: '!=',
                    value_type: 'string',
                    value: 'other',
                  },
                ],
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 6,
            form_elements: [],
          },
          {
            id: 24092,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'low',
                  label: 'Low-top',
                },
                {
                  value: 'mid',
                  label: 'Mid-top',
                },
                {
                  value: 'high',
                  label: 'High-top',
                },
              ],
              text: 'Shoe Silhouette Size',
              data_point: false,
              skip_backend_validation: true,
              element_id: 'shoe_silhouette_size',
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                  {
                    element_id: 'shoe_brand',
                    type: '!=',
                    value_type: 'string',
                    value: 'other',
                  },
                ],
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 7,
            form_elements: [],
          },
          {
            id: 24093,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'signature',
                  label: 'Player Signature Shoe',
                },
                {
                  value: 'stock',
                  label: 'Stock Model',
                },
              ],
              text: 'Shoe Model Type',
              data_point: false,
              skip_backend_validation: true,
              element_id: 'shoe_model_type',
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                  {
                    element_id: 'shoe_brand',
                    type: '!=',
                    value_type: 'string',
                    value: 'other',
                  },
                ],
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 8,
            form_elements: [],
          },
          {
            id: 24094,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: '\u003c20',
                  label: '2020 or earlier',
                },
                {
                  value: '21_22',
                  label: '2021-22',
                },
                {
                  value: '22_23',
                  label: '2022-23',
                },
                {
                  value: '23_24',
                  label: '2023-24',
                },
              ],
              text: 'Shoe Release Year',
              data_point: false,
              skip_backend_validation: true,
              element_id: 'shoe_year',
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                  {
                    element_id: 'shoe_brand',
                    type: '!=',
                    value_type: 'string',
                    value: 'other',
                  },
                ],
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 9,
            form_elements: [],
          },
          {
            id: 24095,
            element_type: 'Forms::Elements::Layouts::Group',
            config: {
              element_id: 'other_shoe_group',
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                  {
                    element_id: 'shoe_brand',
                    type: '==',
                    value_type: 'string',
                    value: 'other',
                  },
                ],
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 10,
            form_elements: [
              {
                id: 24096,
                element_type: 'Forms::Elements::Inputs::Text',
                config: {
                  text: 'Other Shoe Brand',
                  data_point: false,
                  skip_backend_validation: true,
                  element_id: 'shoe_worn_other',
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                order: 1,
                form_elements: [],
              },
              {
                id: 24097,
                element_type: 'Forms::Elements::Inputs::SingleChoice',
                config: {
                  items: [
                    {
                      value: 'low',
                      label: 'Low-top',
                    },
                    {
                      value: 'mid',
                      label: 'Mid-top',
                    },
                    {
                      value: 'high',
                      label: 'High-top',
                    },
                  ],
                  text: 'Other Shoe Silhouette Size',
                  data_point: false,
                  skip_backend_validation: true,
                  element_id: 'shoe_sil_size_other',
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                order: 2,
                form_elements: [],
              },
              {
                id: 24098,
                element_type: 'Forms::Elements::Inputs::SingleChoice',
                config: {
                  items: [
                    {
                      value: 'signature',
                      label: 'Player Signature Shoe',
                    },
                    {
                      value: 'stock',
                      label: 'Stock Model',
                    },
                  ],
                  text: 'Other Shoe Model Type',
                  data_point: false,
                  skip_backend_validation: true,
                  element_id: 'shoe_model_type_other',
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                order: 3,
                form_elements: [],
              },
              {
                id: 24099,
                element_type: 'Forms::Elements::Inputs::SingleChoice',
                config: {
                  items: [
                    {
                      value: '\u003c20',
                      label: '2020 or earlier',
                    },
                    {
                      value: '21_22',
                      label: '2021-22',
                    },
                    {
                      value: '22_23',
                      label: '2022-23',
                    },
                    {
                      value: '23_24',
                      label: '2023-24',
                    },
                  ],
                  text: 'Other Shoe Release Year',
                  data_point: false,
                  skip_backend_validation: true,
                  element_id: 'shoe_year_other',
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                order: 4,
                form_elements: [],
              },
              {
                id: 24100,
                element_type: 'Forms::Elements::Inputs::Boolean',
                config: {
                  text: 'Request to add this shoe to the available search list',
                  data_point: false,
                  default_value: false,
                  skip_backend_validation: true,
                  element_id: 'add_shoe_to_db',
                  custom_params: {
                    style: 'checkbox',
                  },
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                order: 5,
                form_elements: [],
              },
            ],
          },
          {
            id: 24101,
            element_type: 'Forms::Elements::Layouts::Group',
            config: {
              element_id: 'shoe_change_group',
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                  {
                    element_id: 'submission_type',
                    type: '==',
                    value_type: 'string',
                    value: 'shoe_change',
                  },
                ],
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 11,
            form_elements: [
              {
                id: 24102,
                element_type: 'Forms::Elements::Inputs::Boolean',
                config: {
                  text: 'Was shoe change due to an injury?',
                  data_point: false,
                  default_value: false,
                  skip_backend_validation: true,
                  element_id: 'shoe_change_injury',
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                order: 1,
                form_elements: [],
              },
              {
                id: 24103,
                element_type: 'Forms::Elements::Inputs::SingleChoice',
                config: {
                  items: [
                    {
                      value: 'shootaround',
                      label: 'Shootaround',
                    },
                    {
                      value: 'pre_game',
                      label: 'Pre-game (other than shootaround)',
                    },
                    {
                      value: 'first_quarter',
                      label: 'First Quarter',
                    },
                    {
                      value: 'second_quarter',
                      label: 'Second Quarter',
                    },
                    {
                      value: 'halftime',
                      label: 'Halftime',
                    },
                    {
                      value: 'third_quarter',
                      label: 'Third Quarter',
                    },
                    {
                      value: 'fourth_quarter',
                      label: 'Fourth Quarter',
                    },
                    {
                      value: 'overtime',
                      label: 'OT',
                    },
                  ],
                  text: 'Time of shoe change',
                  data_point: false,
                  skip_backend_validation: true,
                  element_id: 'shoe_change_time',
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                order: 2,
                form_elements: [],
              },
              {
                id: 24104,
                element_type: 'Forms::Elements::Inputs::SingleChoice',
                config: {
                  items: [
                    {
                      value: '0',
                      label: '0',
                    },
                    {
                      value: '1',
                      label: '1',
                    },
                    {
                      value: '2',
                      label: '2',
                    },
                    {
                      value: '3',
                      label: '3',
                    },
                    {
                      value: '4',
                      label: '4',
                    },
                    {
                      value: '5',
                      label: '5',
                    },
                    {
                      value: '6',
                      label: '6',
                    },
                    {
                      value: '7',
                      label: '7',
                    },
                    {
                      value: '8',
                      label: '8',
                    },
                    {
                      value: '9',
                      label: '9',
                    },
                    {
                      value: '10',
                      label: '10',
                    },
                    {
                      value: '11',
                      label: '11',
                    },
                    {
                      value: '12',
                      label: '12',
                    },
                  ],
                  text: 'Minutes remaining in period',
                  data_point: false,
                  skip_backend_validation: true,
                  element_id: 'shoe_change_minutes_rem',
                  condition: {
                    type: 'or',
                    conditions: [
                      {
                        element_id: 'shoe_change_time',
                        type: '==',
                        value_type: 'string',
                        value: 'first_quarter',
                      },
                      {
                        element_id: 'shoe_change_time',
                        type: '==',
                        value_type: 'string',
                        value: 'second_quarter',
                      },
                      {
                        element_id: 'shoe_change_time',
                        type: '==',
                        value_type: 'string',
                        value: 'third_quarter',
                      },
                      {
                        element_id: 'shoe_change_time',
                        type: '==',
                        value_type: 'string',
                        value: 'fourth_quarter',
                      },
                      {
                        element_id: 'shoe_change_time',
                        type: '==',
                        value_type: 'string',
                        value: 'overtime',
                      },
                    ],
                  },
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                order: 3,
                form_elements: [],
              },
            ],
          },
        ],
      },
    ],
  },
  date: '2024-04-04T16:20:55Z',
  editor: {
    id: 153179,
    firstname: 'Willian',
    lastname: 'Gama',
    fullname: 'Willian Gama',
  },
  athlete: {
    id: 105411,
    firstname: 'Anderson Test',
    lastname: 'Athlete',
    fullname: 'test',
    position: {
      id: 80,
      name: 'Outside Centre',
      order: 11,
    },
    availability: 'unavailable',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
  },
  form_answers: [
    {
      id: 1070484,
      form_element: {
        id: 24087,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          data_source: 'game_events',
          text: 'Game',
          data_point: false,
          element_id: 'event_id',
          custom_params: {
            style: 'searchbar',
          },
          repeatable: false,
          optional: false,
        },
        visible: true,
        order: 2,
        form_elements: [],
      },
      value: '2473841',
      created_at: '2024-04-04T15:20:57Z',
      updated_at: '2024-04-04T15:20:57Z',
    },
    {
      id: 1070486,
      form_element: {
        id: 24088,
        element_type: 'Forms::Elements::Inputs::Boolean',
        config: {
          text: 'This player is unavailable to play in this game',
          data_point: false,
          default_value: false,
          element_id: 'player_unavailable',
          custom_params: {
            style: 'checkbox',
          },
          repeatable: false,
          optional: false,
        },
        visible: true,
        order: 3,
        form_elements: [],
      },
      value: false,
      created_at: '2024-04-04T15:20:57Z',
      updated_at: '2024-04-04T15:20:57Z',
    },
    {
      id: 1070487,
      form_element: {
        id: 24089,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'initial_shoe',
              label: 'Initial Shoe',
            },
            {
              value: 'shoe_change',
              label: 'Shoe Change',
            },
          ],
          text: 'Is this an initial shoe submission or a shoe change?',
          data_point: false,
          skip_backend_validation: true,
          element_id: 'submission_type',
          condition: {
            element_id: 'player_unavailable',
            type: '==',
            value_type: 'boolean',
            value: false,
          },
          repeatable: false,
          optional: false,
        },
        visible: true,
        order: 4,
        form_elements: [],
      },
      value: 'initial_shoe',
      created_at: '2024-04-04T15:20:57Z',
      updated_at: '2024-04-04T15:20:57Z',
    },
    {
      id: 1070489,
      form_element: {
        id: 24090,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          data_source: 'footwear_v2s',
          text: 'Shoe Brand Selection',
          data_point: false,
          skip_backend_validation: true,
          element_id: 'shoe_brand',
          custom_params: {
            style: 'searchbar',
            on_change_update: 'shoe_model',
          },
          condition: {
            element_id: 'player_unavailable',
            type: '==',
            value_type: 'boolean',
            value: false,
          },
          repeatable: false,
          optional: false,
        },
        visible: true,
        order: 5,
        form_elements: [],
      },
      value: 'adidas',
      created_at: '2024-04-04T15:20:57Z',
      updated_at: '2024-04-04T15:20:57Z',
    },
    {
      id: 1070491,
      form_element: {
        id: 24091,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [],
          data_depends_on: 'shoe_brand',
          text: 'Shoe Model Selection',
          data_point: false,
          skip_backend_validation: true,
          element_id: 'shoe_model',
          custom_params: {
            style: 'searchbar',
            data_depends_on: 'shoe_brand',
          },
          condition: {
            type: 'and',
            conditions: [
              {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
              {
                element_id: 'shoe_brand',
                type: '!=',
                value_type: 'string',
                value: 'other',
              },
            ],
          },
          repeatable: false,
          optional: false,
        },
        visible: true,
        order: 6,
        form_elements: [],
      },
      value: 'byw_select',
      created_at: '2024-04-04T15:20:57Z',
      updated_at: '2024-04-04T15:20:57Z',
    },
    {
      id: 1070492,
      form_element: {
        id: 24092,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'low',
              label: 'Low-top',
            },
            {
              value: 'mid',
              label: 'Mid-top',
            },
            {
              value: 'high',
              label: 'High-top',
            },
          ],
          text: 'Shoe Silhouette Size',
          data_point: false,
          skip_backend_validation: true,
          element_id: 'shoe_silhouette_size',
          condition: {
            type: 'and',
            conditions: [
              {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
              {
                element_id: 'shoe_brand',
                type: '!=',
                value_type: 'string',
                value: 'other',
              },
            ],
          },
          repeatable: false,
          optional: false,
        },
        visible: true,
        order: 7,
        form_elements: [],
      },
      value: 'mid',
      created_at: '2024-04-04T15:20:57Z',
      updated_at: '2024-04-04T15:20:57Z',
    },
    {
      id: 1070494,
      form_element: {
        id: 24093,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'signature',
              label: 'Player Signature Shoe',
            },
            {
              value: 'stock',
              label: 'Stock Model',
            },
          ],
          text: 'Shoe Model Type',
          data_point: false,
          skip_backend_validation: true,
          element_id: 'shoe_model_type',
          condition: {
            type: 'and',
            conditions: [
              {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
              {
                element_id: 'shoe_brand',
                type: '!=',
                value_type: 'string',
                value: 'other',
              },
            ],
          },
          repeatable: false,
          optional: false,
        },
        visible: true,
        order: 8,
        form_elements: [],
      },
      value: 'stock',
      created_at: '2024-04-04T15:20:57Z',
      updated_at: '2024-04-04T15:20:57Z',
    },
    {
      id: 1070495,
      form_element: {
        id: 24094,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: '\u003c20',
              label: '2020 or earlier',
            },
            {
              value: '21_22',
              label: '2021-22',
            },
            {
              value: '22_23',
              label: '2022-23',
            },
            {
              value: '23_24',
              label: '2023-24',
            },
          ],
          text: 'Shoe Release Year',
          data_point: false,
          skip_backend_validation: true,
          element_id: 'shoe_year',
          condition: {
            type: 'and',
            conditions: [
              {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
              {
                element_id: 'shoe_brand',
                type: '!=',
                value_type: 'string',
                value: 'other',
              },
            ],
          },
          repeatable: false,
          optional: false,
        },
        visible: true,
        order: 9,
        form_elements: [],
      },
      value: '\u003c20',
      created_at: '2024-04-04T15:20:57Z',
      updated_at: '2024-04-04T15:20:57Z',
    },
  ],
  extra: {
    squad_id: 73,
  },
};

export const expectedFormInfoResult = {
  formMeta: {
    id: 139,
    category: 'medical',
    group: 'nba',
    key: 'nba-ankle-em-2324-v3',
    name: 'Prophylactic Ankle Support (Equipment Manager v3)',
    fullname: 'Prophylactic Ankle Support (Equipment Manager v3)',
    form_type: 'footwear',
    config: null,
    enabled: true,
    created_at: '2024-03-26T16:23:15Z',
    updated_at: '2024-03-26T16:23:15Z',
  },
  headerTitle: undefined,
  mergeSections: undefined,
  hideFormInfo: undefined,
  athlete: {
    id: 105411,
    firstname: 'Anderson Test',
    lastname: 'Athlete',
    fullname: 'test',
    position: {
      id: 80,
      name: 'Outside Centre',
      order: 11,
    },
    availability: 'unavailable',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
  },
  editor: {
    id: 153179,
    firstname: 'Willian',
    lastname: 'Gama',
    fullname: 'Willian Gama',
  },
  status: undefined,
  date: '2024-04-04T16:20:55Z',
  created_at: undefined,
  updated_at: undefined,
  linked_injuries_illnesses: [],
  attachments: [],
};

export const expectedFormattedResults = [
  {
    title: 'Game Availability',
    elementId: 'section_game_availability',
    elements: [
      {
        questionsAndAnswers: [
          {
            question:
              'All the questions in the form are required and must be answered before being submitted.',
            answer: null,
            id: 'complete_in_full_text',
            type: 'descriptionContent',
          },
        ],
        id: 24086,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Game:',
            answer: '2473841',
            id: 'event_id',
            type: 'questionAndAnswer',
          },
        ],
        id: 24087,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'This player is unavailable to play in this game:',
            answer: 'No',
            id: 'player_unavailable',
            type: 'questionAndAnswer',
          },
        ],
        id: 24088,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Is this an initial shoe submission or a shoe change?',
            answer: 'Initial Shoe',
            id: 'submission_type',
            type: 'questionAndAnswer',
          },
        ],
        id: 24089,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Shoe Brand Selection:',
            answer: 'Adidas',
            id: 'shoe_brand',
            type: 'questionAndAnswer',
          },
        ],
        id: 24090,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Shoe Model Selection:',
            answer: 'Byw select',
            id: 'shoe_model',
            type: 'questionAndAnswer',
          },
        ],
        id: 24091,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Shoe Silhouette Size:',
            answer: 'Mid-top',
            id: 'shoe_silhouette_size',
            type: 'questionAndAnswer',
          },
        ],
        id: 24092,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Shoe Model Type:',
            answer: 'Stock Model',
            id: 'shoe_model_type',
            type: 'questionAndAnswer',
          },
        ],
        id: 24093,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Shoe Release Year:',
            answer: '2020 or earlier',
            id: 'shoe_year',
            type: 'questionAndAnswer',
          },
        ],
        id: 24094,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 24085,
    sidePanelSection: false,
  },
];
