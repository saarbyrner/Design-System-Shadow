import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import LabelsMenu from '@kitman/modules/src/LeagueOperations/shared/components/GridBulkActionBar/LabelsMenu/index';

const mockOnSave = jest.fn(() => Promise.resolve());
const mockOnClose = jest.fn();
const mockHandleLabelChange = jest.fn();
const t = i18nextTranslateStub();
const user = userEvent.setup();
const defaultProps = {
  anchorEl: {},
  isDataFetching: false,
  isUpdateLabelsLoading: false,
  options: [
    { value: 1, label: 'Label 1', color: '#ff0000' },
    { value: 2, label: 'Label 2', color: '#00ff00' },
  ],
  selectedLabelIds: [1],
  onSave: mockOnSave,
  onClose: mockOnClose,
  handleOnChange: mockHandleLabelChange,
  t,
};

const renderComponent = (props = {}) => {
  return render(<LabelsMenu {...defaultProps} {...props} />);
};

describe('LabelsMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner when data is fetching', () => {
    renderComponent({ isDataFetching: true });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders label options when not loading', () => {
    renderComponent();
    expect(screen.getByText('Label 1')).toBeInTheDocument();
    expect(screen.getByText('Label 2')).toBeInTheDocument();
  });

  it('calls handleLabelChange when a label is clicked', async () => {
    renderComponent();
    const labelItem = screen.getByText('Label 2');
    await user.click(labelItem);
    expect(mockHandleLabelChange).toHaveBeenCalledWith(
      expect.any(Object),
      [1, 2]
    );
  });

  it('removes label if it is already selected', async () => {
    renderComponent();
    const labelItem = screen.getByText('Label 1');
    await user.click(labelItem);
    expect(mockHandleLabelChange).toHaveBeenCalledWith(expect.any(Object), []);
  });

  it('calls onCloseMenu when cancel is clicked', async () => {
    renderComponent();
    await user.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onSaveClick and then onCloseMenu when save is clicked', async () => {
    renderComponent();
    user.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('disables save button when loading', () => {
    renderComponent({ isUpdateLabelsLoading: true });
    expect(screen.getByText('Save')).toBeDisabled();
  });

  it('renders correctly with no labels', () => {
    renderComponent({ options: [] });
    expect(screen.getByText('No labels found.')).toBeInTheDocument();
  });
});
