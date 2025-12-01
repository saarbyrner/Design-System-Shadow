import { defaultTeamPitchInfo } from '@kitman/modules/src/shared/MatchReport/src/consts/matchReportConsts';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import pitchViewSlice, {
  initialState,
  setActiveEventSelection,
  setField,
  setFormationCoordinates,
  setIsLoading,
  setPitchActivities,
  setSelectedFormation,
  setSelectedGameFormat,
  setSelectedPitchPlayer,
  setTeam,
  setTeams,
} from '../pitchViewSlice';

describe('pitchViewSlice', () => {
  const playerInfo = {
    id: 1,
    user_id: 1,
    firstname: 'firstname',
    lastname: 'lastname',
    fullname: 'fullname',
    position: {
      abbreviation: 'abbreviation',
      group: 'group',
      name: 'name',
    },
  };

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    expect(pitchViewSlice.reducer(undefined, action)).toEqual(initialState);
  });

  it('should correctly update the field', () => {
    expect(initialState.field).toEqual({
      id: 0,
      name: '',
      width: 0,
      height: 0,
      columns: 0,
      rows: 0,
      cellSize: 0,
    });

    const action = setField({ name: 'field name' });
    const nextState = pitchViewSlice.reducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      field: {
        ...initialState.field,
        name: 'field name',
      },
    });
  });

  it('setSelectedGameFormat', () => {
    expect(initialState.selectedGameFormat).toBeNull();

    const action = setSelectedGameFormat({
      id: 1,
      name: '11v11',
      number_of_players: 11,
    });
    const nextState = pitchViewSlice.reducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      selectedGameFormat: { id: 1, name: '11v11', number_of_players: 11 },
    });
  });

  it('setSelectedFormation', () => {
    expect(initialState.selectedFormation).toBeNull();

    const action = setSelectedFormation({
      id: 1,
      name: '4-4-3',
      number_of_players: 11,
    });
    const nextState = pitchViewSlice.reducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      selectedFormation: { id: 1, name: '4-4-3', number_of_players: 11 },
    });
  });

  it('setTeam', () => {
    expect(initialState.team).toEqual({
      inFieldPlayers: {},
      players: [],
    });

    const action = setTeam({
      players: [playerInfo],
    });
    const nextState = pitchViewSlice.reducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      team: {
        players: [playerInfo],
      },
    });
  });

  it('setTeams', () => {
    expect(initialState.teams).toEqual(defaultTeamPitchInfo);

    const teamInfo = {
      formation: {
        id: 12,
        number_of_players: 11,
        name: '4-1-2-1-2',
      },
      formationCoordinates: {
        '0_5': {
          id: 122,
          field_id: 1,
          formation_id: 12,
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
      },
      positions: [
        {
          id: 250022,
          kind: eventTypes.formation_change,
          relation: {
            id: 12,
            number_of_players: 11,
            name: '4-1-2-1-2',
          },
          game_period_id: 108,
        },
      ],
      inFieldPlayers: {},
      players: [playerInfo],
      listPlayers: [playerInfo],
      staff: [],
    };

    const teamsToStore = {
      home: teamInfo,
      away: teamInfo,
    };
    const action = setTeams(teamsToStore);
    const nextState = pitchViewSlice.reducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      teams: teamsToStore,
    });
  });

  it('setFormationCoordinates', () => {
    expect(initialState.formationCoordinates).toEqual({});

    const action = setFormationCoordinates({
      '1_2': {
        x: 1,
        y: 2,
      },
    });
    const nextState = pitchViewSlice.reducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      formationCoordinates: {
        '1_2': {
          x: 1,
          y: 2,
        },
      },
    });
  });

  it('setActiveEventSelection', () => {
    expect(initialState.activeEventSelection).toEqual('');

    const action = setActiveEventSelection('event name');
    const nextState = pitchViewSlice.reducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      activeEventSelection: 'event name',
    });
  });

  it('setPitchActivities', () => {
    expect(initialState.pitchActivities).toEqual([]);

    const mockActivities = [
      {
        kind: eventTypes.formation_change.formation_position_view_change,
        minute: 15,
        absolute_minute: 15,
      },
    ];

    const action = setPitchActivities(mockActivities);
    const nextState = pitchViewSlice.reducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      pitchActivities: mockActivities,
    });
  });

  it('setSelectedPitchPlayer', () => {
    expect(initialState.selectedPitchPlayer).toEqual(null);

    const action = setSelectedPitchPlayer({
      player: playerInfo,
      positionData: {
        id: 1,
        position: {
          id: 2,
          abbreviation: 'abbreviation',
        },
      },
    });
    const nextState = pitchViewSlice.reducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      selectedPitchPlayer: {
        player: playerInfo,
        positionData: {
          id: 1,
          position: {
            id: 2,
            abbreviation: 'abbreviation',
          },
        },
      },
    });
  });

  it('setIsLoading', () => {
    expect(initialState.isLoading).toEqual(false);

    const action = setIsLoading(true);
    const nextState = pitchViewSlice.reducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      isLoading: true,
    });
  });
});
