// @flow
import validateCommon from './validateCommon';
import type {
  CustomEventFormData,
  CustomEventFormValidity,
  EventFormValidityResult,
} from '../types';

import { validateStaffVisibility } from './utils';

export const allValidCustomEvent: CustomEventFormValidity = {
  type: 'custom_event',
};

const validateCustomEvent = (
  formData: CustomEventFormData
): EventFormValidityResult => {
  const validationResults = {
    ...validateCommon(formData),
    ...validateStaffVisibility(formData),

    custom_event_type: {
      isInvalid: formData.custom_event_type?.id == null,
    },
  };

  let isValid = true;
  Object.values(validationResults).forEach((result) => {
    if (result && typeof result === 'object' && result.isInvalid) {
      isValid = false;
    }
  });

  return {
    isValid,
    validation: {
      ...validationResults,
      type: 'custom_event',
    },
  };
};

export default validateCustomEvent;
