import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputRadio from '..';

describe('<InputRadio />', () => {
  const props = {
    index: 1,
    change: jest.fn(),
    inputName: 'radio_name',
    option: {
      name: 'Option name',
      value: 'option_value',
    },
  };

  it('renders the radio button', () => {
    render(<InputRadio {...props} />);
    expect(screen.getByLabelText('Option name')).toBeInTheDocument();
  });

  it('disables the radio list when disabled is passed', () => {
    render(<InputRadio {...props} disabled />);
    expect(screen.getByLabelText('Option name').parentNode).toHaveClass(
      'inputRadio--disabled'
    );
  });

  it('fires the click callback when clicked', async () => {
    render(<InputRadio {...props} index={3} />);

    await userEvent.click(screen.getByText('Option name'));
    expect(props.change).toHaveBeenCalledWith('option_value', 3);
  });

  it('disables the click callback when disabled passed', async () => {
    render(<InputRadio {...props} disabled />);

    await userEvent.click(screen.getByText('Option name'));
    expect(props.change).not.toHaveBeenCalled();
  });

  it('sets the checked value', () => {
    render(<InputRadio {...props} value="option_value" />);
    expect(screen.getByLabelText('Option name')).toBeChecked();
  });

  it('aligns the button on the right side when buttonSide = right', () => {
    render(<InputRadio {...props} buttonSide="right" />);
    expect(screen.getByLabelText('Option name').parentNode).toHaveClass(
      'inputRadio--alignButtonRight'
    );
  });
});
