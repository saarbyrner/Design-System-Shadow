// @flow
import isValidTemperature from '@kitman/modules/src/AdvancedEventOptions/utils';
import { isIntNumber } from '@kitman/common/src/utils/inputValidation';
import type {
  EventFormConditions,
  EventConditionsValidityExact,
} from '../types';

const validateEventConditions = (
  formData: EventFormConditions,
  temperatureUnits: ?string
): EventConditionsValidityExact => {
  let temperatureInvalid = false;
  if (formData.temperature !== undefined) {
    if (isIntNumber(formData.temperature)) {
      const unit = temperatureUnits === 'F' ? 'F' : 'C';
      temperatureInvalid = !isValidTemperature(formData.temperature, unit);
    } else if (!!formData.temperature && !Number.isNaN(formData.temperature)) {
      // If the temperature is a decimal and not NaN, set the invalid flag to true
      temperatureInvalid = formData.temperature % 1 !== 0;
    }
  }

  let humidityInvalid = false;
  if (formData.humidity) {
    if (formData.humidity < 0 || formData.humidity > 100) {
      humidityInvalid = true;
    }
  }

  return {
    temperature: {
      isInvalid: temperatureInvalid,
    },
    humidity: {
      isInvalid: humidityInvalid,
    },
    // Optional fields that don't require validation:
    // surface_type, surface_quality, weather
  };
};

export default validateEventConditions;
