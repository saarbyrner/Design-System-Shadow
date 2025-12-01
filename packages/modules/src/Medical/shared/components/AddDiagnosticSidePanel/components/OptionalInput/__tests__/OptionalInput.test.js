import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionalInput from '..';

describe('<OptionalInput />', () => {
  const props = {
    value: 'Testing value',
    inputOnChange: jest.fn(),
    optionalTextLabel: 'Great label',
    invalid: false,
  };

  it('renders the label', () => {
    render(<OptionalInput {...props} optional />);

    expect(screen.getByLabelText('Great label')).toBeInTheDocument();
  });

  it('renders the value', () => {
    render(<OptionalInput {...props} optional />);

    expect(screen.getByDisplayValue('Testing value')).toBeInTheDocument();
  });

  it('calls inputOnChange prop when user types', async () => {
    render(<OptionalInput {...props} />);

    // Start typing
    await userEvent.type(screen.getByRole('textbox'), 'New testing input');
    expect(props.inputOnChange).toHaveBeenCalledTimes(17);
  });

  it('renders invalid CSS when invalid', () => {
    const { container } = render(<OptionalInput {...props} invalid />);

    expect(container.getElementsByClassName('inputText--invalid')).toHaveLength(
      1
    );
  });
});
