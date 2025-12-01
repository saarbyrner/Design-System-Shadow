import { render, screen, fireEvent, within } from '@testing-library/react';
import TextInput from '@kitman/modules/src/HumanInput/shared/components/InputElements/TextInput';

const MOCK_ELEMENT = {
  id: 20817,
  element_type: 'Forms::Elements::Inputs::Text',
  config: {
    text: 'First name',
    data_point: false,
    element_id: 'first_name',
    optional: false,
    custom_params: {
      readonly: false,
    },
  },
  visible: true,
  order: 4,
  form_elements: [],
};

const props = {
  element: MOCK_ELEMENT,
  value: 'Juan',
  validationStatus: {
    status: 'PENDING',
    message: '',
  },
  onChange: jest.fn(),
};

describe('<TextInput/>', () => {
  afterEach(() => {
    MOCK_ELEMENT.config.custom_params.readonly = false;
  });

  describe('StandardInput', () => {
    it('renders', () => {
      render(<TextInput {...props} />);

      expect(screen.getByText('First name')).toBeInTheDocument();

      const textFieldInput = screen.getByDisplayValue('Juan');
      expect(textFieldInput).toBeInTheDocument();
      expect(textFieldInput).not.toHaveAttribute('readOnly');
    });

    it('renders read only', () => {
      MOCK_ELEMENT.config.custom_params.readonly = true;

      render(<TextInput {...props} />);

      expect(screen.getByText('First name')).toBeInTheDocument();

      const textFieldInput = screen.getByDisplayValue('Juan');
      expect(textFieldInput).toBeInTheDocument();
      expect(textFieldInput).toHaveAttribute('readOnly');
    });

    it('renders multiline (textbox) component', () => {
      MOCK_ELEMENT.config.custom_params.style = 'multiline';

      render(<TextInput {...props} />);

      expect(screen.getByText('First name')).toBeInTheDocument();

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('<PhoneSelector/>', () => {
    beforeEach(() => {
      MOCK_ELEMENT.config.custom_params.type = 'phone';
      MOCK_ELEMENT.config.text = 'Home number';
    });

    afterEach(() => {
      MOCK_ELEMENT.config.custom_params.type = null;
      MOCK_ELEMENT.config.text = 'First name';
    });

    it('renders component', () => {
      render(<TextInput {...props} value="" />);

      expect(screen.getAllByText('Country code').at(0)).toBeInTheDocument();
      expect(screen.getByText('Home number')).toBeInTheDocument();
    });

    it('select country code', () => {
      const searchTerm = 'ireland';
      const countryCode = '+353';

      const { getByTestId } = render(<TextInput {...props} value="" />);

      const autocomplete = getByTestId('autocomplete');
      const input = within(autocomplete).getByRole('combobox');
      autocomplete.click();

      fireEvent.change(input, { target: { value: searchTerm } });

      fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
      fireEvent.keyDown(autocomplete, { key: 'Enter' });

      expect(input.value).toEqual(countryCode);
    });

    it('select country', async () => {
      const phoneNumber = '749151408';

      render(<TextInput {...props} value="" />);

      const phoneNumberInput = screen.getByLabelText('Home number');

      phoneNumberInput.focus();

      fireEvent.change(phoneNumberInput, { target: { value: phoneNumber } });

      expect(phoneNumberInput.value).toEqual(phoneNumber);
    });

    it('render preloaded number', async () => {
      const countryCode = '+353';
      const phoneNumber = '749151408';

      const { getByTestId } = render(
        <TextInput {...props} value="+353749151408" />
      );

      const autocomplete = getByTestId('autocomplete');
      const input = within(autocomplete).getByRole('combobox');
      const phoneNumberInput = screen.getByLabelText('Home number');

      expect(input.value).toEqual(countryCode);
      expect(phoneNumberInput.value).toEqual(phoneNumber);
    });

    it('render repeatable number use case', async () => {
      const countryCode = '+353';
      const phoneNumber = '749151408';

      const { getByTestId } = render(
        <TextInput {...props} value={['+353749151408']} />
      );

      const autocomplete = getByTestId('autocomplete');
      const input = within(autocomplete).getByRole('combobox');
      const phoneNumberInput = screen.getByLabelText('Home number');

      expect(input.value).toEqual(countryCode);
      expect(phoneNumberInput.value).toEqual(phoneNumber);
    });

    it('render repeatable number no number use case', async () => {
      const { getByTestId } = render(<TextInput {...props} value={[]} />);

      const autocomplete = getByTestId('autocomplete');
      const input = within(autocomplete).getByRole('combobox');
      const phoneNumberInput = screen.getByLabelText('Home number');

      expect(input.value).toEqual('');
      expect(phoneNumberInput.value).toEqual('');
    });
  });

  describe('Email Input', () => {
    beforeEach(() => {
      MOCK_ELEMENT.config.custom_params.type = 'email';
      MOCK_ELEMENT.config.text = 'Email address';
    });

    it('renders an email input field', () => {
      render(<TextInput {...props} />);

      expect(screen.getByText('Email address')).toBeInTheDocument();
      const emailInput = screen.getByLabelText('Email address');
      expect(emailInput).toBeInTheDocument();
    });

    it('updates the value when the email input changes', () => {
      render(<TextInput {...props} />);
      const emailInput = screen.getByLabelText('Email address');
      const newEmail = 'test@example.com';

      fireEvent.change(emailInput, { target: { value: newEmail } });

      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toHaveBeenCalledWith(newEmail);
    });

    it('applies readOnly attribute when custom_params.readonly is true', () => {
      MOCK_ELEMENT.config.custom_params.readonly = true;
      render(<TextInput {...props} value="readonly@test.org" />);
      const emailInput = screen.getByDisplayValue('readonly@test.org');
      expect(emailInput).toHaveAttribute('readonly');
    });
  });
});
