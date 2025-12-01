import { MOCK_REGISTRATION_ORGANISATION } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import { getOrganisation, getId } from '../registrationOrganisationSelectors';

const MOCK_STATE = {
  'LeagueOperations.registration.slice.organisation': {
    organisation: MOCK_REGISTRATION_ORGANISATION,
    id: MOCK_REGISTRATION_ORGANISATION.id,
  },
};

describe('[registrationOrganisationSelectors] - selectors', () => {
  test('getOrganisation()', () => {
    expect(getOrganisation(MOCK_STATE)).toStrictEqual(
      MOCK_REGISTRATION_ORGANISATION
    );
  });
  test('getId()', () => {
    expect(getId(MOCK_STATE)).toStrictEqual(MOCK_REGISTRATION_ORGANISATION.id);
  });
});
