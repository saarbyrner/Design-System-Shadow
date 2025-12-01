import { screen, waitFor } from '@testing-library/react';
import { axios } from '@kitman/common/src/utils/services';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import * as redux from 'react-redux';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import {
  useGetOrganisationQuery,
  useGetCurrentUserQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  useLazyGetEventsQuery,
  useGetEventsUpdatesQuery,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/fixturesAPI';
import { data as mockEventsData } from '@kitman/services/src/mocks/handlers/planningHub/getEvents';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { ClubPhysicianDMRRequiredRole } from '@kitman/modules/src/PlanningEvent/src/hooks/useUpdateDmrStatus';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import { EventsScheduleGridTranslated as EventsScheduleGrid } from '..';

jest.mock('@kitman/common/src/hooks/useLocationAssign');
jest.mock('@kitman/modules/src/PlanningHub/src/services/getEvents');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/fixturesAPI'
);
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

setI18n(i18n);
const i18nT = i18nextTranslateStub();
const onClickEditEvent = jest.fn();
const props = {
  eventFilters: {
    dateRange: { start_date: '', end_date: '' },
    eventTypes: [],
    competitions: [],
    include_game_kit_matrix: true,
    include_kit_matrix: true,
    include_time: true,
    gameDays: [],
    oppositions: [],
  },
  t: i18nT,
  onClickEditEvent,
};

const defaultPreferences = {
  manageLeagueGame: false,
};

const renderComponent = ({
  manageGameInformation = false,
  preferences = defaultPreferences,
} = {}) => {
  usePermissions.mockReturnValue({
    permissions: {
      leagueGame: {
        manageGameInformation,
      },
    },
  });

  usePreferences.mockReturnValue({
    preferences: {
      manage_league_game: preferences.manageLeagueGame,
    },
  });

  useGetEventsUpdatesQuery.mockReturnValue({ data: [], isError: false });

  renderWithRedux(<EventsScheduleGrid {...props} />, {
    useGlobalStore: false,
    preloadedState: {
      globalApi: {
        useGetOrganisationQuery: jest.fn(),
        useGetCurrentUserQuery: jest.fn(),
        useGetActiveSquadQuery: jest.fn(),
      },
      fixturesApi: {
        useLazyGetEventsQuery: jest.fn(),
      },
    },
  });
};

describe('EventsScheduleGrid', () => {
  const mockLocationAssign = jest.fn();

  const mockScheduleEvents = [
    {
      ...mockEventsData.events[0],
      home_dmr: ['players', 'subs', 'captain'],
      away_dmr: ['players', 'subs', 'captain', 'staff', 'lineup'],
      game_participants_lock_time: '2023-05-10T12:33:37.000Z',
      start_date: '2024-05-10T16:33:37.000Z',
      competition: {
        ...mockEventsData.events[0].competition,
        min_substitutes: 1,
        min_staffs: 1,
        required_designation_roles: [ClubPhysicianDMRRequiredRole],
      },
    },
    {
      ...mockEventsData.events[1],
      local_timezone: 'Japan',
      home_dmr: [],
      away_dmr: [],
      game_participants_lock_time: '2023-06-18T12:33:37.000Z',
      start_date: '2023-06-18T12:33:37.000Z',
      venue_type: { name: 'Away', id: 2 },
    },
    {
      ...mockEventsData.events[1],
      id: 123456,
      squad: { owner_name: 'Test Squad' },
      opponent_squad: { owner_name: 'Test Opp Squad' },
    },
  ];

  const mockGetEventsQueryResults = [
    jest.fn(),
    {
      isError: false,
      isLoading: false,
      currentData: { events: mockScheduleEvents, next_id: null },
    },
  ];

  beforeEach(() => {
    Date.now = jest.fn(() => new Date('2022-12-25T12:00:00Z'));

    useLocationAssign.mockReturnValue(mockLocationAssign);
    useGetOrganisationQuery.mockReturnValue({
      data: { association_admin: false },
    });
    useGetCurrentUserQuery.mockReturnValue({
      data: {
        type: 'User',
        role: '',
      },
    });
    useLazyGetEventsQuery.mockReturnValue(mockGetEventsQueryResults);
    useGetActiveSquadQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Test',
        owner_id: 1234,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When is league user', () => {
    let useDispatchSpy;
    let mockDispatch;

    beforeEach(() => {
      useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      mockDispatch = jest.fn();
      useDispatchSpy.mockReturnValue(mockDispatch);
      useGetOrganisationQuery.mockReturnValue({
        data: { association_admin: true },
      });
      useGetCurrentUserQuery.mockReturnValue({
        data: {
          type: 'User',
          role: 'Account Admin',
        },
      });
    });

    it('renders the grid header correctly', () => {
      renderComponent();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Away')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Match Day')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Countdown')).toBeInTheDocument();
      expect(screen.getByText('Kick Time')).toBeInTheDocument();
      expect(screen.getByText('DMR')).toBeInTheDocument();
    });

    it('renders the grid correctly', async () => {
      const { result } = renderHook(() => useLeagueOperations());
      expect(result.current.isLeague).toEqual(true);
      renderComponent();
      await waitFor(() => {
        expect(screen.queryByText('Squad 1')).toBeInTheDocument();
        expect(screen.queryByText('Squad 2')).toBeInTheDocument();
        const rowActionMenus = screen.queryAllByTestId('MoreVertIcon');
        expect(rowActionMenus.length).toBeGreaterThan(0);
      });
    });

    it('renders the correct date/time fields for the grid', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('05/10/2024')).toBeInTheDocument();
      });
      expect(screen.getByText('05:33 PM GMT')).toBeInTheDocument();
      expect(screen.getByText('06/18/2023')).toBeInTheDocument();
      expect(screen.getByText('09:33 PM JST')).toBeInTheDocument();
      expect(screen.getByText('06/23/2021')).toBeInTheDocument();
      expect(screen.getByText('12:10 PM GMT')).toBeInTheDocument();
    });

    it('renders the appropriate DMR column icons', async () => {
      renderComponent();
      await waitFor(() => {
        // partial
        expect(
          screen.getByTestId('CheckCircleOutlineIcon')
        ).toBeInTheDocument();
      });

      // complete
      expect(screen.getByTestId('CheckCircleOutlineIcon')).toBeInTheDocument();

      // not started
      expect(
        screen.getAllByTestId('RadioButtonUncheckedRoundedIcon').length
      ).toEqual(4);
    });

    describe('DMR unlock', () => {
      beforeEach(() => {
        Date.now = jest.fn(() => new Date('2023-05-10T12:35:37.000Z'));
      });

      it('allows the league user to unlock the locked DMR for the game', async () => {
        const patchSpy = jest.spyOn(axios, 'patch').mockResolvedValue({
          data: {
            event: { type: 'game_event', game_participants_lock_time: '' },
          },
        });
        const user = userEvent.setup();
        renderComponent();
        await waitFor(() => {
          expect(screen.getAllByTestId('LockIcon').length).toEqual(3);
        });
        expect(screen.getAllByTestId('LockIcon')[1]).toHaveStyle(
          'opacity: 0; font-size: 20px;'
        );
        await user.click(screen.getAllByTestId('MoreVertIcon')[0]);
        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        await user.click(screen.getByText('Unlock DMR'));
        expect(patchSpy).toHaveBeenCalledWith(
          '/planning_hub/events/1',
          {
            game_participants_unlocked: true,
            id: 1,
          },
          { params: { include_game_participants_lock_time: true } }
        );
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: { status: 'SUCCESS', title: 'DMR lock status changed' },
          type: 'toasts/add',
        });
      });

      it('does not allow a league user to unlock a game when it is past its start date', async () => {
        const user = userEvent.setup();
        renderComponent();
        await waitFor(() => {
          expect(screen.getAllByTestId('LockIcon').length).toEqual(3);
        });
        await user.click(screen.getAllByTestId('MoreVertIcon')[2]);
        await expect(() =>
          user.click(screen.getByText('Unlock DMR'))
        ).rejects.toThrow(/pointer-events: none/);
      });

      it('displays an error when the DMR unlock call fails', async () => {
        jest.spyOn(axios, 'patch').mockRejectedValue('new error');
        const user = userEvent.setup();
        renderComponent();
        await waitFor(() => {
          expect(screen.getAllByTestId('LockIcon').length).toEqual(3);
        });
        await user.click(screen.getAllByTestId('MoreVertIcon')[0]);
        await user.click(screen.getByText('Unlock DMR'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            status: 'ERROR',
            title: 'Failed to change DMR lock status',
          },
          type: 'toasts/add',
        });
      });
    });

    describe('Edit fixture when the manage_league_team preference and the manage game information permission is on', () => {
      beforeEach(() => {
        Date.now = jest.fn(() => new Date('2023-05-10T12:35:37.000Z'));
      });

      it('allows the league user to open the edit panel', async () => {
        const user = userEvent.setup();
        renderComponent({
          manageGameInformation: true,
          preferences: { manageLeagueGame: true },
        });
        await waitFor(() => {
          expect(screen.getAllByTestId('LockIcon').length).toEqual(3);
        });
        await user.click(screen.getAllByTestId('MoreVertIcon')[0]);
        await user.click(screen.getByText('Edit'));
        expect(onClickEditEvent).toHaveBeenCalledWith({
          away_dmr: ['players', 'subs', 'captain', 'staff', 'lineup'],
          background_color: '#FFFFFF',
          competition: {
            id: 1,
            name: 'Champions League',
            min_staffs: 1,
            min_substitutes: 1,
            required_designation_roles: [ClubPhysicianDMRRequiredRole],
          },
          created_at: '2021-10-14T09:07:23Z',
          duration: 90,
          end_date: '2021-10-23T12:32:00Z',
          game_participants_lock_time: '2023-05-10T12:33:37.000Z',
          home_dmr: ['players', 'subs', 'captain'],
          id: 1,
          kit_matrix: [
            {
              id: 1,
              kind: 'referee',
              kit_matrix: {
                division: null,
                division_id: null,
                id: 1,
                kind: 'referee',
                kit_matrix_items: [],
                name: 'Home Kit',
                organisation: null,
                primary_color: 'FF5733',
                secondary_color: 'C70039',
                squads: [],
              },
              kit_matrix_id: 1,
            },
          ],
          local_timezone: 'Europe/Dublin',
          mass_input: false,
          name: null,
          notification_schedule: {
            created_at: '2021-10-14T10:07:27.000+01:00',
            id: 471,
            scheduled_time: '2021-10-23T13:32:00+01:00',
            updated_at: '2021-10-14T10:07:27.000+01:00',
          },
          number_of_periods: 2,
          opponent_score: null,
          opponent_squad: {
            id: 11,
            logo_full_path: '',
            name: 'U16',
            owner_id: '22',
            owner_name: 'Opponent Squad 1',
          },
          opponent_team: { id: 1, name: 'Chelsea' },
          organisation_team: { id: 1, name: 'Team A' },
          recurrence: {
            original_start_time: '2024-06-04T16:50:00.000+01:00',
            recurring_event_id: 2222,
            rrule_instances: null,
            rule: 'FREQ=WEEKLY;INTERVAL=1;UNTIL=20240629T230000Z;BYDAY=MO,TU',
          },
          round_number: null,
          rpe_collection_athlete: true,
          rpe_collection_kiosk: true,
          score: null,
          squad: {
            id: 11,
            logo_full_path: '',
            name: 'U16',
            owner_id: '22',
            owner_name: 'Squad 1',
          },
          start_date: '2024-05-10T16:33:37.000Z',
          surface_quality: null,
          surface_type: null,
          temperature: null,
          type: 'game_event',
          updated_at: '2021-10-14T09:07:23Z',
          venue_type: { id: 1, name: 'Home' },
          weather: null,
        });
      });
    });
  });

  describe('When is not league user', () => {
    beforeEach(() => {
      useGetOrganisationQuery.mockReturnValue({
        data: { association_admin: true },
      });

      useGetCurrentUserQuery.mockReturnValue({
        data: {
          type: 'club user',
          registration: { user_type: '' },
        },
      });
    });
    it('renders the grid header correctly', () => {
      renderComponent();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Away')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Match Day')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Countdown')).toBeInTheDocument();
      expect(screen.getByText('Kick Time')).toBeInTheDocument();
      expect(screen.queryByText('DMR')).not.toBeInTheDocument();
    });

    it('renders the grid correctly', async () => {
      const { result } = renderHook(() => useLeagueOperations());
      expect(result.current.isLeague).toEqual(false);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Squad 1')).toBeInTheDocument();
      });
      expect(
        screen
          .getByText('Squad 1')
          .compareDocumentPosition(screen.getByText('Opponent Squad 1'))
      ).toEqual(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(
        screen
          .getByText('Opponent Squad 2')
          .compareDocumentPosition(screen.getByText('Squad 2'))
      ).toEqual(Node.DOCUMENT_POSITION_FOLLOWING);
      const rowActionMenus = screen.queryAllByTestId('MoreVertIcon');
      expect(rowActionMenus.length).toEqual(0);
    });
  });

  it('allows the user to click a grid row and navigate to the event url', async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(async () => {
      await user.click(screen.getByText('Squad 1'));
    });
    expect(mockLocationAssign).toHaveBeenCalledWith('/planning_hub/events/1');
  });

  it('displays "No events" message when there are no events', async () => {
    useLazyGetEventsQuery.mockReturnValue([
      jest.fn(),
      {
        isError: false,
        isLoading: false,
        currentData: { events: [], next_id: null },
      },
    ]);
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('No events scheduled')).toBeInTheDocument();
    });
  });
});
