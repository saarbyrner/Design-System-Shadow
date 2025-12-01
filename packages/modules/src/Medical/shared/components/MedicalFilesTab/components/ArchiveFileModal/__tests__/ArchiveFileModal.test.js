import { render, screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import archiveDocument from '@kitman/services/src/services/medical/archiveDocument';
import selectEvent from 'react-select-event';
import ArchiveFileModal from '..';
import { mockFile, mockArchiveReasonOptions } from './mocks/ArchivedFileModal';

jest.mock('@kitman/services/src/services/medical/archiveDocument');

describe('<ArchiveFileModal />', () => {
  const props = {
    isOpen: true,
    setShowArchiveModal: Function,
    archiveModalOptions: mockArchiveReasonOptions,
    selectedRow: mockFile,
    athleteId: 123,
    getDocuments: jest.fn(),
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
    render(<ArchiveFileModal {...props} />);
  });

  it('modal header renders correctly', async () => {
    expect(screen.getByText('Archive Document')).toBeInTheDocument();
  });

  it('modal description renders correctly', async () => {
    expect(
      screen.getByText(
        'Please provide the reason why this document is being archived'
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
    const archiveReasonInput = screen.getByLabelText('Reason for archiving:');
    selectEvent.openMenu(archiveReasonInput);

    expect(await screen.findByText('Duplicate')).toBeInTheDocument();
    expect(await screen.findByText('Incorrect athlete')).toBeInTheDocument();
    expect(await screen.findByText('Note not relevant')).toBeInTheDocument();
  });

  it('renders toast correctly', async () => {
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should call archiveDocuments on click of archive button', async () => {
    const archiveReasonInput = screen.getByLabelText('Reason for archiving:');

    selectEvent.openMenu(archiveReasonInput);
    await selectEvent.select(archiveReasonInput, ['Duplicate'], {
      container: document.body,
    });

    await waitFor(() => {
      expect(screen.getByText('Archive').closest('button')).toBeEnabled();
    });

    await userEvent.click(screen.getByText('Archive').closest('button'));
    expect(archiveDocument).toHaveBeenCalled();
  });
});
