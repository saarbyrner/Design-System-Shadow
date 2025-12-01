import selectEvent from 'react-select-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data as mockPrinciples } from '@kitman/services/src/mocks/handlers/planningHub/getPrinciples';
import { data as mockSquads } from '@kitman/services/src/mocks/handlers/getSquads';
import Principles from '../../principles';

describe('Planning Settings - Principles table', () => {
  const props = { squads: mockSquads };

  test('handles server error', async () => {
    server.use(
      rest.get('/ui/planning_hub/principle_categories', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Principles {...props} />);
    expect(
      await screen.findByText('Something went wrong!')
    ).toBeInTheDocument();
  });

  test('As a user, I want to be able to add a principle', async () => {
    const user = userEvent.setup();
    render(<Principles {...props} />);

    // Initially, the table is displayed on the PRESENTATION view
    const principalTable = screen.getByTestId('PrinciplesTable|principleTable');
    expect(principalTable).not.toHaveClass('planningSettingsTable--edit');

    // Once the data is loaded, the table should contain the saved principles
    expect(await screen.findByText(mockPrinciples[0].name)).toBeInTheDocument();
    expect(await screen.findByText(mockPrinciples[1].name)).toBeInTheDocument();

    // Add a principle
    await user.click(
      screen.getByRole('button', {
        name: /Add principle/i,
      })
    );

    // After clicking the add principles button, the table changes to EDIT view
    expect(principalTable).toHaveClass('planningSettingsTable--edit');

    const nameInput = principalTable.querySelectorAll(
      '.planningSettingsTable__rowCell--name input'
    )[2];
    const categoryInput = principalTable.querySelectorAll(
      '.planningSettingsTable__rowCell--category input'
    )[2];
    const phaseInput = principalTable.querySelectorAll(
      '.planningSettingsTable__rowCell--phase input'
    )[2];
    const typeInput = principalTable.querySelectorAll(
      '.planningSettingsTable__rowCell--type input'
    )[2];
    const squadInput = principalTable.querySelectorAll(
      '.planningSettingsTable__rowCell--squad input'
    )[2];

    // Fill-in all the fields
    fireEvent.change(nameInput, { target: { value: 'New principle' } });
    await selectEvent.select(categoryInput, ['Possession of the ball'], {
      container: document.body,
    });
    await selectEvent.select(phaseInput, ['Defence'], {
      container: document.body,
    });
    await selectEvent.select(typeInput, ['Tactical'], {
      container: document.body,
    });
    await selectEvent.select(squadInput, ['Academy Squad'], {
      container: document.body,
    });

    // override the initial "GET /ui/planning_hub/principles/search" request handler
    // so it returns the saved principle
    server.use(
      rest.post('/ui/planning_hub/principles/search', (req, res, ctx) => {
        return res(
          ctx.json([
            ...mockPrinciples,
            {
              id: 3,
              name: 'New principle',
              principle_categories: [
                {
                  id: 2,
                  name: 'Possession of the ball',
                },
              ],
              phases: [
                {
                  id: 2,
                  name: 'Defence',
                },
              ],
              principle_types: [
                {
                  id: 1,
                  name: 'Tactical',
                },
              ],
              squads: [
                {
                  id: 2,
                  name: 'Academy Squad',
                },
              ],
            },
          ])
        );
      })
    );

    const principlesHeaderSaveButton = screen.getAllByRole('button', {
      name: /Save/i,
    })[1];

    // Click save
    await user.click(principlesHeaderSaveButton);

    // After clicking the save button, the table changes to PRESENTATION view
    expect(principalTable).not.toHaveClass('planningSettingsTable--edit');

    // Once the requests are done, added principle should appear in the table
    await waitFor(() => {
      expect(screen.getByText('New principle')).toBeInTheDocument();
    });
    expect(screen.getByText('Possession of the ball')).toBeInTheDocument();
    expect(screen.getByText('Defence')).toBeInTheDocument();
    expect(screen.getByText('Tactical')).toBeInTheDocument();
    expect(screen.getByText('Academy Squad')).toBeInTheDocument();
  });
});
