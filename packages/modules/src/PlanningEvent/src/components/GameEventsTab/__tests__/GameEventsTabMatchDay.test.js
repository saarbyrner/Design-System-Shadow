import * as redux from 'react-redux';
import { rest, server } from '@kitman/services/src/mocks/server';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { axios } from '@kitman/common/src/utils/services';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import PreferenceContext from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import {
  defaultProps,
  defaultStore,
  eventMock,
  mockActivityStore,
  periodMock,
} from './gameEventsMockData';
import GameEventsTab from '..';

describe('GameEventsTab MatchDay Tests', () => {
  const captainAssignedMockActivityStore = {
    ...mockActivityStore,
    localGameActivities: [
      {
        ...mockActivityStore.localGameActivities[0],
        relation: { id: 1, number_of_players: 3 },
      },
      mockActivityStore.localGameActivities[1],
      mockActivityStore.localGameActivities[2],
      {
        kind: eventTypes.captain_assigned,
        athlete_id: 5,
        absolute_minute: 0,
      },
      {
        kind: eventTypes.formation_position_view_change,
        absolute_minute: 0,
        athlete_id: 5,
      },
    ],
  };

  const gameEventMock = { ...eventMock, dmr: [], league_setup: true };

  const componentRender = ({
    props = defaultProps,
    mockStore = defaultStore,
    leaguePreferences = {
      league_game_team: false,
      league_game_team_lock_minutes: false,
    },
  }) => {
    renderWithRedux(
      <PreferenceContext.Provider value={{ preferences: leaguePreferences }}>
        <GameEventsTab {...props} />
      </PreferenceContext.Provider>,
      {
        preloadedState: mockStore,
        useGlobalStore: true,
      }
    );
  };

  beforeEach(() => {
    jest.spyOn(axios, 'get');
    jest.spyOn(axios, 'post');
    jest.spyOn(axios, 'patch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Imported Club View GameEventsTab', () => {
    describe('when the feature-flag hide-game-events-header-and-events-list is enabled', () => {
      beforeEach(() => {
        window.featureFlags = {
          'planning-game-events-field-view': true,
          'hide-game-events-header-and-events-list': true,
        };
      });

      afterEach(() => {
        window.featureFlags = {
          'planning-game-events-field-view': false,
          'hide-game-events-header-and-events-list': false,
        };
      });

      it('hides the planning tab header', () => {
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
        });
        expect(
          screen.queryByTestId('GameEventsHeader')
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId('PeriodTimeline')).not.toBeInTheDocument();
      });
    });
  });

  describe('Match Day Flow', () => {
    const savedGameActivityStore = {
      apiGameActivities: mockActivityStore.localGameActivities,
      localGameActivities: mockActivityStore.localGameActivities,
    };

    const savedLineupWithFormationCompleteActivityStore = {
      apiGameActivities: [
        ...mockActivityStore.localGameActivities,
        { kind: eventTypes.formation_complete, absolute_minute: 0 },
      ],
      localGameActivities: [
        ...mockActivityStore.localGameActivities,
        { kind: eventTypes.formation_complete, absolute_minute: 0 },
      ],
    };
    let mockDispatch;
    let useDispatchSpy;

    beforeEach(() => {
      useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      mockDispatch = jest.fn();
      useDispatchSpy.mockReturnValue(mockDispatch);
      window.featureFlags = {
        'planning-game-events-field-view': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {
        'planning-game-events-field-view': false,
      };
    });

    it('allows the ui to be interacted with normally when the preference is off', async () => {
      const user = userEvent.setup();

      componentRender({
        props: {
          ...defaultProps,
          event: {
            ...gameEventMock,
            game_participants_lock_time: '2020-09-18T10:28:52Z',
            game_participants_unlocked: false,
          },
        },
        mockStore: {
          planningEvent: {
            ...defaultStore.planningEvent,
            pitchView: {
              ...defaultStore.planningEvent.pitchView,
              field: { id: 1 },
            },
          },
        },
      });

      await user.click(screen.getByText('Line-ups'));
      await user.click(screen.getByText('Clear'));

      expect(screen.queryByText('Clear Starting Lineup')).toBeInTheDocument();
    });

    it('disables the club user dmr functionality when the game is past its kickoff time and locked when the preference is on', async () => {
      const user = userEvent.setup();

      componentRender({
        props: {
          ...defaultProps,
          event: {
            ...gameEventMock,
            game_participants_lock_time: '2020-09-18T10:28:52Z',
            game_participants_unlocked: false,
          },
        },
        mockStore: {
          planningEvent: {
            ...defaultStore.planningEvent,
            pitchView: {
              ...defaultStore.planningEvent.pitchView,
              field: { id: 1 },
            },
          },
        },
        leaguePreferences: {
          league_game_team: true,
          league_game_team_lock_minutes: true,
        },
      });

      expect(screen.queryByText('Save')).not.toBeInTheDocument();
      await expect(() =>
        user.click(screen.getByText('Line-ups'))
      ).rejects.toThrow(/pointer-events: none/);
      await user.click(screen.getByText('Clear'));

      expect(
        screen.queryByText('Clear Starting Lineup')
      ).not.toBeInTheDocument();
    });

    describe('autosave render', () => {
      it('allows the user to autosave their lineup', async () => {
        window.featureFlags['pitch-view-autosave'] = true;
        server.use(
          rest.post(
            '/ui/planning_hub/events/122/game_periods/10/v2/game_activities/bulk_save',
            (req, res, ctx) => {
              return res(
                ctx.json(captainAssignedMockActivityStore.localGameActivities)
              );
            }
          )
        );
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: captainAssignedMockActivityStore,
            },
          },
        });

        expect(axios.post).toHaveBeenCalledWith(
          '/ui/planning_hub/events/122/game_periods/10/v2/game_activities/bulk_save',
          {
            game_activities:
              captainAssignedMockActivityStore.localGameActivities,
          }
        );
        window.featureFlags['pitch-view-autosave'] = false;
      });

      it('dispatches an error toast when the autosave fails', async () => {
        server.use(
          rest.post(
            '/ui/planning_hub/events/122/game_periods/10/v2/game_activities/bulk_save',
            (req, res, ctx) => {
              return res(ctx.status(500));
            },
            { once: true }
          )
        );

        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: captainAssignedMockActivityStore,
            },
          },
          leaguePreferences: { league_game_team: true },
        });

        await waitFor(
          () =>
            expect(mockDispatch).toHaveBeenCalledWith({
              payload: {
                status: 'ERROR',
                title: 'Autosave failed, page refreshing.',
              },
              type: 'toasts/add',
            }),
          { timeout: 2000 }
        );
      });

      it('renders the autosave spinner when the autosave is in progress and the isAutosaveSpinnerAllowed feature flag is on', async () => {
        window.featureFlags['league-ops-game-auto-save-spinner'] = true;
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: captainAssignedMockActivityStore,
            },
          },
          leaguePreferences: { league_game_team: true },
        });

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        window.featureFlags['league-ops-game-auto-save-spinner'] = false;
      });

      it('does not render the autosave spinner when the autosave is in progress and the isAutosaveSpinnerAllowed feature flag is off', async () => {
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: captainAssignedMockActivityStore,
            },
          },
          leaguePreferences: { league_game_team: true },
        });

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      it('fires off a fetch to get the up to date rules after an auto save action has been completed', async () => {
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: captainAssignedMockActivityStore,
            },
          },
          leaguePreferences: { league_game_team: true },
        });

        await waitFor(() =>
          expect(axios.get).toHaveBeenCalledWith(
            '/planning_hub/game_compliance/122/rules'
          )
        );

        expect(defaultProps.onUpdateEvent).toHaveBeenCalledWith(
          {
            ...gameEventMock,
            dmr: ['players', 'captain'],
          },
          true
        );
      });
    });

    describe('Paid customers render', () => {
      const paidViewAssertions = async (disabled) => {
        if (disabled) {
          await waitFor(() => {
            expect(
              screen.queryByTestId('PeriodTimeline')
            ).not.toBeInTheDocument();
          });
          expect(screen.queryByText('Pitch view')).not.toBeInTheDocument();
          expect(screen.queryByText('List view')).not.toBeInTheDocument();
          expect(screen.queryByText('Add period')).not.toBeInTheDocument();
        } else {
          await waitFor(() => {
            expect(screen.queryByTestId('PeriodTimeline')).toBeInTheDocument();
          });
          expect(screen.getByText('Pitch view')).toBeInTheDocument();
          expect(screen.getByText('List view')).toBeInTheDocument();
          expect(screen.getByText('Add period')).toBeInTheDocument();
        }
      };

      it('enables the game events header actions from being accessed when it isnt a league game', async () => {
        componentRender({
          props: {
            ...defaultProps,
            event: { ...gameEventMock, league_setup: false },
          },
          leaguePreferences: { league_game_team: true },
        });
        await paidViewAssertions();
      });

      it('disables the game events header actions from being accessed when it is a league match day flow game', async () => {
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          leaguePreferences: {
            league_game_team: true,
            league_game_team_lock_minutes: true,
          },
        });
        await paidViewAssertions(true);
      });

      it('disables the game events header actions from being accessed when it is a league user for a match day locked flow game', async () => {
        server.use(
          rest.get(`/ui/organisation/organisations/current`, (req, res, ctx) =>
            res(
              ctx.json({
                association_admin: true,
              })
            )
          ),
          rest.get(`/ui/current_user`, (req, res, ctx) =>
            res(
              ctx.json({
                role: 'Account Admin',
              })
            )
          )
        );
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          leaguePreferences: {
            league_game_team: true,
          },
        });
        await paidViewAssertions(true);
      });

      describe('Paid Match day flow', () => {
        it('enables the game events header actions from being accessed when the match day flow and league_game_match_report is on for a league game', async () => {
          componentRender({
            props: {
              ...defaultProps,
              event: { ...gameEventMock, league_setup: true },
            },
            leaguePreferences: {
              league_game_team: true,
              league_game_match_report: true,
            },
          });
          await paidViewAssertions();
        });

        it('prevents the first period from being deleted when it is in the match day flow', async () => {
          componentRender({
            props: {
              ...defaultProps,
              event: { ...gameEventMock, league_setup: true },
            },
            mockStore: {
              planningEvent: {
                ...defaultStore.planningEvent,
                eventPeriods: {
                  ...defaultStore.planningEvent.eventPeriods,
                  localEventPeriods: [
                    periodMock,
                    {
                      id: 2,
                      name: 'Period 2',
                      duration: 80,
                      absolute_duration_start: 80,
                      absolute_duration_end: 160,
                    },
                  ],
                },
              },
            },
            leaguePreferences: {
              league_game_team: true,
              league_game_match_report: true,
            },
          });

          expect(
            screen.queryByTestId('period-1-bin-container')
          ).not.toBeInTheDocument();
          expect(
            screen.getByTestId('period-2-bin-container')
          ).toBeInTheDocument();
        });

        it('allows the user to add and autosave a period when the match day flow and league_game_match_report is on', async () => {
          const user = userEvent.setup();
          componentRender({
            props: {
              ...defaultProps,
              event: { ...gameEventMock, league_setup: true },
            },
            leaguePreferences: {
              league_game_team: true,
              league_game_match_report: true,
            },
          });

          await waitFor(() => {
            expect(screen.getByText('Add period')).toBeInTheDocument();
          });
          await user.click(screen.getByText('Add period'));

          expect(axios.post).toHaveBeenCalledWith(
            '/ui/planning_hub/events/122/game_periods/bulk_save',
            {
              game_periods: [
                {
                  absolute_duration_end: 40,
                  absolute_duration_start: 0,
                  additional_duration: null,
                  duration: 40,
                  id: 10,
                  name: 'Period 1',
                  order: 9,
                },
                {
                  absolute_duration_end: 80,
                  absolute_duration_start: 40,
                  duration: 40,
                  localId: 11,
                  name: 'Period 2',
                },
              ],
            }
          );
        });

        it('fails the autosave of a period and dispatches a toast when the save fails', async () => {
          server.use(
            rest.post(
              '/ui/planning_hub/events/122/game_periods/bulk_save',
              (req, res, ctx) => {
                return res(ctx.status(500));
              },
              { once: true }
            )
          );
          const user = userEvent.setup();
          componentRender({
            props: {
              ...defaultProps,
              event: { ...gameEventMock, league_setup: true },
            },
            leaguePreferences: {
              league_game_team: true,
              league_game_match_report: true,
            },
          });

          await waitFor(() => {
            expect(screen.getByText('Add period')).toBeInTheDocument();
          });
          await user.click(screen.getByText('Add period'));

          await waitFor(
            () =>
              expect(mockDispatch).toHaveBeenCalledWith({
                payload: {
                  status: 'ERROR',
                  title: 'Autosave failed, page refreshing.',
                },
                type: 'toasts/add',
              }),
            { timeout: 2000 }
          );
        });

        it('allows the user to to autosave activities for the specific period and ignore saving other periods activities if not selected in the match day flow and league_game_match_report is on', async () => {
          const mockPeriods = [
            {
              ...defaultStore.planningEvent.eventPeriods.apiEventPeriods[0],
              id: 1,
              absolute_duration_end: 40,
            },
            {
              absolute_duration_end: 80,
              absolute_duration_start: 40,
              duration: 40,
              id: 2,
              name: 'Period 2',
            },
          ];

          const mockActivitiesForPeriodOne = [
            {
              id: 1,
              game_period_id: 1,
              absolute_minute: 0,
              kind: eventTypes.formation_change,
              relation: { id: 1, number_of_players: 2 },
            },
            {
              game_period_id: 1,
              absolute_minute: 0,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 1 },
            },
            {
              game_period_id: 1,
              absolute_minute: 0,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 3 },
            },
          ];

          const mockActivityForPeriodTwo = {
            absolute_minute: 40,
            kind: eventTypes.formation_change,
            relation: { id: 1, number_of_players: 2 },
          };

          componentRender({
            props: {
              ...defaultProps,
              event: { ...gameEventMock, league_setup: true },
            },
            mockStore: {
              planningEvent: {
                ...defaultStore.planningEvent,
                eventPeriods: {
                  apiEventPeriods: mockPeriods,
                  localEventPeriods: mockPeriods,
                },
                gameActivities: {
                  apiGameActivities: [mockActivitiesForPeriodOne[0]],
                  localGameActivities: [
                    ...mockActivitiesForPeriodOne,
                    mockActivityForPeriodTwo,
                  ],
                },
              },
            },
            leaguePreferences: {
              league_game_team: true,
              league_game_match_report: true,
            },
          });

          expect(axios.post).toHaveBeenCalledWith(
            '/ui/planning_hub/events/122/game_periods/1/v2/game_activities/bulk_save',
            {
              game_activities: [
                {
                  absolute_minute: 0,
                  game_period_id: 1,
                  kind: 'formation_position_view_change',
                  relation: { id: 1 },
                },
                {
                  absolute_minute: 0,
                  game_period_id: 1,
                  kind: 'formation_position_view_change',
                  relation: { id: 3 },
                },
              ],
            }
          );

          await waitFor(() => {
            expect(screen.getByText('Add period')).toBeInTheDocument();
          });

          expect(mockDispatch).toHaveBeenCalledWith({
            type: 'gameActivities/setLocalAndApiGameActivities',
            payload: {
              localGameActivities: [
                mockActivitiesForPeriodOne[0],
                mockActivityForPeriodTwo,
              ],
              apiGameActivities: [mockActivitiesForPeriodOne[0]],
            },
          });
        });

        it('disables the paid match day flow for when it is a league user', async () => {
          server.use(
            rest.get(
              `/ui/organisation/organisations/current`,
              (req, res, ctx) =>
                res(
                  ctx.json({
                    association_admin: true,
                  })
                )
            ),
            rest.get(`/ui/current_user`, (req, res, ctx) =>
              res(
                ctx.json({
                  role: 'Account Admin',
                })
              )
            )
          );
          componentRender({
            props: {
              ...defaultProps,
              event: { ...gameEventMock, league_setup: true },
            },
            leaguePreferences: {
              league_game_team: true,
              league_game_match_report: true,
            },
          });

          await paidViewAssertions(true);
        });

        describe('league-ops-club-game-events feature flag', () => {
          beforeEach(() => {
            window.featureFlags['league-ops-club-game-events'] = true;
          });

          afterEach(() => {
            window.featureFlags['league-ops-club-game-events'] = false;
          });
          it('enables the game events header actions from being access when it is a match day flow game with the lock time minutes preference on and the formation has been completed', async () => {
            componentRender({
              props: {
                ...defaultProps,
                event: {
                  ...gameEventMock,
                  league_setup: true,
                  game_participants_lock_time: '2025-07-29',
                },
              },
              leaguePreferences: {
                league_game_team: true,
                league_game_team_lock_minutes: true,
              },
              mockStore: {
                planningEvent: {
                  ...defaultStore.planningEvent,
                  gameActivities: savedLineupWithFormationCompleteActivityStore,
                },
              },
            });
            await paidViewAssertions();
          });

          it('enables the finish period button to be displayed and allows the user to save the formation_complete when the dmr is locked and the lock minutes preference is on', async () => {
            const user = userEvent.setup();
            componentRender({
              props: {
                ...defaultProps,
                event: {
                  ...gameEventMock,
                  league_setup: true,
                  game_participants_lock_time: '2025-07-29',
                  dmr: ['lineup', 'captain'],
                },
              },
              leaguePreferences: {
                league_game_team: true,
                league_game_team_lock_minutes: true,
              },
              mockStore: {
                planningEvent: {
                  ...defaultStore.planningEvent,
                  gameActivities: savedGameActivityStore,
                },
              },
            });

            expect(screen.getByText('Finish period')).toBeInTheDocument();
            await user.click(screen.getByText('Finish period'));
            expect(axios.post).toHaveBeenCalledWith(
              '/ui/planning_hub/events/122/game_periods/10/v2/game_activities/bulk_save',
              {
                game_activities: [
                  {
                    absolute_minute: 0,
                    kind: 'formation_complete',
                    minute: 0,
                    relation: { id: 1 },
                  },
                ],
              }
            );
          });
        });
      });
    });

    describe('league_game_match_report preference', () => {
      it('shows the share with officials button when the preference is on', () => {
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          leaguePreferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });

        expect(
          screen.getByRole('button', { name: /Share with officials/i })
        ).toBeInTheDocument();
      });

      it('does not allow the user to click share with officials and submit their lineup when the business rules have not been completed when the preference is on', async () => {
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: savedGameActivityStore,
            },
          },
          leaguePreferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });
        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: /Share with officials/i })
          ).toBeInTheDocument()
        );
        expect(
          screen.getByRole('button', { name: /Share with officials/i })
        ).toBeDisabled();
      });

      it('allows the user to click share with officials and submit their lineup when the previous business rules have been fufilled and the preference is on', async () => {
        const user = userEvent.setup();
        componentRender({
          props: {
            ...defaultProps,
            event: {
              ...gameEventMock,
              dmr: ['players', 'subs', 'staff', 'lineup'],
            },
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: savedGameActivityStore,
            },
          },
          leaguePreferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });
        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: /Share with officials/i })
          ).toBeInTheDocument()
        );

        await user.click(
          screen.getByRole('button', { name: /Share with officials/i })
        );
        expect(axios.patch).toHaveBeenCalledWith(
          '/planning_hub/events/122',
          {
            duration: 80,
            id: 122,
            opponent_score: 3,
            roster_submitted: true,
            score: 2,
            type: 'game_event',
          },
          { params: {} }
        );
      });

      it('allows the user to click share with officials when the roster has already been shared with the officials previously to make changes', async () => {
        const user = userEvent.setup();

        componentRender({
          props: {
            ...defaultProps,
            event: {
              ...gameEventMock,
              event_users: [{ id: 1, fullname: 'yakkety yak' }],
              roster_submitted_by_id: 12121,
              dmr: ['players', 'subs', 'staff', 'lineup'],
            },
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: {
                apiGameActivities: [],
                localGameActivities: [
                  mockActivityStore.localGameActivities[0],
                  mockActivityStore.localGameActivities[1],
                ],
              },
            },
          },
          leaguePreferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });
        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: /Share with officials/i })
          ).toBeInTheDocument()
        );
        await user.click(
          screen.getByRole('button', { name: /Share with officials/i })
        );
        expect(axios.patch).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(
          '/ui/planning_hub/events/122/game_periods/10/v2/game_activities/bulk_save',
          {
            game_activities: [
              mockActivityStore.localGameActivities[0],
              mockActivityStore.localGameActivities[1],
            ],
          }
        );
      });

      it('when the lineup is saved and the formation complete activity is present it renders the event list stage of the period for the league_game_match_report preference', async () => {
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: savedLineupWithFormationCompleteActivityStore,
            },
          },
          leaguePreferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });

        await waitFor(() =>
          expect(screen.getByText('Event list')).toBeInTheDocument()
        );
        expect(screen.getByText('Substitutions')).toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: /Share with officials/i })
        ).not.toBeInTheDocument();
      });

      it('when the lineup is saved and the formation complete activity is present it renders the starting lineup stage for the period if it is a league user always', async () => {
        server.use(
          rest.get(`/ui/organisation/organisations/current`, (req, res, ctx) =>
            res(
              ctx.json({
                association_admin: true,
              })
            )
          ),
          rest.get(`/ui/current_user`, (req, res, ctx) =>
            res(
              ctx.json({
                role: 'Account Admin',
              })
            )
          )
        );
        componentRender({
          props: {
            ...defaultProps,
            event: gameEventMock,
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: savedLineupWithFormationCompleteActivityStore,
            },
          },
          leaguePreferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });

        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: /Share with officials/i })
          ).toBeInTheDocument()
        );
        expect(screen.queryByRole('Event list')).not.toBeInTheDocument();
      });
    });
  });
});
