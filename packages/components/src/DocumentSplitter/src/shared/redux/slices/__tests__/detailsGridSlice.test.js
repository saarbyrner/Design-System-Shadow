import detailsGridSlice, {
  reset,
  initialState,
  setRows,
  addRow,
  deleteRow,
  updateRow,
  setupDefaults,
  selectDataRows,
} from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/detailsGridSlice';

const testRow1 = {
  id: 1,
  pages: '1-2',
  player: { id: 1, label: 'some player 1' },
  categories: [{ id: 1, label: 'some category 1' }],
  fileName: 'test row 1',
  dateOfDocument: '2024-04-03T00:00:00+00:00',
  hasConstraintsError: false,
};

const testRow2 = {
  id: 2,
  pages: '3-5',
  player: { id: 2, label: 'some player 2' },
  categories: [{ id: 2, label: 'some category 2' }],
  fileName: 'test row 2',
  dateOfDocument: '2024-04-03T00:00:00+00:00',
  hasConstraintsError: true,
};

const preselectedPlayer = { id: 1, label: 'some other player' };

describe('[detailsGridSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(detailsGridSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('performs selectDataRows selector and setRows action correctly', () => {
    const updatedState = detailsGridSlice.reducer(
      initialState,
      setRows([testRow1])
    );
    expect(updatedState.dataRows).toEqual([testRow1]);
    expect(selectDataRows({ detailsGridSlice: updatedState })).toEqual([
      testRow1,
    ]);
  });

  it('performs updateRow action correctly', () => {
    const oneRowState = detailsGridSlice.reducer(
      initialState,
      setRows([testRow1])
    );
    expect(oneRowState.dataRows).toEqual([testRow1]);

    const updatedFileName = 'override filename';
    const updatedState = detailsGridSlice.reducer(
      oneRowState,
      updateRow({ rowId: 1, data: { fileName: updatedFileName } })
    );
    expect(updatedState.dataRows[0]).toEqual({
      ...testRow1,
      fileName: updatedFileName,
    });
  });

  it('performs setupDefaults action correctly', () => {
    const defaults = {
      defaultCategories: [],
      defaultAssociatedIssues: [],
      defaultFileName: 'default.pdf',
      defaultDateOfDocument: '2024-01-23T00:00:00+00:00',
    };

    const updatedState = detailsGridSlice.reducer(
      initialState,
      setupDefaults(defaults)
    );
    expect(updatedState.defaults).toEqual(defaults);
  });

  it('performs addRow action correctly using defaults', () => {
    const defaults = {
      defaultCategories: [],
      defaultAssociatedIssues: [],
      defaultFileName: 'default.pdf',
      defaultDateOfDocument: '2024-01-23T00:00:00+00:00',
    };

    const stateWithDefaults = detailsGridSlice.reducer(
      initialState,
      setupDefaults(defaults)
    );
    expect(stateWithDefaults.dataRows).toEqual([]);

    const addFirstState = detailsGridSlice.reducer(stateWithDefaults, addRow());
    const addSecondState = detailsGridSlice.reducer(addFirstState, addRow());

    expect(addSecondState.dataRows.length).toEqual(2);

    expect(addSecondState.dataRows[0]).toEqual({
      id: 1,
      pages: '',
      player: undefined,
      categories: defaults.defaultCategories,
      fileName: defaults.defaultFileName,
      dateOfDocument: defaults.defaultDateOfDocument,
      associatedIssues: defaults.defaultAssociatedIssues,
    });

    expect(addSecondState.dataRows[1]).toEqual({
      id: 2,
      pages: '',
      player: undefined,
      categories: defaults.defaultCategories,
      fileName: defaults.defaultFileName,
      dateOfDocument: defaults.defaultDateOfDocument,
      associatedIssues: defaults.defaultAssociatedIssues,
    });
  });

  it('performs deleteRow action correctly', () => {
    const twoRowsState = detailsGridSlice.reducer(
      initialState,
      setRows([testRow1, testRow2])
    );
    expect(twoRowsState.dataRows.length).toEqual(2);
    expect(twoRowsState.dataRows[0]).toEqual(testRow1);

    const postDeleteState = detailsGridSlice.reducer(
      twoRowsState,
      deleteRow({ rowId: 1 })
    );

    expect(postDeleteState.dataRows.length).toEqual(1);
    expect(postDeleteState.dataRows[0]).toEqual(testRow2);
  });

  it('performs reset action correctly', () => {
    const twoRowsState = detailsGridSlice.reducer(
      initialState,
      setRows([testRow1, testRow2])
    );
    expect(twoRowsState.dataRows.length).toEqual(2);

    const postResetState = detailsGridSlice.reducer(
      twoRowsState,
      reset(preselectedPlayer)
    );

    expect(postResetState.dataRows.length).toEqual(0);
    expect(postResetState.preselectedPlayer).toEqual(preselectedPlayer);
  });

  it('performs addRow action correctly with preselectedPlayer', () => {
    const preselectedPlayerState = detailsGridSlice.reducer(
      { initialState },
      reset(preselectedPlayer)
    );
    expect(preselectedPlayerState.preselectedPlayer).toEqual(preselectedPlayer);
    expect(preselectedPlayerState.dataRows.length).toEqual(0);

    const addRowState = detailsGridSlice.reducer(
      preselectedPlayerState,
      addRow()
    );

    expect(addRowState.dataRows.length).toEqual(1);
    expect(addRowState.dataRows[0].player).toEqual(preselectedPlayer);
  });
});
