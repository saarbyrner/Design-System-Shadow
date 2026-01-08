import { getSelectedItems, isSelectionEmpty } from '../utils';

describe('getSelectedItems', () => {
  const selectedSquadAthletes = {
    applies_to_squad: false,
    position_groups: [],
    positions: [],
    athletes: [],
    all_squads: false,
    squads: [],
  };
  const squadAthletes = {
    id: 8,
    name: 'Test',
    position_groups: [
      {
        id: 25,
        name: 'Forward',
        positions: [
          {
            id: 72,
            name: 'LHP',
            athletes: [{ id: 123, fullname: 'Testy McTesterson' }],
          },
        ],
      },
    ],
  };
  const squads = [
    {
      id: 1,
      name: 'Test',
    },
  ];

  it('returns an empty string if nothing selected', () => {
    expect(
      getSelectedItems(selectedSquadAthletes, squadAthletes, squads)
    ).toEqual('');
  });

  it('returns an empty string if `squads` is undefined', () => {
    expect(
      getSelectedItems(selectedSquadAthletes, squadAthletes, undefined)
    ).toEqual('');
  });

  it('returns Entire Squad if applies_to_squad is true', () => {
    selectedSquadAthletes.applies_to_squad = true;
    expect(
      getSelectedItems(selectedSquadAthletes, squadAthletes, squads)
    ).toEqual('#sport_specific__Entire_Squad');
  });

  it('returns the position group name when one is selected', () => {
    selectedSquadAthletes.position_groups = [25];
    expect(
      getSelectedItems(selectedSquadAthletes, squadAthletes, squads)
    ).toEqual('#sport_specific__Entire_Squad, Forward');
  });

  it('returns the position name when one is selected', () => {
    selectedSquadAthletes.positions = [72];
    expect(
      getSelectedItems(selectedSquadAthletes, squadAthletes, squads)
    ).toEqual('#sport_specific__Entire_Squad, Forward, LHP');
  });

  it('returns the athlete name when one is selected', () => {
    selectedSquadAthletes.athletes = [123];
    expect(
      getSelectedItems(selectedSquadAthletes, squadAthletes, squads)
    ).toEqual('#sport_specific__Entire_Squad, Forward, LHP, Testy McTesterson');
  });

  it('returns All Squads when all_squads is true', () => {
    selectedSquadAthletes.all_squads = true;
    expect(
      getSelectedItems(selectedSquadAthletes, squadAthletes, squads)
    ).toEqual(
      '#sport_specific__Entire_Squad, Forward, LHP, Testy McTesterson, #sport_specific__All_Squads'
    );
  });

  it('returns the squad name when one is selected', () => {
    selectedSquadAthletes.squads = [1];
    expect(
      getSelectedItems(selectedSquadAthletes, squadAthletes, squads)
    ).toEqual(
      '#sport_specific__Entire_Squad, Forward, LHP, Testy McTesterson, #sport_specific__All_Squads, Test'
    );
  });
});

describe('isSelectionEmpty', () => {
  const selectedSquadAthletes = {
    applies_to_squad: false,
    position_groups: [],
    positions: [],
    athletes: [],
    all_squads: false,
    squads: [],
  };

  it('returns true if all checks', () => {
    expect(isSelectionEmpty(selectedSquadAthletes)).toEqual(true);
  });
  it('returns false if applies to squad is true', () => {
    selectedSquadAthletes.applies_to_squad = true;
    expect(isSelectionEmpty(selectedSquadAthletes)).toEqual(false);
  });
  it('returns false if position_groups has items', () => {
    selectedSquadAthletes.position_groups = ['position_group_9'];
    expect(isSelectionEmpty(selectedSquadAthletes)).toEqual(false);
  });
  it('returns false if positions has items', () => {
    selectedSquadAthletes.positions = ['position_27'];
    expect(isSelectionEmpty(selectedSquadAthletes)).toEqual(false);
  });
  it('returns false if athletes has items', () => {
    selectedSquadAthletes.athletes = ['athlete_4'];
    expect(isSelectionEmpty(selectedSquadAthletes)).toEqual(false);
  });
  it('returns false if all_squads is true', () => {
    selectedSquadAthletes.all_squads = true;
    expect(isSelectionEmpty(selectedSquadAthletes)).toEqual(false);
  });
  it('returns false if squads exists and has items', () => {
    selectedSquadAthletes.squads = ['squad_999'];
    expect(isSelectionEmpty(selectedSquadAthletes)).toEqual(false);
  });
});
