import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import EmptyQuestionnaireWarningContainer from '../../containers/EmptyQuestionnaireWarning';
import * as questionnaireActions from '../../actions';

jest.mock('../../actions');

describe('QuestionnaireManager <EmptyQuestionnaireWarning /> Container', () => {
  let preloadedState;

  beforeEach(() => {
    jest.clearAllMocks();

    // Define a base preloaded state for the Redux store
    preloadedState = {
      dialogues: {
        empty_warning: true, // Make the dialogue visible for tests
      },
    };
  });

  it('renders and maps state to props correctly, displaying the warning message', () => {
    renderWithRedux(<EmptyQuestionnaireWarningContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Verify that the message from mapStateToProps is rendered.
    expect(
      screen.getByText(
        'You should have at least one question selected if you want to proceed.'
      )
    ).toBeInTheDocument();

    // Verify the confirm button text is correct.
    expect(screen.getByRole('button', { name: 'Got it!' })).toBeInTheDocument();
  });

  it('maps dispatch to props and calls hideDialogue when the confirm button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<EmptyQuestionnaireWarningContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const confirmButton = screen.getByRole('button', { name: 'Got it!' });
    await user.click(confirmButton);

    // Verify that the hideDialogue action was dispatched.
    expect(questionnaireActions.hideDialogue).toHaveBeenCalledTimes(1);
  });
});
