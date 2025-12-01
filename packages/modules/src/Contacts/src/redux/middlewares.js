// @flow
import { searchContactsApi } from './rtk/searchContactsApi';
import { getContactRolesApi } from './rtk/getContactRolesApi';

export default [searchContactsApi.middleware, getContactRolesApi.middleware];
