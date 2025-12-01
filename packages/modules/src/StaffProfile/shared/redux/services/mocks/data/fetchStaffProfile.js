export const data = {
  id: null,
  organisation_id: 6,
  form: {
    id: 147,
    category: 'registration',
    group: 'kitman',
    key: 'staff-profile-v1',
    name: 'Staff Profile',
    fullname: 'Staff Profile',
    form_type: 'staff_profile',
    config: null,
    enabled: true,
    created_at: '2024-01-18T11:28:53Z',
    updated_at: '2024-01-18T11:28:53Z',
  },
  form_template_version: {
    id: 123,
    name: 'Staff Profile',
    version: 1,
    created_at: '2024-01-18T11:28:52Z',
    updated_at: '2024-01-18T11:28:52Z',
    editor: {
      id: 105694,
      firstname: 'Service',
      lastname: 'User',
      fullname: 'Service User',
    },
    config: {
      post_processors: [
        '::Forms::Private::PostProcessors::InternalSourceProcessor',
      ],
    },
    form_elements: [
      {
        id: 25135,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Staff Profile',
          element_id: 'staff_profile',
          custom_params: {
            columns: 1,
          },
          repeatable: false,
          optional: false,
        },
        visible: true,
        order: 1,
        form_elements: [
          {
            id: 25136,
            element_type: 'Forms::Elements::Layouts::Menu',
            config: {
              type: 'overview',
              title: 'Staff Profile',
              element_id: 'menu',
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 1,
            form_elements: [
              {
                id: 25137,
                element_type: 'Forms::Elements::Layouts::MenuGroup',
                config: {
                  title: 'User Details',
                  element_id: 'user',
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                order: 1,
                form_elements: [
                  {
                    id: 25138,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      title: 'User Details',
                      element_id: 'user_details',
                      repeatable: false,
                      optional: false,
                    },
                    visible: true,
                    order: 1,
                    form_elements: [
                      {
                        id: 25139,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'First name',
                          data_point: false,
                          element_id: 'username',
                          custom_params: {
                            internal_source: {
                              object: 'user',
                              field: 'firstname',
                            },
                          },
                          repeatable: false,
                          optional: false,
                        },
                        visible: true,
                        order: 1,
                        form_elements: [],
                      },
                      {
                        id: 25140,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'Email',
                          data_point: false,
                          element_id: 'user_email',
                          custom_params: {
                            type: 'email',
                            internal_source: {
                              object: 'user',
                              field: 'email',
                            },
                          },
                          repeatable: false,
                          optional: false,
                        },
                        visible: true,
                        order: 2,
                        form_elements: [],
                      },
                      {
                        id: 25141,
                        element_type: 'Forms::Elements::Inputs::DateTime',
                        config: {
                          type: 'date',
                          text: 'Date of birth',
                          data_point: false,
                          element_id: 'user_date_of_birth',
                          custom_params: {
                            internal_source: {
                              object: 'user',
                              field: 'date_of_birth',
                            },
                          },
                          repeatable: false,
                          optional: false,
                        },
                        visible: true,
                        order: 3,
                        form_elements: [],
                      },
                      {
                        id: 25142,
                        element_type: 'Forms::Elements::Inputs::SingleChoice',
                        config: {
                          data_source: 'locales',
                          text: 'Language',
                          data_point: false,
                          element_id: 'user_language',
                          custom_params: {
                            internal_source: {
                              object: 'user',
                              field: 'locale',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 4,
                        form_elements: [],
                      },
                      {
                        id: 25143,
                        element_type: 'Forms::Elements::Layouts::Group',
                        config: {
                          title: 'Squad access',
                          subtitle: 'Choose the squads the user has access to',
                          element_id: 'squad_group',
                          repeatable: false,
                          optional: false,
                        },
                        visible: true,
                        order: 5,
                        form_elements: [
                          {
                            id: 25144,
                            element_type:
                              'Forms::Elements::Inputs::MultipleChoice',
                            config: {
                              data_source: 'squads',
                              text: 'Squads',
                              data_point: false,
                              element_id: 'squads',
                              custom_params: {
                                internal_source: {
                                  object: 'user',
                                  field: 'staff_user_squads',
                                },
                              },
                              repeatable: false,
                              optional: false,
                            },
                            visible: true,
                            order: 1,
                            form_elements: [],
                          },
                        ],
                      },
                      {
                        id: 25145,
                        element_type: 'Forms::Elements::Layouts::Group',
                        config: {
                          title: 'General Permissions',
                          element_id: 'permissions_group',
                          repeatable: false,
                          optional: false,
                        },
                        visible: true,
                        order: 6,
                        form_elements: [
                          {
                            id: 25146,
                            element_type:
                              'Forms::Elements::Inputs::SingleChoice',
                            config: {
                              items: [
                                {
                                  value: 'todo',
                                  label: 'TODO',
                                },
                              ],
                              text: 'Group',
                              data_point: false,
                              element_id: 'general_permissions',
                              repeatable: false,
                              optional: false,
                            },
                            visible: true,
                            order: 1,
                            form_elements: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 25147,
                element_type: 'Forms::Elements::Layouts::MenuGroup',
                config: {
                  title: 'Staff Details',
                  element_id: 'staff',
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                order: 2,
                form_elements: [
                  {
                    id: 25148,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      title: 'Work and personal information',
                      element_id: 'work_personal',
                      repeatable: false,
                      optional: false,
                    },
                    visible: true,
                    order: 1,
                    form_elements: [
                      {
                        id: 25149,
                        element_type: 'Forms::Elements::Inputs::SingleChoice',
                        config: {
                          data_source: 'country_ids',
                          text: 'Country of birth',
                          data_point: false,
                          element_id: 'birth_country',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'country_of_birth',
                            },
                          },
                          repeatable: false,
                          optional: false,
                        },
                        visible: true,
                        order: 1,
                        form_elements: [],
                      },
                      {
                        id: 25150,
                        element_type: 'Forms::Elements::Inputs::SingleChoice',
                        config: {
                          items: [
                            {
                              value: 'M',
                              label: 'Male',
                            },
                            {
                              value: 'F',
                              label: 'Female',
                            },
                            {
                              value: 'O',
                              label: 'Other',
                            },
                          ],
                          text: 'Sex',
                          data_point: false,
                          element_id: 'gender',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'gender',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 2,
                        form_elements: [],
                      },
                      {
                        id: 25151,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'Kit Size',
                          data_point: false,
                          element_id: 'kit-size',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'kit_size',
                            },
                          },
                          repeatable: false,
                          optional: false,
                        },
                        visible: true,
                        order: 3,
                        form_elements: [],
                      },
                      {
                        id: 25152,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'General notes',
                          data_point: false,
                          element_id: 'general_notes',
                          custom_params: {
                            style: 'multiline',
                            view_formatted_value: true,
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'general_notes',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 4,
                        form_elements: [],
                      },
                    ],
                  },
                  {
                    id: 25153,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      title: 'Contact information',
                      element_id: 'contact_details',
                      repeatable: false,
                      optional: false,
                    },
                    visible: true,
                    order: 2,
                    form_elements: [
                      {
                        id: 25154,
                        element_type: 'Forms::Elements::Layouts::Group',
                        config: {
                          element_id: 'home_address_group',
                          custom_params: {
                            type: 'address',
                            columns: 2,
                          },
                          repeatable: false,
                          optional: false,
                        },
                        visible: true,
                        order: 1,
                        form_elements: [
                          {
                            id: 25155,
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'Home address 1',
                              data_point: false,
                              element_id: 'home_address_line1',
                              custom_params: {
                                internal_source: {
                                  object: 'address',
                                  field: 'line1',
                                  address: 'primary',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 1,
                            form_elements: [],
                          },
                          {
                            id: 25156,
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'Home address 2',
                              data_point: false,
                              element_id: 'home_address_line2',
                              custom_params: {
                                internal_source: {
                                  object: 'address',
                                  field: 'line2',
                                  address: 'primary',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 2,
                            form_elements: [],
                          },
                          {
                            id: 25157,
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'Home address 3',
                              data_point: false,
                              element_id: 'home_address_line3',
                              custom_params: {
                                internal_source: {
                                  object: 'address',
                                  field: 'line3',
                                  address: 'primary',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 3,
                            form_elements: [],
                          },
                          {
                            id: 25158,
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'Home zip/postal code',
                              data_point: false,
                              element_id: 'home_address_zip',
                              custom_params: {
                                internal_source: {
                                  object: 'address',
                                  field: 'zipcode',
                                  address: 'primary',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 4,
                            form_elements: [],
                          },
                          {
                            id: 25159,
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'Home city',
                              data_point: false,
                              element_id: 'home_address_city',
                              custom_params: {
                                internal_source: {
                                  object: 'address',
                                  field: 'city',
                                  address: 'primary',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 5,
                            form_elements: [],
                          },
                          {
                            id: 25160,
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'Home state/county',
                              data_point: false,
                              element_id: 'home_address_state',
                              custom_params: {
                                internal_source: {
                                  object: 'address',
                                  field: 'state',
                                  address: 'primary',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 6,
                            form_elements: [],
                          },
                          {
                            id: 25161,
                            element_type:
                              'Forms::Elements::Inputs::SingleChoice',
                            config: {
                              data_source: 'country_ids',
                              text: 'Home country',
                              data_point: false,
                              element_id: 'home_address_country_id',
                              custom_params: {
                                internal_source: {
                                  object: 'address',
                                  field: 'country_id',
                                  address: 'primary',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 7,
                            form_elements: [],
                          },
                        ],
                      },
                      {
                        id: 25162,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'Mobile number',
                          data_point: false,
                          element_id: 'user_phone',
                          custom_params: {
                            type: 'phone',
                            default_country_code: 'GB',
                            internal_source: {
                              object: 'user',
                              field: 'mobile_number',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 2,
                        form_elements: [],
                      },
                      {
                        id: 25163,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'Work phone number',
                          data_point: false,
                          element_id: 'user_work_phone',
                          custom_params: {
                            type: 'phone',
                            default_country_code: 'GB',
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'work_phone',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 3,
                        form_elements: [],
                      },
                      {
                        id: 25164,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'Staff Secondary email',
                          data_point: false,
                          element_id: 'home_email2',
                          custom_params: {
                            type: 'email',
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'secondary_email',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 4,
                        form_elements: [],
                      },
                    ],
                  },
                  {
                    id: 25165,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      title: 'Health insurance',
                      element_id: 'health_insurance',
                      repeatable: false,
                      optional: false,
                    },
                    visible: true,
                    order: 3,
                    form_elements: [
                      {
                        id: 25166,
                        element_type: 'Forms::Elements::Inputs::Boolean',
                        config: {
                          text: 'Has European Health Insurance (EHIC) card?',
                          data_point: false,
                          element_id: 'has_ehic',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'has_ehic',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 1,
                        form_elements: [],
                      },
                      {
                        id: 25167,
                        element_type: 'Forms::Elements::Layouts::Group',
                        config: {
                          element_id: 'ehic_group',
                          condition: {
                            type: '==',
                            value: true,
                            element_id: 'has_ehic',
                            value_type: 'boolean',
                          },
                          repeatable: false,
                          optional: false,
                        },
                        visible: true,
                        order: 2,
                        form_elements: [
                          {
                            id: 25168,
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'EHIC personal identification number',
                              data_point: false,
                              element_id: 'ehic_personal_id',
                              custom_params: {
                                internal_source: {
                                  object: 'user_profile_variable',
                                  field: 'ehic_personal_id_number',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 1,
                            form_elements: [],
                          },
                          {
                            id: 25169,
                            element_type: 'Forms::Elements::Inputs::DateTime',
                            config: {
                              type: 'date',
                              text: 'EHIC expiry date',
                              data_point: false,
                              element_id: 'ehic_expiry',
                              custom_params: {
                                internal_source: {
                                  object: 'user_profile_variable',
                                  field: 'ehic_expiry_date',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 2,
                            form_elements: [],
                          },
                          {
                            id: 25170,
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'EHIC card identification number',
                              data_point: false,
                              element_id: 'ehic_card_num',
                              custom_params: {
                                internal_source: {
                                  object: 'user_profile_variable',
                                  field: 'ehic_card_id_number',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 3,
                            form_elements: [],
                          },
                          {
                            id: 25171,
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'EHIC institution identification number',
                              data_point: false,
                              element_id: 'ehic_institution_num',
                              custom_params: {
                                internal_source: {
                                  object: 'user_profile_variable',
                                  field: 'ehic_institution_id_number',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 4,
                            form_elements: [],
                          },
                          {
                            id: 25172,
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'EHIC reference number',
                              data_point: false,
                              element_id: 'ehic_ref_num',
                              custom_params: {
                                internal_source: {
                                  object: 'user_profile_variable',
                                  field: 'ehic_reference_number',
                                },
                              },
                              repeatable: false,
                              optional: true,
                            },
                            visible: true,
                            order: 5,
                            form_elements: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 25173,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      title: 'Passport',
                      element_id: 'passport',
                      repeatable: false,
                      optional: false,
                    },
                    visible: true,
                    order: 4,
                    form_elements: [
                      {
                        id: 25174,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'Passport number',
                          data_point: false,
                          element_id: 'passport_number',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'passport_number',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 1,
                        form_elements: [],
                      },
                      {
                        id: 25175,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'Passport name',
                          data_point: false,
                          element_id: 'passport_name',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'passport_name',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 2,
                        form_elements: [],
                      },
                      {
                        id: 25176,
                        element_type: 'Forms::Elements::Inputs::DateTime',
                        config: {
                          type: 'date',
                          text: 'Passport expiry',
                          data_point: false,
                          element_id: 'passport_expiry',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'passport_expiry',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 3,
                        form_elements: [],
                      },
                      {
                        id: 25177,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'Passport issuing authority',
                          data_point: false,
                          element_id: 'passport_authority',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'passport_issuing_authority',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 4,
                        form_elements: [],
                      },
                      {
                        id: 25178,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'Passport type',
                          data_point: false,
                          element_id: 'passport_type',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'passport_type',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 5,
                        form_elements: [],
                      },
                    ],
                  },
                  {
                    id: 25179,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      title: 'Driving license',
                      element_id: 'driving',
                      repeatable: false,
                      optional: false,
                    },
                    visible: true,
                    order: 5,
                    form_elements: [
                      {
                        id: 25180,
                        element_type: 'Forms::Elements::Inputs::Text',
                        config: {
                          text: 'Driving license number',
                          data_point: false,
                          element_id: 'driving_license_num',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'driving_license_number',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 1,
                        form_elements: [],
                      },
                      {
                        id: 25181,
                        element_type: 'Forms::Elements::Inputs::SingleChoice',
                        config: {
                          data_source: 'country_ids',
                          text: 'Country of issue',
                          data_point: false,
                          element_id: 'driving_country',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'driving_license_country',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 2,
                        form_elements: [],
                      },
                      {
                        id: 25182,
                        element_type: 'Forms::Elements::Inputs::DateTime',
                        config: {
                          type: 'date',
                          text: 'Issue date',
                          data_point: false,
                          element_id: 'driving_issue',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'driving_license_issue_date',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 3,
                        form_elements: [],
                      },
                      {
                        id: 25183,
                        element_type: 'Forms::Elements::Inputs::DateTime',
                        config: {
                          type: 'date',
                          text: 'Expiry date',
                          data_point: false,
                          element_id: 'driving_expiry',
                          custom_params: {
                            internal_source: {
                              object: 'user_profile_variable',
                              field: 'driving_license_expiry_date',
                            },
                          },
                          repeatable: false,
                          optional: true,
                        },
                        visible: true,
                        order: 4,
                        form_elements: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  date: '2024-01-18T11:29:56Z',
  editor: null,
  form_answers: [],
  extra: null,
};

export default data;
