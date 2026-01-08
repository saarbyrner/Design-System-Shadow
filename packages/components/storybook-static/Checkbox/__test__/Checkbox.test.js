import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from '..';

describe('<Checkbox />', () => {
  const props = {
    id: 'customId',
    className: 'customClass',
    toggle: jest.fn(),
  };

  it('Renders the component', () => {
    render(<Checkbox {...props} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('is not checked if isChecked is not passed', () => {
    render(<Checkbox {...props} />);
    expect(screen.getByRole('checkbox')).not.toHaveClass(
      'reactCheckbox--checked'
    );
  });

  it('sets the checkbox to checked', () => {
    render(<Checkbox {...props} isChecked />);

    expect(screen.getByRole('checkbox')).toHaveClass('reactCheckbox__checkbox');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls the toggle function with checked = true if the checkbox is not checked', async () => {
    render(<Checkbox {...props} />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(props.toggle).toHaveBeenCalledTimes(1);
    expect(props.toggle).toHaveBeenCalledWith({
      id: 'customId',
      checked: true,
    });
  });

  it('calls the toggle function with checked = false if the checkbox is checked', async () => {
    render(<Checkbox {...props} isChecked />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(props.toggle).toHaveBeenCalledTimes(1);
    expect(props.toggle).toHaveBeenCalledWith({
      id: props.id,
      checked: false,
    });
  });

  it("doesn't call the toggle function when the checkbox is disabled", async () => {
    render(<Checkbox {...props} isDisabled />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(props.toggle).toHaveBeenCalledTimes(0);
  });

  it('renders the correct style when radioStyle is true', () => {
    render(<Checkbox {...props} radioStyle />);
    expect(
      screen.getByRole('checkbox').closest('div.reactCheckbox')
    ).toHaveClass('reactCheckbox--radioStyle');
  });

  it('when a label is set it renders the correct label', () => {
    render(<Checkbox {...props} label="MyLabel" />);
    expect(
      screen
        .getByRole('checkbox')
        .closest('div.reactCheckbox')
        .querySelector('span.reactCheckbox__label')
    ).toHaveTextContent('MyLabel');
  });

  it('when a secondary label is set it renders the correct secondary label', () => {
    render(
      <Checkbox {...props} label="MyLabel" secondaryLabel="MySecondaryLabel" />
    );
    expect(
      screen
        .getByRole('checkbox')
        .closest('div.reactCheckbox')
        .querySelector('span.reactCheckbox__secondaryLabel')
    ).toHaveTextContent('MySecondaryLabel');
  });

  it('when the checkbox is disabled it renders the correct style', () => {
    render(<Checkbox {...props} isDisabled />);

    expect(
      screen.getByRole('checkbox').closest('div.reactCheckbox')
    ).toHaveClass('reactCheckbox--disabled');
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('when isLabelPositionedOnTheLeft is true it adds the class .reactCheckbox--leftPositionLabel', () => {
    render(<Checkbox {...props} isLabelPositionedOnTheLeft />);

    expect(
      screen.getByRole('checkbox').closest('div.reactCheckbox')
    ).toHaveClass('reactCheckbox--leftPositionLabel');
  });

  it('when isLabelPositionedOnTheLeft is not set it doesnt add the class .reactCheckbox--leftPositionLabel', () => {
    render(<Checkbox {...props} />);

    expect(
      screen.getByRole('checkbox').closest('div.reactCheckbox')
    ).not.toHaveClass('reactCheckbox--leftPositionLabel');
  });

  it('adds the correct class when kitmanDesignSystem is true', () => {
    render(<Checkbox {...props} kitmanDesignSystem />);
    expect(
      screen.getByRole('checkbox').closest('div.reactCheckbox')
    ).toHaveClass('reactCheckbox--kitmanDesignSystem');
  });

  it('sets the tabIndex', () => {
    render(<Checkbox {...props} tabIndex="-1" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('tabIndex', '-1');
  });

  it('should add additional data to toggle when prop is passed', async () => {
    render(<Checkbox {...props} isChecked additionalData="test" />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(props.toggle).toHaveBeenCalledTimes(1);

    expect(props.toggle).toHaveBeenCalledWith({
      id: props.id,
      checked: false,
      additionalData: 'test',
    });
  });
});
