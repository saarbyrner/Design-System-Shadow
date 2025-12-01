import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import Select from '@kitman/modules/src/HumanInput/shared/components/InputElements/Select';
import TextInput from '@kitman/modules/src/HumanInput/shared/components/InputElements/TextInput';
import NumberInput from '@kitman/modules/src/HumanInput/shared/components/InputElements/Number';

import DateTime from '@kitman/modules/src/HumanInput/shared/components/InputElements/DateTime';
import { initialState as initialFormMenuState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import CommonInputElement from '@kitman/modules/src/HumanInput/shared/components/ContainerElements/CommonInputElement';
import Answer from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const dummyElement = {
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
};

const dummyElementOptional = {
  1: {
    config: {
      data_point: false,
      element_id: 'my_element_id',
      text: 'My value',
      optional: true,
    },
    element_type: 'Forms::Elements::Inputs::Text',
    form_elements: [],
    id: 1,
    order: 1,
    visible: true,
  },
};

const defaultFormStateSlice = {
  form: {
    1: 'my_value',
  },
  elements: {
    1: dummyElement,
  },
  structure: {
    form_answers: [
      {
        id: 1,
        form_element: dummyElement,
        value: 'my_value',
        value_formatted: null,
        created_at: '',
        updated_at: '',
      },
    ],
  },
  config: {
    mode: MODES.EDIT,
  },
};

const defaultValidationSlice = {
  validation: {
    1: {
      status: 'PENDING',
      message: null,
    },
  },
};

const defaultStore = {
  formStateSlice: defaultFormStateSlice,
  formMenuSlice: initialFormMenuState,
  formValidationSlice: defaultValidationSlice,
};

const renderInputElement = (elementProps, ElementType, defaultValueStore) => {
  render(
    <Provider store={storeFake(defaultValueStore)}>
      <CommonInputElement element={elementProps}>
        {({ value, validationStatus, onChange }) => (
          <ElementType
            element={elementProps}
            value={value}
            onChange={onChange}
            validationStatus={validationStatus}
          />
        )}
      </CommonInputElement>
    </Provider>
  );
};

describe('<CommonInputElement/>', () => {
  const props = {
    element: {
      config: {
        data_point: false,
        element_id: 'my_element_id',
        text: 'My value',
        optional: true,
      },
      element_type: 'Forms::Elements::Inputs::Text',
      form_elements: [],
      id: 1,
      order: 1,
      visible: true,
    },
  };
  const Child = () => <h3>My Input</h3>;

  it('renders', () => {
    render(
      <Provider store={storeFake(defaultStore)}>
        <CommonInputElement {...props}>{() => <Child />}</CommonInputElement>
      </Provider>
    );
    expect(screen.getByText('My Input')).toBeInTheDocument();
  });

  it('renders the optional text', () => {
    const localStore = {
      ...defaultStore,
      formStateSlice: {
        form: {
          1: 'my_value',
          2: 'my_value_2',
          3: 'my_value_3',
        },
        elements: {
          1: dummyElementOptional,
          2: {
            config: {
              data_point: false,
              element_id: 'my_element_id_2',
              text: 'My value 2',
              optional: false,
            },
            element_type: 'Forms::Elements::Inputs::Text',
            form_elements: [],
            id: 1,
            order: 1,
            visible: true,
          },
          3: {
            config: {
              data_point: false,
              element_id: 'my_element_id_3',
              text: 'My value 3',
              optional: false,
            },
            element_type: 'Forms::Elements::Inputs::Text',
            form_elements: [],
            id: 1,
            order: 1,
            visible: true,
          },
        },
        structure: {
          form_answers: [
            {
              id: 1,
              form_element: dummyElement,
              value: 'my_value',
              value_formatted: null,
              created_at: '',
              updated_at: '',
            },
          ],
        },
        config: {
          mode: MODES.EDIT,
        },
      },
    };
    render(
      <Provider store={storeFake(localStore)}>
        <CommonInputElement {...props}>{() => <Child />}</CommonInputElement>
      </Provider>
    );
    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  it('renders the required text', () => {
    const localStore = {
      ...defaultStore,
      formStateSlice: {
        form: {
          1: 'my_value',
          2: 'my_value_2',
          3: 'my_value_3',
        },
        elements: {
          1: {
            config: {
              data_point: false,
              element_id: 'my_element_id',
              text: 'My value',
              optional: false,
            },
            element_type: 'Forms::Elements::Inputs::Text',
            form_elements: [],
            id: 1,
            order: 1,
            visible: true,
          },
          2: {
            config: {
              data_point: false,
              element_id: 'my_element_id_2',
              text: 'My value 2',
              optional: true,
            },
            element_type: 'Forms::Elements::Inputs::Text',
            form_elements: [],
            id: 1,
            order: 1,
            visible: true,
          },
          3: {
            config: {
              data_point: false,
              element_id: 'my_element_id_3',
              text: 'My value 3',
              optional: true,
            },
            element_type: 'Forms::Elements::Inputs::Text',
            form_elements: [],
            id: 1,
            order: 1,
            visible: true,
          },
        },
        config: {
          mode: MODES.EDIT,
        },
      },
    };
    render(
      <Provider store={storeFake(localStore)}>
        <CommonInputElement
          element={{
            ...props.element,
            config: { ...props.element.config, optional: false },
          }}
        >
          {() => <Child />}
        </CommonInputElement>
      </Provider>
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('renders the error state', () => {
    const localStore = {
      ...defaultStore,
      formValidationSlice: {
        validation: {
          1: {
            status: 'INVALID',
            message: 'This field is required',
          },
        },
      },
    };
    render(
      <Provider store={storeFake(localStore)}>
        <CommonInputElement {...props}>{() => <Child />}</CommonInputElement>
      </Provider>
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders the readonly text', () => {
    const readOnlyProps = {
      element: {
        config: {
          data_point: false,
          element_id: 'my_element_id',
          text: 'My value',
          optional: false,
          custom_params: {
            readonly: true,
          },
        },
        element_type: 'Forms::Elements::Inputs::Text',
        form_elements: [],
        id: 1,
        order: 1,
        visible: true,
      },
    };

    render(
      <Provider store={storeFake(defaultStore)}>
        <CommonInputElement {...readOnlyProps}>
          {() => <Child />}
        </CommonInputElement>
      </Provider>
    );

    expect(screen.getByText('Read only')).toBeInTheDocument();
  });

  it('does not render the readonly text', () => {
    const readOnlyProps = {
      element: {
        config: {
          data_point: false,
          element_id: 'my_element_id',
          text: 'My value',
          optional: false,
          custom_params: {
            readonly: false,
          },
        },
        element_type: 'Forms::Elements::Inputs::Text',
        form_elements: [],
        id: 1,
        order: 1,
        visible: true,
      },
    };

    render(
      <Provider store={storeFake(defaultStore)}>
        <CommonInputElement {...readOnlyProps}>
          {() => <Child />}
        </CommonInputElement>
      </Provider>
    );

    expect(screen.queryByText('Read only')).not.toBeInTheDocument();
  });

  describe('value v formatted value testing', () => {
    it('renders the correct value in EDIT MODE', () => {
      render(
        <Provider store={storeFake(defaultStore)}>
          <CommonInputElement {...props}>
            {({ value }) => <Answer element={dummyElement} value={value} />}
          </CommonInputElement>
        </Provider>
      );
      expect(screen.getByText('My value')).toBeInTheDocument();
      expect(screen.getByText('my_value')).toBeInTheDocument();
    });

    it('renders value and not formattedValue in EDIT MODE', () => {
      const localStore = {
        ...defaultStore,
        formStateSlice: {
          ...defaultFormStateSlice,
          structure: {
            form_answers: [
              {
                id: 1,
                form_element: dummyElement,
                value: 'my_value',
                value_formatted: '<p>Different to value string </p>',
                created_at: '',
                updated_at: '',
              },
            ],
          },
        },
      };

      render(
        <Provider store={storeFake(localStore)}>
          <CommonInputElement {...props}>
            {({ value }) => <Answer element={dummyElement} value={value} />}
          </CommonInputElement>
        </Provider>
      );
      expect(screen.getByText('My value')).toBeInTheDocument();
      expect(screen.getByText('my_value')).toBeInTheDocument();
    });

    it('renders the correct value in VIEW MODE - standard value', () => {
      const localStore = {
        ...defaultStore,
        formStateSlice: {
          ...defaultFormStateSlice,
          config: {
            mode: MODES.VIEW,
          },
        },
      };

      render(
        <Provider store={storeFake(localStore)}>
          <CommonInputElement {...props}>
            {({ value }) => <Answer element={dummyElement} value={value} />}
          </CommonInputElement>
        </Provider>
      );
      expect(screen.getByText('My value')).toBeInTheDocument();
      expect(screen.getByText('my_value')).toBeInTheDocument();
    });

    it('renders the correct value in VIEW MODE - formatted value', () => {
      const localStore = {
        ...defaultStore,
        formStateSlice: {
          ...defaultFormStateSlice,
          structure: {
            form_answers: [
              {
                id: 1,
                form_element: dummyElement,
                value: 'my_value',
                value_formatted: '<p>Different to value string </p>',
                created_at: '',
                updated_at: '',
              },
            ],
          },
          config: {
            mode: MODES.VIEW,
          },
        },
      };

      render(
        <Provider store={storeFake(localStore)}>
          <CommonInputElement {...props}>
            {({ value }) => <Answer element={dummyElement} value={value} />}
          </CommonInputElement>
        </Provider>
      );
      expect(screen.getByText('My value')).toBeInTheDocument();
      expect(screen.getByText('Different to value string')).toBeInTheDocument();
    });
  });

  describe('default_value Select', () => {
    const defaultValueProps = {
      id: 'venue',
      element_type: 'Forms::Elements::Inputs::SingleChoice',
      config: {
        items: [
          { value: 'home', label: 'Home' },
          { value: 'away', label: 'Away' },
        ],
        text: 'Venue',
        data_point: false,
        element_id: 'venue',
        optional: false,
        custom_params: {
          columns: 2,
          default_value: 'home',
        },
      },
      visible: true,
      order: 4,
      form_elements: [],
    };

    const propsWithoutDefaultValue = {
      ...defaultValueProps,
      config: {
        ...defaultValueProps.config,
        custom_params: {
          columns: 2,
        },
      },
    };

    const formStateSlice = {
      form: {
        venue: '',
      },
      elements: {
        venue: defaultValueProps,
      },
      config: {
        mode: MODES.CREATE,
      },
    };

    const formValidationSlice = {
      validation: {
        venue: {
          status: 'PENDING',
          message: null,
        },
      },
    };

    const defaultValueStore = {
      formStateSlice,
      formMenuSlice: initialFormMenuState,
      formValidationSlice,
    };

    it('renders the default value from the data structure', () => {
      renderInputElement(defaultValueProps, Select, defaultValueStore);

      expect(screen.getByLabelText('Venue')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveValue('Home');
    });

    it('renders no default value', () => {
      renderInputElement(propsWithoutDefaultValue, Select, defaultValueStore);

      expect(screen.getByLabelText('Venue')).toBeInTheDocument();
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).not.toHaveValue('Home');
    });
  });

  describe('default_value TextInput', () => {
    const defaultValueProps = {
      id: 'name',
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Name',
        data_point: false,
        element_id: 'name',
        optional: false,
        custom_params: {
          columns: 2,
          default_value: 'Joe',
        },
      },
      visible: true,
      order: 4,
      form_elements: [],
    };

    const formStateSlice = {
      form: {
        name: '',
      },
      elements: {
        name: defaultValueProps,
      },
      config: {
        mode: MODES.CREATE,
      },
    };

    const formValidationSlice = {
      validation: {
        name: {
          status: 'PENDING',
          message: null,
        },
      },
    };

    const defaultValueStore = {
      formStateSlice,
      formMenuSlice: initialFormMenuState,
      formValidationSlice,
    };

    it('renders the default value from the data structure', () => {
      renderInputElement(defaultValueProps, TextInput, defaultValueStore);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue('Joe');
    });
  });

  describe('default_value Number', () => {
    const defaultValueProps = {
      id: 'number',
      element_type: 'Forms::Elements::Inputs::Number',
      config: {
        type: 'integer',
        text: 'Total Time',
        data_point: false,
        element_id: 'number',
        custom_params: {
          unit: 'mins',
          default_value: '20',
        },
        optional: true,
      },

      visible: true,
      order: 4,
      form_elements: [],
    };

    const formStateSlice = {
      form: {
        number: '',
      },
      elements: {
        number: defaultValueProps,
      },
      config: {
        mode: MODES.CREATE,
      },
    };

    const formValidationSlice = {
      validation: {
        number: {
          status: 'PENDING',
          message: null,
        },
      },
    };

    const defaultValueStore = {
      formStateSlice,
      formMenuSlice: initialFormMenuState,
      formValidationSlice,
    };

    it('renders the default value from the data structure', () => {
      renderInputElement(defaultValueProps, NumberInput, defaultValueStore);

      expect(screen.getByText('Total Time')).toBeInTheDocument();
      expect(screen.getByRole('spinbutton')).toHaveValue(20);
    });
  });

  describe('default_value DateTime', () => {
    const defaultValueProps = {
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
          default_value: '2024-01-01T13:47:10Z',
        },
      },
      visible: true,
      order: 5,
      form_elements: [],
    };

    const formStateSlice = {
      form: {
        date_of_birth: '',
      },
      elements: {
        date_of_birth: defaultValueProps,
      },
      config: {
        mode: MODES.CREATE,
      },
    };

    const formValidationSlice = {
      validation: {
        date_of_birth: {
          status: 'PENDING',
          message: null,
        },
      },
    };

    const defaultValueStore = {
      formStateSlice,
      formMenuSlice: initialFormMenuState,
      formValidationSlice,
    };

    it('renders the default value from the data structure', () => {
      render(
        <Provider store={storeFake(defaultValueStore)}>
          <LocalizationProvider>
            <CommonInputElement element={defaultValueProps}>
              {({ value, validationStatus, onChange }) => (
                <DateTime
                  element={defaultValueProps}
                  value={value}
                  validationStatus={validationStatus}
                  onChange={onChange}
                />
              )}
            </CommonInputElement>
          </LocalizationProvider>
        </Provider>
      );

      expect(screen.getAllByText('Date of Birth')[0]).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue('01/01/2024');
    });
  });

  describe('default_value Multiple Choice', () => {
    const defaultValueProps = {
      id: 'balance_disorder_type',
      element_type: 'Forms::Elements::Inputs::MultipleChoice',
      config: {
        items: [
          {
            value: 'meniere_disease',
            label: "Meniere's Disease",
          },
          {
            value: 'motion_sickness',
            label: 'Motion sickness',
          },
          {
            value: 'other',
            label: 'Other',
          },
          {
            value: 'vertigo',
            label: 'Vertigo',
          },
          {
            value: 'vestibular_disorder',
            label: 'Vestibular Disorder',
          },
        ],
        text: 'Balance Disorder type',
        data_point: false,
        element_id: 'balance_disorder_type',
        optional: true,
        custom_params: {
          default_value: ['vertigo', 'vestibular_disorder'],
        },
      },
      visible: true,
      order: 1,
      created_at: '2022-08-09T12:39:28Z',
      updated_at: '2022-08-09T12:39:28Z',
      form_elements: [],
    };

    const formStateSlice = {
      form: {
        balance_disorder_type: '',
      },
      elements: {
        balance_disorder_type: defaultValueProps,
      },
      config: {
        mode: MODES.CREATE,
      },
    };

    const formValidationSlice = {
      validation: {
        balance_disorder_type: {
          status: 'PENDING',
          message: null,
        },
      },
    };

    const defaultValueStore = {
      formStateSlice,
      formMenuSlice: initialFormMenuState,
      formValidationSlice,
    };

    it('renders the default value from the data structure', () => {
      render(
        <Provider store={storeFake(defaultValueStore)}>
          <CommonInputElement element={defaultValueProps}>
            {({ value, validationStatus, onChange }) => (
              <Select
                element={defaultValueProps}
                value={value}
                validationStatus={validationStatus}
                onChange={onChange}
              />
            )}
          </CommonInputElement>
        </Provider>
      );

      expect(
        screen.getByLabelText('Balance Disorder type')
      ).toBeInTheDocument();

      // autocomplete by default uses portals so the multiple select default values are not present in the DOM
      // to check as text elements, instead we use the HTML input element value property to check them.
      expect(screen.getByRole('combobox')).toHaveValue(
        '[object Object],[object Object]'
      );
    });
  });
});
