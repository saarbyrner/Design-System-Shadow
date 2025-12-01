import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import AppStatusContainer from '../AppStatus';

describe('AppStatus Container', () => {
  it('renders the loading state when status is "loading" in the store', () => {
    const preloadedState = {
      appStatus: {
        status: 'loading',
      },
      viewType: 'LIST',
      assessments: [],
      appState: {},
      toasts: [],
    };

    renderWithRedux(<AppStatusContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByTestId('AppStatus|loading')).toBeInTheDocument();
    expect(screen.getByText(/Saving/i)).toBeInTheDocument();
  });
});
