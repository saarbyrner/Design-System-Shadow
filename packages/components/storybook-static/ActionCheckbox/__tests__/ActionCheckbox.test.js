import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionCheckbox from '..';

describe('<ActionCheckbox />', () => {
  const props = {
    id: 'customActionCheckboxId',
    onToggle: jest.fn(),
  };

  it('Renderes the correct content', () => {
    render(<ActionCheckbox {...props} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('is not checked if isChecked is not passed', () => {
    render(<ActionCheckbox {...props} />);
    expect(screen.getByRole('checkbox')).not.toHaveClass(
      'actionCheckbox--checked'
    );
  });

  it('sets the checkbox to checked', () => {
    render(<ActionCheckbox {...props} isChecked />);
    expect(screen.getByRole('checkbox')).toHaveClass('actionCheckbox--checked');
  });

  it('calls the onToggle function with checked = true if the checkbox is not checked', async () => {
    render(<ActionCheckbox {...props} />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(props.onToggle).toHaveBeenCalledTimes(1);
    expect(props.onToggle).toHaveBeenCalledWith({
      id: props.id,
      checked: true,
    });
  });

  it('calls the onToggle function with checked = false if the checkbox is checked', async () => {
    render(<ActionCheckbox {...props} isChecked />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(props.onToggle).toHaveBeenCalledTimes(1);
    expect(props.onToggle).toHaveBeenCalledWith({
      id: props.id,
      checked: false,
    });
  });

  it("doesn't call the toggle function when the checkbox is disabled", async () => {
    render(<ActionCheckbox {...props} isDisabled />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(props.onToggle).toHaveBeenCalledTimes(0);
  });

  it('adds the correct class when kitmanDesignSystem is true', () => {
    render(<ActionCheckbox {...props} kitmanDesignSystem />);
    expect(screen.getByRole('checkbox')).toHaveClass(
      'actionCheckbox--kitmanDesignSystem'
    );
  });
});
