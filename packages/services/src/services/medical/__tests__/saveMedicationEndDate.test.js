import $ from 'jquery';
import { mockedMedicationDiagnosticContextValue } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import { data as mockedEndDateDiagnostic } from '../../../mocks/handlers/medical/saveMedicationEndDate';
import saveMedicationEndDate from '../saveMedicationEndDate';

describe('saveDiagnostics', () => {
  let saveMedicationEndDateRequest;
  const formState = {
    annotationContent: null,
    athleteId: null,
    covidAntibodyTestDate: null,
    covidAntibodyTestReference: null,
    covidAntibodyTestResult: null,
    covidAntibodyTestType: null,
    covidTestDate: null,
    covidTestReference: null,
    covidTestResult: null,
    covidTestType: null,
    diagnosticDate: null,
    diagnosticType: null,
    illnessIds: [],
    injuryIds: [],
    userId: null,
    medicationAnnotationContent: null,
    medicationCourseCompleted: true,
    medicationCourseCompletedAt: '2022-07-24T23:00:00Z',
    medicationCourseStartedAt: null,
    medicationDosage: null,
    medicationFrequency: null,
    medicationType: null,
    queuedAttachmentTypes: null,
    restrictAccessTo: null,
  };

  const athleteId =
    mockedMedicationDiagnosticContextValue.diagnostic.athlete.id;
  const diagnosticId = mockedMedicationDiagnosticContextValue.diagnostic.id;
  const startDate =
    mockedMedicationDiagnosticContextValue.diagnostic.medical_meta.start_date;
  const diagnosticDate =
    mockedMedicationDiagnosticContextValue.diagnostic.medical_meta
      .diagnostic_date;

  beforeEach(() => {
    const deferred = $.Deferred();

    saveMedicationEndDateRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedEndDateDiagnostic));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveMedicationEndDate(
      athleteId,
      diagnosticId,
      startDate,
      diagnosticDate,
      formState
    );
    expect(returnedData).toEqual(mockedEndDateDiagnostic);

    expect(saveMedicationEndDateRequest).toHaveBeenCalledTimes(1);
    expect(saveMedicationEndDateRequest).toHaveBeenCalledWith({
      method: 'POST',
      contentType: 'application/json',
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': undefined,
      },
      url: `/athletes/${athleteId}/diagnostics/${diagnosticId}/medication_complete`,
      data: JSON.stringify({
        diagnostic: {
          diag_date: diagnosticDate,
          medication_completed: formState.medicationCourseCompleted,
          medication_started_at: startDate,
          medication_completed_at: formState.medicationCourseCompletedAt,
        },
      }),
    });
  });
});
