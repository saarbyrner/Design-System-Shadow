import athleteManagementSlice, {
  onReset,
  onToggleShowWellBeingModal,
  onToggleTrainingSessionReminderModal,
  onUpdateSelectedAthleteIds,
  onUpdateSelectedSquadIds,
  onUpdateShouldRemovePrimarySquad,
  onUpdateSearchQuery,
  initialState,
  onSetStatuses,
} from '../athleteManagementSlice';

describe('[athleteManagementSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(athleteManagementSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset', () => {
    const action = onReset();
    const updatedState = athleteManagementSlice.reducer(initialState, action);
    expect(updatedState).toEqual(initialState);
  });

  it('should toggle onToggleShowWellBeingModal', () => {
    const action = onToggleShowWellBeingModal();
    const updatedState = athleteManagementSlice.reducer(initialState, action);
    expect(updatedState).toEqual({
      ...initialState,
      panels: {
        wellBeingReminderModal: true,
        trainingSessionReminderModal: false,
      },
    });
  });
  it('should toggle onToggleTrainingSessionReminderModal', () => {
    const action = onToggleTrainingSessionReminderModal();
    const updatedState = athleteManagementSlice.reducer(initialState, action);
    expect(updatedState).toEqual({
      ...initialState,
      panels: {
        wellBeingReminderModal: false,
        trainingSessionReminderModal: true,
      },
    });
  });

  it('updates state based on onUpdateSelectedAthleteIds', () => {
    const selectedAthleteIds = [
      { id: 1, userId: 2 },
      { id: 123, userId: 234 },
    ];
    const action = onUpdateSelectedAthleteIds(selectedAthleteIds);
    const updatedState = athleteManagementSlice.reducer(initialState, action);

    expect(updatedState).toEqual({
      ...initialState,
      bulkActions: {
        ...initialState.bulkActions,
        selectedAthleteIds,
      },
    });
  });

  it('updates state based on onUpdateSelectedSquadIds', () => {
    const selectedSquadIds = [
      { label: 'U21', value: 1 },
      { label: 'U23', value: 2 },
    ];
    const action = onUpdateSelectedSquadIds(selectedSquadIds);
    const updatedState = athleteManagementSlice.reducer(initialState, action);

    expect(updatedState).toEqual({
      ...initialState,
      bulkActions: {
        ...initialState.bulkActions,
        selectedSquadIds,
      },
    });
  });

  it('updates state based on ‘onUpdateShouldRemovePrimarySquad’', () => {
    const shouldRemovePrimarySquad = false;
    const action = onUpdateShouldRemovePrimarySquad(shouldRemovePrimarySquad);
    const updatedState = athleteManagementSlice.reducer(initialState, action);

    expect(updatedState).toEqual({
      ...initialState,
      bulkActions: {
        ...initialState.bulkActions,
        shouldRemovePrimarySquad,
      },
    });
  });

  it('updates state based on onUpdateSearchQuery', () => {
    const searchQuery = 'Gil';
    const action = onUpdateSearchQuery(searchQuery);
    const updatedState = athleteManagementSlice.reducer(initialState, action);

    expect(updatedState).toEqual({
      ...initialState,
      searchQuery,
    });
  });

  it('should update statuses correctly', () => {
    const statuses = { activeStatus: 'Active', careerStatus: 'Professional' };
    const action = onSetStatuses(statuses);
    const updatedState = athleteManagementSlice.reducer(initialState, action);
    expect(updatedState).toEqual({
      ...initialState,
      statuses,
    });
  });
});
