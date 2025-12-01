import { render, screen } from '@testing-library/react';

import CptCodeField from '../CptCodeField';

describe('<CptCodeField />', () => {
  const baseProps = {
    isEditing: false,
    isDisabled: false,
    initialCode: 'ABC12',
    onUpdateCode: jest.fn(),
  };

  test('renders the correct content', () => {
    render(<CptCodeField {...baseProps} />);
    expect(screen.getByText('ABC12')).toBeInTheDocument();
  });

  describe('when isEditing', () => {
    test('renders an input with the initial code', () => {
      render(<CptCodeField {...baseProps} isEditing />);
      expect(screen.getByDisplayValue('ABC12')).toBeInTheDocument();
    });
  });
});
