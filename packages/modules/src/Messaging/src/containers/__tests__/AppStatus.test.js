import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import AppStatus from '../AppStatus';

describe('AppStatus Container', () => {
  it('renders an empty container when the app status is null', () => {
    const preloadedState = {
      appStatus: {
        status: null,
        message: null,
      },
    };

    renderWithRedux(<AppStatus />, {
      preloadedState,
      useGlobalStore: false,
    });

    const appStatusContainer = screen.getByTestId('AppStatus');

    expect(appStatusContainer).toBeInTheDocument();
    expect(appStatusContainer).toHaveTextContent('');
  });

  it('renders a message and status when they are present in the Redux state', () => {
    const preloadedState = {
      appStatus: {
        status: 'success',
        message: 'Operation successful!',
      },
    };

    renderWithRedux(<AppStatus />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Operation successful!')).toBeInTheDocument();
  });
});
