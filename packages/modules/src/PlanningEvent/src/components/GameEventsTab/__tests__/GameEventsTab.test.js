import $ from 'jquery';
import selectEvent from 'react-select-event';
import * as redux from 'react-redux';
import { rest, server } from '@kitman/services/src/mocks/server';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { axios } from '@kitman/common/src/utils/services';
import { screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { goalEventButton } from '@kitman/common/src/utils/gameEventTestUtils';
import { apiActivityMock } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities/mock';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { data as formationCoordinatesChangedResponse } from '@kitman/services/src/mocks/handlers/planningEvent/getFormationPositionsCoordinates';
import { data as athleteEventsData } from '@kitman/services/src/mocks/handlers/planning/getAthleteEvents';

import {
  defaultProps,
  defaultStore,
  eventResponse,
  periodMock,
  newPeriodMock,
  newLocalGameActivities,
  eventMock,
  eventListActivities,
} from './gameEventsMockData';
import GameEventsTab from '..';

describe('GameEventsTab', () => {
  const componentRender = (props = defaultProps, mockStore = defaultStore) => {
    return renderWithRedux(<GameEventsTab {...props} />, {
      preloadedState: mockStore,
    });
  };

  beforeEach(() => {
    window.featureFlags = { 'planning-game-events-field-view': false };
    server.use(
      rest.patch('/planning_hub/events/122', (req, res, ctx) => {
        return res(ctx.json(eventResponse));
      })
    );
    server.use(
      rest.post(
        '/ui/planning_hub/events/122/game_periods/bulk_save',
        (req, res, ctx) => {
          return res(ctx.json(periodMock));
        }
      )
    );

    jest.spyOn(axios, 'get');
    jest.spyOn(axios, 'post');
    jest.spyOn(axios, 'patch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial render', () => {
    it('should render correctly and call the relevant apis', async () => {
      const axiosGetSpy = jest.spyOn(axios, 'get');
      const ajaxGetSpy = jest.spyOn($, 'ajax');

      componentRender();
      expect(screen.getAllByText('Game summary')[0]).toBeInTheDocument();
      expect(screen.queryByText('Pitch view')).not.toBeInTheDocument();

      expect(axiosGetSpy).not.toHaveBeenCalledWith('/ui/organisation_formats');
      expect(axiosGetSpy).not.toHaveBeenCalledWith('/ui/planning_hub/fields');
      expect(axiosGetSpy).toHaveBeenCalledWith('/ui/position_groups', {
        headers: { Accept: 'application/json' },
      });
      expect(ajaxGetSpy).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/planning_hub/formations',
      });
      expect(axiosGetSpy).toHaveBeenCalledWith('/participation_levels', {
        headers: { Accept: 'application/json' },
        params: { event_type: 'game_event', non_none: false },
      });
    });
  });

  describe('[feature-flag planning-game-events-field-view]', () => {
    beforeEach(() => {
      window.featureFlags = { 'planning-game-events-field-view': true };
    });

    afterEach(() => {
      window.featureFlags = { 'planning-game-events-field-view': false };
    });

    describe('initial player assignments render', () => {
      let useDispatchSpy;
      let mockDispatch;

      beforeEach(() => {
        useDispatchSpy = jest.spyOn(redux, 'useDispatch');
        mockDispatch = jest.fn();
        useDispatchSpy.mockReturnValue(mockDispatch);
      });

      afterEach(() => {
        useDispatchSpy.mockClear();
      });

      it('should call the relevant api calls', () => {
        componentRender();
        expect(axios.get).toHaveBeenCalledWith('/ui/organisation_formats');
        expect(axios.get).toHaveBeenCalledWith('/ui/planning_hub/fields');
      });

      it('should call a dispatch for setting the initial team', () => {
        componentRender(defaultProps, {
          planningEvent: {
            ...defaultStore.planningEvent,
            athleteEvents: {
              apiAthleteEvents: [athleteEventsData.athlete_events[0]],
            },
          },
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'pitchView/setTeam',
          payload: {
            inFieldPlayers: {},
            players: [athleteEventsData.athlete_events[0].athlete],
          },
        });
      });

      it('should render the pitch view initially with the button toggles', () => {
        componentRender();
        expect(screen.getByText('Pitch view')).toBeInTheDocument();
        expect(screen.getByText('List view')).toBeInTheDocument();
        expect(screen.getByTestId('pitch-container')).toBeInTheDocument();
        expect(
          screen.getByTestId('available-player-list-container')
        ).toBeInTheDocument();
      });

      it('should render the header scoreline', () => {
        componentRender();
        expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(2);
        expect(screen.getAllByRole('spinbutton')[1]).toHaveValue(3);
      });

      it('should render the period timeline', () => {
        componentRender();
        expect(screen.getByText('Period 1')).toBeInTheDocument();
        expect(screen.getByText('FT')).toBeInTheDocument();
      });

      it('should creates a default formation for the period when it doesnt exist', async () => {
        componentRender();
        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledWith({
            payload: [
              {
                absolute_minute: 0,
                minute: 0,
                kind: eventTypes.formation_change,
                relation: { id: 1, name: '2-3-3' },
              },
            ],
            type: 'gameActivities/setUnsavedGameActivities',
          });
        });
      });

      it('clicking the add period button should add more local periods', async () => {
        const user = userEvent.setup();
        componentRender();
        await user.click(screen.getByText('Add period'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
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
          type: 'eventPeriods/setUnsavedEventPeriods',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('clicking the delete icon on a period should send a call to remove it from the periods list', async () => {
        const user = userEvent.setup();
        componentRender(defaultProps, {
          planningEvent: {
            ...defaultStore.planningEvent,
            eventPeriods: {
              localEventPeriods: newPeriodMock,
              apiEventPeriods: periodMock,
            },
          },
        });
        await user.click(
          screen.getByTestId('period-2-bin-container').firstChild
        );
        await user.click(screen.getByText('Confirm'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              absolute_duration_end: 80,
              absolute_duration_start: 0,
              additional_duration: null,
              duration: 80,
              id: 10,
              name: 'Period 1',
              order: 9,
            },
          ],
          type: 'eventPeriods/setUnsavedEventPeriods',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('allows the user to change the format dropdown', async () => {
        const user = userEvent.setup();
        componentRender(defaultProps, {
          planningEvent: {
            ...defaultStore.planningEvent,
            pitchView: {
              ...defaultStore.planningEvent.pitchView,
              field: { id: 1 },
            },
          },
        });
        const gameFormatSelect = screen.getByTestId('GameFormatSelect');
        selectEvent.openMenu(
          gameFormatSelect.querySelector('.kitmanReactSelect input')
        );

        await selectEvent.select(
          gameFormatSelect.querySelector('.kitmanReactSelect'),
          '10v10'
        );

        jest.resetAllMocks();
        await user.click(screen.getByText('Change game format to Test Format'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: { id: 1, name: 'Test Format', number_of_players: 10 },
          type: 'pitchView/setSelectedGameFormat',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: { id: 1, name: '2-3-3', number_of_players: 10 },
          type: 'pitchView/setSelectedFormation',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            '1_3': formationCoordinatesChangedResponse[0],
            '2_4': formationCoordinatesChangedResponse[1],
          },
          type: 'pitchView/setFormationCoordinates',
        });
      });

      it('allows the user to reset the formation coordinates if the saved redux state and the RTK cache differ (could occur from a mid game formation switch', () => {
        componentRender(defaultProps, {
          planningEvent: {
            ...defaultStore.planningEvent,
            eventPeriods: {
              localEventPeriods: newPeriodMock,
              apiEventPeriods: periodMock,
            },
            pitchView: {
              ...defaultStore.planningEvent.pitchView,
              formationCoordinates: { '1_1': { formation_id: 100000000 } },
            },
          },
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {},
          type: 'pitchView/setFormationCoordinates',
        });
      });

      describe('saving event', () => {
        it('should display the save button if the score is changed', async () => {
          componentRender();
          expect(screen.queryByText('Save progress')).not.toBeInTheDocument();
          fireEvent.change(screen.getAllByRole('spinbutton')[1], {
            target: { value: '4' },
          });
          expect(screen.getByText('Save progress')).toBeInTheDocument();
        });

        it('clicking the save button updates the event and sends an api request off', async () => {
          const user = userEvent.setup();
          jest.spyOn(axios, 'patch');
          componentRender();
          fireEvent.change(screen.getAllByRole('spinbutton')[1], {
            target: { value: '4' },
          });
          await user.click(screen.getByText('Save progress'));
          expect(axios.patch).toHaveBeenCalledWith(
            '/planning_hub/events/122',
            {
              id: 122,
              opponent_score: 4,
              score: 2,
              type: 'game_event',
              duration: 80,
            },
            { params: {} }
          );
          expect(defaultProps.onUpdateEvent).toHaveBeenCalledWith({
            ...defaultProps.event,
            id: 1,
            opponent_score: 4,
            score: 2,
            type: 'game_event',
          });
          expect(screen.getByText('Game Progress Saved')).toBeInTheDocument();
        });

        it('displays the save button when periods are changed and clicking updates the periods and sends an api request off', async () => {
          const user = userEvent.setup();
          componentRender(defaultProps, {
            planningEvent: {
              ...defaultStore.planningEvent,
              eventPeriods: {
                localEventPeriods: newPeriodMock,
                apiEventPeriods: periodMock,
              },
            },
          });
          await user.click(screen.getByText('Save progress'));
          expect(axios.post).toHaveBeenCalledWith(
            `/ui/planning_hub/events/122/game_periods/bulk_save`,
            {
              game_periods: [...newPeriodMock],
            }
          );
          expect(mockDispatch).toHaveBeenCalledWith({
            payload: [
              {
                absolute_duration_end: 80,
                absolute_duration_start: 0,
                additional_duration: null,
                duration: 80,
                id: 10,
                name: 'Period 1',
                order: 9,
              },
            ],
            type: 'eventPeriods/setSavedEventPeriods',
          });
        });

        it('displays the save button when the game activities are ready to save it fires off the api and refetches athlete events', async () => {
          const user = userEvent.setup();
          jest.spyOn(axios, 'post').mockImplementationOnce(() => {
            return { data: newLocalGameActivities.localGameActivities };
          });
          const ajaxGetSpy = jest.spyOn($, 'ajax');
          componentRender(defaultProps, {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: newLocalGameActivities,
            },
          });

          await user.click(screen.getByText('Save progress'));
          expect(axios.post).toHaveBeenCalledWith(
            '/ui/planning_hub/events/122/game_periods/10/v2/game_activities/bulk_save',
            {
              game_activities: apiActivityMock,
            }
          );
          expect(mockDispatch).toHaveBeenCalledWith({
            payload: [
              {
                absolute_minute: 0,
                kind: eventTypes.formation_position_view_change,
                relation: { id: 1 },
              },
            ],
            type: 'gameActivities/setSavedGameActivities',
          });

          expect(ajaxGetSpy).toHaveBeenCalledWith({
            contentType: 'application/json',
            data: {
              include_designation: true,
              include_position_group: true,
              include_squad_name: true,
              include_squad_number: true,
              force_latest: true,
            },
            method: 'GET',
            url: '/planning_hub/events/122/athlete_events',
          });
        });

        it('displays the finish button when the assignment activities are present and clicking the finish button creates a formation_complete activity', async () => {
          const user = userEvent.setup();
          componentRender(defaultProps, {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: newLocalGameActivities,
            },
          });

          expect(screen.getByText('Finish period')).toBeInTheDocument();
          await user.click(screen.getByText('Finish period'));
          expect(mockDispatch).toHaveBeenCalledWith({
            payload: [
              {
                absolute_minute: 0,
                kind: eventTypes.formation_position_view_change,
                relation: { id: 1 },
              },
              {
                absolute_minute: 0,
                minute: 0,
                kind: eventTypes.formation_complete,
                relation: { id: undefined },
              },
            ],
            type: 'gameActivities/setUnsavedGameActivities',
          });
        });

        it('allows clicking the finish button to update a previously deleted formation_complete', async () => {
          const user = userEvent.setup();
          const mockLocalGameActivities = {
            ...newLocalGameActivities,
            localGameActivities: [
              ...newLocalGameActivities.localGameActivities,
              {
                id: 1,
                absolute_minute: 0,
                kind: eventTypes.formation_complete,
                relation: { id: undefined },
                delete: true,
              },
            ],
          };
          componentRender(defaultProps, {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: mockLocalGameActivities,
            },
          });

          await user.click(screen.getByText('Finish period'));
          expect(mockDispatch).toHaveBeenCalledWith({
            payload: [
              {
                absolute_minute: 0,
                kind: eventTypes.formation_position_view_change,
                relation: { id: 1 },
              },
              {
                absolute_minute: 0,
                delete: false,
                id: 1,
                kind: eventTypes.formation_complete,
                relation: { id: undefined },
              },
            ],
            type: 'gameActivities/setUnsavedGameActivities',
          });
        });
      });
    });

    describe('event list render', () => {
      let mockDispatch;
      let useDispatchSpy;

      beforeEach(async () => {
        useDispatchSpy = jest.spyOn(redux, 'useDispatch');
        mockDispatch = jest.fn();
        useDispatchSpy.mockReturnValue(mockDispatch);
      });

      afterEach(() => {
        useDispatchSpy.mockClear();
      });

      it('renders the event list area', () => {
        componentRender(defaultProps, {
          planningEvent: {
            ...defaultStore.planningEvent,
            gameActivities: eventListActivities,
          },
        });
        expect(screen.getByText('Event list')).toBeInTheDocument();
        expect(screen.getByText('Substitutions')).toBeInTheDocument();
      });

      it('clicking an event fires a dispatch for active event selection', async () => {
        const user = userEvent.setup();
        componentRender(defaultProps, {
          planningEvent: {
            ...defaultStore.planningEvent,
            gameActivities: eventListActivities,
          },
        });
        await user.click(
          screen.getByRole('button', {
            name: goalEventButton,
          })
        );
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: eventTypes.goal,
          type: 'pitchView/setActiveEventSelection',
        });
      });
    });

    describe('list view render', () => {
      const componentListViewRender = () =>
        componentRender(defaultProps, {
          planningEvent: {
            ...defaultStore.planningEvent,
            gameActivities: {
              localGameActivities: [
                {
                  absolute_minute: 0,
                  kind: eventTypes.formation_change,
                  relation: { id: 1 },
                },
              ],
              apiGameActivities: [
                {
                  absolute_minute: 0,
                  kind: eventTypes.formation_change,
                  relation: { id: 1 },
                },
              ],
            },
          },
        });

      it('should renders the list view when list view is clicked', async () => {
        const user = userEvent.setup();
        componentListViewRender();
        await user.click(screen.getByText('List view'));
        expect(screen.getAllByText('Game summary')[0]).toBeInTheDocument();
      });

      it('should render no period timeline the list view when list view is clicked initially', async () => {
        const user = userEvent.setup();
        componentListViewRender();
        await user.click(screen.getByText('List view'));
        expect(screen.queryByTestId('PeriodTimeline')).not.toBeInTheDocument();
      });

      it('should render the period timeline when clicking on a period in list view', async () => {
        const user = userEvent.setup();
        componentListViewRender();
        await user.click(screen.getByText('List view'));
        await user.click(screen.getAllByText('Period 1')[0]);
        expect(screen.getByTestId('PeriodTimeline')).toBeInTheDocument();
      });

      it('should render the period timeline when clicking back to the pitch view', async () => {
        const user = userEvent.setup();
        componentListViewRender();
        await user.click(screen.getByText('List view'));
        await user.click(screen.getByText('Pitch view'));
        expect(screen.getByTestId('PeriodTimeline')).toBeInTheDocument();
      });

      it('adds a period when the list view add period is clicked', async () => {
        const user = userEvent.setup();
        componentListViewRender();
        await user.click(screen.getByText('List view'));
        await user.click(screen.getAllByText('Add period')[0]);
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
        expect(screen.getByText('Game Period Added')).toBeInTheDocument();
      });

      it('deletes a period when the list view delete period is clicked', async () => {
        const user = userEvent.setup();
        componentListViewRender();
        await user.click(screen.getByText('List view'));
        await user.click(screen.getByTestId('PeriodsSidePanel|PeriodTitle'));
        await user.click(screen.getAllByRole('button')[9]);
        await user.click(screen.getByText('Delete'));
        await user.click(screen.getByText('Confirm'));
        expect(axios.post).toHaveBeenCalledWith(
          '/ui/planning_hub/events/122/game_periods/bulk_save',
          {
            game_periods: [
              {
                absolute_duration_end: NaN,
                absolute_duration_start: -1,
                additional_duration: null,
                delete: true,
                duration: Infinity,
                id: 10,
                name: 'DELETE',
                order: 9,
              },
            ],
          }
        );
        expect(screen.getByText('Game Period Deleted')).toBeInTheDocument();
      });
    });

    describe('[feature-flag games-custom-duration-and-additional-time] saving custom periods', () => {
      const mockPreCustomPeriods = [
        {
          ...periodMock[0],
          duration: 60,
          absolute_duration_start: 0,
          absolute_duration_end: 60,
        },
        {
          localId: 11,
          name: 'Period 2',
          duration: 30,
          additional_duration: null,
          order: 9,
          absolute_duration_start: 60,
          absolute_duration_end: 90,
        },
      ];

      const customPeriodComponentRender = () =>
        componentRender(
          {
            ...defaultProps,
            event: { ...eventMock, custom_period_duration_enabled: true },
          },
          {
            planningEvent: {
              ...defaultStore.planningEvent,
              eventPeriods: {
                localEventPeriods: mockPreCustomPeriods,
                apiEventPeriods: periodMock,
              },
            },
          }
        );

      beforeEach(() => {
        window.featureFlags['games-custom-duration-and-additional-time'] = true;
      });

      afterEach(() => {
        window.featureFlags[
          'games-custom-duration-and-additional-time'
        ] = false;
      });

      it('allows the user to add a period with a custom duration and save it', async () => {
        const user = userEvent.setup();
        customPeriodComponentRender();
        await user.click(screen.getAllByText('Add period')[0]);
        expect(screen.getByText('Custom Period Times')).toBeInTheDocument();
        fireEvent.change(screen.getAllByDisplayValue('')[7], {
          target: { value: '20' },
        });
        fireEvent.blur(screen.getByDisplayValue('20'));
        await user.click(screen.getByText('Confirm'));
        await user.click(screen.getByText('Save progress'));
        expect(axios.patch).toHaveBeenCalledWith(
          '/planning_hub/events/122',
          {
            duration: 110,
            id: 122,
            opponent_score: 3,
            score: 2,
            type: 'game_event',
          },
          { params: {} }
        );
      });

      it('allows a user to delete a period with a custom duration and save it', async () => {
        const user = userEvent.setup();
        customPeriodComponentRender();
        await user.click(
          screen.getByTestId('period-2-bin-container').firstChild
        );
        expect(screen.getByText('Delete Period 2')).toBeInTheDocument();
        await user.click(screen.getByText('Confirm'));
        await user.click(screen.getByText('Save progress'));
        expect(axios.patch).toHaveBeenCalledWith(
          '/planning_hub/events/122',
          {
            duration: 60,
            id: 122,
            opponent_score: 3,
            score: 2,
            type: 'game_event',
          },
          { params: {} }
        );
      });

      it('selects the first period by default', () => {
        customPeriodComponentRender();
        const firstPeriod = screen.getAllByTestId('Period')[0];
        expect(
          within(firstPeriod).getByTestId('current-dot-period')
        ).toBeInTheDocument();
      });
    });

    describe('[feature-flag game-formations-editor] render', () => {
      beforeEach(() => {
        window.featureFlags['game-formations-editor'] = true;
      });

      afterEach(() => {
        window.featureFlags['game-formations-editor'] = false;
      });

      it('renders the edit formations button', async () => {
        const user = userEvent.setup();
        componentRender();
        expect(screen.getByText('Edit formations')).toBeInTheDocument();
        await user.click(screen.getByText('Edit formations'));
        expect(screen.getByText('Update formation')).toBeInTheDocument();
      });
    });

    describe('[feature-flag set-overall-game-minutes] render', () => {
      beforeEach(() => {
        window.featureFlags['set-overall-game-minutes'] = true;
      });

      afterEach(() => {
        window.featureFlags['set-overall-game-minutes'] = false;
      });

      it('fires off the getAthletePlayTimes api call', async () => {
        componentRender();
        expect(axios.get).toHaveBeenCalledWith(
          '/ui/planning_hub/events/122/athlete_play_times'
        );
      });

      it('refetches the athlete play times when there are game activities saved', async () => {
        const user = userEvent.setup();
        componentRender(defaultProps, {
          planningEvent: {
            ...defaultStore.planningEvent,
            gameActivities: {
              localGameActivities: [eventListActivities.localGameActivities],
              apiGameActivities: [],
            },
          },
        });
        jest.resetAllMocks();
        await user.click(screen.getByText('Save progress'));
        expect(axios.get).toHaveBeenCalledWith(
          '/ui/planning_hub/events/122/athlete_play_times'
        );
      });

      it('allows the user to save athlete play time changes when changes are made', async () => {
        const user = userEvent.setup();
        const ajaxGetSpy = jest.spyOn($, 'ajax');
        componentRender(defaultProps, {
          planningEvent: {
            ...defaultStore.planningEvent,
            athleteEvents: {
              apiAthleteEvents: athleteEventsData.athlete_events.slice(0, 1),
            },
            gameActivities: {
              localGameActivities: eventListActivities.localGameActivities,
              apiGameActivities: eventListActivities.localGameActivities,
            },
          },
        });
        await user.click(screen.getByText('List view'));
        await user.click(screen.getAllByText('Period 1')[0]);
        await user.click(screen.getAllByTestId('TotalTime|Sum Editable')[0]);
        await user.type(screen.getAllByRole('spinbutton')[4], '20');
        await user.keyboard('[Escape]');
        await user.click(screen.getByText('Save progress'));
        expect(axios.post).toHaveBeenCalledWith(
          '/ui/planning_hub/events/122/athlete_play_times/bulk_save',
          {
            athlete_play_times: [
              { athlete_id: 80524, game_period_id: 10, minutes: 20 },
            ],
          }
        );
        expect(ajaxGetSpy).toHaveBeenCalledWith({
          method: 'GET',
          url: '/ui/planning_hub/events/122/game_activities',
        });
      });
    });
  });
});
