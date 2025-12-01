import {
  updateDuration,
  updateRPE,
  toggleIncludeInGroupCalculations,
  updateRpeCollectionAthlete,
  updateRpeCollectionKiosk,
  updateMassInput,
  updateAllDurations,
  updateParticipationLevel,
  updateAllParticipationLevels,
  toggleAllIncludeInGroupCalculations,
} from '../participantForm';

describe('participantForm actions', () => {
  it('has the correct action UPDATE_DURATION', () => {
    const expectedAction = {
      type: 'UPDATE_DURATION',
      payload: {
        athleteId: 1,
        duration: 30,
      },
    };

    expect(updateDuration(1, 30)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_RPE', () => {
    const expectedAction = {
      type: 'UPDATE_RPE',
      payload: {
        athleteId: 1,
        rpe: 7,
      },
    };

    expect(updateRPE(1, 7)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_RPE_COLLECTION_ATHLETE', () => {
    const expectedAction = {
      type: 'UPDATE_RPE_COLLECTION_ATHLETE',
      payload: {
        rpeCollectionAthlete: 1,
      },
    };

    expect(updateRpeCollectionAthlete(1)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_RPE_COLLECTION_KIOSK', () => {
    const expectedAction = {
      type: 'UPDATE_RPE_COLLECTION_KIOSK',
      payload: {
        rpeCollectionKiosk: 1,
      },
    };

    expect(updateRpeCollectionKiosk(1)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_MASS_INPUT', () => {
    const expectedAction = {
      type: 'UPDATE_MASS_INPUT',
      payload: {
        massInput: 1,
      },
    };

    expect(updateMassInput(1)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_ALL_DURATIONS', () => {
    const expectedAction = {
      type: 'UPDATE_ALL_DURATIONS',
      payload: {
        filteredAthletes: [1],
        duration: 24,
        participationLevels: [{ id: 1, canonical_participation_level: 'full' }],
      },
    };

    expect(
      updateAllDurations([1], 24, [
        { id: 1, canonical_participation_level: 'full' },
      ])
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_PARTICIPATION_LEVEL', () => {
    const expectedAction = {
      type: 'UPDATE_PARTICIPATION_LEVEL',
      payload: {
        athleteId: 1,
        participationLevel: {
          id: 24,
          name: 'Full',
        },
        eventDuration: '50',
        isAthletePrimarySquadSelected: true,
      },
    };

    expect(
      updateParticipationLevel(
        1,
        {
          id: 24,
          name: 'Full',
        },
        '50',
        true
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_ALL_PARTICIPATION_LEVELS', () => {
    const expectedAction = {
      type: 'UPDATE_ALL_PARTICIPATION_LEVELS',
      payload: {
        filteredAthletes: [1],
        participationLevel: {
          id: 24,
          name: 'Full',
        },
        eventDuration: '50',
        selectedSquadId: 1,
      },
    };

    expect(
      updateAllParticipationLevels(
        [1],
        {
          id: 24,
          name: 'Full',
        },
        '50',
        1
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action TOGGLE_INCLUDE_IN_GROUP_CALCULATIONS', () => {
    const expectedAction = {
      type: 'TOGGLE_INCLUDE_IN_GROUP_CALCULATIONS',
      payload: {
        athleteId: 1,
      },
    };

    expect(toggleIncludeInGroupCalculations(1)).toEqual(expectedAction);
  });

  it('has the correct action TOGGLE_ALL_INCLUDE_IN_GROUP_CALCULATION', () => {
    const expectedAction = {
      type: 'TOGGLE_ALL_INCLUDE_IN_GROUP_CALCULATION',
      payload: {
        filteredAthletes: [1],
        includeInGroupCalculations: true,
        participationLevels: [
          {
            id: 1,
            name: 'Full',
            canonical_participation_level: 'full',
          },
        ],
      },
    };

    expect(
      toggleAllIncludeInGroupCalculations([1], true, [
        {
          id: 1,
          name: 'Full',
          canonical_participation_level: 'full',
        },
      ])
    ).toEqual(expectedAction);
  });
});
