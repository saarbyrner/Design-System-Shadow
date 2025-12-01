import { fireEvent, screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomPeriodsModal from '../index';

describe('CustomPeriodsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const mockEventPeriods = [
    {
      id: 1,
      duration: 40,
      absolute_duration_start: 0,
      absolute_duration_end: 40,
      name: 'Period 1',
    },
    {
      id: 2,
      duration: 30,
      absolute_duration_start: 40,
      absolute_duration_end: 70,
      name: 'Period 2',
    },
  ];

  const componentRender = () =>
    render(
      <CustomPeriodsModal
        isOpen
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
        eventPeriods={mockEventPeriods}
        t={(t) => t}
      />
    );

  describe('initial render', () => {
    beforeEach(() => {
      componentRender();
    });

    it('renders the custom periods modal out', () => {
      expect(screen.getByText('Custom Period Times')).toBeInTheDocument();
      expect(screen.getByText('Period 1')).toBeInTheDocument();
      expect(screen.getByText('Period 2')).toBeInTheDocument();
      expect(screen.getByText('Period 3')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('calls onClose when cancel is used', async () => {
      await userEvent.click(screen.getByText('Cancel'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('displays a error message if you hit confirm without filling in all the periods', async () => {
      await userEvent.click(screen.getByText('Confirm'));
      expect(
        screen.getByText('Each Period Must Have A Duration')
      ).toBeInTheDocument();
    });

    it('allows the user to change the input and hit submit', async () => {
      await userEvent.click(screen.getByText('Confirm'));
      fireEvent.change(screen.getByDisplayValue(''), {
        target: { value: '20' },
      });
      fireEvent.blur(screen.getByDisplayValue('20'));
      await userEvent.click(screen.getByText('Confirm'));
      expect(mockOnConfirm).toHaveBeenCalledWith([
        {
          absolute_duration_end: 40,
          absolute_duration_start: 0,
          duration: 40,
          id: 1,
          name: 'Period 1',
        },
        {
          absolute_duration_end: 70,
          absolute_duration_start: 40,
          duration: 30,
          id: 2,
          name: 'Period 2',
        },
        {
          absolute_duration_end: 90,
          absolute_duration_start: 70,
          duration: 20,
          localId: 3,
          name: 'Period 3',
        },
      ]);
    });
  });
});
