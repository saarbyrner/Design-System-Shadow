import $ from 'jquery';
import data from '@kitman/services/src/mocks/handlers/medical/procedures/data.mock';
import updateProcedure from '../updateProcedure';

describe('updateProcedure', () => {
  let updateProcedureRequest;

  const formState = {
    athleteId: 1,
    locationId: 1,
    queuedProcedures: [
      {
        procedureDate: '2022-12-05T12:41:20.000Z',
        procedureOrderDate: '2022-12-05T12:41:20.000Z',
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
    updateProcedureRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedProcedure));
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateProcedure(1, formState);
    expect(returnedData).toEqual(mockedProcedure);
    expect(updateProcedureRequest).toHaveBeenCalledTimes(1);

    expect(updateProcedureRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      contentType: 'application/json',
      url: `/medical/procedures/1`,
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
        procedure_type_id: formState.queuedProcedures[0].procedureId,
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
    });
  });
});
