// @flow
import { searchContactsApi } from './rtk/searchContactsApi';
import { getContactRolesApi } from './rtk/getContactRolesApi';
import contactsSlice from './slices/contactsSlice';

export default {
  searchContactsApi: searchContactsApi.reducer,
  contactsApi: getContactRolesApi.reducer,
  contactsSlice: contactsSlice.reducer,
};
