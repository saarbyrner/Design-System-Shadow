import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PhoneNumberInput from '..';

const defaultProps = {
  phone: '',
  defaultCountryCode: 'US',
  countryCode: 'US',
  onChangePhone: jest.fn(),
  onChangeCountryCode: jest.fn(),
  onError: jest.fn(),
  onSuccess: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('PhoneNumberInput', () => {
  const renderComponent = (props = {}) => {
    return renderWithProviders(
      <PhoneNumberInput {...defaultProps} {...props} />,
      {
        default: () => {},
        subscribe: () => {},
        dispatch: () => {},
        getState: () => {},
      }
    );
  };
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
    const countryCodeField = screen.getByRole('button', 'countryCode-label');
    expect(countryCodeField).toBeInTheDocument();
    expect(countryCodeField).toContainHTML('img');
    expect(screen.getByDisplayValue('US')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('sets the country code based on "defaultCountryCode" props', () => {
    renderComponent({
      countryCode: '',
      defaultCountryCode: 'GB',
    });
    expect(screen.getByDisplayValue('GB')).toBeInTheDocument();
    expect(screen.getByText('+44')).toBeInTheDocument();
  });

  it('handles phone number change', async () => {
    const user = userEvent.setup();
    renderComponent();

    const phoneInput = screen.getByPlaceholderText('Phone');
    await user.type(phoneInput, '1');

    expect(defaultProps.onChangePhone).toHaveBeenCalledWith('1', '+11');
  });

  it('handles country code change', async () => {
    const user = userEvent.setup();
    renderComponent();

    const countryCodeField = screen.getByRole('button', 'countryCode-label');
    await user.click(countryCodeField);
    await user.click(screen.getByText('Australia'));
    expect(defaultProps.onChangeCountryCode).toHaveBeenCalledWith('AU');
  });

  it('calls onSuccess when the phone is valid', async () => {
    renderComponent({
      countryCode: 'GB',
      phone: '07000000000',
    });

    const phoneInput = screen.getByPlaceholderText('Phone');
    phoneInput.focus();
    phoneInput.blur();

    expect(defaultProps.onSuccess).toHaveBeenCalledWith('7000000000');
  });

  it('calls onError when the phone is invalid', async () => {
    renderComponent({
      phone: '111',
    });

    const phoneInput = screen.getByPlaceholderText('Phone');
    phoneInput.focus();
    phoneInput.blur();

    expect(defaultProps.onError).toHaveBeenCalledWith(
      'Enter a valid phone number'
    );
  });
});
