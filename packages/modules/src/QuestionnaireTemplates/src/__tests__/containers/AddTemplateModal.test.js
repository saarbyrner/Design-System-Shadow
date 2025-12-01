import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import addTemplateService from '@kitman/modules/src/QuestionnaireTemplates/src/services/addTemplate';
import AddTemplateModalContainer from '../../containers/AddTemplateModal';
import * as templateActions from '../../actions';

// Mock dependencies
jest.mock('../../actions');
jest.mock(
  '@kitman/modules/src/QuestionnaireTemplates/src/services/addTemplate'
);
jest.mock('@kitman/common/src/hooks/useLocationAssign');

describe('Questionnaire Templates <AddTemplateModal /> Container', () => {
  let user;
  let preloadedState;
  const mockLocationAssign = jest.fn();

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    // Configure the mocked hook to return our spy function for each test
    useLocationAssign.mockReturnValue(mockLocationAssign);

    // Define a base preloaded state for the Redux store
    preloadedState = {
      templates: {}, // Start with no templates for uniqueness validation
      modals: {
        addTemplateVisible: true, // Make the modal visible for tests
      },
    };
  });

  it('renders the modal and maps state to props correctly', () => {
    renderWithRedux(<AddTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Verify the modal is rendered by checking its title
    expect(
      screen.getByRole('heading', { name: 'New Form' })
    ).toBeInTheDocument();
  });

  it('is not visible when addTemplateVisible is false in state', () => {
    preloadedState.modals.addTemplateVisible = false;
    renderWithRedux(<AddTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The modal component should not be visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('maps dispatch to props and calls closeModal when the close button is clicked', async () => {
    renderWithRedux(<AddTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The ChooseNameModal component has a close button
    const closeButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(closeButton);

    expect(templateActions.closeModal).toHaveBeenCalledTimes(1);
  });

  it('maps dispatch to props and calls the correct actions on successful confirm', async () => {
    jest.useFakeTimers();
    const userWithTimers = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    const newTemplateName = 'My New Form';
    // Mock the service to return a successful response
    addTemplateService.mockResolvedValue({
      template: { id: '999' },
    });

    renderWithRedux(<AddTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Simulate user typing a name and confirming
    const nameInput = screen.getByLabelText('Name');
    await userWithTimers.type(nameInput, newTemplateName);

    const confirmButton = screen.getByRole('button', { name: 'Create' });
    await userWithTimers.click(confirmButton);

    // It should first dispatch a saving request and call the service
    expect(templateActions.savingRequest).toHaveBeenCalledTimes(1);
    expect(addTemplateService).toHaveBeenCalledWith(newTemplateName);

    // Wait for the promise from the service to resolve.
    await waitFor(() => expect(addTemplateService).toHaveBeenCalledTimes(1));

    // Now that the promise has resolved, the setTimeout has been scheduled.
    // Advance the timers to execute the code inside the timeout.
    jest.runAllTimers();

    // Now assert the final navigation call.
    expect(mockLocationAssign).toHaveBeenCalledWith(
      '/settings/questionnaire_templates/999'
    );

    jest.useRealTimers();
  });

  it('maps dispatch to props and calls requestError on failed confirm', async () => {
    // Apply the same timer setup for consistency with other async tests
    jest.useFakeTimers();
    const userWithTimers = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    const newTemplateName = 'My Failing Form';
    // Mock the service to return a failed response
    addTemplateService.mockRejectedValue(new Error('API Error'));

    renderWithRedux(<AddTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Simulate user typing a name and confirming
    const nameInput = screen.getByLabelText('Name');
    await userWithTimers.type(nameInput, newTemplateName);
    const confirmButton = screen.getByRole('button', { name: 'Create' });
    await userWithTimers.click(confirmButton);

    // It should first dispatch a saving request
    expect(templateActions.savingRequest).toHaveBeenCalledTimes(1);

    // Wait for the promise to resolve and check for the error action
    await waitFor(() => {
      expect(templateActions.requestError).toHaveBeenCalledTimes(1);
    });

    // It should not attempt to navigate
    expect(mockLocationAssign).not.toHaveBeenCalled();
    jest.useRealTimers();
  });
});
