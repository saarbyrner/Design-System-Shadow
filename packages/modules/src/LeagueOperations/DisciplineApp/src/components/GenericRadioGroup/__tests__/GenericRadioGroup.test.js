import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GenericRadioGroup from '../GenericRadioGroup';


  describe('GenericRadioGroup', () => { 

    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];
    const onChangeMock = jest.fn();

    beforeEach(() => {
      render(
        <GenericRadioGroup
          title="Select an option"
          options={options}
          selectedValue="option1"
          onChange={onChangeMock}
        />
      );
    });

    it('renders the title', () => {
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('renders the radio buttons with correct labels', () => {
      options.forEach((option) => {
        expect(screen.getByLabelText(option.label)).toBeInTheDocument();
      });
    });

    it('selects the correct radio button based on selectedValue', () => {
      expect(screen.getByLabelText('Option 1')).toBeChecked();
      expect(screen.getByLabelText('Option 2')).not.toBeChecked();
    });

    it('calls onChange when a radio button is clicked', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByLabelText('Option 2'));
      expect(onChangeMock).toHaveBeenCalledWith('option2');
    });

  });