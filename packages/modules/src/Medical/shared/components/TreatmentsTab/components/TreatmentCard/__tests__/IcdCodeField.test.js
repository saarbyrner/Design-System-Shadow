import { render, screen } from '@testing-library/react';

import IcdCodeField from '../IcdCodeField';

describe('<IcdCodeField />', () => {
  const baseProps = {
    isEditing: false,
    isDisabled: false,
    initialCode: 'ABC12ZZ',
    onUpdateCode: jest.fn(),
  };

  test('renders the correct content', () => {
    render(<IcdCodeField {...baseProps} />);
    expect(screen.getByText('ABC12ZZ')).toBeInTheDocument();
  });

  describe('when isEditing', () => {
    test('renders an input with the initial code', () => {
      render(<IcdCodeField {...baseProps} isEditing />);
      expect(screen.getByDisplayValue('ABC12ZZ')).toBeInTheDocument();
    });
  });
});
