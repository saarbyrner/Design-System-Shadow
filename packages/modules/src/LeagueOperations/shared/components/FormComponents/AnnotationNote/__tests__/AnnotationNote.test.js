import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AnnotationNote from '../index';

const mockOnChange = jest.fn();

const defaultProps = {
  t: i18nextTranslateStub(),
  onChange: mockOnChange,
};

describe('AnnotationNote', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render the multiline TextField with the correct label', () => {
    render(<AnnotationNote {...defaultProps} />);

    expect(screen.getByLabelText('Note')).toBeInTheDocument();

    // Check if it's a multiline input (usually a <textarea>)
    const textField = screen.getByLabelText('Note');
    expect(textField.tagName).toBe('TEXTAREA');

    // Check for the multiline attribute (though TextField may render it differently)
    expect(textField).toHaveAttribute('rows', '5');
  });

  it('should call onChange with an empty string when only whitespace is entered', () => {
    render(<AnnotationNote {...defaultProps} />);

    const textField = screen.getByLabelText('Note');

    // Simulate a user typing only spaces, tabs, and newlines
    const whitespaceInput = ' \n \t \n ';
    const expectedOutput = ''; // The result of calling .trim() on the whitespace

    fireEvent.change(textField, { target: { value: whitespaceInput } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      annotation: expectedOutput,
    });
  });
  it('should call onChange with the TRIMMED value when text is entered', () => {
    render(<AnnotationNote {...defaultProps} />);

    const textField = screen.getByLabelText('Note');

    const rawInput = '   This is a test note.   ';
    const trimmedInput = 'This is a test note.';

    fireEvent.change(textField, { target: { value: rawInput } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      annotation: trimmedInput,
    });
  });

  it('should call onChange correctly when a clean string is entered', () => {
    render(<AnnotationNote {...defaultProps} />);

    const textField = screen.getByLabelText('Note');
    const cleanInput = 'Another clean note.';

    fireEvent.change(textField, { target: { value: cleanInput } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      annotation: cleanInput,
    });
  });
});
