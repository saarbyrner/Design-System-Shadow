import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import LayoutReport from '../layout';

const i18nT = i18nextTranslateStub();

describe('LayoutReport', () => {
  const mockExportReport = jest.fn();
  const mockOnSnackbarClose = jest.fn();

  const props = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Title',
    children: <p>Test Children</p>,
    exportReport: mockExportReport,
    openSnackbar: false,
    onSnackbarClose: mockOnSnackbarClose,
    isSuccess: true,
    isExportDisabled: false,
    t: i18nT,
  };

  it('renders correctly', () => {
    const { getByText } = render(<LayoutReport {...props} />);
    expect(getByText(props.title)).toBeInTheDocument();
    expect(getByText('Test Children')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();

    const { getByTestId } = render(<LayoutReport {...props} />);
    await user.click(getByTestId('CloseIcon'));
    expect(props.onClose).toHaveBeenCalled();
  });

  it('should not display component when isOpen is false', async () => {
    const { queryByText } = render(<LayoutReport {...props} isOpen={false} />);
    expect(queryByText(props.title)).not.toBeInTheDocument();
  });

  it('calls exportReport when export button is clicked', async () => {
    const user = userEvent.setup();

    const { getByText } = render(<LayoutReport {...props} />);
    await user.click(getByText('Export'));
    expect(mockExportReport).toHaveBeenCalled();
  });

  it('disables export button when isExportDisabled is true', () => {
    const { getByText } = render(<LayoutReport {...props} isExportDisabled />);
    const button = getByText('Export');
    expect(button).toBeDisabled();
  });
});
