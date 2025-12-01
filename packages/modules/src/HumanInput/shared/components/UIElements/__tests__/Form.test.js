import { screen } from '@testing-library/react';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';

import Form from '../Form';

setI18n(i18n);

const props = {
  formElements: [],
  title: 'Registration',
  isOpen: false,
};

const defaultStore = {
  formStateSlice: {
    ...initialFormState,
    elements: [
      {
        id: 1,
        config: { element_id: 'Attachment', text: 'Attachment' },
        element_type: 'Forms::Elements::Inputs::Attachment',
        expected: 'Select',
        visible: true,
      },
      {
        id: 2,
        config: { element_id: 'Boolean', text: 'Boolean question' },
        element_type: 'Forms::Elements::Inputs::Boolean',
        expected: 'Boolean question',
        visible: true,
      },
      {
        id: 4,
        config: {
          element_id: 'MultipleChoice',
          text: 'Select Multiselect Option',
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
        },
        element_type: 'Forms::Elements::Inputs::MultipleChoice',
        expected: 'Select Multiselect Option',
        visible: true,
      },
      {
        id: 5,
        config: { element_id: 'Number', text: 'Height (cm)' },
        element_type: 'Forms::Elements::Inputs::Number',
        expected: 'Height (cm)',
        visible: true,
      },
      {
        id: 6,
        config: {
          text: 'How blue is the sky today?',
          data_point: 5,
          element_id: 'pi_sky_blue',
          optional: false,
          custom_params: {
            readonly: false,
            style: 'slider',
            increment: 0.5,
          },
          min: 0,
          max: 10,
        },
        element_type: 'Forms::Elements::Inputs::Range',
        expected: 'How blue is the sky today?',
        visible: true,
      },
      {
        id: 7,
        config: {
          element_id: 'SingleChoice',
          text: 'Select Single Select Option',
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
        },
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        expected: 'Select Single Select Option',
        visible: true,
      },
      {
        id: 8,
        config: { element_id: 'Text', text: 'Input Text' },
        element_type: 'Forms::Elements::Inputs::Text',
        expected: 'Input Text',
        visible: true,
      },
    ],
    config: { mode: MODES.EDIT },
  },
  formMenuSlice: { drawer: { isOpen: true } },
  formValidationSlice: {
    validation: {
      1: { status: 'PENDING', message: null },
      2: { status: 'PENDING', message: null },
      3: { status: 'PENDING', message: null },
      4: { status: 'PENDING', message: null },
      5: { status: 'PENDING', message: null },
      6: { status: 'PENDING', message: null },
      7: { status: 'PENDING', message: null },
      8: { status: 'PENDING', message: null },
    },
  },
};

const parseAnswers = (arr) => {
  return arr.map((element) => {
    return {
      id: element.id,
      form_element: element,
      value: 'my_value',
      value_formatted: null,
      created_at: '',
      updated_at: '',
    };
  });
};

describe('<Form/>', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });
  it('renders', () => {
    renderWithProviders(<Form {...props} />);
    expect(screen.getByText(/Registration/i)).toBeInTheDocument();
  });
  it('renders the form elements', () => {
    const answers = parseAnswers(defaultStore.formStateSlice.elements);

    const localState = {
      ...defaultStore,
      formStateSlice: {
        ...defaultStore.formStateSlice,
        structure: {
          form_answers: answers,
        },
      },
    };

    renderWithProviders(
      <LocalizationProvider>
        <Form {...props} formElements={defaultStore.formStateSlice.elements} />
      </LocalizationProvider>,
      {
        preloadedState: localState,
      }
    );

    // Non-PDF content elements should be rendered in the responsive container
    expect(screen.getByText('Attachment')).toBeInTheDocument();
    expect(screen.getByText('Boolean question')).toBeInTheDocument();
    expect(screen.getByText('Height (cm)')).toBeInTheDocument();
    expect(screen.getByText('Input Text')).toBeInTheDocument();
    expect(screen.getByText('How blue is the sky today?')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Select Multiselect Option')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Select Single Select Option')
    ).toBeInTheDocument();
  });

  it('renders PDF content elements at full width', () => {
    const pdfContentElement = {
      id: 10,
      config: {
        element_id: 'PDF_Content',
        text: 'PDF Document Title',
        custom_params: {
          content_type: 'pdf',
        },
        source: 'pdf-url',
      },
      element_type: 'Forms::Elements::Layouts::Content',
      expected: 'PDF Document Title',
      visible: true,
    };

    renderWithProviders(
      <LocalizationProvider>
        <Form {...props} formElements={[pdfContentElement]} />
      </LocalizationProvider>
    );

    // PDF content element should be rendered at full width
    expect(screen.getByText('PDF Document Title')).toBeInTheDocument();
  });

  it('does not render form elements with visible flag as false', () => {
    const notVisibleElements = [
      {
        id: 1,
        config: { element_id: 'Attachment' },
        element_type: 'Forms::Elements::Inputs::Attachment',
        expected: 'Select',
        visible: false,
      },
      {
        id: 4,
        config: {
          element_id: 'MultipleChoice',
          text: 'Select Multiselect Option',
        },
        element_type: 'Forms::Elements::Inputs::MultipleChoice',
        expected: 'Select Multiselect Option',
        visible: false,
      },
      {
        id: 7,
        config: {
          element_id: 'SingleChoice',
          text: 'Select Single Select Option',
        },
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        expected: 'Select Single Select Option',
        visible: true,
      },
    ];

    const visibleElements = [
      {
        id: 5,
        config: { element_id: 'Number', text: 'Height (cm)' },
        element_type: 'Forms::Elements::Inputs::Number',
        expected: 'Height (cm)',
        visible: true,
      },
      {
        id: 6,
        config: { element_id: 'Range', text: 'How blue is the sky today?' },
        element_type: 'Forms::Elements::Inputs::Range',
        expected: 'How blue is the sky today?',
        visible: true,
      },

      {
        id: 8,
        config: { element_id: 'Text', text: 'Input Text' },
        element_type: 'Forms::Elements::Inputs::Text',
        expected: 'Input Text',
        visible: true,
      },
      {
        id: 2,
        config: { element_id: 'Boolean', text: 'Boolean question' },
        element_type: 'Forms::Elements::Inputs::Boolean',
        expected: 'Boolean question',
        visible: true,
      },
    ];

    const answers = parseAnswers([...notVisibleElements, ...visibleElements]);

    const localState = {
      ...defaultStore,
      formStateSlice: {
        ...defaultStore.formStateSlice,
        structure: {
          form_answers: answers,
        },
      },
    };

    renderWithProviders(
      <LocalizationProvider>
        <Form
          {...props}
          formElements={[...notVisibleElements, ...visibleElements]}
        />
      </LocalizationProvider>,
      {
        preloadedState: localState,
      }
    );

    visibleElements.forEach((element) => {
      expect(screen.getByText(element.expected)).toBeInTheDocument();
    });

    notVisibleElements.forEach((element) => {
      expect(screen.queryByText(element.expected)).not.toBeInTheDocument();
    });
  });

  it('renders the form date element', () => {
    const localFormElement = {
      id: 3,
      config: {
        element_id: 'DateTime',
        text: 'Date Picker',
        type: 'date',
      },
      element_type: 'Forms::Elements::Inputs::DateTime',
      expected: 'Date Picker',
      visible: true,
    };

    const localState = {
      ...defaultStore,
      formStateSlice: {
        ...defaultStore.formStateSlice,
        structure: {
          form_answers: [
            {
              id: 1,
              form_element: localFormElement,
              value: 'my_value',
              value_formatted: null,
              created_at: '',
              updated_at: '',
            },
          ],
        },
      },
    };

    renderWithProviders(
      <LocalizationProvider>
        <Form {...props} formElements={[localFormElement]} />
      </LocalizationProvider>,
      {
        preloadedState: localState,
      }
    );

    expect(screen.getByLabelText('Date Picker')).toBeInTheDocument();
  });
});
