// @flow

import { useReducer } from 'react';

export type FormState = {
  athlete_id: ?number,
  custom_alert_name: ?string,
  alert_date: string,
  medical_alert_id: ?number,
  alert_title: string,
  severity: string,
  visibility: string,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
};

export type FormAction =
  | { type: 'SET_ATHLETE_ID', athleteId: ?number }
  | { type: 'SET_ALERT_DATE', alert_date: string }
  | { type: 'SET_MEDICAL_ALERT_ID', medical_alert_id: ?number }
  | { type: 'SET_ALERT_TITLE', alert_title: string }
  | { type: 'SET_SYMPTOMS', symptoms: string }
  | { type: 'SET_CUSTOM_ALERT_NAME', custom_alert_name: string }
  | { type: 'SET_SEVERITY', severity: string }
  | { type: 'SET_VISIBILITY', visibilityId: string }
  | {
      type: 'AUTOPOPULATE_SELECTED_ALERT',
      athlete_id: ?number,
      medical_alert_id: ?number,
      alert_title: string,
      severity: string,
      restricted_to_doc: boolean,
      restricted_to_psych: boolean,
    }
  | { type: 'CLEAR_FORM' };

export type Dispatch<T> = (action: T) => any;

export const InitialFormState = {
  athlete_id: null,
  medical_alert_id: null,
  alert_title: '',
  alert_date: '',
  custom_alert_name: null,
  severity: '',
  visibility: '',
  restricted_to_doc: false,
  restricted_to_psych: false,
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
    case 'SET_ALERT_DATE':
      return {
        ...state,
        alert_date: action.alert_date,
      };
    case 'SET_MEDICAL_ALERT_ID':
      return {
        ...state,
        medical_alert_id: action.medical_alert_id,
      };
    case 'SET_ALERT_TITLE':
      return {
        ...state,
        alert_title: action.alert_title,
      };
    case 'SET_CUSTOM_ALERT_NAME':
      return {
        ...state,
        custom_alert_name: action.custom_alert_name,
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
    case 'AUTOPOPULATE_SELECTED_ALERT':
      return {
        ...state,
        athlete_id: action.athlete_id,
        medical_alert_id: action.medical_alert_id,
        alert_title: action.alert_title,
        severity: action.severity,
        restricted_to_doc: action.restricted_to_doc,
        restricted_to_psych: action.restricted_to_psych,
      };
    case 'CLEAR_FORM':
      return InitialFormState;

    default:
      return state;
  }
};

const useMedicalAlertForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    InitialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useMedicalAlertForm;
