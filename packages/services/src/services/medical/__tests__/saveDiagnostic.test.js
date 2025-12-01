import $ from 'jquery';
import { data as mockedDiagnostic } from '../../../mocks/handlers/medical/saveDiagnostic';
import saveDiagnostic from '../saveDiagnostic';

describe('saveDiagnostics', () => {
  let saveDiagnosticRequest;
  const formState = {
    queuedDiagnostics: [
      {
        diagnosticType: { id: 231, label: 'test' },
        attachment_ids: [123, 321, 666, 999],
        laterality: 2,
        provider_sgid: 21093847,
        diag_date: '2022-06-03T00:00:00+01:00',
        appointment_date: '2022-06-04T00:00:00+01:00',
        attached_links: [],
        annotation_content: null,
      },
      {
        attachment_ids: [90210],
        laterality: 1,
        provider_sgid: 666,
        diag_date: '2022-07-03T00:00:00+01:00',
        appointment_date: '2022-07-14T00:00:00+01:00',
        attached_links: [{ title: 'link title', uri: 'www.fakeuri.com' }],
        annotation_content: 'content',
      },
    ],
    annotationContent: null,
    athleteId: 28101,
    covidAntibodyTestDate: null,
    covidAntibodyTestReference: null,
    covidAntibodyTestResult: null,
    covidAntibodyTestType: null,
    covidTestDate: null,
    covidTestReference: null,
    covidTestResult: null,
    covidTestType: null,
    diagnosticDate: '2022-06-03T00:00:00+01:00',
    diagnosticType: { label: '3D Analysis', value: 19 },
    illnessIds: [],
    injuryIds: [77312],
    userId: 453522,
    medicationAnnotationContent: null,
    medicationCourseCompleted: false,
    medicationCourseCompletedAt: null,
    medicationDosage: null,
    medicationFrequency: null,
    medicationType: null,
    queuedAttachmentTypes: ['FILE'],
    restrictAccessTo: 'DEFAULT',
    cptCode: 'ABC27',
    isBillable: true,
    referringPhysician: 'Test Physician',
    amountCharged: 200,
    discountOrReduction: 50,
    amountPaidInsurance: 100,
    amountDue: 150,
    amountPaidAthlete: 50,
    datePaidDate: '2022-06-04T00:00:00+01:00',
    redoxOrderStatus: false,
    queuedBillableItems: [
      {
        cptCode: 'ABC27',
        isBillable: true,
        referringPhysician: 'Test Physician',
        amountCharged: 200,
        discountOrReduction: 50,
        amountPaidInsurance: 100,
        amountDue: 150,
        amountPaidAthlete: 50,
        datePaidDate: '2022-06-04T00:00:00+01:00',
      },
    ],
  };
  const attachmentIds = [32185, 58493];

  beforeEach(() => {
    const deferred = $.Deferred();

    saveDiagnosticRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedDiagnostic));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveDiagnostic(formState, attachmentIds);
    expect(returnedData).toEqual(mockedDiagnostic);

    expect(saveDiagnosticRequest).toHaveBeenCalledTimes(1);
    expect(saveDiagnosticRequest).toHaveBeenCalledWith({
      method: 'POST',
      contentType: 'application/json',
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': undefined,
      },
      url: `/athletes/${formState.athleteId}/diagnostics`,
      data: JSON.stringify({
        diagnostic: {
          attachment_ids: attachmentIds,
          diagnostic_type_id: formState.diagnosticType.value,
          location_id: formState.locationId,
          prescriber_id: formState.userId,
          diagnostic_reason_id: formState.reasonId,
          diag_date: formState.diagnosticDate,
          injury_ids: formState.injuryIds,
          illness_ids: formState.illnessIds,
          diagnostic_type_answers: [],
          medication_type: formState.medicationType,
          medication_dosage: formState.medicationDosage,
          medication_frequency: formState.medicationFrequency,
          medication_notes: formState.medicationAnnotationContent,
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
          annotation_content: formState.annotationContent,
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
          send_redox_order: false,
          billable_items: [
            {
              cpt_code: formState.queuedBillableItems[0].cptCode,
              is_billable: formState.queuedBillableItems[0].isBillable,
              amount_charged: formState.queuedBillableItems[0].amountCharged,
              discount: formState.queuedBillableItems[0].discountOrReduction,
              amount_paid_insurance:
                formState.queuedBillableItems[0].amountPaidInsurance,
              amount_due: formState.queuedBillableItems[0].amountDue,
              amount_paid_athlete:
                formState.queuedBillableItems[0].amountPaidAthlete,
              date_paid: formState.queuedBillableItems[0].datePaidDate,
              referring_physician: formState.referringPhysician,
            },
          ],
        },
        scope_to_org: true,
      }),
    });
  });
  it('calls the correct endpoint and returns the correct value when multi order', async () => {
    const returnedData = await saveDiagnostic(formState, attachmentIds, true);
    expect(returnedData).toEqual(mockedDiagnostic);

    expect(saveDiagnosticRequest).toHaveBeenCalledTimes(1);
    expect(saveDiagnosticRequest).toHaveBeenCalledWith({
      method: 'POST',
      contentType: 'application/json',
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': undefined,
      },
      url: `/athletes/${formState.athleteId}/diagnostics`,
      data: JSON.stringify({
        diagnostics: formState.queuedDiagnostics.map((diagnostic) => ({
          diagnostic_type_id: diagnostic.diagnosticType?.id,
          attachment_ids:
            diagnostic.queuedAttachments &&
            diagnostic.queuedAttachments === null
              ? []
              : diagnostic.queuedAttachments,
          laterality: diagnostic.lateralityId,
          provider_sgid: diagnostic.orderProviderSGID,
          diag_date: diagnostic.appointmentDate,
          order_date: diagnostic.diagnosticDate,
          attached_links: diagnostic.queuedLinks,
          annotation_content: diagnostic.annotationContent,
          send_redox_order: formState.redoxOrderStatus === 1,
          diagnostic_reason_id: formState.reasonId,
          location_id: formState.locationId,
          injury_ids: formState.injuryIds,
          illness_ids: formState.illnessIds,
          diagnostic_type_answers:
            diagnostic?.answers?.map((answer) => ({
              diagnostic_type_question_id: answer.questionTypeId,
              diagnostic_type_question_choice_id:
                answer.questionType === 'choice' ? answer.value : null,
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
        })),
        scope_to_org: true,
      }),
    });
  });
});
