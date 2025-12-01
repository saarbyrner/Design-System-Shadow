import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import BulkActionsToolbar from '@kitman/playbook/components/wrappers/DataGridPremium/components/BulkActionsToolbar';

setI18n(i18n);

const MockIcon = () => <svg data-testid="mock-icon" />;

describe('<BulkActionsToolbar />', () => {
  const mockOnAction1 = jest.fn();
  const mockOnAction2 = jest.fn();

  const defaultBulkActions = [
    { key: 'action1', label: 'Action One', onAction: mockOnAction1 },
    {
      key: 'action2',
      label: 'Action Two',
      onAction: mockOnAction2,
      icon: <MockIcon />,
    },
  ];

  const defaultSelectedRowIds = ['id1', 'id2', 'id3'];

  const renderComponent = (props = {}) => {
    const combinedProps = {
      selectedRowIds: defaultSelectedRowIds,
      bulkActions: defaultBulkActions,
      ...props,
    };
    return render(<BulkActionsToolbar {...combinedProps} />);
  };

  beforeEach(() => {
    mockOnAction1.mockClear();
    mockOnAction2.mockClear();
  });

  it('renders selection count and action buttons for multiple selected items', () => {
    renderComponent();

    // Verify selection count is displayed correctly.
    expect(
      screen.getByRole('heading', {
        name: /3 items selected/i,
      })
    ).toBeInTheDocument();

    // Verify action buttons are present.
    expect(
      screen.getByRole('button', { name: 'Action One' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Action Two' })
    ).toBeInTheDocument();
  });

  it('renders singular "item" in selection count when one item is selected', () => {
    renderComponent({ selectedRowIds: ['id1'] });
    expect(
      screen.getByRole('heading', {
        name: /1 item selected/i,
      })
    ).toBeInTheDocument();
  });

  it('renders "0 ítems" in selection count when no items are selected', () => {
    renderComponent({ selectedRowIds: [] });
    expect(
      screen.getByRole('heading', {
        name: /0 items selected/i,
      })
    ).toBeInTheDocument();
  });

  it('hides an action button if its "visible" prop is explicitly false', () => {
    const actionsWithVisibility = [
      {
        key: 'action1',
        label: 'Visible Action',
        onAction: mockOnAction1,
        visible: true,
      },
      {
        key: 'action2',
        label: 'Hidden Action',
        onAction: mockOnAction2,
        visible: false,
      },
    ];

    renderComponent({ bulkActions: actionsWithVisibility });

    expect(
      screen.getByRole('button', { name: 'Visible Action' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Hidden Action' })
    ).not.toBeInTheDocument();
  });

  it('shows an action button by default if its "visible" prop is not provided', () => {
    const actions = [
      {
        key: 'action1',
        label: 'Default Visible Action',
        onAction: mockOnAction1,
      },
    ];

    renderComponent({ bulkActions: actions });

    expect(
      screen.getByRole('button', { name: 'Default Visible Action' })
    ).toBeInTheDocument();
  });

  it('disables an action button if its "disabled" prop is true', () => {
    const actionsWithDisabled = [
      {
        key: 'action1',
        label: 'Enabled Action',
        onAction: mockOnAction1,
        disabled: false,
      },
      {
        key: 'action2',
        label: 'Disabled Action',
        onAction: mockOnAction2,
        disabled: true,
      },
    ];
    renderComponent({ bulkActions: actionsWithDisabled });

    expect(
      screen.getByRole('button', { name: 'Enabled Action' })
    ).toBeEnabled();
    expect(
      screen.getByRole('button', { name: 'Disabled Action' })
    ).toBeDisabled();
  });

  it('calls the onAction callback with selectedRowIds when an action button is clicked', async () => {
    const user = userEvent.setup();

    renderComponent();

    const button1 = screen.getByRole('button', { name: 'Action One' });

    await user.click(button1);

    expect(mockOnAction1).toHaveBeenCalledTimes(1);
    expect(mockOnAction1).toHaveBeenCalledWith(defaultSelectedRowIds);
  });

  it('handles an asynchronous onAction callback correctly', async () => {
    const user = userEvent.setup();

    // Mock an action that returns a Promise.
    const asyncActionMock = jest.fn(() => Promise.resolve());
    const actionsWithAsync = [
      { key: 'asyncAction', label: 'Async Action', onAction: asyncActionMock },
    ];

    renderComponent({ bulkActions: actionsWithAsync });

    const asyncButton = screen.getByRole('button', { name: 'Async Action' });

    await user.click(asyncButton);

    expect(asyncActionMock).toHaveBeenCalledTimes(1);
    expect(asyncActionMock).toHaveBeenCalledWith(defaultSelectedRowIds);
  });

  it('renders an action button with an icon if an icon is provided', () => {
    // defaultBulkActions includes an action with an icon.
    renderComponent();

    const buttonWithIcon = screen.getByRole('button', { name: 'Action Two' });

    expect(buttonWithIcon).toContainElement(screen.getByTestId('mock-icon'));
  });

  it('renders correctly when no bulk actions are defined in props', () => {
    renderComponent({ bulkActions: [] });
    // Selection count should still be visible.
    expect(
      screen.getByText(`${defaultSelectedRowIds.length} items selected`)
    ).toBeInTheDocument();

    // No action buttons should be rendered.
    expect(
      screen.queryByRole('button', { name: 'Action One' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Action Two' })
    ).not.toBeInTheDocument();
  });

  it('applies default styling props from bulkActionButtonProps to action buttons', () => {
    renderComponent();
    const button1 = screen.getByRole('button', { name: 'Action One' });

    // The component defines: variant: 'contained', color: 'secondary', size: 'medium'
    expect(button1).toHaveClass('MuiButton-contained');
    expect(button1).toHaveClass('MuiButton-containedSizeMedium');
    expect(button1).toHaveClass('MuiButton-sizeMedium');
  });

  it(`applies delete styling props when key === 'delete'`, () => {
    renderComponent({
      bulkActions: [
        { key: 'delete', label: 'Delete button', onAction: mockOnAction1 },
      ],
    });
    const button1 = screen.getByRole('button', { name: 'Delete button' });

    // The component defines: variant: 'contained', color: 'error', size: 'medium'
    expect(button1).toHaveClass('MuiButton-contained');
    expect(button1).toHaveClass('MuiButton-containedSizeMedium');
    expect(button1).toHaveClass('MuiButton-sizeMedium');
    expect(button1).toHaveStyle('background-color: rgb(211, 47, 47)');
  });
});
