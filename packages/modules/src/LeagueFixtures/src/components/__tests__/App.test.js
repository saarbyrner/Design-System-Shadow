import {
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { axios } from '@kitman/common/src/utils/services';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { rest, server } from '@kitman/services/src/mocks/server';
import {
  mockSchedule,
  mockOfficials,
} from '@kitman/modules/src/LeagueFixtures/__tests__/testScheduleData';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import App from '../App';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<App />', () => {
  const defaultPreferences = {
    leagueGameSchedule: false,
    matchMonitor: false,
    isPreferencesSuccess: true,
  };
  const renderComponent = ({
    isLeague = false,
    isLeagueStaffUser = false,
    viewGameSchedule = {},
    preferences = defaultPreferences,
    canRunLeagueExports = false,
    permissionsStatus = 'SUCCESS',
  }) => {
    useLeagueOperations.mockReturnValue({
      isLeague,
      isLeagueStaffUser,
      organisationId: 1,
    });

    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          viewGameSchedule,
        },
        matchMonitor: {
          viewMatchMonitorReport: true,
          manageMatchMonitorReport: true,
        },
        settings: {
          canRunLeagueExports,
        },
      },
      permissionsRequestStatus: permissionsStatus,
    });

    usePreferences.mockReturnValue({
      preferences: {
        league_game_schedule: preferences.leagueGameSchedule,
        match_monitor: preferences.matchMonitor,
      },
      isPreferencesSuccess: preferences.isPreferencesSuccess,
    });

    return renderWithRedux(<App />);
  };

  beforeEach(() => {
    server.use(
      rest.post('/planning_hub/events/search', (req, res, ctx) => {
        return res(ctx.json(mockSchedule));
      }),
      rest.get('/users/official_only', (req, res, ctx) => {
        return res(ctx.json(mockOfficials));
      }),
      rest.post('/settings/additional_users/search', (req, res, ctx) => {
        return res(ctx.json({ data: mockOfficials }));
      })
    );
    useEventTracking.mockReturnValue({
      trackEvent: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when the preferences are not loaded', () => {
    renderComponent({ preferences: { isPreferencesSuccess: false } });
    expect(screen.queryByTestId('FixtureScheduleView')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('DelayedLoadingFeedback')
    ).not.toBeInTheDocument();
  });

  it('does not render properly when permissions are not loaded', () => {
    renderComponent({ permissionsStatus: 'FAILED' });
    expect(screen.queryByTestId('FixtureScheduleView')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('DelayedLoadingFeedback')
    ).not.toBeInTheDocument();
  });

  it('renders correctly', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/league-fixtures',
        href: 'http://localhost',
      },
    });
    renderComponent({});
    expect(screen.getByTestId('FixtureScheduleView')).toBeInTheDocument();
    expect(screen.queryByTestId('MatchReport')).not.toBeInTheDocument();
  });

  it('renders match report', () => {
    window.location.pathname = '/league-fixtures/reports/123';
    renderComponent({});
    expect(screen.queryByTestId('FixtureScheduleView')).not.toBeInTheDocument();
    expect(screen.getByTestId('MatchReport')).toBeInTheDocument();
  });

  describe('Scout access management flow render', () => {
    it('renders match requests', async () => {
      window.location.pathname = '/league-fixtures/requests/123';
      renderComponent({});
      expect(
        screen.queryByTestId('FixtureScheduleView')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );
      expect(screen.getByTestId('MatchRequests')).toBeInTheDocument();
    });
  });

  describe('Match day management flow render', () => {
    beforeEach(() => {
      window.location.pathname = '/league-fixtures';
    });

    it('renders the dmn dmr schedule area, when preference and permissions are enabled', () => {
      renderComponent({
        isLeagueStaffUser: true,
        viewGameSchedule: true,
        preferences: { ...defaultPreferences, leagueGameSchedule: true },
      });

      expect(screen.getByText('Schedule')).toBeInTheDocument();
      expect(screen.getByText('DMR')).toBeInTheDocument();
    });
  });

  describe('MUI Data Grid League Fixtures', () => {
    it('renders the assign staff panel and fires off a assignment of an official', async () => {
      const axiosPutSpy = jest.spyOn(axios, 'put');
      const user = userEvent.setup();
      renderComponent({
        isLeague: true,
        isLeagueStaffUser: true,
      });
      await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

      await user.click(screen.getByText('KL Galaxy'));
      selectEvent.openMenu(screen.getByRole('textbox'));

      await selectEvent.select(screen.getByRole('textbox'), 'Michael Hackart');

      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(axiosPutSpy).toHaveBeenCalledWith(
          '/planning_hub/events/2695415/game_officials/bulk_save',
          { game_officials: [{ official_id: 235723 }] }
        );
      });
    });

    it('renders the assign staff panel and fires off a assignment of an match monitor', async () => {
      const axiosPostSpy = jest.spyOn(axios, 'post');
      const user = userEvent.setup();
      renderComponent({
        isLeague: true,
        isLeagueStaffUser: true,
        preferences: { ...defaultPreferences, matchMonitor: true },
      });
      await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

      await user.click(screen.getByText('KL Galaxy'));

      expect(screen.getByText('Assign match monitor')).toBeInTheDocument();
      await user.click(
        screen.getByRole('combobox', { name: /match monitor/i })
      );
      await user.click(screen.getByText('Michael Hackart'));

      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(axiosPostSpy).toHaveBeenCalledWith(
          '/planning_hub/events/2695415/game_match_monitors',
          { match_monitor_ids: [235723] }
        );
      });
    });
  });
});
