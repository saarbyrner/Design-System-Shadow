import medicalDocumentSlice, { setRequestDocumentData } from '../documentSlice';

describe('medicalDocumentSlice', () => {
  const initialState = {
    medicalDocument: {
      requestDocumentData: false,
    },
  };

  it('should have correct initial state', () => {
    const action = { type: 'unknown' };

    expect(medicalDocumentSlice.reducer(initialState, action)).toEqual(
      initialState
    );
  });

  describe('actions', () => {
    it('should correctly update value when setRequestDocumentData is called', () => {
      const action = setRequestDocumentData(true);
      const updatedState = medicalDocumentSlice.reducer(initialState, action);

      expect(updatedState.requestDocumentData).toEqual(true);
    });
  });
});
