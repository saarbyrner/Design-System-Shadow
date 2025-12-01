import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { getProfile, getId } from '../registrationProfileSelectors';

const MOCK_STATE = {
  'LeagueOperations.registration.slice.profile': {
    profile: MOCK_REGISTRATION_PROFILE,
    id: MOCK_REGISTRATION_PROFILE.id,
  },
};

describe('[registrationProfileSelectors] - selectors', () => {
  test('getProfile()', () => {
    expect(getProfile(MOCK_STATE)).toStrictEqual(MOCK_REGISTRATION_PROFILE);
  });
  test('getId()', () => {
    expect(getId(MOCK_STATE)).toStrictEqual(MOCK_REGISTRATION_PROFILE.id);
  });
});
