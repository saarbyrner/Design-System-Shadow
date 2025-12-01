import * as redux from 'react-redux';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { rest, server } from '@kitman/services/src/mocks/server';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { data as eventDataRows } from '@kitman/services/src/mocks/handlers/planning/getEventsUsers';
import { axios } from '@kitman/common/src/utils/services';
import { ClubPhysicianDMRRequiredRole } from '@kitman/modules/src/PlanningEvent/src/hooks/useUpdateDmrStatus';

import StaffSelectionGame from '../index';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

let mockDispatch;

beforeEach(() => {
  mockDispatch = jest.fn();
  jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);
});

afterEach(() => {
  jest.resetAllMocks();
});

const defaultLeagueOps = { isLeague: false, isLeagueStaffUser: false };

const defaultStore = {
  planningEvent: {
    athleteEvents: { apiAthleteEvents: [] },
    eventPeriods: {
      localEventPeriods: [
        {
          id: 1,
          absolute_duration_start: 0,
          absolute_duration_end: 90,
          duration: 90,
          name: 'Period 1',
        },
      ],
    },
    gameActivities: {
      localGameActivities: [
        {
          kind: 'formation_change',
          absolute_minute: 0,
          relation: { number_of_players: 20 },
        },
      ],
    },
  },
};

const defaultProps = {
  requestStatus: 'SUCCESS',
  event: {
    id: 1,
    event_users: [],
    type: 'game_event',
    competition: { min_substitutes: 5, min_staffs: 2, show_captain: true },
    venue_type: { name: 'Home' },
    league_setup: true,
    dmr: [],
  },
  leagueEvent: {},
  onUpdateEvent: jest.fn(),
  onUpdateLeagueEvent: jest.fn(),
  t: i18nextTranslateStub(),
};

const incompletePhysicianDmrEvent = {
  ...defaultProps.event,
  competition: {
    ...defaultProps.event.competition,
    show_captain: true,
    required_designation_roles: [ClubPhysicianDMRRequiredRole],
  },
};

const componentRender = ({
  props = defaultProps,
  leagueOpsPerms = defaultLeagueOps,
  leaguePreferences = {
    league_game_team: false,
    league_game_team_lock_minutes: false,
  },
}) => {
  useLeagueOperations.mockReturnValue(leagueOpsPerms);

  usePreferences.mockReturnValue({
    preferences: leaguePreferences,
  });

  return renderWithRedux(<StaffSelectionGame {...props} />, {
    preloadedState: defaultStore,
    useGlobalStore: true,
  });
};

describe('StaffSelectionGame render', () => {
  describe('default render', () => {
    it('renders the game event staff selection tab', async () => {
      componentRender({});
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByText('Staff')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
    });

    it('updates the event with the appropriate event users from the event users endpoint on initial load', async () => {
      componentRender({});
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );

      expect(defaultProps.onUpdateEvent).toHaveBeenCalledWith(
        {
          ...defaultProps.event,
          event_users: eventDataRows,
        },
        true
      );
    });

    it('allows the search bar to filter staff', async () => {
      const user = userEvent.setup();
      componentRender({});

      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );

      expect(screen.getAllByRole('row')).toHaveLength(4);
      const wrapper = screen.getByTestId('search-bar');
      const searchBar = wrapper.querySelector('input');
      fireEvent.change(searchBar, { target: { value: 'step' } });
      expect(screen.getAllByRole('row').length).toEqual(2);
      await user.clear(searchBar);
      expect(screen.getAllByRole('row')).toHaveLength(4);
    });

    it('displays a message when no staff matches the search', async () => {
      componentRender({});
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      const wrapper = screen.getByTestId('search-bar');
      const searchBar = wrapper.querySelector('input');
      fireEvent.change(searchBar, { target: { value: 'nonexistent' } });
      expect(screen.getByText('No staff added')).toBeInTheDocument();
    });
  });
  describe('Match day flow render: league_game_team preferences', () => {
    beforeEach(() => {
      server.use(
        rest.get(
          '/planning_hub/game_compliance/:event_id/rules',
          (req, res, ctx) =>
            res(
              ctx.json([
                {
                  staff: {
                    compliant: true,
                    message: '',
                  },
                },
              ])
            )
        )
      );
    });
    it('renders the appropriate banner at the bottom', async () => {
      componentRender({
        props: {
          ...defaultProps,
          event: {
            ...incompletePhysicianDmrEvent,
            game_participants_lock_time: '2020-09-18T10:28:52Z',
            game_participants_unlocked: false,
          },
        },
        leaguePreferences: {
          league_game_team: true,
        },
      });
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(screen.getByText('Select players (min 25)')).toBeInTheDocument();
      expect(screen.getByText('Select captain')).toBeInTheDocument();
      expect(screen.getByText('Select starting 20')).toBeInTheDocument();
      expect(screen.getByText('Substitutions (min 5)')).toBeInTheDocument();
      expect(
        screen.getByText('Select staff personnel (min 2)')
      ).toBeInTheDocument();
      expect(screen.getByText('Select club physician')).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('does not allow changes to be made when locked without the correct permission as a league user', async () => {
      componentRender({
        props: {
          ...defaultProps,
          event: {
            ...defaultProps.event,
            game_participants_lock_time: '2020-09-18T10:28:52Z',
            game_participants_unlocked: false,
          },
        },
        leagueOpsPerms: { isLeague: true, isLeagueStaffUser: true },
        leaguePreferences: {
          league_game_team: true,
          league_game_team_lock_minutes: true,
        },
      });
      expect(screen.getAllByRole('button')[0]).toBeDisabled();
    });

    it('does not allow changes to be made when locked past the lock time as a club user', async () => {
      componentRender({
        props: {
          ...defaultProps,
          event: {
            ...defaultProps.event,
            game_participants_lock_time: '2020-09-18T10:28:52Z',
            game_participants_unlocked: false,
          },
        },
        leaguePreferences: {
          league_game_team: true,
          league_game_team_lock_minutes: true,
        },
      });
      expect(screen.getAllByRole('button')[0]).toBeDisabled();
    });

    it('allows changes to be made, when the preference is turned off in the normal staff selection flow', () => {
      componentRender({
        props: {
          ...defaultProps,
          event: {
            ...defaultProps.event,
            game_participants_lock_time: '2020-09-18T10:28:52Z',
            game_participants_unlocked: false,
          },
        },
      });

      expect(screen.getAllByRole('button')[0]).toBeEnabled();
    });

    it('fires off an api call to refetch the game compliance rules to update the event', async () => {
      const saveEventSpy = jest.spyOn(axios, 'patch');
      const getAxiosSpy = jest.spyOn(axios, 'get');
      componentRender({
        props: defaultProps,
        leagueOpsPerms: { isLeague: true },
        leaguePreferences: { league_game_team: true },
      });
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(saveEventSpy).not.toHaveBeenCalledWith();
      expect(getAxiosSpy).toHaveBeenCalledWith(
        '/planning_hub/game_compliance/1/rules'
      );
      expect(defaultProps.onUpdateEvent).toHaveBeenCalledTimes(1);
      expect(defaultProps.onUpdateEvent).toHaveBeenCalledWith(
        {
          ...defaultProps.event,
          dmr: ['staff'],
          event_users: eventDataRows,
        },
        true
      );
      expect(defaultProps.onUpdateLeagueEvent).toHaveBeenCalledWith({
        home_dmr: ['staff'],
      });
    });
  });
});
