import registrationRequirementsSlice, {
  onReset,
  onSetRequirementParams,
  initialState,
  onTogglePanel,
  onSetSectionStatuses,
  onSetProfile,
  onSetApprovalStatus,
  onSetApprovalAnnotation,
} from '../registrationRequirementsSlice';

describe('[registrationRequirementsSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(registrationRequirementsSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset', () => {
    const action = onReset();
    const updatedState = registrationRequirementsSlice.reducer(
      initialState,
      action
    );
    expect(updatedState).toEqual(initialState);
  });

  it('should onSetRequirementParams', () => {
    const action = onSetRequirementParams({
      requirementId: 1,
      userId: 1,
    });

    const updatedState = registrationRequirementsSlice.reducer(
      initialState,
      action
    );
    expect(updatedState.requirementId).toStrictEqual(1);
    expect(updatedState.userId).toStrictEqual(1);
  });

  it('should onTogglePanel when not isOpen', () => {
    const action = onTogglePanel({ isOpen: false });

    const updatedState = registrationRequirementsSlice.reducer(
      initialState,
      action
    );
    expect(updatedState).toEqual(initialState);
  });

  it('should onSetSectionStatuses', () => {
    const statuses = [
      {
        id: 1,
        type: 'pending_league',
        name: 'Pending League',
      },
      {
        id: 2,
        type: 'pending_club',
        name: 'Pending Club',
      },
    ];

    const action = onSetSectionStatuses({
      statuses,
    });

    const updatedState = registrationRequirementsSlice.reducer(
      initialState,
      action
    );
    expect(updatedState.statuses).toStrictEqual(statuses);
  });

  it('should onSetProfile', () => {
    const profile = { id: 1, name: 'John Doe' };
    const action = onSetProfile({ profile });

    const updatedState = registrationRequirementsSlice.reducer(
      initialState,
      action
    );
    expect(updatedState.profile).toStrictEqual(profile);
  });

  it('should onSetApprovalStatus', () => {
    const action = onSetApprovalStatus({
      status: 'approved',
    });

    const updatedState = registrationRequirementsSlice.reducer(
      initialState,
      action
    );
    expect(updatedState.approval.status).toStrictEqual('approved');
  });

  it('should onSetApprovalAnnotation', () => {
    const action = onSetApprovalAnnotation({
      annotation: 'Approved with comments',
    });

    const updatedState = registrationRequirementsSlice.reducer(
      initialState,
      action
    );
    expect(updatedState.approval.annotation).toStrictEqual(
      'Approved with comments'
    );
  });
});
