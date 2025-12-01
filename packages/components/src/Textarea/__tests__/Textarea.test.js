import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Textarea from '..';

describe('<Textarea />', () => {
  const props = {
    onChange: jest.fn(),
    onBlur: jest.fn(),
  };

  it('Renderes the correct content', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('when the user specifies a value', () => {
    render(<Textarea value="Textarea value" />);
    expect(screen.getByRole('textbox')).toHaveValue('Textarea value');
  });

  it('when the user specifies a label', () => {
    render(<Textarea label="Textareavalue" />);
    expect(
      screen.getByRole('textbox').closest('div.textarea')
    ).toHaveTextContent('Textareavalue');
  });

  it('when the user specifies a maxlimit it adds the correct data attribute to the input', () => {
    render(<Textarea maxLimit={111} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-maxlimit', '111');
  });

  it('when the user specifies a name', () => {
    render(<Textarea name="my_textarea" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'my_textarea');
  });

  it('when the textarea is updated onChange function is called', async () => {
    render(<Textarea onChange={props.onChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'hi');
    expect(props.onChange).toHaveBeenCalledTimes(2);
  });

  it('when the textarea is optional it displays an optional text', () => {
    render(<Textarea optionalText />);
    expect(
      screen
        .getByRole('textbox')
        .parentNode.parentElement.querySelector('span.textarea__optional')
    ).toBeInTheDocument();
  });

  it('calls onBlur when the user blurs the field', async () => {
    render(<Textarea onBlur={props.onBlur} />);

    await userEvent.click(screen.getByRole('textbox'));
    document.activeElement.blur();
    expect(props.onBlur).toHaveBeenCalledTimes(1);
  });

  it('sets the correct class when the field is invalid', () => {
    render(<Textarea invalid />);
    expect(screen.getByRole('textbox')).toHaveClass('textarea__input--invalid');
  });
  describe('Invalid text display', () => {
    it('displays invalid text when displayValidationText and invalid are true', () => {
      render(<Textarea {...props} displayValidationText invalid />);
      expect(screen.queryByText('This field is required')).toBeInTheDocument();
    });

    it('does not display invalid text when displayValidationText or invalid are false', () => {
      render(<Textarea {...props} invalid={false} />);
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument();
    });
  });
});
