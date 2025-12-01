import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AthleteSelectorDropdown from '../index';

const mockGroups = [
  {
    key: 'group-1',
    title: 'Group 1',
    children: [],
    athletes: [
      { id: 1, key: 'ath-1', name: 'Alice' },
      { id: 2, key: 'ath-2', name: 'Bob' },
    ],
  },
  {
    key: 'group-2',
    title: 'Group 2',
    children: [],
    athletes: [{ id: 3, key: 'ath-3', name: 'Charlie' }],
  },
];

describe('<AthleteSelectorDropdown />', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onDone: jest.fn(),
    groups: mockGroups,
    selectedIds: new Set(),
    setSelectedIds: jest.fn(),
    anchorEl: document.createElement('div'),
    isLoading: false,
    grouping: null,
  };

  const renderComponent = (props = {}) =>
    render(<AthleteSelectorDropdown {...defaultProps} {...props} />);

  it('renders the main header', () => {
    renderComponent();
    expect(screen.getByText('Select Athletes')).toBeInTheDocument();
  });

  it('disables "Done" button when no athletes are selected', () => {
    renderComponent();
    const doneButton = screen.getByText('Done');
    expect(doneButton).toBeDisabled();
  });

  it('enables "Done" button when athletes are selected', () => {
    renderComponent({ selectedIds: new Set([1]) });
    const doneButton = screen.getByText('Done');
    expect(doneButton).toBeEnabled();
  });

  it('calls onDone when clicking Done', async () => {
    const user = userEvent.setup();
    renderComponent({ selectedIds: new Set([1]) });
    const doneButton = screen.getByText('Done');
    await user.click(doneButton);
    expect(defaultProps.onDone).toHaveBeenCalled();
  });

  it('renders "Selected" chip with correct count', () => {
    renderComponent({ selectedIds: new Set([1, 2]) });
    expect(screen.getByText('Selected (2)')).toBeInTheDocument();
  });
});
