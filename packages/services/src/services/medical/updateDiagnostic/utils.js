// @flow
import type {
  FormState,
  QueuedDiagnostic,
} from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDiagnosticForm';

export const getFirstQueuedDiagnostic = (formState: FormState) => {
  if (Array.isArray(formState.queuedDiagnostics)) {
    return formState.queuedDiagnostics[0] || {};
  }
  return {};
};

export const getValueOrFallback = (value: any, fallbacks: Array<any>) => {
  if (value != null) return value;
  return fallbacks.find((fallback) => fallback != null) ?? null;
};

// Returns common diagnostic body fields shared by GA and Redox payloads.
export const getCommonDiagnosticFields = (
  formState: FormState,
  firstQueuedDiagnostic: QueuedDiagnostic,
  overrides?: {
    diagnosticTypeId?: ?number,
    laterality?: ?number,
    diagDate?: ?string,
  }
) => {
  const diagnosticTypeIdOverride = overrides?.diagnosticTypeId;
  const lateralityOverride = overrides?.laterality;
  const diagDateOverride = overrides?.diagDate;
  return {
    diagnostic_type_id: getValueOrFallback(diagnosticTypeIdOverride, [
      formState?.diagnosticType?.value,
      firstQueuedDiagnostic?.diagnosticType?.id,
    ]),
    location_id: formState.locationId,
    prescriber_id: formState.userId,
    laterality: getValueOrFallback(lateralityOverride, [
      formState?.lateralityId,
      firstQueuedDiagnostic?.lateralityId,
    ]),
    diagnostic_reason_id: formState.reasonId,
    diag_date: getValueOrFallback(diagDateOverride, [
      formState?.diagnosticDate,
      firstQueuedDiagnostic?.diagnosticDate,
    ]),
    injury_ids: formState.injuryIds,
    illness_ids: formState.illnessIds,
    ...(window.featureFlags['chronic-injury-illness'] && {
      chronic_issue_ids: formState.chronicIssueIds,
    }),
    provider_sgid: getValueOrFallback(formState.orderProviderSGID, [
      firstQueuedDiagnostic?.orderProviderSGID,
    ]),
    // Billing (single) fields
    cpt_code: formState.cptCode || null,
    is_billable: formState.isBillable,
    referring_physician: formState.referringPhysician,
    amount_charged: formState.amountCharged,
    discount: formState.discountOrReduction,
    amount_paid_insurance: formState.amountPaidInsurance,
    amount_due: formState.amountDue,
    amount_paid_athlete: formState.amountPaidAthlete,
    date_paid: formState.datePaidDate,
    // Multi-billing fields
    billable_items: (() => {
      if (!Array.isArray(formState.queuedBillableItems)) {
        // GA expects an array, Redox expects null when not present.
        return window.getFlag('pm-diagnostic-ga-enhancement') ? [] : null;
      }

      return (formState.queuedBillableItems: any).map((billableItem) => ({
        id: billableItem.id,
        cpt_code: billableItem.cptCode,
        is_billable: billableItem.isBillable,
        amount_charged: billableItem.amountCharged,
        discount: billableItem.discountOrReduction,
        amount_paid_insurance: billableItem.amountPaidInsurance,
        amount_due: billableItem.amountDue,
        amount_paid_athlete: billableItem.amountPaidAthlete,
        date_paid: billableItem.datePaidDate,
        referring_physician: formState.referringPhysician,
        is_deleted: billableItem.isDeleted,
      }));
    })(),
  };
};

export const getRedoxPayload = (formState: FormState) => {
  const firstQueuedDiagnostic = getFirstQueuedDiagnostic(formState);
  const common = getCommonDiagnosticFields(formState, firstQueuedDiagnostic);
  return {
    diagnostic: {
      ...common,
      order_date: firstQueuedDiagnostic?.orderDate || null,
    },
    scope_to_org: true,
  };
};

export const getGaPayload = (formState: FormState) => {
  const firstQueuedDiagnostic = getFirstQueuedDiagnostic(formState);
  const answers = Array.isArray(firstQueuedDiagnostic?.answers)
    ? firstQueuedDiagnostic.answers
    : [];

  const getAnswerText = (answer) => {
    if (answer?.optionalText != null) return answer.optionalText;
    if (answer.questionType === 'text') return answer.value;
    return null;
  };

  const common = getCommonDiagnosticFields(formState, firstQueuedDiagnostic);

  return {
    diagnostic: {
      ...common,
      diagnostic_type_answers: (() => {
        const out = [];
        answers.forEach((answer) => {
          out.push({
            diagnostic_type_question_id: answer.questionTypeId,
            diagnostic_type_question_choice_id: [
              'choice',
              'segmented_choice',
            ].includes(answer.questionType)
              ? answer.value
              : null,
            datetime: answer.questionType === 'datetime' ? answer.value : null,
            text: getAnswerText(answer),
          });
        });
        return out;
      })(),
      cardiac_screening:
        formState.diagnosticType?.cardiacScreening ||
        firstQueuedDiagnostic?.diagnosticType?.cardiacScreening,
      send_redox_order: formState.redoxOrderStatus === 1,
    },
    scope_to_org: true,
  };
};
