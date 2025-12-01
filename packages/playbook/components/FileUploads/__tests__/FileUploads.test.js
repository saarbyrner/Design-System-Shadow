import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FileUploads from '@kitman/playbook/components/FileUploads';
import { imageFileTypes } from '@kitman/common/src/utils/mediaHelper';

const mockOnAddFile = jest.fn();
const mockResetValidation = jest.fn();
const filePondRef = {
  current: {
    getFiles: () => [],
  },
};

const defaultProps = {
  filePondRef,
  acceptedFileTypes: [...imageFileTypes],
  onAddFile: mockOnAddFile,
  resetValidation: mockResetValidation,
  allowScanning: false,
  maxFiles: 3,
  t: i18nextTranslateStub(),
};

const renderComponent = (props) =>
  render(<FileUploads {...defaultProps} {...props} />);

describe('<FileUploads />', () => {
  it('renders correctly', () => {
    renderComponent();

    const uploadField = document.querySelector('.filepond--wrapper input');

    expect(uploadField).toBeInTheDocument();
    expect(uploadField.accept).toEqual(
      defaultProps.acceptedFileTypes.join(',')
    );
    expect(uploadField.type).toEqual('file');
    expect(uploadField.multiple).toEqual(true);

    const alert = screen.queryByRole('alert');
    expect(alert).not.toBeInTheDocument();

    const scannerModalDiv = document.querySelector('.ReactModalPortal');
    expect(scannerModalDiv).toBeInTheDocument();
    expect(scannerModalDiv).toBeEmptyDOMElement();

    const showScannerButton = screen.queryByRole('button', {
      name: 'Scan document',
    });
    expect(showScannerButton).not.toBeInTheDocument();

    expect(screen.queryByTestId('validation-error')).not.toBeInTheDocument();
    expect(screen.queryByTestId('FilePond-hidden')).not.toBeInTheDocument();
  });

  it('render alert when max files reached', () => {
    renderComponent({ maxFiles: 0 });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(
      'The maximum number of files allowed (0) has been reached'
    );
    expect(screen.getByTestId('FilePond-hidden')).toBeInTheDocument();
  });

  it('render error border and alert when validation error present', async () => {
    const user = userEvent.setup();

    renderComponent({
      validationErrors: [
        {
          issue: 'Problem with file',
          severity: 'error',
          fileId: 'abc',
          fileName: 'test name',
        },
      ],
    });
    expect(screen.getByTestId('validation-error')).toBeInTheDocument();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Problem with file');

    const clearAlertButton = within(alert).getByRole('button');
    await user.click(clearAlertButton);
    expect(mockResetValidation).toHaveBeenCalled();
  });

  it('renders the scanner UI', async () => {
    const user = userEvent.setup();
    renderComponent({ allowScanning: true });

    const showScannerButton = screen.queryByRole('button', {
      name: 'Scan document',
    });
    expect(showScannerButton).toBeInTheDocument();
    await user.click(showScannerButton);

    const scannerModalDiv = document.querySelector('.ReactModalPortal');
    expect(scannerModalDiv).toBeInTheDocument();
    expect(scannerModalDiv).not.toBeEmptyDOMElement();
  });
});
