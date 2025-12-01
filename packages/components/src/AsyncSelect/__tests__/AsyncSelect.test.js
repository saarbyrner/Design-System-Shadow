import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import selectEvent from 'react-select-event';
import AsyncSelect from '..';

jest.mock('@kitman/common/src/hooks/useDebouncedCallback', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((callback) => callback),
}));

describe('AsyncSelect', () => {
  const props = {
    label: 'Field label',
    value: null,
    placeholder: 'Field placeholder',
    onChange: jest.fn(),
    loadOptions: jest.fn().mockResolvedValue([
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ]),
    t: (text) => text,
    isClearable: true,
  };

  describe('renders correctly', () => {
    it('renders the component correctly', () => {
      render(<AsyncSelect {...props} />);
      expect(screen.getByText('Field label')).toBeInTheDocument();
      expect(screen.getByText('Field placeholder')).toBeInTheDocument();
    });

    it('renders the loading state when the loadOptions function is called', () => {
      render(<AsyncSelect {...props} />);
      const selectInput = screen.getByRole('textbox');
      fireEvent.change(selectInput, { target: { value: 'Option' } });
      selectEvent.openMenu(selectInput);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('loadOptions', () => {
    it('calls the loadOptions function when the user types in the input', () => {
      render(<AsyncSelect {...props} />);
      const selectInput = screen.getByRole('textbox');
      fireEvent.change(selectInput, { target: { value: 'Option' } });
      expect(props.loadOptions).toHaveBeenCalled();
    });

    it('does not call the loadOptions function when the user types in the input and the input is less than the minimum letters', () => {
      render(<AsyncSelect {...props} minimumLetters={3} />);
      const selectInput = screen.getByRole('textbox');
      fireEvent.change(selectInput, { target: { value: 'Op' } });
      expect(props.loadOptions).not.toHaveBeenCalled();
    });
  });

  describe('Invalid text display', () => {
    it('displays invalid text when displayValidationText and invalid are true', () => {
      render(<AsyncSelect {...props} displayValidationText invalid />);
      expect(screen.queryByText('This field is required')).toBeInTheDocument();
    });

    it('does not display invalid text when displayValidationText or invalid are false', () => {
      render(<AsyncSelect {...props} invalid={false} />);
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument();
    });
  });
});
