import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import EmergencyContactSidePanel from '../EmergencyContactSidePanel';
import {
  useGetInternationalPhonePrefixesQuery,
  useGetCountriesQuery,
  useGetRelationTypesQuery,
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
};
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

const mockedPrefixesQueryData = jest.fn().mockReturnValue({
  data: prefixesData,
  isLoading: false,
  isError: false,
});

const mockedCountriesQueryData = jest.fn().mockReturnValue({
  data: countriesData,
  isLoading: false,
  isError: false,
});

const mockedRelationshipsQueryData = jest.fn().mockReturnValue({
  data: relationshipsData,
  isLoading: false,
  isError: false,
});

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

describe('<EmergencyContactSidePanel/>', () => {
  const fakeAction = {};
  const fakePromise = new Promise((resolve) => {
    resolve();
  });
  fakeAction.unwrap = () => fakePromise;

  const props = {
    isOpen: true,
    contact: testContact,
    onClose: jest.fn(),
    onSave: jest.fn().mockReturnValue(fakeAction),
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContactSidePanel {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Add emergency contact')).toBeInTheDocument();
    });
  });

  it('renders EmergencyContact with correct details', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContactSidePanel {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByText('Add emergency contact')).toBeInTheDocument();
    });
    const inputTextFields = screen.getAllByRole('textbox');
    expect(inputTextFields.length).toEqual(13);
    expect(inputTextFields[0]).toHaveValue('David');
    expect(inputTextFields[1]).toHaveValue('Kelly');
  });

  it('calls onClose callback', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContactSidePanel {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByText('Add emergency contact')).toBeInTheDocument();
    });

    const closeButton = screen.getAllByRole('button')[0];
    await userEvent.click(closeButton);

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave callback', async () => {
    render(
      <Provider store={defaultStore}>
        <EmergencyContactSidePanel {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByText('Add emergency contact')).toBeInTheDocument();
    });
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(saveButton);

    expect(props.onSave).toHaveBeenCalledTimes(1);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
