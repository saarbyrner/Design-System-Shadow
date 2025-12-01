import { expect } from 'chai';
import athleteSettingsReducer from '../redux/reducers/appStatus';

describe('Emergency Contacts App Status reducer', () => {
  const initialState = {
    status: 'loading',
    message: 'test',
  };

  it('returns correct state on HIDE_APP_STATUS', () => {
    const expectedState = { status: null, message: null };
    const action = {
      type: 'HIDE_APP_STATUS',
    };

    const nextState = athleteSettingsReducer(initialState, action);
    expect(nextState).to.deep.equal(expectedState);
  });

  it('returns correct state on LOADING_EMERGENCY_CONTACTS', () => {
    const expectedState = { status: 'loading', message: 'Loading' };
    const action = {
      type: 'LOADING_EMERGENCY_CONTACTS',
    };

    const nextState = athleteSettingsReducer(initialState, action);
    expect(nextState).to.deep.equal(expectedState);
  });

  it('returns correct state on SAVING_EMERGENCY_CONTACT', () => {
    const expectedState = {
      status: 'loading',
      message: 'Saving contact',
    };
    const action = {
      type: 'SAVING_EMERGENCY_CONTACT',
    };

    const nextState = athleteSettingsReducer(initialState, action);
    expect(nextState).to.deep.equal(expectedState);
  });

  it('returns correct state on DELETING_EMERGENCY_CONTACT', () => {
    const expectedState = {
      status: 'loading',
      message: 'Deleting contact',
    };
    const action = {
      type: 'DELETING_EMERGENCY_CONTACT',
    };

    const nextState = athleteSettingsReducer(initialState, action);
    expect(nextState).to.deep.equal(expectedState);
  });
});
