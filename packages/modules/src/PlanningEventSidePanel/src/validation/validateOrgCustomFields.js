// @flow
import type {
  GameTrainingEventFormData,
  EventCustomOrgPropertiesValidityExact,
} from '../types';

const validateOrgCustomFields = (
  formData: GameTrainingEventFormData
): EventCustomOrgPropertiesValidityExact => {
  const locationRequired =
    window.getFlag('planning-custom-org-event-details') &&
    (formData.type === 'game_event' ||
      formData.session_type?.sessionTypeCategoryName === 'Practice');

  return {
    ...(!window.featureFlags['nfl-location-feed'] && {
      nfl_location_id: {
        isInvalid: locationRequired ? formData.nfl_location_id == null : false,
      },
    }),
    ...(window.featureFlags['nfl-location-feed'] && {
      nfl_location_feed_id: {
        isInvalid: locationRequired
          ? formData.nfl_location_feed_id == null
          : false,
      },
    }),
    season_type_id: {
      isInvalid:
        window.getFlag('planning-custom-org-event-details') &&
        formData.type === 'session_event'
          ? formData.season_type_id == null
          : false,
    },
    nfl_surface_type_id: {
      isInvalid:
        window.getFlag('planning-custom-org-event-details') &&
        !window.getFlag('nfl-hide-surface-type') &&
        (formData.type === 'game_event' ||
          formData.session_type?.sessionTypeCategoryName === 'Practice')
          ? formData.nfl_surface_type_id == null
          : false,
    },
    nfl_equipment_id: {
      isInvalid:
        window.getFlag('planning-custom-org-event-details') &&
        (formData.type === 'game_event' ||
          formData.session_type?.sessionTypeCategoryName === 'Practice')
          ? formData.nfl_equipment_id == null
          : false,
    },
    field_condition: {
      isInvalid: false,
    },
    nfl_surface_composition_id: {
      isInvalid: false,
    },
  };
};

export default validateOrgCustomFields;
