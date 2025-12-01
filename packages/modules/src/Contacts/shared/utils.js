/* eslint-disable no-param-reassign */
// @flow
import type { Translation } from '@kitman/common/src/types/i18n';
import parsePhoneNumber from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';
import type { SearchResponse } from '@kitman/services/src/services/contacts/searchContacts';
import { isEmailInvalidOnSaveOrSubmit } from '@kitman/modules/src/Officials/shared/utils';
import structuredClone from 'core-js/stable/structured-clone';
import type {
  Contact,
  CreateContactFormErrors,
  TextEnum,
  ContactWithId,
  ReviewContactFormErrors,
  Review,
} from './types';
import { contactStatuses } from './constants';

export const getTranslations = (t: Translation): TextEnum => ({
  error: {
    name: t('Add a contact name'),
    organisation: t('Select an organisation'),
    gameContactRoles: t('Select at least one role'),
    phone: t('Enter a valid phone number'),
    email: t('Enter a valid email address'),
    mailingList: t('Select at least one mailing list'),
    formSubmitted: t('Something went wrong while saving your contact.'),
    status: t('Select a status'),
    statusDescription: t('Please add a note'),
    emailAlreadyTaken: t('Email is already linked to another contact'),
  },
  contactCreated: t('Contact created.'),
  contactUpdated: t('Contact updated.'),
});

export const getCreateContactFormErrors = ({
  contact,
  textEnum,
  countryCode,
  isLeague,
}: {
  contact: Contact,
  countryCode: CountryCode,
  textEnum: TextEnum,
  isLeague: boolean,
}): CreateContactFormErrors => {
  const nextErrors: CreateContactFormErrors = {};

  if (!contact.name.trim()) {
    nextErrors.name = textEnum.error.name;
  }
  if (isLeague && !contact.organisation) {
    nextErrors.organisation = textEnum.error.organisation;
  }
  if (!contact.gameContactRoles.length) {
    nextErrors.gameContactRoles = textEnum.error.gameContactRoles;
  }
  if (
    !contact.phone ||
    (contact.phone && !parsePhoneNumber(contact.phone, countryCode)?.isValid())
  ) {
    nextErrors.phone = textEnum.error.phone;
  }
  if (
    !contact.email ||
    (contact.email && isEmailInvalidOnSaveOrSubmit(contact.email))
  ) {
    nextErrors.email = textEnum.error.email;
  }
  if (!contact.dmn && !contact.dmr) {
    nextErrors.mailingList = textEnum.error.mailingList;
  }

  return nextErrors;
};

export const getStatusEnumLike = (t: Translation) => ({
  Approved: t(contactStatuses.Approved),
  Pending: t(contactStatuses.Pending),
  Rejected: t(contactStatuses.Rejected),
});

export const getStatusOptionsEnumLike = (t: Translation) => [
  {
    label: t('Approved'),
    value: contactStatuses.Approved,
  },
  {
    label: t('Pending'),
    value: contactStatuses.Pending,
  },
  {
    label: t('Rejected'),
    value: contactStatuses.Rejected,
  },
];

export const transformGameContactsData = (
  data: SearchResponse = {}
): {
  nextId: ?number,
  gameContacts: Array<ContactWithId>,
} => {
  return {
    nextId: data.next_id,
    gameContacts: data.game_contacts
      ? data.game_contacts.map((item) => ({
          id: item.id,
          name: item.name,
          organisation: item.organisation,
          gameContactRoles: item.game_contact_roles,
          phone: item.phone_number,
          email: item.email,
          dmn: item.dmn,
          dmr: item.dmr,
          status: item.status,
          statusDescription: item.status_description,
          tvChannelId: item.tv_channel_id ?? null,
          title: item.title,
        }))
      : [],
  };
};

export const getReviewContactFormErrors = (
  textEnum: TextEnum,
  review: Review
): ReviewContactFormErrors => {
  const nextErrors: ReviewContactFormErrors = {};

  if (!review.status || review.status === contactStatuses.Pending) {
    nextErrors.status = textEnum.error.status;
  }

  if (review.status === contactStatuses.Approved) {
    return nextErrors;
  }

  if (!review.statusDescription?.trim()) {
    nextErrors.statusDescription = textEnum.error.statusDescription;
  }

  return nextErrors;
};

export const mergeContacts = (currentCache: any, newItems: any, meta: any) => {
  // Override the current cache - this is a new request
  if (meta.arg.nextId == null) {
    currentCache.game_contacts = newItems.game_contacts;
  }
  // Keep cache - next id has a value, meaning this was a call to fetch on infinite scroll
  else {
    const currentContacts = structuredClone(currentCache.game_contacts);

    newItems.game_contacts.forEach((newContact) => {
      const existingContactIndex = currentContacts.findIndex(
        (existingContact) => newContact.id === existingContact.id
      );
      if (existingContactIndex === -1) {
        currentContacts.push(newContact);
      } else {
        currentContacts[existingContactIndex] = newContact;
      }
    });
    currentCache.game_contacts = currentContacts;
  }
  currentCache.next_id = newItems.next_id;
};
