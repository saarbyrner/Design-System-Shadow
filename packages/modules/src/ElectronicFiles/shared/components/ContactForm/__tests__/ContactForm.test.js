import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  mockCountryCodeGB,
  mockCountryCodeUS,
  mockPhoneNumberUS,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import { data as mockContacts } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchContacts.mock';
import ContactForm from '@kitman/modules/src/ElectronicFiles/shared/components/ContactForm';

const mockContact = mockContacts[0];
const mockHandleChange = jest.fn();
const mockHandleValidation = jest.fn();
const mockOnAddToFavoritesChange = jest.fn();

const defaultProps = {
  data: {},
  validation: {},
  handleChange: mockHandleChange,
  handleValidation: mockHandleValidation,
  onAddToFavoritesChange: mockOnAddToFavoritesChange,
  showAddToFavoritesCheckbox: true,
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  render(<ContactForm {...props} />);

describe('<ContactForm/>', () => {
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('Fax number')).toBeInTheDocument();
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
    expect(screen.getByLabelText('Company name')).toBeInTheDocument();

    const addToFavoritesCheckbox = screen.getByRole('checkbox', {
      name: 'Add to favorites',
    });
    expect(addToFavoritesCheckbox).toBeInTheDocument();
    expect(addToFavoritesCheckbox).not.toBeChecked();
  });

  it('does not render add to favorites checkbox if showAddToFavoritesCheckbox = false', () => {
    renderComponent({
      ...defaultProps,
      showAddToFavoritesCheckbox: false,
    });

    const addToFavoritesCheckbox = screen.queryByRole('checkbox', {
      name: 'Add to favorites',
    });
    expect(addToFavoritesCheckbox).not.toBeInTheDocument();
  });

  it('calls handleChange when country code is being populated', async () => {
    renderComponent();

    const countryCodeText = mockCountryCodeGB;
    const countryCodeDropdown = screen.getByLabelText('Country code');

    await userEvent.click(countryCodeDropdown);

    await userEvent.click(
      screen.getByRole('option', { name: countryCodeText })
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith({
      fax_number: countryCodeText.split(' ')[3],
    });
  });

  it('calls handleChange when fax number is being populated', async () => {
    renderComponent();

    const phoneNumberInput = screen.getByLabelText('Fax number');

    await fireEvent.change(phoneNumberInput, {
      target: { value: mockPhoneNumberUS },
    });

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith({
      fax_number: `${
        mockCountryCodeUS.split(' ')[3]
      }${mockPhoneNumberUS.substring(1)}`,
    });
  });

  it('calls handleChange when first name is being populated', async () => {
    renderComponent();

    const firstNameText = mockContact.first_name;
    const firstNameInput = screen.getByLabelText('First name');

    await fireEvent.change(firstNameInput, {
      target: { value: firstNameText },
    });

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith({
      first_name: mockContact.first_name,
    });
  });

  it('calls handleChange when last name is being populated', async () => {
    renderComponent();

    const lastNameText = mockContact.last_name;
    const lastNameInput = screen.getByLabelText('Last name');

    await fireEvent.change(lastNameInput, {
      target: { value: lastNameText },
    });

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith({
      last_name: mockContact.last_name,
    });
  });

  it('calls handleChange when company name is being populated', async () => {
    renderComponent();

    const companyNameText = mockContact.company_name;
    const companyNameInput = screen.getByLabelText('Company name');

    await fireEvent.change(companyNameInput, {
      target: { value: companyNameText },
    });

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith({
      company_name: mockContact.company_name,
    });
  });

  it('calls handleChange when add to favorites is checked', async () => {
    const user = userEvent.setup();

    renderComponent();

    const addToFavoritesCheckbox = screen.getByRole('checkbox', {
      name: 'Add to favorites',
    });
    expect(addToFavoritesCheckbox).not.toBeChecked();

    await user.click(addToFavoritesCheckbox);

    expect(mockOnAddToFavoritesChange).toHaveBeenCalledTimes(1);
    expect(mockOnAddToFavoritesChange).toHaveBeenCalledWith(true);
  });

  it('calls handleChange when remove from favorites is unchecked', async () => {
    const user = userEvent.setup();

    renderComponent({
      ...defaultProps,
      data: {
        contact: {
          ...mockContact,
          favorite: true,
        },
      },
    });

    const addToFavoritesCheckbox = screen.getByRole('checkbox', {
      name: 'Added to favorites',
    });
    expect(addToFavoritesCheckbox).toBeChecked();

    await user.click(addToFavoritesCheckbox);

    expect(mockOnAddToFavoritesChange).toHaveBeenCalledTimes(1);
    expect(mockOnAddToFavoritesChange).toHaveBeenCalledWith(false);
  });
});
