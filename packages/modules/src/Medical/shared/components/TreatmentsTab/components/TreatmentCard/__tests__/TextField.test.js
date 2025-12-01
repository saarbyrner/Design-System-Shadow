import { render, screen } from '@testing-library/react';

import TextField from '../TextField';

describe('<TextField />', () => {
  const baseProps = {
    isEditing: false,
    isDisabled: false,
    initialValue: 'ABC12',
    onUpdateText: jest.fn(),
  };

  test('renders the correct content', () => {
    render(<TextField {...baseProps} />);
    expect(screen.getByText('ABC12')).toBeInTheDocument();
  });

  describe('when isEditing', () => {
    test('renders an input with the initial value', () => {
      render(<TextField {...baseProps} isEditing />);
      expect(screen.getByDisplayValue('ABC12')).toBeInTheDocument();
    });
  });
});
