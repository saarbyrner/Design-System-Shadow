// @flow
import validateCommon from './validateCommon';
import validateEventConditions from './validateEventConditions';
import validateOrgCustomFields from './validateOrgCustomFields';
import type {
  EventSessionFormData,
  EventSessionFormValidity,
  EventFormValidityResult,
} from '../types';

export const allValidSession: EventSessionFormValidity = {
  type: 'session_event',
};

const validateSession = (
  formData: EventSessionFormData,
  temperatureUnits: ?string
): EventFormValidityResult => {
  const validationResults = {
    ...validateCommon(formData),
    ...validateEventConditions(formData, temperatureUnits),
    ...validateOrgCustomFields(formData),

    session_type_id: {
      isInvalid: formData.session_type_id == null,
    },

    ...(window.featureFlags['surface-type-mandatory-sessions'] && {
      surface_type: {
        isInvalid: formData.surface_type == null,
      },
    }),

    workload_type: {
      isInvalid: formData.workload_type == null,
    },

    team_id: {
      isInvalid:
        window.getFlag('planning-custom-org-event-details') &&
        formData.session_type
          ? formData.session_type.isJointSessionType && formData.team_id == null
          : false,
    },
    venue_type_id: {
      isInvalid:
        window.featureFlags['nfl-2024-new-questions'] &&
        window.getFlag('planning-custom-org-event-details') &&
        formData.session_type &&
        formData.session_type.isJointSessionType
          ? formData.venue_type_id == null
          : false,
    },
    // Optional fields that currently don't require validation:
    // game_day_minus, game_day_plus
  };

  let isValid = true;
  Object.values(validationResults).forEach((result) => {
    // $FlowIgnore[incompatible-type] isInvalid will be present
    if (result.isInvalid) {
      isValid = false;
    }
  });

  return {
    isValid,
    validation: {
      ...validationResults,
      type: 'session_event',
    },
  };
};

export default validateSession;
