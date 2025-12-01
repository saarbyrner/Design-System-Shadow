import genericDocumentsSlice, {
  onReset,
  onBuildGenericDocumentsState,
  onBuildGenericDocumentsCategoriesState,
} from '@kitman/services/src/services/documents/generic/redux/slices/genericDocumentsSlice';
import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/searchDocuments';
import { data as categoriesData } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/fetchGenericDocumentsCategories';

describe('genericDocumentsSlice', () => {
  const initialState = {
    genericDocuments: {},
    genericDocumentsCategories: [],
  };

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(genericDocumentsSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on onReset', () => {
    const action = onReset();

    expect(genericDocumentsSlice.reducer(initialState, action)).toEqual(
      initialState
    );
  });

  it('should correctly update state on onBuildGenericDocumentsState', () => {
    const action = onBuildGenericDocumentsState(data);
    const documents = data.documents;
    const expectedMap = {
      1: documents[0],
      2: documents[1],
      3: documents[2],
      4: documents[3],
      5: documents[4],
      6: documents[5],
      7: documents[6],
      8: documents[7],
      9: documents[8],
      10: documents[9],
    };

    expect(genericDocumentsSlice.reducer(initialState, action)).toEqual({
      genericDocuments: expectedMap,
      genericDocumentsCategories: [],
    });
  });

  it('should correctly update state on onBuildGenericDocumentsCategoriesState', () => {
    const action = onBuildGenericDocumentsCategoriesState(categoriesData);

    expect(genericDocumentsSlice.reducer(initialState, action)).toEqual({
      genericDocuments: {},
      genericDocumentsCategories: categoriesData,
    });
  });
});
