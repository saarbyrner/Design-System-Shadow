// @flow
import { rest } from 'msw';
import { data as fetchContactsData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchContacts.mock';
import { data as fetchFavoriteContactsData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchFavoriteContacts.mock';
import { data as searchContactListData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchContactList.mock';
import { data as createContactData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/createContact.mock';
import { data as updateContactData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/updateContact.mock';
import { data as updateContactsArchivedData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/updateContactsArchived.mock';
import { endpoint as fetchContactsEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchContacts';
import { endpoint as fetchFavoriteContactsEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchFavoriteContacts';
import { endpoint as searchContactListEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/searchContactList';
import { endpoint as createContactEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/createContact';
import { generateEndpointUrl as updateContactEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateContact';
import { endpoint as updateContactsArchivedEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateContactsArchived';

const handlers = [
  rest.get(fetchContactsEndpoint, (req, res, ctx) =>
    res(ctx.json(fetchContactsData))
  ),
  rest.get(fetchFavoriteContactsEndpoint, (req, res, ctx) =>
    res(ctx.json(fetchFavoriteContactsData))
  ),
  rest.post(searchContactListEndpoint, (req, res, ctx) =>
    res(ctx.json(searchContactListData))
  ),
  rest.post(createContactEndpoint, (req, res, ctx) =>
    res(ctx.json(createContactData))
  ),
  rest.put(updateContactEndpoint(1), (req, res, ctx) =>
    res(ctx.json(updateContactData))
  ),
  rest.patch(updateContactsArchivedEndpoint, (req, res, ctx) =>
    res(ctx.json(updateContactsArchivedData))
  ),
];

export { handlers, fetchContactsData };
