import { render, screen } from '@testing-library/react';
import MultipleCheckboxChecker from '..';

describe('<MultipleCheckboxChecker />', () => {
  it('renders an empty checkbox by default', () => {
    render(<MultipleCheckboxChecker />);
    expect(screen.getByTestId('MultipleCheckboxChecker')).toHaveClass(
      'multipleCheckboxChecker'
    );
  });

  it('renders a ticked checkbox if type is ALL_CHECKED', () => {
    render(<MultipleCheckboxChecker type="ALL_CHECKED" />);
    expect(screen.getByTestId('MultipleCheckboxChecker')).toHaveClass(
      'multipleCheckboxChecker--checked'
    );
  });

  it('renders a checkbox with a minus icon inside if type is PARTIALLY_CHECKED', () => {
    render(<MultipleCheckboxChecker type="PARTIALLY_CHECKED" />);
    expect(screen.getByTestId('MultipleCheckboxChecker')).toHaveClass(
      'multipleCheckboxChecker--minus'
    );
  });
});
