import { rest, server } from '@kitman/services/src/mocks/server';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { data as formationCoords } from '@kitman/services/src/mocks/handlers/planningEvent/getFormationPositionsCoordinates';
import { mockOrderedPlayerData } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/__tests__/mockTestSquadData';
import {
  handleInitialTeamPositionAssignments,
  handleSubSwapTeamPositionAssignments,
  getLinkedOrNestedFormationChangeActivities,
  recursiveMultiEventPitchUpdate,
  getMultiEventActivities,
  getEventListPitchActivities,
} from '../pitchViewUtils';

describe('pitchViewUtils', () => {
  const mockTeam = { inFieldPlayers: {}, players: mockOrderedPlayerData };
  const mockInFieldTeam = {
    inFieldPlayers: {
      '1_3': mockOrderedPlayerData[0],
      '2_4': mockOrderedPlayerData[1],
    },
    players: [],
  };
  const mockSubTeam = {
    inFieldPlayers: { '1_3': mockOrderedPlayerData[0] },
    players: [mockOrderedPlayerData[1]],
  };
  const mockFormationCoords = {
    '1_3': formationCoords[0],
    '2_4': formationCoords[1],
  };

  describe('handleInitialTeamPositionAssignments', () => {
    const mockActivity = {
      absolute_minute: 0,
      athlete_id: mockOrderedPlayerData[0].id,
      game_activity_id: 1,
      kind: eventTypes.formation_position_view_change,
      relation: { id: 1 },
    };

    it('returns the updated team list when it is the setting the starting lineup', () => {
      expect(
        handleInitialTeamPositionAssignments({
          initialTeam: mockTeam,
          formationActivity: mockActivity,
          formationCoordinates: mockFormationCoords,
        })
      ).toEqual({
        inFieldPlayers: {
          '1_3': mockOrderedPlayerData[0],
        },
        players: [mockOrderedPlayerData[1], mockOrderedPlayerData[2]],
      });
    });

    it('returns the updated team list with no updated team if the player in the activity does not exist in the team', () => {
      expect(
        handleInitialTeamPositionAssignments({
          initialTeam: mockTeam,
          formationActivity: { ...mockActivity, athlete_id: 9999 },
          formationCoordinates: mockFormationCoords,
        })
      ).toEqual({
        inFieldPlayers: {},
        players: [
          mockOrderedPlayerData[0],
          mockOrderedPlayerData[1],
          mockOrderedPlayerData[2],
        ],
      });
    });
  });

  describe('handleSubSwapTeamPositionAssignments', () => {
    it('returns the updated team list when it is the switch case usage', () => {
      const mockPositionSwapActivities = [
        {
          absolute_minute: 0,
          athlete_id: mockOrderedPlayerData[0].id,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 2 },
        },
        {
          absolute_minute: 0,
          athlete_id: mockOrderedPlayerData[1].id,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 1 },
        },
      ];
      expect(
        handleSubSwapTeamPositionAssignments({
          team: mockInFieldTeam,
          multiPositionActivities: mockPositionSwapActivities,
          formationCoordinates: mockFormationCoords,
          gameActivityType: eventTypes.switch,
        })
      ).toEqual({
        inFieldPlayers: {
          '1_3': mockOrderedPlayerData[1],
          '2_4': mockOrderedPlayerData[0],
        },
        players: [],
      });
    });

    it('returns the updated team list when it is the substitution case usage', () => {
      const mockPositionSubActivities = [
        {
          absolute_minute: 0,
          athlete_id: mockOrderedPlayerData[0].id,
          kind: eventTypes.formation_position_view_change,
          relation: { id: null },
        },
        {
          absolute_minute: 0,
          athlete_id: mockOrderedPlayerData[1].id,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 1 },
        },
      ];
      expect(
        handleSubSwapTeamPositionAssignments({
          team: mockSubTeam,
          multiPositionActivities: mockPositionSubActivities,
          formationCoordinates: mockFormationCoords,
          gameActivityType: eventTypes.sub,
        })
      ).toEqual({
        inFieldPlayers: {
          '1_3': mockOrderedPlayerData[1],
        },
        players: [mockOrderedPlayerData[0]],
      });
    });

    it('returns the updated team list when it is the substitution to an empty position case usage', () => {
      const mockPositionSubActivities = [
        {
          absolute_minute: 0,
          athlete_id: mockOrderedPlayerData[1].id,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 1 },
        },
      ];
      expect(
        handleSubSwapTeamPositionAssignments({
          team: mockTeam,
          multiPositionActivities: mockPositionSubActivities,
          formationCoordinates: mockFormationCoords,
          gameActivityType: eventTypes.sub,
        })
      ).toEqual({
        inFieldPlayers: {
          '1_3': mockOrderedPlayerData[1],
        },
        players: [mockOrderedPlayerData[0], mockOrderedPlayerData[2]],
      });
    });

    it('returns the updated team list for a switch/sub when one of the players is no longer on the team', () => {
      const mockPositionSwapActivities = [
        {
          absolute_minute: 0,
          athlete_id: mockOrderedPlayerData[0].id,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 2 },
        },
        {
          absolute_minute: 0,
          athlete_id: 100000,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 1 },
        },
      ];
      expect(
        handleSubSwapTeamPositionAssignments({
          team: mockInFieldTeam,
          multiPositionActivities: mockPositionSwapActivities,
          formationCoordinates: mockFormationCoords,
          gameActivityType: eventTypes.switch,
        })
      ).toEqual(mockInFieldTeam);

      expect(
        handleSubSwapTeamPositionAssignments({
          team: mockInFieldTeam,
          multiPositionActivities: mockPositionSwapActivities,
          formationCoordinates: mockFormationCoords,
          gameActivityType: eventTypes.sub,
        })
      ).toEqual(mockInFieldTeam);
    });
  });

  describe('getLinkedOrNestedFormationChangeActivities', () => {
    const mockGameActivities = [
      {
        absolute_minute: 0,
        athlete_id: mockOrderedPlayerData[0].id,
        id: 1,
        kind: eventTypes.sub,
        relation: { id: 1 },
      },
      {
        absolute_minute: 0,
        athlete_id: mockOrderedPlayerData[0].id,
        game_activity_id: 1,
        kind: eventTypes.formation_position_view_change,
        relation: { id: 1 },
      },
      {
        absolute_minute: 0,
        athlete_id: mockOrderedPlayerData[1].id,
        game_activity_id: 1,
        kind: eventTypes.formation_position_view_change,
        relation: { id: 1 },
      },
      {
        absolute_minute: 0,
        athlete_id: mockOrderedPlayerData[0].id,
        game_activity_id: 2,
        kind: eventTypes.formation_position_view_change,
        relation: { id: 1 },
      },
    ];

    it('returns the linked formation_position_view_changes for the event', () => {
      expect(
        getLinkedOrNestedFormationChangeActivities(
          mockGameActivities[0],
          mockGameActivities
        )
      ).toEqual([mockGameActivities[1], mockGameActivities[2]]);
    });
  });

  describe('getMultiEventActivities and getEventListPitchActivities', () => {
    const mockActivities = [
      {
        absolute_minute: 0,
        athlete_id: mockOrderedPlayerData[1].id,
        game_activity_id: 1,
        kind: eventTypes.formation_position_view_change,
        relation: { id: 1 },
      },
      {
        absolute_minute: 5,
        athlete_id: mockOrderedPlayerData[1].id,
        game_activity_id: 1,
        kind: eventTypes.formation_change,
        relation: { id: 1 },
      },
      {
        absolute_minute: 0,
        athlete_id: mockOrderedPlayerData[1].id,
        game_activity_id: 1,
        kind: eventTypes.switch,
        relation: { id: 1 },
      },
    ];

    const mockPeriod = {
      absolute_duration_start: 0,
      absolute_duration_end: 45,
    };

    it('returns the multi event/pitch activities in sorted order based on absolute_minute', () => {
      expect(
        getMultiEventActivities({
          gameActivities: mockActivities,
          currentPeriod: mockPeriod,
        })
      ).toEqual([
        { ...mockActivities[2], activityIndex: 2 },
        { ...mockActivities[1], activityIndex: 1 },
      ]);

      expect(
        getEventListPitchActivities({
          gameActivities: mockActivities,
          currentPeriod: mockPeriod,
        })
      ).toEqual([
        { ...mockActivities[1], activityIndex: 1 },
        { ...mockActivities[2], activityIndex: 2 },
      ]);
    });

    it('returns the multi event/pitch activities in sorted order based on id', () => {
      const mockActivitiesWithId = [
        mockActivities[0],
        { ...mockActivities[1], absolute_minute: 5, id: 2 },
        { ...mockActivities[2], absolute_minute: 5, id: 1 },
      ];

      expect(
        getMultiEventActivities({
          gameActivities: mockActivitiesWithId,
          currentPeriod: mockPeriod,
        })
      ).toEqual([
        { ...mockActivitiesWithId[2], activityIndex: 2 },
        { ...mockActivitiesWithId[1], activityIndex: 1 },
      ]);

      expect(
        getEventListPitchActivities({
          gameActivities: mockActivitiesWithId,
          currentPeriod: mockPeriod,
        })
      ).toEqual([
        { ...mockActivitiesWithId[1], activityIndex: 1 },
        { ...mockActivitiesWithId[2], activityIndex: 2 },
      ]);
    });

    it('returns the multi event/pitch  activities in sorted order based on activityIndex', () => {
      const mockActivitiesWithSameMinute = [
        mockActivities[0],
        { ...mockActivities[1], absolute_minute: 5 },
        { ...mockActivities[2], absolute_minute: 5 },
      ];

      expect(
        getMultiEventActivities({
          gameActivities: mockActivitiesWithSameMinute,
          currentPeriod: mockPeriod,
        })
      ).toEqual([
        { ...mockActivitiesWithSameMinute[1], activityIndex: 1 },
        { ...mockActivitiesWithSameMinute[2], activityIndex: 2 },
      ]);

      expect(
        getEventListPitchActivities({
          gameActivities: mockActivitiesWithSameMinute,
          currentPeriod: mockPeriod,
        })
      ).toEqual([
        { ...mockActivitiesWithSameMinute[2], activityIndex: 2 },
        { ...mockActivitiesWithSameMinute[1], activityIndex: 1 },
      ]);
    });
  });

  describe('recursiveMultiEventPitchUpdate', () => {
    const mockGameActivities = [
      {
        absolute_minute: 5,
        id: 1,
        kind: eventTypes.formation_change,
        relation: { id: 4 },
      },
      {
        absolute_minute: 15,
        athlete_id: mockOrderedPlayerData[0],
        id: 2,
        kind: eventTypes.sub,
        game_activities: [
          {
            absolute_minute: 15,
            athlete_id: mockOrderedPlayerData[0].id,
            kind: eventTypes.formation_position_view_change,
            relation: { id: null },
          },
          {
            absolute_minute: 15,
            athlete_id: mockOrderedPlayerData[1].id,
            kind: eventTypes.formation_position_view_change,
            relation: { id: 1 },
          },
        ],
      },
      {
        absolute_minute: 5,
        athlete_id: mockOrderedPlayerData[0].id,
        game_activity_id: 1,
        kind: eventTypes.formation_position_view_change,
        relation: { id: 1 },
      },
    ];

    const mockLoopActivities = [mockGameActivities[0], mockGameActivities[1]];

    const newFormationCoordinates = [
      {
        id: 1,
        x: 1,
        y: 1,
        order: 1,
        position_id: 3,
        field_id: 1,
        formation_id: 4,
        position: {
          id: 3,
          abbreviation: 'GK',
        },
      },
      {
        id: 2,
        x: 1,
        y: 2,
        order: 1,
        position_id: 5,
        field_id: 1,
        formation_id: 4,
        position: {
          id: 5,
          abbreviation: 'CB',
        },
      },
    ];

    it('allows the util to update the team with the subs/formation_change recursively', async () => {
      server.use(
        rest.get(`/ui/planning_hub/formation_position_views`, (req, res, ctx) =>
          res(ctx.json(newFormationCoordinates))
        )
      );

      expect(
        await recursiveMultiEventPitchUpdate({
          indexCounter: 0,
          allGameActivities: mockGameActivities,
          loopActivities: mockLoopActivities,
          fieldId: 1,
          team: mockSubTeam,
          formationCoordinates: mockFormationCoords,
        })
      ).toEqual({
        updatedFormationCoordinates: {
          '1_1': newFormationCoordinates[0],
          '1_2': newFormationCoordinates[1],
        },
        updatedTeam: {
          inFieldPlayers: {
            '1_1': mockOrderedPlayerData[1],
          },
          players: [mockOrderedPlayerData[0]],
        },
      });
    });
  });
});
