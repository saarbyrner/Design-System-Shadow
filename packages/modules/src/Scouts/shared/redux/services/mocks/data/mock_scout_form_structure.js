// @flow
const SCOUT_FORM = {
  id: 1,
  category: 'registration',
  group: 'scout_registration',
  key: 'scout_23_24',
  name: 'MLS Scout Registration 23/24',
  fullname: 'MLS Scout Registration 23/24',
  form_type: null,
  config: null,
  enabled: true,
  created_at: '2023-07-13T10:31:50Z',
  updated_at: '2023-07-13T10:31:50Z',
  form_template_version: {
    id: 41,
    name: 'mls_scout_registration_form_23_24',
    version: 1,
    created_at: '2023-07-13T10:31:43Z',
    updated_at: '2023-07-13T10:31:43Z',

    form_elements: [
      {
        id: 20810,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Registration',
          element_id: 'section_menu',
        },
        visible: true,
        order: 1,
        form_elements: [
          {
            id: 20810,
            element_type: 'Forms::Elements::Layouts::Menu',
            config: {
              title: 'MLS Scout 23/24',
              element_id: 'menu',
            },
            visible: true,
            order: 1,
            form_elements: [
              {
                id: 2690,
                element_type: 'Forms::Elements::Layouts::MenuGroup',
                config: {
                  title: 'Personal Details',
                  element_id: 'personal_details',
                },
                visible: true,
                order: 1,
                form_elements: [
                  {
                    id: 2691,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      registration: {
                        statusable: true,
                        default_status: 'approved',
                      },
                      title: 'Scout Details',
                      element_id: 'scoutdetails',
                    },
                    visible: true,
                    order: 1,
                    form_elements: [
                      {
                        id: 24123,
                        element_type: 'Forms::Elements::Layouts::Group',
                        config: {
                          element_id: 'home_address_group',
                          repeatable: false,
                          optional: false,
                          custom_params: {
                            columns: 2,
                          },
                        },
                        visible: true,
                        order: 1,
                        form_elements: [
                          {
                            id: 'firstname',
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'First Name',
                              data_point: false,
                              element_id: 'firstname',
                              optional: false,
                              custom_params: {
                                columns: 2,
                              },
                            },
                            visible: true,
                            order: 1,
                            form_elements: [],
                          },
                          {
                            id: 'lastname',
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'Last Name',
                              data_point: false,
                              element_id: 'lastname',
                              optional: false,
                              custom_params: {
                                columns: 2,
                              },
                            },
                            visible: true,
                            order: 3,
                            form_elements: [],
                          },
                          {
                            id: 'email',
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'Email',
                              data_point: false,
                              element_id: 'email',
                              custom_params: { type: 'email', columns: 2 },
                              optional: false,
                            },
                            visible: true,
                            order: 8,
                            form_elements: [],
                          },
                          {
                            id: 'date_of_birth',
                            element_type: 'Forms::Elements::Inputs::DateTime',
                            config: {
                              type: 'date',
                              text: 'Date of Birth',
                              data_point: false,
                              element_id: 'date_of_birth',
                              optional: false,
                              custom_params: {
                                columns: 2,
                              },
                            },
                            visible: true,
                            order: 5,
                            form_elements: [],
                          },
                          {
                            id: 'division',
                            element_type:
                              'Forms::Elements::Inputs::SingleChoice',

                            config: {
                              items: [{ value: 'MLS Next', label: 'MLS Next' }],
                              text: 'Division',
                              data_point: false,
                              element_id: 'division',
                              optional: false,
                              custom_params: {
                                columns: 2,
                                default_value: 'MLS Next',
                              },
                            },
                            visible: true,
                            order: 4,
                            form_elements: [],
                          },
                          {
                            id: 'locale',
                            element_type:
                              'Forms::Elements::Inputs::SingleChoice',
                            config: {
                              items: [
                                { label: 'English', value: 'en' },
                                { label: 'English (AU)', value: 'en-AU' },
                                { label: 'English (GB)', value: 'en-GB' },
                                { label: 'English (IE)', value: 'en-IE' },
                                { label: 'English (NZ)', value: 'en-NZ' },
                                { label: 'English (US)', value: 'en-US' },
                                { label: 'French', value: 'fr' },
                                { label: 'Italian', value: 'it' },
                                { label: 'German', value: 'de' },
                                { label: 'Spanish', value: 'es' },
                                { label: 'Chinese (Taiwan)', value: 'zh-TW' },
                                { label: 'Japanese', value: 'ja' },
                                { label: 'Portuguese (PT)', value: 'pt-PT' },
                                { label: 'Portuguese (BR)', value: 'pt-BR' },
                                { label: 'Polish', value: 'pl' },
                                { label: 'Netherlands (Dutch)', value: 'nl' },
                                { label: 'Turkish', value: 'tr' },
                              ],
                              text: 'Language',
                              data_point: false,
                              element_id: 'locale',
                              optional: false,
                              custom_params: {
                                columns: 2,
                              },
                            },
                            visible: true,
                            order: 4,
                            form_elements: [],
                          },
                          {
                            id: 'third_party_scout_organisation',
                            element_type: 'Forms::Elements::Inputs::Text',
                            config: {
                              text: 'Organisation',
                              data_point: false,
                              element_id: 'third_party_scout_organisation',
                              optional: true,
                              custom_params: {
                                columns: 2,
                              },
                            },
                            visible: true,
                            order: 3,
                            form_elements: [],
                          },
                          {
                            id: 'is_active',
                            element_type:
                              'Forms::Elements::Inputs::SingleChoice',
                            config: {
                              optional: false,
                              data_point: false,
                              text: 'Status',
                              element_id: 'is_active',
                              custom_params: {
                                style: 'radio',
                                editable_modes: ['EDIT'],
                                default_value: true,
                              },
                              items: [
                                {
                                  value: true,
                                  label: 'Active',
                                },
                                {
                                  value: false,
                                  label: 'Inactive',
                                },
                              ],
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
            ],
          },
        ],
      },
    ],
  },
};

export default SCOUT_FORM;
