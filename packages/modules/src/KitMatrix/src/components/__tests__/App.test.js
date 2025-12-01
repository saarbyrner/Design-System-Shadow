import { screen, waitFor, fireEvent } from '@testing-library/react';
import { axios } from '@kitman/common/src/utils/services';
import userEvent from '@testing-library/user-event';
import * as redux from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { getTranslations } from '@kitman/modules/src/KitMatrix/shared/utils';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import App from '../App';

jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/hooks/useLeagueOperations');

describe('<App />', () => {
  const t = i18nextTranslateStub();
  const textEnum = getTranslations(t);

  const renderComponent = ({ manageKits, isLeague } = {}) => {
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          manageKits,
        },
      },
    });
    useLeagueOperations.mockReturnValue({
      isLeague,
    });

    return renderWithRedux(<App />, {
      preloadedState: {},
      useGlobalStore: true,
    });
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    renderComponent({
      isLeague: false,
      manageKits: true,
    });
    expect(
      screen.getByRole('heading', { name: 'Kit Sets' })
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
    ['Add', 'Colors', 'Types'].forEach((name) => {
      expect(
        screen.getByRole('button', { name: new RegExp(name, 'i') })
      ).toBeInTheDocument();
    });

    await waitFor(async () => {
      expect(axiosPostSpy).toHaveBeenCalled();
    });

    [
      'Club Kit Name Type League Color Jersey Shorts Socks Linked fixtures Status',
      'KL Toronto flag KL Toronto Home Kit Player KLS Next Blue Navy Pinky Pink Forest Green 1 Active',
      'KL Club flag KL Club Away Kit Player KLS Next Forest Green Pinky Pink Blue Navy 0 Active',
      'KL Galaxy flag KL Galaxy Training Kit Goalkeeper KLS Next Blue Navy Forest Green Forest Green 0 Active',
    ].forEach((name) => {
      expect(screen.getByRole('row', { name })).toBeInTheDocument();
    });
  });

  it('filters by name', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    renderComponent();

    const search = screen.getByRole('textbox', { name: 'Search' });
    const newValue = 'n';
    fireEvent.change(search, { target: { value: newValue } });

    await waitFor(
      () => {
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
      },
      { timeout: 4000 }
    );
  });

  it('filters by organisation/club', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup();
    renderComponent({
      isLeague: true,
    });

    await user.click(screen.queryByLabelText('Clubs'));
    await user.click(screen.getByText('club'));

    expect(axiosPostSpy).toHaveBeenNthCalledWith(
      2,
      '/planning_hub/kit_matrices/search',
      {
        archived: false,
        kinds: [],
        kit_matrix_color_ids: [],
        next_id: null,
        organisation_ids: [1234],
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

  it('calls updateKitMatrix when deleting a kit', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const axiosPatchSpy = jest.spyOn(axios, 'patch');
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
    const user = userEvent.setup();
    renderComponent({ manageKits: true });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        1,
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
        {
          params: {
            include_games_count: true,
          },
        }
      );
    });

    await user.click(screen.getAllByTestId('MoreVertIcon')[0]);
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(screen.getByText('Delete Kit Set')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this kit?')
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: toastStatusEnumLike.Success,
        title: textEnum.kitDeletedSuccess,
      },
      type: 'toasts/add',
    });

    expect(axiosPatchSpy).toHaveBeenNthCalledWith(
      1,
      '/planning_hub/kit_matrices/2',
      {
        archived: true,
      }
    );
    expect(axiosPostSpy).toHaveBeenNthCalledWith(
      2,
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
      {
        params: {
          include_games_count: true,
        },
      }
    );
  });

  it('shows an error when updateKitMatrix fails', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    jest.spyOn(axios, 'patch').mockImplementation(() => {
      throw new Error();
    });
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
    const user = userEvent.setup();
    renderComponent({ manageKits: true });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        1,
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
        {
          params: {
            include_games_count: true,
          },
        }
      );
    });

    await user.click(screen.getAllByTestId('MoreVertIcon')[0]);
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(screen.getByText('Delete Kit Set')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this kit?')
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: toastStatusEnumLike.Error,
        title: textEnum.kitDeletedError,
      },
      type: 'toasts/add',
    });
  });

  it('renders edit/delete button, when permissions is true', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup();
    renderComponent({
      manageKits: true,
    });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        1,
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
        {
          params: {
            include_games_count: true,
          },
        }
      );
    });

    await user.click(screen.getAllByTestId('MoreVertIcon')[0]);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});
