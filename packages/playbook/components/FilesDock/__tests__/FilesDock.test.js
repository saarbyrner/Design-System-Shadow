import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FilesDock from '@kitman/playbook/components/FilesDock';
import { mockFilePondFiles } from '@kitman/common/src/hooks/mocks/mocksForUploads.mock';

const mockHandleRemoveFile = jest.fn();

const defaultProps = {
  filesToUpload: [],
  fitContent: false,
  hideTitle: false,
  hideRemoveAction: false,
  handleRemoveFile: mockHandleRemoveFile,
  t: i18nextTranslateStub(),
};

const statuses = ['pending', 'inprogress', 'errored', 'queued'];
const mockManagedFiles = mockFilePondFiles.map((file, index) => ({
  file,
  progressPercentage: 0,
  status: index < statuses.length ? statuses[index] : 'confirmed',
}));

const renderComponent = (props) =>
  render(<FilesDock {...{ ...defaultProps, ...props }} />);

describe('<FilesDock/>', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () =>
          Promise.resolve({
            blob: mockFilePondFiles[0].file,
          }),
      })
    );
  });

  it('renders filesToUpload correctly', async () => {
    renderComponent({ filesToUpload: mockManagedFiles });

    expect(screen.getByText('Attached')).toBeInTheDocument();

    expect(screen.getByText('foobar.pdf - 6 B')).toBeInTheDocument();

    expect(screen.getByText('foo.png - 3 B')).toBeInTheDocument();
    expect(screen.getByText('Processing...')).toBeInTheDocument();

    expect(screen.getByText('bar.jpg - 3 B')).toBeInTheDocument();
    expect(
      screen.getByText('Error! Please remove this file and try again.')
    ).toBeInTheDocument();

    expect(screen.getByText('baz.jpg - 3 B')).toBeInTheDocument();
  });

  it('calls handleRemoveFile on bin icon click', async () => {
    const user = userEvent.setup();

    renderComponent({ filesToUpload: mockManagedFiles });

    const removeIcons = screen.getAllByTestId('DeleteOutlineIcon');
    expect(removeIcons.length).toEqual(3);
    await user.click(removeIcons[0]);

    expect(mockHandleRemoveFile).toHaveBeenCalledTimes(1);
    expect(mockHandleRemoveFile).toHaveBeenCalledWith(
      mockManagedFiles[0].file.id
    );

    await user.click(removeIcons[1]);
    expect(mockHandleRemoveFile).toHaveBeenCalledTimes(2);
    expect(mockHandleRemoveFile).toHaveBeenCalledWith(
      mockManagedFiles[2].file.id
    );

    await user.click(removeIcons[2]);
    expect(mockHandleRemoveFile).toHaveBeenCalledTimes(3);
    expect(mockHandleRemoveFile).toHaveBeenCalledWith(
      mockManagedFiles[3].file.id
    );
  });

  it('hides the title when hideTitle is passed', () => {
    renderComponent({ filesToUpload: mockManagedFiles, hideTitle: true });
    expect(screen.queryByText('Attached')).not.toBeInTheDocument();
  });

  it('hides the remove icon when hideRemoveAction is passed', () => {
    renderComponent({
      filesToUpload: mockManagedFiles,
      hideRemoveAction: true,
    });
    expect(screen.queryByTestId('DeleteOutlineIcon')).not.toBeInTheDocument();
  });
});
