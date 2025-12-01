// @flow
import type { Action } from './types';

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const loadingEmergencyContacts = (): Action => ({
  type: 'LOADING_EMERGENCY_CONTACTS',
});

export const savingEmergencyContact = (): Action => ({
  type: 'SAVING_EMERGENCY_CONTACT',
});

export const deletingEmergencyContact = (): Action => ({
  type: 'DELETING_EMERGENCY_CONTACT',
});
