// @flow
import moment from 'moment-timezone';
import type { TreatmentAttribute, DuplicateTreatmentSession } from './types';

import { getDuplicateTreatmentDateTime } from './timeUtils';

export const getInitialTimezoneValue = () => {
  const localTimezone =
    document.getElementsByTagName('body')[0].dataset.timezone;

  return localTimezone || moment.tz.guess();
};

export const selectReason = (
  currentTreatments: Array<TreatmentAttribute>,
  indexToUpdate: number,
  reason: Object
) => {
  const currentTreatmentsCopy = currentTreatments.slice();
  // $FlowFixMe we treatmentsAttributes exists at this point
  return currentTreatmentsCopy.map((treatment, index) =>
    indexToUpdate === index
      ? {
          ...treatment,
          reason: reason.reason,
          issue_type: reason.issue_type,
          issue_id: reason.issue_id,
        }
      : treatment
  );
};

export const updateTreatmentAttribute = (
  currentTreatments: Array<TreatmentAttribute>,
  indexToUpdate: number,
  key: string, // this is the key within the treatmentsAttributes object
  value: ?string | ?number
) => {
  const currentTreatmentsCopy = currentTreatments.slice();
  // $FlowFixMe we treatmentsAttributes exists at this point
  return currentTreatmentsCopy.map((treatment, index) => ({
    ...treatment,
    [key]: indexToUpdate === index ? value : treatment[key],
  }));
};

export const selectBodyArea = (
  currentTreatments: Array<TreatmentAttribute>,
  indexToUpdate: number,
  bodyArea: Object
) => {
  const currentTreatmentsCopy = currentTreatments.slice();
  // $FlowFixMe we treatmentsAttributes exists at this point
  return currentTreatmentsCopy.map((treatment, index) => ({
    ...treatment,
    treatment_body_areas:
      indexToUpdate === index
        ? bodyArea
        : // $FlowFixMe we treatmentsAttributes exists at this point
          treatment.treatment_body_areas,
  }));
};

export const removeTreatment = (
  currentTreatments: Array<TreatmentAttribute>,
  indexToRemove: number
) => {
  const currentTreatmentsCopy = currentTreatments.slice();
  // $FlowFixMe we treatmentsAttributes exists at this point
  return currentTreatmentsCopy.filter((item, index) => index !== indexToRemove);
};

export const createTreatmentTemplate = (
  currentTreatments: Array<TreatmentAttribute>
) => {
  const lastTreatmentAttribute =
    currentTreatments[currentTreatments.length - 1];
  // $FlowFixMe we treatmentsAttributes exists at this point
  const currentTreatmentsCopy = currentTreatments.slice();
  // $FlowFixMe treatmentsAttributes exists at this point
  currentTreatmentsCopy.push({
    treatment_modality_id: null,
    duration: null,
    reason: lastTreatmentAttribute?.reason || null,
    issue_type: lastTreatmentAttribute?.issue_type || null,
    issue_id: lastTreatmentAttribute?.issue_id || null,
    treatment_body_areas_attributes: [],
    is_billable: false,
    cpt_code: '',
    icd_code: '',
    amount_charged: '',
    discount: '',
    amount_paid_insurance: '',
    amount_due: '',
    amount_paid_athlete: '',
    date_paid: '',
    note: '',
  });
  return currentTreatmentsCopy;
};

export const updateIsBillable = (
  currentTreatments: Array<TreatmentAttribute>,
  indexToUpdate: number,
  value: boolean
) => {
  const currentTreatmentsCopy = currentTreatments.slice();
  // set amount_paid fields based on the is_billable value
  // if it is true they should default to zero
  // if it is false they should be cleared
  const amountValue = value ? '0' : '';
  // $FlowFixMe treatmentsAttributes exists at this point
  return currentTreatmentsCopy.map((treatment, index) => ({
    ...treatment,
    is_billable: indexToUpdate === index ? value : treatment.is_billable,
    amount_charged:
      indexToUpdate === index ? amountValue : treatment.amount_charged,
    discount: indexToUpdate === index ? amountValue : treatment.discount,
    amount_paid_insurance:
      indexToUpdate === index ? amountValue : treatment.amount_paid_insurance,
    amount_due: indexToUpdate === index ? amountValue : treatment.amount_due,
    amount_paid_athlete:
      indexToUpdate === index ? amountValue : treatment.amount_paid_athlete,
    date_paid: indexToUpdate === index ? null : treatment.date_paid,
  }));
};

// Send duplicateTreatment to helper function to return the adjusted treatment Time for the current date
export const setDuplicateTreatmentTimeDate = (
  duplicateTreatment: DuplicateTreatmentSession
) => {
  const { startTime, endTime, treatmentLengthLabel, timezone } =
    getDuplicateTreatmentDateTime(duplicateTreatment);

  return {
    startTime,
    startDate: startTime,
    endTime,
    endDate: endTime,
    duration: treatmentLengthLabel,
    timezone,
  };
};

export const duplicateTreatment = (
  duplicateTreatmentSession: DuplicateTreatmentSession
) => {
  return {
    athleteId: duplicateTreatmentSession.athlete.id,
    practitionerId: duplicateTreatmentSession.user.id,
    date: setDuplicateTreatmentTimeDate(duplicateTreatmentSession),
    // $FlowFixMe treatment_body_areas exists at this point
    treatmentsAttributes: duplicateTreatmentSession.treatments.map(
      (treatment) => {
        return {
          ...treatment,
          reason: treatment.reason,
          issue: treatment.issue,
          issue_type: treatment.issue_type,
          issue_id: treatment?.issue?.id || null,
          treatment_modality: treatment.treatment_modality.id,
          note: treatment?.note || '',
          // $FlowFixMe treatment_body_areas exists at this point
          treatment_body_areas: treatment.treatment_body_areas.map(
            (bodyArea) => {
              return JSON.stringify({
                treatable_area_type: bodyArea.treatable_area_type,
                treatable_area_id: bodyArea.treatable_area.id,
                side_id: bodyArea.side.id,
              });
            }
          ),
          cpt_code: treatment.billable_items[0]?.cpt_code || '',
          icd_code: treatment.billable_items[0]?.icd_code || '',
          amount_charged: treatment.billable_items[0]?.amount_charged || '',
          discount: treatment.billable_items[0]?.discount || '',
          amount_paid_insurance:
            treatment.billable_items[0]?.amount_paid_insurance || '',
          amount_due: treatment.billable_items[0]?.amount_due || '',
          amount_paid_athlete:
            treatment.billable_items[0]?.amount_paid_athlete || '',
          date_paid: treatment.billable_items[0]?.date_paid || '',
        };
      }
    ),
    annotationAttributes: {
      content: duplicateTreatmentSession.annotation?.content || '',
      attachments_attributes: [],
    },
    queuedAttachmentTypes: duplicateTreatmentSession.annotation?.content
      ? ['NOTE']
      : [],
  };
};
