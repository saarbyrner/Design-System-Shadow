import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
  hideAppStatus,
  loadingEmergencyContacts,
  savingEmergencyContact,
  deletingEmergencyContact,
} from '../actions';

describe('Emergency Contacts Actions', () => {
  it('has the correct action HIDE_APP_STATUS', () => {
    const expectedAction = {
      type: 'HIDE_APP_STATUS',
    };

    expect(hideAppStatus()).to.deep.equal(expectedAction);
  });

  it('has the correct action LOADING_EMERGENCY_CONTACTS', () => {
    const expectedAction = {
      type: 'LOADING_EMERGENCY_CONTACTS',
    };

    expect(loadingEmergencyContacts()).to.deep.equal(expectedAction);
  });

  it('has the correct action SAVING_EMERGENCY_CONTACT', () => {
    const expectedAction = {
      type: 'SAVING_EMERGENCY_CONTACT',
    };

    expect(savingEmergencyContact()).to.deep.equal(expectedAction);
  });
  it('has the correct action DELETING_EMERGENCY_CONTACT', () => {
    const expectedAction = {
      type: 'DELETING_EMERGENCY_CONTACT',
    };

    expect(deletingEmergencyContact()).to.deep.equal(expectedAction);
  });
});
