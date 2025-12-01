// @flow
import $ from 'jquery';
import type { FormState } from '@kitman/modules/src/Medical/shared/components/AddProcedureSidePanel/hooks/useProcedureForm';
import type { ProcedureResponseData } from '@kitman/modules/src/Medical/shared/types/medical';

/**
 * For multiple drop-downs we allow the user to select 'Other' which is given a value of -1 in formState
 * We want to intercept that, and transform to 'null' for Procedure Complications [array]
 */
const transformComplicationsPayload = (complicationsArray) => {
  const complications = new Set(complicationsArray);
  if (complications.has(-1)) {
    complications.delete(-1);
    return [...complications];
  }
  return [...complications];
};

/**
 * First item in formState.queuedProcedures[] will always be the single Procedure we are updating
 * in current implementation
 * TODO: Change for in-place editing
 *  */
const updateProcedure = (
  procedureId: number,
  formState: FormState
): Promise<ProcedureResponseData> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `/medical/procedures/${procedureId}`,
      contentType: 'application/json',

      data: JSON.stringify({
        athlete_id: formState.athleteId,
        location_id: formState.locationId,
        order_date: formState.queuedProcedures[0].procedureOrderDate,
        procedure_date: formState.queuedProcedures[0].procedureDate,
        provider_sgid:
          formState.queuedProcedures[0].providerSgid === -1
            ? null
            : formState.queuedProcedures[0].providerSgid,
        other_provider: formState.queuedProcedures[0].otherProvider,
        body_area_type: 'ClinicalImpressionBodyArea',
        body_area_id: formState.queuedProcedures[0].bodyAreaId,
        procedure_type_id: formState.queuedProcedures[0].procedureType?.value,
        procedure_type_description:
          formState.queuedProcedures[0].procedureDescription,
        procedure_reason_id:
          formState.queuedProcedures[0].procedureReason === -1
            ? null
            : formState.queuedProcedures[0].procedureReason,
        other_reason: formState.queuedProcedures[0].procedureReasonOther,
        timing: formState.queuedProcedures[0].procedureTiming,
        other_timing: formState.queuedProcedures[0].procedureTimingOther,
        duration: formState.queuedProcedures[0].procedureDuration,
        total_amount: formState.queuedProcedures[0].procedureAmount,
        total_amount_unit: 'ml',
        amount_used: formState.queuedProcedures[0].procedureAmountUsed,
        amount_used_unit: 'ml',
        urine_specific_gravity:
          formState.queuedProcedures[0].procedureUrineGravity,
        procedure_complication_ids: transformComplicationsPayload(
          formState.queuedProcedures[0].procedureComplicationIds
        ),
        other_complication:
          formState.queuedProcedures[0].procedureComplicationOther,
        issues: [
          ...formState.queuedProcedures[0].injuryIds?.map((injuryId) => ({
            issue_type: 'InjuryOccurrence',
            issue_id: injuryId,
          })),
          ...formState.queuedProcedures[0].illnessIds?.map((illnessId) => ({
            issue_type: 'IllnessOccurrence',
            issue_id: illnessId,
          })),
          ...formState.queuedProcedures[0].chronicIssueIds?.map(
            (chronicId) => ({
              issue_type: 'Emr::Private::Models::ChronicIssue',
              issue_id: chronicId,
            })
          ),
        ],
      }),
    })
      .done((response) => resolve(response))
      .fail(reject);
  });
};

export default updateProcedure;
