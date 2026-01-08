import splitSetupSlice, {
  reset,
  initialState,
  updateDetails,
  updateSplitOptions,
  selectDocumentDetails,
  selectSplitOptions,
} from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/splitSetupSlice';
import { SPLIT_DOCUMENT_MODES } from '@kitman/components/src/DocumentSplitter/src/shared/consts';

const testDocumentDetails = {
  fileName: 'file.pdf',
  documentDate: '2024-04-03T00:00:00+00:00',
  documentCategories: [{ id: 1, label: 'some category' }],
  players: [{ id: 1, label: 'some player' }],
  playerIsPreselected: false,
  hasConstraintsError: false,
};

const testSlitOptions = {
  splitDocument: SPLIT_DOCUMENT_MODES.intoSections,
  numberOfSections: 4,
  splitEvery: 4,
  splitFrom: 1,
};

describe('[splitSetupSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(splitSetupSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('performs updateDetails action and selectDocumentDetails selector correctly', () => {
    const updatedState = splitSetupSlice.reducer(
      initialState,
      updateDetails(testDocumentDetails)
    );
    expect(updatedState).toEqual({
      ...initialState,
      documentDetails: testDocumentDetails,
    });
    expect(selectDocumentDetails({ splitSetupSlice: updatedState })).toEqual(
      testDocumentDetails
    );
  });

  it('performs updateSplitOptions action and selectSplitOptions selector correctly', () => {
    const updatedState = splitSetupSlice.reducer(
      initialState,
      updateSplitOptions(testSlitOptions)
    );
    expect(updatedState).toEqual({
      ...initialState,
      splitOptions: testSlitOptions,
    });
    expect(selectSplitOptions({ splitSetupSlice: updatedState })).toEqual(
      testSlitOptions
    );
  });

  it('performs reset action correctly', () => {
    const resetWithPreselectedPlayer = {
      players: [{ id: 1, label: 'some other player' }],
      playerIsPreselected: true,
    };
    const updatedState = splitSetupSlice.reducer(
      initialState,
      reset(resetWithPreselectedPlayer)
    );
    expect(updatedState).toEqual({
      ...initialState,
      documentDetails: {
        ...initialState.documentDetails,
        ...resetWithPreselectedPlayer,
      },
    });
  });
});
