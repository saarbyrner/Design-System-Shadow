// @flow

import { useReducer } from 'react';

export type Allergen = {
  type: string,
  id?: number,
  rcopia_id?: string,
  name?: string,
  group_id?: string,
};
export type FormState = {
  athlete_id: ?number,
  illness_occurrence_ids: Array<number>,
  injury_occurrence_ids: Array<number>,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  allergy_name: string,
  allergy_date: string,
  allergen_name: { value: any, label: string },
  allergen: Allergen,
  name?: string,
  ever_been_hospitalised: boolean,
  require_epinephrine: boolean,
  symptoms: string,
  severity: string,
};

export type FormAction =
  | { type: 'SET_ATHLETE_ID', athleteId: ?number }
  | { type: 'SET_ALLERGY_DATE', allergyDate: string }
  | {
      type: 'SET_ALLERGEN',
      allergen: Allergen,
      allergenName: { value: any, label: string },
    }
  | { type: 'SET_SYMPTOMS', symptoms: string }
  | { type: 'SET_CUSTOM_ALLERGY_NAME', customAllergyName?: string }
  | { type: 'SET_SEVERITY', severity: string }
  | { type: 'SET_ILLNESS_IDS', illnessIds: Array<number> }
  | { type: 'SET_INJURY_IDS', injuryIds: Array<number> }
  | { type: 'SET_VISIBILITY', visibilityId: string }
  | { type: 'SET_ALLERGY_NAME', allergyName: string }
  | { type: 'SET_EVER_HOSPITALISED', everBeenHospitalised: boolean }
  | { type: 'SET_REQUIRE_EPINEPHRINE', requireEpinephrine: boolean }
  | {
      type: 'AUTOPOPULATE_SELECTED_ALLERGY',
      athleteId: number,
      allergen: Allergen,
      allergenName: { value: any, label: string, type: string },
      allergyName: string,
      symptoms: string,
      severity: string,
      everBeenHospitalised: boolean,
      requireEpinephrine: boolean,
    }
  | { type: 'CLEAR_FORM' };

export type Dispatch<T> = (action: T) => any;

export const InitialFormState = {
  athlete_id: null,
  allergen: {
    rcopia_id: '',
    type: 'DrfirstDrug',
    search_expression: '',
  },
  allergen_name: { value: null, label: '' },
  allergy_date: '',
  allergy_name: '',
  name: '',
  illness_occurrence_ids: [],
  injury_occurrence_ids: [],
  ever_been_hospitalised: false,
  require_epinephrine: false,
  restricted_to_doc: false,
  restricted_to_psych: false,
  symptoms: '',
  severity: '',
};

const formReducer = (
  state: FormState = InitialFormState,
  action: FormAction
) => {
  switch (action.type) {
    case 'SET_ATHLETE_ID':
      return {
        ...state,
        athlete_id: action.athleteId,
      };
    case 'SET_ALLERGY_DATE':
      return {
        ...state,
        allergy_date: action.allergyDate,
      };
    case 'SET_ALLERGEN':
      return {
        ...state,
        allergen_name: action.allergenName,
        allergen: action.allergen,
      };
    case 'SET_CUSTOM_ALLERGY_NAME':
      return {
        ...state,
        name: action.customAllergyName,
      };
    case 'SET_ALLERGY_NAME':
      return {
        ...state,
        allergy_name: action.allergyName,
      };
    case 'SET_ILLNESS_IDS':
      return {
        ...state,
        illness_occurrence_ids: action.illnessIds,
      };
    case 'SET_INJURY_IDS':
      return {
        ...state,
        injury_occurrence_ids: action.injuryIds,
      };
    case 'SET_VISIBILITY':
      return {
        ...state,
        restricted_to_doc: action.visibilityId === 'DOCTORS',
        restricted_to_psych: action.visibilityId === 'PSYCH_TEAM',
      };
    case 'SET_SYMPTOMS':
      return {
        ...state,
        symptoms: action.symptoms,
      };
    case 'SET_SEVERITY':
      return {
        ...state,
        severity: action.severity,
      };
    case 'SET_EVER_HOSPITALISED':
      return {
        ...state,
        ever_been_hospitalised: action.everBeenHospitalised,
      };
    case 'SET_REQUIRE_EPINEPHRINE':
      return {
        ...state,
        require_epinephrine: action.requireEpinephrine,
      };
    case 'AUTOPOPULATE_SELECTED_ALLERGY':
      return {
        ...state,
        athlete_id: action.athleteId,
        allergen: action.allergen,
        allergen_name: action.allergenName,
        name: action.allergyName,
        symptoms: action.symptoms,
        severity: action.severity,
        ever_been_hospitalised: action.everBeenHospitalised,
        require_epinephrine: action.requireEpinephrine,
      };
    case 'CLEAR_FORM':
      return InitialFormState;

    default:
      return state;
  }
};

const useAllergyForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    InitialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useAllergyForm;
