import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { mockEmailLogs } from '@kitman/services/src/services/notifications/searchEmails/mock';
import EmailDetailsPanel from '../EmailDetailsPanel';

const mockEmail = mockEmailLogs[0];

describe('EmailDetailsPanel', () => {
  const i18nT = i18nextTranslateStub();

  const renderComponent = ({
    isOpen = true,
    onClose = jest.fn(),
    email = mockEmail,
  } = {}) => {
    return render(
      <EmailDetailsPanel
        t={i18nT}
        isOpen={isOpen}
        onClose={onClose}
        email={email}
      />
    );
  };

  it('opens the details panel when isOpen is true', () => {
    renderComponent();
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });
  it('does not open the details panel when isOpen is false', () => {
    renderComponent({ isOpen: false });
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('renders the email details correctly', () => {
    renderComponent();
    expect(screen.getByText(mockEmail.subject)).toBeInTheDocument();
    expect(screen.getByText(mockEmail.recipient)).toBeInTheDocument();
    expect(screen.getByText(mockEmail.message)).toBeInTheDocument();
    expect(screen.getByText(mockEmail.trigger_kind)).toBeInTheDocument();
  });

  it('renders the attachments correctly', () => {
    renderComponent();
    mockEmail.attachments.forEach((attachment) => {
      expect(screen.getByText(attachment.filename)).toBeInTheDocument();
    });
  });

  it('renders the attachment preview on upon clicking the view button', async () => {
    renderComponent();
    const user = userEvent.setup();
    const viewButton = screen.getByLabelText('view-attachment-1');
    await user.click(viewButton);
    expect(screen.getAllByRole('presentation')).toHaveLength(2);
  });

  it('allows for HTML tags and renders them properly', () => {
    renderComponent({
      email: { ...mockEmail, message: 'Some<br><br>unbroken<br><br>text' },
    });
    expect(screen.getByText(/Some\s*unbroken\s*text/)).toBeInTheDocument();
    expect(
      screen.queryByText('Some<br><br>unbroken<br><br>text')
    ).not.toBeInTheDocument();
  });
});
