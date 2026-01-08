import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FileUploadField from '../index';

describe('FileUploadField Component', () => {
  const defaultFiles = [
    {
      id: 12345566,
      original_filename: 'physio_2211_jon_doe.jpg',
      created: '2019-06-25T23:00:00Z',
      filetype: 'image/jpeg',
      filesize: 1564,
      url: 'http://s3:9000/injpro-staging/kitman/physio_2211_jon_doe.jpg',
      confirmed: true,
    },
    {
      id: 5465656,
      original_filename: 'physio_2211_jon_doe.jpeg',
      created: '2019-06-25T23:00:00Z',
      filetype: 'image/jpeg',
      filesize: 123,
      url: 'http://s3:9000/injpro-staging/kitman/physio_2211_jon_doe.jpeg',
      confirmed: true,
    },
  ];

  const defaultProps = {
    updateFiles: jest.fn(),
    removeUploadedFile: jest.fn(),
    files: defaultFiles,
    t: i18nextTranslateStub(),
  };

  it('renders', () => {
    render(<FileUploadField {...defaultProps} />);
    expect(screen.getByText('physio_2211_jon_doe.jpg')).toBeInTheDocument();
    expect(screen.getByText('physio_2211_jon_doe.jpeg')).toBeInTheDocument();
  });

  describe('when label is provided', () => {
    it('displays the label text provided', () => {
      render(<FileUploadField {...defaultProps} label="Label Text" />);
      expect(screen.getByText('Label Text')).toBeInTheDocument();
    });
  });

  it('renders the correct number of uploaded files', () => {
    render(<FileUploadField {...defaultProps} />);
    expect(screen.getAllByText(/physio_2211_jon_doe/)).toHaveLength(2);
  });

  it('does not render an uploaded file list when files are not provided', () => {
    render(<FileUploadField {...defaultProps} files={[]} />);
    expect(
      screen.queryByText('physio_2211_jon_doe.jpg')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('physio_2211_jon_doe.jpeg')
    ).not.toBeInTheDocument();
  });

  it('calls the correct callback when an uploaded file is removed', async () => {
    render(<FileUploadField {...defaultProps} />);
    const uploadedFileContainer = screen
      .getByText('physio_2211_jon_doe.jpg')
      .closest('.fileUploadField__uploadedFile');
    const removeIcon = uploadedFileContainer.querySelector(
      '.fileUploadField__removeIcon'
    );
    expect(removeIcon).toBeInTheDocument();
    await userEvent.click(removeIcon);
    expect(defaultProps.removeUploadedFile).toHaveBeenCalledWith(12345566);
  });

  it('does not render the separate browse button by default', () => {
    render(<FileUploadField {...defaultProps} />);
    expect(screen.queryByText('Upload')).not.toBeInTheDocument();
  });

  it('renders the separate browse button as needed', () => {
    render(<FileUploadField {...defaultProps} separateBrowseButton />);
    const browseButton = screen.getByTestId('browse-files-button');
    expect(browseButton).toBeInTheDocument();
    expect(browseButton).toBeEnabled();
  });

  it('renders the separate browse button disabled as needed', () => {
    render(
      <FileUploadField
        {...defaultProps}
        separateBrowseButton
        separateBrowseButtonDisabled
      />
    );
    const browseButton = screen.getByTestId('browse-files-button');
    expect(browseButton).toBeInTheDocument();
    expect(browseButton).toBeDisabled();
  });

  it('renders the upload text button as needed', () => {
    render(<FileUploadField {...defaultProps} uploadTextButton />);
    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toBeEnabled();
  });

  it('renders the upload text button disabled as needed', () => {
    render(
      <FileUploadField
        {...defaultProps}
        uploadTextButton
        uploadTextButtonDisabled
      />
    );
    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toBeDisabled();
  });

  describe('when the allowUploadedImagePreview prop is set to true', () => {
    it('renders the uploaded files with previews', () => {
      render(<FileUploadField {...defaultProps} allowUploadedImagePreview />);
      expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    it('does not render previews for the unsupported uploaded files', () => {
      const newFiles = [
        ...defaultFiles,
        {
          id: 5465656555,
          original_filename: 'physio_2211_jon_doe.mp4',
          created: '2019-06-25T23:00:00Z',
          filetype: 'video/mp4',
          filesize: 123,
          confirmed: true,
        },
      ];
      render(
        <FileUploadField
          {...defaultProps}
          allowUploadedImagePreview
          files={newFiles}
        />
      );
      expect(screen.getAllByRole('img')).toHaveLength(2);
      expect(screen.getByText('physio_2211_jon_doe.mp4')).toBeInTheDocument();
    });

    it('does not render the upload area when the max file number is 1 and there is an uploaded file', () => {
      const newFiles = [defaultFiles[0]];
      render(
        <FileUploadField
          {...defaultProps}
          allowUploadedImagePreview
          maxFiles={1}
          files={newFiles}
        />
      );
      expect(
        screen.queryByText('Drag & Drop your files or browse')
      ).not.toBeInTheDocument();
    });
  });

  describe('when the allowOpenUploadedFile prop is set to true', () => {
    it('renders the uploaded files with links to open them', () => {
      render(<FileUploadField {...defaultProps} allowOpenUploadedFile />);
      expect(screen.getAllByRole('link')).toHaveLength(2);
    });
  });

  describe('[Feature-flag files-titles]', () => {
    const file = {
      id: 1,
      file: { lastModified: 123 },
      filename: 'boat.jpg',
      filenameWithoutExtension: 'boat',
      fileTitle: 'Test Image Name',
      fileSize: 50,
      fileType: 'image/png',
    };
    beforeEach(() => {
      window.setFlag('files-titles', true);
    });
    afterEach(() => {
      window.setFlag('files-titles', false);
    });

    it('renders the input fields for the files title', () => {
      render(<FileUploadField {...defaultProps} attachedFiles={[file]} />);
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Image Name')).toBeInTheDocument();
    });
    it('allows the input field for the file title to be updated when changed', async () => {
      const user = userEvent.setup();
      let attachedFiles = [
        {
          id: 1,
          file: { lastModified: 123 },
          filename: 'boat.jpg',
          filenameWithoutExtension: 'boat',
          fileTitle: 'Test Image Name',
          fileSize: 50,
          fileType: 'image/png',
        },
      ];
      const setAttachedFiles = (files) => {
        attachedFiles = files;
      };

      // Initial render
      const { rerender } = render(
        <FileUploadField
          {...defaultProps}
          attachedFiles={attachedFiles}
          updateFiles={setAttachedFiles}
        />
      );

      const input = await screen.findByDisplayValue('Test Image Name');
      fireEvent.change(input, { target: { value: 'Updated' } });
      await user.tab();

      attachedFiles = [
        {
          ...attachedFiles[0],
          fileTitle: 'Updated',
        },
      ];

      rerender(
        <FileUploadField
          {...defaultProps}
          attachedFiles={attachedFiles}
          updateFiles={setAttachedFiles}
        />
      );

      expect(screen.getByDisplayValue('Updated')).toBeInTheDocument();
    });
  });

  describe('when the documentScanner prop is set to true', () => {
    it('shows the document scanner when clicking Scan document, and hide it when clicking cancel', async () => {
      render(<FileUploadField {...defaultProps} documentScanner />);
      const scanButton = screen.getByRole('button', { name: 'Scan document' });
      expect(scanButton).toBeInTheDocument();
      expect(screen.queryByText('Scan')).not.toBeInTheDocument();

      await userEvent.click(scanButton);
      expect(screen.getByText('Scan')).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancel');
      expect(cancelButton).toBeInTheDocument();
      await userEvent.click(cancelButton);
      expect(screen.queryByText('Scan')).not.toBeInTheDocument();
    });
  });
});
