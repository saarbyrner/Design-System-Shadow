import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import EmergencyContacts from '../EmergencyContacts';
import {
  useGetInternationalPhonePrefixesQuery,
  useGetCountriesQuery,
  useGetRelationTypesQuery,
} from '../../redux/services/emergencyContactsApi';

jest.mock(
  '@kitman/modules/src/EmergencyContacts/src/redux/services/emergencyContactsApi'
);

const relationshipsData = [
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

const mockedRelationshipsQueryData = {
  data: relationshipsData,
  isLoading: false,
  isError: false,
};

useGetInternationalPhonePrefixesQuery.mockReturnValue(mockedPrefixesQueryData);
useGetCountriesQuery.mockReturnValue(mockedCountriesQueryData);
useGetRelationTypesQuery.mockReturnValue(mockedRelationshipsQueryData);

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
    useGetRelationTypesQuery: mockedRelationshipsQueryData,
  },
});

const testContacts = [
  {
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
  },
  {
    firstname: 'Test',
    lastname: 'Test',
    email: 'test@kitmanlabs.com',
    phone_numbers: [
      {
        country: 'IE',
        number: '12345',
      },
    ],
    contact_relation: 'partner',
  },
];

describe('Athlete Settings <EmergencyContacts> component', () => {
  const props = {
    contacts: testContacts,
    onRemoveEmergencyContact: jest.fn(),
    onGetEmergencyContacts: jest.fn(),
    onEditEmergencyContact: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders two emergency contacts with correct details', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContacts {...props} />
      </Provider>
    );
    expect(screen.getByText('Emergency contacts')).toBeInTheDocument();
    expect(screen.getByText('Contact 1')).toBeInTheDocument();
    expect(screen.getByText('Contact 2')).toBeInTheDocument();
  });

  it('calls to onEditEmergencyContact on Add Contact button pressed', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContacts {...props} />
      </Provider>
    );
    const addContactButton = screen.getByRole('button', {
      name: 'Add contact',
    });
    await userEvent.click(addContactButton);
    expect(props.onEditEmergencyContact).toHaveBeenCalled();
  });

  it('calls to onEditEmergencyContact on edit button pressed', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContacts {...props} />
      </Provider>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(5);
    await userEvent.click(buttons[1]);
    expect(props.onEditEmergencyContact).toHaveBeenCalled();
  });

  it('has displays a delete confirmation modal', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContacts {...props} />
      </Provider>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(5);
    await userEvent.click(buttons[2]);

    // Modal appears
    expect(screen.getByText('Delete emergency contact')).toBeInTheDocument();
    const deleteButton = screen.getByRole('button', {
      name: 'Delete',
      hidden: true,
    });
    await userEvent.click(deleteButton);

    expect(props.onRemoveEmergencyContact).toHaveBeenCalled();
  });
});
