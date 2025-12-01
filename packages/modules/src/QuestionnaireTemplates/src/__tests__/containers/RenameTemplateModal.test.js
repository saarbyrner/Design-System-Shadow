import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import RenameTemplateModalContainer from '../../containers/RenameTemplateModal';
import * as templateActions from '../../actions';

// Mock the entire actions module to spy on the dispatched actions
jest.mock('../../actions');

describe('Questionnaire Templates <RenameTemplateModal /> Container', () => {
  let user;
  let preloadedState;
  const templateId = '1';

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
      modals: {
        renameTemplateVisible: true, // Make the modal visible for tests
        templateId,
      },
    };
  });

  it('renders with the correct title and initial value from state', () => {
    renderWithRedux(<RenameTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Verify the modal is rendered by checking its title
    expect(
      screen.getByRole('heading', { name: 'Rename Form' })
    ).toBeInTheDocument();

    // The input for the new name should be rendered and have the original name as its value
    const nameInput = screen.getByLabelText('Name');
    expect(nameInput).toHaveValue('Daily Screening');

    // The confirm button should have the correct text
    expect(screen.getByRole('button', { name: 'Rename' })).toBeInTheDocument();
  });

  it('maps dispatch to props and calls closeModal when the close button is clicked', async () => {
    renderWithRedux(<RenameTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const closeButton = screen.getByText(/cancel/i);
    await user.click(closeButton);

    expect(templateActions.closeModal).toHaveBeenCalledTimes(1);
  });

  it('maps dispatch to props and calls renameTemplateRequest on confirm', async () => {
    renderWithRedux(<RenameTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const newName = 'Daily Wellness Check';
    const nameInput = screen.getByLabelText('Name');
    const confirmButton = screen.getByRole('button', { name: 'Rename' });

    // Simulate user changing the name and clicking confirm
    await user.clear(nameInput);
    await user.type(nameInput, newName);
    await user.click(confirmButton);

    // Verify that the renameTemplateRequest action was called with the new name
    expect(templateActions.renameTemplateRequest).toHaveBeenCalledTimes(1);
    expect(templateActions.renameTemplateRequest).toHaveBeenCalledWith(newName);
  });
});
