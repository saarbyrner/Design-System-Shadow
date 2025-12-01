import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import SimpleAttachmentUploadModal from '../index';

describe('SimpleAttachmentUploadModal', () => {
  const defaultProps = {
    isOpen: true,
    uploadedFile: null,
    setUploadedFile: jest.fn(),
    onClose: jest.fn(),
    onUpload: jest.fn(),
    uploadButtonText: 'Upload Welcome Pack Information',
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) =>
    render(<SimpleAttachmentUploadModal {...props} />);

  describe('render', () => {
    it('renders the title modal', () => {
      renderComponent();
      expect(screen.getByText('Upload Attachment')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Upload')).toBeInTheDocument();
    });
  });

  it('closes the modal if cancel is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('allows the user to upload a file when it has been selected', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultProps,
      uploadedFile: { filename: 'test file' },
    });
    await user.click(screen.getByText('Upload'));
    expect(defaultProps.onUpload).toHaveBeenCalledWith({
      filename: 'test file',
    });
  });
});
