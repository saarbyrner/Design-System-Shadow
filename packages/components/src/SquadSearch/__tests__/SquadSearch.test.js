import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SquadSearch from '../index';

const baseItems = [
  { id: 'athlete_1', title: 'Sigmund Freud' },
  { id: 'athlete_2', title: 'Carl Jung' },
  { id: 'athlete_3', title: 'Robert Johnson' },
  { id: 'athlete_4', title: 'Joseph Campbell' },
  { id: 'applies_to_squad', title: 'Entire Squad' },
];

const renderComponent = (overrideProps = {}) => {
  const props = {
    unique_key: 'test_key',
    items: baseItems,
    selectedItems: [],
    missingAthletes: [],
    exclusive: true,
    onChange: jest.fn(),
    ...overrideProps,
  };

  return render(<SquadSearch {...props} />);
};

describe('<SquadSearch /> component', () => {
  it('renders', () => {
    renderComponent();
    expect(screen.getByTestId('squad-search')).toBeInTheDocument();
  });

  it('shows the missing athlete message', () => {
    renderComponent({
      selectedItems: ['athlete_1', 'athlete_2'],
      missingAthletes: ['1', '2'],
    });

    expect(
      screen.getByText((text) =>
        text.includes('Athletes not in current squad: Sigmund Freud, Carl Jung')
      )
    ).toBeInTheDocument();
  });

  it('clears other selections when "Entire Squad" is selected (exclusive)', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderComponent({
      selectedItems: ['athlete_1'],
      onChange,
    });

    await user.click(screen.getByText('Entire Squad'));

    expect(onChange).toHaveBeenCalledWith(['athlete_1']);
  });

  it('keeps all selected items including "Entire Squad" when exclusive=false', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderComponent({
      exclusive: false,
      selectedItems: ['applies_to_squad'],
      onChange,
    });

    await user.click(screen.getByText('Robert Johnson'));

    expect(onChange).toHaveBeenCalledWith(['athlete_3', 'applies_to_squad']);
  });
});
