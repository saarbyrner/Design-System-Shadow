import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FileDropzone from '../index';

const defaultProps = {
  value: [],
  setValue: jest.fn(),
  t: i18nextTranslateStub(),
};

const renderComponent = (props = {}) => {
  return render(<FileDropzone {...defaultProps} {...props} />);
};

describe('FileDropzone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default title if none is provided', () => {
    renderComponent();
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
    expect(screen.getByText('or gran and drop')).toBeInTheDocument();
  });

  it('renders provided title and subtitle', () => {
    renderComponent({
      title: <div>Custom Title</div>,
      subtitle: <div>Custom Subtitle</div>,
    });

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('allows valid file to be selected and triggers setValue', async () => {
    const user = userEvent.setup();
    const mockSetValue = jest.fn();

    renderComponent({ setValue: mockSetValue });

    const file = new File(['hello'], 'hello.png', {
      type: 'image/png',
      size: 2000,
    });

    const input = screen.getByTestId('file-dropzone-input');
    await user.upload(input, file);

    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith([file]);
    });
  });

  it('displays file preview and completion info when file is valid', async () => {
    const file = new File(['file content'], 'preview.jpg', {
      type: 'image/jpeg',
      size: 1024,
    });

    const mockValidate = () => null;

    renderComponent({
      value: [file],
      validateFile: mockValidate,
    });

    expect(await screen.findByText('preview.jpg')).toBeInTheDocument();
    expect(await screen.findByText(/Completed/i)).toBeInTheDocument();
  });

  it('shows validation error message when file fails validation', async () => {
    const file = new File(['bad'], 'error.jpg', {
      type: 'image/jpeg',
      size: 999999,
    });

    const validateFile = () => 'File too big';

    renderComponent({
      value: [file],
      validateFile,
    });

    expect(await screen.findByText(/File too big/i)).toBeInTheDocument();
  });

  it('removes file when delete button is clicked', async () => {
    const file = new File(['remove me'], 'remove.png', {
      type: 'image/png',
      size: 500,
    });

    const mockSetValue = jest.fn();

    renderComponent({
      value: [file],
      setValue: mockSetValue,
    });

    const deleteButton = await screen.findByRole('button');
    fireEvent.click(deleteButton);

    expect(mockSetValue).toHaveBeenCalledWith([]);
  });

  it('enforces max file limit by replacing oldest file', async () => {
    const file1 = new File(['first'], '1.png', {
      type: 'image/png',
      size: 500,
    });
    const file2 = new File(['second'], '2.png', {
      type: 'image/png',
      size: 500,
    });

    const mockSetValue = jest.fn();
    const user = userEvent.setup();

    renderComponent({
      value: [file1],
      maxFiles: 1,
      setValue: mockSetValue,
    });

    const input = screen.getByTestId('file-dropzone-input');
    await user.upload(input, file2);

    expect(mockSetValue).toHaveBeenCalledWith([file2]);
  });
});
