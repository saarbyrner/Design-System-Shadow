// @flow
export default {
  id: 888,
  organisation_id: 6,
  form: {
    id: 113,
    category: 'legal',
    group: 'isu',
    key: 'game_availability',
    name: 'Prophylactic Ankle Support',
    fullname: 'Prophylactic Ankle Support',
    form_type: 'registration',
    config: null,
    enabled: true,
    created_at: '2023-06-28T17:42:52Z',
    updated_at: '2023-06-28T17:42:52Z',
  },
  form_template_version: {
    id: 93,
    name: 'Prophylactic Ankle Support',
    version: 1,
    created_at: '2023-06-28T17:42:52Z',
    updated_at: '2023-06-28T17:42:52Z',
    editor: {
      id: 137811,
      firstname: 'Cian',
      lastname: 'Guinee',
      fullname: 'Cian Guinee',
    },
    config: null,
    form_elements: [
      {
        id: 22558,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Game Availability',
          element_id: 'section_game_availability',
        },
        visible: true,
        order: 1,
        form_elements: [
          {
            id: 22559,
            element_type: 'Forms::Elements::Inputs::Boolean',
            config: {
              text: 'This player is unavailable to play in this game',
              data_point: false,
              default_value: false,
              element_id: 'player_unavailable',
              custom_params: {
                style: 'checkbox',
              },
              optional: false,
            },
            visible: true,
            order: 1,
            form_elements: [],
          },
          {
            id: 22560,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'both',
                  label: 'Yes - Both Ankles',
                },
                {
                  value: 'left',
                  label: 'Yes - Left Ankle Only',
                },
                {
                  value: 'right',
                  label: 'Yes - Right Ankle Only',
                },
                {
                  value: 'no',
                  label: 'No',
                },
              ],
              text: 'Did this player receive ankle tape?',
              data_point: false,
              element_id: 'received_ankle_tape',
              condition: {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
              optional: true,
            },
            visible: true,
            order: 2,
            form_elements: [],
          },
          {
            id: 22561,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'light',
                  label: 'Light Support',
                },
                {
                  value: 'medium',
                  label: 'Medium Support',
                },
                {
                  value: 'heavy',
                  label: 'Heavy Support',
                },
              ],
              text: 'Ankle Tape Type (Left)',
              data_point: false,
              element_id: 'tape_type_left',
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
                    type: 'or',
                    conditions: [
                      {
                        type: '==',
                        element_id: 'received_ankle_tape',
                        value: 'left',
                        value_type: 'string',
                      },
                      {
                        type: '==',
                        element_id: 'received_ankle_tape',
                        value: 'both',
                        value_type: 'string',
                      },
                    ],
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 3,
            form_elements: [],
          },
          {
            id: 22562,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'light',
                  label: 'Light Support',
                },
                {
                  value: 'medium',
                  label: 'Medium Support',
                },
                {
                  value: 'heavy',
                  label: 'Heavy Support',
                },
              ],
              text: 'Ankle Tape Type (Right)',
              data_point: false,
              element_id: 'tape_type_right',
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
                    type: 'or',
                    conditions: [
                      {
                        type: '==',
                        element_id: 'received_ankle_tape',
                        value: 'right',
                        value_type: 'string',
                      },
                      {
                        type: '==',
                        element_id: 'received_ankle_tape',
                        value: 'both',
                        value_type: 'string',
                      },
                    ],
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 4,
            form_elements: [],
          },
          {
            id: 22563,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'both',
                  label: 'Yes - Both Ankles',
                },
                {
                  value: 'left',
                  label: 'Yes - Left Ankle Only',
                },
                {
                  value: 'right',
                  label: 'Yes - Right Ankle Only',
                },
                {
                  value: 'no',
                  label: 'No',
                },
              ],
              text: 'Did this player wear an ankle brace',
              data_point: false,
              element_id: 'wore_ankle_brace',
              condition: {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
              optional: true,
            },
            visible: true,
            order: 5,
            form_elements: [],
          },
          {
            id: 22564,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'active_ankle_as1_pro',
                  label: 'Active Ankle AS1 Pro',
                },
                {
                  value: 'active_ankle_prolacer_brace',
                  label: 'Active Ankle Prolacer Brace',
                },
                {
                  value: 'active_ankle_eclipse',
                  label: 'Active Ankle Eclipse',
                },
                {
                  value: 'active_ankle_excel',
                  label: 'Active Ankle Excel',
                },
                {
                  value: 'active_ankle',
                  label: 'Active Ankle',
                },
                {
                  value: 'aso_ankle_stabilizer',
                  label: 'ASO Ankle Stabilizer',
                },
                {
                  value: 'aso_ankle_stabilizing_orthosis',
                  label: 'ASO Ankle Stabilizing Orthosis',
                },
                {
                  value: 'aso_speed_lacer',
                  label: 'ASO Speed Lacer',
                },
                {
                  value: 'aso_vortex',
                  label: 'ASO Vortex',
                },
                {
                  value: 'bauerfeind_malleotrain_plus',
                  label: 'Bauerfeind MalleoTrain Plus',
                },
                {
                  value: 'betterguard',
                  label: 'BetterGuard',
                },
                {
                  value: 'donjoy_performance_pod',
                  label: 'DonJoy Performance POD',
                },
                {
                  value: 'donjoy_stabilizing_pro',
                  label: 'DonJoy Stabilizing Pro',
                },
                {
                  value: 'mcdavid_elite_bio_logix',
                  label: 'McDavid Elite Bio - Logix',
                },
                {
                  value: 'mcdavid_elite_engineered_elastic',
                  label: 'McDavid Elite Engineered Elastic',
                },
                {
                  value: 'mcdavid_phantom',
                  label: 'McDavid Phantom',
                },
                {
                  value: 'mueller_hg80_rigid_ankle_brace',
                  label: 'Mueller Hg80 Rigid Ankle Brace',
                },
                {
                  value: 'mueller_the_one',
                  label: 'Mueller The One',
                },
                {
                  value: 'zamst_a1',
                  label: 'Zamst A1',
                },
                {
                  value: 'zamst_a2',
                  label: 'Zamst A2 - DX',
                },
                {
                  value: 'zamst_filmista_ankle',
                  label: 'Zamst Filmista Ankle',
                },
                {
                  value: 'other',
                  label: 'Other',
                },
              ],
              text: 'Ankle Brace Type',
              data_point: false,
              element_id: 'brace_type',
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
                    type: 'or',
                    conditions: [
                      {
                        type: '==',
                        element_id: 'wore_ankle_brace',
                        value: 'right',
                        value_type: 'string',
                      },
                      {
                        type: '==',
                        element_id: 'wore_ankle_brace',
                        value: 'left',
                        value_type: 'string',
                      },
                      {
                        type: '==',
                        element_id: 'wore_ankle_brace',
                        value: 'both',
                        value_type: 'string',
                      },
                    ],
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 6,
            form_elements: [],
          },
          {
            id: 22565,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'Other Ankle Brace Type',
              data_point: false,
              element_id: 'ankle_brace_type_other',
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'brace_type',
                    type: '==',
                    value_type: 'string',
                    value: 'other',
                  },
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 7,
            form_elements: [],
          },
          {
            id: 22566,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'aaron_gordon_351',
                  label: '361* Aaron Gordon x 361* Zen 5',
                },
                {
                  value: 'adidas_byw',
                  label: 'Adidas BYW Select',
                },
                {
                  value: 'adidas_dame_8',
                  label: 'Adidas Dame 8',
                },
                {
                  value: 'adidas_don_4',
                  label: 'Adidas DON Issue #4',
                },
                {
                  value: 'adidas_harden_7',
                  label: 'Adidas Harden Volume 7',
                },
                {
                  value: 'adidas_trae_2',
                  label: 'Adidas Trae Young 2.0',
                },
                {
                  value: 'anta_7_up',
                  label: 'Anta Anta Z-Up',
                },
                {
                  value: 'anta_gordon_hayward',
                  label: 'Anta Gordon Hayward 4',
                },
                {
                  value: 'anta_klay_thompson',
                  label: 'Anta Klay Thompson KT4',
                },
                {
                  value: 'converse_all_star_bb_p',
                  label: 'Converse All Star BB Prototype',
                },
                {
                  value: 'jordan_luka_1',
                  label: 'Jordan Luka 1',
                },
                {
                  value: 'jordan_one_take_4',
                  label: 'Jordan One Take 4',
                },
                {
                  value: 'jordan_tatum_1',
                  label: 'Jordan Tatum 1',
                },
                {
                  value: 'li_ning_all_city_wade',
                  label: 'Li-Ning All-City Wade',
                },
                {
                  value: 'li_ning_speed_series',
                  label: 'Li-Ning Speed Series',
                },
                {
                  value: 'new_balance_kawhi_3',
                  label: 'New Balance KAWHI 3 Alpha',
                },
                {
                  value: 'new_balance_two_wxy',
                  label: 'New Balance TWO WXY v3',
                },
                {
                  value: 'nike_cosmic_unity',
                  label: 'Nike Cosmic Unity',
                },
                {
                  value: 'nike_freak_4',
                  label: 'Nike Freak 4',
                },
                {
                  value: 'nike_gt_cut_2',
                  label: 'Nike GT Cut 2',
                },
                {
                  value: 'nike_gt_jump',
                  label: 'Nike GT Jump',
                },
                {
                  value: 'nike_ja_1',
                  label: 'Nike Ja-1',
                },
                {
                  value: 'nike_kd15',
                  label: 'Nike KD15',
                },
                {
                  value: 'nike_lebron_nxxt_gen',
                  label: 'Nike Lebron NXXT Gen',
                },
                {
                  value: 'nike_lebron_xx',
                  label: 'Nike Lebron XX',
                },
                {
                  value: 'nike_pg6',
                  label: 'Nike PG6',
                },
                {
                  value: 'puma_all_pro_nitro_scoot',
                  label: 'Puma All Pro Nitro Scoot',
                },
                {
                  value: 'puma_court_rider_chaos',
                  label: 'Puma Court Rider Chaos',
                },
                {
                  value: 'puma_court_rider_chaos_slash',
                  label: 'Puma Court Rider Chaos Slash',
                },
                {
                  value: 'puma_lamelo',
                  label: 'Puma LaMelo MB.02',
                },
                {
                  value: 'rigorer_sniper_2_pro',
                  label: 'Rigorer Sniper 2 Pro - Austin Reeves',
                },
                {
                  value: 'ua_curry_1_low',
                  label: 'Under Armour Curry 1 Low Flo-Tro',
                },
                {
                  value: 'ua_curry_flow_10',
                  label: 'Under Armour Curry Flow 10',
                },
                {
                  value: 'other',
                  label: 'Other',
                },
              ],
              text: 'Shoe Make/Model',
              data_point: false,
              element_id: 'shoe_worn',
              condition: {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
              optional: true,
            },
            visible: true,
            order: 8,
            form_elements: [],
          },
          {
            id: 22567,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'Shoe Make/Model (Other)',
              data_point: false,
              element_id: 'shoe_worn_other',
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
                    element_id: 'shoe_worn',
                    type: '==',
                    value_type: 'string',
                    value: 'other',
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 9,
            form_elements: [],
          },
          {
            id: 22568,
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
              element_id: 'shoe_silhouette_size',
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'shoe_worn',
                    type: '==',
                    value_type: 'string',
                    value: 'other',
                  },
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 10,
            form_elements: [],
          },
          {
            id: 22569,
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
              element_id: 'shoe_model_type',
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'shoe_worn',
                    type: '==',
                    value_type: 'string',
                    value: 'other',
                  },
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 11,
            form_elements: [],
          },
          {
            id: 22570,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
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
              element_id: 'shoe_release_year',
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'shoe_worn',
                    type: '==',
                    value_type: 'string',
                    value: 'other',
                  },
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 12,
            form_elements: [],
          },
          {
            id: 22571,
            element_type: 'Forms::Elements::Inputs::Boolean',
            config: {
              text: 'Request to add this shoe to the available search list',
              data_point: false,
              default_value: false,
              element_id: 'add_shoe_to_db',
              custom_params: {
                style: 'checkbox',
              },
              condition: {
                type: 'and',
                conditions: [
                  {
                    element_id: 'shoe_worn',
                    type: '==',
                    value_type: 'string',
                    value: 'other',
                  },
                  {
                    element_id: 'player_unavailable',
                    type: '==',
                    value_type: 'boolean',
                    value: false,
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 13,
            form_elements: [],
          },
          {
            id: 22572,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'both',
                  label: 'Yes - Both Shoes',
                },
                {
                  value: 'left',
                  label: 'Yes - Left Shoe Only',
                },
                {
                  value: 'right',
                  label: 'Yes - Right Shoe Only',
                },
                {
                  value: 'no',
                  label: 'No',
                },
              ],
              text: 'Is the player wearing orthotics or inserts?',
              data_point: false,
              element_id: 'orthotic_worn',
              condition: {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
              optional: true,
            },
            visible: true,
            order: 14,
            form_elements: [],
          },
          {
            id: 22573,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'light',
                  label: 'Light Support',
                },
                {
                  value: 'medium',
                  label: 'Medium Support',
                },
                {
                  value: 'heavy',
                  label: 'Heavy Support',
                },
              ],
              text: 'Orthotic Type (Left)',
              data_point: false,
              element_id: 'orthotic_type_left',
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
                    type: 'or',
                    conditions: [
                      {
                        type: '==',
                        element_id: 'orthotic_worn',
                        value: 'left',
                        value_type: 'string',
                      },
                      {
                        type: '==',
                        element_id: 'orthotic_worn',
                        value: 'both',
                        value_type: 'string',
                      },
                    ],
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 15,
            form_elements: [],
          },
          {
            id: 22574,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'light',
                  label: 'Light Support',
                },
                {
                  value: 'medium',
                  label: 'Medium Support',
                },
                {
                  value: 'heavy',
                  label: 'Heavy Support',
                },
              ],
              text: 'Orthotic Type (Right)',
              data_point: false,
              element_id: 'orthotic_type_right',
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
                    type: 'or',
                    conditions: [
                      {
                        type: '==',
                        element_id: 'orthotic_worn',
                        value: 'right',
                        value_type: 'string',
                      },
                      {
                        type: '==',
                        element_id: 'orthotic_worn',
                        value: 'both',
                        value_type: 'string',
                      },
                    ],
                  },
                ],
              },
              optional: true,
            },
            visible: true,
            order: 16,
            form_elements: [],
          },
        ],
      },
    ],
  },
  athlete: {
    id: 3525,
    firstname: 'Adam',
    lastname: 'Conway',
    fullname: 'Adam Conway',
    position: {
      id: 83,
      name: 'Other',
      order: 14,
    },
    availability: 'injured',
    avatar_url:
      'https://kitman.imgix.net/kitman-staff/kitman-staff_5703?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
  },
  editor: {
    id: 24765,
    firstname: 'Niall',
    lastname: 'Kennedy',
    fullname: 'Niall Kennedy',
  },
  status: 'complete',
  concussion_diagnosed: null,
  event_id: null,
  date: '2023-06-28T17:46:24Z',
  created_at: '2023-06-28T17:46:24Z',
  updated_at: '2023-06-28T17:46:24Z',
  form_answers: [
    {
      id: 39696,
      form_element: {
        id: 22559,
        element_type: 'Forms::Elements::Inputs::Boolean',
        config: {
          text: 'This player is unavailable to play in this game',
          data_point: false,
          default_value: false,
          element_id: 'player_unavailable',
          custom_params: {
            style: 'checkbox',
          },
          optional: false,
        },
        visible: true,
        order: 1,
        form_elements: [],
      },
      value: false,
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39697,
      form_element: {
        id: 22560,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'both',
              label: 'Yes - Both Ankles',
            },
            {
              value: 'left',
              label: 'Yes - Left Ankle Only',
            },
            {
              value: 'right',
              label: 'Yes - Right Ankle Only',
            },
            {
              value: 'no',
              label: 'No',
            },
          ],
          text: 'Did this player receive ankle tape?',
          data_point: false,
          element_id: 'received_ankle_tape',
          condition: {
            element_id: 'player_unavailable',
            type: '==',
            value_type: 'boolean',
            value: false,
          },
          optional: true,
        },
        visible: true,
        order: 2,
        form_elements: [],
      },
      value: 'both',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39698,
      form_element: {
        id: 22561,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'light',
              label: 'Light Support',
            },
            {
              value: 'medium',
              label: 'Medium Support',
            },
            {
              value: 'heavy',
              label: 'Heavy Support',
            },
          ],
          text: 'Ankle Tape Type (Left)',
          data_point: false,
          element_id: 'tape_type_left',
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
                type: 'or',
                conditions: [
                  {
                    type: '==',
                    element_id: 'received_ankle_tape',
                    value: 'left',
                    value_type: 'string',
                  },
                  {
                    type: '==',
                    element_id: 'received_ankle_tape',
                    value: 'both',
                    value_type: 'string',
                  },
                ],
              },
            ],
          },
          optional: true,
        },
        visible: true,
        order: 3,
        form_elements: [],
      },
      value: 'medium',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39699,
      form_element: {
        id: 22562,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'light',
              label: 'Light Support',
            },
            {
              value: 'medium',
              label: 'Medium Support',
            },
            {
              value: 'heavy',
              label: 'Heavy Support',
            },
          ],
          text: 'Ankle Tape Type (Right)',
          data_point: false,
          element_id: 'tape_type_right',
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
                type: 'or',
                conditions: [
                  {
                    type: '==',
                    element_id: 'received_ankle_tape',
                    value: 'right',
                    value_type: 'string',
                  },
                  {
                    type: '==',
                    element_id: 'received_ankle_tape',
                    value: 'both',
                    value_type: 'string',
                  },
                ],
              },
            ],
          },
          optional: true,
        },
        visible: true,
        order: 4,
        form_elements: [],
      },
      value: 'heavy',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39700,
      form_element: {
        id: 22563,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'both',
              label: 'Yes - Both Ankles',
            },
            {
              value: 'left',
              label: 'Yes - Left Ankle Only',
            },
            {
              value: 'right',
              label: 'Yes - Right Ankle Only',
            },
            {
              value: 'no',
              label: 'No',
            },
          ],
          text: 'Did this player wear an ankle brace',
          data_point: false,
          element_id: 'wore_ankle_brace',
          condition: {
            element_id: 'player_unavailable',
            type: '==',
            value_type: 'boolean',
            value: false,
          },
          optional: true,
        },
        visible: true,
        order: 5,
        form_elements: [],
      },
      value: 'both',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39701,
      form_element: {
        id: 22564,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'active_ankle_as1_pro',
              label: 'Active Ankle AS1 Pro',
            },
            {
              value: 'active_ankle_prolacer_brace',
              label: 'Active Ankle Prolacer Brace',
            },
            {
              value: 'active_ankle_eclipse',
              label: 'Active Ankle Eclipse',
            },
            {
              value: 'active_ankle_excel',
              label: 'Active Ankle Excel',
            },
            {
              value: 'active_ankle',
              label: 'Active Ankle',
            },
            {
              value: 'aso_ankle_stabilizer',
              label: 'ASO Ankle Stabilizer',
            },
            {
              value: 'aso_ankle_stabilizing_orthosis',
              label: 'ASO Ankle Stabilizing Orthosis',
            },
            {
              value: 'aso_speed_lacer',
              label: 'ASO Speed Lacer',
            },
            {
              value: 'aso_vortex',
              label: 'ASO Vortex',
            },
            {
              value: 'bauerfeind_malleotrain_plus',
              label: 'Bauerfeind MalleoTrain Plus',
            },
            {
              value: 'betterguard',
              label: 'BetterGuard',
            },
            {
              value: 'donjoy_performance_pod',
              label: 'DonJoy Performance POD',
            },
            {
              value: 'donjoy_stabilizing_pro',
              label: 'DonJoy Stabilizing Pro',
            },
            {
              value: 'mcdavid_elite_bio_logix',
              label: 'McDavid Elite Bio - Logix',
            },
            {
              value: 'mcdavid_elite_engineered_elastic',
              label: 'McDavid Elite Engineered Elastic',
            },
            {
              value: 'mcdavid_phantom',
              label: 'McDavid Phantom',
            },
            {
              value: 'mueller_hg80_rigid_ankle_brace',
              label: 'Mueller Hg80 Rigid Ankle Brace',
            },
            {
              value: 'mueller_the_one',
              label: 'Mueller The One',
            },
            {
              value: 'zamst_a1',
              label: 'Zamst A1',
            },
            {
              value: 'zamst_a2',
              label: 'Zamst A2 - DX',
            },
            {
              value: 'zamst_filmista_ankle',
              label: 'Zamst Filmista Ankle',
            },
            {
              value: 'other',
              label: 'Other',
            },
          ],
          text: 'Ankle Brace Type',
          data_point: false,
          element_id: 'brace_type',
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
                type: 'or',
                conditions: [
                  {
                    type: '==',
                    element_id: 'wore_ankle_brace',
                    value: 'right',
                    value_type: 'string',
                  },
                  {
                    type: '==',
                    element_id: 'wore_ankle_brace',
                    value: 'left',
                    value_type: 'string',
                  },
                  {
                    type: '==',
                    element_id: 'wore_ankle_brace',
                    value: 'both',
                    value_type: 'string',
                  },
                ],
              },
            ],
          },
          optional: true,
        },
        visible: true,
        order: 6,
        form_elements: [],
      },
      value: 'other',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39702,
      form_element: {
        id: 22565,
        element_type: 'Forms::Elements::Inputs::Text',
        config: {
          text: 'Other Ankle Brace Type',
          data_point: false,
          element_id: 'ankle_brace_type_other',
          condition: {
            type: 'and',
            conditions: [
              {
                element_id: 'brace_type',
                type: '==',
                value_type: 'string',
                value: 'other',
              },
              {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
            ],
          },
          optional: true,
        },
        visible: true,
        order: 7,
        form_elements: [],
      },
      value: 'Other brace',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39703,
      form_element: {
        id: 22566,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'aaron_gordon_351',
              label: '361* Aaron Gordon x 361* Zen 5',
            },
            {
              value: 'adidas_byw',
              label: 'Adidas BYW Select',
            },
            {
              value: 'adidas_dame_8',
              label: 'Adidas Dame 8',
            },
            {
              value: 'adidas_don_4',
              label: 'Adidas DON Issue #4',
            },
            {
              value: 'adidas_harden_7',
              label: 'Adidas Harden Volume 7',
            },
            {
              value: 'adidas_trae_2',
              label: 'Adidas Trae Young 2.0',
            },
            {
              value: 'anta_7_up',
              label: 'Anta Anta Z-Up',
            },
            {
              value: 'anta_gordon_hayward',
              label: 'Anta Gordon Hayward 4',
            },
            {
              value: 'anta_klay_thompson',
              label: 'Anta Klay Thompson KT4',
            },
            {
              value: 'converse_all_star_bb_p',
              label: 'Converse All Star BB Prototype',
            },
            {
              value: 'jordan_luka_1',
              label: 'Jordan Luka 1',
            },
            {
              value: 'jordan_one_take_4',
              label: 'Jordan One Take 4',
            },
            {
              value: 'jordan_tatum_1',
              label: 'Jordan Tatum 1',
            },
            {
              value: 'li_ning_all_city_wade',
              label: 'Li-Ning All-City Wade',
            },
            {
              value: 'li_ning_speed_series',
              label: 'Li-Ning Speed Series',
            },
            {
              value: 'new_balance_kawhi_3',
              label: 'New Balance KAWHI 3 Alpha',
            },
            {
              value: 'new_balance_two_wxy',
              label: 'New Balance TWO WXY v3',
            },
            {
              value: 'nike_cosmic_unity',
              label: 'Nike Cosmic Unity',
            },
            {
              value: 'nike_freak_4',
              label: 'Nike Freak 4',
            },
            {
              value: 'nike_gt_cut_2',
              label: 'Nike GT Cut 2',
            },
            {
              value: 'nike_gt_jump',
              label: 'Nike GT Jump',
            },
            {
              value: 'nike_ja_1',
              label: 'Nike Ja-1',
            },
            {
              value: 'nike_kd15',
              label: 'Nike KD15',
            },
            {
              value: 'nike_lebron_nxxt_gen',
              label: 'Nike Lebron NXXT Gen',
            },
            {
              value: 'nike_lebron_xx',
              label: 'Nike Lebron XX',
            },
            {
              value: 'nike_pg6',
              label: 'Nike PG6',
            },
            {
              value: 'puma_all_pro_nitro_scoot',
              label: 'Puma All Pro Nitro Scoot',
            },
            {
              value: 'puma_court_rider_chaos',
              label: 'Puma Court Rider Chaos',
            },
            {
              value: 'puma_court_rider_chaos_slash',
              label: 'Puma Court Rider Chaos Slash',
            },
            {
              value: 'puma_lamelo',
              label: 'Puma LaMelo MB.02',
            },
            {
              value: 'rigorer_sniper_2_pro',
              label: 'Rigorer Sniper 2 Pro - Austin Reeves',
            },
            {
              value: 'ua_curry_1_low',
              label: 'Under Armour Curry 1 Low Flo-Tro',
            },
            {
              value: 'ua_curry_flow_10',
              label: 'Under Armour Curry Flow 10',
            },
            {
              value: 'other',
              label: 'Other',
            },
          ],
          text: 'Shoe Make/Model',
          data_point: false,
          element_id: 'shoe_worn',
          condition: {
            element_id: 'player_unavailable',
            type: '==',
            value_type: 'boolean',
            value: false,
          },
          optional: true,
        },
        visible: true,
        order: 8,
        form_elements: [],
      },
      value: 'other',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39704,
      form_element: {
        id: 22567,
        element_type: 'Forms::Elements::Inputs::Text',
        config: {
          text: 'Shoe Make/Model (Other)',
          data_point: false,
          element_id: 'shoe_worn_other',
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
                element_id: 'shoe_worn',
                type: '==',
                value_type: 'string',
                value: 'other',
              },
            ],
          },
          optional: true,
        },
        visible: true,
        order: 9,
        form_elements: [],
      },
      value: 'Cheap',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39705,
      form_element: {
        id: 22568,
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
          element_id: 'shoe_silhouette_size',
          condition: {
            type: 'and',
            conditions: [
              {
                element_id: 'shoe_worn',
                type: '==',
                value_type: 'string',
                value: 'other',
              },
              {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
            ],
          },
          optional: true,
        },
        visible: true,
        order: 10,
        form_elements: [],
      },
      value: 'high',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39706,
      form_element: {
        id: 22569,
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
          element_id: 'shoe_model_type',
          condition: {
            type: 'and',
            conditions: [
              {
                element_id: 'shoe_worn',
                type: '==',
                value_type: 'string',
                value: 'other',
              },
              {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
            ],
          },
          optional: true,
        },
        visible: true,
        order: 11,
        form_elements: [],
      },
      value: 'signature',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39707,
      form_element: {
        id: 22570,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
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
          element_id: 'shoe_release_year',
          condition: {
            type: 'and',
            conditions: [
              {
                element_id: 'shoe_worn',
                type: '==',
                value_type: 'string',
                value: 'other',
              },
              {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
            ],
          },
          optional: true,
        },
        visible: true,
        order: 12,
        form_elements: [],
      },
      value: '21_22',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39708,
      form_element: {
        id: 22571,
        element_type: 'Forms::Elements::Inputs::Boolean',
        config: {
          text: 'Request to add this shoe to the available search list',
          data_point: false,
          default_value: false,
          element_id: 'add_shoe_to_db',
          custom_params: {
            style: 'checkbox',
          },
          condition: {
            type: 'and',
            conditions: [
              {
                element_id: 'shoe_worn',
                type: '==',
                value_type: 'string',
                value: 'other',
              },
              {
                element_id: 'player_unavailable',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
            ],
          },
          optional: true,
        },
        visible: true,
        order: 13,
        form_elements: [],
      },
      value: true,
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39709,
      form_element: {
        id: 22572,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'both',
              label: 'Yes - Both Shoes',
            },
            {
              value: 'left',
              label: 'Yes - Left Shoe Only',
            },
            {
              value: 'right',
              label: 'Yes - Right Shoe Only',
            },
            {
              value: 'no',
              label: 'No',
            },
          ],
          text: 'Is the player wearing orthotics or inserts?',
          data_point: false,
          element_id: 'orthotic_worn',
          condition: {
            element_id: 'player_unavailable',
            type: '==',
            value_type: 'boolean',
            value: false,
          },
          optional: true,
        },
        visible: true,
        order: 14,
        form_elements: [],
      },
      value: 'left',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
    {
      id: 39710,
      form_element: {
        id: 22573,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'light',
              label: 'Light Support',
            },
            {
              value: 'medium',
              label: 'Medium Support',
            },
            {
              value: 'heavy',
              label: 'Heavy Support',
            },
          ],
          text: 'Orthotic Type (Left)',
          data_point: false,
          element_id: 'orthotic_type_left',
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
                type: 'or',
                conditions: [
                  {
                    type: '==',
                    element_id: 'orthotic_worn',
                    value: 'left',
                    value_type: 'string',
                  },
                  {
                    type: '==',
                    element_id: 'orthotic_worn',
                    value: 'both',
                    value_type: 'string',
                  },
                ],
              },
            ],
          },
          optional: true,
        },
        visible: true,
        order: 15,
        form_elements: [],
      },
      value: 'medium',
      created_at: '2023-06-28T17:46:24Z',
      updated_at: '2023-06-28T17:46:24Z',
    },
  ],
  extra: null,
};

export const expectedFormInfoResult = {
  formMeta: {
    id: 113,
    category: 'legal',
    group: 'isu',
    key: 'game_availability',
    name: 'Prophylactic Ankle Support',
    fullname: 'Prophylactic Ankle Support',
    form_type: 'registration',
    config: null,
    enabled: true,
    created_at: '2023-06-28T17:42:52Z',
    updated_at: '2023-06-28T17:42:52Z',
  },
  headerTitle: undefined,
  mergeSections: undefined,
  hideFormInfo: undefined,
  athlete: {
    id: 3525,
    firstname: 'Adam',
    lastname: 'Conway',
    fullname: 'Adam Conway',
    position: { id: 83, name: 'Other', order: 14 },
    availability: 'injured',
    avatar_url:
      'https://kitman.imgix.net/kitman-staff/kitman-staff_5703?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
  },
  editor: {
    id: 24765,
    firstname: 'Niall',
    lastname: 'Kennedy',
    fullname: 'Niall Kennedy',
  },
  status: 'complete',
  date: '2023-06-28T17:46:24Z',
  created_at: '2023-06-28T17:46:24Z',
  updated_at: '2023-06-28T17:46:24Z',
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
            question: 'This player is unavailable to play in this game:',
            answer: 'No',
            id: 'player_unavailable',
            type: 'questionAndAnswer',
          },
        ],
        id: 22559,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Did this player receive ankle tape?',
            answer: 'Yes - Both Ankles',
            id: 'received_ankle_tape',
            type: 'questionAndAnswer',
          },
        ],
        id: 22560,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Ankle Tape Type (Left):',
            answer: 'Medium Support',
            id: 'tape_type_left',
            type: 'questionAndAnswer',
          },
        ],
        id: 22561,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Ankle Tape Type (Right):',
            answer: 'Heavy Support',
            id: 'tape_type_right',
            type: 'questionAndAnswer',
          },
        ],
        id: 22562,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Did this player wear an ankle brace:',
            answer: 'Yes - Both Ankles',
            id: 'wore_ankle_brace',
            type: 'questionAndAnswer',
          },
        ],
        id: 22563,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Ankle Brace Type:',
            answer: 'Other',
            id: 'brace_type',
            type: 'questionAndAnswer',
          },
        ],
        id: 22564,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Other Ankle Brace Type:',
            answer: 'Other brace',
            id: 'ankle_brace_type_other',
            type: 'questionAndAnswer',
          },
        ],
        id: 22565,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Shoe Make/Model:',
            answer: 'Other',
            id: 'shoe_worn',
            type: 'questionAndAnswer',
          },
        ],
        id: 22566,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Shoe Make/Model (Other):',
            answer: 'Cheap',
            id: 'shoe_worn_other',
            type: 'questionAndAnswer',
          },
        ],
        id: 22567,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Other Shoe Silhouette Size:',
            answer: 'High-top',
            id: 'shoe_silhouette_size',
            type: 'questionAndAnswer',
          },
        ],
        id: 22568,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Other Shoe Model Type:',
            answer: 'Player Signature Shoe',
            id: 'shoe_model_type',
            type: 'questionAndAnswer',
          },
        ],
        id: 22569,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Other Shoe Release Year:',
            answer: '2021-22',
            id: 'shoe_release_year',
            type: 'questionAndAnswer',
          },
        ],
        id: 22570,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Request to add this shoe to the available search list:',
            answer: 'Yes',
            id: 'add_shoe_to_db',
            type: 'questionAndAnswer',
          },
        ],
        id: 22571,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Is the player wearing orthotics or inserts?',
            answer: 'Yes - Left Shoe Only',
            id: 'orthotic_worn',
            type: 'questionAndAnswer',
          },
        ],
        id: 22572,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Orthotic Type (Left):',
            answer: 'Medium Support',
            id: 'orthotic_type_left',
            type: 'questionAndAnswer',
          },
        ],
        id: 22573,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 22558,
    sidePanelSection: false,
  },
];
