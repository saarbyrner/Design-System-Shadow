import { MOCK_REGISTRATION_ORGANISATION } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import registrationOrganisationSlice, {
  onReset,
  onSetOrganisation,
  onSetId,
  initialState,
} from '../registrationOrganisationSlice';

describe('[registrationOrganisationSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(registrationOrganisationSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset', () => {
    const action = onReset();
    const updatedState = registrationOrganisationSlice.reducer(
      initialState,
      action
    );
    expect(updatedState).toEqual(initialState);
  });

  it('should onSetOrganisation', () => {
    const action = onSetOrganisation({
      organisation: MOCK_REGISTRATION_ORGANISATION,
    });

    const updatedState = registrationOrganisationSlice.reducer(
      initialState,
      action
    );
    expect(updatedState.organisation).toStrictEqual(
      MOCK_REGISTRATION_ORGANISATION
    );
  });

  it('should onSetId', () => {
    const action = onSetId({ id: 1 });

    const updatedState = registrationOrganisationSlice.reducer(
      initialState,
      action
    );
    expect(updatedState.id).toStrictEqual(1);
  });
});
