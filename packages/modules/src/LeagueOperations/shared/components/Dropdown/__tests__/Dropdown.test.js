import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from '../index';

describe('Dropdown component', () => {
  const mockOnClick1 = jest.fn();
  const mockOnClick2 = jest.fn();

  const items = [
    { label: 'Item 1', onClick: mockOnClick1 },
    { label: 'Item 2', onClick: mockOnClick2, isDisabled: true },
  ];

  const setup = () => {
    render(
      <Dropdown
        id="test-dropdown"
        Control={(props) => (
          <button {...props} type="button">
            Toggle Menu
          </button>
        )}
        items={items}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the control button', () => {
    setup();
    expect(
      screen.getByRole('button', { name: /toggle menu/i })
    ).toBeInTheDocument();
  });

  test('opens the menu when control is clicked', async () => {
    const user = userEvent.setup();
    setup();

    const button = screen.getByRole('button', { name: /toggle menu/i });

    await user.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeVisible();
    expect(screen.getByText('Item 2')).toBeVisible();
  });

  test('calls item onClick and closes menu on item click', async () => {
    const user = userEvent.setup();
    setup();

    const button = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(button);

    const item1 = screen.getByText('Item 1');
    await user.click(item1);

    expect(mockOnClick1).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('works correctly with disabled items', async () => {
    const user = userEvent.setup();
    setup();

    const button = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(button);

    const item2 = screen.getByText('Item 2');
    expect(item2).toHaveAttribute('aria-disabled', 'true');
  });
});
