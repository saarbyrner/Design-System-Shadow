import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import BulkEditTooltip from '../BulkEditTooltip';

describe('BulkEditTooltip component', () => {
  const mockOnApply = jest.fn();
  const mockOnValidate = jest.fn();

  const props = {
    onApply: mockOnApply,
    isValid: true,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When the type is SELECT', () => {
    const selectProps = {
      ...props,
      type: 'SELECT',
      options: [
        {
          value: 'full',
          label: 'Full',
        },
        {
          value: 'no_participation',
          label: 'No Participation',
        },
      ],
      columnName: 'Participation',
    };

    it('calls onApply with the selected value when clicking the apply button', async () => {
      const user = userEvent.setup();
      render(<BulkEditTooltip {...selectProps} />);

      // Show action tooltip by clicking the trigger
      const trigger = screen.getByText('Participation');
      await user.click(trigger);

      // Change the selection
      const selectDropdown = document.querySelector('#react-select-2-input');
      await user.click(selectDropdown);
      await user.click(screen.getByText('No Participation'));

      // Click apply button
      const applyButton = screen.getByRole('button', { name: 'Apply' });
      await user.click(applyButton);

      expect(mockOnApply).toHaveBeenCalledWith('no_participation');
    });
  });

  describe('When the type is TOGGLE', () => {
    const toggleProps = {
      ...props,
      type: 'TOGGLE',
      columnName: 'Toggle Field',
    };

    it('calls onApply with the selected value when clicking the apply button', async () => {
      const user = userEvent.setup();
      render(<BulkEditTooltip {...toggleProps} />);

      // Show action tooltip by clicking the trigger
      const trigger = screen.getByText('Toggle Field');
      await user.click(trigger);

      // Toggle the field
      const toggleSwitch = screen.getByRole('switch');
      await user.click(toggleSwitch);

      // Click apply button
      const applyButton = screen.getByRole('button', { name: 'Apply' });
      await user.click(applyButton);

      expect(mockOnApply).toHaveBeenCalledWith(true);
    });
  });

  describe('When the type is INPUT', () => {
    const inputProps = {
      ...props,
      type: 'INPUT',
      columnName: 'Input Field',
      onValidate: mockOnValidate,
    };

    it('calls onApply with the input value when clicking the apply button', async () => {
      const user = userEvent.setup();
      render(<BulkEditTooltip {...inputProps} />);

      // Show action tooltip by clicking the trigger
      const trigger = screen.getByText('Input Field');
      await user.click(trigger);

      // Enter a value in the input field
      const inputField = screen.getByRole('spinbutton');
      fireEvent.change(inputField, { target: { value: '123' } });

      // Click apply button
      const applyButton = screen.getByRole('button', { name: 'Apply' });
      await user.click(applyButton);

      expect(mockOnApply).toHaveBeenCalledWith('123');
    });

    it('calls onValidate when input value changes', async () => {
      const user = userEvent.setup();
      render(<BulkEditTooltip {...inputProps} />);

      // Show action tooltip by clicking the trigger
      const trigger = screen.getByText('Input Field');
      await user.click(trigger);

      // Enter a value in the input field
      const inputField = screen.getByRole('spinbutton');
      fireEvent.change(inputField, { target: { value: '456' } });

      expect(mockOnValidate).toHaveBeenCalledWith('456');
    });

    it('shows the error when the input is not valid', async () => {
      const user = userEvent.setup();
      const invalidProps = {
        ...inputProps,
        isValid: false,
        error: 'Test Error Message',
      };
      render(<BulkEditTooltip {...invalidProps} />);

      // Show action tooltip by clicking the trigger
      const trigger = screen.getByText('Input Field');
      await user.click(trigger);

      // Click apply button
      const applyButton = screen.getByRole('button', { name: 'Apply' });
      await user.click(applyButton);

      // Error message should be displayed
      expect(screen.getByText('Test Error Message')).toBeInTheDocument();
    });

    it('does not call onApply when input is not valid', async () => {
      const user = userEvent.setup();
      const invalidProps = {
        ...inputProps,
        isValid: false,
        error: 'Test Error Message',
      };
      render(<BulkEditTooltip {...invalidProps} />);

      // Show action tooltip by clicking the trigger
      const trigger = screen.getByText('Input Field');
      await user.click(trigger);

      // Click apply button
      const applyButton = screen.getByRole('button', { name: 'Apply' });
      await user.click(applyButton);

      // onApply should not be called when isValid is false
      expect(mockOnApply).not.toHaveBeenCalled();
    });
  });
});
