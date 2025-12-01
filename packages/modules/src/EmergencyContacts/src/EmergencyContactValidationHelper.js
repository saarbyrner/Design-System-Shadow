// @flow
import i18n from '@kitman/common/src/utils/i18n';
import _isEqual from 'lodash/isEqual';
import type { Validation } from '@kitman/common/src/types';
import type { EmergencyContactState } from './types';
import type { EmergencyContactValidity } from './components/EmergencyContact';

const emailRegexW3C = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9]){1}(?:\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
);

const fieldsAreEqual = (keyA: ?(string | number), keyB: ?(string | number)) => {
  if (keyA === keyB) {
    return true;
  }
  if ((keyA === '' && !keyB) || (!keyA && keyB === '')) {
    return true;
  }
  return false;
};

export const contactsAreEqual = (
  a: EmergencyContactState,
  b: EmergencyContactState
): boolean => {
  if (_isEqual(a, b)) {
    return true;
  }

  if (
    !fieldsAreEqual(a.id, b.id) ||
    !fieldsAreEqual(a.firstname, b.firstname) ||
    !fieldsAreEqual(a.lastname, b.lastname) ||
    !fieldsAreEqual(a.email, b.email) ||
    !fieldsAreEqual(a.contact_relation, b.contact_relation)
  ) {
    return false;
  }

  if (_isEqual(a.phone_numbers, b.phone_numbers)) {
    return true;
  }

  if (a.phone_numbers) {
    return !a.phone_numbers.some((phoneA, i) => {
      const phoneB = b.phone_numbers ? b.phone_numbers[i] : undefined;
      return (
        !fieldsAreEqual(phoneA.number, phoneB?.number) ||
        !fieldsAreEqual(phoneA.country, phoneB?.country)
      );
    });
  }

  return false;
};

export const convertServerErrorsToValidation = (
  errors: Array<string>
): EmergencyContactValidity => {
  const invalidGeneral = {
    isValid: false,
    message: i18n.t('Invalid value'),
  };

  const invalidEmail = {
    isValid: false,
    message: i18n.t('Invalid email entered'),
  };

  const invalidPhoneNumber = {
    isValid: false,
    message: i18n.t('Invalid phone number'),
  };

  const invalidCountryCode = {
    isValid: false,
    message: i18n.t('Select country code'),
  };

  const invalidRelation = {
    isValid: false,
    message: i18n.t('Invalid relation chosen'),
  };

  const result = errors.reduce(
    (acc, nextError) => {
      if (nextError.includes('firstname')) {
        acc.firstname.push(invalidGeneral);
      } else if (nextError.includes('lastname')) {
        acc.lastname.push(invalidGeneral);
      } else if (nextError.includes('email')) {
        acc.email.push(invalidEmail);
      } else if (
        nextError.includes('phone_numbers[0].phone_number') ||
        nextError.includes(' phone_number ') // Fall back to flagging the first phone number if there is a problem
      ) {
        while (acc.phone_numbers.length < 1) {
          acc.phone_numbers.push({ country: [], number: [] });
        }
        acc.phone_numbers[0].number.push(invalidPhoneNumber);
      } else if (nextError.includes('phone_numbers[1].phone_number')) {
        while (acc.phone_numbers.length < 2) {
          acc.phone_numbers.push({ country: [], number: [] });
        }
        acc.phone_numbers[1].number.push(invalidPhoneNumber);
      } else if (nextError.includes('phone_numbers[0].phone_country')) {
        while (acc.phone_numbers.length < 1) {
          acc.phone_numbers.push({ country: [], number: [] });
        }
        acc.phone_numbers[0].number.push(invalidCountryCode);
      } else if (nextError.includes('phone_numbers[1].phone_country')) {
        while (acc.phone_numbers.length < 2) {
          acc.phone_numbers.push({ country: [], number: [] });
        }
        acc.phone_numbers[1].number.push(invalidCountryCode);
      } else if (nextError.includes('contact_relation')) {
        acc.contact_relation.push(invalidRelation);
      }
      return acc;
    },
    {
      firstname: [],
      lastname: [],
      email: [],
      phone_numbers: [],
      contact_relation: [],
      address_1: [],
      address_2: [],
      address_3: [],
      city: [],
      state_county: [],
      zip_postal_code: [],
      country: [],
    }
  );

  return result;
};

export const validateEmergencyContactField = (
  field: string,
  value: ?string,
  allowEmpty?: boolean
): Array<Validation> => {
  const invalidEmail = {
    isValid: false,
    message: i18n.t('Invalid email entered'),
  };

  const invalidPhoneNumber = {
    isValid: false,
    message: i18n.t('Invalid phone number'),
  };

  const invalidCountryCode = {
    isValid: false,
    message: i18n.t('Select country code'),
  };

  switch (field) {
    case 'firstname':
    case 'lastname': {
      const nameValidation = [];
      if (!value || !value.trim()) {
        nameValidation.push({
          isValid: false,
          message: i18n.t('This field is required'),
        });
      }
      return nameValidation;
    }
    case 'email': {
      const emailValidation = [];
      if (value && !emailRegexW3C.test(value)) {
        emailValidation.push(invalidEmail);
      }
      return emailValidation;
    }
    case 'phone_number': {
      const phoneNumberValidation = [];
      if ((!value && !allowEmpty) || (value && value.length < 3)) {
        phoneNumberValidation.push(invalidPhoneNumber);
      }
      return phoneNumberValidation;
    }
    case 'phone_country': {
      const phoneCountryValidation = [];
      if (!value && !allowEmpty) {
        phoneCountryValidation.push(invalidCountryCode);
      }
      return phoneCountryValidation;
    }

    default:
      return [];
  }
};

export const validateEmergencyContact = (
  contact: EmergencyContactState
): EmergencyContactValidity => {
  const result: EmergencyContactValidity = {
    firstname: validateEmergencyContactField('firstname', contact.firstname),
    lastname: validateEmergencyContactField('lastname', contact.lastname),
    email: validateEmergencyContactField('email', contact.email),
    phone_numbers: contact.phone_numbers
      ? contact.phone_numbers.map((phone, index) => {
          return {
            country: validateEmergencyContactField(
              'phone_country',
              phone.country,
              index > 0
            ),
            number: validateEmergencyContactField(
              'phone_number',
              phone.number,
              index > 0
            ),
          };
        })
      : [],
    contact_relation: validateEmergencyContactField(
      'contact_relation',
      contact.contact_relation
    ),
    address_1: [],
    address_2: [],
    address_3: [],
    city: [],
    state_county: [],
    zip_postal_code: [],
    country: [],
  };

  return result;
};

export const isContactValid = (validation: EmergencyContactValidity) => {
  const invalid =
    validation.firstname.length > 0 ||
    validation.lastname.length > 0 ||
    validation.email.length > 0 ||
    validation.contact_relation.length > 0 ||
    validation.contact_relation.length > 0;

  if (invalid) {
    return false;
  }

  return !Object.values(validation.phone_numbers).some(
    (phone) =>
      // $FlowFixMe country and number will be present and be arrays
      phone.country.length > 0 || phone.number.length > 0
  );
};
