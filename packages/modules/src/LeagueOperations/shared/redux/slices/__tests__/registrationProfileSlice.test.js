import registrationProfileSlice, {
  onReset,
  onSetProfile,
  onSetId,
} from '../registrationProfileSlice';

import { data } from '../../../services/mocks/data/mock_registration_profile';

const initialState = {
  id: null,
  profile: null,
};

describe('[registrationProfileSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(registrationProfileSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset', () => {
    const action = onReset();
    const updatedState = registrationProfileSlice.reducer(initialState, action);
    expect(updatedState).toEqual(initialState);
  });

  it('should onSetProfile', () => {
    const action = onSetProfile({ profile: data });

    const updatedState = registrationProfileSlice.reducer(initialState, action);
    expect(updatedState.profile).toStrictEqual(data);
  });

  it('should onSetId', () => {
    const action = onSetId({ id: 1 });

    const updatedState = registrationProfileSlice.reducer(initialState, action);
    expect(updatedState.id).toStrictEqual(1);
  });
});
