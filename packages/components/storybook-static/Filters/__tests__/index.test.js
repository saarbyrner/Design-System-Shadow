import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Filters from '..';

describe('Filters', () => {
  describe('Filter.Search', () => {
    const placeholder = 'placeholder';
    const onChangeMock = jest.fn();

    const renderComponent = (props = {}) => {
      return render(
        <Filters.Search
          placeholder={placeholder}
          onChange={onChangeMock}
          {...props}
        />
      );
    };

    it('renders correctly', () => {
      renderComponent();
      expect(screen.queryByLabelText(placeholder)).toBeInTheDocument();
    });

    it('should call onChange with the correct value when input changes', async () => {
      const user = userEvent.setup();
      renderComponent({ value: '' });

      const inputElement = screen.queryByLabelText(placeholder);
      const newValue = 'n';
      await user.type(inputElement, newValue);

      expect(onChangeMock).toHaveBeenCalledTimes(newValue.length);
      expect(onChangeMock.mock.calls).toEqual([['n']]);
    });
  });

  describe('Filters.Select', () => {
    const placeholder = 'Select an option';
    const initialValue = [];
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];
    const onChangeMock = jest.fn();

    const renderComponent = (props = {}) => {
      return render(
        <Filters.Select
          placeholder={placeholder}
          value={initialValue}
          onChange={onChangeMock}
          options={options}
          {...props}
        />
      );
    };

    it('renders correctly', () => {
      renderComponent();
      expect(screen.getByText(placeholder)).toBeInTheDocument(placeholder);
    });

    it('should display options when clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const selectElement = screen.getByRole('button');
      await user.click(selectElement);

      options.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('should call onChange with the correct value when an option is selected', async () => {
      const user = userEvent.setup();
      renderComponent();

      const selectElement = screen.getByRole('button');
      await user.click(selectElement);

      const optionToSelect = options[1];
      const option = screen.getByText(optionToSelect.label);
      await user.click(option);

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith([optionToSelect.value]);
    });
  });
});
