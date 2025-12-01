import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import SelectTrigger from '../index';

const mockAthletes = [
  { id: 1, key: 'ath-1', name: 'Alice' },
  { id: 2, key: 'ath-2', name: 'Bob' },
  { id: 3, key: 'ath-3', name: 'Charlie' },
];

describe('<SelectTrigger />', () => {
  const defaultProps = {
    isOpen: false,
    isLoading: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
    athletes: mockAthletes,
    selectedIds: new Set(),
    setSelectedIds: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = {}) =>
    render(<SelectTrigger {...defaultProps} {...props} />);

  it('renders the component with label', () => {
    renderComponent();
    expect(screen.getByText('Athletes')).toBeInTheDocument();
  });

  it('renders "No athletes selected" when none are selected', () => {
    renderComponent();
    expect(screen.getByText('No athletes selected')).toBeInTheDocument();
  });

  it('renders selected athlete names when some are selected', () => {
    renderComponent({ selectedIds: new Set([1, 3]) });
    expect(screen.getByText('Alice, Charlie')).toBeInTheDocument();
  });

  it('calls onOpen when clicking the main box if closed', async () => {
    const user = userEvent.setup();
    renderComponent({ isOpen: false });
    const box = screen.getByText('No athletes selected');
    await user.click(box);
    expect(defaultProps.onOpen).toHaveBeenCalled();
  });

  it('clears selectedIds when clicking the clear button', async () => {
    const user = userEvent.setup();

    const setSelectedIdsMock = jest.fn();
    renderComponent({
      selectedIds: new Set([1, 2]),
      setSelectedIds: setSelectedIdsMock,
    });

    const clearButton = screen.getByTestId('clear-selection');
    expect(clearButton).toBeInTheDocument();
    await user.click(clearButton);
    expect(setSelectedIdsMock).toHaveBeenCalledWith(new Set());
  });
});
