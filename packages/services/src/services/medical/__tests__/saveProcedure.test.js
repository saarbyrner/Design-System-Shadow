import $ from 'jquery';
import data from '@kitman/services/src/mocks/handlers/medical/procedures/data.mock';
import saveProcedure from '../saveProcedure';

describe('saveProcedure', () => {
  let saveProcedureRequest;

  const formState = {
    athleteId: 1,
    locationId: 1,
    queuedProcedures: [
      {
        procedureDate: '2022-12-05T12:41:20.000Z',
        providerSgid: 'sgidnumber',
        otherProvider: null,
        bodyAreaId: 1,
        bodyAreaType: 'ClinicalImpressionBodyArea',
        procedureTypeId: 1,
        procedureTypeDescription: 'My Procedure Description 1',
        procedureReasonId: 2,
        otherReason: '',
        timing: 'during_game',
        otherTiming: '',
        duration: 30,
        totalAmount: 3.0,
        totalAmountUnit: 'ml',
        amountUsed: 4.0,
        amountUsedUnit: 'ml',
        urineSpecificGravity: 5.0,
        procedureComplicationIds: [1],
        otherComplication: null,
        illnessIds: [1, 2],
        injuryIds: [3, 4],
        chronicIssueIds: [5, 6],
        noteContent: null,
        queuedAttachments: [],
        linkTitle: '',
        linkUri: '',
        queuedLinks: [
          {
            title: 'rte.ie',
            uri: 'https://rte.ie',
            description: 'rte.ie',
          },
        ],
      },
    ],
  };

  const transformComplicationsPayload = (complicationsArray) => {
    const complications = new Set(complicationsArray);
    if (complications.has(-1)) {
      complications.delete(-1);
      return [...complications];
    }
    return [...complications];
  };

  const mockedProcedure = data.procedures[0];
  beforeEach(() => {
    const deferred = $.Deferred();
    saveProcedureRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedProcedure));
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveProcedure(formState);
    expect(returnedData).toEqual(mockedProcedure);
    expect(saveProcedureRequest).toHaveBeenCalledTimes(1);

    expect(saveProcedureRequest).toHaveBeenCalledWith({
      method: 'POST',
      contentType: 'application/json',
      url: `/medical/procedures/bulk_create`,
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
          procedure_type_id: procedure.procedureId,
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
          annotation_attributes: null,
          attachments_attributes: [
            ...procedure.queuedAttachments?.map((file) => ({
              original_filename: file.filename,
              filetype: file.fileType,
              filesize: file.fileSize,
            })),
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
    });
  });
});
