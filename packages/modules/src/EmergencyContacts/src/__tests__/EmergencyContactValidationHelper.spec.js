import { describe, it } from 'mocha';
import { expect } from 'chai';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import {
  isContactValid,
  convertServerErrorsToValidation,
  contactsAreEqual,
  validateEmergencyContactField,
} from '../EmergencyContactValidationHelper';

describe('EmergencyContactValidationHelper', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  const i18nT = i18nextTranslateStub();

  it('returns a boolean to check contact validity', () => {
    const validContact = {
      firstname: [],
      lastname: [],
      email: [],
      phone_numbers: [],
      contact_relation: [],
    };

    expect(isContactValid(validContact)).to.equal(true);

    const inValidContact = {
      firstname: [
        {
          isValid: false,
          message: 'Invalid value',
        },
      ],
      lastname: [],
      email: [],
      phone_numbers: [],
      contact_relation: [],
    };

    expect(isContactValid(inValidContact)).to.equal(false);
  });

  it('converts server errors to validation errors', () => {
    const errors = [
      'firstname has an error',
      'so does phone_numbers[0].phone_number',
    ];
    const validation = {
      firstname: [
        {
          isValid: false,
          message: i18nT('Invalid value'),
        },
      ],
      lastname: [],
      email: [],
      phone_numbers: [
        {
          country: [],
          number: [
            {
              isValid: false,
              message: i18nT('Invalid phone number'),
            },
          ],
        },
      ],
      contact_relation: [],
      address_1: [],
      address_2: [],
      address_3: [],
      city: [],
      state_county: [],
      zip_postal_code: [],
      country: [],
    };
    expect(convertServerErrorsToValidation(errors)).to.deep.equal(validation);
  });

  it('can distinguish if contacts are equal', () => {
    const a = {
      id: 1,
      firstname: 'test1',
      lastname: 'test2',
      email: 'test3@test.com',
      phone_numbers: [{ country: 'IE', number: '1234' }],
    };

    const b = {
      id: 1,
      firstname: 'test1',
      lastname: 'test2',
      email: 'test3@test.com',
      phone_numbers: [{ country: 'IE', number: '1234' }],
    };
    expect(contactsAreEqual(a, b)).to.equal(true);

    const c = {
      id: 1,
      firstname: 'changed',
      lastname: 'test2',
      email: 'test3@test.com',
      phone_numbers: [{ country: 'IE', number: '1234' }],
    };
    expect(contactsAreEqual(a, c)).to.equal(false);

    const d = {
      id: 1,
      firstname: '',
      lastname: 'test2',
      email: 'test3@test.com',
      phone_numbers: [{ country: 'IE', number: '1234' }],
    };

    const e = {
      id: 1,
      lastname: 'test2',
      email: 'test3@test.com',
      phone_numbers: [{ country: 'IE', number: '1234' }],
    };
    expect(contactsAreEqual(d, e)).to.equal(true);

    const f = {
      id: 1,
      firstname: 'test1',
      lastname: 'test2',
      email: 'test3@test.com',
      phone_numbers: [{ country: 'IE', number: '1234' }],
    };

    const g = {
      id: 1,
      firstname: 'test1',
      lastname: 'test2',
      email: 'test3@test.com',
      phone_numbers: [{ country: 'DE', number: '1234' }],
    };
    expect(contactsAreEqual(f, g)).to.equal(false);

    const h = {
      id: 1,
      firstname: 'test1',
      lastname: 'test2',
      email: 'test3@test.com',
      phone_numbers: [{ country: 'IE', number: '1234' }],
    };

    const i = {
      id: 1,
      firstname: 'test1',
      lastname: 'test2',
      email: 'test3@test.com',
      phone_numbers: [{ country: 'IE', number: '12345' }],
    };
    expect(contactsAreEqual(h, i)).to.equal(false);
  });

  it('shows correct validation error when Firstname is blank', () => {
    const result = validateEmergencyContactField('firstname', '');
    expect(result).to.deep.equal([
      {
        isValid: false,
        message: i18nT('This field is required'),
      },
    ]);
  });

  it('shows correct validation error when Lastname is blank', () => {
    const result = validateEmergencyContactField('lastname', '');
    expect(result).to.deep.equal([
      {
        isValid: false,
        message: i18nT('This field is required'),
      },
    ]);
  });

  it('shows correct validation error when Email is invalid', () => {
    let result = validateEmergencyContactField('email', 'test');
    expect(result).to.deep.equal([
      {
        isValid: false,
        message: i18nT('Invalid email entered'),
      },
    ]);

    result = validateEmergencyContactField('email', 'test@test');
    expect(result).to.deep.equal([
      {
        isValid: false,
        message: i18nT('Invalid email entered'),
      },
    ]);

    result = validateEmergencyContactField('email', 'test@test.');
    expect(result).to.deep.equal([
      {
        isValid: false,
        message: i18nT('Invalid email entered'),
      },
    ]);
  });

  it('shows no validation error when Email is valid', () => {
    let result = validateEmergencyContactField('email', 'test@test.com');
    expect(result).to.deep.equal([]);

    result = validateEmergencyContactField('email', 'test@test.co.uk');
    expect(result).to.deep.equal([]);
  });

  it('shows correct validation error when phone_number is too short', () => {
    const result = validateEmergencyContactField('phone_number', '12');
    expect(result).to.deep.equal([
      {
        isValid: false,
        message: i18nT('Invalid phone number'),
      },
    ]);
  });

  it('shows correct validation error when non optional phone_country is left blank', () => {
    const result = validateEmergencyContactField('phone_country', '');
    expect(result).to.deep.equal([
      {
        isValid: false,
        message: i18nT('Select country code'),
      },
    ]);
  });

  it('shows no validation error when optional phone_country is left blank', () => {
    const result = validateEmergencyContactField('phone_country', '', true);
    expect(result).to.deep.equal([]);
  });

  it('shows no validation error when optional phone_number is left blank', () => {
    const result = validateEmergencyContactField('phone_number', '', true);
    expect(result).to.deep.equal([]);
  });
});
