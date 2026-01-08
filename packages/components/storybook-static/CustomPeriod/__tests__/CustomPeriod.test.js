import { fireEvent, render, screen } from '@testing-library/react';
import CustomPeriod from '../index';

describe('CustomPeriod', () => {
  const mockOnUpdateCustomPeriodDuration = jest.fn();

  const renderComponent = () =>
    render(
      <CustomPeriod
        labelText="Test 1 Period"
        descriptor="mins"
        period={{ duration: 50 }}
        onUpdateCustomPeriodDuration={mockOnUpdateCustomPeriodDuration}
        periodIndex={0}
      />
    );

  describe('initial render', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('renders the custom period out', () => {
      expect(screen.getByText('Test 1 Period')).toBeInTheDocument();
      expect(screen.getByText('mins')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    });

    it('changing the period duration input changes the input value', () => {
      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '20' },
      });
      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
      fireEvent.blur(screen.getByRole('spinbutton'));
      expect(mockOnUpdateCustomPeriodDuration).toHaveBeenCalledWith(20, 0);
    });

    it('changing the period duration to an invalid number sets it as its previous value', () => {
      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '0' },
      });
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
      fireEvent.blur(screen.getByRole('spinbutton'));
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    });
  });
});
