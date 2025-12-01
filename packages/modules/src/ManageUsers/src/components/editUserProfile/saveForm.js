// @flow
import $ from 'jquery';
import type {
  FormFieldsErrors,
  FormFieldsValid,
  FormFieldsValues,
} from './index';

const createServerData = (values) => {
  return JSON.stringify({
    user: {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      locale: values.locale,
      existing_password: values.currentPassword,
      password: values.newPassword,
      password_confirmation: values.newPasswordConfirmation,
    },
  });
};

const serverErrorsToValid = (serverErrors): FormFieldsValid => {
  return {
    firstname: serverErrors.firstname == null || serverErrors.firstname === [],
    lastname: serverErrors.lastname == null || serverErrors.lastname === [],
    email: serverErrors.email == null || serverErrors.email === [],
    locale: serverErrors.locale == null || serverErrors.locale === [],
    currentPassword:
      serverErrors.existing_password == null ||
      serverErrors.existing_password === [],
    newPassword: serverErrors.password == null || serverErrors.password === [],
    newPasswordConfirmation:
      serverErrors.password_confirmation == null ||
      serverErrors.password_confirmation === [],
  };
};

const messageToValidation = (message) => {
  return {
    isValid: false,
    message,
  };
};

const serverErrorsToErrors = (serverErrors): FormFieldsErrors => {
  return {
    firstname: (serverErrors.firstname || []).map(messageToValidation),
    lastname: (serverErrors.lastname || []).map(messageToValidation),
    email: (serverErrors.email || []).map(messageToValidation),
    locale: (serverErrors.locale || []).map(messageToValidation),
    currentPassword: (serverErrors.existing_password || []).map(
      messageToValidation
    ),
    newPassword: (serverErrors.password || []).map(messageToValidation),
    newPasswordConfirmation: (serverErrors.password_confirmation || []).map(
      messageToValidation
    ),
  };
};

const saveForm = (
  values: FormFieldsValues,
  setValid: Function,
  setErrors: Function,
  saveUserFormStarted: Function,
  saveUserFormSuccessful: Function,
  saveUserFormFailed: Function
) => {
  if (saveUserFormStarted != null) {
    saveUserFormStarted();
  }
  $.ajax({
    method: 'PATCH',
    url: '/user_profile',
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
    },
    contentType: 'application/json',
    data: createServerData(values),
  })
    .done(({ success, errors: serverErrors }) => {
      if (success === true) {
        if (saveUserFormSuccessful != null) {
          saveUserFormSuccessful();
        }
      } else {
        // call validation failed handler
        if (saveUserFormFailed != null) {
          saveUserFormFailed();
        }
        setValid(serverErrorsToValid(serverErrors));
        setErrors(serverErrorsToErrors(serverErrors));
      }
    })
    .fail(() => {
      // call general fail handler
      if (saveUserFormFailed != null) {
        saveUserFormFailed();
      }
    });
};

export default saveForm;
