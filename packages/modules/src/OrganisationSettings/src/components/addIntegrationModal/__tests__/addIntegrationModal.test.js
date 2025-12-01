import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import AddIntegrationModal from '..';

jest.mock('@kitman/common/src/hooks/useLocationAssign');

describe('<AddIntegrationModal />', () => {
  let baseProps;
  const mockLocationAssign = jest.fn();

  beforeEach(() => {
    useLocationAssign.mockReturnValue(mockLocationAssign);
    jest.clearAllMocks();

    baseProps = {
      availableIntegrations: [
        { url: 'login/fitbit', name: 'Fitbit' },
        { url: 'login/push', name: 'Push Strength' },
      ],
      isOpen: true, // Render the modal open for testing
      onClickCloseModal: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the modal with the correct title and initial state', () => {
    render(<AddIntegrationModal {...baseProps} />);

    expect(screen.getByText('Select vendor')).toBeInTheDocument();
    expect(screen.getByText('Select vendor...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('has a disabled Setup button initially', () => {
    render(<AddIntegrationModal {...baseProps} />);

    const setupButton = screen.getByRole('button', { name: 'Setup' });

    expect(setupButton).toBeDisabled();
  });

  it('calls onClickCloseModal when the modal close icon is clicked', async () => {
    const user = userEvent.setup();

    render(<AddIntegrationModal {...baseProps} />);

    const closeButton = screen.getByRole('button', { name: /cancel/i });

    await user.click(closeButton);

    expect(baseProps.onClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls onClickCloseModal when the cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(<AddIntegrationModal {...baseProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(cancelButton);

    expect(baseProps.onClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('enables the Setup button and calls locationAssign with the correct URL on confirm', async () => {
    const user = userEvent.setup();

    render(<AddIntegrationModal {...baseProps} />);

    const setupButton = screen.getByRole('button', { name: 'Setup' });
    const dropdown = screen.getByText('Select vendor...');

    // Button is initially disabled
    expect(setupButton).toBeDisabled();

    // Select an option from the dropdown
    await user.click(dropdown);
    const fitbitOption = await screen.findByText('Fitbit');
    await user.click(fitbitOption);

    // Button should now be enabled
    expect(setupButton).toBeEnabled();

    // Click the setup button
    await user.click(setupButton);

    // Verify the navigation function was called with the correct URL
    expect(mockLocationAssign).toHaveBeenCalledTimes(1);
    expect(mockLocationAssign).toHaveBeenCalledWith(
      '/settings/integrations/login/fitbit'
    );
  });
});
