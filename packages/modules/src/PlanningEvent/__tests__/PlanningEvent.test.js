import * as redux from 'react-redux';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { axios } from '@kitman/common/src/utils/services';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { rest, server } from '@kitman/services/src/mocks/server';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { data as mockEventData } from '@kitman/services/src/mocks/handlers/planningHub/getEvent';

import PlanningEvent from '../index';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/hooks/useLeagueOperations');

const WAIT_FOR_ELEMENT_TO_BE_REMOVED = { timeout: 5000 };

describe('PlanningEvent', () => {
  const defaultLeagueOps = {
    isLeague: false,
    isLeagueStaffUser: false,
  };

  let axiosGetSpy;
  let useDispatchSpy;
  let mockDispatch;

  const defaultLeaguePreferences = {
    league_game_team: false,
    league_game_team_lock_minutes: false,
    league_game_information: false,
  };

  const defaultLeagueMatchDayApiParams = {
    include_home_dmr: true,
    include_away_dmr: true,
    include_dmn_notification_status: true,
    include_dmr_notification_status: true,
    include_tv_channels: true,
    include_tv_game_contacts: true,
    include_rrule_instance: true,
  };

  const componentRender = ({
    isLeague = false,
    isLeagueStaffUser = false,
    leaguePreferences = defaultLeaguePreferences,
  }) => {
    useLeagueOperations.mockReturnValue({
      ...defaultLeagueOps,
      isLeague,
      isLeagueStaffUser,
    });

    usePreferences.mockReturnValue({
      preferences: leaguePreferences,
    });

    return renderWithRedux(<PlanningEvent />);
  };

  Object.defineProperty(window, 'location', {
    value: {
      pathname: '/planning_hub/events/2695162',
      href: 'http://localhost',
    },
  });

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
    axiosGetSpy = jest.spyOn(axios, 'get');
  });

  describe('default render', () => {
    it('calls the normal planning hub event api call', async () => {
      componentRender({});
      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback'),
        WAIT_FOR_ELEMENT_TO_BE_REMOVED
      );

      expect(axiosGetSpy).toHaveBeenCalledWith('/planning_hub/events/2695162', {
        params: {
          include_rrule_instance: true,
        },
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      });
    });
  });

  describe('Match day flow render', () => {
    beforeEach(() => {
      server.use(
        rest.get('/planning_hub/events/:eventId', (_, res, ctx) =>
          res(
            ctx.json({
              event: {
                ...mockEventData.event,
                league_setup: true,
                type: 'game_event',
              },
            })
          )
        )
      );
    });
    it('calls the default planning hub event api calls for the dmn/dmr in a league render', async () => {
      componentRender({
        isLeagueStaffUser: true,
        isLeague: true,
        leaguePreferences: {
          league_game_information: true,
          league_game_team: true,
          league_game_team_lock_minutes: false,
        },
      });
      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback'),
        WAIT_FOR_ELEMENT_TO_BE_REMOVED
      );

      expect(axiosGetSpy).toHaveBeenCalledWith('/planning_hub/events/2695162', {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_away_athletes: true,
          include_away_event_users: true,
          include_home_athletes: true,
          include_home_event_users: true,
          include_division: true,
          ...defaultLeagueMatchDayApiParams,
        },
      });
      expect(axiosGetSpy).toHaveBeenCalledWith('/planning_hub/events/5555', {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_dmr: true,
        },
      });
    });

    it('calls the lock version planning hub event api calls for the dmn/dmr in a league render', async () => {
      componentRender({
        isLeagueStaffUser: true,
        leaguePreferences: {
          league_game_information: true,
          league_game_team: true,
          league_game_team_lock_minutes: true,
        },
      });
      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback'),
        WAIT_FOR_ELEMENT_TO_BE_REMOVED
      );

      expect(axiosGetSpy).toHaveBeenCalledWith('/planning_hub/events/2695162', {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_away_athletes: true,
          include_away_event_users: true,
          include_game_participants_lock_time: true,
          include_home_athletes: true,
          include_home_event_users: true,
          ...defaultLeagueMatchDayApiParams,
        },
      });
      expect(axiosGetSpy).toHaveBeenCalledWith('/planning_hub/events/5555', {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_dmr: true,
          include_game_participants_lock_time: true,
        },
      });
    });

    it('calls the planning hub event api call in a club render', async () => {
      componentRender({
        isLeague: true,
        isLeagueStaffUser: false,
        leaguePreferences: {
          league_game_team: true,
          league_game_information: true,
          league_game_team_lock_minutes: true,
        },
      });
      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback'),
        WAIT_FOR_ELEMENT_TO_BE_REMOVED
      );

      expect(axiosGetSpy).toHaveBeenCalledWith('/planning_hub/events/2695162', {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_dmn_notification_status: true,
          include_dmr: true,
          include_dmr_notification_status: true,
          include_game_participants_lock_time: true,
          include_tv_channels: true,
          include_tv_game_contacts: true,
          include_rrule_instance: true,
          include_division: true,
        },
      });
    });

    describe('refetch compliance rules render', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it.each([
        ['club', false],
        ['league', true],
      ])(
        'calls the game compliance rules refetch to update state if the compliance rules completed are different for a %s user',
        async (userType, isLeagueUser) => {
          componentRender({
            isLeagueStaffUser: isLeagueUser,
            leaguePreferences: {
              league_game_team: true,
              league_game_information: true,
            },
          });

          await jest.advanceTimersByTimeAsync(10000);

          axiosGetSpy.mockReset();

          await jest.advanceTimersByTimeAsync(30000);

          expect(axiosGetSpy).toHaveBeenCalledWith(
            '/planning_hub/game_compliance/3692/rules'
          );

          await jest.advanceTimersByTimeAsync(40000);

          expect(axiosGetSpy).toHaveBeenCalledTimes(2);

          expect(mockDispatch).toHaveBeenCalledWith({
            payload: {
              status: 'SUCCESS',
              title:
                'Game compliance rules have been updated. Please refresh to get synced data!',
            },
            type: 'toasts/add',
          });
        }
      );

      it.each([
        ['club', false],
        ['league', true],
      ])(
        'does not call compliance rules refetch if it is not a game event for a %s user',
        async (userType, isLeagueUser) => {
          server.use(
            rest.get('/planning_hub/events/:eventId', (_, res, ctx) =>
              res(
                ctx.json({
                  event: {
                    ...mockEventData.event,
                    league_setup: true,
                  },
                })
              )
            )
          );

          componentRender({
            isLeagueStaffUser: isLeagueUser,
            leaguePreferences: {
              league_game_team: true,
              league_game_information: true,
            },
          });

          await jest.advanceTimersByTimeAsync(10000);

          axiosGetSpy.mockReset();

          await jest.advanceTimersByTimeAsync(30000);

          expect(axiosGetSpy).not.toHaveBeenCalledWith();

          await jest.advanceTimersByTimeAsync(40000);

          expect(axiosGetSpy).not.toHaveBeenCalledWith();
        }
      );
    });
  });
});
