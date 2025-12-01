import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { handleListChangingFormationPitchAssignments } from '../listViewUtils';

describe('listViewUtils', () => {
  describe('handleListChangingFormationPitchAssignments', () => {
    const mockAllGameActivities = [
      {
        id: 1532606,
        kind: eventTypes.formation_change,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 2,
          number_of_players: 11,
          name: '4-3-3',
        },
        game_period_id: 808312,
      },
      {
        id: 1532608,
        kind: eventTypes.formation_position_view_change,
        athlete_id: 15642,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 12,
        },
        game_period_id: 808312,
      },
      {
        id: 1532609,
        kind: eventTypes.position_change,
        athlete_id: 15642,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 84,
        },
        game_period_id: 808312,
      },
      {
        id: 1532610,
        kind: eventTypes.formation_position_view_change,
        athlete_id: 33925,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 15,
        },
        game_period_id: 808312,
      },
      {
        id: 1532611,
        kind: eventTypes.position_change,
        athlete_id: 33925,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 86,
        },
        game_period_id: 808312,
      },
      {
        id: 1532628,
        kind: eventTypes.formation_complete,
        minute: 0,
        absolute_minute: 0,
        relation: {
          id: 2,
          number_of_players: 11,
          name: '4-3-3',
        },
        game_period_id: 808312,
      },
    ];

    const mockSelectedPeriod = {
      id: 808312,
      name: 'Period 1',
      duration: 45,
      absolute_duration_start: 0,
      absolute_duration_end: 45,
    };

    const mockAthletes = [
      {
        id: 15642,
        firstname: 'hugo',
        lastname: 'beuzeboc',
        fullname: 'hugo beuzeboc',
        shortname: 'hugo',
        user_id: 17409,
      },
      {
        id: 33925,
        firstname: 'AJ',
        lastname: 'McClune',
        fullname: 'AJ McClune',
        shortname: 'AJ',
        user_id: 38187,
      },
    ];

    const mockFormations = [
      {
        id: 2,
        number_of_players: 11,
        name: '4-3-3',
      },
      {
        id: 61,
        number_of_players: 11,
        name: '5-4-1 - Basic',
      },
      {
        id: 6,
        number_of_players: 11,
        name: '5-3-2',
      },
    ];

    const mockFormationCooordinates = {
      '0_5': {
        id: 12,
        field_id: 1,
        formation_id: 2,
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
      '3_1': {
        id: 13,
        field_id: 1,
        formation_id: 2,
        position: {
          id: 87,
          name: 'Right Back',
          order: 2,
          abbreviation: 'RB',
        },
        x: 3,
        y: 1,
        order: 2,
      },
      '3_4': {
        id: 14,
        field_id: 1,
        formation_id: 2,
        position: {
          id: 86,
          name: 'Center Back',
          order: 4,
          abbreviation: 'CB',
        },
        x: 3,
        y: 4,
        order: 3,
      },
      '3_6': {
        id: 15,
        field_id: 1,
        formation_id: 2,
        position: {
          id: 86,
          name: 'Center Back',
          order: 4,
          abbreviation: 'CB',
        },
        x: 3,
        y: 6,
        order: 4,
      },
    };

    const mockFormationGameActivities = [
      {
        id: 1532606,
        minute: 0,
        absolute_minute: 0,
        relation_id: 2,
        validation: {
          minute: {
            valid: true,
            showError: false,
          },
          relation_id: {
            valid: true,
            showError: false,
          },
        },
      },
      {
        kind: eventTypes.formation_change,
        minute: 1,
        absolute_minute: 1,
        validation: {
          minute: {
            valid: true,
            showError: false,
          },
          relation_id: {
            valid: true,
            showError: true,
          },
        },
        game_activities: [],
        relation_id: 61,
      },
    ];

    it('outputs the newly created position activities for the mid game formation change', async () => {
      expect(
        await handleListChangingFormationPitchAssignments({
          allGameActivities: mockAllGameActivities,
          selectedPeriod: mockSelectedPeriod,
          athletes: mockAthletes,
          formations: mockFormations,
          formationCoordinates: mockFormationCooordinates,
          formationGameActivities: mockFormationGameActivities,
        })
      ).toEqual([
        {
          absolute_minute: 0,
          id: 1532606,
          minute: 0,
          relation_id: 2,
          validation: {
            minute: { showError: false, valid: true },
            relation_id: { showError: false, valid: true },
          },
        },
        {
          absolute_minute: 1,
          game_activities: [
            {
              absolute_minute: 1,
              athlete_id: 15642,
              kind: eventTypes.position_change,
              minute: 1,
              relation: { id: 1 },
            },
            {
              absolute_minute: 1,
              athlete_id: 15642,
              kind: eventTypes.formation_position_view_change,
              minute: 1,
              relation: { id: 1 },
            },
            {
              absolute_minute: 1,
              athlete_id: 33925,
              kind: eventTypes.position_change,
              minute: 1,
              relation: { id: NaN },
            },
            {
              absolute_minute: 1,
              athlete_id: 33925,
              kind: eventTypes.formation_position_view_change,
              minute: 1,
              relation: { id: 2 },
            },
          ],
          kind: eventTypes.formation_change,
          minute: 1,
          relation: { id: 61, name: '5-4-1 - Basic' },
          relation_id: 61,
          validation: {
            minute: { showError: false, valid: true },
            relation_id: { showError: true, valid: true },
          },
        },
      ]);
    });
  });
});
