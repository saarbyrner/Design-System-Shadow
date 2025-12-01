import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import ToastsContainer from '../Toasts';

describe('Toasts Container', () => {
  it('renders toasts from the store correctly', () => {
    const preloadedState = {
      toasts: [
        {
          text: 'Update Template',
          status: 'PROGRESS',
          id: 1,
        },
      ],
      viewType: 'LIST',
      assessments: [],
      appState: {},
    };

    renderWithRedux(<ToastsContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Update Template')).toBeInTheDocument();
    expect(screen.getByText('In progress...')).toBeInTheDocument();
  });
});
