// @flow
import { isEqual } from 'lodash';

export const preventPrecedingSpaces = (event: Object) => {
  if (event.keyCode === 32 && event.target.value === '') event.preventDefault();
};

export const isEmailValid = (email: ?string) => {
  if (!email) return false;
  if (
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  ) {
    return true;
  }
  return false;
};

export const isPhoneNumberValid = (phone: ?string) => {
  if (!phone) return false;
  const regex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
  if (phone.match(regex)) {
    return true;
  }
  return false;
};

export const isDOBInvalid = (dob: string, dobConfirmation: string) =>
  dobConfirmation && !isEqual(dob, dobConfirmation);

export const isEmailInvalidOnSaveOrSubmit = (email: string) =>
  !!email && !isEmailValid(email);

export const isPhoneNumberInvalidOnSaveOrSubmit = (phoneNumber: ?string) =>
  !!phoneNumber && !isPhoneNumberValid(phoneNumber);
