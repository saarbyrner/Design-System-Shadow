import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChatTextArea from '../ChatTextArea';

describe('<ChatTextArea /> component', () => {
  const baseProps = {
    canSendMessages: true,
    currentChannel: {},
    acceptedFileTypes: [],
    inProgressMedia: [],
    connectionIssue: false,
    onMessageSend: jest.fn(),
    onSendMedia: jest.fn(),
    allowDropAttachments: true,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enables the send button when text is entered', () => {
    const { container } = render(
      <ChatTextArea {...baseProps} initialMessage="A valid message" />
    );

    const sendButton = container.querySelector('.icon-send');
    expect(sendButton).toBeEnabled();
  });

  it('calls onMessageSend when the send button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ChatTextArea {...baseProps} initialMessage="This is a test" />
    );

    const sendButton = container.querySelector('.icon-send');
    await user.click(sendButton);

    expect(baseProps.onMessageSend).toHaveBeenCalledWith(
      'This is a test',
      'ME'
    );
  });

  it('renders toasts for in-progress media files', () => {
    render(
      <ChatTextArea {...baseProps} inProgressMedia={['uploading-image.jpg']} />
    );
    expect(screen.getByText('uploading-image.jpg')).toBeInTheDocument();
  });

  it('renders offline text if there is a connection issue', () => {
    render(<ChatTextArea {...baseProps} connectionIssue />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });
});
