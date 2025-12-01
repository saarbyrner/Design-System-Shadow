import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { useGetFormDataSourceItemsQuery } from '@kitman/services/src/services/humanInput/humanInput';

import Select from '@kitman/modules/src/HumanInput/shared/components/InputElements/Select';

jest.mock('@kitman/services/src/services/humanInput/humanInput', () => ({
  ...jest.requireActual('@kitman/services/src/services/humanInput/humanInput'),
  useGetFormDataSourceItemsQuery: jest.fn(),
}));

const MOCK_ELEMENT = {
  id: 20852,
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
    ],
    text: 'Is this a test?',
    data_point: false,
    element_id: 'ethnicity',
    optional: false,
    custom_params: {
      readonly: false,
    },
  },
  visible: true,
  order: 6,
  form_elements: [],
};

const DATA_SOURCE_ELEMENT = {
  id: 20852,
  element_type: 'Forms::Elements::Inputs::SingleChoice',
  config: {
    data_source: 'test',
    text: 'Is this a test?',
    data_point: false,
    element_id: 'ethnicity',
    optional: false,
    custom_params: {
      readonly: false,
    },
  },
  visible: true,
  order: 6,
  form_elements: [],
};

const DEPENDENT_DATA_SOURCE_ELEMENT = {
  id: 24091,
  element_type: 'Forms::Elements::Inputs::SingleChoice',
  config: {
    items: [],
    data_depends_on: 'shoe_brand',
    text: 'Shoe Model Selection',
    data_point: false,
    element_id: 'shoe_model',
    optional: false,
    custom_params: {
      data_depends_on: 'shoe_brand',
    },
  },
  visible: true,
  order: 6,
  form_elements: [],
};

const MOCK_ELEMENT_RADIO = {
  id: 20852,
  element_type: 'Forms::Elements::Inputs::SingleChoice',
  config: {
    custom_params: {
      style: 'radio',
      readonly: false,
    },
    items: [
      {
        value: 'option_1',
        label: 'Option 1',
      },
      {
        value: 'option_2',
        label: 'Option 2',
      },
    ],
    text: 'Radio buttons label',
    data_point: false,
    element_id: 'ethnicity',
    optional: false,
  },
  visible: true,
  order: 6,
  form_elements: [],
};

const MOCK_ELEMENT_TOGGLE = {
  id: 20852,
  element_type: 'Forms::Elements::Inputs::SingleChoice',
  config: {
    custom_params: {
      style: 'toggle',
      readonly: false,
    },
    items: [
      {
        value: 'option_1',
        label: 'Option 1',
      },
      {
        value: 'option_2',
        label: 'Option 2',
      },
    ],
    text: 'Toggle buttons label',
    data_point: false,
    element_id: 'kdhcwolekcajlk',
    optional: false,
  },
  visible: true,
  order: 6,
  form_elements: [],
};

const MOCK_ELEMENT_MULTI = {
  id: 24157,
  element_type: 'Forms::Elements::Inputs::MultipleChoice',
  config: {
    data_source: 'squads',
    text: 'Squad access',
    data_point: false,
    element_id: 'squads',
    custom_params: {
      internal_source: {
        object: 'staff',
        field: 'permitted_squads',
      },
    },
    repeatable: false,
    optional: false,
  },
  visible: true,
  order: 6,
  form_elements: [],
};

const props = {
  element: MOCK_ELEMENT,
  value: '',
  validationStatus: {
    status: 'PENDING',
    message: '',
  },
  multi: false,
  onChange: jest.fn(),
};

describe('<Select/>', () => {
  const renderComponent = (customProps = props, state = initialState) => {
    const { mockedStore } = renderWithRedux(<Select {...customProps} />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: { ...state },
      },
    });

    return mockedStore;
  };

  afterEach(() => {
    MOCK_ELEMENT.config.custom_params.readonly = false;
    DATA_SOURCE_ELEMENT.config.custom_params.readonly = false;
    MOCK_ELEMENT_RADIO.config.custom_params.readonly = false;
  });

  describe('response option tests', () => {
    it('renders', async () => {
      renderComponent();
      expect(screen.getByLabelText('Is this a test?')).toBeInTheDocument();

      const selectButton = screen.getByRole('button');
      expect(selectButton).not.toHaveClass('Mui-readOnly');

      await userEvent.click(selectButton);

      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('renders read only', async () => {
      MOCK_ELEMENT.config.custom_params.readonly = true;

      renderComponent();

      expect(screen.getByLabelText('Is this a test?')).toBeInTheDocument();

      const selectButton = screen.getByRole('button');

      await userEvent.click(selectButton);

      expect(screen.queryByText('Yes')).not.toBeInTheDocument();
      expect(screen.queryByText('No')).not.toBeInTheDocument();
    });
  });

  describe('data-source tests', () => {
    const footwearData = [
      {
        value: 'adidas',
        label: 'Adidas',
        children: [
          {
            label: 'Adizero',
            value: 'adizero',
          },
          {
            label: 'Adizero select',
            value: 'adizero_select',
          },
          {
            label: 'Adizero select 2.0',
            value: 'adizero_select_2_0',
          },
        ],
      },
      {
        value: 'nike',
        label: 'Nike',
        children: [
          {
            label: 'Air huarache',
            value: 'air_huarache',
          },
          {
            label: 'Air more uptempo',
            value: 'air_more_uptempo',
          },
          {
            label: 'Book 1',
            value: 'book_1',
          },
        ],
      },
    ];

    const showBrandElement = {
      id: 24090,
      element_type: 'Forms::Elements::Inputs::SingleChoice',
      config: {
        data_source: 'footwear_v2s',
        text: 'Shoe Brand Selection',
        data_point: false,
      },
    };

    beforeEach(() => {
      useGetFormDataSourceItemsQuery.mockReturnValue({
        data: [
          {
            value: 'yes',
            label: 'Yes',
          },
          {
            value: 'no',
            label: 'No',
          },
        ],
        isLoading: false,
        isError: false,
      });
    });

    it('options from data-source', async () => {
      renderComponent({ ...props, element: DATA_SOURCE_ELEMENT });

      expect(screen.getByLabelText('Is this a test?')).toBeInTheDocument();

      const selectButton = screen.getByRole('button');
      expect(selectButton).not.toHaveClass('Mui-readOnly');

      await userEvent.click(selectButton);

      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('options from data-source read only', async () => {
      DATA_SOURCE_ELEMENT.config.custom_params.readonly = true;

      renderComponent({ ...props, element: DATA_SOURCE_ELEMENT });

      expect(screen.getByLabelText('Is this a test?')).toBeInTheDocument();

      const selectButton = screen.getByRole('button');

      await userEvent.click(selectButton);

      expect(screen.queryByText('Yes')).not.toBeInTheDocument();
      expect(screen.queryByText('No')).not.toBeInTheDocument();
    });

    it('options from dependent data-source', async () => {
      useGetFormDataSourceItemsQuery.mockReturnValue({
        data: footwearData,
        isLoading: false,
        isError: false,
      });

      const localState = {
        ...initialState,
        form: {
          24090: 'adidas',
        },
        elements: {
          shoe_brand: showBrandElement,
        },
      };
      renderComponent(
        { ...props, element: DEPENDENT_DATA_SOURCE_ELEMENT },
        localState
      );

      expect(screen.getByLabelText('Shoe Model Selection')).toBeInTheDocument();

      const selectButton = screen.getByRole('button');
      expect(selectButton).not.toHaveClass('Mui-readOnly');

      await userEvent.click(selectButton);

      expect(screen.getByText('Adizero')).toBeInTheDocument();
      expect(screen.getByText('Adizero select')).toBeInTheDocument();
      expect(screen.getByText('Adizero select 2.0')).toBeInTheDocument();
    });

    it('options from dependent data-source - different answer value', async () => {
      useGetFormDataSourceItemsQuery.mockReturnValue({
        data: footwearData,
        isLoading: false,
        isError: false,
      });

      const localState = {
        ...initialState,
        form: {
          24090: 'nike',
        },
        elements: {
          shoe_brand: showBrandElement,
        },
      };
      renderComponent(
        { ...props, element: DEPENDENT_DATA_SOURCE_ELEMENT },
        localState
      );

      expect(screen.getByLabelText('Shoe Model Selection')).toBeInTheDocument();

      const selectButton = screen.getByRole('button');
      expect(selectButton).not.toHaveClass('Mui-readOnly');

      await userEvent.click(selectButton);

      expect(screen.queryByText('Adizero')).not.toBeInTheDocument();
      expect(screen.queryByText('Adizero select')).not.toBeInTheDocument();
      expect(screen.queryByText('Adizero select 2.0')).not.toBeInTheDocument();

      expect(screen.getByText('Air more uptempo')).toBeInTheDocument();
      expect(screen.getByText('Air huarache')).toBeInTheDocument();
      expect(screen.getByText('Book 1')).toBeInTheDocument();
    });
  });

  describe('Radio Element', () => {
    it('renders as radio buttons', () => {
      renderComponent({ ...props, element: MOCK_ELEMENT_RADIO });

      expect(screen.getByText('Radio buttons label')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).not.toHaveClass('Mui-disabled');
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).not.toHaveClass('Mui-disabled');
    });

    it('renders as radio buttons as disabled', () => {
      MOCK_ELEMENT_RADIO.config.custom_params.readonly = true;

      renderComponent({ ...props, element: MOCK_ELEMENT_RADIO });

      expect(screen.getByText('Radio buttons label')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toHaveClass('Mui-disabled');
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toHaveClass('Mui-disabled');
    });
  });

  describe('Toggle Element', () => {
    it('renders as toggle buttons', () => {
      renderComponent({ ...props, element: MOCK_ELEMENT_TOGGLE });

      expect(screen.getByText('Toggle buttons label')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).not.toHaveClass('Mui-disabled');
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).not.toHaveClass('Mui-disabled');
    });

    it('renders as toggle buttons as disabled', () => {
      MOCK_ELEMENT_TOGGLE.config.custom_params.readonly = true;

      renderComponent({ ...props, element: MOCK_ELEMENT_TOGGLE });

      expect(screen.getByText('Toggle buttons label')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toHaveClass('Mui-disabled');
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toHaveClass('Mui-disabled');
    });
  });

  describe('checkboxes', () => {
    it('should not include checkboxes for single select', async () => {
      useGetFormDataSourceItemsQuery.mockReturnValue({
        data: [
          { value: 'en-GB', label: 'English' },
          { value: 'he', label: 'Hebrew' },
        ],
        isLoading: false,
        isError: false,
      });

      const user = userEvent.setup();

      renderComponent();

      await user.click(await screen.findByLabelText(MOCK_ELEMENT.config.text));

      expect(screen.queryAllByRole('checkbox').length).toBe(0);
    });
    it('should include checkboxes for multiselect', async () => {
      const options = [
        {
          value: 1,
          label: 'International',
        },
        {
          value: 2,
          label: 'U18',
        },
      ];
      useGetFormDataSourceItemsQuery.mockReturnValue({
        data: options,
        isLoading: false,
        isError: false,
      });

      const multiProps = {
        ...props,
        multi: true,
        element: MOCK_ELEMENT_MULTI,
        value: [],
      };

      const user = userEvent.setup();

      renderComponent({ ...multiProps });

      await user.click(
        await screen.findByLabelText(MOCK_ELEMENT_MULTI.config.text)
      );

      expect(screen.getAllByRole('checkbox').length).toBe(options.length);
    });

    it('select should remain open after checkbox checked', async () => {
      const options = [
        {
          value: 1,
          label: 'International',
        },
        {
          value: 2,
          label: 'U18',
        },
      ];
      useGetFormDataSourceItemsQuery.mockReturnValue({
        data: options,
        isLoading: false,
        isError: false,
      });

      const multiProps = {
        ...props,
        multi: true,
        element: MOCK_ELEMENT_MULTI,
        value: [],
      };

      const user = userEvent.setup();

      renderComponent({ ...multiProps });

      await user.click(
        await screen.findByLabelText(MOCK_ELEMENT_MULTI.config.text)
      );

      await user.click(screen.getByRole('option', { name: 'International' }));
      await user.click(screen.getByRole('option', { name: 'U18' }));

      expect(screen.getAllByRole('checkbox').length).toBe(options.length);
    });
  });

  it('should clear the single select value when the clear button is clicked', async () => {
    const user = userEvent.setup();
    const customProps = { ...props, value: 'No' };

    renderComponent(customProps);

    const selectButton = await screen.findByLabelText(MOCK_ELEMENT.config.text);
    await user.click(selectButton);

    const yesOption = screen.getByRole('option', { name: 'Yes' });
    await user.click(yesOption);

    const clearButton = screen.getByTitle('Clear');
    await user.click(clearButton);

    expect(screen.getByLabelText('Is this a test?')).toBeInTheDocument();
    expect(props.onChange).toHaveBeenCalledWith('');
  });
});
