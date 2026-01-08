import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckboxList from '..';

describe('<CheckboxList /> component', () => {
  const props = {
    items: [
      { value: 1, label: 'Item 1' },
      { value: 2, label: 'Item 2' },
      { value: 3, label: 'Item 3' },
    ],
  };

  it('renders the checkboxes and their label text', () => {
    render(<CheckboxList {...props} />);

    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('checks the matching checkbox when there are values', () => {
    render(<CheckboxList {...props} values={[1]} />);
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked();
    expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked();
    expect(screen.getAllByRole('checkbox')[2]).not.toBeChecked();
  });

  it('calls the callback funtion with the correct values when clicking on checkbox', async () => {
    const changeFunction = jest.fn();

    render(<CheckboxList {...props} onChange={changeFunction} />);
    const [firstCheckBox, secondCheckBox] = screen.getAllByRole('checkbox');

    // Click the first checkbox
    await userEvent.click(firstCheckBox);
    expect(changeFunction).toHaveBeenCalledWith([1]);

    // Click the second checkbox
    await userEvent.click(secondCheckBox);
    expect(changeFunction).toHaveBeenCalledWith([1, 2]);

    // Click the first checkbox
    await userEvent.click(firstCheckBox);
    expect(changeFunction).toHaveBeenCalledWith([2]);
  });

  it('allows one selection when props.singleSelection is true', async () => {
    render(<CheckboxList {...props} singleSelection />);
    const [firstCheckBox, secondCheckBox] = screen.getAllByRole('checkbox');

    // Click the first checkbox
    await userEvent.click(firstCheckBox);
    expect(firstCheckBox).toBeChecked();

    // Click the second checkbox
    await userEvent.click(secondCheckBox);
    expect(firstCheckBox).not.toBeChecked();
    expect(secondCheckBox).toBeChecked();
  });

  it('sets kitmanDesignSystem on each checkbox when props.kitmanDesignSystem is true', () => {
    render(<CheckboxList {...props} kitmanDesignSystem />);
    const [firstCheckBox, secondCheckBox, thirdCheckbox] =
      screen.getAllByRole('checkbox');

    expect(firstCheckBox.parentNode).toHaveClass(
      'reactCheckbox--kitmanDesignSystem'
    );
    expect(secondCheckBox.parentNode).toHaveClass(
      'reactCheckbox--kitmanDesignSystem'
    );
    expect(thirdCheckbox.parentNode).toHaveClass(
      'reactCheckbox--kitmanDesignSystem'
    );
  });
});
