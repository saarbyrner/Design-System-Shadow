import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import ArchiveAttachmentModal from '../ArchiveAttachmentModal';
import {
  mockAttachment,
  mockArchiveReasonOptions,
} from './mocks/ArchiveAttachmentModal.mock';

describe('<ArchiveAttachmentModal />', () => {
  const props = {
    isOpen: true,
    onClose: jest.fn(),
    archiveModalOptions: mockArchiveReasonOptions,
    attachment: mockAttachment,
    onArchiveComplete: jest.fn(),
    toastAction: jest.fn(),
    toasts: [
      {
        id: 1,
        status: 'SUCCESS',
        title: 'Test Title',
        description: 'This is a test description',
        links: [
          {
            id: 1,
            text: 'Try Again',
            link: '#',
            withHashParam: true,
            metadata: {
              action: 'RETRY_REQUEST',
            },
          },
        ],
      },
    ],
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    render(<ArchiveAttachmentModal {...props} />);
  });

  it('modal header renders correctly', async () => {
    expect(screen.getByText('Archive Attachment')).toBeInTheDocument();
  });

  it('modal description renders correctly', async () => {
    expect(
      screen.getByText(
        'Please provide the reason why this attachment is being archived'
      )
    ).toBeInTheDocument();
  });

  it('modal select correctly rendered', async () => {
    expect(screen.getByText('Reason for archiving:')).toBeInTheDocument();
  });

  it('modal buttons rendered correctly', async () => {
    expect(screen.getByText('Archive')).toBeInTheDocument();
    expect(screen.getByText('Archive').closest('button')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Cancel').closest('button')).toBeEnabled();
  });

  it('modal options rendered correctly', async () => {
    const archiveReasonInput = document.querySelector(
      '.kitmanReactSelect__control'
    );

    await userEvent.click(archiveReasonInput);

    expect(await screen.findByText('Duplicate')).toBeInTheDocument();
    expect(await screen.findByText('Incorrect athlete')).toBeInTheDocument();
    expect(await screen.findByText('Note not relevant')).toBeInTheDocument();
  });

  it('renders toast correctly', async () => {
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});
