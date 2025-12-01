import {
  isEmailValid,
  isPhoneNumberValid,
  isDOBInvalid,
  isEmailInvalidOnSaveOrSubmit,
  isPhoneNumberInvalidOnSaveOrSubmit,
} from '../index';

describe('validationUtils', () => {
  it('isEmailValid', () => {
    let emailValid = isEmailValid('test');
    expect(emailValid).toEqual(false);

    emailValid = isEmailValid('test@email.com');
    expect(emailValid).toEqual(true);
  });

  it('isPhoneNumberValid allows multiple phone number formats', () => {
    let phoneNumber = isPhoneNumberValid('1234');
    expect(phoneNumber).toEqual(false);

    phoneNumber = isPhoneNumberValid('7032223333');
    expect(phoneNumber).toEqual(true);

    phoneNumber = isPhoneNumberValid('+17032223333');
    expect(phoneNumber).toEqual(true);

    phoneNumber = isPhoneNumberValid('1.800.555.1234');
    expect(phoneNumber).toEqual(true);

    phoneNumber = isPhoneNumberValid('+86 800-555-1234');
    expect(phoneNumber).toEqual(true);
  });

  it('isDOBInvalid checks if dob matches dobConfirmation is valid', () => {
    let dob = '10/05/2000';
    let dobConfirmation = '10/05/2000';

    let dobValid = isDOBInvalid(dob, dobConfirmation);
    expect(dobValid).toEqual(false);

    dob = '10/06/2000';
    dobConfirmation = '10/05/2000';

    dobValid = isDOBInvalid(dob, dobConfirmation);
    expect(dobValid).toEqual(true);
  });

  it('isEmailInvalidOnSaveOrSubmit', () => {
    let email = 'testEmail';

    let emailInvalid = isEmailInvalidOnSaveOrSubmit(email);
    expect(emailInvalid).toEqual(true);

    email = 'testEmail@test.com';

    emailInvalid = isEmailInvalidOnSaveOrSubmit(email);
    expect(emailInvalid).toEqual(false);
  });

  it('isPhoneNumberInvalidOnSaveOrSubmit', () => {
    let phoneNumber = '123';

    let phoneNumberInvalid = isPhoneNumberInvalidOnSaveOrSubmit(phoneNumber);
    expect(phoneNumberInvalid).toEqual(true);

    phoneNumber = '703-122-2999';

    phoneNumberInvalid = isPhoneNumberInvalidOnSaveOrSubmit(phoneNumber);
    expect(phoneNumberInvalid).toEqual(false);
  });
});
