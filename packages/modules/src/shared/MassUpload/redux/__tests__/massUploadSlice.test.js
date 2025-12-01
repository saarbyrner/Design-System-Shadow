import massUploadSlice, {
  openMassUploadModal,
  closeMassUploadModal,
  onOpenAddAthletesSidePanel,
  onCloseAddAthletesSidePanel,
  onUpdateImportToDelete,
  initialState,
} from '../massUploadSlice';

describe('massUploadSlice', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(massUploadSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on openMassUploadModal', () => {
    const action = openMassUploadModal();
    const expectedState = {
      ...initialState,
      massUploadModal: {
        isOpen: true,
      },
    };

    expect(massUploadSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on closeMassUploadModal', () => {
    const action = closeMassUploadModal();

    expect(massUploadSlice.reducer(initialState, action)).toEqual(initialState);
  });

  it('should correctly update state on onOpenAddAthletesSidePanel', () => {
    const action = onOpenAddAthletesSidePanel();
    const expectedState = {
      ...initialState,
      addAthletesSidePanel: {
        isOpen: true,
      },
    };

    expect(massUploadSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on onCloseAddAthletesSidePanel', () => {
    const action = onCloseAddAthletesSidePanel();

    expect(massUploadSlice.reducer(initialState, action)).toEqual(initialState);
  });

  it('should correctly update state on onUpdateImportToDelete', () => {
    const action = onUpdateImportToDelete({
      id: 1,
      showDeleteConfirmation: true,
      submissionStatus: 'successful',
    });

    expect(massUploadSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      deleteImport: {
        attachmentId: 1,
        isConfirmationModalOpen: true,
        submissionStatus: 'successful',
      },
    });
  });
});
