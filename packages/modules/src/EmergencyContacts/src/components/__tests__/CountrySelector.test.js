import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';
import CountrySelector from '../CountrySelector';
import { useGetCountriesQuery } from '../../redux/services/emergencyContactsApi';

jest.mock(
  '@kitman/modules/src/EmergencyContacts/src/redux/services/emergencyContactsApi'
);

describe('<CountrySelector />', () => {
  const props = {
    selectedCountry: '',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    testId: 'CountrySelector',
  };

  const countriesData = [
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' },
  ];

  const mockedCountriesData = {
    data: countriesData,
    isLoading: false,
    isError: false,
  };

  useGetCountriesQuery.mockReturnValue(mockedCountriesData);

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });
  const defaultStore = storeFake({
    emergencyContactsApi: {
      useGetCountriesQuery: mockedCountriesData,
    },
  });

  it('calls onChange when country is selected', async () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <CountrySelector {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    selectEvent.openMenu(container.querySelector('input'));
    await selectEvent.select(
      container.querySelector('input'),
      'United Kingdom'
    );

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith('United Kingdom');
    });
  });

  it('calls onBlur', async () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <CountrySelector {...props} />
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
        <CountrySelector {...props} selectedCountry="United Kingdom" />{' '}
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    });
  });
});
