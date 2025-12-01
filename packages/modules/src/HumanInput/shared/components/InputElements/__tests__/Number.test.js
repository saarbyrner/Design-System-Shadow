import { render, screen } from '@testing-library/react';
import Number from '@kitman/modules/src/HumanInput/shared/components/InputElements/Number';

const MOCK_ELEMENT = {
  id: 555,
  element_type: 'Forms::Elements::Inputs::Number',
  config: {
    type: 'integer',
    text: 'Height (in)',
    data_point: false,
    element_id: 'height',
    optional: false,
    custom_params: {
      readonly: false,
    },
  },
  visible: true,
  order: 15,
  created_at: '2022-08-09T12:39:28Z',
  updated_at: '2022-08-09T12:39:28Z',
  form_elements: [],
};

const MOCK_ELEMENT_WITH_ADORNMENT = {
  id: 555,
  element_type: 'Forms::Elements::Inputs::Number',
  config: {
    type: 'integer',
    text: 'Height (in)',
    data_point: false,
    element_id: 'height',
    custom_params: {
      unit: 'inches',
      readonly: false,
    },
    optional: false,
  },
  visible: true,
  order: 15,
  created_at: '2022-08-09T12:39:28Z',
  updated_at: '2022-08-09T12:39:28Z',
  form_elements: [],
};

const props = {
  element: MOCK_ELEMENT,
  value: '123456',
  validationStatus: {
    status: 'PENDING',
    message: '',
  },
  multi: false,
  onChange: jest.fn(),
};

describe('<Number/>', () => {
  afterEach(() => {
    MOCK_ELEMENT_WITH_ADORNMENT.config.custom_params.readonly = false;
  });

  it('renders', () => {
    render(<Number {...props} />);

    expect(screen.getByText('Height (in)')).toBeInTheDocument();

    const numberFieldInput = screen.getByDisplayValue('123456');

    expect(numberFieldInput).toBeInTheDocument();
    expect(numberFieldInput).not.toHaveAttribute('readOnly');
  });

  it('show input adornment', () => {
    render(<Number {...props} element={MOCK_ELEMENT_WITH_ADORNMENT} />);

    expect(screen.getByText('Height (in)')).toBeInTheDocument();
    expect(screen.getByText('inches')).toBeInTheDocument();

    const numberFieldInput = screen.getByDisplayValue('123456');
    expect(numberFieldInput).not.toHaveAttribute('readOnly');
  });

  it('show input in read only', () => {
    MOCK_ELEMENT_WITH_ADORNMENT.config.custom_params.readonly = true;

    render(<Number {...props} element={MOCK_ELEMENT_WITH_ADORNMENT} />);

    expect(screen.getByText('Height (in)')).toBeInTheDocument();
    expect(screen.getByText('inches')).toBeInTheDocument();

    const numberFieldInput = screen.getByDisplayValue('123456');
    expect(numberFieldInput).toHaveAttribute('readOnly');
  });
});
