import { screen } from '@testing-library/react';

import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import App from '../App';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/modules/src/PlanningHub/src/services/getEvents', () =>
  jest.fn().mockResolvedValue({
    events: [],
    next_id: null,
  })
);

describe('<App />', () => {
  const props = {
    competitions: [],
    teams: [],
    turnarounds: [],
    orgTimezone: 'Europe/Dublin',
    isGamesAdmin: true,
    canCreateGames: true,
    isTrainingSessionsAdmin: true,
    canManageWorkload: true,
    seasonMarkerRange: [],
    eventConditions: {},
  };

  const renderComponent = ({
    viewGameSchedule = false,
    leagueGameSchedule = false,
  }) => {
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          viewGameSchedule,
        },
      },
    });

    usePreferences.mockReturnValue({
      preferences: {
        league_game_schedule: leagueGameSchedule,
      },
    });

    return renderWithRedux(<App {...props} />, {
      preloadedState: {},
      useGlobalStore: true,
    });
  };

  describe('basic rendering', () => {
    it('renders the app component', () => {
      renderComponent({
        viewGameSchedule: false,
        leagueGameSchedule: false,
      });
      expect(screen.getByText('Planning')).toBeInTheDocument();
    });
  });

  describe('Match day management schedule', () => {
    it('renders EventsScheduleGrid when isViewGameSchedule is true and permissions allow viewing game schedule', () => {
      renderComponent({
        viewGameSchedule: true,
        leagueGameSchedule: true,
      });
      expect(screen.getByText(/Planning/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search by match #')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search by match day')
      ).toBeInTheDocument();
    });

    it('does not render DmrFilters when permissions do not allow viewing game schedule', () => {
      renderComponent({
        viewGameSchedule: false,
        leagueGameSchedule: true,
      });
      expect(
        screen.queryByPlaceholderText('Search by match #')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByPlaceholderText('Search by match day')
      ).not.toBeInTheDocument();
    });
  });

  describe('event filters rendering', () => {
    it('renders event filters when not using league game schedule', () => {
      renderComponent({
        viewGameSchedule: false,
        leagueGameSchedule: false,
      });

      // The EventFilters component should be rendered and it contains filter elements
      expect(screen.getAllByText('Events')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Competition')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Game day')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Opposition')[0]).toBeInTheDocument();
    });
  });
});
