/* eslint-disable camelcase */

import {
  INPUT_ELEMENTS,
  LAYOUT_ELEMENTS,
  COMPOSITE_SECTIONS,
} from '@kitman/modules/src/HumanInput/shared/constants';

import { data } from '@kitman/modules/src/Scouts/shared/redux/services/mocks/data/mock_form_structure';

import {
  getDefaultValue,
  buildFormState,
  setFormAnswer,
  parseFormMenu,
  buildValidationState,
  parseMenuElement,
  createFormAnswersRequestBody,
  validateElement,
  extractByElementType,
} from '@kitman/modules/src/HumanInput/shared/utils';

describe('form state utils', () => {
  describe('getDefaultValue', () => {
    const assertions = [
      { case: INPUT_ELEMENTS.Attachment, expected: null },
      { case: INPUT_ELEMENTS.Boolean, expected: null },
      { case: INPUT_ELEMENTS.MultipleChoice, expected: [] },
      { case: INPUT_ELEMENTS.Number, expected: null },
      { case: INPUT_ELEMENTS.DateTime, expected: null },
      { case: INPUT_ELEMENTS.SingleChoice, expected: '' },
      { case: INPUT_ELEMENTS.Text, expected: '' },
      { case: 'UNKNOWNN', expected: {} },
    ];

    assertions.forEach((assertion) => {
      it(`sets the default value for ${assertion.case}`, () => {
        expect(getDefaultValue(assertion.case)).toEqual(assertion.expected);
      });
    });
  });

  describe('COMPOSITE_SECTIONS', () => {
    it('returns the correct COMPOSITE_SECTIONS', () => {
      expect(COMPOSITE_SECTIONS).toEqual([
        LAYOUT_ELEMENTS.Content,
        LAYOUT_ELEMENTS.Group,
        LAYOUT_ELEMENTS.Menu,
        LAYOUT_ELEMENTS.MenuGroup,
        LAYOUT_ELEMENTS.MenuItem,
        LAYOUT_ELEMENTS.Section,
      ]);
    });
  });

  describe('buildFormState', () => {
    describe('a simple form with a single Forms::Elements::Layouts::Section', () => {
      it('builds the correct form state for Forms::Elements::Layouts::Section', () => {
        const simpleSection = {
          id: 1,
          element_type: 'Forms::Elements::Layouts::Section',
          config: {
            title: 'Simple Section',
            element_id: 'simple_section',
          },
          visible: true,
          order: 1,
          form_elements: [
            { id: 1, element_type: INPUT_ELEMENTS.Text, optional: true },
            { id: 2, element_type: INPUT_ELEMENTS.Boolean, optional: true },
            {
              id: 3,
              element_type: INPUT_ELEMENTS.MultipleChoice,
              optional: true,
            },
            { id: 4, element_type: INPUT_ELEMENTS.Number, optional: true },
            { id: 5, element_type: INPUT_ELEMENTS.DateTime, optional: true },
            {
              id: 6,
              element_type: INPUT_ELEMENTS.SingleChoice,
              optional: true,
            },
            { id: 7, element_type: INPUT_ELEMENTS.Attachment, optional: true },
          ],
        };
        expect(buildFormState(simpleSection)).toEqual({
          1: '',
          2: null,
          3: [],
          4: null,
          5: null,
          6: '',
          7: null,
        });
      });
    });

    describe('a complex form with multiple Forms::Elements::Layouts::MenuGroup', () => {
      it('builds the correct form state', () => {
        const complexForm = {
          id: 1,
          element_type: 'Forms::Elements::Layouts::Section',
          config: {
            title: 'Simple Section',
            element_id: 'simple_section',
          },
          visible: true,
          order: 1,
          form_elements: [
            {
              id: 11,
              element_type: 'Forms::Elements::Layouts::Menu',
              config: {
                title: 'Menu',
                element_id: 'menu',
              },
              form_elements: [
                {
                  id: 111,
                  element_type: 'Forms::Elements::Layouts::MenuGroup',
                  config: {
                    title: 'MenuGroupOne',
                    element_id: 'menu_group_one',
                  },
                  visible: true,
                  order: 1,
                  form_elements: [
                    {
                      id: 1111,
                      element_type: 'Forms::Elements::Layouts::MenuItem',
                      config: {
                        title: 'MenuItemOneOne',
                        element_id: 'menu_item_one_one',
                      },
                      form_elements: [
                        {
                          id: 11111,
                          element_type: INPUT_ELEMENTS.Text,
                          optional: true,
                        },
                        {
                          id: 11112,
                          element_type: INPUT_ELEMENTS.Boolean,
                          optional: true,
                        },
                        {
                          id: 11113,
                          element_type: INPUT_ELEMENTS.MultipleChoice,
                          optional: true,
                        },
                        {
                          id: 11114,
                          element_type: INPUT_ELEMENTS.Number,
                          optional: true,
                        },
                        {
                          id: 11115,
                          element_type: INPUT_ELEMENTS.DateTime,
                          optional: true,
                        },
                        {
                          id: 11116,
                          element_type: INPUT_ELEMENTS.SingleChoice,
                          optional: true,
                        },
                        {
                          id: 11117,
                          element_type: INPUT_ELEMENTS.Attachment,
                          optional: true,
                        },
                      ],
                    },
                    {
                      id: 1112,
                      element_type: 'Forms::Elements::Layouts::MenuItem',
                      config: {
                        title: 'MenuItemOneTwo',
                        element_id: 'menu_item_one_two',
                      },
                      form_elements: [
                        {
                          id: 11121,
                          element_type: INPUT_ELEMENTS.Text,
                          optional: true,
                        },
                        {
                          id: 11122,
                          element_type: INPUT_ELEMENTS.Boolean,
                          optional: true,
                        },
                        {
                          id: 11123,
                          element_type: INPUT_ELEMENTS.MultipleChoice,
                          optional: true,
                        },
                        {
                          id: 11124,
                          element_type: INPUT_ELEMENTS.Number,
                          optional: true,
                        },
                        {
                          id: 11125,
                          element_type: INPUT_ELEMENTS.DateTime,
                          optional: true,
                        },
                        {
                          id: 11126,
                          element_type: INPUT_ELEMENTS.SingleChoice,
                          optional: true,
                        },
                        {
                          id: 11127,
                          element_type: INPUT_ELEMENTS.Attachment,
                          optional: true,
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 112,
                  element_type: 'Forms::Elements::Layouts::MenuGroup',
                  config: {
                    title: 'MenuGroupTwo',
                    element_id: 'menu_group_two',
                  },
                  visible: true,
                  order: 1,
                  form_elements: [
                    {
                      id: 1121,
                      element_type: 'Forms::Elements::Layouts::MenuItem',
                      config: {
                        title: 'MenuItemTwoOne',
                        element_id: 'menu_item_two_one',
                      },
                      form_elements: [
                        {
                          id: 11211,
                          element_type: INPUT_ELEMENTS.Text,
                          optional: true,
                        },
                        {
                          id: 11212,
                          element_type: INPUT_ELEMENTS.Boolean,
                          optional: true,
                        },
                        {
                          id: 11213,
                          element_type: INPUT_ELEMENTS.MultipleChoice,
                          optional: true,
                        },
                        {
                          id: 11214,
                          element_type: INPUT_ELEMENTS.Number,
                          optional: true,
                        },
                        {
                          id: 11215,
                          element_type: INPUT_ELEMENTS.DateTime,
                          optional: true,
                        },
                        {
                          id: 11216,
                          element_type: INPUT_ELEMENTS.SingleChoice,
                          optional: true,
                        },
                        {
                          id: 11217,
                          element_type: INPUT_ELEMENTS.Attachment,
                          optional: true,
                        },
                      ],
                    },
                    {
                      id: 1122,
                      element_type: 'Forms::Elements::Layouts::MenuItem',
                      config: {
                        title: 'MenuItemTwoTwo',
                        element_id: 'menu_item_two_two',
                      },
                      form_elements: [
                        {
                          id: 11221,
                          element_type: INPUT_ELEMENTS.Text,
                          optional: true,
                        },
                        {
                          id: 11222,
                          element_type: INPUT_ELEMENTS.Boolean,
                          optional: true,
                        },
                        {
                          id: 11223,
                          element_type: INPUT_ELEMENTS.MultipleChoice,
                          optional: true,
                        },
                        {
                          id: 11224,
                          element_type: INPUT_ELEMENTS.Number,
                          optional: true,
                        },
                        {
                          id: 11225,
                          element_type: INPUT_ELEMENTS.DateTime,
                          optional: true,
                        },
                        {
                          id: 11226,
                          element_type: INPUT_ELEMENTS.SingleChoice,
                          optional: true,
                        },
                        {
                          id: 11227,
                          element_type: INPUT_ELEMENTS.Attachment,
                          optional: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };
        expect(buildFormState(complexForm)).toEqual({
          11111: '',
          11112: null,
          11113: [],
          11114: null,
          11115: null,
          11116: '',
          11117: null,
          11121: '',
          11122: null,
          11123: [],
          11124: null,
          11125: null,
          11126: '',
          11127: null,
          11211: '',
          11212: null,
          11213: [],
          11214: null,
          11215: null,
          11216: '',
          11217: null,
          11221: '',
          11222: null,
          11223: [],
          11224: null,
          11225: null,
          11226: '',
          11227: null,
        });
      });
    });
  });

  describe('setFormAnswer', () => {
    describe('a simple form with a single Forms::Elements::Layouts::Section', () => {
      it('builds the correct form state answer if id is provided', () => {
        const formAnswer = {
          id: 947518,
          form_element: {
            id: 23630,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'First name',
              data_point: false,
              element_id: 'firstname',
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
            order: 2,
            form_elements: [],
          },
          value: 'Tomas',
          created_at: '2023-10-16T15:09:27Z',
          updated_at: '2023-10-16T15:09:27Z',
        };

        expect(setFormAnswer(formAnswer)).toEqual({
          23630: formAnswer.value,
        });
      });

      it('returns empty object answer if no id is provided', () => {
        const formAnswer = {
          id: 947518,
          form_element: {
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'First name',
              data_point: false,
              element_id: 'firstname',
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
            order: 2,
            form_elements: [],
          },
          value: 'Tomas',
          created_at: '2023-10-16T15:09:27Z',
          updated_at: '2023-10-16T15:09:27Z',
        };

        expect(setFormAnswer(formAnswer)).toEqual({});
      });
    });
  });
});

const buildFormMenuItem = (element_id, prefix = null) => {
  return {
    element_type: 'Forms::Elements::Layouts::MenuItem',
    config: {
      title: element_id.replace('_', ' '),
      element_id: `${prefix ? `${prefix}_` : ''}${element_id}`,
    },
    form_elements: [],
  };
};

describe('form menu utils', () => {
  describe('parseFormMenu', () => {
    it('correctly parses a simple form menu', () => {
      const simpleFormMenu = [
        {
          element_type: 'Forms::Elements::Layouts::Section',
          config: {
            title: 'Simple Section',
            element_id: 'simple_section',
          },
          visible: true,
          order: 1,
          form_elements: [
            {
              element_type: 'Forms::Elements::Layouts::Menu',
              config: {
                title: 'Menu Title',
                element_id: 'menu',
              },
              visible: true,
              order: 1,
              form_elements: [
                buildFormMenuItem('menuitem_1'),
                buildFormMenuItem('menuitem_2'),
                buildFormMenuItem('menuitem_3'),
              ],
            },
          ],
        },
      ];

      const expected = [
        {
          element_type: 'Forms::Elements::Layouts::Menu',
          fields: [],
          index: 0,
          items: [
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              index: 0,
              key: 'menuitem_1',
              title: 'menuitem 1',
              items: [],
              fields: [],
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              index: 1,
              key: 'menuitem_2',
              title: 'menuitem 2',
              items: [],
              fields: [],
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              index: 2,
              key: 'menuitem_3',
              title: 'menuitem 3',
              items: [],
              fields: [],
            },
          ],
          key: 'menu',
          title: 'Menu Title',
        },
      ];
      expect(parseFormMenu({ formElements: simpleFormMenu })).toEqual(expected);
    });

    it('correctly parses a complex form menu', () => {
      const complexFormMenu = [
        {
          element_type: 'Forms::Elements::Layouts::Section',
          config: {
            title: 'Simple Section',
            element_id: 'simple_section',
          },
          visible: true,
          order: 1,
          form_elements: [
            {
              element_type: 'Forms::Elements::Layouts::Menu',
              config: {
                title: 'Menu Title',
                element_id: 'menu',
              },
              visible: true,
              order: 1,
              form_elements: [
                {
                  element_type: 'Forms::Elements::Layouts::MenuGroup',
                  config: {
                    title: 'MenuGroup 1',
                    element_id: 'menugroup_1',
                  },
                  form_elements: [
                    buildFormMenuItem('menuitem_1'),
                    buildFormMenuItem('menuitem_2'),
                    buildFormMenuItem('menuitem_3'),
                  ],
                },
                {
                  element_type: 'Forms::Elements::Layouts::MenuGroup',
                  config: {
                    title: 'MenuGroup 2',
                    element_id: 'menugroup_2',
                  },
                  form_elements: [
                    buildFormMenuItem('menuitem_1'),
                    buildFormMenuItem('menuitem_2'),

                    {
                      element_type: 'Forms::Elements::Layouts::MenuGroup',
                      config: {
                        title: 'MenuGroup 2A',
                        element_id: 'menugroup_2A',
                      },
                      form_elements: [
                        buildFormMenuItem('menuitem_1'),
                        buildFormMenuItem('menuitem_2'),
                        buildFormMenuItem('menuitem_3'),
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const expected = [
        {
          fields: [],
          element_type: 'Forms::Elements::Layouts::Menu',
          index: 0,
          items: [
            {
              element_type: 'Forms::Elements::Layouts::MenuGroup',
              fields: [],
              index: 0,
              items: [
                {
                  element_type: 'Forms::Elements::Layouts::MenuItem',
                  fields: [],
                  index: 0,
                  key: 'menuitem_1',
                  title: 'menuitem 1',
                  items: [],
                },
                {
                  element_type: 'Forms::Elements::Layouts::MenuItem',
                  fields: [],
                  index: 1,
                  key: 'menuitem_2',
                  title: 'menuitem 2',
                  items: [],
                },
                {
                  element_type: 'Forms::Elements::Layouts::MenuItem',
                  fields: [],
                  index: 2,
                  key: 'menuitem_3',
                  title: 'menuitem 3',
                  items: [],
                },
              ],
              key: 'menugroup_1',
              title: 'MenuGroup 1',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuGroup',
              fields: [],
              index: 1,
              items: [
                {
                  element_type: 'Forms::Elements::Layouts::MenuItem',
                  fields: [],
                  index: 0,
                  key: 'menuitem_1',
                  title: 'menuitem 1',
                  items: [],
                },
                {
                  element_type: 'Forms::Elements::Layouts::MenuItem',
                  fields: [],
                  index: 1,
                  key: 'menuitem_2',
                  title: 'menuitem 2',
                  items: [],
                },
                {
                  element_type: 'Forms::Elements::Layouts::MenuGroup',
                  fields: [],
                  index: 2,
                  items: [
                    {
                      element_type: 'Forms::Elements::Layouts::MenuItem',
                      fields: [],
                      index: 0,
                      key: 'menuitem_1',
                      title: 'menuitem 1',
                      items: [],
                    },
                    {
                      element_type: 'Forms::Elements::Layouts::MenuItem',
                      fields: [],
                      index: 1,
                      key: 'menuitem_2',
                      title: 'menuitem 2',
                      items: [],
                    },
                    {
                      element_type: 'Forms::Elements::Layouts::MenuItem',
                      fields: [],
                      index: 2,
                      key: 'menuitem_3',
                      title: 'menuitem 3',
                      items: [],
                    },
                  ],
                  key: 'menugroup_2A',
                  title: 'MenuGroup 2A',
                },
              ],
              key: 'menugroup_2',
              title: 'MenuGroup 2',
            },
          ],
          key: 'menu',
          title: 'Menu Title',
        },
      ];
      expect(parseFormMenu({ formElements: complexFormMenu })).toEqual(
        expected
      );
    });
  });
  describe('parseMenuElement', () => {
    it('correctly returns the keys for a complex form', () => {
      const complexFormMenu =
        data[61].form_template_version.form_elements[0].form_elements[0];

      const expected = {
        element_type: 'Forms::Elements::Layouts::Menu',
        fields: [
          2692, 2693, 2694, 2696, 2697, 2698, 2699, 2699, 2700, 2701, 2702,
          2703, 2704, 2706, 2707, 2711, 2712, 2713, 2714, 2715, 2716, 2708,
          2717, 2709, 2719, 2721, 2722, 2723, 2724, 2727, 2729, 2731, 2733,
          2734, 2737, 2739, 2741, 2743, 2745, 2747, 2749, 2750, 2751, 2752,
          2753, 2754, 2755, 2756, 2757, 2758, 2759, 2760, 2762, 2763, 2764,
          2765, 2766, 2768, 2769, 2770, 2771, 2774,
        ],
        index: 0,
        items: [
          {
            element_type: 'Forms::Elements::Layouts::MenuGroup',
            fields: [
              2692, 2693, 2694, 2696, 2697, 2698, 2699, 2699, 2700, 2701, 2702,
              2703, 2704, 2706, 2707, 2711, 2712, 2713, 2714, 2715, 2716, 2708,
              2717, 2709, 2719, 2721, 2722, 2723, 2724,
            ],
            index: 0,
            items: [
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [
                  2692, 2693, 2694, 2696, 2697, 2698, 2699, 2699, 2700, 2701,
                  2702, 2703, 2704,
                ],
                index: 0,
                items: [],
                key: 'playerdetails',
                title: 'Player Details',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [
                  2706, 2707, 2711, 2712, 2713, 2714, 2715, 2716, 2708, 2717,
                  2709,
                ],
                index: 1,
                items: [],
                key: 'parentguardian',
                title: 'Parents/ Guardian',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2719, 2721, 2722, 2723, 2724],
                index: 2,
                items: [],
                key: 'insurance',
                title: 'Insurance',
              },
            ],
            key: 'personal_details',
            title: 'Personal Details',
          },
          {
            element_type: 'Forms::Elements::Layouts::MenuGroup',
            fields: [2727, 2729, 2731, 2733, 2734],
            index: 1,
            items: [
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2727],
                index: 0,
                items: [],
                key: 'attachment_section_headshot',
                title: 'Headshot',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2729],
                index: 1,
                items: [],
                key: 'attachment_section_proof_of_birth',
                title: 'Proof of Birth',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2731],
                index: 2,
                items: [],
                key: 'attachment_section_impact_baseline',
                title: 'ImPACT Baseline Test',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2733, 2734],
                index: 3,
                items: [],
                key: 'attachment_section_itc',
                title: 'International Transfer Certificate',
              },
            ],
            key: 'attachments',
            title: 'Documents',
          },
          {
            element_type: 'Forms::Elements::Layouts::MenuGroup',
            fields: [
              2737, 2739, 2741, 2743, 2745, 2747, 2749, 2750, 2751, 2752, 2753,
              2754, 2755, 2756, 2757, 2758, 2759, 2760, 2762, 2763, 2764, 2765,
              2766, 2768, 2769, 2770, 2771,
            ],
            index: 2,
            items: [
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2737],
                index: 0,
                items: [],
                key: 'acknowledgement_privacy_policy_section',
                title: 'Privacy Policy',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2739],
                index: 1,
                items: [],
                key: 'acknowledgement_health_information_release_section',
                title:
                  'Player Authorization for the Release of Health Information',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2741],
                index: 2,
                items: [],
                key: 'acknowledgement_rules_regulations_section',
                title: 'Rules and Regulations',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2743],
                index: 3,
                items: [],
                key: 'acknowledgement_participant_waiver_section',
                title: 'Participant Agreement and Waiver',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2745],
                index: 4,
                items: [],
                key: 'acknowledgement_code_conduct_section',
                title: 'Code of Conduct',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2747],
                index: 5,
                items: [],
                key: 'acknowledgement_mls_next_section',
                title: 'MLS NEXT Acknowledgements',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [
                  2749, 2750, 2751, 2752, 2753, 2754, 2755, 2756, 2757, 2758,
                  2759, 2760,
                ],
                index: 6,
                items: [],
                key: 'acknowledgement_diversity_section',
                title: 'Diversity, Equity and Inclusion',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2762, 2763, 2764, 2765, 2766],
                index: 7,
                items: [],
                key: 'acknowledgement_housing_section',
                title: '23/24 Housing Information',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2768, 2769, 2770, 2771],
                index: 8,
                items: [],
                key: 'signatures',
                title: 'Signature',
              },
            ],
            key: 'policies',
            title: 'Policies & Signatures',
          },
          {
            element_type: 'Forms::Elements::Layouts::MenuGroup',
            fields: [2774],
            index: 3,
            items: [
              {
                element_type: 'Forms::Elements::Layouts::MenuItem',
                fields: [2774],
                index: 0,
                items: [],
                key: 'attachment_safesport_section',
                title: 'SafeSport',
              },
            ],
            key: 'courses',
            title: 'Courses',
          },
        ],
        key: 'menu',
        title: 'MLS Next 23/24',
      };
      expect(parseMenuElement({ element: complexFormMenu, index: 0 })).toEqual(
        expected
      );
    });
    it('correctly returns the keys for a simple form', () => {
      const simpleFormMenu = buildFormMenuItem('menuitem_1');

      const expected = {
        element_type: 'Forms::Elements::Layouts::MenuItem',
        fields: [],
        index: 0,
        items: [],
        key: 'menuitem_1',
        title: 'menuitem 1',
      };
      expect(parseMenuElement({ element: simpleFormMenu, index: 0 })).toEqual(
        expected
      );
    });
  });
});

describe('form validation utils', () => {
  describe('buildValidationState', () => {
    describe('a simple form with a single Forms::Elements::Layouts::Section', () => {
      it('correctly builds the validation for a simple form', () => {
        const simpleSection = {
          id: 1,
          element_type: 'Forms::Elements::Layouts::Section',
          config: {
            title: 'Simple Section',
            element_id: 'simple_section',
          },
          visible: true,
          order: 1,
          form_elements: [
            {
              id: 1,
              element_type: INPUT_ELEMENTS.Text,
              config: { optional: true },
            },
            {
              id: 2,
              element_type: INPUT_ELEMENTS.Text,
              config: { optional: true },
            },
            {
              id: 3,
              element_type: INPUT_ELEMENTS.Text,
              config: { optional: false },
            },
            {
              id: 4,
              element_type: INPUT_ELEMENTS.Text,
              config: { optional: false },
            },
            {
              id: 5,
              element_type: INPUT_ELEMENTS.Text,
              config: { optional: false },
            },
            {
              id: 6,
              element_type: INPUT_ELEMENTS.Text,
              config: { optional: true },
            },
            {
              id: 7,
              element_type: INPUT_ELEMENTS.Text,
              config: { optional: false },
            },
            {
              id: 8,
              element_type: INPUT_ELEMENTS.Text,
              config: { optional: true },
            },
            {
              id: 9,
              element_type: INPUT_ELEMENTS.Text,
              config: { optional: true },
            },
            {
              id: 10,
              element_type: INPUT_ELEMENTS.Text,
              config: { optional: false },
            },
          ],
        };
        expect(buildValidationState(simpleSection)).toEqual({
          1: { message: null, status: 'VALID' },
          2: { message: null, status: 'VALID' },
          3: { message: null, status: 'PENDING' },
          4: { message: null, status: 'PENDING' },
          5: { message: null, status: 'PENDING' },
          6: { message: null, status: 'VALID' },
          7: { message: null, status: 'PENDING' },
          8: { message: null, status: 'VALID' },
          9: { message: null, status: 'VALID' },
          10: { message: null, status: 'PENDING' },
        });
      });
    });
    it('correctly builds the validation for a complex form', () => {
      const complexForm = {
        id: 1,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Simple Section',
          element_id: 'simple_section',
        },
        visible: true,
        order: 1,
        form_elements: [
          {
            id: 11,
            element_type: 'Forms::Elements::Layouts::Menu',
            config: {
              title: 'Menu',
              element_id: 'menu',
            },
            form_elements: [
              {
                id: 111,
                element_type: 'Forms::Elements::Layouts::MenuGroup',
                config: {
                  title: 'MenuGroupOne',
                  element_id: 'menu_group_one',
                },
                visible: true,
                order: 1,
                form_elements: [
                  {
                    id: 1112,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      title: 'MenuItemOneOne',
                      element_id: 'menu_item_one_one',
                    },
                    form_elements: [
                      {
                        id: 11121,
                        element_type: INPUT_ELEMENTS.Text,
                        config: {
                          optional: true,
                        },
                      },
                      {
                        id: 11122,
                        element_type: INPUT_ELEMENTS.Text,
                        config: {},
                      },
                    ],
                  },
                  {
                    id: 1113,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      title: 'MenuItemOneTwo',
                      element_id: 'menu_item_one_two',
                    },
                    form_elements: [
                      {
                        id: 11131,
                        element_type: INPUT_ELEMENTS.Text,
                        config: { optional: true },
                      },
                      {
                        id: 11132,
                        element_type: INPUT_ELEMENTS.Text,
                        config: {},
                      },
                    ],
                  },
                ],
              },
              {
                id: 112,
                element_type: 'Forms::Elements::Layouts::MenuGroup',
                config: {
                  title: 'MenuGroupTwo',
                  element_id: 'menu_group_two',
                },
                visible: true,
                order: 1,
                form_elements: [
                  {
                    id: 1121,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      title: 'MenuItemTwoOne',
                      element_id: 'menu_item_two_one',
                    },
                    form_elements: [
                      {
                        id: 11211,
                        element_type: INPUT_ELEMENTS.Text,
                        config: { optional: true },
                      },
                      {
                        id: 11212,
                        element_type: INPUT_ELEMENTS.Text,
                        config: {},
                      },
                    ],
                  },
                  {
                    id: 1122,
                    element_type: 'Forms::Elements::Layouts::MenuItem',
                    config: {
                      title: 'MenuItemTwoTwo',
                      element_id: 'menu_item_two_two',
                    },
                    form_elements: [
                      {
                        id: 11221,
                        element_type: INPUT_ELEMENTS.Text,
                        config: { optional: true },
                      },
                      {
                        id: 11222,
                        element_type: INPUT_ELEMENTS.Text,
                        config: {},
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      expect(buildValidationState(complexForm)).toEqual({
        11121: {
          message: null,
          status: 'VALID',
        },
        11122: {
          message: null,
          status: 'PENDING',
        },
        11131: {
          message: null,
          status: 'VALID',
        },
        11132: {
          message: null,
          status: 'PENDING',
        },
        11211: {
          message: null,
          status: 'VALID',
        },
        11212: {
          message: null,
          status: 'PENDING',
        },
        11221: {
          message: null,
          status: 'VALID',
        },
        11222: {
          message: null,
          status: 'PENDING',
        },
      });
    });

    it('correctly builds the validation for form with default_value as a custom_param', () => {
      const form = {
        id: 1,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Simple Section',
          element_id: 'simple_section',
        },
        visible: true,
        order: 1,
        form_elements: [
          {
            id: 20810,
            element_type: 'Forms::Elements::Layouts::Menu',
            config: {
              title: 'Event',
              element_id: 'event',
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
                      title: 'Details',
                      element_id: 'details',
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
                        id: 'division',
                        element_type: 'Forms::Elements::Inputs::SingleChoice',

                        config: {
                          items: [
                            { value: 'home', label: 'Home' },
                            { value: 'away', label: 'Away' },
                          ],
                          text: 'Division',
                          data_point: false,
                          element_id: 'division',
                          optional: false,
                          custom_params: {
                            columns: 2,
                            default_value: 'home',
                          },
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
      };

      expect(buildValidationState(form)).toEqual({
        division: {
          message: null,
          status: 'VALID',
        },
        firstname: {
          message: null,
          status: 'PENDING',
        },
        lastname: {
          message: null,
          status: 'PENDING',
        },
      });
    });
  });

  describe('validateElement', () => {
    describe('required fields', () => {
      it('validate Forms::Elements::Inputs::Text element as Invalid if value is empty', () => {
        const element = {
          id: 24156,
          element_type: 'Forms::Elements::Inputs::Text',
          config: {
            text: 'First name',
            data_point: false,
            element_id: 'firstname',
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
        };
        const value = '';

        expect(validateElement(element, value)).toEqual({
          message: 'First name is required',
          status: 'INVALID',
        });
      });

      it('validate Forms::Elements::Inputs::Text element as Valid if value is not empty', () => {
        const element = {
          id: 24156,
          element_type: 'Forms::Elements::Inputs::Text',
          config: {
            text: 'First name',
            data_point: false,
            element_id: 'firstname',
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
        };
        const value = 'Juan Nicolas';

        expect(validateElement(element, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });

      it('validate Forms::Elements::Inputs::MultipleChoice element as Invalid if value is empty array', () => {
        const element = {
          id: 24162,
          element_type: 'Forms::Elements::Inputs::MultipleChoice',
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
        };
        const value = [];

        expect(validateElement(element, value)).toEqual({
          message: 'Squads is required',
          status: 'INVALID',
        });
      });

      it('validate Forms::Elements::Inputs::MultipleChoice element as Valid if value is not empty array', () => {
        const element = {
          id: 24162,
          element_type: 'Forms::Elements::Inputs::MultipleChoice',
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
        };
        const value = ['U21'];

        expect(validateElement(element, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });

      it('validate Forms::Elements::Inputs::DateTime element as Invalid if value is not a valid date', () => {
        const element = {
          id: 24159,
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
          order: 4,
          form_elements: [],
        };
        const value = '12/MM/YYYY';

        expect(validateElement(element, value)).toEqual({
          message: 'Date of birth is required',
          status: 'INVALID',
        });
      });

      it('validate Forms::Elements::Inputs::DateTime element as Valid if value is a valid date', () => {
        const element = {
          id: 24159,
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
          order: 4,
          form_elements: [],
        };
        const value = '12/12/2023';

        expect(validateElement(element, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });

      it('validate Forms::Elements::Inputs::SingleChoice element as Invalid if value is empty', () => {
        const element = {
          id: 24166,
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
            optional: false,
          },
          visible: true,
          order: 2,
          form_elements: [],
        };
        const value = '';

        expect(validateElement(element, value)).toEqual({
          message: 'Sex is required',
          status: 'INVALID',
        });
      });

      it('validate Forms::Elements::Inputs::SingleChoice element as Valid if value is not empty', () => {
        const element = {
          id: 24166,
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
            optional: false,
          },
          visible: true,
          order: 2,
          form_elements: [],
        };
        const value = 'M';

        expect(validateElement(element, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });
    });

    describe('Optional fields', () => {
      it('validate Forms::Elements::Inputs::Text element as Valid if value is empty', () => {
        const element = {
          id: 24156,
          element_type: 'Forms::Elements::Inputs::Text',
          config: {
            text: 'First name',
            data_point: false,
            element_id: 'firstname',
            custom_params: {
              internal_source: {
                object: 'user',
                field: 'firstname',
              },
            },
            repeatable: false,
            optional: true,
          },
          visible: true,
          order: 1,
          form_elements: [],
        };
        const value = '';

        expect(validateElement(element, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });

      it('validate Forms::Elements::Inputs::Text element as Valid if value is not empty', () => {
        const element = {
          id: 24156,
          element_type: 'Forms::Elements::Inputs::Text',
          config: {
            text: 'First name',
            data_point: false,
            element_id: 'firstname',
            custom_params: {
              internal_source: {
                object: 'user',
                field: 'firstname',
              },
            },
            repeatable: false,
            optional: true,
          },
          visible: true,
          order: 1,
          form_elements: [],
        };
        const value = 'Juan';

        expect(validateElement(element, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });

      it('validate Forms::Elements::Inputs::MultipleChoice element as Valid if value is empty array', () => {
        const element = {
          id: 24162,
          element_type: 'Forms::Elements::Inputs::MultipleChoice',
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
            optional: true,
          },
          visible: true,
          order: 1,
          form_elements: [],
        };
        const value = [];

        expect(validateElement(element, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });

      it('validate Forms::Elements::Inputs::MultipleChoice element as Valid if value is not empty array', () => {
        const element = {
          id: 24162,
          element_type: 'Forms::Elements::Inputs::MultipleChoice',
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
            optional: true,
          },
          visible: true,
          order: 1,
          form_elements: [],
        };
        const value = ['U21'];

        expect(validateElement(element, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });

      it('validate Forms::Elements::Inputs::SingleChoice element as Valid if value is empty', () => {
        const element = {
          id: 24166,
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
        };
        const value = '';

        expect(validateElement(element, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });

      it('validate Forms::Elements::Inputs::SingleChoice element as Valid if value is not empty', () => {
        const element = {
          id: 24166,
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
        };
        const value = 'M';

        expect(validateElement(element, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });
    });

    describe('Phone number fields', () => {
      const phoneElement = {
        id: 24179,
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
      };

      it('validate phone number element as Invalid if phone code is not empty and phone number value is empty', () => {
        const value = '+353';

        expect(validateElement(phoneElement, value)).toEqual({
          message: 'Please complete full Work phone number',
          status: 'INVALID',
        });
      });

      it('validate phone number element as Valid if phone code is not empty and phone number value is not empty', () => {
        const value = '+3530831113333';

        expect(validateElement(phoneElement, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });

      it('validate phone number element as Valid if element is optional and phone code is empty and phone number value is empty', () => {
        const value = '';

        expect(validateElement(phoneElement, value)).toEqual({
          message: null,
          status: 'VALID',
        });
      });

      it('validate phone number element as required if element is not optional', () => {
        const value = '';

        expect(
          validateElement(
            {
              ...phoneElement,
              config: { ...phoneElement.config, optional: false },
            },
            value
          )
        ).toEqual({
          message: 'Work phone number is required',
          status: 'INVALID',
        });
      });

      it('validate phone number element as required if element is not optional and only country code is selected', () => {
        const value = '+353';

        expect(
          validateElement(
            {
              ...phoneElement,
              config: { ...phoneElement.config, optional: false },
            },
            value
          )
        ).toEqual({
          message: 'Work phone number is required',
          status: 'INVALID',
        });
      });
    });

    describe('Email fields', () => {
      const emailElement = (optionalValue = true) => {
        return {
          id: 24179,
          element_type: 'Forms::Elements::Inputs::Text',
          config: {
            text: 'Work email',
            data_point: false,
            element_id: 'user_email',
            custom_params: {
              type: 'email',
            },
            repeatable: false,
            optional: optionalValue,
          },
          visible: true,
          order: 3,
          form_elements: [],
        };
      };

      const requiredTestCases = [
        {
          description: 'validate email element as valid',
          email: 'test@kitmanlabs.com',
          validationValue: {
            status: 'VALID',
            message: null,
          },
        },
        {
          description:
            'validate email element as invalid when email does not have a @',
          email: 'testkitmanlabs.com',
          validationValue: {
            message: 'Please enter a valid email',
            status: 'INVALID',
          },
        },
        {
          description:
            'validate email element as invalid when email does not have a .',
          email: 'test@kitmanlabscom',
          validationValue: {
            message: 'Please enter a valid email',
            status: 'INVALID',
          },
        },
        {
          description:
            'validate email element as invalid when email is empty string',
          email: '',
          validationValue: {
            message: 'Please enter a valid email',
            status: 'INVALID',
          },
        },
      ];

      const optionalTestCases = [
        {
          description: 'validate email element as valid',
          email: 'test@kitmanlabs.com',
          validationValue: {
            status: 'VALID',
            message: null,
          },
        },
        {
          description:
            'validate email element as invalid when email does not have a @',
          email: 'testkitmanlabs.com',
          validationValue: {
            message: 'Please enter a valid email',
            status: 'INVALID',
          },
        },
        {
          description:
            'validate email element as invalid when email does not have a .',
          email: 'test@kitmanlabscom',
          validationValue: {
            message: 'Please enter a valid email',
            status: 'INVALID',
          },
        },
        {
          description:
            'validate email element as invalid when email is empty string',
          email: '',
          validationValue: {
            status: 'VALID',
            message: null,
          },
        },
      ];

      it.each(requiredTestCases)(
        'required - $description',
        ({ email, validationValue }) =>
          expect(validateElement(emailElement(false), email)).toEqual(
            validationValue
          )
      );

      it.each(optionalTestCases)(
        'optional - $description',
        ({ email, validationValue }) =>
          expect(validateElement(emailElement(), email)).toEqual(
            validationValue
          )
      );
    });
  });
});

describe('Number field', () => {
  const numberElement = {
    id: 1997,
    element_type: 'Forms::Elements::Inputs::Number',
    config: {
      type: 'integer',
      text: 'Total Time Traveled in Plane (Hours)',
      data_point: false,
      element_id: 'total_time_traveled_hours',
      custom_params: {
        unit: 'hours',
      },
      optional: true,
      min: '0',
      max: '100',
    },
    visible: true,
    order: 2,
    form_elements: [],
  };

  it('validate number element as valid', () => {
    const value = 10;

    expect(validateElement(numberElement, value)).toEqual({
      message: null,
      status: 'VALID',
    });
  });

  it('validate number element as valid if its 0 and required', () => {
    const value = 0;

    expect(
      validateElement(
        {
          ...numberElement,
          config: { ...numberElement.config, optional: false },
        },
        value
      )
    ).toEqual({
      message: null,
      status: 'VALID',
    });
  });

  it('validate number element as valid if its 0 and optional', () => {
    const value = 0;

    expect(validateElement(numberElement, value)).toEqual({
      message: null,
      status: 'VALID',
    });
  });

  it('validate number element as  invalid if its not a number and required', () => {
    const value = null;

    expect(
      validateElement(
        {
          ...numberElement,
          config: { ...numberElement.config, optional: false },
        },
        value
      )
    ).toEqual({
      message: 'Total Time Traveled in Plane (Hours) is required',
      status: 'INVALID',
    });
  });

  it('validate number element as Invalid if value is below minium required value', () => {
    const value = -100;

    expect(validateElement(numberElement, value)).toEqual({
      message:
        'Total Time Traveled in Plane (Hours) is below the minimum value of 0',
      status: 'INVALID',
    });
  });

  it('validate number element as Invalid if value is above maximum required value', () => {
    const value = 101;

    expect(validateElement(numberElement, value)).toEqual({
      message:
        'Total Time Traveled in Plane (Hours) is above the maximum value of 100',
      status: 'INVALID',
    });
  });

  it('validate number element as Invalid if value is a string', () => {
    const value = '101';

    expect(validateElement(numberElement, value)).toEqual({
      message:
        'Total Time Traveled in Plane (Hours) is above the maximum value of 100',
      status: 'INVALID',
    });
  });
});

describe('common utils', () => {
  describe('createFormAnswersRequestBody', () => {
    test('createFormAnswersRequestBody', () => {
      const formAnswersSetId = 1;
      const answers = {
        1: 'test',
        2: 'utility',
      };

      const result = createFormAnswersRequestBody(formAnswersSetId, answers);

      expect(result.form_answers_set.id).toEqual(formAnswersSetId);
      expect(result.answers).toHaveLength(2);

      const testAnswer = result.answers.find(
        (answer) => answer.form_element_id === 1
      );
      expect(testAnswer.form_element_id).toEqual(1);
      expect(testAnswer.value).toEqual('test');

      const utilityAnswer = result.answers.find(
        (answer) => answer.form_element_id === 2
      );
      expect(utilityAnswer.form_element_id).toEqual(2);
      expect(utilityAnswer.value).toEqual('utility');
    });
  });
});

describe('extractByElementType', () => {
  const assertions = [
    { elementType: 'Forms::Elements::Layouts::Content', count: 11 },
    { elementType: 'Forms::Elements::Layouts::Group', count: 2 },
    { elementType: 'Forms::Elements::Layouts::Menu', count: 1 },
    { elementType: 'Forms::Elements::Layouts::MenuGroup', count: 4 },
    { elementType: 'Forms::Elements::Layouts::MenuItem', count: 17 },
    { elementType: 'Forms::Elements::Layouts::Section', count: 0 },
    { elementType: 'Forms::Elements::Inputs::Attachment', count: 5 },
    { elementType: 'Forms::Elements::Inputs::Boolean', count: 13 },
    { elementType: 'Forms::Elements::Inputs::DateTime', count: 5 },
    { elementType: 'Forms::Elements::Inputs::MultipleChoice', count: 2 },
    { elementType: 'Forms::Elements::Inputs::Number', count: 0 },
    { elementType: 'Forms::Elements::Inputs::Range', count: 0 },
    { elementType: 'Forms::Elements::Inputs::SingleChoice', count: 8 },
    { elementType: 'Forms::Elements::Inputs::Text', count: 29 },
  ];

  const complexFormMenu =
    data[61].form_template_version.form_elements[0].form_elements[0];

  test.each(assertions)(
    'does return the count of $count for $elementType',
    ({ count, elementType }) => {
      expect(
        extractByElementType({
          formElement: complexFormMenu,
          elementType,
        })
      ).toHaveLength(count);
    }
  );
});
