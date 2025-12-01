// @flow
import { isEmailValid } from '@kitman/common/src/utils/validators';
import isEmpty from 'lodash/isEmpty';

// this can be extended later
type FormFields = {
  firstName?: string,
  lastName?: string,
  email?: string,
};

type Errors = {
  firstName?: boolean,
  lastName?: boolean,
  email?: boolean,
};

/**
 * validateFormFields
 * @param {Object} fields - all fields per form for example { firstName: 'John', lastName: '', email: ''}
 * @param {Object} currentData - used if we want to validate only specific one field {firstName: ''} instead of all fields
 * @returns Object of all errors by field name, where true means that field is not valid and false means field is valid -> { firstName: false, lastName: true, email: true}
 */
export const validateFormFields = (
  fields: FormFields,
  currentData: FormFields = {}
) => {
  let errorFields = {};
  // get only field keys that represents field names for example firstName, lastName...
  const fieldNames = Object.keys(!isEmpty(currentData) ? currentData : fields);

  fieldNames.forEach((fieldName: string) => {
    // here it can be extended to add more validation specific fields
    const validateEmailField =
      fieldName === 'email' && !isEmailValid(fields[fieldName]);

    // set validation rules for form fields
    errorFields = {
      ...errorFields,
      [fieldName]: fields[fieldName] === '' || validateEmailField,
    };
  });

  return errorFields;
};

/**
 * validateAllFieldsWithErrors - this is recursive function that validates array of form fields
 * for example on submit when you need to validate
 * [
 *  { firstName: 'John', lastName: '', email: ''},
 *  { firstName: '', lastName: 'Doe', email: ''},
 *  { firstName: 'Jane', lastName: 'Doe', email: 'jd@email.com'}
 * ]
 * @param {Array} fields - array of all form fields
 * @param {Number} index - array index
 * @param {Array} errorArray - you can pass some existing errors if needed otherwhise it will be empty
 * @returns Array of all validated form fields
 * for example
 * * [
 *  { firstName: false, lastName: true, email: true},
 *  { firstName: true, lastName: false, email: true},
 *  { firstName: false, lastName: false, email: false}
 * ]
 */
export const validateAllFieldsWithErrors = (
  fields: Array<FormFields>,
  index: number = 0,
  errorArray: Array<Errors> = []
) => {
  // Base case: If index is out of bounds, return the error array
  if (index >= fields.length) return errorArray;

  // Current field to check
  const field = fields[index];
  const errorFields = validateFormFields(field);

  // Add validation result to the error array
  errorArray.push(errorFields);

  // Recursive call to check the next field
  return validateAllFieldsWithErrors(fields, index + 1, errorArray);
};

/**
 * validateFieldWithError - this is used to validate one field in some array of form fields
 * for example on blur
 *
 * @param {Object} field - { firstName: ''}
 * @param {Number} index
 * @param {Array} errorArray - you can pass already existing errors
 * @returns Array of errors per field name
 */
export const validateFieldWithError = (
  field: FormFields,
  index: number,
  errorArray: Array<Errors> = []
) => {
  const updatedShowErrors = [...errorArray];
  const errorField = validateFormFields(field);

  // if this row of fields wasnt validated before
  if (errorArray[index] === undefined) {
    updatedShowErrors[index] = errorField;
  } else {
    updatedShowErrors[index] = {
      ...updatedShowErrors[index],
      ...errorField,
    };
  }

  return updatedShowErrors;
};
