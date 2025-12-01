import { REDUCER_KEY as movementProfileState } from '../../slices/movementProfileSlice';

import { getId, getProfile } from '../movementProfileSelectors';

const MOCK_STATE = {
  [movementProfileState]: {
    id: 1,
  },
};

describe('[movementProfileSelectors] - selectors', () => {
  test('getProfile()', () => {
    expect(getProfile(MOCK_STATE)).toBe(
      MOCK_STATE[movementProfileState].profile
    );
  });
  test('getId()', () => {
    expect(getId(MOCK_STATE)).toBe(MOCK_STATE[movementProfileState].id);
  });
});
