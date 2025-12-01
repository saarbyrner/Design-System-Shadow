import { screen, waitFor } from '@testing-library/react';
import { useLeagueOperations } from '@kitman/common/src/hooks';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { axios } from '@kitman/common/src/utils/services';
import userEvent from '@testing-library/user-event';
import { capitalize } from 'lodash';
import { playerTypesEnumLike } from '@kitman/modules/src/KitMatrix/shared/constants';
import KitsTab from '..';

jest.mock('@kitman/common/src/hooks', () => ({
  useLeagueOperations: jest.fn(),
}));

describe('KitsTab Component', () => {
  const renderComponent = (
    { isLeague, isOrgSupervised } = { isLeague: false, isOrgSupervised: false }
  ) => {
    useLeagueOperations.mockReturnValue({
      isLeague,
      isOrgSupervised,
    });

    return renderWithProviders(<KitsTab />);
  };

  it('renders correctly', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Kits' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
    ['Colors', 'Types'].forEach((name) => {
      expect(
        screen.getByRole('button', { name: new RegExp(name, 'i') })
      ).toBeInTheDocument();
    });

    await waitFor(async () => {
      expect(axiosPostSpy).toHaveBeenCalledWith(
        '/planning_hub/kit_matrices/search',
        {
          archived: false,
          kinds: [],
          kit_matrix_color_ids: [],
          next_id: null,
          organisation_ids: [],
          search_expression: '',
          squad_ids: [],
        },
        { params: { include_games_count: true } }
      );
    });

    [
      'Kit Name Type League Color Jersey Shorts Socks Kit Preview Linked fixtures',
      'Home Kit Player KLS Next Blue Navy Pinky Pink Forest Green view 1',
      'Away Kit Player KLS Next Forest Green Pinky Pink Blue Navy view 0',
      'Training Kit Goalkeeper KLS Next Blue Navy Forest Green Forest Green view 0',
    ].forEach((name) => {
      expect(screen.getByRole('row', { name })).toBeInTheDocument();
    });
  });

  it('filters by name', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup();
    renderComponent();

    const search = screen.getByRole('textbox', { name: 'Search' });
    const newValue = 'n';
    await user.type(search, newValue);

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        2,
        '/planning_hub/kit_matrices/search',
        {
          archived: false,
          kinds: [],
          kit_matrix_color_ids: [],
          next_id: null,
          organisation_ids: [],
          search_expression: 'n',
          squad_ids: [],
        },
        {
          params: {
            include_games_count: true,
          },
        }
      );
    });
  });

  it('filters by color', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.queryByLabelText('Colors'));
    await user.click(screen.getByRole('option', { name: 'Forest Green' }));

    expect(axiosPostSpy).toHaveBeenNthCalledWith(
      2,
      '/planning_hub/kit_matrices/search',
      {
        archived: false,
        kinds: [],
        kit_matrix_color_ids: [3],
        next_id: null,
        organisation_ids: [],
        search_expression: '',
        squad_ids: [],
      },
      {
        params: {
          include_games_count: true,
        },
      }
    );
  });

  it('filters by player type', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.queryByLabelText('Types'));
    await user.click(screen.getByText('Referee'));

    expect(axiosPostSpy).toHaveBeenNthCalledWith(
      2,
      '/planning_hub/kit_matrices/search',
      {
        archived: false,
        kinds: ['referee'],
        kit_matrix_color_ids: [],
        next_id: null,
        organisation_ids: [],
        search_expression: '',
        squad_ids: [],
      },
      {
        params: {
          include_games_count: true,
        },
      }
    );
  });

  it('does not render referee filter for club users', async () => {
    const user = userEvent.setup();
    renderComponent({ isOrgSupervised: true });
    await user.click(screen.queryByLabelText('Types'));

    expect(
      screen.getByRole('option', {
        name: 'Outfield Player',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: capitalize(playerTypesEnumLike.goalkeeper),
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', {
        name: capitalize(playerTypesEnumLike.referee),
      })
    ).not.toBeInTheDocument();
  });

  it('renders referee filter for league users', async () => {
    const user = userEvent.setup();
    renderComponent({ isLeague: true });
    await user.click(screen.queryByLabelText('Types'));

    expect(
      screen.getByRole('option', {
        name: 'Outfield Player',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: capitalize(playerTypesEnumLike.goalkeeper),
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: capitalize(playerTypesEnumLike.referee),
      })
    ).toBeInTheDocument();
  });

  it('opens kit preview drawer when "view" is clicked', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup();
    renderComponent();

    await waitFor(async () => {
      expect(axiosPostSpy).toHaveBeenCalledWith(
        '/planning_hub/kit_matrices/search',
        {
          archived: false,
          kinds: [],
          kit_matrix_color_ids: [],
          next_id: null,
          organisation_ids: [],
          search_expression: '',
          squad_ids: [],
        },
        { params: { include_games_count: true } }
      );
    });

    await user.click(screen.getAllByText('view')[0]);

    expect(screen.getByRole('heading', 'Home Kit')).toBeInTheDocument();
    expect(screen.getByAltText('jersey preview')).toBeInTheDocument();
    expect(screen.getByAltText('shorts preview')).toBeInTheDocument();
    expect(screen.getByAltText('socks preview')).toBeInTheDocument();
  });
});
