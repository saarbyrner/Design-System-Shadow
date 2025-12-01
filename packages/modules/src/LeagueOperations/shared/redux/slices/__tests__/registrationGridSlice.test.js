import grids from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_grids';
import registrationGridSlice, {
  onReset,
  onSetGrids,
  onSetApprovalState,
  onToggleModal,
  setSelectedRow,
  onSetSelectedLabelIds,
  onSetOriginalSelectedLabelIds,
  onSetSelectedAthleteIds,
} from '../registrationGridSlice';

const initialState = {
  grids: null,
  modal: {
    isOpen: false,
    action: '',
    text: {},
  },
  approvalState: {
    status: undefined,
    reasonId: undefined,
    annotation: '',
  },
  panel: {
    isOpen: false,
  },
  selectedRow: {},
  bulkActions: {
    originalSelectedLabelIds: [],
    selectedAthleteIds: [],
    selectedLabelIds: [],
  },
};

describe('[registrationGridSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(registrationGridSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset', () => {
    const action = onReset();
    const updatedState = registrationGridSlice.reducer(initialState, action);
    expect(updatedState).toEqual(initialState);
  });

  it('should onSetProfile', () => {
    const action = onSetGrids({ grids });

    const updatedState = registrationGridSlice.reducer(initialState, action);
    expect(updatedState.grids).toStrictEqual(grids);
  });

  it('should onSetApprovalState', () => {
    const action = onSetApprovalState({
      status: 'approved',
      reasonId: '123',
      annotation: 'test',
    });
    const updatedState = registrationGridSlice.reducer(initialState, action);
    expect(updatedState.approvalState.status).toBe('approved');
    expect(updatedState.approvalState.reasonId).toBe('123');
    expect(updatedState.approvalState.annotation).toBe('test');
  });

  it('should toggle modal state correctly', () => {
    const action = onToggleModal({
      isOpen: true,
      action: 'edit',
      text: { header: 'Edit Modal', body: 'Editing...' },
    });

    const updatedState = registrationGridSlice.reducer(initialState, action);
    expect(updatedState.modal.isOpen).toBe(true);
    expect(updatedState.modal.action).toBe('edit');
    expect(updatedState.modal.text).toEqual({
      header: 'Edit Modal',
      body: 'Editing...',
    });
  });

  it('should set selected row correctly', () => {
    const selectedRow = { id: 1, name: 'Test Row' };
    const action = setSelectedRow({ selectedRow });

    const updatedState = registrationGridSlice.reducer(initialState, action);
    expect(updatedState.selectedRow).toEqual({ selectedRow });
  });

  it('should set selected label IDs correctly', () => {
    const selectedLabelIds = [1, 2, 3];
    const action = onSetSelectedLabelIds({ selectedLabelIds });

    const updatedState = registrationGridSlice.reducer(initialState, action);
    expect(updatedState.bulkActions.selectedLabelIds).toEqual({
      selectedLabelIds: [1, 2, 3],
    });
  });

  it('should set original selected label IDs correctly', () => {
    const originalSelectedLabelIds = [4, 5, 6];
    const action = onSetOriginalSelectedLabelIds({ originalSelectedLabelIds });

    const updatedState = registrationGridSlice.reducer(initialState, action);
    expect(updatedState.bulkActions.originalSelectedLabelIds).toEqual({
      originalSelectedLabelIds: [4, 5, 6],
    });
  });

  it('should set selected athlete IDs correctly', () => {
    const selectedAthleteIds = [
      { id: 1, userId: 101 },
      { id: 2, userId: 102 },
    ];

    const action = onSetSelectedAthleteIds({ selectedAthleteIds });

    const updatedState = registrationGridSlice.reducer(initialState, action);
    expect(updatedState.bulkActions.selectedAthleteIds).toEqual({
      selectedAthleteIds: [
        { id: 1, userId: 101 },
        { id: 2, userId: 102 },
      ],
    });
  });
});
