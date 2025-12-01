import disciplinaryIssueSlice, {
  onTogglePanel,
  onSetDisciplinaryIssueDetails,
  initialState,
} from '../disciplinaryIssueSlice';

describe('[createDisciplinaryIssueSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(disciplinaryIssueSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly onTogglePanel', () => {
    const action = onTogglePanel({ isOpen: true });
    const updatedState = disciplinaryIssueSlice.reducer(initialState, action);
    expect(updatedState.panel).toEqual({
      isOpen: true,
      mode: 'CREATE_DISCIPLINARY_ISSUE',
      profile: null,
      userToBeDisciplined: null,
    });
  });

  it('should correctly onSetDisciplinaryIssueDetails', () => {
    const localIssueState = {
      ...initialState,
      issue: {
        user_id: null,
        reason: 'red card - violent conduct',
        start_date: null,
        end_date: null,
        note: 'kicked a referee',
      },
    };
    const action = onSetDisciplinaryIssueDetails({ user_id: 1 });
    const updatedState = disciplinaryIssueSlice.reducer(
      {
        ...localIssueState,
      },
      action
    );
    expect(updatedState.issue).toEqual({
      ...localIssueState.issue,
      user_id: 1,
    });
  });
});
