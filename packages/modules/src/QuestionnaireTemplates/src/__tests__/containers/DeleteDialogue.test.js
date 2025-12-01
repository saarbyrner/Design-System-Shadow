import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import DeleteDialogueContainer from '../../containers/DeleteDialogue';
import * as templateActions from '../../actions';

// Mock the entire actions module to spy on the dispatched actions
jest.mock('../../actions');

describe('Questionnaire Templates <DeleteDialogue /> Container', () => {
  let user;
  let preloadedState;
  const templateId = '123';

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks(); // Clear mocks before each test

    // Define a base preloaded state for the Redux store
    preloadedState = {
      templates: {
        [templateId]: {
          id: templateId,
          name: 'Daily Screening',
        },
      },
      dialogues: {
        // This test file only concerns the delete dialogue
        delete: {
          isVisible: true,
          templateId,
        },
        activate: {
          isVisible: false,
          templateId: null,
        },
      },
    };
  });

  it('is not visible when isVisible is false', () => {
    preloadedState.dialogues.delete.isVisible = false;
    renderWithRedux(<DeleteDialogueContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The dialogue is still in the DOM but hidden
    expect(screen.getByRole('dialog')).toHaveClass('reactDialogue--hidden');
  });

  it('renders with the correct message and maps state to props', () => {
    renderWithRedux(<DeleteDialogueContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const expectedMessage =
      'Are you sure you want to delete "Daily Screening"?';
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('maps dispatch to props and calls hideDeleteDialogue when the cancel button is clicked', async () => {
    renderWithRedux(<DeleteDialogueContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The Dialogue component renders a "Cancel" button
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(templateActions.hideDeleteDialogue).toHaveBeenCalledTimes(1);
  });

  it('maps dispatch to props and calls the correct actions when the confirm button is clicked', async () => {
    renderWithRedux(<DeleteDialogueContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(confirmButton);

    // It should dispatch both the request and the action to hide the dialogue
    expect(templateActions.deleteTemplateRequest).toHaveBeenCalledTimes(1);
    expect(templateActions.deleteTemplateRequest).toHaveBeenCalledWith(
      templateId
    );

    expect(templateActions.hideDeleteDialogue).toHaveBeenCalledTimes(1);
  });
});
