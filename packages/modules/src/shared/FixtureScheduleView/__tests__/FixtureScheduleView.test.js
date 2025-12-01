import $ from 'jquery';
import * as redux from 'react-redux';
import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
  act,
} from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { rest, server } from '@kitman/services/src/mocks/server';
import { axios } from '@kitman/common/src/utils/services';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import FixtureScheduleView from '../index';
import { mockGame as game } from './mockFixtureGame';

jest.useFakeTimers();
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/hooks/useLocationAssign');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('lodash/debounce', () => jest.fn((fn) => fn));
jest.mock('@kitman/common/src/hooks/useSquadScopedPersistentState');
jest.mock('@kitman/common/src/hooks/useEventTracking');
describe('<FixtureScheduleView />', () => {
  const onToggleEventMock = jest.fn();
  const redirect = jest.fn();
  const mockToastDispatch = jest.fn();
  let mockDispatch;
  let useDispatchSpy;

  const defaultPreferences = {
    leagueGameSchedule: false,
    matchMonitor: false,
    leagueGameTeam: false,
    manageLeagueGame: false,
    accessRequestLimitations: false,
    scoutAccessManagement: false,
  };

  const mockedPermissionsContextValue = {
    permissions: {
      settings: {
        canCreateImports: true,
        canViewImports: true,
      },
      scoutAccessManagement: {
        canManageScoutAccess: false,
        canViewScoutFixtures: true,
      },
      leagueGame: {
        viewMatchReport: true,
        manageMatchReport: true,
        manageGameInformation: true,
      },
      matchMonitor: {
        viewMatchMonitorReport: true,
        manageMatchMonitorReport: true,
      },
    },
    permissionsRequestStatus: 'SUCCESS',
  };

  const swapPermissions = (permissions) => {
    return {
      ...mockedPermissionsContextValue,
      permissions: {
        ...mockedPermissionsContextValue.permissions,
        ...permissions,
      },
    };
  };

  const renderComponent = ({
    isLeague = false,
    isOfficial = false,
    isMatchMonitor = false,
    isScout = false,
    isOrgSupervised = false,
    organisationId = 37,
    permissionsContext = mockedPermissionsContextValue,
    preferences = defaultPreferences,
  } = {}) => {
    useLocationAssign.mockReturnValue(redirect);
    useLeagueOperations.mockReturnValue({
      isLeague,
      isOfficial,
      isScout,
      isMatchMonitor,
      isOrgSupervised,
      organisationId,
      isLeagueStaffUser: isOfficial || isLeague || isMatchMonitor || isScout,
    });

    usePreferences.mockReturnValue({
      preferences: {
        league_game_schedule: preferences.leagueGameSchedule,
        match_monitor: preferences.matchMonitor,
        league_game_team: preferences.leagueGameTeam,
        manage_league_game: preferences.manageLeagueGame,
        access_request_limitations: preferences.accessRequestLimitations,
        scout_access_management: preferences.scoutAccessManagement,
      },
    });

    return renderWithRedux(
      <MockedPermissionContextProvider permissionsContext={permissionsContext}>
        <FixtureScheduleView
          t={i18nextTranslateStub()}
          onToggleEvent={onToggleEventMock}
          toastDispatch={mockToastDispatch}
        />
      </MockedPermissionContextProvider>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2021-10-10'));
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
    window.setFlag('lops-grid-filter-enhancements', true);
    useEventTracking.mockReturnValue({
      trackEvent: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.setFlag('lops-grid-filter-enhancements', false);
  });

  describe('populated data', () => {
    beforeEach(() => {
      server.use(
        rest.post('/planning_hub/events/search', (req, res, ctx) => {
          return res(
            ctx.json({
              events: [game],
              next_id: null,
            })
          );
        }),
        rest.get('/ui/planning_hub/game_statuses', (req, res, ctx) => {
          return res(
            ctx.json({
              'Awaiting Officials': 'awaiting_officials',
              'Awaiting Rosters': 'awaiting_rosters',
            })
          );
        }),
        rest.get('/ui/squads/age_groups', (req, res, ctx) => {
          return res(ctx.json(['U13', 'U14', 'U15', 'U16', 'U17', 'U19']));
        })
      );
    });

    it('renders correctly', async () => {
      const { container } = renderComponent({ isLeague: true });
      await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

      expect(screen.getByText('Schedule')).toBeInTheDocument();
      const filters = within(container.querySelector('.filters'));
      expect(filters.getByLabelText('Search fixtures')).toBeInTheDocument();
      const dateRangeInput = screen.getByLabelText('Date range');
      expect(dateRangeInput).toHaveValue('Sep 30, 2021 - Oct 20, 2021');
      expect(filters.getByLabelText('Squad')).toBeInTheDocument();
      expect(filters.getByLabelText('Clubs')).toBeInTheDocument();
      expect(filters.getByLabelText('Competitions')).toBeInTheDocument();
      expect(filters.getByLabelText('Status')).toBeInTheDocument();

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Score')).toBeInTheDocument();
      expect(screen.getByText('Away')).toBeInTheDocument();
      expect(screen.getByText('Match ID')).toBeInTheDocument();
      expect(screen.getAllByText('Squad').length).toEqual(3);
      expect(screen.getByText('Competition')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Location / Pitch')).toBeInTheDocument();
      expect(screen.getAllByText('Status').length).toEqual(3);

      expect(screen.getByText('Manchester United')).toBeInTheDocument();
      expect(screen.getByText('9 : 0')).toBeInTheDocument();
      expect(screen.getByText('Chelsea')).toBeInTheDocument();
      expect(screen.getByText('mls-12324')).toBeInTheDocument();
      expect(screen.getByText('U19')).toBeInTheDocument();
      expect(screen.getByText('16 Oct, Sat')).toBeInTheDocument();
      expect(screen.getByText('12:02 pm (Europe/Dublin)')).toBeInTheDocument();
      expect(screen.getByText('Dublin')).toBeInTheDocument();
      expect(screen.getByText('Awaiting officials')).toBeInTheDocument();

      // No match monitor column because the preference is false
      expect(
        screen.queryByText('Match Monitor Attendees')
      ).not.toBeInTheDocument();
    });

    it('expects the competitions endpoint to be called with all competitions when the user is not a league staff user', () => {
      const axiosGetSpy = jest.spyOn(axios, 'get');
      renderComponent({});
      expect(axiosGetSpy).toHaveBeenCalledWith('/competitions', {
        headers: { Accept: 'application/json' },
        params: { all: true },
      });
    });

    describe('as a league user', () => {
      it('shows the menu icon', async () => {
        renderComponent({
          isLeague: true,
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        expect(screen.getByRole('menuitem')).toBeInTheDocument();
      });

      it('calls onToggleEvent on row click', async () => {
        const user = userEvent.setup();
        renderComponent({ isLeague: true });

        expect(screen.getByText('Schedule')).toBeInTheDocument();
        expect(screen.getByRole('grid')).toBeInTheDocument();

        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

        await waitFor(() => user.click(screen.getAllByRole('cell')[0]));

        expect(onToggleEventMock).toHaveBeenCalledWith(game);
      });

      it('shows the mass assign officials button', () => {
        renderComponent({ isLeague: true });
        expect(screen.getByText('Assign Officials')).toBeInTheDocument();
      });

      it('redirects to the match report on view match report click', async () => {
        const user = userEvent.setup();
        renderComponent({
          isLeague: true,
          permissionsContext: swapPermissions({
            leagueGame: {
              ...mockedPermissionsContextValue.leagueGame,
              viewMatchReport: true,
            },
          }),
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByRole('menuitem')));
        await waitFor(() => user.click(screen.getByText('View match report')));
        expect(redirect).toHaveBeenCalledWith('/league-fixtures/reports/1');
      });

      it('redirects to the digital match roster on view match roster click when the league_game_team preference is on', async () => {
        const user = userEvent.setup();
        renderComponent({
          isLeague: true,
          preferences: { ...defaultPreferences, leagueGameTeam: true },
          permissionsContext: swapPermissions({
            leagueGame: {
              ...mockedPermissionsContextValue.leagueGame,
              manageGameTeam: true,
            },
          }),
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByRole('menuitem')));
        await waitFor(() => user.click(screen.getByText('View match roster')));
        expect(redirect).toHaveBeenCalledWith('/planning_hub/events/1');
      });

      it('hides "Unlock match report" when the match report is not submitted', async () => {
        const user = userEvent.setup();
        renderComponent({
          isLeague: true,
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByRole('menuitem')));
        expect(
          screen.queryByText('Unlock match report')
        ).not.toBeInTheDocument();
      });

      it('shows "Unlock match report" for submitted match report', async () => {
        const user = userEvent.setup();
        const postRequest = jest.spyOn(axios, 'post');
        server.use(
          rest.post('/planning_hub/events/search', (req, res, ctx) => {
            return res(
              ctx.json({
                events: [
                  {
                    ...game,
                    match_report_submitted_by_id: 123,
                  },
                ],
                next_id: null,
              })
            );
          }),
          rest.post(
            '/planning_hub/events/:eventId/unlock_report',
            (req, res, ctx) => {
              return res(ctx.json({}));
            }
          )
        );
        renderComponent({
          isLeague: true,
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByRole('menuitem')));

        expect(screen.getByText('Unlock match report')).toBeInTheDocument();
        await waitFor(() =>
          user.click(screen.getByText('Unlock match report'))
        );

        expect(screen.getByText('Unlock match report?')).toBeInTheDocument();
        expect(
          screen.getByText(
            'If you unlock this report, the report will become editable for the assigned officials.'
          )
        ).toBeInTheDocument();

        await waitFor(() => user.click(screen.getByText('Unlock')));

        await waitFor(() => {
          expect(postRequest).toHaveBeenCalledTimes(1);
          expect(postRequest).toHaveBeenCalledWith(
            '/planning_hub/events/1/unlock_report'
          );
        });
      });

      it('shows the reset match report button and fires off the api call when clicked and confirmed', async () => {
        const user = userEvent.setup();
        renderComponent({
          isLeague: true,
        });

        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

        await waitFor(() => {
          expect(screen.getByRole('menuitem')).toBeInTheDocument();
        });
        await waitFor(() => user.click(screen.getByRole('menuitem')));
        expect(screen.getByText('Reset match report')).toBeInTheDocument();
        await waitFor(() => user.click(screen.getByText('Reset match report')));

        expect(screen.getByText('Reset match report?')).toBeInTheDocument();
        expect(
          screen.getByText(
            'If you reset this report, the report will revert to its initial default state.'
          )
        ).toBeInTheDocument();

        await waitFor(() => user.click(screen.getByText('Reset')));
        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledWith({
            payload: {
              status: 'SUCCESS',
              title: 'Match report reset.',
            },
            type: 'toasts/add',
          });
        });
      });

      it('filters by game status', async () => {
        const getEventMock = jest.spyOn($, 'ajax');
        renderComponent({ isLeague: true });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

        const statusFilter = screen.getByLabelText('Status', {
          selector: 'input',
        });

        expect(statusFilter).toBeInTheDocument();

        expect(screen.getByText('Awaiting officials')).toBeInTheDocument();

        server.use(
          rest.post('/planning_hub/events/search', (req, res, ctx) => {
            return res(
              ctx.json({
                events: [
                  {
                    ...game,
                    id: 2,
                    game_status: 'awaiting_rosters',
                  },
                ],
                next_id: null,
              })
            );
          })
        );
        getEventMock.mockReset();
        fireEvent.change(statusFilter, {
          target: { value: 'Awaiting Rosters' },
        });
        expect(screen.getByText('Awaiting Rosters')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Awaiting Rosters'));

        expect(
          screen.queryByText('Awaiting officials')
        ).not.toBeInTheDocument();
        expect(statusFilter).toHaveValue('Awaiting Rosters');

        expect(getEventMock).toHaveBeenCalledWith({
          contentType: 'application/json',
          data: JSON.stringify({
            date_range: {
              start_date: '2021-09-30T00:00:00+00:00',
              end_date: '2021-10-20T23:59:59+00:00',
            },
            event_types: ['game_event'],
            competitions: [],
            game_days: [],
            oppositions: [],
            search_expression: '',
            include_game_status: true,
            next_id: null,
            squad_names: [],
            statuses: ['awaiting_rosters'],
            organisations: [],
            supervisor_view: false,
            start_time_asc: true,
            recurring_events: false,
            include_user_event_requests_counts: false,
            round_number: '',
            include_division: true,
          }),
          method: 'POST',
          url: '/planning_hub/events/search',
        });
      });

      describe('Manage League Games Preference', () => {
        it('does not show the create fixture or edit button when off', async () => {
          const user = userEvent.setup();
          renderComponent({
            isLeague: true,
            preferences: {
              leagueGameTeam: true,
            },
          });
          expect(screen.queryByText('Create game')).not.toBeInTheDocument();

          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          await waitFor(() => user.click(screen.getByRole('menuitem')));

          expect(screen.queryByText('Edit fixture')).not.toBeInTheDocument();
        });
        it('shows create fixture btn when on', () => {
          renderComponent({
            isLeague: true,
            preferences: {
              manageLeagueGame: true,
            },
            permissionsContext: swapPermissions({
              leagueGame: {
                ...mockedPermissionsContextValue.leagueGame,
                manageGameInformation: true,
              },
            }),
          });

          expect(screen.getByText('Create game')).toBeInTheDocument();
        });

        it('shows edit fixture on click on burger menu when on', async () => {
          const user = userEvent.setup();
          renderComponent({
            isLeague: true,
            preferences: {
              ...defaultPreferences,
              manageLeagueGame: true,
            },
            permissionsContext: swapPermissions({
              leagueGame: {
                ...mockedPermissionsContextValue.leagueGame,
                manageGameInformation: true,
              },
            }),
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          await waitFor(() => user.click(screen.getByRole('menuitem')));

          expect(screen.getByText('Edit fixture')).toBeInTheDocument();
        });
      });

      describe('Scout access management preference', () => {
        it('displays the scout access management access status column with the pending count results and the lock icon when the SAM preference and permission is on', async () => {
          server.use(
            rest.post('/planning_hub/events/search', (req, res, ctx) => {
              return res(
                ctx.json({
                  events: [
                    {
                      ...game,
                      access_request_accessible: false,
                      access_request_time_valid: false,
                      user_event_requests_counts: {
                        total: 3,
                        pending: 1,
                        approved: 1,
                        denied: 1,
                        expired: 0,
                        withdrawn: 0,
                      },
                    },
                  ],
                  next_id: null,
                })
              );
            })
          );

          renderComponent({
            isLeague: true,
            permissionsContext: swapPermissions({
              scoutAccessManagement: {
                canManageScoutAccess: true,
              },
            }),
            preferences: { ...defaultPreferences, scoutAccessManagement: true },
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          expect(screen.getByText('Access status')).toBeInTheDocument();
          expect(screen.getByText('1 pending')).toBeInTheDocument();
          expect(screen.getByTestId('LockIcon')).toBeInTheDocument();
        });
        it('redirects to the match requests page on view scout requests menu item click when the SAM preference and manage permission is on for the league user', async () => {
          const user = userEvent.setup();
          renderComponent({
            isLeague: true,
            permissionsContext: swapPermissions({
              scoutAccessManagement: {
                canManageScoutAccess: true,
                canViewScoutFixtures: false,
              },
            }),
            preferences: { ...defaultPreferences, scoutAccessManagement: true },
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          expect(screen.getByText('Access status')).toBeInTheDocument();
          await waitFor(() => user.click(screen.getByRole('menuitem')));
          await waitFor(() =>
            user.click(screen.getByText('View scout requests'))
          );
          expect(redirect).toHaveBeenCalledWith('/league-fixtures/requests/1');
        });
      });
    });

    describe('as a official user', () => {
      it('hides the menu icon', async () => {
        renderComponent({ isOfficial: true });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
      });

      it('redirects to the match report on row click', async () => {
        const user = userEvent.setup();
        renderComponent({
          isOfficial: true,
          permissionsContext: swapPermissions({
            leagueGame: {
              ...mockedPermissionsContextValue.leagueGame,
              viewMatchReport: true,
            },
          }),
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByText('Manchester United')));
        expect(redirect).toHaveBeenCalledWith('/league-fixtures/reports/1');
      });

      it('calls getEvents with "supervisor_view: false"', async () => {
        const getEventMock = jest.spyOn($, 'ajax');
        renderComponent({ isOfficial: true });

        expect(getEventMock).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: '/planning_hub/events/search',
            contentType: 'application/json',
            data: expect.stringContaining('"supervisor_view":false'),
          })
        );
      });
    });

    describe('as org supervised', () => {
      it('hides the menu icon', async () => {
        renderComponent({ isOrgSupervised: true });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
      });

      it('redirects to the match report on row click', async () => {
        const user = userEvent.setup();
        renderComponent({
          isOrgSupervised: true,
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByText('Manchester United')));
        expect(redirect).toHaveBeenCalledWith(
          '/planning_hub/league-schedule/reports/1'
        );
      });

      it('hides the mass assign officials button', () => {
        renderComponent({ isOrgSupervised: true });
        expect(
          screen.queryByText('Mass Assign Officials')
        ).not.toBeInTheDocument();
      });

      it('hides the game status filter', async () => {
        renderComponent({ isOrgSupervised: true });
        expect(screen.queryByTestId('status-filter')).not.toBeInTheDocument();
      });

      it('hides the game status column', async () => {
        renderComponent({ isOrgSupervised: true });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await expect(
          screen.queryByTestId('status-filter')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Status')).not.toBeInTheDocument();
      });

      it('calls getEvents with "supervisor_view: true"', async () => {
        const getEventMock = jest.spyOn($, 'ajax');
        renderComponent({ isOrgSupervised: true });

        expect(getEventMock).toHaveBeenCalledWith({
          method: 'POST',
          url: '/planning_hub/events/search',
          contentType: 'application/json',
          data: JSON.stringify({
            date_range: {
              start_date: '2021-09-30T00:00:00+00:00',
              end_date: '2021-10-20T23:59:59+00:00',
            },
            event_types: ['game_event'],
            competitions: [],
            game_days: [],
            oppositions: [],
            search_expression: '',
            include_game_status: true,
            next_id: null,
            squad_names: [],
            statuses: [],
            organisations: [],
            supervisor_view: true,
            start_time_asc: true,
            recurring_events: false,
            include_user_event_requests_counts: false,
            round_number: '',
            include_division: false,
          }),
        });
      });
    });

    describe('as scout', () => {
      it('does not redirect to the match report on click when the scout does not have the relative permission', async () => {
        const user = userEvent.setup();
        renderComponent({
          isScout: true,
          permissionsContext: {
            ...mockedPermissionsContextValue,
            permissions: {
              ...mockedPermissionsContextValue.permissions,
              leagueGame: {
                ...mockedPermissionsContextValue.permissions.leagueGame,
                viewMatchReport: false,
              },
            },
          },
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByText('Manchester United')));
        expect(redirect).not.toHaveBeenCalledWith('/scout-schedule/reports/1');
      });

      it('redirects to the match report on row click when they have the correct permission', async () => {
        const user = userEvent.setup();
        renderComponent({
          isScout: true,
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByText('Manchester United')));
        expect(redirect).toHaveBeenCalledWith('/scout-schedule/reports/1');
      });

      it('still redirects to the match report on row click when they have the correct permission and the SAM preference', async () => {
        const user = userEvent.setup();
        renderComponent({
          isScout: true,
          preferences: { ...defaultPreferences, scoutAccessManagement: true },
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByText('Manchester United')));
        expect(redirect).toHaveBeenCalledWith('/scout-schedule/reports/1');
      });

      it('does not render the status column in the table', async () => {
        renderComponent({
          isScout: true,
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        expect(screen.queryByText('Status')).not.toBeInTheDocument();
      });

      it('calls getEvents with "supervisor_view: true"', async () => {
        const getEventMock = jest.spyOn($, 'ajax');
        renderComponent({ isScout: true });

        expect(getEventMock).toHaveBeenCalledWith({
          method: 'POST',
          url: '/planning_hub/events/search',
          contentType: 'application/json',
          data: JSON.stringify({
            date_range: {
              start_date: '2021-09-30T00:00:00+00:00',
              end_date: '2021-10-20T23:59:59+00:00',
            },
            event_types: ['game_event'],
            competitions: [],
            game_days: [],
            oppositions: [],
            search_expression: '',
            include_game_status: true,
            next_id: null,
            squad_names: [],
            statuses: [],
            organisations: [],
            supervisor_view: true,
            start_time_asc: true,
            recurring_events: false,
            include_user_event_requests_counts: false,
            round_number: '',
            include_division: false,
          }),
        });
      });

      it('filters by match ID correctly', async () => {
        const getEventMock = jest.spyOn($, 'ajax');
        renderComponent({ isScout: true });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

        const searchFilter = screen.getByLabelText('Search fixtures');
        expect(searchFilter).toBeInTheDocument();

        expect(screen.getByText('mls-12324')).toBeInTheDocument();

        server.use(
          rest.post('/planning_hub/events/search', (req, res, ctx) => {
            return res(
              ctx.json({
                events: [
                  {
                    ...game,
                    id: 2,
                    mls_game_key: 'mls-567',
                  },
                ],
                next_id: null,
              })
            );
          })
        );

        const clubFilter = screen.getByLabelText('Clubs', {
          selector: 'input',
        });

        expect(clubFilter).toBeInTheDocument();

        fireEvent.change(clubFilter, {
          target: { value: 'club' },
        });

        fireEvent.change(searchFilter, {
          target: { value: 'mls-567' },
        });

        jest.advanceTimersByTime(1000);

        expect(getEventMock).toHaveBeenCalledTimes(4);
        await waitFor(() => {
          expect(getEventMock).toHaveBeenCalledWith(
            expect.objectContaining({
              contentType: 'application/json',
              data: expect.stringContaining('"search_expression":"mls-567"'),
            })
          );
        });

        expect(screen.queryByText('mls-12324')).not.toBeInTheDocument();
        expect(screen.getByText('mls-567')).toBeInTheDocument();
      });

      it('filters by squad', async () => {
        const getEventMock = jest.spyOn($, 'ajax');
        renderComponent({ isScout: true });

        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

        const squadFilter = screen.getByLabelText('Squad', {
          selector: 'input',
        });

        expect(squadFilter).toBeInTheDocument();
        fireEvent.change(squadFilter, { target: { value: 'U13' } });
        expect(screen.getByText('U13')).toBeInTheDocument();
        fireEvent.click(screen.getByText('U13'));

        jest.advanceTimersByTime(1000);

        expect(getEventMock).toHaveBeenCalledWith({
          contentType: 'application/json',
          data: JSON.stringify({
            date_range: {
              start_date: '2021-09-30T00:00:00+00:00',
              end_date: '2021-10-20T23:59:59+00:00',
            },
            event_types: ['game_event'],
            competitions: [],
            game_days: [],
            oppositions: [],
            search_expression: '',
            include_game_status: true,
            next_id: null,
            squad_names: ['U13'],
            statuses: [],
            organisations: [],
            supervisor_view: true,
            start_time_asc: true,
            recurring_events: false,
            include_user_event_requests_counts: false,
            round_number: '',
            include_division: false,
          }),
          method: 'POST',
          url: '/planning_hub/events/search',
        });
      });

      it('filters by club', async () => {
        const getEventMock = jest.spyOn($, 'ajax');
        renderComponent({ isScout: true });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

        const clubFilter = screen.getByLabelText('Clubs', {
          selector: 'input',
        });
        expect(clubFilter).toBeInTheDocument();

        expect(clubFilter).toBeInTheDocument();

        fireEvent.change(clubFilter, { target: { value: 'club' } });
        fireEvent.click(screen.getByText('club'));

        expect(getEventMock).toHaveBeenCalledWith({
          contentType: 'application/json',
          data: JSON.stringify({
            date_range: {
              start_date: '2021-09-30T00:00:00+00:00',
              end_date: '2021-10-20T23:59:59+00:00',
            },
            event_types: ['game_event'],
            competitions: [],
            game_days: [],
            oppositions: [],
            search_expression: '',
            include_game_status: true,
            next_id: null,
            squad_names: [],
            statuses: [],
            organisations: [1234],
            supervisor_view: true,
            start_time_asc: true,
            recurring_events: false,
            include_user_event_requests_counts: false,
            round_number: '',
            include_division: false,
          }),
          method: 'POST',
          url: '/planning_hub/events/search',
        });
      });

      it('filters by competition', async () => {
        const getEventMock = jest.spyOn($, 'ajax');
        renderComponent({ isScout: true });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

        const competitionFilter = screen.getByLabelText('Competitions', {
          selector: 'input',
        });

        expect(competitionFilter).toBeInTheDocument();

        fireEvent.change(competitionFilter, {
          target: { value: 'Champions League' },
        });
        fireEvent.click(
          screen.getByRole('option', { name: 'Champions League' })
        );

        expect(getEventMock).toHaveBeenCalledWith({
          contentType: 'application/json',
          data: JSON.stringify({
            date_range: {
              start_date: '2021-09-30T00:00:00+00:00',
              end_date: '2021-10-20T23:59:59+00:00',
            },
            event_types: ['game_event'],
            competitions: [1],
            game_days: [],
            oppositions: [],
            search_expression: '',
            include_game_status: true,
            next_id: null,
            squad_names: [],
            statuses: [],
            organisations: [],
            supervisor_view: true,
            start_time_asc: true,
            recurring_events: false,
            include_user_event_requests_counts: false,
            round_number: '', // Added round_number here to match expected output
            include_division: false,
          }),
          method: 'POST',
          url: '/planning_hub/events/search',
        });
      });
    });

    describe('incomplete data', () => {
      beforeEach(() => {
        server.use(
          rest.post('/planning_hub/events/search', (req, res, ctx) => {
            return res(
              ctx.json({
                events: [
                  {
                    ...game,
                    score: null,
                    opponent_score: null,
                    squad: null,
                    opponent_squad: null,
                    mls_game_key: null,
                    event_location: null,
                    game_status: null,
                  },
                ],
                next_id: null,
              })
            );
          }),
          rest.get('/ui/squads/age_groups', (req, res, ctx) => {
            return res(ctx.json(['U13', 'U14', 'U15', 'U16', 'U17', 'U19']));
          })
        );
      });

      it('correctly renders the fallback values', async () => {
        renderComponent({ isOfficial: true });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

        expect(screen.getAllByText('-')).toHaveLength(7);
        expect(screen.getByText('16 Oct, Sat')).toBeInTheDocument();
        expect(
          screen.getByText('12:02 pm (Europe/Dublin)')
        ).toBeInTheDocument();
      });
    });

    describe('When the request fails', () => {
      beforeEach(() => {
        server.use(
          rest.post('/planning_hub/events/search', (req, res, ctx) =>
            res(ctx.status(500))
          )
        );
      });

      it('renders the error message', async () => {
        renderComponent();

        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

        expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
        expect(screen.getByText(/Go back and try again/i)).toBeInTheDocument();
      });
    });

    describe('scout access management', () => {
      it('renders the requests header', () => {
        renderComponent({ preferences: { scoutAccessManagement: true } });
        expect(screen.getByText('Access status')).toBeInTheDocument();
      });

      it('renders the scout access management access filter', () => {
        renderComponent({ preferences: { scoutAccessManagement: true } });
        expect(screen.getByLabelText('Access')).toBeInTheDocument();
      });

      it('allows the scout to request access to a game when request access is clicked', async () => {
        const axiosPostSpy = jest.spyOn(axios, 'post');
        const user = userEvent;
        renderComponent({ preferences: { scoutAccessManagement: true } });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByText('Request access')));
        expect(axiosPostSpy).toHaveBeenCalledWith(
          '/planning_hub/user_event_requests',
          { event_id: 1 }
        );
      });

      describe('access_request_limitations preference', () => {
        it('when the access_request_limitations preference is on, it uses the access_request_accessible attribute  in the game to determine if the scout can request access if true', async () => {
          renderComponent({
            preferences: {
              ...defaultPreferences,
              accessRequestLimitations: true,
              scoutAccessManagement: true,
            },
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          await waitFor(() =>
            expect(screen.getByText('Request access')).toBeInTheDocument()
          );
          expect(screen.queryByTestId('LockIcon')).not.toBeInTheDocument();
        });

        it('when the access_request_limitations preference is on, it uses the access_request_accessible attribute in the game to determine if the scout cant request access if false', async () => {
          server.use(
            rest.post('/planning_hub/events/search', (req, res, ctx) => {
              return res(
                ctx.json({
                  events: [{ ...game, access_request_accessible: false }],
                  next_id: null,
                })
              );
            })
          );
          renderComponent({
            preferences: {
              ...defaultPreferences,
              accessRequestLimitations: true,
              scoutAccessManagement: true,
            },
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          await waitFor(() =>
            expect(screen.queryByText('Request access')).not.toBeInTheDocument()
          );
          expect(screen.queryByTestId('LockIcon')).not.toBeInTheDocument();
        });

        it('when the access_request_limitations preference is on, it uses the access_request_time_valid attribute in the game to determine if the lock icon renders', async () => {
          server.use(
            rest.post('/planning_hub/events/search', (req, res, ctx) => {
              return res(
                ctx.json({
                  events: [
                    {
                      ...game,
                      access_request_accessible: false,
                      access_request_time_valid: false,
                    },
                  ],
                  next_id: null,
                })
              );
            })
          );
          renderComponent({
            preferences: {
              ...defaultPreferences,
              accessRequestLimitations: true,
              scoutAccessManagement: true,
            },
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

          await waitFor(() =>
            expect(screen.getByTestId('LockIcon')).toBeInTheDocument()
          );
        });
      });

      it.each(['pending', 'approved'])(
        'allows the scout to withdraw their %s request to a game when the withdraw action is clicked',
        async (statusType) => {
          server.use(
            rest.get('/planning_hub/user_event_requests', (req, res, ctx) => {
              return res(
                ctx.json([
                  {
                    id: 132,
                    user: {
                      id: 152182,
                    },
                    event: {
                      id: 1,
                    },
                    status: statusType,
                  },
                ])
              );
            })
          );
          const axiosDeleteSpy = jest.spyOn(axios, 'delete');
          const user = userEvent.setup({ delay: null });
          renderComponent({ preferences: { scoutAccessManagement: true } });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          const scoutAccessActionsMenuButton = screen.getByTestId(
            'scout-access-actions-menu-button'
          );

          expect(scoutAccessActionsMenuButton).toBeInTheDocument();

          await user.click(scoutAccessActionsMenuButton);

          expect(screen.getByText('Withdraw request')).toBeInTheDocument();

          await user.click(screen.getByText('Withdraw request'));

          expect(screen.getByText('Withdraw request?')).toBeInTheDocument();

          await user.click(screen.getByText('Submit'));

          expect(axiosDeleteSpy).toHaveBeenCalledWith(
            '/planning_hub/user_event_requests/132'
          );
        }
      );

      it('does not trigger a redirect when the user clicks on a cell', async () => {
        const user = userEvent.setup();
        renderComponent({ preferences: { scoutAccessManagement: true } });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByText('Manchester United')));
        expect(redirect).not.toHaveBeenCalledWith();
      });

      it('sets the club (organisation) to the club admins club when mange-scout-access is on', async () => {
        server.use(
          rest.get(
            '/ui/organisation/organisations/children',
            (req, res, ctx) => {
              return res(
                ctx.json([
                  {
                    id: 37,
                    name: 'Kitman Football',
                  },
                  {
                    id: 39,
                    name: 'KL Galaxy',
                  },
                ])
              );
            }
          )
        );
        const getEventMock = jest.spyOn($, 'ajax');

        await act(async () => {
          renderComponent({
            permissionsContext: {
              ...mockedPermissionsContextValue,
              permissions: {
                ...mockedPermissionsContextValue.permissions,
                scoutAccessManagement: { canManageScoutAccess: true },
              },
            },
            preferences: { scoutAccessManagement: true },
          });
        });

        const progressbar = screen.queryByRole('progressbar');
        if (progressbar) {
          await waitForElementToBeRemoved(progressbar);
        }

        // Wait for the component to fully load and API calls to settle
        await waitFor(
          () => {
            expect(getEventMock).toHaveBeenCalled();
          },
          { timeout: 10000 }
        );

        expect(getEventMock).toHaveBeenCalledWith({
          contentType: 'application/json',
          data: JSON.stringify({
            date_range: {
              start_date: '2021-09-30T00:00:00+00:00',
              end_date: '2021-10-20T23:59:59+00:00',
            },
            event_types: ['game_event'],
            competitions: [],
            game_days: [],
            oppositions: [],
            search_expression: '',
            include_game_status: true,
            next_id: null,
            squad_names: [],
            statuses: [],
            organisations: [37],
            supervisor_view: true,
            start_time_asc: true,
            recurring_events: false,
            include_user_event_requests_counts: true,
            round_number: '',
            include_division: false,
            include_scout_attendees: false,
            user_event_requests_statuses: [],
            include_access_request_accessible: true,
            include_access_request_time_valid: true,
          }),

          method: 'POST',
          url: '/planning_hub/events/search',
        });
      });

      it('redirects to the match requests page on click if the user can manage scout access', async () => {
        const user = userEvent.setup();
        renderComponent({
          permissionsContext: {
            ...mockedPermissionsContextValue,
            permissions: {
              ...mockedPermissionsContextValue.permissions,
              scoutAccessManagement: { canManageScoutAccess: true },
            },
          },
          preferences: { scoutAccessManagement: true },
        });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
        await waitFor(() => user.click(screen.getByText('Manchester United')));
        expect(redirect).toHaveBeenCalledWith(
          '/planning_hub/league-schedule/requests/1'
        );
      });

      it('allows the user to select an access type filter', async () => {
        const getEventMock = jest.spyOn($, 'ajax');
        renderComponent({ preferences: { scoutAccessManagement: true } });
        await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

        getEventMock.mockClear();

        const accessFilter = screen.getByLabelText('Access');
        fireEvent.change(accessFilter, {
          target: { value: 'Approved' },
        });
        fireEvent.click(screen.getByRole('option', { name: 'Approved' }));
        expect(getEventMock).toHaveBeenCalledWith({
          contentType: 'application/json',
          data: JSON.stringify({
            date_range: {
              start_date: '2021-09-30T00:00:00+00:00',
              end_date: '2021-10-20T23:59:59+00:00',
            },
            event_types: ['game_event'],
            competitions: [],
            game_days: [],
            oppositions: [],
            search_expression: '',
            include_game_status: true,
            next_id: null,
            squad_names: [],
            statuses: [],
            organisations: [],
            supervisor_view: true,
            start_time_asc: true,
            recurring_events: false,
            include_user_event_requests_counts: false,
            round_number: '',
            include_division: false,
            user_event_requests_statuses: ['approved'],
            include_access_request_accessible: true,
            include_access_request_time_valid: true,
          }),

          method: 'POST',
          url: '/planning_hub/events/search',
        });
      });
    });

    describe('match monitor flow', () => {
      describe('as a league admin user', () => {
        it('allows the user to navigate to the match monitor report', async () => {
          const user = userEvent.setup();
          renderComponent({
            isLeague: true,
            preferences: {
              ...defaultPreferences,
              matchMonitor: true,
            },
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          await waitFor(() => user.click(screen.getByRole('menuitem')));
          await waitFor(() =>
            user.click(screen.getByText('View match monitor report'))
          );
          expect(redirect).toHaveBeenCalledWith('/match_monitor/report/1');
        });

        describe('[league-ops-match-monitor-v3] is true', () => {
          beforeEach(() => {
            window.setFlag('league-ops-match-monitor-v3', true);
          });
          it('shows the match monitor grid column and renders chips', async () => {
            renderComponent({
              isLeague: true,
              preferences: {
                ...defaultPreferences,
                matchMonitor: true,
              },
            });
            await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
            expect(
              screen.getByText('Match Monitor Attendees')
            ).toBeInTheDocument();
            expect(screen.getByText('Jonny Evans')).toBeInTheDocument();
            // Overflow when more than one monitor
            const moreChip = screen.getByTestId('more-chip');
            expect(moreChip).toBeInTheDocument();
            expect(screen.getByTestId('AddIcon')).toBeInTheDocument();
            expect(moreChip).toHaveTextContent('1');
          });

          it('does not show the match monitor grid column if manage monitor report is false', () => {
            const permissionsContext = { ...mockedPermissionsContextValue };
            permissionsContext.permissions.matchMonitor.manageMatchMonitorReport = false;
            renderComponent({
              isLeague: true,
              preferences: {
                ...defaultPreferences,
                matchMonitor: true,
              },
              permissionsContext,
            });
            expect(
              screen.queryByText('Match Monitor Attendees')
            ).not.toBeInTheDocument();
          });
        });

        describe('render actions based on permissions', () => {
          it('renders match monitor report actions with permissions', async () => {
            const user = userEvent.setup();

            renderComponent({
              isLeague: true,
              isMatchMonitor: true,
              preferences: {
                ...defaultPreferences,
                matchMonitor: true,
              },
              permissionsContext: swapPermissions({
                matchMonitor: {
                  manageMatchMonitorReport: true,
                  viewMatchMonitorReport: true,
                },
              }),
            });
            await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

            await waitFor(() => user.click(screen.getByRole('menuitem')));
            expect(
              screen.getByText('View match monitor report')
            ).toBeInTheDocument();
            expect(
              screen.getByText('Reset match monitor report')
            ).toBeInTheDocument();
          });

          it('does not render match monitor report actions without permission', async () => {
            renderComponent({
              isLeague: true,
              isMatchMonitor: true,
              preferences: {
                ...defaultPreferences,
                matchMonitor: true,
              },
              permissionsContext: swapPermissions({
                matchMonitor: {
                  manageMatchMonitorReport: false,
                  viewMatchMonitorReport: false,
                },
                leagueGame: {
                  viewMatchReport: false,
                  manageMatchReport: false,
                },
              }),
            });
            await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

            expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
          });

          it('renders match report actions with permissions', async () => {
            const user = userEvent.setup();

            renderComponent({
              isLeague: true,
              isMatchMonitor: false,
              preferences: {
                ...defaultPreferences,
                matchMonitor: false,
              },
              permissionsContext: swapPermissions({
                matchMonitor: {
                  manageMatchMonitorReport: true,
                  viewMatchMonitorReport: true,
                },
              }),
            });
            await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

            await waitFor(() => user.click(screen.getByRole('menuitem')));
            expect(screen.getByText('View match report')).toBeInTheDocument();
            expect(screen.getByText('Reset match report')).toBeInTheDocument();
          });

          it('does not render match report actions with permissions', async () => {
            renderComponent({
              isLeague: true,
              isMatchMonitor: false,
              preferences: {
                ...defaultPreferences,
                matchMonitor: false,
              },
              permissionsContext: swapPermissions({
                matchMonitor: {
                  manageMatchMonitorReport: false,
                  viewMatchMonitorReport: false,
                },
                leagueGame: {
                  viewMatchReport: false,
                  manageMatchReport: false,
                },
              }),
            });
            await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

            expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
          });
        });

        it('allows the user to reset the match monitor report', async () => {
          jest.spyOn(axios, 'delete');
          const user = userEvent.setup();
          renderComponent({
            isLeague: true,
            preferences: {
              ...defaultPreferences,
              matchMonitor: true,
            },
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          await waitFor(() => user.click(screen.getByRole('menuitem')));
          await waitFor(() =>
            user.click(screen.getByText('Reset match monitor report'))
          );
          await waitFor(() => user.click(screen.getByText('Reset')));
          expect(axios.delete).toHaveBeenCalledWith(
            '/planning_hub/events/1/game_monitor_reports'
          );
          expect(mockDispatch).toHaveBeenCalledWith({
            payload: {
              status: 'SUCCESS',
              title: 'Match monitor report reset.',
            },
            type: 'toasts/add',
          });
        });

        it('throws an error if reset the match monitor report fails', async () => {
          server.use(
            rest.delete(
              '/planning_hub/events/1/game_monitor_reports',
              (req, res, ctx) => {
                return res(ctx.status(500));
              }
            )
          );
          const user = userEvent.setup();
          renderComponent({
            isLeague: true,
            preferences: {
              ...defaultPreferences,
              matchMonitor: true,
            },
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          await waitFor(() => user.click(screen.getByRole('menuitem')));
          await waitFor(() =>
            user.click(screen.getByText('Reset match monitor report'))
          );
          await waitFor(() => user.click(screen.getByText('Reset')));

          expect(mockDispatch).toHaveBeenCalledWith({
            payload: {
              status: 'ERROR',
              title: 'Match monitor report reset failed.',
            },
            type: 'toasts/add',
          });
        });

        it('allows the user to unlock the match monitor report', async () => {
          jest.spyOn(axios, 'post');
          server.use(
            rest.post('/planning_hub/events/search', (req, res, ctx) => {
              return res(
                ctx.json({
                  events: [
                    {
                      ...game,
                      game_monitor_report_submitted: true,
                    },
                  ],
                  next_id: null,
                })
              );
            })
          );
          const user = userEvent.setup();
          renderComponent({
            isLeague: true,
            preferences: {
              ...defaultPreferences,
              matchMonitor: true,
            },
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          await waitFor(() => user.click(screen.getByRole('menuitem')));
          await waitFor(() =>
            user.click(screen.getByText('Unlock match monitor report'))
          );
          await waitFor(() => user.click(screen.getByText('Unlock')));
          expect(axios.post).toHaveBeenCalledWith(
            '/planning_hub/events/1/game_monitor_reports',
            { submitted: false }
          );

          expect(redirect).toHaveBeenCalledWith('/match_monitor/report/1');
        });

        it('shows the mass assign monitors button', () => {
          renderComponent({
            isLeague: true,
            preferences: {
              ...defaultPreferences,
              matchMonitor: true,
            },
          });
          expect(screen.getByText('Assign Monitors')).toBeInTheDocument();
        });
      });

      describe('as a match monitor user', () => {
        it('allows the user to navigate to the match monitor report', async () => {
          const user = userEvent.setup();
          renderComponent({
            isMatchMonitor: true,
            preferences: {
              ...defaultPreferences,
              matchMonitor: true,
            },
          });
          await waitForElementToBeRemoved(screen.queryByRole('progressbar'));
          await waitFor(() =>
            user.click(screen.getByText('Manchester United'))
          );
          expect(redirect).toHaveBeenCalledWith('/match_monitor/report/1');
        });
      });
    });
  });

  describe('No Fixtures Render', () => {
    it('renders the no fixtures message and filters', async () => {
      server.use(
        rest.post('/planning_hub/events/search', (req, res, ctx) => {
          return res(
            ctx.json({
              events: [],
              next_id: null,
            })
          );
        })
      );
      renderComponent({});

      await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

      expect(screen.getByText('No events scheduled')).toBeInTheDocument();
    });
  });

  describe('Scout attendees filter', () => {
    afterEach(() => {
      window.setFlag('league-ops-sam-enable-scout-atendees', false);
    });
    it('renders the scout attendees filter when the [feature flag: league-ops-sam-enable-scout-atendees] is on and the user has manage scout access permission', () => {
      window.setFlag('league-ops-sam-enable-scout-atendees', true);

      renderComponent({
        permissionsContext: {
          ...mockedPermissionsContextValue,
          permissions: {
            ...mockedPermissionsContextValue.permissions,
            scoutAccessManagement: { canManageScoutAccess: true },
          },
        },
        preferences: {
          ...defaultPreferences,
          scoutAccessManagement: true,
        },
      });
      expect(screen.getByText('Scout attendees')).toBeInTheDocument();
    });
    it('does not render the scout attendees filter when the [feature flag: league-ops-sam-enable-scout-atendees] is off and the user does not have manage scout access permission', () => {
      window.setFlag('league-ops-sam-enable-scout-atendees', false);
      renderComponent({
        permissionsContext: {
          ...mockedPermissionsContextValue,
          permissions: {
            ...mockedPermissionsContextValue.permissions,
            scoutAccessManagement: { canManageScoutAccess: false },
          },
        },
        preferences: {
          ...defaultPreferences,
          scoutAccessManagement: true,
        },
      });
      expect(screen.queryByText('Scout attendees')).not.toBeInTheDocument();
    });
  });
});
