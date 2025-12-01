import { screen, fireEvent } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import PHIModal from '../PHIModal';

jest.mock('@kitman/modules/src/AppHeader/resources/PHIAndPIICheck', () => ({
  __esModule: true,
  default: jest.fn(() => ({ isMedicalPage: true })),
}));

const defaultLocation = window.ipForGovernment;
const isIpForGov = (value) => {
  Object.defineProperty(window, 'ipForGovernment', {
    value,
  });
};

beforeEach(() => {
  Object.defineProperty(window, 'ipForGovernment', {
    writable: true,
    value: true,
  });
});

afterEach(() => {
  window.ipForGovernment = defaultLocation;
});

describe('PHIModal component', () => {
  it('should render the modal when conditions are met', () => {
    renderWithProviders(<PHIModal />, {
      preloadedState: {
        phiToastsSlice: {
          show: true,
        },
      },
    });

    expect(
      screen.getByText(
        'Important Notice: Authorized Access to Protected Health Information (PHI)'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('should not show the modal when the continue button is clicked', () => {
    renderWithProviders(<PHIModal />, {
      preloadedState: {
        phiToastsSlice: {
          show: true,
        },
      },
    });
    const modalTitle = screen.queryByText(
      'Important Notice: Authorized Access to Protected Health Information (PHI)'
    );
    expect(modalTitle).toBeInTheDocument();

    fireEvent.click(screen.getByText('Continue'));

    expect(
      screen.queryByText(
        'Important Notice: Authorized Access to Protected Health Information (PHI)'
      )
    ).not.toBeInTheDocument();
  });

  it('should not render modal when the one of the condition is not met', () => {
    isIpForGov(false);

    renderWithProviders(<PHIModal />, {
      preloadedState: {
        phiToastsSlice: {
          show: true,
        },
      },
    });

    expect(
      screen.queryByText(
        'Important Notice: Authorized Access to Protected Health Information (PHI)'
      )
    ).not.toBeInTheDocument();
  });
});
