import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import InputNumeric from '../index';

describe('InputNumeric Component', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
  };

  it('sets the correct input value when the value is 0', () => {
    render(<InputNumeric {...props} value="0" />);
    expect(screen.getByRole('spinbutton')).toHaveValue(0);
  });

  it('calls back onWheel event', async () => {
    const user = userEvent.setup();
    const onWheelCallback = jest.fn();
    render(<InputNumeric {...props} onWheel={onWheelCallback} value="0" />);
    const input = screen.getByRole('spinbutton');
    await user.hover(input);
    fireEvent.wheel(input, { deltaY: -100 });

    expect(onWheelCallback).toHaveBeenCalled();
    expect(input).toHaveValue(0);
  });

  describe('when the user specify a value', () => {
    it('applies the value to the input', () => {
      render(<InputNumeric {...props} value="3" />);
      expect(screen.getByRole('spinbutton')).toHaveValue(3);
    });
  });

  describe('when the user specify a label', () => {
    it('Renders the label', () => {
      render(<InputNumeric {...props} label="input label" />);
      expect(screen.getByTestId('InputNumeric|label')).toHaveTextContent(
        'input label'
      );
    });
  });

  describe('when the user specify a descriptor', () => {
    it('Renders the descriptor', () => {
      render(<InputNumeric {...props} descriptor="mins" />);
      expect(screen.getByTestId('InputNumeric|descriptor')).toHaveTextContent(
        'mins'
      );
    });

    it('defaults to right side', () => {
      render(<InputNumeric {...props} descriptor="mins" />);
      expect(screen.getByTestId('InputNumeric|descriptor')).toHaveClass(
        'InputNumeric__descriptor--right'
      );
    });

    it('accepts descriptorSide and renders it correctly', () => {
      render(
        <InputNumeric {...props} descriptor="mins" descriptorSide="left" />
      );
      expect(screen.getByTestId('InputNumeric|descriptor')).toHaveClass(
        'InputNumeric__descriptor--left'
      );
    });
  });

  describe('when the input is optional', () => {
    it('Renders the text `Optional`', () => {
      render(<InputNumeric {...props} optional />);
      expect(screen.getByTestId('InputNumeric|optional')).toHaveTextContent(
        'Optional'
      );
    });
  });

  describe('when disabled is true', () => {
    it('disables the input', () => {
      render(<InputNumeric {...props} disabled />);
      expect(screen.getByRole('spinbutton')).toBeDisabled();
    });
  });

  it('renders the correct input size when the size is passed', () => {
    render(<InputNumeric {...props} size="small" />);
    expect(screen.getByTestId('InputNumeric')).toHaveClass(
      'InputNumeric--small'
    );
  });

  it('sets the placeholder text on the input field when passed', () => {
    render(<InputNumeric {...props} placeholder="Test placeholder" />);
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('sets the inputMode and appropriate pattern on the input field when passed', () => {
    const { rerender } = render(
      <InputNumeric {...props} inputMode="decimal" />
    );
    expect(screen.getByRole('spinbutton')).toHaveAttribute(
      'inputMode',
      'decimal'
    );
    // prettier-ignore
    // eslint-disable-next-line no-useless-escape
    const decimalPattern = "\d+(\.\d*)?";

    expect(screen.getByRole('spinbutton')).toHaveAttribute(
      'pattern',
      decimalPattern
    );

    rerender(<InputNumeric {...props} inputMode="numeric" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute(
      'inputMode',
      'numeric'
    );
    expect(screen.getByRole('spinbutton')).not.toHaveAttribute('pattern');
  });

  it('sets ‘min’ attribute', () => {
    const min = '42';
    render(<InputNumeric {...props} min={min} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('min', min);
  });

  describe('When user has a descriptor enabled for input numeric', () => {
    const componentProps = {
      value: '112345',
      label: 'label',
      descriptor: 'Descriptor Text',
      descriptorSide: 'right',
      inputMode: ['decimal', 'numeric'],
      placeholder: 'Placeholder',
      optional: false,
      name: 'My InputNumeric',
      disabled: false,
      isInvalid: false,
      size: ['small', 'large'],
      kitmanDesignSystem: true,
      tooltipDescriptor: true,
    };

    it('Ensure the descriptor is displayed correctly with tooltip functionality', async () => {
      const user = userEvent.setup();

      const { container } = render(<InputNumeric {...componentProps} />);
      // test that InputNumeric is correctly displayed
      expect(screen.getByPlaceholderText('Placeholder')).toBeInTheDocument();

      const descriptor = container.getElementsByClassName(
        'InputNumeric__descriptor'
      );
      expect(descriptor).toHaveLength(1);

      await user.hover(descriptor[0]);
      fireEvent.mouseOver(await descriptor[0]);

      await waitFor(() => {
        expect(
          screen.getByRole('tooltip', {
            name: 'Descriptor Text',
            hidden: true,
          })
        ).toBeVisible();
      });
    });
  });

  describe('Invalid text display', () => {
    it('displays invalid text when displayValidationText and invalid are true', () => {
      render(<InputNumeric {...props} displayValidationText isInvalid />);
      expect(screen.queryByText('This field is required')).toBeInTheDocument();
    });

    it('does not display invalid text when displayValidationText or invalid are false', () => {
      render(<InputNumeric {...props} isInvalid={false} />);
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument();
    });
  });
});
