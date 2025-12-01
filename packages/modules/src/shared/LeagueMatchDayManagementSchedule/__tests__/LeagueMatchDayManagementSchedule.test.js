import { screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import * as redux from 'react-redux';
import * as clubsApi from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import * as officialsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import * as tvChannelsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/tvChannelsApi';
import * as competitionsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import LeagueMatchDayManagementSchedule from '..';

jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/hooks/useSquadScopedPersistentState');

const user = userEvent.setup();

describe('LeagueMatchDayManagementSchedule', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
  };

  const defaultPreferences = {
    manageLeagueGame: false,
  };

  const renderComponent = ({
    manageGameInformation,
    canCreateImports = false,
    isLeague = false,
    isOrgSupervised = false,
    isOfficial = false,
    preferences = defaultPreferences,
  } = {}) => {
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          manageGameInformation,
        },
        settings: {
          canCreateImports,
        },
      },
    });
    useLeagueOperations.mockReturnValue({
      isLeague,
      isOrgSupervised,
      isOfficial,
    });

    usePreferences.mockReturnValue({
      preferences: {
        manage_league_game: preferences.manageLeagueGame,
      },
    });

    renderWithRedux(
      <LocalizationProvider>
        <LeagueMatchDayManagementSchedule {...defaultProps} />
      </LocalizationProvider>,
      {
        preloadedState: {},
        useGlobalStore: true,
      }
    );
  };
  beforeEach(() => {
    jest.spyOn(redux, 'useDispatch');

    jest.spyOn(competitionsApi, 'useGetCompetitionsQuery').mockReturnValue({
      data: [],
    });
    jest.spyOn(clubsApi, 'useGetClubsQuery').mockReturnValue({
      data: [],
    });
    jest.spyOn(clubsApi, 'useGetClubSquadsQuery').mockReturnValue({
      data: [],
    });
    jest.spyOn(officialsApi, 'useGetOfficialUsersQuery').mockReturnValue({
      data: [],
    });
    jest.spyOn(tvChannelsApi, 'useGetTvChannelsQuery').mockReturnValue({
      data: [],
    });

    window.featureFlags = { 'league-game-mass-game-upload': true };

    // Reset the mock to default values before each test
    useLeagueOperations.mockReturnValue({
      isLeague: false,
      isOrgSupervised: false,
      isOfficial: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.featureflags = {};
  });

  describe('render', () => {
    it('renders out the dmr/dmn schedule header with the appropriate filters', async () => {
      renderComponent();
      await waitFor(() =>
        expect(screen.getByText('Schedule')).toBeInTheDocument()
      );
      expect(
        screen.getByPlaceholderText('Search by match #')
      ).toBeInTheDocument();
      expect(screen.getByText('Clubs')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search by match day')
      ).toBeInTheDocument();
    });

    it('renders out the dmr/dmn schedule table headers', async () => {
      renderComponent();
      await waitFor(() => expect(screen.getByText('Home')).toBeInTheDocument());
      expect(screen.getByText('Away')).toBeInTheDocument();
      expect(screen.getByText('Match Day')).toBeInTheDocument();
      expect(screen.getByText('Match #')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Kick Time')).toBeInTheDocument();
      expect(screen.getByText('Countdown')).toBeInTheDocument();
    });

    it('opens create fixture drawer if manageGameInformation and the manage_league_team preference is true', async () => {
      renderComponent({
        manageGameInformation: true,
        preferences: { manageLeagueGame: true },
      });
      const headerTooltipMenu = screen.getByRole('button', { name: '' });
      await user.click(headerTooltipMenu);
      await user.click(screen.getByText('Create Fixture'));
      expect(screen.getAllByText('Create Fixture')).toHaveLength(2);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });
  describe('Mass Upload Button', () => {
    it('shows mass upload button when user has correct permissions', async () => {
      renderComponent({
        canCreateImports: true,
        isLeague: true,
        isOrgSupervised: false,
        isOfficial: false,
        manageGameInformation: true,
      });

      await waitFor(() =>
        expect(screen.getByText('Assign Officials')).toBeInTheDocument()
      );
    });

    it('renders download CSV template button when user has correct permissions', async () => {
      renderComponent({
        manageGameInformation: true,
        canCreateImports: true,
        isLeague: true,
        preferences: { manageLeagueGame: true },
      });

      const headerTooltipMenu = screen.getByRole('button', { name: '' });
      await user.click(headerTooltipMenu);

      expect(screen.getByText('Game template csv')).toBeInTheDocument();
    });

    it('hides mass upload button when user is not in league context', async () => {
      renderComponent({ isLeague: false, manageGameInformation: true });

      await waitFor(() =>
        expect(screen.queryByText('Assign Officials')).not.toBeInTheDocument()
      );
    });

    it('hides mass upload button when user lacks import permissions', async () => {
      renderComponent({
        canCreateImports: false,
        manageGameInformation: true,
      });

      await waitFor(() =>
        expect(screen.queryByText('Assign Officials')).not.toBeInTheDocument()
      );
    });

    it('hides mass upload button when org is supervised', async () => {
      renderComponent({
        canCreateImports: true,
        isOrgSupervised: true,
        manageGameInformation: true,
      });

      await waitFor(() =>
        expect(screen.queryByText('Assign Officials')).not.toBeInTheDocument()
      );
    });
  });
});
