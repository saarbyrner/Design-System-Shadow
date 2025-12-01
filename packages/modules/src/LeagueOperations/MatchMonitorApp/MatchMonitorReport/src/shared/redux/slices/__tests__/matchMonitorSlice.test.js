import matchMonitorSlice, {
  initialState,
  onToggleExistingUserPanel,
  onToggleNewUserFormPanel,
  onSetUnregisteredPlayer,
  onSetUnregisteredPlayers,
  onMatchMonitorReportChange,
  onSetNotes,
  onReset,
} from '../matchMonitorSlice';

describe('matchMonitorSlice reducers', () => {
  it('should toggle existing user panel', () => {
    const action = onToggleExistingUserPanel({ isOpen: true });
    const state = matchMonitorSlice.reducer(initialState, action);
    expect(state.existingUserPanel.isOpen).toBe(true);
  });

  it('should toggle new user form panel', () => {
    const action = onToggleNewUserFormPanel({ isOpen: true });
    const state = matchMonitorSlice.reducer(initialState, action);
    expect(state.newUserFormPanel.isOpen).toBe(true);
  });

  it('should set unregistered player', () => {
    const player = {
      firstname: 'Kobbie',
      lastname: 'Mainoo',
      date_of_birth: '2005-04-019',
      registration_status: 'pending',
      notes: 'New player',
      venue_type: 'home',
    };
    const action = onSetUnregisteredPlayer(player);
    const state = matchMonitorSlice.reducer(initialState, action);
    expect(state.unregisteredPlayer).toEqual(player);
  });

  it('should set unregistered players', () => {
    const player = {
      firstname: 'Leny',
      lastname: 'Yoro',
      date_of_birth: '2005-11-13',
      registration_status: 'trialist',
      notes: 'Returning player',
      venue_type: 'away',
    };
    const action = onSetUnregisteredPlayers(player);
    const state = matchMonitorSlice.reducer(initialState, action);
    expect(
      state.matchMonitorReport.game_monitor_report_unregistered_athletes
    ).toHaveLength(1);
    expect(
      state.matchMonitorReport.game_monitor_report_unregistered_athletes[0]
    ).toEqual(player);
    expect(state.unregisteredPlayer).toEqual(initialState.unregisteredPlayer); // Form should be reset
  });

  it('should set notes', () => {
    const action = onSetNotes('New notes');
    const state = matchMonitorSlice.reducer(initialState, action);
    expect(state.matchMonitorReport.notes).toBe('New notes');
  });

  it('should update match monitor report', () => {
    const updatedReport = {
      game_monitor_report_athletes: [
        {
          id: 1,
          firstname: 'Wayne',
          lastname: 'Rooney',
          date_of_birth: '1985-10-24',
          registration_status: 'trialist',
          notes: 'Returning player',
          venue_type: 'away',
        },
      ],
      game_monitor_report_unregistered_athletes: [],
      notes: 'The player is not compliant',
      monitor_issue: true,
      submitted_by_id: 'user123',
      updated_at: null,
    };
    const action = onMatchMonitorReportChange(updatedReport);
    const state = matchMonitorSlice.reducer(initialState, action);
    expect(state.matchMonitorReport).toEqual(updatedReport);
  });

  it('should reset state', () => {
    const action = onReset();
    const state = matchMonitorSlice.reducer(initialState, action);
    expect(state).toEqual(initialState);
  });
});
