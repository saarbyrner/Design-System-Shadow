// @flow
import moment from 'moment';
import _clone from 'lodash/clone';
import _setWith from 'lodash/setWith';
import type { Store as RostersPageStore } from '../../../rosters/src/redux/types/store';
import type { Store as AthletesPageStore } from '../../../athletes/src/redux/types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<
    RostersPageStore | AthletesPageStore,
    'treatmentCardList'
  > = {},
  action: Action
) => {
  switch (action.type) {
    case 'INITIALISE_EDIT_TREATMENT_STATE': {
      const initialisedAthleteTreatments = { ...state.athleteTreatments };
      action.payload.selectedAthleteIds.forEach((id) => {
        initialisedAthleteTreatments[id] = {
          athlete_id: id,
          date: action.payload.selectedTreatment.created_at,
          user_id: action.payload.selectedTreatment.user.id,
          start_time: action.payload.selectedTreatment.start_time,
          end_time: action.payload.selectedTreatment.end_time,
          timezone: action.payload.selectedTreatment.timezone,
          title: action.payload.selectedTreatment.title,
          treatments_attributes:
            action.payload.selectedTreatment.treatments.map((treatment) => {
              return {
                treatment_modality_id: treatment.treatment_modality.id,
                duration: treatment.duration,
                reason: null,
                issue_type: null,
                issue_id: null,
                treatment_body_areas_attributes:
                  treatment.treatment_body_areas?.map((bodyArea) => {
                    return JSON.stringify({
                      treatable_area_type: bodyArea.treatable_area_type,
                      treatable_area_id: bodyArea.treatable_area.id,
                      side_id: bodyArea.side.id,
                    });
                  }) || [],
                is_billable: false,
                cpt_code: '',
                amount_paid_insurance: '',
                amount_paid_athlete: '',
                note: '',
              };
            }),
          annotation_attributes: {
            content: '',
          },
        };
      });

      return {
        ...state,
        athleteTreatments: initialisedAthleteTreatments,
        invalidEditTreatmentCards: [],
      };
    }
    case 'SET_TREATMENT_FIELD_VALUE': {
      const { id, fieldKey, value } = action.payload;

      return _setWith(
        _clone(state),
        `athleteTreatments[${id}].${fieldKey}`,
        value,
        _clone
      );
    }
    case 'CLEAR_SELECTED_TREATMENTS': {
      return {
        ...state,
        athleteTreatments: {},
        invalidEditTreatmentCards: [],
      };
    }
    case 'ADD_TREATMENT_ROW': {
      return {
        ...state,
        athleteTreatments: {
          ...state.athleteTreatments,
          [action.payload.id]: {
            ...state.athleteTreatments[action.payload.id],
            treatments_attributes: [
              ...state.athleteTreatments[action.payload.id]
                .treatments_attributes,
              {
                treatment_modality_id: null,
                duration: null,
                reason: null,
                issue_type: null,
                issue_id: null,
                treatment_body_areas_attributes: [],
                is_billable: false,
                cpt_code: '',
                amount_paid_insurance: '',
                amount_paid_athlete: '',
                note: '',
              },
            ],
          },
        },
      };
    }
    case 'REMOVE_ALL_TREATMENTS': {
      return {
        ...state,
        athleteTreatments: {
          ...state.athleteTreatments,
          [action.payload.id]: {
            ...state.athleteTreatments[action.payload.id],
            treatments_attributes: [],
          },
        },
      };
    }
    case 'REMOVE_TREATMENT_ROW': {
      const treatmentAttributes = [
        ...state.athleteTreatments[action.payload.id].treatments_attributes,
      ].filter((item, index) => index !== action.payload.treatmentIndex);

      return {
        ...state,
        athleteTreatments: {
          ...state.athleteTreatments,
          [action.payload.id]: {
            ...state.athleteTreatments[action.payload.id],
            treatments_attributes: treatmentAttributes,
          },
        },
      };
    }
    case 'REMOVE_ATHLETE': {
      const newAthleteTreatments = { ...state.athleteTreatments };
      delete newAthleteTreatments[action.payload.id];

      return {
        ...state,
        athleteTreatments: newAthleteTreatments,
      };
    }
    case 'VALIDATE_EDIT_TREATMENT_CARDS': {
      let invalidCards = [...state.invalidEditTreatmentCards];

      Object.keys(state.athleteTreatments).forEach((id) => {
        // are the start_time and end_time different?
        const isTimeValid = !moment(
          state.athleteTreatments[id].end_time
        ).isSame(moment(state.athleteTreatments[id].start_time), 'minute');

        // are the modality and reason fields populated for each treatment row?
        const areTreatmentsValid = state.athleteTreatments[
          id
        ].treatments_attributes.every(
          (treatment) => treatment.treatment_modality_id && treatment.reason
        );

        if (areTreatmentsValid && isTimeValid && invalidCards.includes(id)) {
          invalidCards = invalidCards.filter((card) => card !== id);
        } else if (
          (!areTreatmentsValid || !isTimeValid) &&
          !invalidCards.includes(id)
        ) {
          invalidCards = [...invalidCards, id];
        }
      });

      return {
        ...state,
        invalidEditTreatmentCards: invalidCards,
      };
    }
    default:
      return state;
  }
};
