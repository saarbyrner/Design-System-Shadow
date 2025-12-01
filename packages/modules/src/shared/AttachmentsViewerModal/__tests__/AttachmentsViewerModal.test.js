import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AttachmentsViewerModal from '@kitman/modules/src/shared/AttachmentsViewerModal';

const mockClose = jest.fn();

const mockAttachments = [
  {
    id: 123,
    url: 'https://fakeimage.faketown.com/test.png',
    name: 'test.png',
    filename: 'test.png',
    filetype: 'image/png',
    filesize: 100,
  },
  {
    id: 456,
    url: 'https://fakepdf.faketown.com/test.pdf',
    name: 'test.pdf',
    filename: 'test.pdf',
    filetype: 'application/pdf',
    filesize: 200,
  },
  {
    id: 789,
    url: 'invalidUrl',
    name: null,
    filename: 'invalid.jpg',
    filetype: 'image/jpg',
    filesize: 300,
  },
];

const defaultProps = {
  open: true,
  onClose: mockClose,
  attachments: mockAttachments,
  t: i18nextTranslateStub(),
};

const renderComponent = (props) =>
  render(<AttachmentsViewerModal {...{ ...defaultProps, ...props }} />);

describe('<AttachmentsViewerModal/>', () => {
  it('renders correctly when closed', () => {
    renderComponent({ open: false });
    expect(screen.getByTestId('AttachmentsViewerModal')).toBeInTheDocument();
    const modalRole = screen.queryByRole('presentation');
    expect(modalRole).not.toBeInTheDocument();
  });

  it('renders tab content correctly', () => {
    renderComponent();
    const modalRole = screen.getAllByRole('presentation');
    expect(modalRole).toHaveLength(2); // MuiDialog-root & MuiDialog-container

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveTextContent(mockAttachments[0].name);
    expect(tabs[1]).toHaveTextContent(mockAttachments[1].name);
    expect(tabs[2]).toHaveTextContent(mockAttachments[2].filename);

    // First tab content
    expect(screen.getByText('test.png - 100 B')).toBeInTheDocument();
  });

  it('renders nothing if null attachments', () => {
    renderComponent({ attachments: null });
    const modalRole = screen.queryByRole('presentation');
    expect(modalRole).not.toBeInTheDocument();

    const tabs = screen.queryByRole('tab');
    expect(tabs).not.toBeInTheDocument();
  });

  it('renders nothing if no attachments', () => {
    renderComponent({ attachments: [] });
    const modalRole = screen.queryByRole('presentation');
    expect(modalRole).not.toBeInTheDocument();
    const tabs = screen.queryByRole('tab');
    expect(tabs).not.toBeInTheDocument();
  });

  it('changes tabs correctly', async () => {
    const user = userEvent.setup();
    renderComponent();

    // First tab content shown
    expect(screen.getByText('test.png - 100 B')).toBeInTheDocument();

    const secondTabButton = screen.getByRole('tab', {
      name: mockAttachments[1].name,
    });
    await user.click(secondTabButton);

    // First tab content not shown
    expect(screen.queryByText('test.png - 100 B')).not.toBeInTheDocument();
    // Second tab content shown
    expect(screen.getByText('test.pdf - 200 B')).toBeInTheDocument();

    const thirdTabButton = screen.getByRole('tab', {
      name: mockAttachments[2].filename,
    });
    await user.click(thirdTabButton);

    // First tab content not shown
    expect(screen.queryByText('test.png - 100 B')).not.toBeInTheDocument();
    // Second tab content not shown
    expect(screen.queryByText('test.pdf - 200 B')).not.toBeInTheDocument();
    // Third tab content shown
    expect(screen.queryByText('invalid.jpg - 300 B')).toBeInTheDocument();
    // Content shown
    expect(
      screen.getByRole('img', { title: mockAttachments[2].name })
    ).toBeInTheDocument();
  });

  it('calls onClose on clicking close', async () => {
    const user = userEvent.setup();
    renderComponent();

    const closeIcon = screen.getByTestId('CloseIcon');
    await user.click(closeIcon);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('displays card media', async () => {
    const user = userEvent.setup();
    renderComponent();

    // First tab content shown
    expect(
      screen.getByRole('img', { title: mockAttachments[0].name })
    ).toBeInTheDocument();

    const secondTabButton = screen.getByRole('tab', {
      name: mockAttachments[1].name,
    });
    await user.click(secondTabButton);

    // Second tab content shown
    expect(screen.getByText('test.pdf - 200 B')).toBeInTheDocument();
    expect(screen.getByTestId('OpenInNewOutlinedIcon')).toBeInTheDocument();

    const pdfViewers = document.getElementsByClassName('pdfViewerContainer');
    expect(pdfViewers.length).toBe(1);
    expect(screen.getByText('Failed to load PDF file.')).toBeInTheDocument();
  });
});
