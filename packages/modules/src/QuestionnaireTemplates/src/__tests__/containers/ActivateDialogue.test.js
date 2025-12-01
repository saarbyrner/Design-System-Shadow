import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import ActivateDialogueContainer from '../../containers/ActivateDialogue';
import * as templateActions from '../../actions';

// Mock the entire actions module to spy on the dispatched actions
jest.mock('../../actions');

describe('Questionnaire Templates <ActivateDialogue /> Container', () => {
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
          active_athlete_count: 34,
          total_athlete_count: 50,
        },
      },
      dialogues: {
        activate: {
          isVisible: true,
          templateId,
        },
      },
    };
  });

  it('is not visible when isVisible is false', () => {
    preloadedState.dialogues.activate.isVisible = false;
    renderWithRedux(<ActivateDialogueContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The dialogue is still in the DOM but hidden.
    expect(screen.queryByRole('dialog')).toHaveClass('reactDialogue--hidden');
  });

  it('renders with the correct "partial assignment" message', () => {
    renderWithRedux(<ActivateDialogueContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const expectedMessage =
      '34 out of 50 athletes have questions assigned to them, set this form as active?';
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Make active' })
    ).toBeInTheDocument();
  });

  it('renders with the correct "all assigned" message', () => {
    // Update state for this specific test case
    preloadedState.templates[templateId].active_athlete_count = 50;
    preloadedState.templates[templateId].total_athlete_count = 50;

    renderWithRedux(<ActivateDialogueContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const expectedMessage = 'Are you sure you want to set this form as active?';
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('renders with the correct "no questions assigned" message', () => {
    // Update state for this specific test case
    preloadedState.templates[templateId].active_athlete_count = 0;

    renderWithRedux(<ActivateDialogueContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const expectedMessage =
      'You should have at least one question selected if you want to make this form active';
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('dispatches hideActivateDialogue when the cancel button is clicked', async () => {
    renderWithRedux(<ActivateDialogueContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The Dialogue component renders a "Cancel" button
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(templateActions.hideActivateDialogue).toHaveBeenCalledTimes(1);
  });

  it('dispatches activateTemplateRequest and hideActivateDialogue when the confirm button is clicked', async () => {
    renderWithRedux(<ActivateDialogueContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const confirmButton = screen.getByRole('button', { name: 'Make active' });
    await user.click(confirmButton);

    expect(templateActions.activateTemplateRequest).toHaveBeenCalledTimes(1);
    expect(templateActions.activateTemplateRequest).toHaveBeenCalledWith(
      templateId
    );

    expect(templateActions.hideActivateDialogue).toHaveBeenCalledTimes(1);
  });
});
