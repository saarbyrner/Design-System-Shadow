import $ from 'jquery';
import * as redux from 'react-redux';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { data as gameEventData } from '@kitman/services/src/mocks/handlers/planningHub/getEvent';

import GameEventsListView from '../GameEventsListView';

describe('GameEventsListView', () => {
  const mockEvent = {
    ...gameEventData.event,
    id: 2209193,
    type: 'game_event',
  };

  const mockAthletes = [
    {
      id: 51488,
      firstname: 'Juan Ignacio',
      lastname: 'Brex',
      fullname: 'Juan Ignacio Brex',
      shortname: 'Juan Ignacio',
      user_id: 110677,
      avatar_url: 'test.png',
      position: {
        id: 72,
        name: 'Loose-head Prop',
        order: 1,
        abbreviation: null,
      },
      availability: 'unavailable',
    },
    {
      id: 80524,
      firstname: 'Daniel Athlete',
      lastname: 'Athlete',
      fullname: 'Daniel Athlete Athlete',
      shortname: 'Daniel Athlete',
      user_id: 143222,
      avatar_url: 'test.png',
      position: {
        id: 72,
        name: 'Loose-head Prop',
        order: 1,
        abbreviation: null,
      },
      availability: 'unavailable',
    },
  ];

  const mockAthleteEvents = [
    {
      id: 29111382,
      athlete: mockAthletes[0],
      participation_level: {
        id: 3860,
        name: 'Started - Substituted',
        canonical_participation_level: 'partial',
        include_in_group_calculations: true,
        default: true,
      },
      participation_level_reason: null,
      include_in_group_calculations: false,
      duration: 40,
      rpe: null,
      related_issue: null,
    },
    {
      id: 29111387,
      athlete: mockAthletes[1],
      participation_level: {
        id: 3860,
        name: 'Started - Substituted',
        canonical_participation_level: 'partial',
        include_in_group_calculations: true,
        default: true,
      },
      participation_level_reason: null,
      include_in_group_calculations: false,
      duration: 40,
      rpe: null,
      related_issue: null,
    },
  ];

  const mockEventPeriods = [
    {
      id: 1,
      name: 'Period 1',
      duration: 40,
      additional_duration: null,
      order: 0,
      absolute_duration_start: 0,
      absolute_duration_end: 40,
    },
    {
      id: 2,
      name: 'Period 2',
      duration: 40,
      additional_duration: null,
      order: 1,
      absolute_duration_start: 40,
      absolute_duration_end: 80,
    },
  ];

  const mockDefaultActivities = [
    {
      id: 249245,
      kind: eventTypes.formation_change,
      minute: 0,
      additional_minute: null,
      absolute_minute: 0,
      relation: {
        id: 4,
        number_of_players: 11,
        name: '5-4-1',
      },
      game_period_id: 1,
    },
    {
      id: 249246,
      kind: eventTypes.formation_change,
      minute: 0,
      additional_minute: null,
      absolute_minute: 40,
      relation: {
        id: 4,
        number_of_players: 11,
        name: '5-4-1',
      },
      game_period_id: 2,
    },
  ];

  const mockFormations = [
    {
      id: 4,
      number_of_players: 11,
      name: '5-4-1',
    },
    {
      id: 3,
      number_of_players: 11,
      name: '4-5-1',
    },
    {
      id: 5,
      number_of_players: 11,
      name: '4-4-1-1',
    },
  ];

  const mockPositionGroups = [
    {
      id: 28,
      name: 'Goalkeeper',
      order: 1,
      positions: [
        {
          id: 84,
          name: 'Goalkeeper',
          order: 1,
          abbreviation: 'GK',
        },
      ],
    },
    {
      id: 29,
      name: 'Defender',
      order: 2,
      positions: [
        {
          id: 87,
          name: 'Right Back',
          order: 2,
          abbreviation: 'RB',
        },
        {
          id: 90,
          name: 'Right Wing Back',
          order: 3,
          abbreviation: 'RWB',
        },
        {
          id: 86,
          name: 'Center Back',
          order: 4,
          abbreviation: 'CB',
        },
        {
          id: 88,
          name: 'Left Back',
          order: 5,
          abbreviation: 'LB',
        },
        {
          id: 89,
          name: 'Left Wing Back',
          order: 6,
          abbreviation: 'LWB',
        },
        {
          id: 85,
          name: 'Sweeper',
          order: 7,
          abbreviation: 'SWP',
        },
      ],
    },
  ];

  const mockParticipationLevels = [
    {
      value: 3859,
      label: 'Started - Full Game',
      canonical_participation_level: 'full',
      include_in_group_calculations: true,
    },
    {
      value: 3860,
      label: 'Started - Substituted',
      canonical_participation_level: 'partial',
      include_in_group_calculations: true,
    },
    {
      value: 3861,
      label: 'Substitute - Played',
      canonical_participation_level: 'partial',
      include_in_group_calculations: true,
    },
    {
      value: 3862,
      label: 'Substitute - Not Played',
      canonical_participation_level: 'none',
      include_in_group_calculations: false,
    },
    {
      value: 3864,
      label: 'No Participation',
      canonical_participation_level: 'none',
      include_in_group_calculations: false,
    },
  ];

  const mockFormationCoordinates = [
    {
      id: 34,
      field_id: 1,
      formation_id: 4,
      position: {
        id: 84,
        name: 'Goalkeeper',
        order: 1,
        abbreviation: 'GK',
      },
      x: 0,
      y: 5,
      order: 1,
    },
    {
      id: 35,
      field_id: 1,
      formation_id: 4,
      position: {
        id: 90,
        name: 'Right Wing Back',
        order: 3,
        abbreviation: 'RWB',
      },
      x: 3,
      y: 1,
      order: 2,
    },
  ];

  const defaultStore = {
    planningEvent: {
      gameActivities: { localGameActivities: mockDefaultActivities },
      eventPeriods: { localEventPeriods: mockEventPeriods },
      athleteEvents: { apiAthleteEvents: mockAthleteEvents },
      athletePlayTimes: {
        localAthletePlayTimes: [],
        apiAthletePlayTimes: [],
      },
      pitchView: {
        formationCoordinates: mockFormationCoordinates,
        field: {
          id: 1,
        },
      },
    },
  };

  const getStoreWithMockedActivities = (activities) => ({
    planningEvent: {
      ...defaultStore.planningEvent,
      gameActivities: { localGameActivities: activities },
    },
  });

  const defaultProps = {
    canEditEvent: true,
    event: mockEvent,
    pageRequestSuccess: 'SUCCESS',
    formations: mockFormations,
    positionGroups: mockPositionGroups,
    selectedPeriod: mockEventPeriods[0],
    periodToUpdate: mockEventPeriods[0],
    participationLevels: mockParticipationLevels,
    isPitchViewEnabled: true,
    preventGameEvents: false,
    isCustomPeriods: false,
    isMidGamePlayerPositionChangeDisabled: false,
    isLastPeriodSelected: false,
    setPageRequestStatus: jest.fn(),
    setEventPeriods: jest.fn(),
    setApiGameActivities: jest.fn(),
    handleDeletePeriod: jest.fn(),
    setSelectedPeriod: jest.fn(),
    getInitialData: jest.fn(),
    dispatchMandatoryFieldsToast: jest.fn(),
    setLocalGameActivities: jest.fn(),
    setPeriodToUpdate: jest.fn(),
  };

  const renderComponent = ({ props = defaultProps, store = defaultStore }) =>
    renderWithRedux(<GameEventsListView {...props} />, {
      preloadedState: store,
      useGlobalStore: false,
    });

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);

    window.featureFlags = { 'planning-game-events-field-view': true };
  });

  describe('Initial Render - Summary tab', () => {
    beforeEach(() => {
      jest.spyOn($, 'ajax').mockImplementation(() => {
        return $.Deferred().resolve({
          rows: [{ athlete: { id: 51488 }, participation_level: 3859 }],
        });
      });
    });

    it('allows the user to change the participation level for a player and fire a dispatch to update the local redux state', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: { ...defaultProps, selectedPeriod: null, periodToUpdate: null },
      });
      await user.click(screen.getAllByText('Started - Substituted')[0]);
      await user.click(screen.getByText('Started - Full Game'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockAthleteEvents[0],
            participation_level: {
              id: mockParticipationLevels[0].value,
              name: mockParticipationLevels[0].label,
              canonical_participation_level:
                mockParticipationLevels[0].canonical_participation_level,
              include_in_group_calculations:
                mockParticipationLevels[0].include_in_group_calculations,
            },
          },
          mockAthleteEvents[1],
        ],
        type: 'athleteEvents/setApiAthleteEvents',
      });
    });
  });

  describe('PitchViewEnabled Render', () => {
    let postRequest;
    const mockActivities = [
      ...mockDefaultActivities,
      {
        id: 249326,
        kind: eventTypes.formation_complete,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 4,
          number_of_players: 11,
          name: '5-4-1',
        },
        game_period_id: 1,
      },
      {
        id: 249279,
        kind: eventTypes.position_change,
        athlete_id: 51488,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 84,
        },
        game_period_id: 1,
      },
      {
        id: 249280,
        kind: eventTypes.formation_position_view_change,
        athlete_id: 51488,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 34,
        },
        game_period_id: 1,
      },
      {
        id: 249281,
        kind: eventTypes.position_change,
        athlete_id: 80524,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 90,
        },
        game_period_id: 1,
      },
      {
        id: 249282,
        kind: eventTypes.formation_position_view_change,
        athlete_id: 80524,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 35,
        },
        game_period_id: 1,
      },
    ];

    beforeEach(() => {
      postRequest = jest.spyOn($, 'ajax').mockImplementation(() => {
        return $.Deferred().resolve([]);
      });
    });

    it('allows the user to add a new formation from the edit period side panel while the period is in progress', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithMockedActivities(mockActivities),
      });
      await user.click(screen.getAllByRole('button')[7]);
      expect(screen.getByText('Edit period details')).toBeInTheDocument();
      await user.click(screen.getByText('Add formation'));
      await user.click(screen.getAllByText('Formation')[2]);
      await user.click(screen.getByText('4-4-1-1'));
      jest.resetAllMocks();
      await user.click(screen.getByText('Save'));
      expect(postRequest.mock.calls[0][0].data).toEqual(
        JSON.stringify({
          game_activities: [
            { id: 249245, minute: 0, absolute_minute: 0, relation_id: 4 },
            {
              kind: eventTypes.formation_change,
              minute: 1,
              absolute_minute: 1,
              game_activities: [
                {
                  kind: eventTypes.position_change,
                  relation: { id: 1 },
                  athlete_id: 51488,
                  absolute_minute: 1,
                  minute: 1,
                },
                {
                  kind: eventTypes.formation_position_view_change,
                  relation: { id: 1 },
                  athlete_id: 51488,
                  absolute_minute: 1,
                  minute: 1,
                },
                {
                  kind: eventTypes.position_change,
                  relation: { id: null },
                  athlete_id: 80524,
                  absolute_minute: 1,
                  minute: 1,
                },
                {
                  kind: eventTypes.formation_position_view_change,
                  relation: { id: 2 },
                  athlete_id: 80524,
                  absolute_minute: 1,
                  minute: 1,
                },
              ],
              relation_id: 5,
              relation: { id: 5, name: '4-4-1-1' },
            },
          ],
        })
      );
    });

    it('allows the user to alter an existing formation in the edit period side panel in the middle of a game', async () => {
      const mockSavedFormationActivities = [
        ...mockActivities,
        {
          id: 4444444,
          kind: eventTypes.formation_change,
          minute: 1,
          absolute_minute: 1,
          relation_id: 5,
          relation: { id: 5, name: '4-4-1-1' },
          game_period_id: 1,
        },
        {
          id: 4444445,
          kind: eventTypes.position_change,
          relation: { id: 84 },
          athlete_id: 51488,
          absolute_minute: 1,
          game_activity_id: 4444444,
        },
        {
          id: 4444446,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 34 },
          athlete_id: 51488,
          absolute_minute: 1,
          game_activity_id: 4444444,
        },
        {
          id: 4444447,
          kind: eventTypes.position_change,
          relation: { id: 90 },
          athlete_id: 80524,
          absolute_minute: 1,
          game_activity_id: 4444444,
        },
        {
          id: 4444448,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 35 },
          athlete_id: 80524,
          absolute_minute: 1,
          game_activity_id: 4444444,
        },
      ];
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithMockedActivities(mockSavedFormationActivities),
      });

      await user.click(screen.getAllByRole('button')[7]);
      await user.click(screen.getByText('4-4-1-1'));
      await user.click(screen.getByText('4-5-1'));
      await user.click(screen.getByText('Save'));
      expect(postRequest.mock.calls[0][0].data).toEqual(
        JSON.stringify({
          game_activities: [
            { id: 249245, minute: 0, absolute_minute: 0, relation_id: 4 },
            {
              id: 4444444,
              minute: 1,
              absolute_minute: 1,
              relation_id: 3,
              relation: { id: 3, name: '4-5-1' },
              game_activities: [
                {
                  kind: eventTypes.position_change,
                  relation: { id: 1 },
                  athlete_id: 51488,
                  absolute_minute: 1,
                  minute: 1,
                },
                {
                  kind: eventTypes.formation_position_view_change,
                  relation: { id: 1 },
                  athlete_id: 51488,
                  absolute_minute: 1,
                  minute: 1,
                },
                {
                  kind: eventTypes.position_change,
                  relation: { id: null },
                  athlete_id: 80524,
                  absolute_minute: 1,
                  minute: 1,
                },
                {
                  kind: eventTypes.formation_position_view_change,
                  relation: { id: 2 },
                  athlete_id: 80524,
                  absolute_minute: 1,
                  minute: 1,
                },
              ],
            },
          ],
        })
      );
    });
  });
});
