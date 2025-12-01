import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import AthleteStatusFilter from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/Filters/AthleteStatusFilter';

// Mock the useEventTracking hook
const mockTrackEvent = jest.fn();
jest.mock('@kitman/common/src/hooks/useEventTracking', () => ({
  __esModule: true,
  default: () => ({
    trackEvent: mockTrackEvent,
  }),
}));

const renderComponent = (props = {}) =>
  renderWithRedux(
    <AthleteStatusFilter t={i18nextTranslateStub()} {...props} />
  );

describe('<AthleteStatusFilter />', () => {
  it('renders correctly with default value', () => {
    renderComponent();

    expect(screen.getByLabelText('Athlete status')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Active')).toBeInTheDocument();
  });

  it('allows selecting Free Agent option', async () => {
    const user = userEvent.setup();
    renderComponent();

    const playerStatusSelect = screen.getByLabelText('Athlete status');

    await user.click(playerStatusSelect);

    const freeAgentOption = screen.getByText('Free agent');
    await user.click(freeAgentOption);

    expect(screen.getByDisplayValue('Free agent')).toBeInTheDocument();
  });

  it('prevents clearing the selection and always maintains a value', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Initially should have 'Active' selected
    expect(screen.getByDisplayValue('Active')).toBeInTheDocument();

    // Try to clear the selection (this should not be possible due to disableClearable)
    const playerStatusSelect = screen.getByLabelText('Athlete status');

    // The clear button should not be present
    const clearButton = screen.queryByRole('button', { name: /clear/i });
    expect(clearButton).not.toBeInTheDocument();

    // Select Free Agent
    await user.click(playerStatusSelect);
    const freeAgentOption = screen.getByText('Free agent');
    await user.click(freeAgentOption);

    // Should still have a value selected
    expect(screen.getByDisplayValue('Free agent')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup();
    const changeCallbackMock = jest.fn();

    renderComponent({ onChange: changeCallbackMock });

    const playerStatusSelect = screen.getByLabelText('Athlete status');

    await user.click(playerStatusSelect);

    const freeAgentOption = screen.getByText('Free agent');
    await user.click(freeAgentOption);

    expect(changeCallbackMock).toHaveBeenCalledTimes(1);
    expect(changeCallbackMock).toHaveBeenCalledWith('free_agent');
  });

  it('calls trackEvent with correct staff event name when selection changes', async () => {
    const user = userEvent.setup();
    renderComponent();

    const playerStatusSelect = screen.getByLabelText('Athlete status');

    await user.click(playerStatusSelect);

    const freeAgentOption = screen.getByText('Free agent');
    await user.click(freeAgentOption);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Staff - Completed Forms Filter Athlete Type Used'
    );
  });

  it('calls trackEvent with correct player event name when selection changes', async () => {
    const user = userEvent.setup();
    renderComponent({ isPlayerUsage: true });

    const playerStatusSelect = screen.getByLabelText('Athlete status');

    await user.click(playerStatusSelect);

    const freeAgentOption = screen.getByText('Free agent');
    await user.click(freeAgentOption);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Player - Completed Forms Filter Athlete Type Used'
    );
  });
});
