import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import AppStatusContainer from '../../containers/AppStatus';
import * as questionnaireActions from '../../actions';

jest.mock('../../actions');

describe('QuestionnaireManager <AppStatus /> Container', () => {
  let preloadedState;

  beforeEach(() => {
    jest.clearAllMocks();

    preloadedState = {
      modal: {
        status: 'success',
        message: 'You did it!',
        hideButtonText: 'Got it',
      },
    };
  });

  it('renders and maps state to props correctly for success status', () => {
    renderWithRedux(<AppStatusContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Verify that the message from the Redux state is rendered by the component.
    // This confirms that mapStateToProps is working correctly.
    expect(screen.getByText('You did it!')).toBeInTheDocument();

    // For 'success' status, there is no button rendered by the component.
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render when status is null', () => {
    preloadedState.modal.status = null;
    renderWithRedux(<AppStatusContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // If status is null, the AppStatus component should not render the message.
    expect(screen.queryByText('You did it!')).not.toBeInTheDocument();
  });

  it('maps dispatch to props and calls hideCurrentModal when the close button is clicked for a validationError status', async () => {
    const user = userEvent.setup();

    preloadedState.modal.status = 'validationError';
    preloadedState.modal.message = 'Validation failed!';

    renderWithRedux(<AppStatusContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The AppStatus component should have a close button (which is the hide button in this case).
    const closeButton = screen.getByRole('button', { name: 'Got it' });
    await user.click(closeButton);

    // Verify that the hideCurrentModal action was dispatched.
    expect(questionnaireActions.hideCurrentModal).toHaveBeenCalledTimes(1);
  });
});
