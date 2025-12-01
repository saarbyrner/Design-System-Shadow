import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import EmergencyContact from '../EmergencyContact';
import {
  useGetInternationalPhonePrefixesQuery,
  useGetCountriesQuery,
} from '../../redux/services/emergencyContactsApi';

jest.mock(
  '@kitman/modules/src/EmergencyContacts/src/redux/services/emergencyContactsApi'
);

const testContact = {
  firstname: 'David',
  lastname: 'Kelly',
  email: 'david@kitmanlabs.com',
  phone_numbers: [
    {
      country: 'IE',
      number: '12345',
    },
  ],
  contact_relation: 'partner',
  address_1: '123 Main Street',
  address_2: 'Apt 1',
  address_3: 'Apt 2',
  city: 'Dublin',
  state_county: 'state county',
  zip_postal_code: '00000',
  country: 'Ireland',
};

const relationShips = [
  { label: 'Parent', value: 'parent' },
  { label: 'Partner', value: 'partner' },
];

const countriesData = [
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United States', label: 'United States' },
  { value: 'Ireland', label: 'Ireland' },
];

const prefixesData = [
  { value: 'IE', label: 'IE_PREFIX' },
  { value: 'DE', label: 'DE_PREFIX' },
];

const mockedPrefixesQueryData = {
  data: prefixesData,
  isLoading: false,
  isError: false,
};

const mockedCountriesQueryData = {
  data: countriesData,
  isLoading: false,
  isError: false,
};

useGetInternationalPhonePrefixesQuery.mockReturnValue(mockedPrefixesQueryData);
useGetCountriesQuery.mockReturnValue(mockedCountriesQueryData);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  emergencyContactsApi: {
    useGetInternationalPhonePrefixesQuery: mockedPrefixesQueryData,
    useGetCountriesQuery: mockedCountriesQueryData,
  },
});

describe('<EmergencyContact/>', () => {
  const props = {
    relationOptions: relationShips,
    contact: testContact,
    t: i18nextTranslateStub(),
    onChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders fields with prop values', () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    const inputTextFields = screen.getAllByRole('textbox');
    expect(inputTextFields.length).toEqual(13);
    expect(inputTextFields[0]).toHaveValue('David');
    expect(inputTextFields[1]).toHaveValue('Kelly');

    // No phone
    expect(inputTextFields[2]).toHaveValue('');
    expect(inputTextFields[3]).toHaveValue('');

    expect(inputTextFields[4]).toHaveValue('12345');
    expect(inputTextFields[5]).toHaveValue('david@kitmanlabs.com');
    expect(inputTextFields[6]).toHaveValue('123 Main Street');
    expect(inputTextFields[7]).toHaveValue('Apt 1');
    expect(inputTextFields[8]).toHaveValue('Apt 2');
    expect(inputTextFields[9]).toHaveValue('Dublin');
    expect(inputTextFields[10]).toHaveValue('state county');
    expect(inputTextFields[11]).toHaveValue('00000');
    expect(screen.getByText('Ireland')).toBeInTheDocument();
    expect(screen.getByText('Partner')).toBeInTheDocument();
  });

  it('renders phone number', () => {
    const contactWithDualNumbers = {
      ...testContact,
      phone_numbers: [
        {
          country: 'IE',
          number: '12345',
        },
        {
          country: 'DE',
          number: '6789',
        },
      ],
    };

    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} contact={contactWithDualNumbers} />
      </Provider>
    );

    const inputTextFields = screen.getAllByRole('textbox');
    expect(inputTextFields.length).toEqual(15);
    // 2 Phone numbers
    expect(inputTextFields[3]).toHaveValue('');
    expect(inputTextFields[4]).toHaveValue('12345');
    expect(inputTextFields[5]).toHaveValue('');
    expect(inputTextFields[6]).toHaveValue('6789');
    expect(screen.getByText('IE_PREFIX')).toBeInTheDocument();
    expect(screen.getByText('DE_PREFIX')).toBeInTheDocument();
  });

  it('shows correct validation error when Firstname is blank', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    expect(
      screen.queryByText('This field is required')
    ).not.toBeInTheDocument();
    const firstname = screen.getAllByRole('textbox')[0];
    await userEvent.clear(firstname);
    fireEvent.blur(firstname);

    expect(firstname).toHaveValue('');
    expect(screen.getByText('This field is required')).toBeInTheDocument();

    await userEvent.type(firstname, 'John');
    fireEvent.blur(firstname);
    expect(firstname).toHaveValue('John');
    expect(
      screen.queryByText('This field is required')
    ).not.toBeInTheDocument();

    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ firstname: 'John' })
    );
  });

  it('shows correct validation error when Lastname is blank', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    expect(
      screen.queryByText('This field is required')
    ).not.toBeInTheDocument();
    const lastname = screen.getAllByRole('textbox')[1];

    await userEvent.clear(lastname);
    fireEvent.blur(lastname);

    expect(lastname).toHaveValue('');
    expect(screen.getByText('This field is required')).toBeInTheDocument();

    await userEvent.type(lastname, 'Smith');
    fireEvent.blur(lastname);
    expect(lastname).toHaveValue('Smith');
    expect(
      screen.queryByText('This field is required')
    ).not.toBeInTheDocument();

    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ lastname: 'Smith' })
    );
  });

  it('shows correct validation error when Email is invalid', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    expect(screen.queryByText('Invalid email entered')).not.toBeInTheDocument();
    const email = screen.getAllByRole('textbox')[5];

    await userEvent.clear(email);
    await userEvent.type(email, 'test1@');
    fireEvent.blur(email);

    expect(screen.getByText('Invalid email entered')).toBeInTheDocument();

    await userEvent.type(email, 'test.com');
    fireEvent.blur(email);
    expect(email).toHaveValue('test1@test.com');
    expect(screen.queryByText('Invalid email entered')).not.toBeInTheDocument();
    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'test1@test.com' })
    );
  });

  it('shows correct validation error when phone_number is too short', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    const phoneNumber = screen.getAllByRole('textbox')[4];

    await userEvent.clear(phoneNumber);
    fireEvent.blur(phoneNumber);

    expect(phoneNumber).toHaveValue('');
    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();

    await userEvent.type(phoneNumber, '1234');
    expect(screen.queryByText('Invalid phone number')).not.toBeInTheDocument();

    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        phone_numbers: [{ country: 'IE', number: '1234' }],
      })
    );
  });

  it('filters invalid characters from phone numbers', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    const phoneNumber = screen.getAllByRole('textbox')[4];

    await userEvent.clear(phoneNumber);
    fireEvent.blur(phoneNumber);
    await userEvent.type(phoneNumber, '(123) 5678abc');
    fireEvent.blur(phoneNumber);
    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        phone_numbers: [{ country: 'IE', number: '(123) 5678' }],
      })
    );
  });

  it('shows no validation error when optional phone numbers are empty', async () => {
    const contactWithDualNumbers = {
      ...testContact,
      phone_numbers: [
        {
          country: 'IE',
          number: '12345',
        },
        {
          country: 'DE',
          number: '6789',
        },
      ],
    };

    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} contact={contactWithDualNumbers} />
      </Provider>
    );

    const phoneNumber2 = screen.getAllByRole('textbox')[6];
    await userEvent.clear(phoneNumber2);
    fireEvent.blur(phoneNumber2);
    expect(screen.queryByText('Invalid phone number')).not.toBeInTheDocument();
  });

  it('calls onChange when contact relation is changed', async () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );
    const selects = container.querySelectorAll('.kitmanReactSelect input');
    const selectRelation = selects[0];
    selectEvent.openMenu(selectRelation);
    await selectEvent.select(selectRelation, 'Parent');
    fireEvent.blur(selectRelation);
    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        contact_relation: 'parent',
      })
    );
  });

  it('calls onChange when address 1 is changed', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    const address1 = screen.getAllByRole('textbox')[6];
    await userEvent.clear(address1);
    await userEvent.type(address1, '123 Fake Street');
    fireEvent.blur(address1);
    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        address_1: '123 Fake Street',
      })
    );
  });

  it('calls onChange when address 2 is changed', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    const address2 = screen.getAllByRole('textbox')[7];
    await userEvent.clear(address2);
    await userEvent.type(address2, 'Apt 1');
    fireEvent.blur(address2);

    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ address_2: 'Apt 1' })
    );
  });

  it('calls onChange when address 3 is changed', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    const address3 = screen.getAllByRole('textbox')[8];
    await userEvent.clear(address3);
    await userEvent.type(address3, 'Apt 2');

    fireEvent.blur(address3);
    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ address_3: 'Apt 2' })
    );
  });

  it('calls onChange when city is changed', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    const city = screen.getAllByRole('textbox')[9];
    await userEvent.clear(city);
    await userEvent.type(city, 'New York');
    fireEvent.blur(city);
    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ city: 'New York' })
    );
  });

  it('calls onChange when state county is changed', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    const stateCounty = screen.getAllByRole('textbox')[10];
    await userEvent.clear(stateCounty);
    await userEvent.type(stateCounty, 'NY');
    fireEvent.blur(stateCounty);
    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ state_county: 'NY' })
    );
  });

  it('calls onChange when zip / postal code is changed', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContact {...props} />
      </Provider>
    );

    const postCode = screen.getAllByRole('textbox')[11];
    await userEvent.clear(postCode);
    await userEvent.type(postCode, '10001');
    fireEvent.blur(postCode);
    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        zip_postal_code: '10001',
      })
    );
  });
});
