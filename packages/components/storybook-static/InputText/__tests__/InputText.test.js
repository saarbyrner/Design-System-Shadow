import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import InputText, { InputTextField } from '../index';

describe('<InputText />', () => {
  const onValidateFunction = jest.fn();
  const onEnterPressedFunction = jest.fn();
  const i18nT = i18nextTranslateStub();
  let props;

  beforeEach(() => {
    props = {
      label: 'my label',
      t: i18nT,
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Renders the field', () => {
    render(<InputText {...props} />);

    expect(screen.getByLabelText('my label')).toBeInTheDocument();
  });

  it('sets a name attribute on the input', () => {
    render(<InputText {...props} />);
    expect(screen.getByLabelText('my label')).toHaveAttribute(
      'name',
      'my_label'
    );
  });

  it("doesn't show the number of characters remaining if {maxLength} is not set", () => {
    render(<InputText {...props} />);
    expect(screen.queryByText('characters remaining')).not.toBeInTheDocument();
  });

  it('hides the errors by default', () => {
    const { container } = render(<InputText {...props} />);
    expect(container.getElementsByClassName('km-error')).toHaveLength(0);
  });

  describe('When {maxLength} is set', () => {
    describe('when showRemainingChars and the field is focused is true', () => {
      it('shows the remaining chars correctly', async () => {
        render(<InputText {...props} maxLength={5} showRemainingChars />);

        expect(
          screen.queryByText('characters remaining')
        ).not.toBeInTheDocument();

        await userEvent.click(screen.getByLabelText('my label'));
        expect(screen.getByLabelText('my label')).toHaveFocus();
        expect(screen.getByText('5 characters remaining')).toBeInTheDocument();

        const fourChars = '1234';
        await userEvent.type(screen.getByLabelText('my label'), fourChars);
        expect(screen.getByText('1 characters remaining')).toBeInTheDocument();

        const fiveChars = '12345';
        await userEvent.type(screen.getByLabelText('my label'), fiveChars);
        expect(screen.getByText('0 characters remaining')).toBeInTheDocument();
      });
    });

    describe('when showRemainingChars is false', () => {
      it('does not show the remaining chars', () => {
        render(
          <InputText {...props} maxLength={5} showRemainingChars={false} />
        );

        expect(
          screen.queryByText('characters remaining')
        ).not.toBeInTheDocument();
      });
    });

    describe('With showCharsLimitReached is true', () => {
      describe('When value is changed and it exceeds {maxLength} limit', () => {
        beforeEach(() => {
          props.value = '12345';
        });

        it('shows a warning message', async () => {
          render(<InputText {...props} maxLength={5} showCharsLimitReached />);

          await userEvent.type(screen.getByLabelText('my label'), '123456');
          expect(
            screen.getByText('5 character limit reached')
          ).toBeInTheDocument();
        });

        it('does not update the input value', async () => {
          render(<InputText {...props} maxLength={5} showCharsLimitReached />);

          await userEvent.type(screen.getByLabelText('my label'), '123456');
          expect(screen.getByLabelText('my label')).toHaveValue('12345');
        });
      });

      describe('When value is changed and it does not exceed {maxLength} limit', () => {
        it('does not show a warning message', async () => {
          render(<InputText {...props} maxLength={5} value="123456" />);

          await userEvent.clear(screen.getByLabelText('my label'));
          await userEvent.type(screen.getByLabelText('my label'), '1234');
          expect(
            screen.queryByText('character limit reached')
          ).not.toBeInTheDocument();
        });

        it('updates the state with the new value', async () => {
          render(<InputText {...props} maxLength={5} value="123456" />);

          await userEvent.clear(screen.getByLabelText('my label'));
          await userEvent.type(screen.getByLabelText('my label'), '1234');
          expect(screen.getByLabelText('my label')).toHaveValue('1234');
        });
      });
    });

    describe('With showCharsLimitReached is false', () => {
      it('does not show a warning message when value exceeds limit', async () => {
        render(<InputText {...props} showCharsLimitReached={false} />);

        await userEvent.type(screen.getByLabelText('my label'), '12345');
        expect(
          screen.queryByText('character limit reached')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('when the prop {revealError} is true', () => {
    it('shows the errors', () => {
      const { container } = render(
        <InputText {...props} value="" required revealError />
      );
      expect(container.getElementsByClassName('km-error')).toHaveLength(1);
    });
  });

  describe('when the input field is focused', () => {
    it('hides the errors', async () => {
      const { container } = render(
        <InputText {...props} value="" required revealError />
      );

      await userEvent.click(screen.getByLabelText('my label'));
      expect(screen.getByLabelText('my label')).toHaveFocus();
      expect(container.getElementsByClassName('km-error')).toHaveLength(0);
    });
  });

  describe('when the initial value is valid', () => {
    it('is a valid input', () => {
      const validInput = 'valid input';
      const customProps = {
        label: 'my label',
        value: validInput,
        required: true,
        revealError: true,
        onValidation: onValidateFunction,
        t: i18nT,
      };

      const { container } = render(<InputText {...customProps} />);
      expect(container.getElementsByClassName('km-error')).toHaveLength(0);
      expect(onValidateFunction).toHaveBeenCalledWith({
        isValid: true,
        value: validInput,
      });
    });
  });

  describe('when the value is empty and {required} is false', () => {
    it('is a valid input', async () => {
      const customProps = {
        label: 'my label',
        required: false,
        onValidation: onValidateFunction,
        t: i18nT,
      };

      const { container } = render(<InputText {...customProps} />);

      await userEvent.clear(screen.getByLabelText('my label'));
      expect(container.getElementsByClassName('km-error')).toHaveLength(0);
      expect(onValidateFunction).toHaveBeenCalledWith({
        isValid: true,
        value: '',
      });
    });
  });

  describe('when the value contains only space characters and {required} is true', () => {
    it('is an invalid input', async () => {
      const customProps = {
        label: 'my label',
        required: true,
        onValidation: onValidateFunction,
        t: i18nT,
      };

      const spaceCharacters = '       ';
      const trimedValue = '';

      render(<InputText {...customProps} />);
      await userEvent.type(screen.getByLabelText('my label'), spaceCharacters);
      expect(onValidateFunction).toHaveBeenCalledWith({
        isValid: false,
        value: trimedValue,
      });
    });
  });

  describe('when a custom empty message is given and the value exceeds it', () => {
    it('is an invalid input', async () => {
      const customProps = {
        label: 'my label',
        required: true,
        revealError: true,
        onValidation: onValidateFunction,
        customEmptyMessage: 'This is a custom empty message.',
        t: i18nT,
      };

      render(<InputText {...customProps} />);

      await userEvent.clear(screen.getByLabelText('my label'));
      screen.getByLabelText('my label').blur();
      expect(onValidateFunction).toHaveBeenCalledWith({
        isValid: false,
        value: '',
      });
      expect(
        screen.getByText('This is a custom empty message.')
      ).toBeInTheDocument();
    });
  });

  describe('when the value is empty and {required} and {revealError} are true', () => {
    it('calls {onValidation} with {isValid} false and show the error message', async () => {
      const customProps = {
        label: 'my label',
        required: true,
        revealError: true,
        onValidation: onValidateFunction,
        t: i18nT,
      };

      const { container } = render(<InputText {...customProps} />);

      await userEvent.clear(screen.getByLabelText('my label'));
      screen.getByLabelText('my label').blur();
      expect(container.getElementsByClassName('km-error')).toHaveLength(1);
      expect(onValidateFunction).toHaveBeenCalledWith({
        isValid: false,
        value: '',
      });
      expect(screen.getByText('A value is required')).toBeInTheDocument();
    });
  });

  describe('when the value is empty and {required} is true, but {revealError} is false', () => {
    it('calls {onValidation} with {isValid} false and hides the error message', async () => {
      const customProps = {
        label: 'my label',
        required: true,
        revealError: false,
        onValidation: onValidateFunction,
        t: i18nT,
      };

      const { container } = render(<InputText {...customProps} />);

      await userEvent.clear(screen.getByLabelText('my label'));
      expect(container.getElementsByClassName('km-error')).toHaveLength(0);
      expect(onValidateFunction).toHaveBeenCalledWith({
        isValid: false,
        value: '',
      });
    });
  });

  describe('when the value of the input changes and is valid', () => {
    it('calls {onValidation} with {isValid} true', async () => {
      const customProps = {
        label: 'my label',
        onValidation: onValidateFunction,
        t: i18nT,
      };

      render(<InputText {...customProps} />);

      const newValue = 'value';
      await userEvent.type(screen.getByLabelText('my label'), newValue);
      expect(onValidateFunction).toHaveBeenCalledWith({
        isValid: true,
        value: newValue,
      });
    });
  });

  describe("when the value of the input doesn't meet the custom validation and {revealError} is true", () => {
    it('calls {onValidation} with {isValid} false and show the error message', async () => {
      const prohibitedValue = 'prohibitedValue';
      const customValidation = (value) => ({
        isValid: !(value === prohibitedValue),
        errorType: 'errorType',
        message: 'Name already in use',
        t: i18nT,
      });

      const customProps = {
        label: 'my label',
        onValidation: onValidateFunction,
        customValidations: [customValidation],
        revealError: true,
      };

      render(<InputText {...customProps} />);

      const newValue = prohibitedValue;
      await userEvent.type(screen.getByLabelText('my label'), newValue);
      expect(onValidateFunction).toHaveBeenCalledWith({
        isValid: false,
        value: newValue,
      });

      screen.getByLabelText('my label').blur();
      expect(screen.getByText('Name already in use')).toBeInTheDocument();
    });
  });

  describe("when the value of the input doesn't meet the custom validation and {revealError} is false", () => {
    it('calls {onValidation} with {isValid} false and hides the error message', async () => {
      const prohibitedValue = 'prohibitedValue';
      const customValidation = (value) => ({
        isValid: !(value === prohibitedValue),
        errorType: 'errorType',
        message: 'Name already in use',
        t: i18nT,
      });

      const customProps = {
        label: 'my label',
        onValidation: onValidateFunction,
        customValidations: [customValidation],
        revealError: false,
      };

      const { container } = render(<InputText {...customProps} />);

      const newValue = prohibitedValue;
      await userEvent.type(screen.getByLabelText('my label'), newValue);

      expect(onValidateFunction).toHaveBeenCalledWith({
        isValid: false,
        value: newValue,
      });
      expect(container.getElementsByClassName('km-error')).toHaveLength(0);
    });
  });

  describe('when the value of the input changes meets the custom validation', () => {
    it('calls {onValidation} with {isValid} true', async () => {
      const customValidation = (value) => ({
        isValid: value,
        errorType: 'errorType',
        message: 'Message to show to the user',
      });

      const customProps = {
        label: 'my label',
        onValidation: onValidateFunction,
        customValidations: [customValidation],
        t: i18nT,
      };

      render(<InputText {...customProps} />);

      const newValue = 'Correct input';
      await userEvent.type(screen.getByLabelText('my label'), newValue);
      expect(onValidateFunction).toHaveBeenCalledWith({
        isValid: true,
        value: newValue,
      });
    });
  });

  describe('when enter is pressed', () => {
    it('calls {onEnterPressed} when the input is valid', async () => {
      const customProps = {
        label: 'my label',
        onEnterPressed: onEnterPressedFunction,
        t: i18nT,
      };

      render(<InputText {...customProps} />);
      await userEvent.type(screen.getByLabelText('my label'), '{Enter}');
      expect(onEnterPressedFunction).toHaveBeenCalled();
    });

    it('does not call {onEnterPressed} when the input is invalid', async () => {
      const customProps = {
        label: 'my label',
        onEnterPressed: onEnterPressedFunction,
        t: i18nT,
      };

      render(<InputText {...customProps} required />);
      await userEvent.type(screen.getByLabelText('my label'), '{Enter}');
      expect(onEnterPressedFunction).not.toHaveBeenCalled();
    });
  });

  describe('Invalid text display', () => {
    it('displays invalid text when displayValidationText and invalid are true', () => {
      render(<InputText {...props} displayValidationText invalid />);
      expect(screen.queryByText('This field is required')).toBeInTheDocument();
    });

    it('does not display invalid text when displayValidationText or invalid are false', () => {
      render(<InputText {...props} invalid={false} />);
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument();
    });
  });

  it('sets the correct input name when provided', () => {
    render(<InputText {...props} name="custom_input_name" />);
    expect(screen.getByLabelText('my label')).toHaveAttribute(
      'name',
      'custom_input_name'
    );
  });

  it('sets the correct class when using the new design system', () => {
    const { container } = render(<InputText {...props} kitmanDesignSystem />);
    expect(
      container.getElementsByClassName('inputText--kitmanDesignSystem')
    ).toHaveLength(1);
  });

  it('shows error validation icon when has errors using the updated validation design', async () => {
    const prohibitedValue = 'prohibitedValue';
    const customValidation = (value) => ({
      isValid: !(value === prohibitedValue),
      errorType: 'errorType',
      message: 'Updated validation design error',
      t: i18nT,
    });

    const customProps = {
      label: 'my label',
      onValidation: onValidateFunction,
      customValidations: [customValidation],
      updatedValidationDesign: true,
    };

    const { container } = render(<InputText {...customProps} revealError />);

    const newValue = prohibitedValue;
    await userEvent.type(screen.getByLabelText('my label'), newValue);
    screen.getByLabelText('my label').blur();

    expect(
      screen.getByText('Updated validation design error')
    ).toBeInTheDocument();
    expect(
      container.getElementsByClassName('icon-validation-error')
    ).toHaveLength(1);
    expect(
      container.getElementsByClassName('inputText__error--updatedDesign')
    ).toHaveLength(1);
  });

  it('does not shows error validation icon when has errors but not using the updated validation design', async () => {
    const prohibitedValue = 'prohibitedValue';
    const customValidation = (value) => ({
      isValid: !(value === prohibitedValue),
      errorType: 'errorType',
      message: 'NOT Updated validation design error',
      t: i18nT,
    });

    const customProps = {
      label: 'my label',
      onValidation: onValidateFunction,
      customValidations: [customValidation],
      updatedValidationDesign: false,
      revealError: true,
    };

    const { container } = render(<InputText {...customProps} />);

    const newValue = prohibitedValue;
    await userEvent.type(screen.getByLabelText('my label'), newValue);
    screen.getByLabelText('my label').blur();

    expect(
      screen.getByText('NOT Updated validation design error')
    ).toBeInTheDocument();
    expect(
      container.getElementsByClassName('icon-validation-error')
    ).toHaveLength(0);
    expect(
      container.getElementsByClassName('inputText__error--updatedDesign')
    ).toHaveLength(0);
  });

  it('renders a search icon when searchIcon is true', () => {
    const { container } = render(
      <InputText {...props} kitmanDesignSystem searchIcon />
    );

    expect(
      container.getElementsByClassName('inputText--withSearchIcon')
    ).toHaveLength(1);
  });

  it('renders a search icon when calendarIcon is true', () => {
    const { container } = render(
      <InputText {...props} kitmanDesignSystem calendarIcon />
    );

    expect(
      container.getElementsByClassName('inputText--withCalendarIcon')
    ).toHaveLength(1);
  });

  describe('when has placeholder', () => {
    it('sets the input placeholder', () => {
      render(<InputText {...props} placeholder="fake placeholder" />);
      expect(screen.getByLabelText('my label')).toHaveAttribute(
        'placeholder',
        'fake placeholder'
      );
    });
  });

  describe('when is invalid', () => {
    it('shows the correct styles', () => {
      const { container } = render(<InputText {...props} invalid />);
      expect(
        container.getElementsByClassName('inputText--invalid')
      ).toHaveLength(1);
    });
  });
});

describe('<InputTextField />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    label: 'Input label',
    value: 'Input value',
    onChange: jest.fn(),
    kitmanDesignSystem: true,
    t: i18nT
  };

  afterEach(() => jest.restoreAllMocks());

  it('clears the field when clicking the clear button', async () => {
    render(<InputTextField {...props} isClearable />);

    // Click the clear button
    await userEvent.click(screen.getByRole('button'));
    expect(props.onChange).toHaveBeenCalledWith({ target: { value: '' } });
  });

  it('renders an Optional text when props.optional is true', () => {
    const { container } = render(<InputTextField {...props} optional />);
    expect(
      container.getElementsByClassName('inputText__optional')
    ).toHaveLength(1);
  });

  it('aligns the field content to the right when textAlign is right', () => {
    render(<InputTextField {...props} textAlign="right" />);
    expect(screen.getByLabelText('Input label')).toHaveStyle(
      'text-align: right'
    );
  });
});
