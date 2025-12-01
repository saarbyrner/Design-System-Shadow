import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterInput from '..';

describe('<FilterInput />', () => {
  const props = {
    placeHolder: 'placeHolder string',
    value: 'value',
    setFilter: jest.fn(),
    clearFilter: jest.fn(),
    tabIndex: 1,
  };

  it('has a placeholder', () => {
    render(<FilterInput {...props} />);

    expect(screen.getByRole('searchbox')).toHaveAttribute(
      'placeholder',
      'placeHolder string'
    );
  });

  it('displays clearButton when there is a field value', () => {
    render(<FilterInput {...props} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not display clearButton when there is no field value', () => {
    render(<FilterInput {...props} value={undefined} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls setFilter with inputted value when the input changes', async () => {
    render(<FilterInput {...props} value={undefined} />);

    await userEvent.type(screen.getByRole('searchbox'), 'heyy');
    expect(props.setFilter).toHaveBeenCalledWith('heyy');
  });

  it('calls clearFilter prop when the clear button is clicked', async () => {
    render(<FilterInput {...props} />);

    await userEvent.click(screen.getByRole('button'));
    expect(props.clearFilter).toHaveBeenCalled();
  });

  it('doesnt render a label if the label is not set', () => {
    render(<FilterInput {...props} label={null} />);

    expect(
      screen
        .getByRole('searchbox')
        .parentNode.parentNode.querySelector(
          'label.km-datagrid-textInput__label'
        )
    ).not.toBeInTheDocument();
  });

  it('renders a label if the label is set', () => {
    render(<FilterInput {...props} label="label value" />);

    expect(screen.getByText('label value')).toBeInTheDocument();
  });
});
