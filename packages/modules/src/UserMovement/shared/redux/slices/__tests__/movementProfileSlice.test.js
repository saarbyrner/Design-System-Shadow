import movementProfileSlice, {
  onReset,
  onSetProfile,
  onSetId,
} from '../movementProfileSlice';

import { data } from '../../services/mocks/data/mock_search_athletes';

const initialState = {
  id: null,
  profile: null,
};

describe('[movementProfileSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(movementProfileSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset', () => {
    const action = onReset();
    const updatedState = movementProfileSlice.reducer(initialState, action);
    expect(updatedState).toEqual(initialState);
  });

  it('should onSetProfile', () => {
    const action = onSetProfile({ profile: data[0] });

    const updatedState = movementProfileSlice.reducer(initialState, action);
    expect(updatedState.profile).toStrictEqual(data[0]);
  });

  it('should onSetId', () => {
    const action = onSetId({ id: 1 });

    const updatedState = movementProfileSlice.reducer(initialState, action);
    expect(updatedState.id).toStrictEqual(1);
  });
});
