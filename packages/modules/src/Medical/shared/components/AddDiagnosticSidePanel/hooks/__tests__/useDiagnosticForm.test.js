import { renderHook, act } from '@testing-library/react-hooks';
import useDiagnosticForm, { initialFormState } from '../useDiagnosticForm';

describe('useDiagnosticForm', () => {
  it('returns correct state on SET_DIAGNOSTIC_TYPE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.diagnosticType).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_DIAGNOSTIC_TYPE',
        diagnosticType: { label: '3D Analysis', value: 19 },
      });
    });

    expect(result.current.formState.diagnosticType.label).toEqual(
      '3D Analysis'
    );
  });

  it('returns correct state on SET_DIAGNOSTIC_TYPE_GROUP_SET', () => {
    const mockDiagnosticGroupSets = [
      {
        id: 1,
        name: 'Mock group set',
        diagnostic_types: [
          {
            id: 19,
            name: '3D Analysis ',
          },
          {
            id: 49,
            name: 'Answer from Radiologist ',
          },
          {
            id: 20,
            name: 'Arthroscope ',
          },
        ],
      },
      {
        id: 2,
        name: 'Another mock type set',
        diagnostic_types: [
          {
            id: 14,
            name: 'Arthroscopic Surgery ',
          },
          {
            id: 65,
            name: 'AT18',
          },
        ],
      },
    ];
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.diagnosticType).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_DIAGNOSTIC_TYPE_GROUP_SET',
        diagnosticTypeGroupSet: mockDiagnosticGroupSets,
      });
    });

    const mockedAppliedQueuedDiagnostics = mockDiagnosticGroupSets.map(
      (diagnosticType, index) => {
        return {
          key: index + 1,
          diagnosticType,
          diagnosticTypes: [],
          athleteId: null,
          orderProviderSGID: null,
          userId: null,
          locationId: null,
          reasonId: null,
          bodyAreaId: null,
          diagnosticDate: null,
          orderDate: null,
          illnessIds: [],
          injuryIds: [],
          annotationContent: '',
          restrictAccessTo: 'DEFAULT',
          queuedAttachments: [],
          queuedAttachmentTypes: [],
          linkTitle: '',
          linkUri: '',
          queuedLinks: [],
          lateralityId: null,
          answers: [],
        };
      }
    );

    expect(result.current.formState.queuedDiagnostics).toEqual(
      mockedAppliedQueuedDiagnostics
    );
  });
  it('set answers on diagnostics if question exist', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.diagnosticType).toEqual(null);
    // add a diagnostic with questions
    act(() => {
      dispatch({
        type: 'SET_MULTI_ORDER_TYPE',
        index: 2,
        diagnosticType: {
          value: '3D Analysis',
          diagnostic_type_questions: [
            {
              answerIndex: 1,
              questionTypeId: 6,
              questionType: 'choice',
              value: null,
              optionalTextRequired: null,
              label: 'Choice type question label',
              required: false,
            },
          ],
        },
      });
    });

    expect(
      result.current.formState.queuedDiagnostics[2].diagnosticType.value
    ).toEqual('3D Analysis');
  });

  it('returns correct state on SET_DIAGNOSTIC_TYPE_ANSWER', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.diagnosticType).toEqual(null);
    // add a diagnostic with questions
    act(() => {
      dispatch({
        type: 'SET_DIAGNOSTIC_TYPE_ANSWER',
        diagnosticIndex: 0,
        answer: {
          answerIndex: 1,
          questionTypeId: 4,
          questionType: 'text',
          value: 'Mock text question value',
          optionalTextRequired: false,
          label: 'This is a text type question',
          required: true,
        },
      });
    });

    expect(
      result.current.formState.queuedDiagnostics[0].answers[1].value
    ).toEqual('Mock text question value');
  });
  it('returns correct state on SET_OPTIONAL_TEXT_ANSWER', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.diagnosticType).toEqual(null);
    // add a diagnostic with questions
    act(() => {
      dispatch({
        type: 'SET_OPTIONAL_TEXT_ANSWER',
        diagnosticIndex: 0,
        answer: {
          answerIndex: 1,
          questionTypeId: 4,
          optionalText: 'Mock optional text value',
          optionalTextRequired: true,
        },
      });
    });

    expect(
      result.current.formState.queuedDiagnostics[0].answers[1].optionalText
    ).toEqual('Mock optional text value');
  });
  it('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.athleteId).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: 123,
      });
    });
    expect(result.current.formState.athleteId).toEqual(123);
  });

  it('returns correct state on SET_USER_ID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.userId).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_USER_ID',
        userId: 321,
      });
    });
    expect(result.current.formState.userId).toEqual(321);
  });

  it('returns correct state on SET_ORDER_PROVIDER_SGID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.userId).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_ORDER_PROVIDER_SGID',
        orderProviderSGID: 90210,
      });
    });
    expect(result.current.formState.orderProviderSGID).toEqual(90210);
  });

  it('returns correct state on SET_REFERRING_PHYSICIAN', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.referringPhysician).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_REFERRING_PHYSICIAN',
        referringPhysician: 'Mrs Test Physician',
      });
    });
    expect(result.current.formState.referringPhysician).toEqual(
      'Mrs Test Physician'
    );
  });
  it('returns correct state on SET_LOCATION_ID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.locationId).toEqual(null);

    act(() =>
      dispatch({
        type: 'SET_LOCATION_ID',
        locationId: 666,
      })
    );
    expect(result.current.formState.locationId).toEqual(666);
  });
  it('returns correct state on SET_REDOX_ORDER_STATUS', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.redoxOrderStatus).toEqual(0);

    act(() =>
      dispatch({
        type: 'SET_REDOX_ORDER_STATUS',
        redoxOrderStatus: 1,
      })
    );
    expect(result.current.formState.redoxOrderStatus).toEqual(1);
  });
  it('returns correct state on SET_MULTI_LOCATION_ID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    // need to check these sates don't get wiped
    expect(formState.athleteId).toEqual(null);
    expect(formState.reasonId).toEqual(null);
    expect(formState.illnessIds).toEqual([]);
    expect(formState.injuryIds).toEqual([]);
    act(() => {});

    act(() => {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: 123,
      });
    });
    act(() => {
      dispatch({
        type: 'SET_REASON_ID',
        reasonId: 12,
      });
    });
    act(() => {
      dispatch({
        type: 'SET_ILLNESS_IDS',
        illnessIds: [1, 2, 3],
      });
    });
    act(() => {
      dispatch({
        type: 'SET_INJURY_IDS',
        injuryIds: [1, 2, 3],
      });
    });

    expect(formState.locationId).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_MULTI_LOCATION_ID',
        locationId: 666,
      });
    });

    expect(result.current.formState.locationId).toEqual(666);
    act(() => {
      dispatch({
        type: 'SET_MULTI_LOCATION_ID',
        locationId: 999,
      });
    });
    expect(result.current.formState.locationId).toEqual(999);

    const redoxDiagnostics = result.current.formState.queuedDiagnostics[0];
    expect(redoxDiagnostics.diagnosticType).toEqual(null);
    expect(redoxDiagnostics.orderProviderSGID).toEqual(null);
    expect(redoxDiagnostics.locationId).toEqual(999);

    // ensuring that changing locationId doesn't clear below states
    expect(result.current.formState.athleteId).toEqual(123);
    expect(result.current.formState.reasonId).toEqual(12);
    expect(result.current.formState.injuryIds).toEqual([1, 2, 3]);
    expect(result.current.formState.illnessIds).toEqual([1, 2, 3]);
  });

  it('returns correct state on SET_REASON_ID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.reasonId).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_REASON_ID',
        reasonId: 12,
      });
    });
    expect(result.current.formState.reasonId).toEqual(12);
  });

  it('returns correct state on SET_BODY_AREA_ID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.bodyAreaId).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_BODY_AREA_ID',
        bodyAreaId: 999,
      });
    });
    expect(result.current.formState.bodyAreaId).toEqual(999);
  });

  it('returns correct state on SET_DIAGNOSTIC_DATE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.diagnosticDate).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_DIAGNOSTIC_DATE',
        diagnosticDate: '15-04-2022',
      });
    });
    expect(result.current.formState.diagnosticDate).toEqual('15-04-2022');
  });

  it('returns correct state on SET_ILLNESS_IDS', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.illnessIds).toEqual([]);
    act(() => {
      dispatch({
        type: 'SET_ILLNESS_IDS',
        illnessIds: [1, 2, 3],
      });
    });
    expect(result.current.formState.illnessIds).toEqual([1, 2, 3]);
  });

  it('returns correct state on SET_INJURY_IDS', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.injuryIds).toEqual([]);
    act(() => {
      dispatch({
        type: 'SET_INJURY_IDS',
        injuryIds: [1, 2, 3],
      });
    });
    expect(result.current.formState.injuryIds).toEqual([1, 2, 3]);
  });

  it('returns correct state on SET_COVID_TEST_DATE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.covidTestDate).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_COVID_TEST_DATE',
        covidTestDate: '15-04-2022',
      });
    });
    expect(result.current.formState.covidTestDate).toEqual('15-04-2022');
  });

  it('returns correct state on SET_COVID_TEST_TYPE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.covidTestType).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_COVID_TEST_TYPE',
        covidTestType: 'PCR',
      });
    });
    expect(result.current.formState.covidTestType).toEqual('PCR');
  });

  it('returns correct state on SET_COVID_TEST_RESULT', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.covidTestResult).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_COVID_TEST_RESULT',
        covidTestResult: 'Negative',
      });
    });
    expect(result.current.formState.covidTestResult).toEqual('Negative');
  });

  it('returns correct state on SET_COVID_TEST_REFERENCE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.covidTestReference).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_COVID_TEST_REFERENCE',
        covidTestReference: 'Test Reference',
      });
    });
    expect(result.current.formState.covidTestReference).toEqual(
      'Test Reference'
    );
  });

  it('returns correct state on SET_COVID_ANTIBODY_TEST_DATE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.covidAntibodyTestDate).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_COVID_ANTIBODY_TEST_DATE',
        covidAntibodyTestDate: '15-04-2022',
      });
    });
    expect(result.current.formState.covidAntibodyTestDate).toEqual(
      '15-04-2022'
    );
  });

  it('returns correct state on SET_COVID_ANTIBODY_TEST_TYPE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.covidAntibodyTestType).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_COVID_ANTIBODY_TEST_TYPE',
        covidAntibodyTestType: 'PCR',
      });
    });
    expect(result.current.formState.covidAntibodyTestType).toEqual('PCR');
  });

  it('returns correct state on SET_COVID_ANTIBODY_TEST_RESULT', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.covidAntibodyTestResult).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_COVID_ANTIBODY_TEST_RESULT',
        covidAntibodyTestResult: 'Postive',
      });
    });
    expect(result.current.formState.covidAntibodyTestResult).toEqual('Postive');
  });

  it('returns correct state on SET_COVID_ANTIBODY_TEST_REFERENCE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.covidAntibodyTestReference).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_COVID_ANTIBODY_TEST_REFERENCE',
        covidAntibodyTestReference: 'Test Antibody Reference',
      });
    });
    expect(result.current.formState.covidAntibodyTestReference).toEqual(
      'Test Antibody Reference'
    );
  });

  it('returns correct state on SET_MEDICATION_TYPE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.medicationType).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_MEDICATION_TYPE',
        medicationType: 'Panadol',
      });
    });
    expect(result.current.formState.medicationType).toEqual('Panadol');
  });

  it('returns correct state on SET_MEDICATION_DOSAGE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.medicationDosage).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_MEDICATION_DOSAGE',
        medicationDosage: '2',
      });
    });
    expect(result.current.formState.medicationDosage).toEqual('2');
  });

  it('returns correct state on SET_MEDICATION_FREQUENCY', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.medicationFrequency).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_MEDICATION_FREQUENCY',
        medicationFrequency: '4',
      });
    });
    expect(result.current.formState.medicationFrequency).toEqual('4');
  });

  it('returns correct state on SET_MEDICATION_COURSE_COMPLETED', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.medicationCourseCompleted).toEqual(false);
    act(() => {
      dispatch({
        type: 'SET_MEDICATION_COURSE_COMPLETED',
        medicationCourseCompleted: true,
      });
    });
    expect(result.current.formState.medicationCourseCompleted).toEqual(true);
  });

  it('returns correct state on SET_MEDICATION_NOTE_CONTENT', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.medicationAnnotationContent).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_MEDICATION_NOTE_CONTENT',
        medicationAnnotationContent: 'Test Note',
      });
    });
    expect(result.current.formState.medicationAnnotationContent).toEqual(
      'Test Note'
    );
  });

  it('returns correct state on SET_NOTE_CONTENT', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.annotationContent).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_NOTE_CONTENT',
        annotationContent: 'Test Note 123',
      });
    });
    expect(result.current.formState.annotationContent).toEqual('Test Note 123');
  });

  it('returns correct state on SET_NOTE_VISIBILITY', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.restrictAccessTo).toEqual('DEFAULT');
    act(() => {
      dispatch({
        type: 'SET_NOTE_VISIBILITY',
        noteVisibilityId: 'DOCTORS',
      });
    });
    expect(result.current.formState.restrictAccessTo).toEqual('DOCTORS');
  });

  it('returns correct state on SET_CPT_CODE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.cptCode).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_CPT_CODE',
        cptCode: '123AB',
      });
    });
    expect(result.current.formState.cptCode).toEqual('123AB');
  });

  it('returns correct state on SET_IS_BILLABLE when setting to true', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.isBillable).toEqual(false);
    expect(result.current.formState.amountPaidInsurance).toEqual('0');
    expect(result.current.formState.amountPaidAthlete).toEqual('0');
    act(() => {
      dispatch({
        type: 'SET_IS_BILLABLE',
        isBillable: true,
      });
    });
    expect(result.current.formState.isBillable).toEqual(true);
    expect(result.current.formState.amountPaidInsurance).toEqual('0');
    expect(result.current.formState.amountPaidAthlete).toEqual('0');
  });

  it('returns correct state on SET_IS_BILLABLE when setting to false', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    act(() => {
      dispatch({
        type: 'SET_IS_BILLABLE',
        isBillable: true,
      });
    });
    act(() => {
      dispatch({
        type: 'SET_AMOUNT_PAID_INSURANCE',
        amountPaidInsurance: '20',
      });
    });
    act(() => {
      dispatch({
        type: 'SET_AMOUNT_PAID_ATHLETE',
        amountPaidAthlete: '30',
      });
    });

    expect(result.current.formState.isBillable).toEqual(true);
    expect(result.current.formState.amountPaidInsurance).toEqual('20');
    expect(result.current.formState.amountPaidAthlete).toEqual('30');
    act(() => {
      dispatch({
        type: 'SET_IS_BILLABLE',
        isBillable: false,
      });
    });
    expect(result.current.formState.isBillable).toEqual(false);
    expect(result.current.formState.amountPaidInsurance).toEqual('');
    expect(result.current.formState.amountPaidAthlete).toEqual('');
  });

  it('returns correct state on SET_AMOUNT_CHARGED', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.amountCharged).toEqual('0');
    act(() => {
      dispatch({
        type: 'SET_AMOUNT_CHARGED',
        amountCharged: '2000',
      });
    });
    expect(result.current.formState.amountCharged).toEqual('2000');
  });

  it('returns correct state on SET_DISCOUNT_OR_REDUCTION', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.discountOrReduction).toEqual('0');
    act(() => {
      dispatch({
        type: 'SET_DISCOUNT_OR_REDUCTION',
        discountOrReduction: '50',
      });
    });
    expect(result.current.formState.discountOrReduction).toEqual('50');
  });

  it('returns correct state on SET_AMOUNT_PAID_INSURANCE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.amountPaidInsurance).toEqual('0');
    act(() => {
      dispatch({
        type: 'SET_AMOUNT_PAID_INSURANCE',
        amountPaidInsurance: '20',
      });
    });
    expect(result.current.formState.amountPaidInsurance).toEqual('20');
  });

  it('returns correct state on SET_AMOUNT_DUE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.amountDue).toEqual('0');
    act(() => {
      dispatch({
        type: 'SET_AMOUNT_DUE',
        amountDue: '100',
      });
    });
    expect(result.current.formState.amountDue).toEqual('100');
  });

  it('returns correct state on SET_DATE_PAID_DATE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.datePaidDate).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_DATE_PAID_DATE',
        datePaidDate: '29-08-2022',
      });
    });
    expect(result.current.formState.datePaidDate).toEqual('29-08-2022');
  });

  it('returns correct state on SET_ANNOTATION_DATE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.annotationDate).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_ANNOTATION_DATE',
        annotationDate: '2025-06-15T18:00:00Z',
      });
    });
    expect(result.current.formState.annotationDate).toEqual(
      '2025-06-15T18:00:00Z'
    );
  });

  it('returns correct state on SET_AMOUNT_PAID_ATHLETE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.amountPaidAthlete).toEqual('0');
    act(() => {
      dispatch({
        type: 'SET_AMOUNT_PAID_ATHLETE',
        amountPaidAthlete: '10',
      });
    });
    expect(result.current.formState.amountPaidAthlete).toEqual('10');
  });

  it('returns correct state on SET_MULTI_CPT_CODE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });

    expect(result.all[1].formState.queuedBillableItems[0].cptCode).toEqual('');
    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_CPT_CODE',
        cptCode: '123AB',
      });
    });
    expect(result.all[2].formState.queuedBillableItems[0].cptCode).toEqual(
      '123AB'
    );
  });

  it('returns correct state on SET_MULTI_IS_BILLABLE when setting to true', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });

    expect(result.all[1].formState.queuedBillableItems[0].isBillable).toEqual(
      false
    );
    expect(
      result.all[1].formState.queuedBillableItems[0].amountPaidInsurance
    ).toEqual('0');
    expect(
      result.all[1].formState.queuedBillableItems[0].amountPaidAthlete
    ).toEqual('0');
    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_IS_BILLABLE',
        isBillable: true,
      });
    });
    expect(result.all[2].formState.queuedBillableItems[0].isBillable).toEqual(
      true
    );
    expect(
      result.all[2].formState.queuedBillableItems[0].amountPaidInsurance
    ).toEqual('0');
    expect(
      result.all[2].formState.queuedBillableItems[0].amountPaidAthlete
    ).toEqual('0');
  });

  it('returns correct state on SET_MULTI_IS_BILLABLE when setting to false', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });
    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_IS_BILLABLE',
        isBillable: true,
      });
    });
    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_AMOUNT_PAID_INSURANCE',
        amountPaidInsurance: '20',
      });
    });
    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_AMOUNT_PAID_ATHLETE',
        amountPaidAthlete: '30',
      });
    });

    expect(result.all[4].formState.queuedBillableItems[0].isBillable).toEqual(
      true
    );
    expect(
      result.all[4].formState.queuedBillableItems[0].amountPaidInsurance
    ).toEqual('20');
    expect(
      result.all[4].formState.queuedBillableItems[0].amountPaidAthlete
    ).toEqual('30');
    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_IS_BILLABLE',
        isBillable: false,
      });
    });

    expect(result.all[5].formState.queuedBillableItems[0].isBillable).toEqual(
      false
    );
    expect(
      result.all[5].formState.queuedBillableItems[0].amountPaidInsurance
    ).toEqual('0');
    expect(
      result.all[5].formState.queuedBillableItems[0].amountPaidAthlete
    ).toEqual('0');
  });

  it('returns correct state on SET_MULTI_AMOUNT_CHARGED', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });

    expect(
      result.all[1].formState.queuedBillableItems[0].amountCharged
    ).toEqual('0');
    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_AMOUNT_CHARGED',
        amountCharged: '2000',
      });
    });
    expect(
      result.all[2].formState.queuedBillableItems[0].amountCharged
    ).toEqual('2000');
  });

  it('returns correct state on SET_MULTI_DISCOUNT_OR_REDUCTION', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });

    expect(
      result.all[1].formState.queuedBillableItems[0].discountOrReduction
    ).toEqual('0');
    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_DISCOUNT_OR_REDUCTION',
        discountOrReduction: '50',
      });
    });
    expect(
      result.all[2].formState.queuedBillableItems[0].discountOrReduction
    ).toEqual('50');
  });

  it('returns correct state on SET_MULTI_AMOUNT_PAID_INSURANCE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });

    expect(
      result.all[1].formState.queuedBillableItems[0].amountPaidInsurance
    ).toEqual('0');
    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_AMOUNT_PAID_INSURANCE',
        amountPaidInsurance: '20',
      });
    });
    expect(
      result.all[2].formState.queuedBillableItems[0].amountPaidInsurance
    ).toEqual('20');
  });

  it('returns correct state on SET_MULTI_AMOUNT_DUE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });

    expect(result.all[1].formState.queuedBillableItems[0].amountDue).toEqual(
      '0'
    );
    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_AMOUNT_DUE',
        amountDue: '100',
      });
    });
    expect(result.all[2].formState.queuedBillableItems[0].amountDue).toEqual(
      '100'
    );
  });

  it('returns correct state on SET_MULTI_DATE_PAID_DATE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });

    expect(result.all[1].formState.queuedBillableItems[0].datePaidDate).toEqual(
      null
    );

    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_DATE_PAID_DATE',
        datePaidDate: '29-08-2022',
      });
    });
    expect(result.all[2].formState.queuedBillableItems[0].datePaidDate).toEqual(
      '29-08-2022'
    );
  });

  it('returns correct state on SET_MULTI_AMOUNT_PAID_ATHLETE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });

    expect(
      result.all[1].formState.queuedBillableItems[0].amountPaidAthlete
    ).toEqual('0');

    act(() => {
      dispatch({
        index: 0,
        type: 'SET_MULTI_AMOUNT_PAID_ATHLETE',
        amountPaidAthlete: '10',
      });
    });
    expect(
      result.all[2].formState.queuedBillableItems[0].amountPaidAthlete
    ).toEqual('10');
  });

  it('returns correct state on REMOVE_MULTI_CPT', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;

    expect(result.all[0].formState.queuedBillableItems.length).toEqual(0);
    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });

    expect(result.all[1].formState.queuedBillableItems.length).toEqual(1);

    act(() => {
      dispatch({
        type: 'REMOVE_MULTI_CPT',
        index: 0,
      });
    });
    expect(result.all[2].formState.queuedBillableItems.length).toEqual(0);
  });
  it('returns correct state on REMOVE_MULTI_CPT_ON_OVERVIEW', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;

    expect(result.all[0].formState.queuedBillableItems.length).toEqual(0);
    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_BILLABLE_ITEM',
      });
    });

    expect(result.all[1].formState.queuedBillableItems.length).toEqual(1);
    expect(result.all[1].formState.queuedBillableItems[0].isDeleted).toEqual(
      false
    );

    act(() => {
      dispatch({
        type: 'REMOVE_MULTI_CPT_ON_OVERVIEW',
        index: 0,
      });
    });
    expect(result.all[2].formState.queuedBillableItems[0].isDeleted).toEqual(
      true
    );
    expect(result.all[2].formState.queuedBillableItems.length).toEqual(1);
  });

  it('returns correct state on UPDATE_QUEUED_ATTACHMENTS', () => {
    const files = [
      {
        lastModified: 1542706027020,
        lastModifiedDate: '2022-04-15T23:00:00Z',
        filename: 'sample.csv',
        fileSize: 124625,
        fileType: 'text/csv',
        webkitRelativePath: '',
      },
    ];

    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedAttachments).toEqual([]);
    act(() => {
      dispatch({
        type: 'UPDATE_QUEUED_ATTACHMENTS',
        queuedAttachments: files,
      });
    });
    expect(result.current.formState.queuedAttachments).toEqual(files);
  });

  it('returns correct state on UPDATE_ATTACHMENT_TYPE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedAttachmentTypes).toEqual([]);
    act(() => {
      dispatch({
        type: 'UPDATE_ATTACHMENT_TYPE',
        queuedAttachmentType: 'FILE',
      });
    });

    act(() => {
      dispatch({
        type: 'UPDATE_ATTACHMENT_TYPE',
        queuedAttachmentType: 'LINK',
      });
    });
    expect(result.current.formState.queuedAttachmentTypes).toEqual([
      'FILE',
      'LINK',
    ]);
  });

  it('returns correct state on REMOVE_ATTACHMENT_TYPE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    const testFile = { filename: 'test' };
    act(() => {
      dispatch({
        type: 'UPDATE_ATTACHMENT_TYPE',
        queuedAttachmentType: 'FILE',
      });
    });
    act(() => {
      dispatch({
        type: 'UPDATE_ATTACHMENT_TYPE',
        queuedAttachmentType: 'LINK',
      });
    });
    act(() => {
      dispatch({
        type: 'UPDATE_QUEUED_ATTACHMENTS',
        queuedAttachments: [testFile],
      });
    });
    expect(result.current.formState.queuedAttachments).toEqual([testFile]);
    expect(result.current.formState.queuedAttachmentTypes).toEqual([
      'FILE',
      'LINK',
    ]);
    act(() => {
      dispatch({
        type: 'REMOVE_ATTACHMENT_TYPE',
        queuedAttachmentType: 'FILE',
      });
    });
    expect(result.current.formState.queuedAttachmentTypes).toEqual(['LINK']);
    expect(result.current.formState.queuedAttachments).toEqual([]);

    act(() => {
      dispatch({
        type: 'REMOVE_ATTACHMENT_TYPE',
        queuedAttachmentType: 'LINK',
      });
    });
    expect(result.current.formState.queuedAttachmentTypes).toEqual([]);
  });

  it('returns correct state on REMOVE_MULTI_ATTACHMENT_TYPE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    const testFile = { filename: 'test' };
    act(() => {
      dispatch({
        type: 'UPDATE_MULTI_ATTACHMENT_TYPE',
        index: 0,
        queuedAttachmentType: 'FILE',
      });
    });
    act(() => {
      dispatch({
        type: 'UPDATE_MULTI_ATTACHMENT_TYPE',
        index: 0,
        queuedAttachmentType: 'LINK',
      });
    });
    act(() => {
      dispatch({
        type: 'UPDATE_MULTI_QUEUED_ATTACHMENTS',
        index: 0,
        queuedAttachments: [testFile],
      });
    });
    expect(
      result.current.formState.queuedDiagnostics[0].queuedAttachments
    ).toEqual([testFile]);
    expect(
      result.current.formState.queuedDiagnostics[0].queuedAttachmentTypes
    ).toEqual(['FILE', 'LINK']);
    act(() => {
      dispatch({
        type: 'REMOVE_MULTI_ATTACHMENT_TYPE',
        index: 0,
        queuedAttachmentType: 'FILE',
      });
    });
    expect(
      result.current.formState.queuedDiagnostics[0].queuedAttachmentTypes
    ).toEqual(['LINK']);
    expect(
      result.current.formState.queuedDiagnostics[0].queuedAttachments
    ).toEqual([]);

    act(() => {
      dispatch({
        type: 'REMOVE_MULTI_ATTACHMENT_TYPE',
        index: 0,
        queuedAttachmentType: 'LINK',
      });
    });
    expect(
      result.current.formState.queuedDiagnostics[0].queuedAttachmentTypes
    ).toEqual([]);
  });

  it('returns correct state on SET_LINK_URI', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.linkUri).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_LINK_URI',
        linkUri: 'www.thisisalink.com',
      });
    });
    expect(result.current.formState.linkUri).toEqual('www.thisisalink.com');
  });

  it('returns correct state on SET_LINK_TITLE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.linkTitle).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_LINK_TITLE',
        linkTitle: 'Link title',
      });
    });
    expect(result.current.formState.linkTitle).toEqual('Link title');
  });

  it('returns correct state on UPDATE_QUEUED_LINKS', () => {
    const links = [
      {
        title: 'Link title',
        uri: 'www.thisisalink',
      },
    ];

    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedLinks).toEqual([]);
    act(() => {
      dispatch({
        type: 'UPDATE_QUEUED_LINKS',
        queuedLinks: links,
      });
    });
    const updatedLinks = [
      {
        id: 0,
        title: 'Link title',
        uri: 'www.thisisalink',
      },
    ];
    expect(result.current.formState.queuedLinks).toEqual(updatedLinks);
  });

  it('returns correct state on CLEAR_LINK_ATTACHMENT', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    const links = [
      {
        title: 'Some title',
        uri: 'www.example.com',
      },
    ];

    dispatch({
      type: 'UPDATE_ATTACHMENT_TYPE',
      queuedAttachmentType: 'LINK',
    });
    dispatch({
      type: 'SET_LINK_TITLE',
      linkTitle: 'Some title',
    });
    dispatch({
      type: 'SET_LINK_URI',
      linkUri: 'www.example.com',
    });
    dispatch({
      type: 'UPDATE_QUEUED_LINKS',
      queuedLinks: links,
    });

    expect(result.current.formState.queuedAttachmentTypes).toEqual(['LINK']);
    expect(result.current.formState.linkTitle).toEqual('Some title');
    expect(result.current.formState.linkUri).toEqual('www.example.com');
    expect(result.current.formState.queuedLinks.length).toEqual(1);

    dispatch({
      type: 'CLEAR_LINK_ATTACHMENT',
    });

    expect(result.current.formState.queuedAttachmentTypes).toEqual([]);
    expect(result.current.formState.linkTitle).toEqual('');
    expect(result.current.formState.linkUri).toEqual('');
    expect(result.current.formState.queuedLinks).toEqual([]);
  });

  it('returns correct state on REMOVE_QUEUED_LINK', () => {
    const links = [
      {
        title: 'Link title',
        uri: 'www.thisisalink',
        id: 0,
      },
      {
        title: 'Second Link title',
        uri: 'www.thisisaSECONDlink',
        id: 1,
      },
    ];

    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedLinks).toEqual([]);
    act(() => {
      dispatch({
        type: 'UPDATE_QUEUED_LINKS',
        queuedLinks: links,
      });
    });
    expect(result.current.formState.queuedLinks).toEqual(links);
    act(() => {
      dispatch({
        type: 'REMOVE_QUEUED_LINK',
        id: 0,
      });
    });

    const updatedLinks = [
      {
        title: 'Second Link title',
        uri: 'www.thisisaSECONDlink',
        id: 1,
      },
    ];
    expect(result.current.formState.queuedLinks).toEqual(updatedLinks);
  });

  it('returns correct state on SET_LATERALITY', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.lateralityId).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_LATERALITY',
        lateralityId: 1,
      });
    });
    expect(result.current.formState.lateralityId).toEqual(1);
  });
  it('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState).toEqual(initialFormState);

    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_MULTI_ORDER',
      });
    });
    expect(result.current.formState.queuedDiagnostics.length).toEqual(2);

    act(() => {
      dispatch({
        type: 'CLEAR_FORM',
      });
    });
    expect(result.current.formState).toEqual(initialFormState);
  });
});

describe('SET_DIAGNOSTIC_TO_UPDATE billing hydration (edit mode)', () => {
  const baseDiagnostic = {
    id: 10,
    athlete: { id: 1 },
    prescriber: { id: 2 },
    provider: { sgid: 'sg1' },
    location: { id: 3 },
    diagnostic_type: { id: 19 },
    diagnostic_reason: { id: 7 },
    diagnostic_date: '2025-11-05T00:00:00+00:00',
    laterality: { id: 2 },
    issue_occurrences: [],
    referring_physician: 'Dr Edit',
  };

  afterEach(() => {
    window.setFlag('medical-diagnostics-iteration-3-billing-cpt', false);
    window.setFlag('diagnostics-billing-extra-fields', false);
    window.setFlag('diagnostics-multiple-cpt', false);
  });

  it('uses inline billing fields when only medical-diagnostics-iteration-3-billing-cpt is ON', () => {
    window.setFlag('medical-diagnostics-iteration-3-billing-cpt', true);
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;

    const diagnosticToUpdate = {
      ...baseDiagnostic,
      cpt_code: '97110',
      is_billable: true,
      amount_paid_insurance: '50',
      amount_paid_athlete: '25',
    };

    act(() => {
      dispatch({ type: 'SET_DIAGNOSTIC_TO_UPDATE', diagnosticToUpdate });
    });

    expect(result.current.formState.cptCode).toEqual('97110');
    expect(result.current.formState.isBillable).toEqual(true);
    expect(result.current.formState.amountPaidInsurance).toEqual('50');
    expect(result.current.formState.amountPaidAthlete).toEqual('25');
    expect(result.current.formState.referringPhysician).toEqual('Dr Edit');
    expect(result.current.formState.queuedBillableItems.length).toEqual(0);
  });

  it('uses billable_items when diagnostics-billing-extra-fields is ON', () => {
    window.setFlag('diagnostics-billing-extra-fields', true);
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;

    const diagnosticToUpdate = {
      ...baseDiagnostic,
      billable_items: [
        {
          id: 101,
          cpt_code: '97140',
          is_billable: true,
          amount_charged: 200,
          discount: 10,
          amount_paid_insurance: 120,
          amount_due: 70,
          amount_paid_athlete: 80,
          date_paid: '2025-11-06T00:00:00+00:00',
        },
      ],
    };

    act(() => {
      dispatch({ type: 'SET_DIAGNOSTIC_TO_UPDATE', diagnosticToUpdate });
    });

    const item = result.current.formState.queuedBillableItems[0];
    expect(item).toEqual(
      expect.objectContaining({
        id: 101,
        cptCode: '97140',
        isBillable: true,
        amountCharged: '200',
        discountOrReduction: '10',
        amountPaidInsurance: '120',
        amountDue: '70',
        amountPaidAthlete: '80',
        datePaidDate: '2025-11-06T00:00:00+00:00',
      })
    );
    expect(result.current.formState.referringPhysician).toEqual('Dr Edit');
  });

  it('uses billable_items when diagnostics-multiple-cpt is ON', () => {
    window.setFlag('diagnostics-multiple-cpt', true);
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;

    const diagnosticToUpdate = {
      ...baseDiagnostic,
      billable_items: [
        {
          id: 201,
          cpt_code: '97530',
          is_billable: false,
          amount_charged: 0,
          discount: 0,
          amount_paid_insurance: 0,
          amount_due: 0,
          amount_paid_athlete: 0,
          date_paid: null,
        },
      ],
    };

    act(() => {
      dispatch({ type: 'SET_DIAGNOSTIC_TO_UPDATE', diagnosticToUpdate });
    });

    const item = result.current.formState.queuedBillableItems[0];
    expect(item).toEqual(
      expect.objectContaining({
        id: 201,
        cptCode: '97530',
        isBillable: false,
        amountCharged: '0',
        discountOrReduction: '0',
        amountPaidInsurance: '0',
        amountDue: '0',
        amountPaidAthlete: '0',
        datePaidDate: null,
      })
    );
  });
});
