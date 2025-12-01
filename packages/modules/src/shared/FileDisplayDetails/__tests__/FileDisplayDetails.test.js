import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FileDisplayDetails from '@kitman//modules/src/shared/FileDisplayDetails';

const mockHandleRemoveFile = jest.fn();

const defaultProps = {
  fileDetails: {
    id: '123',
    url: 'https://fakeimage.faketown.com/test.png',
    name: 'test.png',
    type: 'image/png',
    size: 100,
    status: 'confirmed',
    progressPercentage: 100, // %
  },
  showFileStatus: false,
  t: i18nextTranslateStub(),
};

const renderComponent = (props) =>
  render(<FileDisplayDetails {...{ ...defaultProps, ...props }} />);

describe('<FileDisplayDetails/>', () => {
  it('renders file details correctly', () => {
    renderComponent();

    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
    expect(screen.getByText('test.png - 100 B')).toBeInTheDocument();

    // DOES not show the bin icon
    const removeIcon = screen.queryByTestId('DeleteOutlineIcon');
    expect(removeIcon).not.toBeInTheDocument();
  });

  it('shows the confirmed status', () => {
    renderComponent({
      showFileStatus: true,
    });
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('show the inprogress file status', () => {
    renderComponent({
      showFileStatus: true,
      fileDetails: {
        ...defaultProps.fileDetails,
        status: 'inprogress',
        progressPercentage: 50, // %
      },
    });
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    // DOES not show the bin icon
    const removeIcon = screen.queryByTestId('DeleteOutlineIcon');
    expect(removeIcon).not.toBeInTheDocument();
  });

  it('shows the error status', () => {
    renderComponent({
      showFileStatus: true,
      fileDetails: {
        ...defaultProps.fileDetails,
        status: 'errored',
      },
    });
    expect(
      screen.getByText('Error! Please remove this file and try again.')
    ).toBeInTheDocument();
  });

  it('calls handleRemoveFile on bin icon click', async () => {
    const user = userEvent.setup();

    renderComponent({ handleRemoveFile: mockHandleRemoveFile });

    const removeIcon = screen.getByTestId('DeleteOutlineIcon');
    await user.click(removeIcon);

    expect(mockHandleRemoveFile).toHaveBeenCalledTimes(1);
    expect(mockHandleRemoveFile).toHaveBeenCalledWith('123');
  });

  it('displays tooltip on hover OpenInNewOutlined icon', async () => {
    const user = userEvent.setup();

    renderComponent({ handleRemoveFile: mockHandleRemoveFile });

    const openNewWindowIcon = screen.getByTestId('OpenInNewOutlinedIcon');
    await user.hover(openNewWindowIcon);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('displays custom tooltip on hover OpenInNewOutlined icon', async () => {
    const user = userEvent.setup();

    renderComponent({
      handleRemoveFile: mockHandleRemoveFile,
      tooltipText: 'Custom tooltip text',
    });

    const openNewWindowIcon = screen.getByTestId('OpenInNewOutlinedIcon');
    await user.hover(openNewWindowIcon);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText('Custom tooltip text')).toBeInTheDocument();
  });
});
