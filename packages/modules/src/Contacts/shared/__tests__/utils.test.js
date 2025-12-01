import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { contactStatuses } from '@kitman/modules/src/Contacts/shared/constants';
import {
  getCreateContactFormErrors,
  getTranslations,
  getStatusOptionsEnumLike,
  transformGameContactsData,
  getReviewContactFormErrors,
  mergeContacts,
} from '../utils';

describe('utils', () => {
  const t = i18nextTranslateStub();
  const textEnum = getTranslations(t);

  describe('getTranslations', () => {
    it('returns the right enum text', () => {
      expect(textEnum).toEqual({
        error: {
          name: 'Add a contact name',
          organisation: 'Select an organisation',
          gameContactRoles: 'Select at least one role',
          phone: 'Enter a valid phone number',
          email: 'Enter a valid email address',
          mailingList: 'Select at least one mailing list',
          formSubmitted: 'Something went wrong while saving your contact.',
          status: 'Select a status',
          statusDescription: 'Please add a note',
          emailAlreadyTaken: 'Email is already linked to another contact',
        },
        contactCreated: 'Contact created.',
        contactUpdated: 'Contact updated.',
      });
    });
  });

  describe('getCreateContactFormErrors', () => {
    const countryCode = 'US';

    it('handles form errors', () => {
      const contact = {
        name: '',
        organisation: '',
        gameContactRoles: [],
        phone: 'invalid-phone',
        email: 'invalid-email',
        dmn: false,
        dmr: false,
      };

      expect(
        getCreateContactFormErrors({
          contact,
          textEnum,
          countryCode,
          isLeague: true,
        })
      ).toEqual({
        name: textEnum.error.name,
        organisation: textEnum.error.organisation,
        gameContactRoles: textEnum.error.gameContactRoles,
        phone: textEnum.error.phone,
        email: textEnum.error.email,
        mailingList: textEnum.error.mailingList,
      });

      expect(
        getCreateContactFormErrors({
          contact,
          textEnum,
          countryCode,
          isLeague: false,
        })
      ).toEqual({
        name: textEnum.error.name,
        gameContactRoles: textEnum.error.gameContactRoles,
        phone: textEnum.error.phone,
        email: textEnum.error.email,
        mailingList: textEnum.error.mailingList,
      });
    });

    it('returns an error when name is empty', () => {
      const contact = { name: '', gameContactRoles: [], mailingList: [] };
      const errors = getCreateContactFormErrors({
        contact,
        textEnum,
        countryCode,
      });
      expect(errors).toHaveProperty('name', textEnum.error.name);
    });

    it('returns an error when organisation is empty', () => {
      const contact = {
        name: '',
        gameContactRoles: [],
        organisation: '',
        dmn: false,
        dmr: false,
      };
      const errors = getCreateContactFormErrors({
        contact,
        textEnum,
        countryCode,
        isLeague: true,
      });
      expect(errors).toHaveProperty(
        'organisation',
        textEnum.error.organisation
      );
    });

    it('returns an error when gameContactRoles is empty', () => {
      const contact = { name: '', gameContactRoles: [], mailingList: [] };
      const errors = getCreateContactFormErrors({
        contact,
        textEnum,
        countryCode,
      });
      expect(errors).toHaveProperty(
        'gameContactRoles',
        textEnum.error.gameContactRoles
      );
    });

    it('returns an error when the phone number is invalid', () => {
      const contact = {
        name: '',
        gameContactRoles: [],
        phone: '1234567890',
        dmn: false,
        dmr: false,
      };
      expect(
        getCreateContactFormErrors({
          contact,
          textEnum,
          countryCode,
        })
      ).toHaveProperty('phone', textEnum.error.phone);
      expect(
        getCreateContactFormErrors({
          contact: {
            ...contact,
            phone: '',
          },
          textEnum,
          countryCode,
        })
      ).toHaveProperty('phone', textEnum.error.phone);
    });

    it('returns an error when the email is invalid', () => {
      const contact = {
        name: '',
        gameContactRoles: [],
        email: 'invalid-email',
        dmn: false,
        dmr: false,
      };
      expect(
        getCreateContactFormErrors({
          contact,
          textEnum,
          countryCode,
        })
      ).toHaveProperty('email', textEnum.error.email);

      expect(
        getCreateContactFormErrors({
          contact: {
            ...contact,
            email: '',
          },
          textEnum,
          countryCode,
        })
      ).toHaveProperty('email', textEnum.error.email);
    });

    it('returns an error when no mailing list is selected', () => {
      const contact = {
        name: '',
        gameContactRoles: [],
        dmn: false,
        dmr: false,
      };
      const errors = getCreateContactFormErrors({
        contact,
        textEnum,
        countryCode,
      });
      expect(errors).toHaveProperty('mailingList', textEnum.error.mailingList);
    });
  });

  describe('getStatusOptionsEnumLike', () => {
    it('returns the right options', () => {
      const statusEnumLike = getStatusOptionsEnumLike(t);
      expect(statusEnumLike).toEqual([
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Rejected',
          value: 'rejected',
        },
      ]);
    });
  });

  describe('transformGameContactsData', () => {
    it('should transform game contacts data correctly', () => {
      const input = {
        game_contacts: [
          {
            id: 1,
            name: 'John Doe',
            organisation: {
              id: 1,
              name: 'org',
              logo_full_path: 'logo_full_path',
            },
            game_contact_roles: [
              { id: 1, name: 'role 1' },
              { id: 2, name: 'role 2' },
            ],
            phone_number: '12334566',
            email: 'john.doe@test.com',
            dmn: true,
            dmr: false,
            status: 'active',
            status_description: 'description',
            tv_channel_id: 1,
            title: 'sports analyst',
          },
        ],
        next_id: 2,
      };

      const output = {
        nextId: 2,
        gameContacts: [
          {
            id: 1,
            name: 'John Doe',
            organisation: {
              id: 1,
              name: 'org',
              logo_full_path: 'logo_full_path',
            },
            gameContactRoles: [
              { id: 1, name: 'role 1' },
              { id: 2, name: 'role 2' },
            ],
            phone: '12334566',
            email: 'john.doe@test.com',
            dmn: true,
            dmr: false,
            status: 'active',
            statusDescription: 'description',
            tvChannelId: 1,
            title: 'sports analyst',
          },
        ],
      };

      const result = transformGameContactsData(input);
      expect(result).toEqual(output);
    });

    it('handles empty game contacts array', () => {
      const result1 = transformGameContactsData({
        game_contacts: [],
        next_id: null,
      });
      expect(result1).toEqual({
        nextId: null,
        gameContacts: [],
      });

      const result2 = transformGameContactsData({
        game_contacts: undefined,
        next_id: null,
      });
      expect(result2).toEqual({
        nextId: null,
        gameContacts: [],
      });
    });
  });

  describe('getReviewContactFormErrors', () => {
    it('returns an error when the status is missing', () => {
      const formErrors = getReviewContactFormErrors(textEnum, {
        name: 'Contact name',
        status: '',
      });

      expect(formErrors.status).toEqual(textEnum.error.status);
    });
    it('returns an error when the "statusDescription" is missing with the status "Rejected"', () => {
      expect(
        getReviewContactFormErrors(textEnum, {
          name: 'Contact name',
          status: contactStatuses.Rejected,
          statusDescription: '',
        })
      ).toEqual({ statusDescription: textEnum.error.statusDescription });

      expect(
        getReviewContactFormErrors(textEnum, {
          name: 'Contact name',
          status: contactStatuses.Rejected,
          statusDescription: '',
        })
      ).toEqual({ statusDescription: textEnum.error.statusDescription });
    });
    it('returns no error when the status is "approved" and the "statusDescription" is missing', () => {
      const formErrors = getReviewContactFormErrors(textEnum, {
        name: 'Contact name',
        status: contactStatuses.Approved,
        statusDescription: '',
      });
      expect(formErrors).toEqual({});
    });
  });

  describe('mergeContacts', () => {
    it('replaces the cache when nextId is null', () => {
      const currentCache = {
        game_contacts: [{ id: 1, name: 'Old Contact' }],
        next_id: 2,
      };
      const newItems = {
        game_contacts: [{ id: 2, name: 'New Contact' }],
        next_id: 3,
      };
      const meta = { arg: { nextId: null } };

      mergeContacts(currentCache, newItems, meta);

      expect(currentCache).toEqual({
        game_contacts: [{ id: 2, name: 'New Contact' }],
        next_id: 3,
      });
    });

    it('merges the contacts when nextId is not null', () => {
      const currentCache = {
        game_contacts: [{ id: 1, name: 'Contact 1' }],
        next_id: 2,
      };
      const newItems = {
        game_contacts: [
          { id: 2, name: 'Contact 2' },
          { id: 1, name: 'Updated Contact 1' },
        ],
        next_id: 3,
      };
      const meta = { arg: { nextId: 2 } };

      mergeContacts(currentCache, newItems, meta);

      expect(currentCache).toEqual({
        game_contacts: [
          { id: 1, name: 'Updated Contact 1' },
          { id: 2, name: 'Contact 2' },
        ],
        next_id: 3,
      });
    });

    it('adds new contacts without replacing existing ones when nextId is not null', () => {
      const currentCache = {
        game_contacts: [{ id: 1, name: 'Contact 1' }],
        next_id: 2,
      };
      const newItems = {
        game_contacts: [{ id: 2, name: 'Contact 2' }],
        next_id: 3,
      };
      const meta = { arg: { nextId: 2 } };

      mergeContacts(currentCache, newItems, meta);

      expect(currentCache).toEqual({
        game_contacts: [
          { id: 1, name: 'Contact 1' },
          { id: 2, name: 'Contact 2' },
        ],
        next_id: 3,
      });
    });

    it('handles when there are no new contacts to merge', () => {
      const currentCache = {
        game_contacts: [{ id: 1, name: 'Contact 1' }],
        next_id: 2,
      };
      const newItems = {
        game_contacts: [],
        next_id: 3,
      };
      const meta = { arg: { nextId: 2 } };

      mergeContacts(currentCache, newItems, meta);

      expect(currentCache).toEqual({
        game_contacts: [{ id: 1, name: 'Contact 1' }],
        next_id: 3,
      });
    });
  });
});
