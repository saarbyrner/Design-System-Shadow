// @flow
import moment from 'moment-timezone';
import { useReducer } from 'react';
import type { Dispatch } from '../../../types';

import type {
  QueuedAttachment,
  Reason,
  TreatmentAttribute,
  CreateTreatmentFormState,
  DuplicateTreatmentSession,
} from '../types';

import {
  getInitialTimezoneValue,
  removeTreatment,
  selectReason,
  updateTreatmentAttribute,
  selectBodyArea,
  createTreatmentTemplate,
  updateIsBillable,
  duplicateTreatment,
} from '../utils';

import {
  onSetStartDate,
  onSetStartTime,
  onSetEndDate,
  onSetEndTime,
} from '../timeUtils';

export type FormAction =
  | { type: 'ADD_TREATMENT', treatment: TreatmentAttribute }
  | { type: 'CLEAR_FORM', defaultFormValues: CreateTreatmentFormState }
  | { type: 'CLEAR_MULTI_ADD' }
  | { type: 'CREATE_TREATMENT_TEMPLATE' }
  | { type: 'SET_TREATMENT_START_DATE', date: moment }
  | { type: 'SET_TREATMENT_START_TIME', time: moment }
  | { type: 'SET_TREATMENT_END_TIME', time: moment }
  | { type: 'SET_TREATMENT_END_DATE', date: moment }
  | { type: 'SET_TREATMENT_TIMEZONE', timezone: string }
  | { type: 'DUPLICATE_TREATMENT', treatment: DuplicateTreatmentSession }
  | { type: 'REMOVE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'REMOVE_TREATMENT', index: number }
  | { type: 'SET_ATHLETE_ID', athleteId: number }
  | { type: 'SET_ATTACHED_NOTE_CONTENT', note: string }
  | { type: 'SET_MULTI_BODY_AREAS', bodyAreas: Array<string> }
  | { type: 'SET_MULTI_DURATION', duration: ?string }
  | { type: 'SET_MULTI_MODALITIES', modalities: Array<number> }
  | { type: 'SET_MULTI_REASON', reason: ?Reason }
  | { type: 'SET_PRACTITIONER_ID', practitionerId: number }
  | { type: 'SET_REFERRING_PHYSICIAN', referringPhysician: string }
  | {
      type: 'SET_TREATMENT_AMOUNT_INSURANCE',
      index: number,
      amountPaidInsurance: string,
    }
  | {
      type: 'SET_TREATMENT_AMOUNT_ATHLETE',
      index: number,
      amountPaidAthlete: string,
    }
  | {
      type: 'SET_TREATMENT_AMOUNT_CHARGED',
      index: number,
      amountCharged: string,
    }
  | {
      type: 'SET_TREATMENT_DISCOUNT_OR_REDUCTION',
      index: number,
      discountOrReduction: string,
    }
  | {
      type: 'SET_TREATMENT_AMOUNT_DUE',
      index: number,
      amountDue: string,
    }
  | {
      type: 'SET_TREATMENT_DATE_PAID_DATE',
      index: number,
      datePaidDate: string,
    }
  | {
      type: 'SET_TREATMENT_BODY_AREA',
      index: number,
      selectedBodyAreas: Array<string>,
    }
  | { type: 'SET_TREATMENT_CPT_CODE', index: number, cptCode: string }
  | { type: 'SET_TREATMENT_ICD_CODE', index: number, icdCode: string }
  | { type: 'SET_TREATMENT_DURATION', index: number, duration: ?string }
  | { type: 'SET_TREATMENT_IS_BILLABLE', index: number, isBillable: boolean }
  | { type: 'SET_TREATMENT_NOTE', index: number, note: string }
  | { type: 'SET_TREATMENT_MODALITY', index: number, modality: number }
  | {
      type: 'SET_TREATMENT_REASON',
      index: number,
      reason: ?Reason,
    }
  | {
      type: 'UPDATE_QUEUED_ATTACHMENTS',
      queuedAttachments: QueuedAttachment[],
    }
  | { type: 'UPDATE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'SET_MEDICAL_LOCATIONS', medicalLocations: Array<any> };

export const init = ({
  athleteId,
  practitionerId,
  referringPhysician,
  duration,
  treatmentsAttributes,
  queuedAttachments,
  issue,
  queuedAttachmentTypes,
  medicalLocations,
  annotationAttributes,
}: CreateTreatmentFormState) => {
  return {
    athleteId: athleteId || null,
    practitionerId,
    referringPhysician,
    date: {
      startTime: moment().tz(getInitialTimezoneValue()),
      startDate: moment().tz(getInitialTimezoneValue()),
      endTime: moment
        .tz(moment().tz(getInitialTimezoneValue()), getInitialTimezoneValue())
        .add(30, 'minutes'),
      endDate: moment
        .tz(moment().tz(getInitialTimezoneValue()), getInitialTimezoneValue())
        .add(30, 'minutes'),
      timezone: getInitialTimezoneValue(),
      duration: '30 mins',
    },
    duration: duration || null,
    treatmentsAttributes: treatmentsAttributes || [],
    queuedAttachments: queuedAttachments || [],
    queuedAttachmentTypes: queuedAttachmentTypes || [],
    annotationAttributes: annotationAttributes || [],
    modalities: treatmentsAttributes.map((t) => t.treatment_modality),
    bodyAreas: [],
    reason: {
      reason: '',
      issue_type: null,
      issue_id: null,
    },
    issue: issue || null,
    multiDuration: '',
    medicalLocations: medicalLocations || [],
  };
};

const formReducer = (state: CreateTreatmentFormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_TREATMENT_START_DATE':
      return {
        ...state,
        date: onSetStartDate(state.date, action.date),
      };
    case 'SET_TREATMENT_START_TIME':
      return {
        ...state,
        date: onSetStartTime(action.time, state.date),
      };
    case 'SET_TREATMENT_END_DATE':
      return {
        ...state,
        date: onSetEndDate(action.date, state.date),
      };
    case 'SET_TREATMENT_END_TIME':
      return {
        ...state,
        date: onSetEndTime(state.date, action.time),
      };
    case 'SET_TREATMENT_TIMEZONE':
      return {
        ...state,
        date: {
          ...state.date,
          timezone: action.timezone,
        },
      };
    case 'SET_ATHLETE_ID':
      return {
        ...state,
        athleteId: action.athleteId,
      };
    case 'SET_PRACTITIONER_ID':
      return {
        ...state,
        practitionerId: action.practitionerId,
      };
    case 'SET_REFERRING_PHYSICIAN':
      return {
        ...state,
        referringPhysician: action.referringPhysician,
      };
    case 'ADD_TREATMENT':
      return {
        ...state,
        treatmentsAttributes: [...state.treatmentsAttributes, action.treatment],
      };

    case 'SET_TREATMENT_REASON':
      return {
        ...state,
        treatmentsAttributes: selectReason(
          // $FlowFixMe we treatmentsAttributes exists at this point
          state.treatmentsAttributes,
          action.index,
          action.reason
        ),
      };
    case 'SET_MULTI_REASON':
      return {
        ...state,
        reason: action.reason,
      };
    case 'SET_MULTI_DURATION':
      return {
        ...state,
        multiDuration: action.duration,
      };
    case 'SET_TREATMENT_MODALITY':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          // $FlowFixMe we treatmentsAttributes exists at this point
          state.treatmentsAttributes,
          action.index,
          'treatment_modality',
          action.modality
        ),
      };
    case 'SET_TREATMENT_BODY_AREA':
      return {
        ...state,
        treatmentsAttributes: selectBodyArea(
          // $FlowFixMe we treatmentsAttributes exists at this point
          state.treatmentsAttributes,
          action.index,
          action.selectedBodyAreas
        ),
      };
    case 'REMOVE_TREATMENT':
      return {
        ...state,
        treatmentsAttributes: removeTreatment(
          state.treatmentsAttributes,
          action.index
        ),
      };
    case 'CREATE_TREATMENT_TEMPLATE':
      return {
        ...state,
        treatmentsAttributes: createTreatmentTemplate(
          state.treatmentsAttributes
        ),
      };
    case 'DUPLICATE_TREATMENT':
      return {
        ...state,
        ...duplicateTreatment(action.treatment),
      };
    case 'SET_TREATMENT_DURATION':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          state.treatmentsAttributes,
          action.index,
          'duration',
          action.duration
        ),
      };
    case 'SET_TREATMENT_NOTE':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          state.treatmentsAttributes,
          action.index,
          'note',
          action.note
        ),
      };
    case 'SET_TREATMENT_CPT_CODE':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          state.treatmentsAttributes,
          action.index,
          'cpt_code',
          action.cptCode
        ),
      };
    case 'SET_TREATMENT_ICD_CODE':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          state.treatmentsAttributes,
          action.index,
          'icd_code',
          action.icdCode
        ),
      };
    case 'SET_TREATMENT_IS_BILLABLE':
      return {
        ...state,
        treatmentsAttributes: updateIsBillable(
          state.treatmentsAttributes,
          action.index,
          action.isBillable
        ),
      };
    case 'SET_TREATMENT_AMOUNT_CHARGED':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          state.treatmentsAttributes,
          action.index,
          'amount_charged',
          action.amountCharged
        ),
      };
    case 'SET_TREATMENT_DISCOUNT_OR_REDUCTION':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          state.treatmentsAttributes,
          action.index,
          'discount',
          action.discountOrReduction
        ),
      };
    case 'SET_TREATMENT_AMOUNT_INSURANCE':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          state.treatmentsAttributes,
          action.index,
          'amount_paid_insurance',
          action.amountPaidInsurance
        ),
      };
    case 'SET_TREATMENT_AMOUNT_DUE':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          state.treatmentsAttributes,
          action.index,
          'amount_due',
          action.amountDue
        ),
      };
    case 'SET_TREATMENT_DATE_PAID_DATE':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          state.treatmentsAttributes,
          action.index,
          'date_paid',
          action.datePaidDate
        ),
      };
    case 'SET_TREATMENT_AMOUNT_ATHLETE':
      return {
        ...state,
        treatmentsAttributes: updateTreatmentAttribute(
          state.treatmentsAttributes,
          action.index,
          'amount_paid_athlete',
          action.amountPaidAthlete
        ),
      };
    case 'UPDATE_QUEUED_ATTACHMENTS':
      return {
        ...state,
        queuedAttachments: action.queuedAttachments,
      };
    case 'UPDATE_ATTACHMENT_TYPE':
      return {
        ...state,
        queuedAttachmentTypes: [
          ...state.queuedAttachmentTypes,
          action.queuedAttachmentType,
        ],
      };
    case 'REMOVE_ATTACHMENT_TYPE':
      return {
        ...state,
        queuedAttachmentTypes: state.queuedAttachmentTypes.filter(
          (type) => type !== action.queuedAttachmentType
        ),
        annotationAttributes: {
          ...state.annotationAttributes,
          content: '',
        },
      };
    case 'SET_ATTACHED_NOTE_CONTENT':
      return {
        ...state,
        annotationAttributes: {
          ...state.annotationAttributes,
          content: action.note,
        },
      };
    case 'SET_MULTI_MODALITIES':
      return {
        ...state,
        modalities: action.modalities,
      };
    case 'SET_MULTI_BODY_AREAS':
      return {
        ...state,
        bodyAreas: action.bodyAreas,
      };
    case 'SET_MEDICAL_LOCATIONS':
      return {
        ...state,
        medicalLocations: action.medicalLocations,
      };
    case 'CLEAR_MULTI_ADD':
      return {
        ...state,
        modalities: [],
        bodyAreas: [],
        reason: {
          reason: '',
          issue_type: null,
          issue_id: null,
        },
        multiDuration: '',
      };
    case 'CLEAR_FORM':
      return init(action.defaultFormValues);
    default:
      return state;
  }
};

const useCreatmentTreatmentForm = (
  defaultFormValues: CreateTreatmentFormState
) => {
  const [formState, dispatch]: [
    CreateTreatmentFormState,
    Dispatch<FormAction>
  ] = useReducer(formReducer, defaultFormValues, init);

  return {
    formState,
    dispatch,
  };
};

export default useCreatmentTreatmentForm;
