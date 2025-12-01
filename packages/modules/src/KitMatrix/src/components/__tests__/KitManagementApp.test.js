import { screen, waitFor, fireEvent } from '@testing-library/react';
import { axios } from '@kitman/common/src/utils/services';
import userEvent from '@testing-library/user-event';
import * as redux from 'react-redux';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  DEACTIVATE_KIT,
  ACTIVATE_KIT,
  UPDATE_KIT,
} from '@kitman/modules/src/KitMatrix/shared/constants';
import KitManagementApp from '../KitManagementApp';

jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/hooks/useLeagueOperations');

describe('<KitManagementApp />', () => {
  const createMockDispatch = () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
    return { useDispatchSpy, mockDispatch };
  };

  const createModalState = (
    mode,
    selectedRow = { id: 2, name: 'Test Kit' }
  ) => ({
    'kitManagement.slice': {
      panel: { isOpen: false },
      modal: { isOpen: true, mode },
      selectedRow,
    },
  });

  const expectInitialApiCall = (axiosPostSpy) => {
    return expect(axiosPostSpy).toHaveBeenNthCalledWith(
      1,
      '/planning_hub/kit_matrices/search',
      {
        archived: false,
        kinds: [],
        kit_matrix_color_ids: [],
        next_id: null,
        organisation_ids: [],
        page: 1,
        per_page: 30,
        search_expression: '',
        squad_ids: [],
        season: [],
      },
      {
        params: {
          include_games_count: true,
        },
      }
    );
  };

  const renderComponent = ({
    manageKits,
    isLeague,
    preloadedState = {},
  } = {}) => {
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

    return renderWithRedux(<KitManagementApp />, {
      preloadedState,
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
    expect(
      screen.getByRole('button', { name: 'Add Kit Set' })
    ).toBeInTheDocument();

    // Check for filter comboboxes
    expect(screen.getByRole('combobox', { name: 'Clubs' })).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Colors' })
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Types' })).toBeInTheDocument();

    await waitFor(async () => {
      expect(axiosPostSpy).toHaveBeenCalled();
    });

    // Check for tabs
    expect(screen.getByRole('tab', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Inactive' })).toBeInTheDocument();
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
            page: 1,
            per_page: 30,
            search_expression: 'n',
            squad_ids: [],
            season: [],
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
        page: 1,
        per_page: 30,
        search_expression: '',
        squad_ids: [],
        season: [],
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
        page: 1,
        per_page: 30,
        search_expression: '',
        squad_ids: [],
        season: [],
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
        page: 1,
        per_page: 30,
        search_expression: '',
        squad_ids: [],
        season: [],
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
    const { mockDispatch } = createMockDispatch();
    const user = userEvent.setup();
    renderComponent({ manageKits: true });

    await waitFor(() => {
      expectInitialApiCall(axiosPostSpy);
    });

    // Test that the action menu is available
    await user.click(screen.getAllByTestId('MoreVertIcon')[0]);
    await user.click(screen.getByRole('menuitem', { name: 'Deactivate' }));

    // Verify that the deactivate action was triggered
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('shows an error when updateKitMatrix fails', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    jest.spyOn(axios, 'patch').mockImplementation(() => {
      throw new Error();
    });
    const { mockDispatch } = createMockDispatch();
    const user = userEvent.setup();

    renderComponent({
      manageKits: true,
      preloadedState: createModalState(DEACTIVATE_KIT),
    });

    await waitFor(() => {
      expectInitialApiCall(axiosPostSpy);
    });

    expect(screen.getByText('Deactivate kit?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: toastStatusEnumLike.Error,
        title: "We couldn't deactivate the kit.",
      },
      type: 'toasts/add',
    });
  });

  it('renders edit/deactivate button, when permissions is true', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup();
    renderComponent({ manageKits: true });

    await waitFor(() => {
      expectInitialApiCall(axiosPostSpy);
    });

    await user.click(screen.getAllByTestId('MoreVertIcon')[0]);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Deactivate')).toBeInTheDocument();
  });

  it('shows activate kit modal when ACTIVATE_KIT mode is set', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');

    renderComponent({
      manageKits: true,
      preloadedState: createModalState(ACTIVATE_KIT),
    });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalled();
    });

    expect(screen.getByText('Activate kit?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'By activating this kit, it will be available to be used for future matches at a league and club level.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('shows UPDATE_KIT kit modal', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');

    renderComponent({
      manageKits: true,
      preloadedState: createModalState(UPDATE_KIT),
    });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalled();
    });

    expect(screen.queryByText('Update Kit Set')).not.toBeInTheDocument();
  });

  it('calls updateKitMatrix with archived: false when activate is confirmed', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const axiosPatchSpy = jest.spyOn(axios, 'patch');
    const { mockDispatch } = createMockDispatch();
    const user = userEvent.setup();

    renderComponent({
      manageKits: true,
      preloadedState: createModalState(ACTIVATE_KIT),
    });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalled();
    });

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(axiosPatchSpy).toHaveBeenCalledWith('/planning_hub/kit_matrices/2', {
      archived: false,
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: toastStatusEnumLike.Success,
        title: 'Kit activated.',
      },
      type: 'toasts/add',
    });
  });

  it('closes modal when cancel button is clicked', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const { mockDispatch } = createMockDispatch();
    const user = userEvent.setup();

    renderComponent({
      manageKits: true,
      preloadedState: createModalState(DEACTIVATE_KIT),
    });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalled();
    });

    expect(screen.getByText('Deactivate kit?')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { isOpen: false },
      type: 'kitManagement.slice/onToggleModal',
    });
  });

  it('shows error toast when Deactivate fails', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    jest.spyOn(axios, 'patch').mockImplementation(() => {
      throw new Error();
    });
    const { mockDispatch } = createMockDispatch();
    const user = userEvent.setup();

    renderComponent({
      manageKits: true,
      preloadedState: createModalState(DEACTIVATE_KIT),
    });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalled();
    });

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: toastStatusEnumLike.Error,
        title: "We couldn't deactivate the kit.",
      },
      type: 'toasts/add',
    });
  });

  it('shows success toast when Deactivate is successful', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const axiosPatchSpy = jest.spyOn(axios, 'patch');
    const { mockDispatch } = createMockDispatch();
    const user = userEvent.setup();

    renderComponent({
      manageKits: true,
      preloadedState: createModalState(DEACTIVATE_KIT),
    });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalled();
    });
    expect(screen.getByText('Deactivate kit?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'By deactivating this kit, it will be no longer available to be used for future matches at a league and club level.'
      )
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(axiosPatchSpy).toHaveBeenCalledWith('/planning_hub/kit_matrices/2', {
      archived: true,
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: toastStatusEnumLike.Success,
        title: 'Kit deactivated.',
      },
      type: 'toasts/add',
    });
  });

  it('calls updateKitMatrix with archived: true when Deactivate is confirmed', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const axiosPatchSpy = jest.spyOn(axios, 'patch');
    const user = userEvent.setup();

    renderComponent({
      manageKits: true,
      preloadedState: createModalState(DEACTIVATE_KIT),
    });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalled();
    });

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(axiosPatchSpy).toHaveBeenCalledWith('/planning_hub/kit_matrices/2', {
      archived: true,
    });
  });

  it('should clear the filters when the clear all button is clicked', async () => {
    const user = userEvent.setup();

    renderComponent({
      isLeague: false,
      manageKits: true,
    });
    // set search filter
    const search = screen.getByRole('textbox', { name: 'Search' });
    fireEvent.change(search, { target: { value: 'test' } });
    // set club filter
    await user.click(screen.queryByLabelText('Clubs'));
    await user.click(screen.getByText('club'));
    // set color filter
    await user.click(screen.queryByLabelText('Colors'));
    await user.click(screen.getByRole('option', { name: 'Forest Green' }));
    // set player type filter
    await user.click(screen.queryByLabelText('Types'));
    await user.click(screen.getByText('Referee'));

    // check that the filters are set
    expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('test');
    expect(screen.queryByLabelText('Clubs')).toHaveValue('club');
    expect(screen.queryByLabelText('Colors')).toHaveValue('Forest Green');
    expect(screen.queryByLabelText('Types')).toHaveValue('Referee');

    // click clear all button
    await user.click(screen.getByText('Clear'));

    // check that the filters are cleared
    expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('');
    expect(screen.queryByLabelText('Clubs')).toHaveValue('');
    expect(screen.queryByLabelText('Colors')).toHaveValue('');
    expect(screen.queryByLabelText('Types')).toHaveValue('');
  });

  describe('toast dialog', () => {
    const originalLocation = window.location;
    beforeAll(() => {
      delete window.location;
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?action=kit-management-success-toast',
        },
      });
    });
    it('renders the toast dialog when the import in progress action is present in the url', () => {
      renderComponent({
        manageKits: true,
      });

      expect(screen.getByText('Import in progress')).toBeInTheDocument();
      expect(screen.getByText('Go to imports')).toBeInTheDocument();
    });
  });
});
