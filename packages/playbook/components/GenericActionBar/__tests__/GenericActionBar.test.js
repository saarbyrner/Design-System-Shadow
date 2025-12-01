import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import GenericActionBar from '../index';

describe('GenericActionBar', () => {
  const t = i18nextTranslateStub();

  const mockAction1 = {
    id: 'action-1',
    label: 'Action 1',
    onClick: jest.fn(),
  };

  const mockAction2 = {
    id: 'action-2',
    label: 'Action 2',
    onClick: jest.fn(),
    disabled: true,
    color: 'primary',
    variant: 'outlined',
  };

  const defaultProps = {
    selectedCount: 0,
    actions: [],
    t,
  };

  const renderComponent = (props = defaultProps) => {
    render(<GenericActionBar {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when selectedCount is 0', () => {
    renderComponent();
    expect(screen.queryByTestId('GenericActionBar')).not.toBeInTheDocument();
  });

  it('should display selected count when selectedCount > 0', () => {
    renderComponent({ ...defaultProps, selectedCount: 5 });
    expect(screen.getByText('5 selected')).toBeInTheDocument();
  });

  it('should update selected count display when selectedCount changes', () => {
    const { rerender } = render(
      <GenericActionBar {...defaultProps} selectedCount={2} />
    );
    expect(screen.getByText('2 selected')).toBeInTheDocument();

    rerender(<GenericActionBar {...defaultProps} selectedCount={7} />);
    expect(screen.getByText('7 selected')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    renderComponent({
      ...defaultProps,
      selectedCount: 1,
      actions: [mockAction1, mockAction2],
    });

    expect(
      screen.getByRole('button', { name: 'Action 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Action 2' })
    ).toBeInTheDocument();
  });

  it('should call onClick when action button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultProps,
      selectedCount: 1,
      actions: [mockAction1],
    });

    const button = screen.getByRole('button', { name: 'Action 1' });
    await user.click(button);

    expect(mockAction1.onClick).toHaveBeenCalledTimes(1);
  });

  it('should render multiple action buttons', () => {
    const actions = [
      { id: 'action-1', label: 'Delete', onClick: jest.fn() },
      { id: 'action-2', label: 'Edit', onClick: jest.fn() },
      { id: 'action-3', label: 'Archive', onClick: jest.fn() },
    ];

    renderComponent({
      ...defaultProps,
      selectedCount: 1,
      actions,
    });

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument();
  });

  it('should handle empty actions array', () => {
    renderComponent({ ...defaultProps, selectedCount: 1, actions: [] });

    expect(screen.getByTestId('GenericActionBar')).toBeInTheDocument();
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('should handle very large selected counts', () => {
    renderComponent({ ...defaultProps, selectedCount: 999999 });
    expect(screen.getByText('999999 selected')).toBeInTheDocument();
  });
});
