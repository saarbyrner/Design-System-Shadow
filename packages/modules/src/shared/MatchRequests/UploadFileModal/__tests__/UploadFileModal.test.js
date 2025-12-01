import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import UploadFileModal from '../index';

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const defaultProps = {
  isOpen: true,
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
  t: i18nextTranslateStub(),
};

const renderComponent = (props = {}) => {
  return render(<UploadFileModal {...defaultProps} {...props} />);
};

describe('UploadFileModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal content when open', () => {
    renderComponent();

    expect(screen.getByText('Upload scout attachment')).toBeInTheDocument();
    expect(screen.getByText('Upload one scout attachment')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('should call onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should disable Upload button when no file is selected', () => {
    renderComponent();

    const uploadBtn = screen.getByText('Upload').closest('button');
    expect(uploadBtn).toBeDisabled();
  });

  it('should enable Upload button when valid file is selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const file = new File(['file contents'], 'example.pdf', {
      type: 'application/pdf',
      size: 1000,
    });

    // Simulate file upload
    const input = screen.getByTestId('file-dropzone-input');
    await user.upload(input, file);

    const uploadBtn = screen.getByText('Upload').closest('button');
    expect(uploadBtn).toBeEnabled();
  });

  it('should disable Upload button for oversized files', async () => {
    const user = userEvent.setup();
    renderComponent();

    const bigFile = new File(['a'.repeat(1024 * 10001)], 'big.pdf', {
      type: 'application/pdf',
      size: 1024 * 10001, // over 10MB
    });

    const input = screen.getByTestId('file-dropzone-input');
    await user.upload(input, bigFile);

    const uploadBtn = screen.getByText('Upload').closest('button');
    expect(uploadBtn).toBeDisabled();
  });

  it('should call onSubmit with correct file when Upload is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const file = new File(['file contents'], 'example.pdf', {
      type: 'application/pdf',
      size: 5000,
    });

    const input = screen.getByTestId('file-dropzone-input');
    await user.upload(input, file);

    const uploadBtn = screen.getByText('Upload');
    await user.click(uploadBtn);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      file,
      filename: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  });

  it('should not call onSubmit if no file is selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const uploadBtn = screen.getByText('Upload');
    await user.click(uploadBtn);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should not render anything when modal is closed', () => {
    const { container } = renderComponent({ isOpen: false });
    expect(container).toBeEmptyDOMElement();
  });
});
