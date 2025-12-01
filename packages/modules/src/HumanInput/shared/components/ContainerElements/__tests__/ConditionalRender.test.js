import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import ConditionalRender, {
  conditionBorderLeft,
} from '@kitman/modules/src/HumanInput/shared/components/ContainerElements/ConditionalRender';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultFormStateSlice = {
  form: {
    1: true,
  },
  elements: {
    my_element_id: {
      config: {
        data_point: false,
        element_id: 'my_element_id',
        text: 'My value',
      },
      element_type: 'Forms::Elements::Inputs::Text',
      form_elements: [],
      id: 1,
      order: 1,
      visible: true,
    },
  },
  config: {
    mode: 'EDIT',
  },
};

const defaultStore = {
  formStateSlice: defaultFormStateSlice,
};

const renderTestComponent = (props, store = defaultStore) => {
  const { container } = render(
    <Provider store={storeFake(store)}>
      <ConditionalRender {...props}>
        <>Test Component</>
      </ConditionalRender>
    </Provider>
  );

  return { container };
};

describe('<ConditionalRender/>', () => {
  const props = {
    element: {
      id: 1,
      config: {
        condition: {
          element_id: 'my_element_id',
          type: '==',
          value_type: 'boolean',
          value: true,
        },
      },
      form_elements: [],
    },
    children: jest.fn(),
  };

  it('renders the component because of condition', () => {
    const { container } = renderTestComponent(props);

    expect(screen.getByText('Test Component')).toBeInTheDocument();

    const visibleComponents = container.getElementsByClassName(
      'MuiCollapse-entered'
    );
    const hiddenComponents =
      container.getElementsByClassName('MuiCollapse-hidden');

    expect(visibleComponents).toHaveLength(1);
    expect(visibleComponents[0].querySelector('.MuiBox-root')).toHaveStyle({
      borderLeft: conditionBorderLeft,
    });

    expect(hiddenComponents).toHaveLength(0);
  });

  it('does not render the component because of condition', async () => {
    const customProps = {
      ...props,
      element: {
        ...props.element,
        config: {
          condition: {
            element_id: 'my_element_id',
            type: '==',
            value_type: 'boolean',
            value: false,
          },
        },
      },
    };

    const { container } = renderTestComponent(customProps);

    expect(screen.getByText('Test Component')).toBeInTheDocument();

    const visibleComponents = container.getElementsByClassName(
      'MuiCollapse-entered'
    );
    const hiddenComponents =
      container.getElementsByClassName('MuiCollapse-hidden');

    expect(visibleComponents).toHaveLength(0);

    expect(hiddenComponents).toHaveLength(1);
    expect(hiddenComponents[0].querySelector('.MuiBox-root')).toHaveStyle({
      borderLeft: '',
    });
  });
  it('renders the component when config mode matches the editableModes', async () => {
    const customProps = {
      ...props,
      element: {
        ...props.element,
        config: {
          custom_params: { editable_modes: ['EDIT'] },
        },
      },
    };

    const { container } = renderTestComponent(customProps);

    expect(screen.getByText('Test Component')).toBeInTheDocument();

    const visibleComponents = container.getElementsByClassName(
      'MuiCollapse-entered'
    );
    const hiddenComponents =
      container.getElementsByClassName('MuiCollapse-hidden');

    expect(visibleComponents).toHaveLength(1);
    expect(hiddenComponents).toHaveLength(0);
  });

  it('does not render the component when config mode does not match the editableModes', async () => {
    const customProps = {
      ...props,
      element: {
        ...props.element,
        config: {
          custom_params: { editable_modes: ['CREATE'] },
        },
      },
    };

    const { container } = renderTestComponent(customProps);

    expect(screen.getByText('Test Component')).toBeInTheDocument();

    const visibleComponents = container.getElementsByClassName(
      'MuiCollapse-entered'
    );
    const hiddenComponents =
      container.getElementsByClassName('MuiCollapse-hidden');

    expect(visibleComponents).toHaveLength(0);
    expect(hiddenComponents).toHaveLength(1);
  });

  it('does not render the component when config mode does not match the editableModes and condition is not satisfied', async () => {
    const customProps = {
      ...props,
      element: {
        ...props.element,
        config: {
          condition: {
            element_id: 'my_element_id',
            type: '==',
            value_type: 'boolean',
            value: false,
          },
          custom_params: { editable_modes: ['CREATE'] },
        },
      },
    };

    const { container } = renderTestComponent(customProps);

    expect(screen.getByText('Test Component')).toBeInTheDocument();

    const visibleComponents = container.getElementsByClassName(
      'MuiCollapse-entered'
    );
    const hiddenComponents =
      container.getElementsByClassName('MuiCollapse-hidden');

    expect(visibleComponents).toHaveLength(0);
    expect(hiddenComponents).toHaveLength(1);
  });

  it('does not render the component when config mode does not match the editableModes and condition is satisfied', async () => {
    const customProps = {
      ...props,
      element: {
        ...props.element,
        config: {
          condition: {
            element_id: 'my_element_id',
            type: '==',
            value_type: 'boolean',
            value: true,
          },
          custom_params: { editable_modes: ['CREATE'] },
        },
      },
    };

    const { container } = renderTestComponent(customProps);

    expect(screen.getByText('Test Component')).toBeInTheDocument();

    const visibleComponents = container.getElementsByClassName(
      'MuiCollapse-entered'
    );
    const hiddenComponents =
      container.getElementsByClassName('MuiCollapse-hidden');

    expect(visibleComponents).toHaveLength(0);
    expect(hiddenComponents).toHaveLength(1);
  });

  it('does not render the component when config mode matches the editableModes and condition is not satisfied', async () => {
    const customProps = {
      ...props,
      element: {
        ...props.element,
        config: {
          condition: {
            element_id: 'my_element_id',
            type: '==',
            value_type: 'boolean',
            value: false,
          },
          custom_params: { editable_modes: ['EDIT'] },
        },
      },
    };

    const { container } = renderTestComponent(customProps);

    expect(screen.getByText('Test Component')).toBeInTheDocument();

    const visibleComponents = container.getElementsByClassName(
      'MuiCollapse-entered'
    );
    const hiddenComponents =
      container.getElementsByClassName('MuiCollapse-hidden');

    expect(visibleComponents).toHaveLength(0);
    expect(hiddenComponents).toHaveLength(1);
  });
});
