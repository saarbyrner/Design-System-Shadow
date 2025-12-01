import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import DuplicateTemplateModalContainer from '../../containers/DuplicateTemplateModal';
import * as templateActions from '../../actions';
import duplicateTemplateService from '../../services/duplicateTemplate';

// Mock dependencies
jest.mock('../../actions');
jest.mock('../../services/duplicateTemplate');
jest.mock('@kitman/common/src/hooks/useLocationAssign');

describe('Questionnaire Templates <DuplicateTemplateModal /> Container', () => {
  let user;
  let preloadedState;
  const mockLocationAssign = jest.fn();
  const templateId = '1';

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    // Configure the mocked hook to return our spy function for each test
    useLocationAssign.mockReturnValue(mockLocationAssign);

    // Define a base preloaded state for the Redux store
    preloadedState = {
      templates: {
        [templateId]: {
          id: templateId,
          name: 'Daily Screening',
        },
      },
      modals: {
        duplicateTemplateVisible: true, // Make the modal visible for tests
        templateId,
      },
    };
  });

  it('renders the modal with the correct title and an empty input', () => {
    renderWithRedux(<DuplicateTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Verify the modal is rendered by checking its title, which includes the original template name
    expect(
      screen.getByRole('heading', { name: /Duplicate Form: Daily Screening/i })
    ).toBeInTheDocument();

    // The input for the new name should be rendered and initially empty
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('maps dispatch to props and calls closeModal when the close button is clicked', async () => {
    renderWithRedux(<DuplicateTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const closeButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(closeButton);

    expect(templateActions.closeModal).toHaveBeenCalledTimes(1);
  });

  it('maps dispatch to props and calls the correct actions on successful confirm', async () => {
    jest.useFakeTimers();
    const userWithTimers = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    const newTemplateName = 'My Duplicated Form';
    // Mock the service to return a successful response with the new template's ID
    duplicateTemplateService.mockResolvedValue({
      template: { id: '999' },
    });

    renderWithRedux(<DuplicateTemplateModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Simulate user typing a new name and confirming
    const nameInput = screen.getByLabelText('Name');
    await userWithTimers.type(nameInput, newTemplateName);
    const confirmButton = screen.getByRole('button', { name: 'Create' });
    await userWithTimers.click(confirmButton);

    // It should first dispatch a saving request
    expect(templateActions.savingRequest).toHaveBeenCalledTimes(1);
    // Then it should call the service with the original ID and new name
    expect(duplicateTemplateService).toHaveBeenCalledWith(
      templateId,
      newTemplateName
    );

    // Wait for the promise from the service to resolve
    await waitFor(() =>
      expect(duplicateTemplateService).toHaveBeenCalledTimes(1)
    );

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
    jest.useFakeTimers();
    const userWithTimers = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    const newTemplateName = 'My Failing Form';
    // Mock the service to return a failed response
    duplicateTemplateService.mockRejectedValue(new Error('API Error'));

    renderWithRedux(<DuplicateTemplateModalContainer />, {
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
