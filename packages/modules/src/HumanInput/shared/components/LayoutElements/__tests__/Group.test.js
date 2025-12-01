import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';

import Group from '@kitman/modules/src/HumanInput/shared/components/LayoutElements/Group';

const SIMPLE_GROUP_ELEMENT = {
  id: 480,
  element_type: 'Forms::Elements::Layouts::Group',
  config: {
    element_id: 'group_immediately_removed',
    title: 'Simple Group Title',
    custom_params: {
      show_title: true,
    },
  },
  visible: true,
  order: 2,
  form_elements: [
    {
      id: 481,
      element_type: 'Forms::Elements::Inputs::Number',
      config: {
        type: 'integer',
        text: 'If not immediately removed, how many (min) did athlete continue to play?',
        data_point: false,
        element_id: 'continued_to_play_mins',
        custom_params: {
          unit: 'mins',
        },
        optional: true,
      },
      visible: true,
      order: 1,
      form_elements: [],
    },
    {
      id: 482,
      element_type: 'Forms::Elements::Inputs::SingleChoice',
      config: {
        items: [
          {
            value: 'yes',
            label: 'Yes',
          },
          {
            value: 'no',
            label: 'No',
          },
          {
            value: 'unknown',
            label: 'Unknown',
          },
        ],
        text: 'Did athlete sustain additional impacts following injury?',
        data_point: false,
        element_id: 'sustained_additional_impacts',
        optional: true,
      },
      visible: true,
      order: 2,
      form_elements: [],
    },
  ],
};

const REPEATABLE_GROUP_ELEMENT = {
  id: 20866,
  element_type: 'Forms::Elements::Layouts::Group',
  config: {
    element_id: 'supplements',
    repeatable: true,
    title: 'Supplements',
    custom_params: {
      show_title: true,
    },
  },
  visible: true,
  order: 3,
  form_elements: [
    {
      id: 20867,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Name of supplement',
        data_point: false,
        element_id: 'supplement_name',
        optional: false,
      },
      visible: true,
      order: 1,
      form_elements: [],
    },
    {
      id: 20868,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Dosage',
        data_point: false,
        element_id: 'supplement_dosage',
        optional: false,
      },
      visible: true,
      order: 2,
      form_elements: [],
    },
    {
      id: 20869,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Main ingredients',
        data_point: false,
        element_id: 'supplement_main_ingredients',
        optional: true,
      },
      visible: true,
      order: 3,
      form_elements: [],
    },
    {
      id: 20870,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Comments (current use or past use)',
        data_point: false,
        element_id: 'supplement_comments',
        optional: true,
      },
      visible: true,
      order: 4,
      form_elements: [],
    },
  ],
};

const props = {
  element: SIMPLE_GROUP_ELEMENT,
  mode: 'EDIT',
};

const initialState = {
  formStateSlice: { form: { 481: '', 482: '' }, elements: {} },
  formValidationSlice: {
    validation: { 481: { status: 'VALID' }, 482: { status: 'VALID' } },
  },
};

const renderComponent = (customProps = props, customState = initialState) => {
  const { mockedStore } = renderWithRedux(<Group {...customProps} />, {
    useGlobalStore: false,
    preloadedState: customState,
  });

  return mockedStore;
};

describe('<Group/>', () => {
  describe('Regular Group Element', () => {
    it('renders', () => {
      renderComponent();

      expect(screen.getByText('Simple Group Title')).toBeInTheDocument();

      expect(
        screen.getByText(
          'If not immediately removed, how many (min) did athlete continue to play?'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(
          'Did athlete sustain additional impacts following injury?'
        )
      ).toBeInTheDocument();
    });

    it('renders - hides title', () => {
      const customProps = {
        ...props,
        element: {
          ...props.element,
          config: {
            ...props.element.config,
            custom_params: {
              ...props.element.config.custom_params,
              show_title: false,
            },
          },
        },
      };
      renderComponent(customProps);

      expect(screen.queryByText('Simple Group Title')).not.toBeInTheDocument();

      expect(
        screen.getByText(
          'If not immediately removed, how many (min) did athlete continue to play?'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(
          'Did athlete sustain additional impacts following injury?'
        )
      ).toBeInTheDocument();
    });

    it('renders collapsible version if custom_params.type equals collapsible', async () => {
      const user = userEvent.setup();

      const COLLAPSIBLE_GROUP_ELEMENT = {
        id: 480,
        element_type: 'Forms::Elements::Layouts::Group',
        config: {
          element_id: 'group_immediately_removed',
          title: 'Collapsible Group Title',
          custom_params: {
            type: 'collapsible',
          },
        },
        visible: true,
        order: 2,
        form_elements: [
          {
            id: 481,
            element_type: 'Forms::Elements::Inputs::Number',
            config: {
              type: 'integer',
              text: 'If not immediately removed, how many (min) did athlete continue to play?',
              data_point: false,
              element_id: 'continued_to_play_mins',
              custom_params: {
                unit: 'mins',
              },
              optional: true,
            },
            visible: true,
            order: 1,
            form_elements: [],
          },
          {
            id: 482,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'yes',
                  label: 'Yes',
                },
                {
                  value: 'no',
                  label: 'No',
                },
                {
                  value: 'unknown',
                  label: 'Unknown',
                },
              ],
              text: 'Did athlete sustain additional impacts following injury?',
              data_point: false,
              element_id: 'sustained_additional_impacts',
              optional: true,
            },
            visible: true,
            order: 2,
            form_elements: [],
          },
        ],
      };
      renderComponent({ ...props, element: COLLAPSIBLE_GROUP_ELEMENT });

      const expandGroupAccordionButton = screen.getByTestId('ExpandMoreIcon');
      expect(expandGroupAccordionButton).toBeInTheDocument();

      await user.click(expandGroupAccordionButton);

      expect(screen.getByText('Collapsible Group Title')).toBeInTheDocument();

      expect(
        screen.getByText(
          'If not immediately removed, how many (min) did athlete continue to play?'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(
          'Did athlete sustain additional impacts following injury?'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Repeatable Group Element', () => {
    const localProps = {
      element: REPEATABLE_GROUP_ELEMENT,
      mode: 'EDIT',
    };

    const localState = {
      formStateSlice: {
        form: { 20867: [], 20868: [], 20869: [], 20870: [] },
        elements: {},
      },
      formValidationSlice: {
        validation: { 20867: [], 20868: [], 20869: [], 20870: [] },
      },
    };

    it('renders', () => {
      renderComponent(localProps, localState);

      expect(screen.getByText('Name of supplement')).toBeInTheDocument();
      expect(screen.getByLabelText('Dosage')).toBeInTheDocument();
      expect(screen.getByLabelText('Main ingredients')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Comments (current use or past use)')
      ).toBeInTheDocument();
    });

    it('renders - shows title', () => {
      renderComponent(localProps, localState);

      expect(screen.getByText('Supplements')).toBeInTheDocument();
    });

    it('renders - hides title', () => {
      const customProps = {
        ...localProps,
        element: {
          ...localProps.element,
          config: {
            ...localProps.element.config,
            custom_params: {
              ...localProps.element.config.custom_params,
              show_title: false,
            },
          },
        },
      };
      renderComponent(customProps, localState);

      expect(screen.queryByText('Supplements')).not.toBeInTheDocument();
    });

    it('renders the group repeated 3 times based on form answers', () => {
      const customState = {
        formStateSlice: {
          form: {
            20867: [
              'name of suplement 1',
              'name of suplement 2',
              'name of suplement 3',
            ],
            20868: ['dosage 1', 'dosage 2', 'dosage 3'],
            20869: ['ingredients 1', 'ingredients 2', 'ingredients 3'],
            20870: ['a comment', null, null],
          },
          elements: {},
        },
        formValidationSlice: {
          validation: {
            20867: [
              { status: 'VALID', message: 'null' },
              { status: 'VALID', message: 'null' },
              { status: 'VALID', message: 'null' },
            ],
            20868: [
              { status: 'VALID', message: 'null' },
              { status: 'VALID', message: 'null' },
              { status: 'VALID', message: 'null' },
            ],
            20869: [
              { status: 'VALID', message: 'null' },
              { status: 'VALID', message: 'null' },
              { status: 'VALID', message: 'null' },
            ],
            20870: [
              { status: 'VALID', message: 'null' },
              { status: 'VALID', message: 'null' },
              { status: 'VALID', message: 'null' },
            ],
          },
        },
      };

      renderComponent(localProps, customState);

      expect(screen.getAllByText('Name of supplement')).toHaveLength(3);
      expect(screen.getAllByText('Dosage')).toHaveLength(3);
      expect(screen.getAllByText('Main ingredients')).toHaveLength(3);
      expect(
        screen.getAllByText('Comments (current use or past use)')
      ).toHaveLength(3);

      // answers group 1
      expect(
        screen.getByDisplayValue('name of suplement 1')
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('dosage 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('ingredients 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('a comment')).toBeInTheDocument();

      // answers group 2
      expect(
        screen.getByDisplayValue('name of suplement 2')
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('dosage 2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('ingredients 2')).toBeInTheDocument();

      // answers group 3
      expect(
        screen.getByDisplayValue('name of suplement 3')
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('dosage 3')).toBeInTheDocument();
      expect(screen.getByDisplayValue('ingredients 3')).toBeInTheDocument();

      expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(
        2
      );
      expect(
        screen.getByRole('button', {
          name: /add/i,
        })
      ).toBeInTheDocument();
    });

    it('renders a new dinamic group when clicking add group button', async () => {
      const user = userEvent.setup();

      const customState = {
        formStateSlice: {
          form: {
            20867: ['name of suplement 1'],
            20868: ['dosage 1'],
            20869: ['ingredients 1'],
            20870: ['a comment'],
          },
          elements: {},
        },
        formValidationSlice: {
          validation: {
            20867: [{ status: 'VALID', message: 'null' }],
            20868: [{ status: 'VALID', message: 'null' }],
            20869: [{ status: 'VALID', message: 'null' }],
            20870: [{ status: 'VALID', message: 'null' }],
          },
        },
      };

      renderComponent(localProps, customState);

      expect(screen.getByText('Name of supplement')).toBeInTheDocument();
      expect(screen.getByText('Dosage')).toBeInTheDocument();
      expect(screen.getByText('Main ingredients')).toBeInTheDocument();
      expect(
        screen.getByText('Comments (current use or past use)')
      ).toBeInTheDocument();

      const addButton = screen.getByRole('button', {
        name: /add/i,
      });

      expect(addButton).toBeInTheDocument();

      await user.click(addButton);

      expect(screen.getAllByText('Name of supplement')).toHaveLength(2);
      expect(screen.getAllByText('Dosage')).toHaveLength(2);
      expect(screen.getAllByText('Main ingredients')).toHaveLength(2);
      expect(
        screen.getAllByText('Comments (current use or past use)')
      ).toHaveLength(2);

      expect(
        screen.getByRole('button', { name: /delete/i })
      ).toBeInTheDocument();
    });

    it('removes a repeated group when clicking delete group button', async () => {
      const user = userEvent.setup();

      const customState = {
        formStateSlice: {
          form: {
            20867: ['name of suplement 1'],
            20868: ['dosage 1'],
            20869: ['ingredients 1'],
            20870: ['a comment'],
          },
          elements: {},
        },
        formValidationSlice: {
          validation: {
            20867: [{ status: 'VALID', message: 'null' }],
            20868: [{ status: 'VALID', message: 'null' }],
            20869: [{ status: 'VALID', message: 'null' }],
            20870: [{ status: 'VALID', message: 'null' }],
          },
        },
      };

      renderComponent(localProps, customState);

      const addButton = screen.getByRole('button', {
        name: /add/i,
      });

      expect(addButton).toBeInTheDocument();

      await user.click(addButton);

      expect(screen.getAllByText('Name of supplement')).toHaveLength(2);
      expect(screen.getAllByText('Dosage')).toHaveLength(2);
      expect(screen.getAllByText('Main ingredients')).toHaveLength(2);
      expect(
        screen.getAllByText('Comments (current use or past use)')
      ).toHaveLength(2);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(screen.getByText('Name of supplement')).toBeInTheDocument();
      expect(screen.getByText('Dosage')).toBeInTheDocument();
      expect(screen.getByText('Main ingredients')).toBeInTheDocument();
      expect(
        screen.getByText('Comments (current use or past use)')
      ).toBeInTheDocument();
    });

    it('renders validation for a required field label inside a repeated group', async () => {
      const customState = {
        formStateSlice: {
          config: { mode: 'EDIT' },
          form: {
            20867: [null],
            20868: [null],
            20869: ['ingredients 1'],
            20870: ['a comment'],
          },
          elements: {},
        },
        formValidationSlice: {
          validation: {
            20867: [
              { status: 'INVALID', message: 'Name of supplement is required' },
            ],
            20868: [{ status: 'INVALID', message: 'Dosage is required' }],
            20869: [{ status: 'VALID', message: 'null' }],
            20870: [{ status: 'VALID', message: 'null' }],
          },
        },
      };

      renderComponent(localProps, customState);

      expect(
        screen.getByText('Name of supplement is required')
      ).toBeInTheDocument();
      expect(screen.getByText('Dosage is required')).toBeInTheDocument();
    });

    it('does not render add group and delete group buttons on VIEW mode', async () => {
      const customState = {
        formStateSlice: {
          config: { mode: 'VIEW' },
          form: {
            20867: ['name of supplement 1'],
            20868: ['dosage 1'],
            20869: ['ingredients 1'],
            20870: ['a comment'],
          },
          elements: {},
        },
        formValidationSlice: {
          validation: {
            20867: [{ status: 'VALID', message: 'null' }],
            20868: [{ status: 'VALID', message: 'null' }],
            20869: [{ status: 'VALID', message: 'null' }],
            20870: [{ status: 'VALID', message: 'null' }],
          },
        },
      };

      renderComponent({ ...localProps, mode: 'VIEW' }, customState);

      expect(
        screen.queryByRole('button', { name: /delete/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /add/i })
      ).not.toBeInTheDocument();
    });
  });
});
