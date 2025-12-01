import { orgSettings, appStatus } from '../reducer';

describe('Organisation Settings reducer', () => {
  const initialState = {
    graphColourPalette: [],
    groupedWorkloadOptions: [
      { name: 'Kitman', isGroupOption: true },
      { name: 'RPE x Duration', id: 'kitman|workload', isGroupOption: false },
      { name: 'Catapult', isGroupOption: true },
      {
        name: 'Total Distance',
        id: 'catapult|total_distance',
        isGroupOption: false,
      },
      {
        name: 'Velocity Band 3 Avg … Duration',
        id: 'catapult|velocity_band_3_avg_…_duration',
        isGroupOption: false,
      },
    ],
    primaryWorkloadVariableId: 'kitman|workload',
    secondaryWorkloadVariableId: 'catapult|total_distance',
    gameRpeCollection: {
      kioskApp: false,
      athleteApp: false,
    },
    trainingRpeCollection: {
      kioskApp: false,
      athleteApp: false,
    },
    gameParticipationLevels: [
      {
        id: 1,
        name: 'Full Game',
        canonical_participation_level: 'full',
        include_in_group_calculations: false,
        default: true,
      },
    ],
    trainingParticipationLevels: [
      {
        id: 1,
        name: 'Full Game',
        canonical_participation_level: 'full',
        include_in_group_calculations: false,
        default: true,
      },
    ],
    nameFormattings: {
      display_name: {
        active: 1,
        options: [
          { id: 1, title: 'First name, Last name' },
          { id: 2, title: 'Last name, First name' },
        ],
      },
      shortened_name: {
        active: 1,
        options: [
          { id: 1, title: 'First name initial, Last name' },
          { id: 2, title: 'Last name' },
          { id: 3, title: 'First name' },
          { id: 4, title: 'First name, Last name' },
          { id: 5, title: 'Last name, First name' },
        ],
      },
    },
    integrations: {
      activeIntegrations: [],
      availableIntegrations: [],
      addIntegrationModal: { isOpen: false },
      unlinkIntegrationModal: { isOpen: false, unlinkUrl: null },
    },
  };

  it('returns correct state on UPDATE_PRIMARY_WORKLOAD_VARIABLE', () => {
    const action = {
      type: 'UPDATE_PRIMARY_WORKLOAD_VARIABLE',
      payload: { variableId: 'catapult|velocity_band_3_avg_…_duration' },
    };
    const nextState = orgSettings(initialState, action);
    expect(nextState.primaryWorkloadVariableId).toBe(
      'catapult|velocity_band_3_avg_…_duration'
    );
  });

  it('returns correct state on UPDATE_SECONDARY_WORKLOAD_VARIABLE', () => {
    const action = {
      type: 'UPDATE_SECONDARY_WORKLOAD_VARIABLE',
      payload: { variableId: 'catapult|velocity_band_3_avg_…_duration' },
    };
    const nextState = orgSettings(initialState, action);
    expect(nextState.secondaryWorkloadVariableId).toBe(
      'catapult|velocity_band_3_avg_…_duration'
    );
  });

  it('returns correct state on RESTORE_DEFAULT_WORKLOAD_SETTINGS', () => {
    const action = { type: 'RESTORE_DEFAULT_WORKLOAD_SETTINGS' };
    const nextState = orgSettings(initialState, action);
    expect(nextState.primaryWorkloadVariableId).toBe('kitman|workload');
    expect(nextState.secondaryWorkloadVariableId).toBe('');
  });

  it('returns correct state on FETCH_GRAPH_COLOURS_SUCCESS', () => {
    const colourPalette = ['#FFFFFF', '#000000'];
    const action = {
      type: 'FETCH_GRAPH_COLOURS_SUCCESS',
      payload: { colourPalette },
    };
    const nextState = orgSettings(initialState, action);
    expect(nextState.graphColourPalette).toEqual(colourPalette);
  });

  it('returns correct state on RESET_GRAPH_COLOURS_SUCCESS', () => {
    const colourPalette = ['#F39C11', '#3A8DEE'];
    const action = {
      type: 'RESET_GRAPH_COLOURS_SUCCESS',
      payload: { colourPalette },
    };
    const nextState = orgSettings(initialState, action);
    expect(nextState.graphColourPalette).toEqual(colourPalette);
  });

  it('returns correct state on UPDATE_GRAPH_COLOUR_PALETTE_SUCCESS', () => {
    const colourPalette = ['#FFFFFF', '#000000'];
    const action = {
      type: 'UPDATE_GRAPH_COLOUR_PALETTE_SUCCESS',
      payload: { colourPalette },
    };
    const nextState = orgSettings(initialState, action);
    expect(nextState.graphColourPalette).toEqual(colourPalette);
  });

  it('returns correct state on UPDATE_NAME_FORMATTINGS_SUCCESS', () => {
    const action = {
      type: 'UPDATE_NAME_FORMATTINGS_SUCCESS',
      payload: { displayNameId: 2, shortenedNameId: 3 },
    };
    const nextState = orgSettings(initialState, action);
    expect(nextState.nameFormattings.display_name.active).toBe(2);
    expect(nextState.nameFormattings.shortened_name.active).toBe(3);
  });

  it('returns correct state on FETCH_ACTIVE_INTEGRATIONS_SUCCESS', () => {
    const activeIntegrations = [{ id: 1, name: 'Push Strength' }];
    const action = {
      type: 'FETCH_ACTIVE_INTEGRATIONS_SUCCESS',
      payload: { activeIntegrations },
    };
    const nextState = orgSettings(initialState, action);
    expect(nextState.integrations.activeIntegrations).toEqual(
      activeIntegrations
    );
  });

  it('returns correct state on FETCH_AVAILABLE_INTEGRATIONS_SUCCESS', () => {
    const availableIntegrations = [{ name: 'Fitbit', url: 'login/fitbit' }];
    const action = {
      type: 'FETCH_AVAILABLE_INTEGRATIONS_SUCCESS',
      payload: { availableIntegrations },
    };
    const nextState = orgSettings(initialState, action);
    expect(nextState.integrations.availableIntegrations).toEqual(
      availableIntegrations
    );
  });

  it('returns correct state on UNLINK_INTEGRATION_SUCCESS', () => {
    const state = {
      ...initialState,
      integrations: {
        ...initialState.integrations,
        activeIntegrations: [{ id: 12 }, { id: 145 }],
      },
    };
    const action = {
      type: 'UNLINK_INTEGRATION_SUCCESS',
      payload: { integrationId: 145 },
    };
    const nextState = orgSettings(state, action);
    expect(nextState.integrations.activeIntegrations).toEqual([{ id: 12 }]);
  });

  it('returns correct state on OPEN_ADD_INTEGRATION_MODAL', () => {
    const action = { type: 'OPEN_ADD_INTEGRATION_MODAL' };
    const nextState = orgSettings(initialState, action);
    expect(nextState.integrations.addIntegrationModal.isOpen).toBe(true);
  });

  it('returns correct state on OPEN_UNLINK_INTEGRATION_MODAL', () => {
    const action = {
      type: 'OPEN_UNLINK_INTEGRATION_MODAL',
      payload: { integrationId: 123, unlinkUrl: 'delete/push' },
    };
    const nextState = orgSettings(initialState, action);
    expect(nextState.integrations.unlinkIntegrationModal).toEqual({
      isOpen: true,
      id: 123,
      unlinkUrl: 'delete/push',
    });
  });

  it('returns correct state on CLOSE_ADD_INTEGRATION_MODAL', () => {
    const state = {
      ...initialState,
      integrations: {
        ...initialState.integrations,
        addIntegrationModal: { isOpen: true },
      },
    };
    const action = { type: 'CLOSE_ADD_INTEGRATION_MODAL' };
    const nextState = orgSettings(state, action);
    expect(nextState.integrations.addIntegrationModal.isOpen).toBe(false);
  });

  it('returns correct state on CLOSE_UNLINK_INTEGRATION_MODAL', () => {
    const state = {
      ...initialState,
      integrations: {
        ...initialState.integrations,
        unlinkIntegrationModal: { isOpen: true, id: 1, unlinkUrl: 'url' },
      },
    };
    const action = { type: 'CLOSE_UNLINK_INTEGRATION_MODAL' };
    const nextState = orgSettings(state, action);
    expect(nextState.integrations.unlinkIntegrationModal).toEqual({
      isOpen: false,
      id: null,
      unlinkUrl: null,
    });
  });

  describe('UPDATE_RPE_COLLECTION', () => {
    it('returns the correct state for GAME and KIOSK_APP', () => {
      const action = {
        type: 'UPDATE_RPE_COLLECTION',
        payload: { sessionType: 'GAME', channelType: 'KIOSK_APP', value: true },
      };
      const nextState = orgSettings(initialState, action);
      expect(nextState.gameRpeCollection.kioskApp).toBe(true);
    });

    it('returns the correct state for TRAINING_SESSION and ATHLETE_APP', () => {
      const action = {
        type: 'UPDATE_RPE_COLLECTION',
        payload: {
          sessionType: 'TRAINING_SESSION',
          channelType: 'ATHLETE_APP',
          value: true,
        },
      };
      const nextState = orgSettings(initialState, action);
      expect(nextState.trainingRpeCollection.athleteApp).toBe(true);
    });
  });

  describe('UPDATE_PARTICIPATION_LEVEL_NAME', () => {
    it('returns the correct state for GAME sessionType', () => {
      const action = {
        type: 'UPDATE_PARTICIPATION_LEVEL_NAME',
        payload: {
          sessionType: 'GAME',
          participationLevelId: 1,
          value: 'New Name',
        },
      };
      const nextState = orgSettings(initialState, action);
      expect(nextState.gameParticipationLevels[0].name).toBe('New Name');
    });

    it('returns the correct state for TRAINING_SESSION sessionType', () => {
      const action = {
        type: 'UPDATE_PARTICIPATION_LEVEL_NAME',
        payload: {
          sessionType: 'TRAINING_SESSION',
          participationLevelId: 1,
          value: 'New Name',
        },
      };
      const nextState = orgSettings(initialState, action);
      expect(nextState.trainingParticipationLevels[0].name).toBe('New Name');
    });
  });

  describe('UPDATE_INCLUDE_IN_GROUP_CALCULATION', () => {
    it('returns the correct state for GAME sessionType', () => {
      const action = {
        type: 'UPDATE_INCLUDE_IN_GROUP_CALCULATION',
        payload: { sessionType: 'GAME', participationLevelId: 1 },
      };
      const nextState = orgSettings(initialState, action);
      expect(
        nextState.gameParticipationLevels[0].include_in_group_calculations
      ).toBe(true);
    });

    it('returns the correct state for TRAINING_SESSION sessionType', () => {
      const action = {
        type: 'UPDATE_INCLUDE_IN_GROUP_CALCULATION',
        payload: { sessionType: 'TRAINING_SESSION', participationLevelId: 1 },
      };
      const nextState = orgSettings(initialState, action);
      expect(
        nextState.trainingParticipationLevels[0].include_in_group_calculations
      ).toBe(true);
    });
  });
});

describe('AppStatus reducer', () => {
  const initialState = { status: null, message: null };

  it('returns correct state on SAVE_WORKLOAD_SETTINGS_SUCCESS', () => {
    const action = { type: 'SAVE_WORKLOAD_SETTINGS_SUCCESS' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'success',
      message: 'Workload Settings successfully updated',
    });
  });

  it('returns correct state on FETCH_GRAPH_COLOURS_FAILURE', () => {
    const action = { type: 'FETCH_GRAPH_COLOURS_FAILURE' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'error',
      message: 'Could not retrieve graph colours',
    });
  });

  it('returns correct state on RESET_GRAPH_COLOURS_FAILURE', () => {
    const action = { type: 'RESET_GRAPH_COLOURS_FAILURE' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'error',
      message: 'Could not restore graph colours',
    });
  });

  it('returns correct state on UPDATE_GRAPH_COLOUR_PALETTE_FAILURE', () => {
    const action = { type: 'UPDATE_GRAPH_COLOUR_PALETTE_FAILURE' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'error',
      message: 'Colour was not saved correctly',
    });
  });

  it('returns correct state on FETCH_ACTIVE_INTEGRATIONS_FAILURE', () => {
    const action = { type: 'FETCH_ACTIVE_INTEGRATIONS_FAILURE' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'error',
      message: 'Could not retrieve active integrations',
    });
  });

  it('returns correct state on FETCH_AVAILABLE_INTEGRATIONS_FAILURE', () => {
    const action = { type: 'FETCH_AVAILABLE_INTEGRATIONS_FAILURE' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'error',
      message: 'Could not retrieve available integrations',
    });
  });
});
