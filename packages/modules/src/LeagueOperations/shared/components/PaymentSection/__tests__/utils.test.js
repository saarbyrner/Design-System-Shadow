import { screen, render } from '@testing-library/react';
import { getWalletValue, getPaymentDetails } from '../utils';

describe('getWalletValue', () => {
  it('should return the correct wallet details when the wallet label is found', () => {
    const details = [
      { label: 'Season', value: '2023' },
      { label: 'Wallet', value: '1000' },
    ];
    const expected = {
      label: 'Club wallet',
      value: '1000',
    };
    expect(getWalletValue(details)).toEqual(expected);
  });

  it('should return the fallback dash when the wallet label is not found', () => {
    const details = [
      { label: 'Season', value: '2023' },
      { label: 'Registrations', value: 100 },
    ];
    const expected = {
      label: 'Club wallet',
      value: '-',
    };
    expect(getWalletValue(details)).toEqual(expected);
  });
});

describe('getPaymentDetails', () => {
  it('renders wallet value and payment details correctly', () => {
    const details = [
      { label: 'Season', value: '2023' },
      { label: 'Wallet', value: 1000 },
      { label: 'Registrations', value: 100 },
    ];

    render(getPaymentDetails(details));

    expect(screen.getByText(`Club wallet: 1000`)).toBeInTheDocument();
    expect(screen.getByTestId('Season')).toHaveTextContent('Season: 2023');
    expect(screen.getByTestId('Total registrations')).toHaveTextContent(
      'Total registrations: 100'
    );
  });

  it('renders fallback dash when values are missing', () => {
    const details = [
      { label: 'Season', value: null },
      { label: 'Registrations', value: null },
    ];

    render(getPaymentDetails(details));

    expect(screen.getByText('Club wallet: -')).toBeInTheDocument();
    expect(screen.getByTestId('Season')).toHaveTextContent('Season: -');
    expect(screen.getByTestId('Total registrations')).toHaveTextContent(
      'Total registrations: -'
    );
  });
});
