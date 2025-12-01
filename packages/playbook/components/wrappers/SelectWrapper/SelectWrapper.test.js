import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectWrapper } from '@kitman/playbook/components';

describe('<SelectWrapper />', () => {
  const onChangeFn = jest.fn();
  const mockOptions = [
    { label: 'Test Label 1', value: 1 },
    { label: 'Test Label 2', value: 2 },
    { label: 'Test Label 3', value: 3 },
  ];
  const mockLabel = 'My Label';
  describe('single select', () => {
    it('renders the label correctly', () => {
      render(
        <SelectWrapper
          label={mockLabel}
          value={mockOptions[0].value}
          onChange={onChangeFn}
          options={mockOptions}
        />
      );
      expect(screen.getByLabelText(mockLabel)).toBeInTheDocument();
    });

    it('renders the selected option correctly', () => {
      render(
        <SelectWrapper
          label={mockLabel}
          value={mockOptions[0].value}
          onChange={onChangeFn}
          options={mockOptions}
        />
      );
      expect(screen.getByText(mockOptions[0].label)).toBeInTheDocument();
    });
    it('calls the onChange when an option is selected', async () => {
      const user = userEvent.setup();
      render(
        <SelectWrapper
          label={mockLabel}
          value={mockOptions[0].value}
          onChange={onChangeFn}
          options={mockOptions}
        />
      );
      const selectButton = screen.getByRole('button', { name: mockLabel });
      await user.click(selectButton);
      await user.click(screen.getByRole('option', { name: mockOptions[1].label }));

      expect(onChangeFn).toHaveBeenCalled();
    });
  });

  describe('when the prop isMulti is true', () => {
    it('renders the selected options correctly', () => {
      render(
        <SelectWrapper
          label={mockLabel}
          value={[mockOptions[0].value, mockOptions[1].value]}
          onChange={onChangeFn}
          options={mockOptions}
          isMulti
        />
      );
      const expectedText = `${mockOptions[0].label}, ${mockOptions[1].label}`;
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });

  describe('when the prop invalid is true', () => {
    it('renders the error state', () => {
      render(
        <SelectWrapper
          label={mockLabel}
          value={mockOptions[1].value}
          onChange={onChangeFn}
          options={mockOptions}
          invalid
        />
      );
      const selectButton = screen.getByRole('button', { name: mockLabel });
      expect(selectButton).toHaveClass('Mui-error');
    });
  });

  describe('when isClearable is true', () => {
    let user;
    beforeEach(() => {
      user = userEvent.setup();
    });

    it('renders the clear button when there is a value', () => {
      render(
        <SelectWrapper
          label={mockLabel}
          value={mockOptions[0].value}
          onChange={onChangeFn}
          options={mockOptions}
          isClearable
        />
      );
      expect(screen.getByLabelText('clear selection')).toBeInTheDocument();
    });

    it('does not render the clear button when there is no value', () => {
      render(
        <SelectWrapper
          label={mockLabel}
          value=""
          onChange={onChangeFn}
          options={mockOptions}
          isClearable
        />
      );
      expect(screen.queryByLabelText('clear selection')).not.toBeInTheDocument();
    });

    it('calls onClear when the clear button is clicked', async () => {
      const onClearFn = jest.fn();
      render(
        <SelectWrapper
          label={mockLabel}
          value={mockOptions[0].value}
          onChange={onChangeFn}
          options={mockOptions}
          isClearable
          onClear={onClearFn}
        />
      );
      const clearButton = screen.getByLabelText('clear selection');
      await user.click(clearButton);
      expect(onClearFn).toHaveBeenCalledTimes(1);
    });
  });
});
