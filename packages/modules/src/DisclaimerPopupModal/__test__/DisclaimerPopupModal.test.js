import { render, fireEvent, screen } from '@testing-library/react';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import DisclaimerPopupModal from '../src/DisclaimerPopupModal';
import { nflPlayerDisclaimer1Content } from '../utils/nflPlayerDisclaimers';

jest.mock('@kitman/common/src/utils', () => {
  const originalModule = jest.requireActual('@kitman/common/src/utils');
  return {
    ...originalModule,
    getIsLocalStorageAvailable: jest.fn(),
  };
});

const mockDisclaimer = {
  title: 'Title',
  content: 'Some content',
  footerButtonText: 'I acknowledge',
};

const props = {
  disclaimer: mockDisclaimer,
};

describe('DisclaimerPopupModal', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
    });
  });

  it('renders the modal with the provided disclaimer content', () => {
    render(<DisclaimerPopupModal {...props} />);

    expect(screen.getByTestId('Modal|Content')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Some content')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /I acknowledge/i, hidden: true })
    ).toBeInTheDocument();
  });

  it('hides the modal when the footer button is clicked', () => {
    render(<DisclaimerPopupModal {...props} />);

    const primaryActionButton = screen.getByRole('button', {
      name: /I acknowledge/i,
      hidden: true,
    });

    expect(primaryActionButton).toBeEnabled();

    fireEvent.click(primaryActionButton);

    expect(screen.queryByTestId('Modal|Content')).not.toBeInTheDocument();
  });

  it('disables the primary action button when primaryActionDisabledByDefault prop is true', () => {
    render(
      <DisclaimerPopupModal
        {...props}
        primaryActionDisabledByDefault
        disclaimer={{
          ...mockDisclaimer,
          content: nflPlayerDisclaimer1Content(),
        }}
      />
    );

    expect(
      screen.getByRole('button', { name: /I acknowledge/i, hidden: true })
    ).toBeDisabled();
  });

  it('calls localStorage when localStorageKey is supplied', () => {
    getIsLocalStorageAvailable.mockReturnValue(true);
    jest
      .spyOn(window.localStorage, 'getItem')
      .mockReturnValue(JSON.stringify({ dummyLocalStorageKey: false }));

    const setItemSpy = jest.spyOn(window.localStorage, 'setItem');

    render(
      <DisclaimerPopupModal
        {...props}
        primaryActionDisabledByDefault
        disclaimer={{
          ...mockDisclaimer,
          content: nflPlayerDisclaimer1Content(),
        }}
        localStorageKey="dummyLocalStorageKey"
      />
    );

    expect(
      screen.getByRole('button', { name: /I acknowledge/i, hidden: true })
    ).toBeDisabled();

    localStorage.setItem('dummyLocalStorageKey', true);
    expect(setItemSpy).toHaveBeenCalledWith('dummyLocalStorageKey', true);
  });
});
