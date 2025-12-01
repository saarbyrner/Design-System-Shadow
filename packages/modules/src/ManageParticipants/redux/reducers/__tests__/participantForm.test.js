import participantFormReducer from '../participantForm';

describe('participantForm reducer', () => {
  const initialState = {
    event: {
      id: 3,
      name: 'event name',
      rpe_collection_athlete: false,
      rpe_collection_kiosk: false,
      mass_input: null,
    },
    participants: [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 20,
        squads: [73, 8, 262],
        include_in_group_calculations: false,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 10,
        squads: [73, 262],
        include_in_group_calculations: false,
      },
    ],
  };

  it('returns correct state on UPDATE_DURATION', () => {
    const action = {
      type: 'UPDATE_DURATION',
      payload: {
        athleteId: 1,
        duration: 30,
      },
    };

    const nextState = participantFormReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      participants: [
        { ...initialState.participants[0], duration: 30 },
        initialState.participants[1],
      ],
    });
  });

  it('returns correct state on UPDATE_RPE', () => {
    const action = {
      type: 'UPDATE_RPE',
      payload: {
        athleteId: 1,
        rpe: 7,
      },
    };

    const nextState = participantFormReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      participants: [
        { ...initialState.participants[0], rpe: 7 },
        initialState.participants[1],
      ],
    });
  });

  it('returns correct state on UPDATE_RPE_COLLECTION_ATHLETE', () => {
    const action = {
      type: 'UPDATE_RPE_COLLECTION_ATHLETE',
      payload: {
        rpeCollectionAthlete: true,
      },
    };

    const nextState = participantFormReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      event: {
        ...initialState.event,
        rpe_collection_athlete: true,
      },
    });
  });

  it('returns correct state on UPDATE_RPE_COLLECTION_KIOSK', () => {
    const action = {
      type: 'UPDATE_RPE_COLLECTION_KIOSK',
      payload: {
        rpeCollectionKiosk: true,
      },
    };

    const nextState = participantFormReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      event: {
        ...initialState.event,
        rpe_collection_kiosk: true,
      },
    });
  });

  it('returns correct state on UPDATE_MASS_INPUT', () => {
    const action = {
      type: 'UPDATE_MASS_INPUT',
      payload: {
        massInput: true,
      },
    };

    const nextState = participantFormReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      event: {
        ...initialState.event,
        mass_input: true,
      },
    });
  });

  it('updates the duration only for the filtered and participating athletes on UPDATE_ALL_DURATIONS', () => {
    const initialParticipants = [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 5,
        squads: [73, 8, 262],
        participationLevel: 1,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 5,
        squads: [73, 262],
        participationLevel: 1,
      },
      {
        athlete_id: 3,
        athlete_fullname: 'Larry Loe',
        rpe: null,
        duration: null,
        squads: [8],
        participationLevel: 2,
      },
    ];

    const action = {
      type: 'UPDATE_ALL_DURATIONS',
      payload: {
        filteredAthletes: [1],
        duration: 50,
        participationLevels: [
          { id: 1, canonical_participation_level: 'full' },
          { id: 2, canonical_participation_level: 'none' },
        ],
      },
    };

    const nextState = participantFormReducer(
      { ...initialState, participants: initialParticipants },
      action
    );

    expect(nextState).toEqual({
      ...initialState,
      participants: [
        { ...initialParticipants[0], duration: 50 },
        initialParticipants[1],
        initialParticipants[2],
      ],
    });
  });

  it('returns correct state on UPDATE_PARTICIPATION_LEVEL', () => {
    const action = {
      type: 'UPDATE_PARTICIPATION_LEVEL',
      payload: {
        athleteId: 1,
        participationLevel: {
          id: 5,
          canonical_participation_level: 'partial',
          include_in_group_calculations: true,
        },
        eventDuration: '50',
      },
    };

    const nextState = participantFormReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialState.participants[0],
          participation_level_id: 5,
          include_in_group_calculations: true,
        },
        initialState.participants[1],
      ],
    });
  });

  it('empties duration and RPE on UPDATE_PARTICIPATION_LEVEL with canonical_participation_level none', () => {
    const action = {
      type: 'UPDATE_PARTICIPATION_LEVEL',
      payload: {
        athleteId: 1,
        participationLevel: {
          id: 5,
          canonical_participation_level: 'none',
          include_in_group_calculations: false,
        },
        eventDuration: '50',
      },
    };

    const nextState = participantFormReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialState.participants[0],
          participation_level_id: 5,
          duration: '',
          rpe: '',
          include_in_group_calculations: false,
        },
        initialState.participants[1],
      ],
    });
  });

  it('sets duration with the event duration on UPDATE_PARTICIPATION_LEVEL with canonical_participation_level full', () => {
    const action = {
      type: 'UPDATE_PARTICIPATION_LEVEL',
      payload: {
        athleteId: 1,
        participationLevel: {
          id: 5,
          canonical_participation_level: 'full',
          include_in_group_calculations: true,
        },
        eventDuration: '50',
      },
    };

    const nextState = participantFormReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialState.participants[0],
          participation_level_id: 5,
          duration: '50',
          include_in_group_calculations: true,
        },
        initialState.participants[1],
      ],
    });
  });

  it('updates the duration only for the filtered athletes UPDATE_ALL_PARTICIPATION_LEVELS', () => {
    const initialParticipants = [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 5,
        squads: [73, 8, 262],
        participation_level_id: 1,
        include_in_group_calculations: false,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 5,
        squads: [73, 262],
        participation_level_id: 1,
        include_in_group_calculations: false,
      },
    ];

    const action = {
      type: 'UPDATE_ALL_PARTICIPATION_LEVELS',
      payload: {
        filteredAthletes: [1],
        participationLevel: {
          id: 5,
          canonical_participation_level: 'partial',
          include_in_group_calculations: true,
        },
        eventDuration: '50',
      },
    };

    const nextState = participantFormReducer(
      { ...initialState, participants: initialParticipants },
      action
    );

    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialParticipants[0],
          participation_level_id: 5,
          include_in_group_calculations: true,
        },
        initialParticipants[1],
      ],
    });
  });

  it('empties duration and RPE on UPDATE_ALL_PARTICIPATION_LEVELS with canonical_participation_level none', () => {
    const initialParticipants = [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 5,
        squads: [73, 8, 262],
        participation_level_id: 1,
        include_in_group_calculations: true,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 5,
        squads: [73, 262],
        participation_level_id: 1,
        include_in_group_calculations: true,
      },
    ];

    const action = {
      type: 'UPDATE_ALL_PARTICIPATION_LEVELS',
      payload: {
        filteredAthletes: [1],
        participationLevel: {
          id: 5,
          canonical_participation_level: 'none',
          include_in_group_calculations: false,
        },
        eventDuration: '50',
      },
    };

    const nextState = participantFormReducer(
      { ...initialState, participants: initialParticipants },
      action
    );

    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialParticipants[0],
          participation_level_id: 5,
          duration: '',
          rpe: '',
          include_in_group_calculations: false,
        },
        initialParticipants[1],
      ],
    });
  });

  it('sets duration with the event duration on UPDATE_ALL_PARTICIPATION_LEVELS with canonical_participation_level full', () => {
    const initialParticipants = [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 5,
        squads: [73, 8, 262],
        participation_level_id: 1,
        include_in_group_calculations: false,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 5,
        squads: [73, 262],
        participation_level_id: 1,
        include_in_group_calculations: false,
      },
    ];

    const action = {
      type: 'UPDATE_ALL_PARTICIPATION_LEVELS',
      payload: {
        filteredAthletes: [1],
        participationLevel: {
          id: 5,
          canonical_participation_level: 'full',
          include_in_group_calculations: true,
        },
        eventDuration: '50',
      },
    };

    const nextState = participantFormReducer(
      { ...initialState, participants: initialParticipants },
      action
    );

    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialParticipants[0],
          participation_level_id: 5,
          duration: '50',
          include_in_group_calculations: true,
        },
        initialParticipants[1],
      ],
    });
  });

  it('returns correct state on UPDATE_PARTICIPATION_LEVEL when primary squad is the selected squad', () => {
    const initialParticipants = [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 20,
        squads: [73, 8, 262],
        include_in_group_calculations: false,
        primary_squad_id: 1,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 10,
        squads: [73, 262],
        include_in_group_calculations: false,
        primary_squad_id: 1,
      },
    ];

    const action = {
      type: 'UPDATE_PARTICIPATION_LEVEL',
      payload: {
        athleteId: 1,
        participationLevel: {
          id: 5,
          canonical_participation_level: 'partial',
          include_in_group_calculations: true,
        },
        eventDuration: '50',
        isAthletePrimarySquadSelected: true,
      },
    };

    const nextState = participantFormReducer(
      { ...initialState, participants: initialParticipants },
      action
    );
    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialParticipants[0],
          participation_level_id: 5,
          include_in_group_calculations: true,
        },
        initialParticipants[1],
      ],
    });
  });

  it('returns correct state on UPDATE_PARTICIPATION_LEVEL when primary squad is not the selected squad', () => {
    const initialParticipants = [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 20,
        squads: [73, 8, 262],
        include_in_group_calculations: false,
        primary_squad_id: 1,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 10,
        squads: [73, 262],
        include_in_group_calculations: false,
        primary_squad_id: 1,
      },
    ];

    const action = {
      type: 'UPDATE_PARTICIPATION_LEVEL',
      payload: {
        athleteId: 1,
        participationLevel: {
          id: 5,
          canonical_participation_level: 'partial',
          include_in_group_calculations: true,
        },
        eventDuration: '50',
        isAthletePrimarySquadSelected: false,
      },
    };

    const nextState = participantFormReducer(
      { ...initialState, participants: initialParticipants },
      action
    );
    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialParticipants[0],
          participation_level_id: 5,
          include_in_group_calculations: false,
        },
        initialParticipants[1],
      ],
    });
  });

  it('returns correct state on UPDATE_PARTICIPATION_LEVEL when primary squad is not set', () => {
    const initialParticipants = [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 20,
        squads: [73, 8, 262],
        include_in_group_calculations: false,
        primary_squad_id: null,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 10,
        squads: [73, 262],
        include_in_group_calculations: false,
        primary_squad_id: null,
      },
    ];

    const action = {
      type: 'UPDATE_PARTICIPATION_LEVEL',
      payload: {
        athleteId: 1,
        participationLevel: {
          id: 5,
          canonical_participation_level: 'partial',
          include_in_group_calculations: true,
        },
        eventDuration: '50',
        isAthletePrimarySquadSelected: true,
      },
    };

    const nextState = participantFormReducer(
      { ...initialState, participants: initialParticipants },
      action
    );
    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialParticipants[0],
          participation_level_id: 5,
          include_in_group_calculations: true,
        },
        initialParticipants[1],
      ],
    });
  });

  it('returns correct state on UPDATE_ALL_PARTICIPATION_LEVELS', () => {
    const initialParticipants = [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 5,
        squads: [73, 8, 262],
        participation_level_id: 1,
        include_in_group_calculations: false,
        primary_squad_id: 73,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 5,
        squads: [73, 262],
        participation_level_id: 1,
        include_in_group_calculations: false,
        primary_squad_id: 8,
      },
      {
        athlete_id: 3,
        athlete_fullname: 'Paula Doe',
        rpe: 3,
        duration: 5,
        squads: [73, 262],
        participation_level_id: 1,
        include_in_group_calculations: false,
        primary_squad_id: null,
      },
    ];

    const action = {
      type: 'UPDATE_ALL_PARTICIPATION_LEVELS',
      payload: {
        filteredAthletes: [1, 2, 3],
        participationLevel: {
          id: 5,
          canonical_participation_level: 'partial',
          include_in_group_calculations: true,
        },
        eventDuration: '50',
        selectedSquadId: 8,
      },
    };

    const nextState = participantFormReducer(
      { ...initialState, participants: initialParticipants },
      action
    );

    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialParticipants[0],
          participation_level_id: 5,
        },
        {
          ...initialParticipants[1],
          participation_level_id: 5,
          include_in_group_calculations: true,
        },
        {
          ...initialParticipants[2],
          participation_level_id: 5,
          include_in_group_calculations: true,
        },
      ],
    });
  });

  it('returns correct state on TOGGLE_INCLUDE_IN_GROUP_CALCULATIONS', () => {
    const action = {
      type: 'TOGGLE_INCLUDE_IN_GROUP_CALCULATIONS',
      payload: {
        athleteId: 1,
      },
    };

    const nextState = participantFormReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialState.participants[0],
          include_in_group_calculations: true,
        },
        initialState.participants[1],
      ],
    });
  });

  it('updates Include in Average for all filtered participants with a participation level different that none on TOGGLE_ALL_INCLUDE_IN_GROUP_CALCULATION', () => {
    const action = {
      type: 'TOGGLE_ALL_INCLUDE_IN_GROUP_CALCULATION',
      payload: {
        filteredAthletes: [1, 2],
        includeInGroupCalculations: true,
        participationLevels: [
          {
            id: 1,
            name: 'Full',
            canonical_participation_level: 'full',
          },
          {
            id: 2,
            name: 'No Participation',
            canonical_participation_level: 'none',
          },
        ],
      },
    };

    const initialParticipants = [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 20,
        squads: [73, 8, 262],
        participation_level_id: 1,
        include_in_group_calculations: false,
      },
      {
        athlete_id: 2,
        athlete_fullname: 'Paula Poe',
        rpe: 3,
        duration: 10,
        squads: [73, 262],
        participation_level_id: 2,
        include_in_group_calculations: false,
      },
      {
        athlete_id: 3,
        athlete_fullname: 'Sammy Soe',
        rpe: 3,
        duration: 10,
        squads: [73, 262],
        participation_level_id: 1,
        include_in_group_calculations: false,
      },
    ];

    const nextState = participantFormReducer(
      {
        ...initialState,
        participants: initialParticipants,
      },
      action
    );

    expect(nextState).toEqual({
      ...initialState,
      participants: [
        {
          ...initialParticipants[0],
          include_in_group_calculations: true,
        },
        initialParticipants[1], // Not updated because the participation is none
        initialParticipants[2], // Not updated because the athlete is not part of the filter
      ],
    });
  });
});
