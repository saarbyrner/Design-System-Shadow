const data = {
  id: 293,
  category: 'medical',
  group: 'default_group',
  key: 'default_key',
  name: 'Test form template',
  fullname: 'Test edit mode',
  form_type: 'survey',
  config: null,
  enabled: true,
  created_at: '2024-09-19T08:53:38Z',
  updated_at: '2024-09-19T08:53:38Z',
  form_template: {
    id: 288,
    name: 'Test form template',
    last_template_version: {
      id: 324,
      name: 'Test form template',
      version: 1,
      created_at: '2024-09-19T08:53:38Z',
      updated_at: '2024-09-19T08:53:38Z',
      editor: {
        id: 161701,
        firstname: 'Juan',
        lastname: 'Gumy-admin-eu',
        fullname: 'Juan Gumy-admin-eu',
      },
      config: null,
      form_elements: [
        {
          id: 30028,
          element_type: 'Forms::Elements::Layouts::Section',
          config: {
            element_id: 'section',
          },
          visible: true,
          order: 1,
          form_elements: [
            {
              id: 30029,
              element_type: 'Forms::Elements::Layouts::Menu',
              config: {
                type: 'overview',
                element_id: 'b0551c5a-d01e-4d78-a0ab-3f6f8e795abc',
              },
              visible: true,
              order: 1,
              form_elements: [
                {
                  id: 30030,
                  element_type: 'Forms::Elements::Layouts::MenuGroup',
                  config: {
                    title: 'Section 1',
                    element_id: 'ca4bdede-707a-4c78-bf0c-aa766af76fe9',
                  },
                  visible: true,
                  order: 1,
                  form_elements: [
                    {
                      id: 30031,
                      element_type: 'Forms::Elements::Layouts::MenuItem',
                      config: {
                        title: 'Group 1.1',
                        element_id: '2bbb41b9-ae3d-4041-a9d3-30be5a885716',
                      },
                      visible: true,
                      order: 1,
                      form_elements: [
                        {
                          id: 30032,
                          element_type: 'Forms::Elements::Inputs::Attachment',
                          config: {
                            text: 'Attachment',
                            data_point: false,
                            element_id: 'd7d5e961-3f1a-4b3f-9947-8638ff4d3abc',
                            optional: true,
                          },
                          visible: true,
                          order: 1,
                          form_elements: [],
                        },
                        {
                          id: 30033,
                          element_type: 'Forms::Elements::Inputs::Boolean',
                          config: {
                            text: 'Boolean?',
                            data_point: false,
                            element_id: '419f5153-282e-4a48-a48a-b176ab606edc',
                            optional: true,
                          },
                          visible: true,
                          order: 1,
                          form_elements: [],
                        },
                        {
                          id: 30034,
                          element_type: 'Forms::Elements::Inputs::Number',
                          config: {
                            type: 'integer',
                            text: 'Hydration- Urine Osmolality',
                            data_point: true,
                            platform: 2,
                            source: 'kitman:tv',
                            variable: 'hydration_urine_osmolality',
                            element_id: '05129fd7-e6e0-4823-8e8e-1abc64929b16',
                            custom_params: {
                              unit: 'mOsmol/kg',
                            },
                            optional: true,
                          },
                          visible: true,
                          order: 1,
                          form_elements: [],
                        },
                      ],
                    },
                    {
                      id: 30035,
                      element_type: 'Forms::Elements::Layouts::MenuItem',
                      config: {
                        title: 'Group 1.2',
                        element_id: '2761a7f6-2f2a-42e4-aacd-2ed36829055a',
                      },
                      visible: true,
                      order: 1,
                      form_elements: [
                        {
                          id: 30036,
                          element_type: 'Forms::Elements::Inputs::SingleChoice',
                          config: {
                            items: [
                              {
                                color: '#7ab8c5',
                                label: 'Color',
                                value: 'color',
                                score: 6,
                              },
                            ],
                            text: 'Test single',
                            data_point: false,
                            element_id: '72c4e275-a945-47bb-aaab-3e0ab354e827',
                            custom_params: {},
                            optional: true,
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
          ],
        },
      ],
      status: 'published',
    },
    created_at: '2024-09-19T08:53:38Z',
    updated_at: '2024-09-19T08:53:38Z',
  },
  last_submitted: {},
};

export default data;
