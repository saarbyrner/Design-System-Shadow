// @flow
import $ from 'jquery';
import type { FormState } from '@kitman/modules/src/Medical/shared/components/AddProcedureSidePanel/hooks/useProcedureForm';
import type { ProcedureResponseData } from '@kitman/modules/src/Medical/shared/types/medical';
import { transformFilesForUpload } from '@kitman/common/src/utils/fileHelper';

export type RequestResponse = Array<ProcedureResponseData>;

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

const saveProcedure = (formState: FormState): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/medical/procedures/bulk_create`,
      contentType: 'application/json',

      data: JSON.stringify({
        procedures: formState.queuedProcedures?.map((procedure) => ({
          athlete_id: formState.athleteId,
          location_id: formState.locationId,
          order_date: procedure.procedureOrderDate,
          procedure_date: procedure.procedureDate,
          provider_sgid:
            procedure.providerSgid === -1 ? null : procedure.providerSgid,
          other_provider: procedure.otherProvider,
          body_area_type: 'ClinicalImpressionBodyArea',
          body_area_id: procedure.bodyAreaId,
          procedure_type_id: procedure.procedureType?.value,
          procedure_type_description: procedure.procedureDescription,
          procedure_reason_id:
            procedure.procedureReason === -1 ? null : procedure.procedureReason,
          other_reason: procedure.procedureReasonOther,
          timing: procedure.procedureTiming,
          other_timing: procedure.procedureTimingOther,
          duration: procedure.procedureDuration,
          total_amount: procedure.procedureAmount,
          total_amount_unit: 'ml',
          amount_used: procedure.procedureAmountUsed,
          amount_used_unit: 'ml',
          urine_specific_gravity: procedure.procedureUrineGravity,
          procedure_complication_ids: transformComplicationsPayload(
            procedure.procedureComplicationIds
          ),
          other_complication: procedure.procedureComplicationOther,
          issues: [
            ...procedure.injuryIds?.map((injuryId) => ({
              issue_type: 'InjuryOccurrence',
              issue_id: injuryId,
            })),
            ...procedure.illnessIds?.map((illnessId) => ({
              issue_type: 'IllnessOccurrence',
              issue_id: illnessId,
            })),
            ...procedure.chronicIssueIds?.map((chronicId) => ({
              issue_type: 'Emr::Private::Models::ChronicIssue',
              issue_id: chronicId,
            })),
          ],
          annotation_attributes: procedure.noteContent
            ? {
                content: procedure.noteContent,
              }
            : null,
          attachments_attributes: [
            ...transformFilesForUpload(procedure.queuedAttachments),
          ],
          attached_links: [
            ...procedure.queuedLinks?.map((link) => ({
              title: link.title,
              uri: link.uri,
              description: link.title,
            })),
          ],
        })),
      }),
    })
      .done((response) => resolve(response))
      .fail(reject);
  });
};

export default saveProcedure;
