import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';
import PhoneCountryPrefixSelector from '../PhoneCountryPrefixSelector';
import { useGetInternationalPhonePrefixesQuery } from '../../redux/services/emergencyContactsApi';

jest.mock(
  '@kitman/modules/src/EmergencyContacts/src/redux/services/emergencyContactsApi'
);

describe('<PhoneCountryPrefixSelector />', () => {
  const props = {
    selectedCountry: 'IE',
    isClearable: true,
    onBlur: jest.fn(),
    errors: [{ isvalid: false, message: 'test error' }],
    onChange: jest.fn(),
  };
  const prefixesData = [
    { value: 'IE', label: 'Ireland' },
    { value: 'AF', label: 'Afghanistan' },
  ];

  const mockedPrefixesQueryData = {
    data: prefixesData,
    isLoading: false,
    isError: false,
  };

  useGetInternationalPhonePrefixesQuery.mockReturnValue(
    mockedPrefixesQueryData
  );

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });
  const defaultStore = storeFake({
    emergencyContactsApi: {
      useGetInternationalPhonePrefixesQuery: mockedPrefixesQueryData,
    },
  });

  it('calls onChange when country is selected', async () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <PhoneCountryPrefixSelector {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    selectEvent.openMenu(container.querySelector('input'));
    await selectEvent.select(container.querySelector('input'), 'Afghanistan');

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith('AF');
    });
  });

  it('calls onBlur', async () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <PhoneCountryPrefixSelector {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    await fireEvent.blur(container.querySelector('input'));
    await waitFor(() => {
      expect(props.onBlur).toHaveBeenCalled();
    });
  });

  it('renders with selected country', async () => {
    render(
      <Provider store={defaultStore}>
        <PhoneCountryPrefixSelector {...props} selectedCountry="IE" />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Ireland')).toBeInTheDocument();
    });
  });
});
