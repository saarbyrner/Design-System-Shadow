import * as redux from 'react-redux';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getDefaultErrorTextEnumLike,
  getEquipmentsEnumLike,
  getPlayerTypesEnumLike,
} from '@kitman/modules/src/KitMatrix/shared/utils';
import mockLeagueSeasons from '@kitman/services/src/services/kitMatrix/getLeagueSeasons/mock';
import { useSearchOrganisationDivisionListQuery } from '@kitman/modules/src/SquadManagement/src/shared/services/squadManagement';
import {
  useUpdateKitMatrixMutation,
  useCreateKitMatrixMutation,
  useGetLeagueSeasonsQuery,
} from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import { useGetKitMatrixColorsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/kitMatrixColorsApi';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import colors from '@kitman/common/src/variables/colors';
import AddKitMatrixDrawer from '../AddKitMatrixDrawer';

jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi');
jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/kitMatrixColorsApi');
jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi');
jest.mock(
  '@kitman/modules/src/SquadManagement/src/shared/services/squadManagement'
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: jest.fn(),
  getState: () => state,
});

const defaultStore = storeFake({
  global: {
    useUpdateKitMatrixMutation: jest.fn(),
  },
});
const kitData = {
  data: {
    id: 1,
    type: 'player',
    organisation: {
      id: 1234,
      name: 'Club',
    },
    squad_ids: [],
    name: 'new value',
    color: 'ff0000',
    jersey: {
      colorId: 1,
      colorName: 'Blue Navy',
      image: {
        url: 'aGVsbG8=',
        name: 'image1.png',
        type: 'image/png',
      },
    },
    shorts: {
      colorId: 2,
      colorName: 'Pinky Pink',
      image: {
        url: 'aGVsbG8=',
        name: 'image2.png',
        type: 'image/png',
      },
    },
    socks: {
      colorId: 3,
      colorName: 'Forest green',
      image: {
        url: 'aGVsbG8=',
        name: 'image3.png',
        type: 'image/png',
      },
    },
    division: {
      id: 1,
      name: 'MLS Next',
    },
    league_season: {
      id: 1,
      name: '24/25 Season',
    },
  },
};
const playerTypes = getPlayerTypesEnumLike();
const equipmentsEnum = getEquipmentsEnumLike();
const defaultErrorTextEnum = getDefaultErrorTextEnumLike();

const onSave = jest.fn();
const onClose = jest.fn();
const defaultProps = { onSave, onClose, isOpen: true };

const renderComponent = (props = {}) => {
  return renderWithRedux(<AddKitMatrixDrawer {...defaultProps} {...props} />, {
    preloadedState: defaultStore,
    useGlobalStore: false,
  });
};

describe('AddKitMatrixDrawer', () => {
  beforeEach(() => {
    useUpdateKitMatrixMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false },
    ]);
    useCreateKitMatrixMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false },
    ]);
    useSearchOrganisationDivisionListQuery.mockReturnValue({
      data: [
        { id: 1, name: 'MLS Next' },
        { id: 2, name: 'LOI' },
      ],
      isFetching: false,
    });
    useGetKitMatrixColorsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Blue Navy' },
        { id: 2, name: 'Pinky Pink' },
        { id: 3, name: 'Forest Green' },
      ],
      isFetching: false,
    });
    useGetClubsQuery.mockReturnValue({
      data: [{ id: 1234, name: 'club' }],
      isFetching: false,
    });
    useGetLeagueSeasonsQuery.mockReturnValue({
      data: mockLeagueSeasons,
      isFetching: false,
    });
  });

  const fillForm = async (user) => {
    // Select a division
    await user.click(screen.getByLabelText('League'));
    await user.click(screen.getByText('MLS Next'));

    // Select type "Player"
    await user.click(screen.getByLabelText('Type'));
    await user.click(screen.getByText(playerTypes.player.label));

    // Select a club
    await user.click(screen.getByLabelText('Club'));
    await user.click(screen.getByText('club'));

    // Give the kit a name
    const kitName = screen.getByLabelText('Kit Name');
    const newValue = 'new value';
    fireEvent.change(kitName, { target: { value: newValue } });

    // Choose the kit color
    const colorPicker = screen.getByTestId('color-picker');
    const inputColor = colorPicker.querySelector('input[type="color"]');
    fireEvent.change(inputColor, { target: { value: colors.red_100 } });

    // Jersey, Shorts, Socks
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    // Jersey
    await user.click(screen.queryAllByLabelText('Color')[0]);
    await user.click(screen.getByText('Blue Navy'));
    await user.upload(screen.getByTestId('jersey-upload'), file);

    // Shorts
    await user.click(screen.queryAllByLabelText('Color')[1]);
    await user.click(screen.getByText('Pinky Pink'));
    await user.upload(screen.getByTestId('shorts-upload'), file);

    // Socks
    await user.click(screen.queryAllByLabelText('Color')[2]);
    await user.click(screen.getByText('Forest Green'));
    await user.upload(screen.getByTestId('socks-upload'), file);
  };

  const updateForm = async (user) => {
    // Select type "Referee"
    await user.click(screen.getByLabelText('Type'));
    await user.click(screen.getByText(playerTypes.referee.label));

    // Update the kit a name
    const kitName = screen.getByLabelText('Kit Name');
    const newValue = '2';
    fireEvent.change(kitName, { target: { value: newValue } });

    // Update Jersey color
    await user.click(screen.getByLabelText('Blue Navy'));
    await user.click(screen.getAllByText('Forest Green').reverse()[0]);
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByRole('heading', 'Add Kit Matrix')).toBeInTheDocument();
    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
    expect(screen.getByText('League')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getAllByText('Kit Name')).toHaveLength(2);
    expect(screen.getByText('Kit color')).toBeInTheDocument();
    expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    expect(screen.getByText(equipmentsEnum.jersey.label)).toBeInTheDocument();
    expect(screen.getByText(equipmentsEnum.shorts.label)).toBeInTheDocument();
    expect(screen.getByText(equipmentsEnum.socks.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('calls onClose on cancel', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when click on close icon', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByTestId('CloseIcon'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays error message correctly when submitting invalid form', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText(defaultErrorTextEnum.type)).toBeInTheDocument();
    expect(screen.getByText(defaultErrorTextEnum.name)).toBeInTheDocument();
    expect(screen.getByText(defaultErrorTextEnum.color)).toBeInTheDocument();
    expect(
      screen.getAllByText(defaultErrorTextEnum.equipmentColor)
    ).toHaveLength(3);
    expect(
      screen.getAllByText(defaultErrorTextEnum.unsupportedFile)
    ).toHaveLength(3);
    expect(screen.getByText(defaultErrorTextEnum.division)).toBeInTheDocument();
  });

  it('displays an error when club is missing for "player" type', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByLabelText('Type'));
    await user.click(screen.getByText(playerTypes.player.label));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(
      screen.getByText(defaultErrorTextEnum.organisation)
    ).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('displays an error when club is missing for "goalkeeper" type', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByLabelText('Type'));
    await user.click(screen.getByText(playerTypes.goalkeeper.label));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      screen.getByText(defaultErrorTextEnum.organisation)
    ).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  describe('[CREATE]', () => {
    it('calls onSave when click on save when form is valid', async () => {
      const user = userEvent.setup();
      const mockCreateKitMatrixMutation = jest.fn().mockResolvedValue({});
      const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      const mockDispatch = jest.fn();
      useDispatchSpy.mockReturnValue(mockDispatch);

      useCreateKitMatrixMutation.mockReturnValue([
        mockCreateKitMatrixMutation,
        { isLoading: false },
      ]);

      renderComponent();

      await fillForm(user);

      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(mockCreateKitMatrixMutation).toHaveBeenCalledWith({
        kind: 'player',
        organisation_id: 1234,
        squad_ids: [],
        name: 'new value',
        primary_color: 'c31d2b',
        division_id: 1,
        league_season_id: undefined,
        kit_matrix_items: [
          {
            kind: 'jersey',
            kit_matrix_color_id: 1,
            attachment: {
              url: 'aGVsbG8=',
              name: 'hello.png',
              type: 'image/png',
            },
          },
          {
            kind: 'shorts',
            kit_matrix_color_id: 2,
            attachment: {
              url: 'aGVsbG8=',
              name: 'hello.png',
              type: 'image/png',
            },
          },
          {
            kind: 'socks',
            kit_matrix_color_id: 3,
            attachment: {
              url: 'aGVsbG8=',
              name: 'hello.png',
              type: 'image/png',
            },
          },
        ],
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          status: 'SUCCESS',
          title: 'Kit created.',
        },
        type: 'toasts/add',
      });
    });

    it('display an error message when the submission fails', async () => {
      const user = userEvent.setup();
      const mockCreateKitMatrixMutation = jest
        .fn()
        .mockRejectedValue(new Error('API Error'));
      const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      const mockDispatch = jest.fn();
      useDispatchSpy.mockReturnValue(mockDispatch);

      useCreateKitMatrixMutation.mockReturnValue([
        mockCreateKitMatrixMutation,
        { isLoading: false },
      ]);

      renderComponent();

      await fillForm(user);

      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onSave).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          status: 'ERROR',
          title: 'Something went wrong while creating your kit.',
        },
        type: 'toasts/add',
      });
    });

    it('display an error message when the season is not selected', async () => {
      window.setFlag('league-ops-kit-management-v2', true);
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(
        screen.getByText(defaultErrorTextEnum.league_season)
      ).toBeInTheDocument();
    });
  });

  describe('[UPDATE]', () => {
    it('calls onSave when click on save when form is valid', async () => {
      const user = userEvent.setup();
      const mockUpdateKitMatrixMutation = jest.fn().mockResolvedValue({});
      const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      const mockDispatch = jest.fn();
      useDispatchSpy.mockReturnValue(mockDispatch);

      useUpdateKitMatrixMutation.mockReturnValue([
        mockUpdateKitMatrixMutation,
        { isLoading: false },
      ]);

      renderComponent(kitData);
      expect(
        screen.getByRole('heading', 'Update Kit Matrix')
      ).toBeInTheDocument();

      await updateForm(user);

      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(mockUpdateKitMatrixMutation).toHaveBeenCalledWith({
        id: 1,
        updates: {
          kind: 'referee',
          organisation_id: undefined,
          squad_ids: [],
          name: '2',
          primary_color: 'f0000',
          league_season_id: 1,
          division_id: 1,
          kit_matrix_items: [
            {
              kind: 'jersey',
              kit_matrix_color_id: 3,
              attachment: {
                url: undefined,
                name: 'image1.png',
                type: 'image/png',
              },
            },
            {
              kind: 'shorts',
              kit_matrix_color_id: 2,
              attachment: {
                url: undefined,
                name: 'image2.png',
                type: 'image/png',
              },
            },
            {
              kind: 'socks',
              kit_matrix_color_id: 3,
              attachment: {
                url: undefined,
                name: 'image3.png',
                type: 'image/png',
              },
            },
          ],
        },
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          status: 'SUCCESS',
          title: 'Kit updated.',
        },
        type: 'toasts/add',
      });
    });
    it('display an error message when the submission fails', async () => {
      const user = userEvent.setup();
      const mockUpdateKitMatrixMutation = jest
        .fn()
        .mockRejectedValue(new Error('API Error'));
      const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      const mockDispatch = jest.fn();
      useDispatchSpy.mockReturnValue(mockDispatch);

      useUpdateKitMatrixMutation.mockReturnValue([
        mockUpdateKitMatrixMutation,
        { isLoading: false },
      ]);

      renderComponent(kitData);

      await updateForm(user);

      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onClose).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          status: 'ERROR',
          title: 'Something went wrong while updating your kit.',
        },
        type: 'toasts/add',
      });
    });
  });

  it('displays the club select when "player" is selected from the type selector', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByLabelText('Type'));

    const option = screen.getByText(playerTypes.player.label);
    await user.click(option);
    expect(screen.getByLabelText('Club')).toBeInTheDocument();
  });

  it('displays the club select when "goalkeeper" is selected from the type selector', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByLabelText('Type'));

    const option = screen.getByText(playerTypes.goalkeeper.label);
    await user.click(option);
    expect(screen.getByLabelText('Club')).toBeInTheDocument();
  });

  it('displays the club select when "referee" is selected from the type selector', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByLabelText('Type'));
    const option = screen.getByText(playerTypes.referee.label);
    await user.click(option);
    expect(
      screen.queryByRole('button', { name: 'Club' })
    ).not.toBeInTheDocument();
  });

  describe('[FEATURE FLAG] league-ops-kit-management-v2', () => {
    beforeEach(() => {
      window.setFlag('league-ops-kit-management-v2', true);
    });

    afterEach(() => {
      window.setFlag('league-ops-kit-management-v2', false);
    });

    it('renders the season select when the feature flag is on', () => {
      renderComponent();
      expect(screen.getByLabelText('Season added')).toBeInTheDocument();
    });
    it('does not render the season select when the feature flag is off', () => {
      window.setFlag('league-ops-kit-management-v2', false);
      renderComponent();
      expect(screen.queryByLabelText('Season added')).not.toBeInTheDocument();
    });

    it('renders the upload component when the feature flag is on', () => {
      renderComponent();
      expect(screen.getByTestId('jersey-upload')).toBeInTheDocument();
      expect(screen.getByTestId('shorts-upload')).toBeInTheDocument();
      expect(screen.getByTestId('socks-upload')).toBeInTheDocument();
    });

    it('renders the image preview component when the feature flag is on', () => {
      renderComponent(kitData);
      // Check that QueuedItem preview components are rendered for each equipment
      expect(screen.getByText('image1.png')).toBeInTheDocument();
      expect(screen.getByText('image2.png')).toBeInTheDocument();
      expect(screen.getByText('image3.png')).toBeInTheDocument();

      // check the buttons are rendered for each equipment
      expect(screen.getAllByText('View')).toHaveLength(3);
      expect(screen.getAllByTestId('CheckCircleIcon')).toHaveLength(3);
      expect(screen.getAllByTestId('DeleteIcon')).toHaveLength(3);
    });

    it('renders dialog when the View button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent(kitData);
      // check the image is rendered
      expect(screen.getByText('image1.png')).toBeInTheDocument();

      await user.click(screen.getAllByText('View')[0]);
      // check the image name is rendered twice, once in the preview and once in the dialog
      expect(screen.getAllByText('image1.png')).toHaveLength(2);
    });

    it('removes the image when the Delete button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent(kitData);

      // check the image is rendered
      expect(screen.queryByText('image1.png')).toBeInTheDocument();

      expect(screen.getAllByTestId('DeleteIcon')).toHaveLength(3);
      await user.click(screen.getAllByTestId('DeleteIcon')[0]);
      // check the image is removed
      expect(screen.queryByText('image1.png')).not.toBeInTheDocument();
    });
  });
});
