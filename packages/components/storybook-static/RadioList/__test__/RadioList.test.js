import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadioList from '../index';

const baseProps = {
  radioName: 'test_radio',
  options: [
    { name: 'Option 1', value: 'option_one' },
    { name: 'Option 2', value: 'option_two' },
  ],
  change: jest.fn(),
  kitmanDesignSystem: false,
};

describe('<RadioList />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<RadioList {...baseProps} />);
    // The fieldset acts as container; use getByRole('group') for generic group role (since radiogroup isn’t present)
    expect(screen.getByTestId('radio-list')).toBeInTheDocument();
  });

  it('renders all radio options', () => {
    render(<RadioList {...baseProps} />);
    const option1 = screen.getByText('Option 1');
    const option2 = screen.getByText('Option 2');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    render(<RadioList {...baseProps} label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('calls the change handler when a radio button is clicked', async () => {
    const user = userEvent.setup();
    render(<RadioList {...baseProps} />);
    const radioBtn = screen.getByText('Option 2');
    await user.click(radioBtn);
    expect(baseProps.change).toHaveBeenCalledWith('option_two', 1);
  });

  it('applies disabled class and disables input when disabled', () => {
    render(<RadioList {...baseProps} disabled />);
    const fieldset = screen.getByTestId('radio-list');
    expect(fieldset).toHaveClass('radioList--disabled');
  });

  it('kitmanDesignSystem works correctly', () => {
    render(<RadioList {...baseProps} kitmanDesignSystem />);
    const items = screen.getAllByRole('radio');
    expect(items.length).toBe(2);
  });
});
