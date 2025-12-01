import { MOCK_REGISTRATION_SQUAD } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import { getSquad, getId } from '../registrationSquadSelectors';

const MOCK_STATE = {
  'LeagueOperations.registration.slice.squad': {
    squad: MOCK_REGISTRATION_SQUAD,
    id: MOCK_REGISTRATION_SQUAD.id,
  },
};

describe('[registrationSquadSelectors] - selectors', () => {
  it('getSquad()', () => {
    expect(getSquad(MOCK_STATE)).toStrictEqual(MOCK_REGISTRATION_SQUAD);
  });
  it('getId()', () => {
    expect(getId(MOCK_STATE)).toStrictEqual(MOCK_REGISTRATION_SQUAD.id);
  });
});
