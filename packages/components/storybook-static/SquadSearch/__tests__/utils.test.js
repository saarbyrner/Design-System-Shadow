import {
  flattenSquadSearchItems,
  flattenSelectedItems,
  formatSelectedItems,
  flattenSquadSelection,
} from '../utils';

describe('flattenSelectedItems', () => {
  it('returns flatten selected items', () => {
    const selectedAthletes = ['32'];
    const selectedPositions = ['42'];
    const selectedPositionGroups = ['1', '11'];
    const appliesToSquad = true;
    const result = flattenSelectedItems(
      selectedAthletes,
      selectedPositions,
      selectedPositionGroups,
      appliesToSquad
    );

    const expectedResult = [
      'applies_to_squad',
      'position_group_1',
      'position_group_11',
      'position_42',
      'athlete_32',
    ];
    expect(result).toEqual(expectedResult);
  });

  describe('when athletes is an array of athlete object', () => {
    it('returns flatten selected items', () => {
      const selectedAthletes = [
        {
          id: 216,
          firstname: 'John',
          lastname: 'Do',
          on_dashboard: true,
        },
      ];
      const selectedPositions = [];
      const selectedPositionGroups = [1, 11];
      const appliesToSquad = false;
      const result = flattenSelectedItems(
        selectedAthletes,
        selectedPositions,
        selectedPositionGroups,
        appliesToSquad
      );

      const expectedResult = [
        'position_group_1',
        'position_group_11',
        'athlete_216',
      ];
      expect(result).toEqual(expectedResult);
    });
  });
});

describe('flattenSquadSearchItems', () => {
  it('returns flatten items', () => {
    const expectedResult = [
      {
        description: 'Select Entire Squad',
        id: 'applies_to_squad',
        title: 'Entire Squad',
      },
      {
        description: 'Select all Forward',
        id: 'position_group_25',
        title: 'Forward',
      },
      {
        description: 'Select all Back',
        id: 'position_group_26',
        title: 'Back',
      },
      {
        description: 'Select all Tight-head Prop',
        id: 'position_70',
        title: 'Tight-head Prop',
      },
      {
        description: 'Select all Hooker',
        id: 'position_71',
        title: 'Hooker',
      },
      {
        description: 'Select all Loose-head Prop',
        id: 'position_72',
        title: 'Loose-head Prop',
      },
      {
        description: '',
        id: 'athlete_23',
        title: 'Frank Beans',
      },
      {
        description: 'Select All Squads',
        id: 'all_squads',
        title: 'All Squads',
      },
      {
        description: 'Select all International Squad',
        id: 'squad_5',
        title: 'International Squad',
      },
    ];

    const athletes = {
      23: {
        id: 23,
        firstname: 'Frank',
        lastname: 'Beans',
      },
    };
    const athleteOrder = [23];
    const positions = {
      70: 'Tight-head Prop',
      71: 'Hooker',
      72: 'Loose-head Prop',
    };
    const positionOrder = [70, 71, 72];
    const positionGroups = {
      25: 'Forward',
      26: 'Back',
      27: 'Other',
    };
    const positionGroupOrder = [25, 26, 27];
    const squads = [
      {
        id: 5,
        name: 'International Squad',
      },
    ];

    const result = flattenSquadSearchItems(
      athletes,
      athleteOrder,
      positions,
      positionOrder,
      positionGroups,
      positionGroupOrder,
      [],
      squads
    );
    expect(result).toEqual(expectedResult);
  });
});

describe('formatSelectedItems', () => {
  describe('when applies_to_squad is in the selected items', () => {
    it('returns an object with applies_to_squad true', () => {
      const expectedResult = {
        positions: [1],
        position_groups: [1],
        athletes: [1],
        applies_to_squad: true,
        all_squads: false,
        squads: [],
      };
      const selectedItems = [
        'position_group_1',
        'position_1',
        'athlete_1',
        'applies_to_squad',
      ];
      const result = formatSelectedItems(selectedItems);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('when applies_to_squad is not in the selected items', () => {
    it('returns a formatted object of squad selection', () => {
      const expectedResult = {
        positions: [12],
        position_groups: [123, 54],
        athletes: [5],
        applies_to_squad: false,
        all_squads: false,
        squads: [],
      };
      const selectedItems = [
        'position_group_123',
        'position_group_54',
        'position_12',
        'athlete_5',
      ];
      const result = formatSelectedItems(selectedItems);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('when the selected items contain all_squads', () => {
    it('returns an object with all_squads true', () => {
      const expectedResult = {
        positions: [],
        position_groups: [],
        athletes: [],
        applies_to_squad: false,
        all_squads: true,
        squads: [],
      };

      expect(formatSelectedItems(['all_squads'])).toEqual(expectedResult);
    });
  });

  describe('when the selected items contain a list of squads', () => {
    it('returns an object with a list of squads', () => {
      const expectedResult = {
        positions: [],
        position_groups: [],
        athletes: [],
        applies_to_squad: false,
        all_squads: false,
        squads: [1, 5],
      };

      expect(formatSelectedItems(['squad_1', 'squad_5'])).toEqual(
        expectedResult
      );
    });
  });
});

describe('flattenSquadSelection', () => {
  it('returns a flat array of the squad selection', () => {
    const expectedResult = ['all_squads', 'squad_5', 'position_71'];
    const squadSelection = {
      applies_to_squad: false,
      position_groups: null,
      positions: [71],
      athletes: null,
      all_squads: true,
      squads: [5],
    };
    const result = flattenSquadSelection(squadSelection);
    expect(result).toEqual(expectedResult);
  });
});
