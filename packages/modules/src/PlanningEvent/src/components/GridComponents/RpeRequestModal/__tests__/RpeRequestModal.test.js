import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import RpeRequestModal from '..';

describe('RpeRequestModal', () => {
  const mockSetOpenModal = jest.fn();
  const mockSendNotifications = jest.fn();

  const props = {
    openModal: true,
    setOpenModal: mockSetOpenModal,
    sendNotifications: mockSendNotifications,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct content', () => {
    render(<RpeRequestModal {...props} />);

    expect(screen.getByText('Send RPE Request')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('does not render when modal is closed', () => {
    render(<RpeRequestModal {...props} openModal={false} />);

    expect(screen.queryByText('Send RPE Request')).not.toBeInTheDocument();
  });

  it('contains the correct label', () => {
    render(<RpeRequestModal {...props} />);

    expect(screen.getByText('Send RPE Request')).toBeInTheDocument();
  });

  it('contains the correct message', () => {
    render(<RpeRequestModal {...props} />);

    expect(
      screen.getByText('An RPE request was sent within the last 30 minutes.')
    ).toBeInTheDocument();
    expect(screen.getByText('Send another RPE request?')).toBeInTheDocument();
  });

  it('contains the cancel button', async () => {
    const user = userEvent.setup();
    render(<RpeRequestModal {...props} />);

    const cancelButton = screen.getByTestId('rpeRequestModal__cancelButton');
    expect(cancelButton).toBeInTheDocument();

    await user.click(cancelButton);
    expect(mockSetOpenModal).toHaveBeenCalledWith(false);
  });

  it('contains the send button', async () => {
    const user = userEvent.setup();
    render(<RpeRequestModal {...props} />);

    const sendButton = screen.getByTestId('rpeRequestModal__sendButton');
    expect(sendButton).toBeInTheDocument();

    await user.click(sendButton);
    expect(mockSendNotifications).toHaveBeenCalled();
    expect(mockSetOpenModal).toHaveBeenCalledWith(false);
  });
});
