// @flow
import type { SearchPayload } from '@kitman/services/src/services/contacts/searchContacts';
import type {
  Contact,
  CreateContactFormErrors,
  ReviewContactFormErrors,
  Review,
} from './types';

export const mailingList = {
  Dmn: 'dmn',
  Dmr: 'dmr',
};

export const contactStatuses = {
  Approved: 'approved',
  Pending: 'pending',
  Rejected: 'rejected',
};

export const defaultFilters: SearchPayload = {
  search: '',
  gameContactRoleIds: [],
  tvChannelIds: [],
  organisationIds: [],
  statuses: [],
  dmn: null,
  dmr: null,
  nextId: null,
};

export const defaultContact: Contact = {
  name: '',
  organisation: null,
  gameContactRoles: [],
  phone: '',
  email: '',
  dmn: false,
  dmr: false,
  status: '',
  statusDescription: '',
  tvChannelId: null,
};

export const defaultErrors: CreateContactFormErrors = {
  name: '',
  organisation: '',
  gameContactRoles: '',
  phone: '',
  email: '',
  mailingList: '',
};

export const defaultReview: Review = {
  name: '',
  status: '',
  statusDescription: '',
};

export const defaultReviewErrors: ReviewContactFormErrors = {
  status: '',
  statusDescription: '',
};

export const mailingListOptions = [
  {
    label: 'DMN',
    value: mailingList.Dmn,
  },
  {
    label: 'DMR',
    value: mailingList.Dmr,
  },
];
