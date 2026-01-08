import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DaySelector from '../index';

describe('DaySelector component', () => {
  const props = {
    label: 'Select days',
    items: [
      { id: 'monday', displayName: 'M', selected: true },
      { id: 'tuesday', displayName: 'T', selected: true },
      { id: 'wednesday', displayName: 'W', selected: true },
      { id: 'thursday', displayName: 'T', selected: true },
      { id: 'friday', displayName: 'F', selected: true },
      { id: 'saturday', displayName: 'S', selected: false },
      { id: 'sunday', displayName: 'S', selected: false },
    ],
  };

  it('renders the list of provided days', () => {
    render(<DaySelector {...props} />);

    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getAllByText('T')).toHaveLength(2);
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
    expect(screen.getAllByText('S')).toHaveLength(2);
  });

  it('fires the callback when an item is clicked on', async () => {
    const onToggleSpy = jest.fn();
    render(<DaySelector {...props} onToggle={onToggleSpy} />);

    await userEvent.click(screen.getByText('M'));
    expect(onToggleSpy).toHaveBeenCalledWith('monday');
  });
});
