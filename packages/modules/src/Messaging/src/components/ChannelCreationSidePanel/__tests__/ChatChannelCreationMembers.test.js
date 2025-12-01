import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChatChannelCreationMembers from '../ChatChannelCreationMembers';

describe('<ChatChannelCreationMembers /> component', () => {
  const staff = [
    { id: 'uidStaff1', firstname: 'staff', lastname: 'member 1' },
    { id: 'uidStaff2', firstname: 'staff', lastname: 'member 2' },
  ];

  const baseProps = {
    channelType: 'private',
    staffUserId: 'uidStaff1',
    staff,
    squads: [],
    currentSelection: { athletes: [], staff: ['uidStaff2'] },
    onUpdatedSelection: jest.fn(),
    onStepNext: jest.fn(),
    nextStepEnabled: true,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls the onStepNext callback when the "Next" button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatChannelCreationMembers {...baseProps} />);

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(baseProps.onStepNext).toHaveBeenCalledTimes(1);
  });

  it('renders the "Next" button with the text "Message" for a direct channel', () => {
    render(<ChatChannelCreationMembers {...baseProps} channelType="direct" />);
    expect(
      screen.getByRole('button', { name: /message/i })
    ).toBeInTheDocument();
  });

  it('disables the "Next" button when nextStepEnabled is false', () => {
    render(
      <ChatChannelCreationMembers {...baseProps} nextStepEnabled={false} />
    );
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('calls onUpdatedSelection with an empty selection when the reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatChannelCreationMembers {...baseProps} />);

    // Assuming the reset button has accessible text
    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(baseProps.onUpdatedSelection).toHaveBeenCalledTimes(1);
    expect(baseProps.onUpdatedSelection).toHaveBeenCalledWith({
      athletes: [],
      staff: [],
    });
  });

  it('calls onUpdatedSelection when the member selection changes', async () => {
    const user = userEvent.setup();
    render(<ChatChannelCreationMembers {...baseProps} />);

    const staffMemberCheckbox = screen.getByLabelText('staff member 2');

    await user.click(staffMemberCheckbox);

    expect(baseProps.onUpdatedSelection).toHaveBeenCalledWith({
      athletes: [], // Unchanged
      staff: [], // "uidStaff2" has been removed
    });
  });
});
