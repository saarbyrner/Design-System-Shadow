import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import ClearAllWarningContainer from '../../containers/ClearAllWarning';
import * as questionnaireActions from '../../actions';

jest.mock('../../actions');

describe('QuestionnaireManager <ClearAllWarning /> Container', () => {
  let preloadedState;

  beforeEach(() => {
    jest.clearAllMocks();

    preloadedState = {
      variablePlatforms: [
        { name: 'Well-being', value: 'well_being' },
        { name: 'MSK', value: 'msk' },
      ],
      variables: {
        selectedPlatform: 'well_being',
      },
      athletes: {
        searchTerm: null,
      },
      dialogues: {
        clear_all_warning: true, // Make the dialogue visible for tests
      },
    };
  });

  it('renders and is visible when state requires it', () => {
    renderWithRedux(<ClearAllWarningContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The Dialogue component renders with a role of "dialog"
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('displays the correct message when there is a search term', () => {
    preloadedState.athletes.searchTerm = 'Bob';
    renderWithRedux(<ClearAllWarningContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const expectedMessage =
      'Are you sure you want to clear all Well-being questions for Bob?';
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('displays the correct message when there is no search term', () => {
    renderWithRedux(<ClearAllWarningContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const expectedMessage =
      'Are you sure you want to clear all Well-being questions?';
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('displays the correct message when there is no selected platform', () => {
    preloadedState.variables.selectedPlatform = null;
    renderWithRedux(<ClearAllWarningContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const expectedMessage = 'Are you sure you want to clear all questions?';
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('maps dispatch to props and calls hideDialogue when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<ClearAllWarningContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(questionnaireActions.hideDialogue).toHaveBeenCalledTimes(1);
  });

  it('maps dispatch to props and calls clearAllVisibleVariables when the confirm button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<ClearAllWarningContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const confirmButton = screen.getByRole('button', { name: 'Clear' });
    await user.click(confirmButton);

    expect(questionnaireActions.clearAllVisibleVariables).toHaveBeenCalledTimes(
      1
    );
  });
});
