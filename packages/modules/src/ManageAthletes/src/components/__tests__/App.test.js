import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { rest, server } from '@kitman/services/src/mocks/server';
import { data } from '@kitman/services/src/mocks/handlers/getAdministrationAthleteData';
import handlers from '@kitman/modules/src/AthleteManagement/shared/redux/services/mocks/handlers';
import ManageAthletesApp from '../App';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('<ManageAthletes />', () => {
  beforeEach(() => server.use(...handlers));

  it('displays the correct content after loading', async () => {
    renderWithProviders(<ManageAthletesApp />);
    const loader = screen.getByText(/loading/i);
    expect(loader).toBeInTheDocument();
    await waitForElementToBeRemoved(loader);

    const [activeTab, inactiveTab] = await screen.findAllByRole('tab');
    expect(activeTab).toHaveTextContent('Active');
    expect(activeTab).toHaveClass('rc-tabs-tab-active');
    expect(inactiveTab).toHaveTextContent('Inactive');
    expect(inactiveTab).not.toHaveClass('rc-tabs-tab-active');

    expect(screen.getByText('Active athletes')).toBeInTheDocument();

    const tableRows = screen
      .getByRole('table')
      .querySelector('tbody')
      .querySelectorAll('tr');
    expect(tableRows).toHaveLength(2);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('displays the correct content when switching the view', async () => {
    renderWithProviders(<ManageAthletesApp />);
    await waitForElementToBeRemoved(screen.queryByText(/loading/i));

    // Stub the request to fetch inactive athletes
    server.use(
      rest.get('/administration/athletes', (req, res, ctx) =>
        res(ctx.json(data.inactiveAthletes))
      )
    );

    const tabs = await screen.findAllByRole('tab');
    // Click inactive tab
    await userEvent.click(tabs[1]);

    await waitFor(() =>
      expect(screen.getByText('Inactive athletes')).toBeInTheDocument()
    );

    const tableRows = screen
      .getByRole('table')
      .querySelector('tbody')
      .querySelectorAll('tr');
    expect(tableRows).toHaveLength(3);

    expect(screen.getByText('Philip Callahan')).toBeInTheDocument();
    expect(screen.getByText('Mark Lenders')).toBeInTheDocument();
    expect(screen.getByText('James Howlet')).toBeInTheDocument();
  });

  describe('when filtering by searching', () => {
    beforeEach(() => {
      window.featureFlags['export-insurance-details'] = true;
    });

    afterEach(() => {
      window.featureFlags['export-insurance-details'] = false;
    });

    it('displays the correct content', async () => {
      renderWithProviders(<ManageAthletesApp />);
      await waitForElementToBeRemoved(screen.queryByText(/loading/i));

      const filteredAthletes = data.activeAthletes.athletes.filter(
        (activeAthlete) => activeAthlete.name.includes('Ja')
      );

      // Stub the request to fetch filtered active athletes
      server.use(
        rest.get('/administration/athletes', (req, res, ctx) =>
          res(ctx.json({ ...data.activeAthletes, athletes: filteredAthletes }))
        )
      );

      // Filter by search
      await userEvent.type(screen.getByPlaceholderText('Search'), 'Ja');

      // Wait to the loader is shown after filtering and hidden after the request is done
      await waitFor(() =>
        expect(screen.getByText(/Loading/i)).toBeInTheDocument()
      );

      const tableRows = screen
        .getByRole('table')
        .querySelector('tbody')
        .querySelectorAll('tr');
      expect(tableRows).toHaveLength(1);

      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  it('displays the error message when the permission request fails', async () => {
    // Stub the request to simulate a failing request
    server.use(
      rest.get('/ui/permissions', (req, res, ctx) => res(ctx.status(500)))
    );

    renderWithProviders(<ManageAthletesApp />);
    expect(
      await screen.findByText('Something went wrong!')
    ).toBeInTheDocument();
  });

  it('displays the error message when the active squad request fails', async () => {
    // Stub the request to simulate a failing request
    server.use(
      rest.get('/ui/squads/active_squad', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    renderWithProviders(<ManageAthletesApp />);
    expect(
      await screen.findByText('Something went wrong!')
    ).toBeInTheDocument();
  });

  it('displays the error message when the administration athlete data request fails', async () => {
    // Stub the request to simulate a failing request
    server.use(
      rest.get('/administration/athletes', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    renderWithProviders(<ManageAthletesApp />);
    expect(
      await screen.findByText('Something went wrong!')
    ).toBeInTheDocument();
  });
});
