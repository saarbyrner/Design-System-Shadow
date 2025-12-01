// @flow
import moment from 'moment';
import parsePhoneNumber from 'libphonenumber-js';

import i18n from '@kitman/common/src/utils/i18n';
import type {
  HumanInputFormElement,
  ValueTypes,
} from '@kitman/modules/src/HumanInput/types/forms';
import type {
  ValidationState,
  ValidationStatus,
} from '@kitman/modules/src/HumanInput/types/validation';
import {
  INPUT_ELEMENTS,
  LAYOUT_ELEMENTS,
  COMPOSITE_SECTIONS,
} from '@kitman/modules/src/HumanInput/shared/constants';
import { isEmailValid } from '@kitman/common/src/utils/validators';

export const validationResult = {
  INVALID: 'INVALID',
  PENDING: 'PENDING',
  VALID: 'VALID',
};

export type ValidationResult = $Values<typeof validationResult>;

const setInitialValidation = ({
  config: { custom_params: customParams, optional: isOptional, condition },
  element_type: elementType,
}: HumanInputFormElement): ValidationStatus => {
  if (condition) {
    return validationResult.VALID;
  }
  if (isOptional || customParams?.readonly) {
    return validationResult.VALID;
  }

  if (customParams?.default_value) {
    return validationResult.VALID;
  }

  if (elementType === INPUT_ELEMENTS.Boolean) {
    if (customParams?.style === 'checkbox') {
      return validationResult.PENDING;
    }
    return validationResult.PENDING;
  }

  return validationResult.PENDING;
};

export const buildValidationState = (
  formElement: HumanInputFormElement,
  isChildOfRepeatableGroup: boolean = false
): ValidationState => {
  const id = formElement.id;
  if (!id) return {};
  if (formElement.element_type === LAYOUT_ELEMENTS.Content) return {};

  const root = formElement.form_elements;

  if (COMPOSITE_SECTIONS.includes(formElement.element_type)) {
    // set conditional group and child elements as VALID on initial validation
    if (formElement.config.condition) {
      const validationMap = {};

      validationMap[id] = {
        status: 'VALID',
        message: null,
      };

      formElement.form_elements.forEach((childElement) => {
        validationMap[childElement.id] = {
          status: validationResult.VALID,
          message: null,
        };
      });

      return validationMap;
    }

    const isRepeatableGroup =
      formElement.element_type === LAYOUT_ELEMENTS.Group &&
      formElement.config.repeatable;

    return Object.assign(
      {},
      ...root.map((element) => buildValidationState(element, isRepeatableGroup))
    );
  }

  return {
    [id]: isChildOfRepeatableGroup
      ? [
          {
            status: setInitialValidation(formElement),
            message: null,
          },
        ]
      : {
          status: setInitialValidation(formElement),
          message: null,
        },
  };
};

export const validateElement = (
  {
    config: {
      optional: isOptional,
      custom_params: customParams,
      text: configText,
      min: minimumValue,
      max: maximumValue,
    },
    element_type: elementType,
  }: HumanInputFormElement,
  value: ValueTypes
) => {
  const isOptionalField = !!isOptional;
  let isValid: boolean;
  let status: string = '';

  if (customParams?.readonly) {
    isValid = true;
  } else if (
    elementType === INPUT_ELEMENTS.Boolean &&
    typeof value === 'boolean'
  ) {
    if (customParams?.mode === 'unchecked_is_unanswered') {
      isValid = !!value;
    } else {
      isValid = true;
    }
  } else if (
    elementType === INPUT_ELEMENTS.MultipleChoice &&
    !isOptional &&
    Array.isArray(value)
  ) {
    isValid = !!value.length;
  } else if (elementType === INPUT_ELEMENTS.DateTime && !isOptional) {
    isValid = moment(value).isValid();
  } else if (elementType === INPUT_ELEMENTS.Number) {
    if (minimumValue !== null && +minimumValue > +value) {
      return {
        status: validationResult.INVALID,
        message: i18n.t(
          '{{field}} is below the minimum value of {{minValue}}',
          {
            field: configText,
            minValue: minimumValue,
            interpolation: { escapeValue: false },
          }
        ),
      };
    }

    if (maximumValue !== null && +maximumValue < +value) {
      return {
        status: validationResult.INVALID,
        message: i18n.t(
          '{{field}} is above the maximum value of {{maxValue}}',
          {
            field: configText,
            maxValue: maximumValue,
            interpolation: { escapeValue: false },
          }
        ),
      };
    }

    if (typeof value === 'number') {
      isValid = true;
    } else if (!value && !isOptionalField) {
      isValid = false;
    } else {
      isValid = true;
    }
  } else if (
    elementType === INPUT_ELEMENTS.Text &&
    customParams?.type === 'phone'
  ) {
    const parsedPhoneNumber = parsePhoneNumber(value);
    const hasNationalNumber = !!parsedPhoneNumber?.nationalNumber;

    if (value) {
      isValid = hasNationalNumber;
    } else {
      isValid = isOptionalField;
    }

    if (isOptionalField) {
      return {
        status: isValid ? validationResult.VALID : validationResult.INVALID,
        message: !isValid
          ? i18n.t('Please complete full {{field}}', {
              field: configText,
              interpolation: { escapeValue: false },
            })
          : null,
      };
    }
  } else if (
    elementType === INPUT_ELEMENTS.Text &&
    customParams?.type === 'email'
  ) {
    const validResponse = {
      status: validationResult.VALID,
      message: null,
    };

    const invalidResponse = {
      status: validationResult.INVALID,
      message: i18n.t('Please enter a valid email'),
    };

    const isEmailInputValid = typeof value === 'string' && isEmailValid(value);
    if (!isEmailInputValid) {
      if (isOptionalField) {
        return value ? invalidResponse : validResponse;
      }

      return invalidResponse;
    }

    return validResponse;
  } else if (isOptional) {
    isValid = true;
  } else {
    isValid = !!value;
  }

  if (!isOptionalField) {
    status = isValid ? validationResult.VALID : validationResult.INVALID;
  } else {
    status = isValid ? validationResult.VALID : validationResult.PENDING;
  }

  return {
    status,
    message:
      !isValid && !isOptionalField
        ? i18n.t('{{field}} is required', {
            field: configText,
            interpolation: { escapeValue: false },
          })
        : null,
  };
};
