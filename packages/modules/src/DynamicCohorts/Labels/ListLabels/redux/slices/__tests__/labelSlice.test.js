import labelSlice, {
  onUpdateForm,
  onUpdateErrorState,
  onReset,
  getInitialState,
  onStartEditing,
} from '../labelSlice';

describe('labelSlice', () => {
  const initialState = getInitialState();

  const formData = {
    name: 'Custom Label Name',
    description: 'This is a custom description.',
    color: '#5f7089',
  };

  const errorState = [{ isValid: false, message: 'Not valid.' }];

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(labelSlice.reducer(initialState, action)).toEqual(expectedState);
  });

  it('should correctly update the form', () => {
    const action = onUpdateForm(formData);
    const updatedState = labelSlice.reducer(initialState, action);
    expect(updatedState.formState).toEqual(formData);
  });

  it('should handle onReset', () => {
    const state = {
      formState: {
        ...formData,
      },
      errorState,
    };
    const action = onReset();
    const updatedState = labelSlice.reducer(state, action);

    expect(updatedState).toEqual(initialState);
  });

  it('should update the error state properly', () => {
    const action = onUpdateErrorState(errorState[0].message);
    const updatedState = labelSlice.reducer(initialState, action);
    expect(updatedState.errorState).toEqual(errorState);
  });

  it('should update the edit state properly', () => {
    const action = onStartEditing();
    const updatedState = labelSlice.reducer(initialState, action);
    expect(updatedState.isEditing).toEqual(true);
  });
});
