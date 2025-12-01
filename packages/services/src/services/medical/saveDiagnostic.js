// @flow
import $ from 'jquery';
import { emptyHTMLeditorContent } from '@kitman/modules/src/Medical/shared/utils';
import type { FormState } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDiagnosticForm';

const saveDiagnostic = (
  formState: FormState,
  attachmentIds?: Array<number>,
  isMulti?: boolean
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      // $FlowFixMe athleteId cannot be null here as validation will have caught it
      url: `/athletes/${formState.athleteId}/diagnostics`,
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
      data: JSON.stringify({
        ...(isMulti && {
          diagnostics: formState.queuedDiagnostics.map((diagnostic) => ({
            diagnostic_type_id: diagnostic.diagnosticType?.id,
            attachment_ids:
              diagnostic.queuedAttachments &&
              diagnostic.queuedAttachments === null
                ? []
                : diagnostic.queuedAttachments,
            laterality: diagnostic.lateralityId,
            provider_sgid: diagnostic.orderProviderSGID,
            diag_date: diagnostic.diagnosticDate,
            order_date: diagnostic.orderDate,
            attached_links: diagnostic.queuedLinks,
            annotation_content:
              diagnostic.annotationContent === emptyHTMLeditorContent
                ? null
                : diagnostic.annotationContent,
            send_redox_order: formState.redoxOrderStatus === 1,
            diagnostic_reason_id: formState.reasonId,
            location_id: formState.locationId,
            injury_ids: formState.injuryIds,
            illness_ids: formState.illnessIds,
            diagnostic_type_answers:
              diagnostic?.answers?.map((answer) => ({
                diagnostic_type_question_id: answer.questionTypeId,
                diagnostic_type_question_choice_id: [
                  'choice',
                  'segmented_choice',
                ].includes(answer.questionType)
                  ? answer.value
                  : null,
                datetime:
                  answer.questionType === 'datetime' ? answer.value : null,
                // eslint-disable-next-line no-nested-ternary
                text: answer?.optionalText
                  ? answer?.optionalText
                  : answer.questionType === 'text'
                  ? answer.value
                  : null,
              })) || [],
            restrict_access_to: formState.restrictAccessTo,
            ...(window.featureFlags['chronic-injury-illness'] && {
              chronic_issue_ids: formState.chronicIssueIds,
            }),
            cardiac_screening: formState.diagnosticType?.cardiacScreening,
          })),
        }),
        // $FlowFixMe known 'bug' Flow Issue that they don't intend to fix soon https://github.com/facebook/flow/issues/8186
        ...(!isMulti && {
          diagnostic: {
            attachment_ids: attachmentIds,
            diagnostic_type_id: formState.diagnosticType?.value,
            location_id: formState.locationId,
            prescriber_id: formState.userId,
            laterality: formState.lateralityId,
            provider_sgid: formState.orderProviderSGID,
            diagnostic_reason_id: formState.reasonId,
            diag_date: formState.diagnosticDate,
            injury_ids: formState.injuryIds,
            illness_ids: formState.illnessIds,
            ...(window.featureFlags['chronic-injury-illness'] && {
              chronic_issue_ids: formState.chronicIssueIds,
            }),
            // once we remove single diagnostic flow
            diagnostic_type_answers:
              formState.queuedDiagnostics[0].answers?.map((answer) => ({
                diagnostic_type_question_id: answer.questionTypeId,
                diagnostic_type_question_choice_id: [
                  'choice',
                  'segmented_choice',
                ].includes(answer.questionType)
                  ? answer.value
                  : null,
                datetime:
                  answer.questionType === 'datetime' ? answer.value : null,
              })) || [],
            medication_type: formState.medicationType,
            medication_dosage: formState.medicationDosage,
            medication_frequency: formState.medicationFrequency,
            medication_notes:
              formState.medicationAnnotationContent === emptyHTMLeditorContent
                ? null
                : formState.medicationAnnotationContent,
            medication_completed: formState.medicationCourseCompleted,
            medication_started_at: formState.medicationCourseStartedAt,
            medication_completed_at: formState.medicationCourseCompletedAt,
            covid_test_date: formState.covidTestDate,
            covid_test_type: formState.covidTestType,
            covid_result: formState.covidTestResult,
            covid_reference: formState.covidTestReference,
            covid_antibody_test_date: formState.covidAntibodyTestDate,
            covid_antibody_test_type: formState.covidAntibodyTestType,
            covid_antibody_result: formState.covidAntibodyTestResult,
            covid_antibody_reference: formState.covidAntibodyTestReference,
            annotation_content:
              formState.annotationContent === emptyHTMLeditorContent
                ? null
                : formState.annotationContent,
            annotation_date: formState.annotationDate,
            attached_links: formState.queuedLinks,
            restrict_access_to: formState.restrictAccessTo,
            cpt_code: formState.cptCode ? formState.cptCode : null,
            is_billable: formState.isBillable,
            referring_physician: formState.referringPhysician,
            amount_charged: formState.amountCharged,
            discount: formState.discountOrReduction,
            amount_paid_insurance: formState.amountPaidInsurance,
            amount_due: formState.amountDue,
            amount_paid_athlete: formState.amountPaidAthlete,
            date_paid: formState.datePaidDate,
            // formState.redoxOrderStatus must be number to track, but payload must be boolean
            send_redox_order: formState.redoxOrderStatus === 1,
            billable_items: formState.queuedBillableItems.map(
              (billableItem) => ({
                cpt_code: billableItem.cptCode,
                is_billable: billableItem.isBillable,
                amount_charged: billableItem.amountCharged,
                discount: billableItem.discountOrReduction,
                amount_paid_insurance: billableItem.amountPaidInsurance,
                amount_due: billableItem.amountDue,
                amount_paid_athlete: billableItem.amountPaidAthlete,
                date_paid: billableItem.datePaidDate,
                referring_physician: formState.referringPhysician,
              })
            ),
            cardiac_screening: formState.diagnosticType?.cardiacScreening,
          },
        }),

        scope_to_org: true,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default saveDiagnostic;
