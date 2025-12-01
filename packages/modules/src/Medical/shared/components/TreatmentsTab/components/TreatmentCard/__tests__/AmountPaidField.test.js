import { render, screen } from '@testing-library/react';

import AmountPaidField from '../AmountPaidField';

describe('<AmountPaidField />', () => {
  const baseProps = {
    isEditing: false,
    isDisabled: false,
    initialAmount: '20.0',
    onUpdateAmount: jest.fn(),
  };

  test('renders the correct content', () => {
    render(<AmountPaidField {...baseProps} />);
    expect(screen.getByText('20.0')).toBeInTheDocument();
  });

  describe('when isEditing', () => {
    test('renders an input with the initial amount', () => {
      render(<AmountPaidField {...baseProps} isEditing />);
      expect(screen.getByDisplayValue('20.0')).toBeInTheDocument();
    });
  });
});
