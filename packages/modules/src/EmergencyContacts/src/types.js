// @flow
export type EmergencyContactsMode = 'VIEW' | 'EDIT';

export type AppStatusState = {
  status: ?string,
  message: ?string,
};

export type InternationalPhoneNumber = {
  country: string,
  number: string,
};

export type EmergencyContactState = {
  id?: number,
  firstname?: string,
  lastname?: string,
  email?: string,
  phone_numbers?: Array<InternationalPhoneNumber>,
  contact_relation?: string,
  address_1?: string,
  address_2?: string,
  address_3?: string,
  city?: string,
  state_county?: string,
  zip_postal_code?: string,
  country?: string,
};

export type EmergencyContactsState = {
  emergencyContacts: Array<EmergencyContactState>,
  mode: EmergencyContactsMode,
  contactIdEditing: ?number,
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type loadingEmergencyContacts = {
  type: 'LOADING_EMERGENCY_CONTACTS',
};

type savingEmergencyContact = {
  type: 'SAVING_EMERGENCY_CONTACT',
};

type deletingEmergencyContact = {
  type: 'DELETING_EMERGENCY_CONTACT',
};

export type EditEmergencyContactPayload = {
  id: ?number,
};

export type SetEmergencyContactsPayload = {
  contacts: Array<EmergencyContactState>,
};

export type Action =
  | hideAppStatus
  | savingEmergencyContact
  | deletingEmergencyContact
  | loadingEmergencyContacts;
