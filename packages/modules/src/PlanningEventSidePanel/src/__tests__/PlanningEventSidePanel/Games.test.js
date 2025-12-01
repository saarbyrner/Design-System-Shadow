/* eslint-disable camelcase */
import 'core-js/stable/structured-clone';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';

import { axios } from '@kitman/common/src/utils/services';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { useGetNotificationTriggersQuery } from '@kitman/services/src/services/OrganisationSettings/Notifications';

import { saveEvent, componentRender } from './testHelpers';
// eslint-disable-next-line jest/no-mocks-import
import {
  customPeriodsSaved,
  gameEvent,
  gameEventWithCustomLocalPeriods,
  gameEventWithCustomSavedPeriods,
  periodMock,
  savedGameEvent,
  undefinedFields,
} from '../../__mocks__/PlanningEventSidePanel';

const mockDispatch = jest.fn();

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetActiveSquadQuery: jest.fn(),
}));
jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock(
  '@kitman/services/src/services/OrganisationSettings/Notifications',
  () => {
    return {
      ...jest.requireActual(
        '@kitman/services/src/services/OrganisationSettings/Notifications'
      ),
      useGetNotificationTriggersQuery: jest.fn(),
    };
  }
);

const mockUseGetNotificationTriggersQuery = useGetNotificationTriggersQuery;

const mockDefaultTriggers = [
  {
    area: 'event',
    enabled_channels: {
      staff: ['email'],
      athlete: ['push'],
    },
  },
];

describe('Games', () => {
  let component;
  let saveGameEventEditRequest;

  const getActiveSquadMock = {
    data: {
      id: 8,
      name: 'International Squad',
      owner_id: 1234,
    },
    isSuccess: true,
  };

  beforeEach(() => {
    useLeagueOperations.mockReturnValue({
      isLeague: false,
      isOfficial: false,
    });

    mockUseGetNotificationTriggersQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockDefaultTriggers,
    });

    moment.tz.setDefault('UTC');

    saveGameEventEditRequest = jest
      .spyOn(axios, 'patch')
      .mockImplementation(() => {
        return { data: savedGameEvent };
      });
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders the correct titles for each Game event panelMode', async () => {
    component = await componentRender('SLIDING', gameEvent, 'CREATE', {
      createNewEventType: 'game_event',
    });
    expect(component.getByText('New Game')).toBeInTheDocument();
    component = await componentRender('SLIDING', gameEvent, 'DUPLICATE', {
      createNewEventType: 'game_event',
    });
    expect(component.getByText('Duplicate Game')).toBeInTheDocument();
    component = await componentRender('SLIDING', gameEvent, 'EDIT', {
      createNewEventType: 'game_event',
    });
    expect(component.getByText('Edit Game')).toBeInTheDocument();
  });

  it('fails validation when save is clicked and scroll into view', async () => {
    const user = userEvent.setup();
    component = await componentRender('SLIDING', gameEvent, 'EDIT');
    await user.type(component.getAllByRole('spinbutton')[1], '[Backspace]');
    await user.click(component.getByText('Save'));
    expect(saveGameEventEditRequest).not.toHaveBeenCalled();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  describe("with 'event-notifications' FF", () => {
    const modalTitle = 'Confirm you would like to notify selected recipients?';

    beforeAll(() => {
      // Mock scrollIntoView to prevent errors in tests where validation fails
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    beforeEach(() => {
      window.setFlag('event-notifications', true);
    });

    it('should open the notification modal upon clicking save if a key field has changed', async () => {
      const user = userEvent.setup();
      await componentRender('SLIDING', gameEvent, 'EDIT');

      // According to `haveKeyFieldsChanged` in the component, changing the opposition
      // is a key change that should trigger the notification modal.
      await user.click(screen.getByLabelText('Opposition'));
      // We need to wait for the options to be available in the dropdown
      const newOpposition = await screen.findByText('Chelsea');
      await user.click(newOpposition);

      await user.click(screen.getByText('Save'));

      expect(screen.getByText(modalTitle)).toBeInTheDocument();
    });

    it('should NOT open the notification modal if default channels are empty', async () => {
      mockUseGetNotificationTriggersQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        data: [
          {
            area: 'event',
            enabled_channels: {
              staff: [],
              athlete: [],
            },
          },
        ],
      });

      const user = userEvent.setup();
      await componentRender('SLIDING', gameEvent, 'EDIT');

      await user.click(screen.getByLabelText('Opposition'));
      const newOpposition = await screen.findByText('Chelsea');
      await user.click(newOpposition);

      await user.click(screen.getByText('Save'));

      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
    });

    it('should NOT open the notification modal in EDIT mode if no key fields have changed', async () => {
      const user = userEvent.setup();
      await componentRender('SLIDING', gameEvent, 'EDIT');

      // Click save without changing any fields
      await user.click(screen.getByText('Save'));

      // The modal should not appear
      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
    });

    it('should always open the notification modal upon clicking save in CREATE mode', async () => {
      const user = userEvent.setup();
      // For CREATE mode, haveKeyFieldsChanged() always returns true.
      // We just need to ensure the form is valid so the save button is enabled.
      await componentRender('SLIDING', gameEvent, 'CREATE');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await waitFor(() => {
        expect(saveButton).toBeEnabled();
      });

      await user.click(saveButton);

      expect(screen.getByText(modalTitle)).toBeInTheDocument();
    });
  });

  describe('Game Details render', () => {
    beforeEach(() => {
      window.setFlag('game-details', true);
      useGetActiveSquadQuery.mockReturnValue(getActiveSquadMock);
    });

    it('renders out the game details v2 panel', async () => {
      component = await componentRender('SLIDING', gameEvent, 'EDIT', {
        createNewEventType: 'game_event',
      });
      expect(component.getByText('Game Details')).toBeInTheDocument();
    });
  });

  describe('Game Details Custom Periods', () => {
    beforeEach(() => {
      window.setFlag('game-details', true);
      window.setFlag('games-custom-duration-and-additional-time', true);

      useGetActiveSquadQuery.mockReturnValue(getActiveSquadMock);

      jest.spyOn(axios, 'post').mockImplementationOnce(() => {
        return { data: savedGameEvent };
      });
      jest.spyOn(axios, 'post').mockImplementationOnce(() => {
        return { data: periodMock };
      });
      jest.spyOn(axios, 'post').mockImplementationOnce(() => {
        return { data: periodMock };
      });
    });

    it('allows the user to save a new game event with custom periods', async () => {
      component = await componentRender(
        'SLIDING',
        gameEventWithCustomLocalPeriods,
        'CREATE'
      );
      await userEvent.click(component.getByText('Custom'));
      fireEvent.change(screen.getAllByRole('spinbutton')[5], {
        target: { value: '80' },
      });
      fireEvent.blur(screen.getAllByRole('spinbutton')[5]);

      await userEvent.click(component.getByText('Save'));

      const {
        organisation_team,
        title,
        venue_type,
        start_date,
        id,
        ...restGameEvent
      } = gameEvent;

      expect(axios.post).toHaveBeenCalledWith(
        '/planning_hub/events?no_period=1',
        {
          ...undefinedFields,
          ...restGameEvent,
          attached_links_attributes: undefined,
          competition_id: 2,
          custom_periods: [
            {
              absolute_duration_end: 80,
              absolute_duration_start: 0,
              duration: 80,
              name: 'Period 1',
            },
            {
              absolute_duration_end: 110,
              absolute_duration_start: 80,
              duration: 30,
              name: 'Period 2',
            },
          ],
          duration: 110,
          editable: false,
          event_collection_complete: false,
          name: undefined,
          opponent_score: 2,
          organisation_team_id: 1479,
          team_id: 76,
          venue_type_id: 2,
          start_time: start_date,
          custom_period_duration_enabled: true,
          send_notifications: false,
        },
        { params: {} }
      );

      expect(axios.post).toHaveBeenCalledWith(
        '/ui/planning_hub/events/2/game_periods/bulk_save',
        {
          game_periods: [
            {
              absolute_duration_end: 80,
              absolute_duration_start: 0,
              duration: 80,
              name: 'Period 1',
            },
            {
              absolute_duration_end: 110,
              absolute_duration_start: 80,
              duration: 30,
              name: 'Period 2',
            },
          ],
        }
      );

      expect(axios.post).toHaveBeenCalledWith(
        '/ui/planning_hub/events/2/game_periods/10/v2/game_activities/bulk_save',
        {
          game_activities: [
            {
              absolute_minute: 0,
              kind: 'formation_change',
              minute: 0,
              relation: { id: 4, name: '4-5-1' },
            },
          ],
        }
      );
    });

    it('allows the user to save a existing game event with custom periods', async () => {
      component = await componentRender(
        'SLIDING',
        gameEventWithCustomSavedPeriods,
        'EDIT'
      );
      await userEvent.click(component.getByText('Custom'));
      fireEvent.change(screen.getAllByRole('spinbutton')[5], {
        target: { value: '80' },
      });
      fireEvent.blur(screen.getAllByRole('spinbutton')[5]);

      await userEvent.click(component.getByText('Save'));

      const {
        organisation_team,
        title,
        venue_type,
        start_date,
        ...restGameEvent
      } = gameEvent;
      expect(saveGameEventEditRequest).toHaveBeenCalledWith(
        '/planning_hub/events/2',
        {
          ...undefinedFields,
          ...restGameEvent,
          attached_links_attributes: undefined,
          competition_id: 2,
          custom_periods: customPeriodsSaved,
          duration: 110,
          editable: false,
          event_collection_complete: false,
          name: undefined,
          opponent_score: 2,
          organisation_team_id: 1479,
          team_id: 76,
          venue_type_id: 2,
          start_time: start_date,
          custom_period_duration_enabled: true,
          send_notifications: false,
        },
        { params: {} }
      );
    });
  });

  describe('Game Details Custom Opposition Name', () => {
    beforeEach(() => {
      window.setFlag('game-details', true);
      window.setFlag('manually-add-opposition-name', true);

      useGetActiveSquadQuery.mockReturnValue(getActiveSquadMock);

      jest.spyOn(axios, 'post').mockImplementation(() => {
        return { data: periodMock };
      });
      jest.spyOn(axios, 'delete');
    });

    it('allows the user to create a new custom name', async () => {
      component = await componentRender('SLIDING', gameEvent, 'EDIT');
      await userEvent.click(screen.getByLabelText('Opposition'));
      await userEvent.click(screen.getByText('Custom'));
      await waitFor(() => {
        expect(screen.getByText('Custom Opposition Name')).toBeInTheDocument();
      });
      fireEvent.change(screen.getAllByDisplayValue('')[4], {
        target: { value: 'Test Custom Name' },
      });
      await userEvent.click(component.getByText('Save'));
      expect(axios.post).toHaveBeenCalledWith('/custom_teams', {
        name: 'Test Custom Name',
      });
    });

    it('allows the user to update a custom name', async () => {
      component = await componentRender(
        'SLIDING',
        {
          ...gameEvent,
          opponent_team: { id: 50, name: 'Test Custom Name', custom: true },
        },
        'EDIT'
      );
      await waitFor(() => {
        expect(screen.getByText('Custom Opposition Name')).toBeInTheDocument();
      });
      fireEvent.change(screen.getByDisplayValue('Test Custom Name'), {
        target: { value: 'Test Custom Name Updated' },
      });
      await userEvent.click(component.getByText('Save'));
      expect(axios.patch).toHaveBeenCalledWith('/custom_teams/50', {
        name: 'Test Custom Name Updated',
      });
    });

    it('allows the user to delete a custom name when changing the opposition to a non custom', async () => {
      component = await componentRender(
        'SLIDING',
        {
          ...gameEvent,
          opponent_team: { id: 50, name: 'Test Custom Name', custom: true },
        },
        'EDIT'
      );
      await userEvent.click(screen.getByLabelText('Opposition'));
      await userEvent.click(screen.getByText('Chelsea'));
      await userEvent.click(component.getByText('Save'));
      expect(axios.delete).toHaveBeenCalledWith('/custom_teams/50');
    });
  });

  describe('Game Details periods Enabled Saving', () => {
    describe('saving with more periods than before', () => {
      const onUpdatedEventDetailsCallback = jest.fn();
      beforeEach(async () => {
        window.setFlag('game-details', true);

        useGetActiveSquadQuery.mockReturnValue({
          data: {
            id: 8,
            name: 'International Squad',
            owner_id: 1234,
          },
          isSuccess: true,
        });

        jest.spyOn(axios, 'post').mockImplementation(() => {
          return { data: periodMock };
        });
        component = await componentRender('SLIDING', gameEvent, 'EDIT', {
          onUpdatedEventDetailsCallback,
        });
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('Saves the event details after changing the duration and adding periods', async () => {
        await userEvent.type(component.getByDisplayValue('60'), '100');
        fireEvent.change(component.getAllByDisplayValue('2')[1], {
          target: { value: 4 },
        });
        expect(onUpdatedEventDetailsCallback).toHaveBeenCalled();

        await userEvent.click(component.getByText('Save'));

        const {
          organisation_team,
          title,
          venue_type,
          start_date,
          ...restGameEvent
        } = gameEvent;

        expect(saveGameEventEditRequest).toHaveBeenCalledWith(
          '/planning_hub/events/2',
          {
            ...undefinedFields,
            ...restGameEvent,
            attached_links_attributes: undefined,
            competition_id: 2,
            custom_periods: [],
            duration: '60100',
            editable: false,
            event_collection_complete: false,
            name: undefined,
            number_of_periods: 4,
            organisation_team_id: 1479,
            custom_period_duration_enabled: false,
            start_time: '2021-07-12T10:00:16+00:00',
            team_id: 76,
            venue_type_id: 2,
            send_notifications: false,
          },
          { params: {} }
        );

        expect(axios.post).toHaveBeenCalledWith(
          '/ui/planning_hub/events/2/game_periods/bulk_save',
          {
            game_periods: [
              {
                absolute_duration_end: 33,
                absolute_duration_start: 0,
                additional_duration: null,
                duration: 33,
                id: 10,
                name: 'Period 1',
                order: 9,
              },
              {
                absolute_duration_end: 66,
                absolute_duration_start: 33,
                additional_duration: null,
                duration: 33,
                id: 10,
                name: 'Period 11',
                order: 9,
              },
              {
                absolute_duration_end: 100,
                absolute_duration_start: 66,
                duration: 34,
                localId: 11,
                name: 'Period 3',
              },
            ],
          }
        );

        expect(axios.post).toHaveBeenCalledWith(
          '/ui/planning_hub/events/2/game_periods/10/v2/game_activities/bulk_save',
          {
            game_activities: [
              {
                absolute_minute: 0,
                kind: 'formation_change',
                relation: { id: 1 },
              },
            ],
          }
        );
      });
    });

    describe('saving with less periods than before', () => {
      beforeEach(async () => {
        window.setFlag('game-details', true);
        window.setFlag('event-attachments', true);

        jest.clearAllMocks();

        useGetActiveSquadQuery.mockReturnValue({
          data: {
            id: 8,
            name: 'International Squad',
            owner_id: 1234,
          },
          isSuccess: true,
        });
        saveGameEventEditRequest = jest
          .spyOn(axios, 'patch')

          .mockImplementation(() => {
            return {
              data: {
                event: { ...savedGameEvent.event, number_of_periods: 1 },
              },
            };
          });

        jest.spyOn(axios, 'post').mockImplementation(() => {
          return { data: periodMock };
        });

        component = await componentRender('SLIDING', gameEvent, 'EDIT');
      });

      it('Saves the event details after changing the duration and reducing the periods', async () => {
        await userEvent.type(component.getByDisplayValue('60'), '100');
        fireEvent.change(component.getAllByDisplayValue('2')[1], {
          target: { value: 1 },
        });

        await userEvent.click(component.getByText('Save'));

        expect(axios.post).toHaveBeenCalledWith(
          '/ui/planning_hub/events/2/game_periods/bulk_save',
          {
            game_periods: [
              {
                absolute_duration_end: 100,
                absolute_duration_start: 0,
                additional_duration: null,
                duration: 100,
                id: 10,
                name: 'Period 1',
                order: 9,
              },
              {
                absolute_duration_end: 100,
                absolute_duration_start: -1,
                additional_duration: null,
                delete: true,
                duration: 100,
                id: 10,
                name: 'DELETE',
                order: 9,
              },
            ],
          }
        );

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: periodMock,
          type: 'eventPeriods/setSavedEventPeriods',
        });
      });
    });
  });

  describe('Game Details - Hidden Fields', () => {
    beforeEach(() => {
      window.setFlag('game-details', true);
      window.setFlag('hide-format-and-fixture-rating', true);
      useGetActiveSquadQuery.mockReturnValue(getActiveSquadMock);
    });

    it('does not render out the format and fixture rating fields', async () => {
      component = await componentRender('SLIDING', gameEvent, 'EDIT', {
        createNewEventType: 'game_event',
      });
      expect(component.queryByText('Format')).not.toBeInTheDocument();
      expect(component.queryByText('Fixture Rating')).not.toBeInTheDocument();
    });
  });

  it('removes opponent_team if opponent_squad exists', async () => {
    const opponentSquad = { opponent_squad: { id: 100, name: 'France' } };
    const mockPatch = jest.spyOn(axios, 'patch');
    await componentRender(
      'SLIDING',
      {
        ...gameEvent,
        ...opponentSquad,
      },
      'EDIT'
    );

    await saveEvent();

    const {
      opponent_team,
      organisation_team,
      title,
      venue_type,
      start_date,
      ...restGameEvent
    } = gameEvent;

    const expectedGameEvent = {
      ...undefinedFields,
      attached_links_attributes: undefined,
      ...restGameEvent,
      ...opponentSquad,
      competition_id: 2,
      custom_periods: [],
      custom_period_duration_enabled: false,
      start_time: start_date,
      editable: false,
      event_collection_complete: false,
      name: undefined,
      venue_type_id: 2,
      organisation_team_id: 1479,
      team_id: 100,
      opponent_team: null,
      send_notifications: false,
    };

    expect(mockPatch).toHaveBeenCalledWith(
      '/planning_hub/events/2',
      expectedGameEvent,
      { params: {} }
    );
  });
});
