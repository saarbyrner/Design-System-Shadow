import officialSlice, { onUpdateForm, onReset } from '../officialSlice';

describe('officialSlice', () => {
  const initialState = {
    formState: {
      firstname: '',
      lastname: '',
      email: '',
      date_of_birth: '',
      locale: '',
      is_active: true,
    },
  };

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(officialSlice.reducer(initialState, action)).toEqual(expectedState);
  });

  it('should correctly update a form value', () => {
    const formData = {
      firstname: 'Ricky',
      lastname: 'Doe',
      email: 'ricky.doe@email.com',
      date_of_birth: '1999-01-01',
      locale: 'eu',
      is_active: true,
    };
    const action = onUpdateForm(formData);
    const updatedState = officialSlice.reducer(initialState, action);
    expect(updatedState.formState).toEqual(formData);
  });

  it('should handle onRest', () => {
    const state = {
      firstname: 'Ricky',
      lastname: 'Doe',
      email: 'ricky.doe@email.com',
      date_of_birth: '',
      locale: '',
      is_active: true,
    };
    const action = onReset();
    const updatedState = officialSlice.reducer(state, action);

    expect(updatedState.formState).toEqual({
      firstname: '',
      lastname: '',
      email: '',
      date_of_birth: '',
      locale: '',
      is_active: true,
    });
  });
});
