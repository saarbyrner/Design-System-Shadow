import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  mockUploadedFiles,
  mockAttachedFiles,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import SelectedFiles from '@kitman/modules/src/ElectronicFiles/shared/components/SelectedFiles';

const mockHandleRemoveUploadedFile = jest.fn();
const mockHandleRemoveAttachedFile = jest.fn();

const defaultProps = {
  filesToUpload: [],
  attachedFiles: [],
  uploadedFiles: [],
  errorFileIds: [],
  fitContent: false,
  hideTitle: false,
  hideRemoveAction: false,
  handleRemoveUploadedFile: mockHandleRemoveUploadedFile,
  handleRemoveAttachedFile: mockHandleRemoveAttachedFile,
  t: i18nextTranslateStub(),
};

const renderComponent = (props) =>
  render(<SelectedFiles {...{ ...defaultProps, ...props }} />);

describe('<SelectedFiles/>', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () =>
          Promise.resolve({
            blob: mockUploadedFiles[0].file,
          }),
      })
    );
  });

  it('renders filesToUpload correctly', async () => {
    renderComponent({ filesToUpload: mockUploadedFiles });

    expect(screen.getByText('Attached')).toBeInTheDocument();

    expect(screen.getByText('foobar.pdf - 6 B')).toBeInTheDocument();
    expect(screen.getByText('foo.png - 3 B')).toBeInTheDocument();
    expect(screen.getByText('bar.jpg - 3 B')).toBeInTheDocument();
  });

  it('renders attachedFiles correctly', async () => {
    renderComponent({ attachedFiles: mockAttachedFiles });

    expect(screen.getByText('Attached')).toBeInTheDocument();

    expect(screen.getByText('File1.pdf - 10 B')).toBeInTheDocument();
    expect(screen.getByText('File2.png - 5 B')).toBeInTheDocument();
    expect(screen.getByText('File3.jpg - 20 B')).toBeInTheDocument();
  });

  it('renders filesToUpload and attachedFiles correctly', async () => {
    renderComponent({
      filesToUpload: mockUploadedFiles,
      attachedFiles: mockAttachedFiles,
    });

    expect(screen.getByText('Attached')).toBeInTheDocument();
    expect(screen.getByText('foobar.pdf - 6 B')).toBeInTheDocument();
    expect(screen.getByText('foo.png - 3 B')).toBeInTheDocument();
    expect(screen.getByText('bar.jpg - 3 B')).toBeInTheDocument();
    expect(screen.getByText('File1.pdf - 10 B')).toBeInTheDocument();
    expect(screen.getByText('File2.png - 5 B')).toBeInTheDocument();
    expect(screen.getByText('File3.jpg - 20 B')).toBeInTheDocument();
  });

  it('calls mockHandleRemoveUploadedFile on bin icon click', async () => {
    const user = userEvent.setup();

    renderComponent({ filesToUpload: mockUploadedFiles });

    const secondRemoveIcon = screen.getAllByTestId('DeleteOutlineIcon')[1];

    await user.click(secondRemoveIcon);

    expect(mockHandleRemoveUploadedFile).toHaveBeenCalledTimes(1);
    expect(mockHandleRemoveUploadedFile).toHaveBeenCalledWith(
      mockUploadedFiles[1].file,
      'def456'
    );
  });

  it('calls handleRemoveAttachedFile on bin icon click', async () => {
    const user = userEvent.setup();

    renderComponent({ attachedFiles: mockAttachedFiles });

    const secondRemoveIcon = screen.getAllByTestId('DeleteOutlineIcon')[1];

    await user.click(secondRemoveIcon);

    expect(mockHandleRemoveAttachedFile).toHaveBeenCalledTimes(1);
    expect(mockHandleRemoveAttachedFile).toHaveBeenCalledWith(2);
  });

  it('hides the title when hideTitle is passed', () => {
    renderComponent({ attachedFiles: mockAttachedFiles, hideTitle: true });
    expect(screen.queryByText('Attached')).not.toBeInTheDocument();
  });

  it('hides the remove icon when hideRemoveAction is passed', () => {
    renderComponent({
      attachedFiles: mockAttachedFiles,
      hideRemoveAction: true,
    });
    expect(screen.queryByTestId('DeleteOutlineIcon')).not.toBeInTheDocument();
  });
});
