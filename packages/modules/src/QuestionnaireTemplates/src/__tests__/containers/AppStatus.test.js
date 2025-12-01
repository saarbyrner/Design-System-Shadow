import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import AppStatusContainer from '../../containers/AppStatus';

describe('Questionnaire Templates <AppStatus /> Container', () => {
  let preloadedState;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test

    // Define a base preloaded state for the Redux store
    preloadedState = {
      appStatus: {
        status: 'success',
        message: 'You did it!',
      },
    };
  });

  it('renders and maps state to props correctly', () => {
    renderWithRedux(<AppStatusContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Verify that the message from the Redux state is rendered by the component.
    // This confirms that mapStateToProps is working correctly.
    expect(screen.getByText('You did it!')).toBeInTheDocument();
  });

  it('does not render when status is null', () => {
    preloadedState.appStatus.status = null;
    renderWithRedux(<AppStatusContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // If status is null, the component should not render the message.
    expect(screen.queryByText('You did it!')).not.toBeInTheDocument();
  });
});
