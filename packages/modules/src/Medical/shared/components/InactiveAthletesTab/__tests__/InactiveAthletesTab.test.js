import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { inactiveData as data } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { rest, server } from '@kitman/services/src/mocks/server';
import selectEvent from 'react-select-event';
import InactiveAthletesTab from '..';

describe('<InactiveAthletesTab />', () => {
  const props = {
    reloadData: true,
    t: i18nextTranslateStub(),
  };

  it('renders the correct content', async () => {
    render(<InactiveAthletesTab {...props} />);

    const loader = screen.getByText(/Loading/i);
    expect(
      screen.getByRole('progressbar', { name: /Loading/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(loader);

    expect(screen.getByText('Inactive athletes')).toBeInTheDocument();
    const desktopFilters = within(screen.getByTestId('DesktopFilters'));
    expect(
      desktopFilters.getByPlaceholderText('Search athletes')
    ).toBeInTheDocument();
    expect(desktopFilters.getByText('Squads')).toBeInTheDocument();
    expect(
      screen.getByText(data.squads[0].athletes[0].fullname)
    ).toBeInTheDocument();
  });

  it('renders the correct content when we have no data', async () => {
    server.use(
      rest.get('/ui/squad_athletes/athlete_list', (req, res, ctx) =>
        res(ctx.json([]))
      )
    );

    render(<InactiveAthletesTab {...props} />);

    const loader = screen.getByText(/Loading/i);
    expect(
      screen.getByRole('progressbar', { name: /Loading/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(loader);

    expect(screen.getByText('Inactive athletes')).toBeInTheDocument();
    const desktopFilters = within(screen.getByTestId('DesktopFilters'));
    expect(
      desktopFilters.getByPlaceholderText('Search athletes')
    ).toBeInTheDocument();
    expect(desktopFilters.getByText('Squads')).toBeInTheDocument();
    expect(
      screen.getByText('No inactive athletes for this period')
    ).toBeInTheDocument();
  });

  it('filters athletes by name and squads', async () => {
    const { container } = render(<InactiveAthletesTab {...props} />);

    const loader = screen.getByText(/Loading/i);
    expect(
      screen.getByRole('progressbar', { name: /Loading/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(loader);

    const desktopFilters = within(screen.getByTestId('DesktopFilters'));

    const searchInput = desktopFilters.getByPlaceholderText('Search athletes');

    fireEvent.change(searchInput, { target: { value: 'son' } });

    await waitFor(() => {
      expect(screen.getByText('Merle Rolfson')).toBeInTheDocument();
      expect(screen.getByText('Marco Halvorson')).toBeInTheDocument();
    });

    selectEvent.openMenu(container.querySelector('.kitmanReactSelect input'));
    const firstSquadOption = await screen.findByText('Squad 1');
    await fireEvent.click(firstSquadOption);

    expect(screen.getByText('Merle Rolfson')).toBeInTheDocument();
    expect(screen.queryByText('Marco Halvorson')).toBeInTheDocument(); // Athlete is in both squads so should also render
  });

  it('does not show multiple rows of the same athlete if he is in multiple squads', async () => {
    render(<InactiveAthletesTab {...props} />);

    const loader = screen.getByText(/Loading/i);
    expect(
      screen.getByRole('progressbar', { name: /Loading/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(loader);

    // will fail if there are multiple rows of the same athlete
    expect(screen.getByText('Marco Halvorson')).toBeInTheDocument();
  });
});
