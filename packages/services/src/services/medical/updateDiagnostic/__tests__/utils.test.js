import {
  getFirstQueuedDiagnostic,
  getCommonDiagnosticFields,
  getRedoxPayload,
  getGaPayload,
  getValueOrFallback,
} from '@kitman/services/src/services/medical/updateDiagnostic/utils';
import { initialFormState } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDiagnosticForm';

const baseFormState = {
  ...initialFormState,
  // core fields
  locationId: 123,
  userId: 456,
  reasonId: 789,
  injuryIds: [1, 2],
  illnessIds: [3],
  chronicIssueIds: [9],
  // billing single
  cptCode: '97110',
  isBillable: true,
  referringPhysician: 'Dr Test',
  amountCharged: '100',
  discountOrReduction: '10',
  amountPaidInsurance: '50',
  amountDue: '10',
  amountPaidAthlete: '40',
  datePaidDate: '2025-11-03T00:00:00+00:00',
  redoxOrderStatus: 0,
  queuedBillableItems: [],
};

describe('updateDiagnostic utils', () => {
  describe('getFirstQueuedDiagnostic', () => {
    it('returns first item when queuedDiagnostics is array', () => {
      const formState = {
        ...baseFormState,
        queuedDiagnostics: [{ a: 1 }, { b: 2 }],
      };
      expect(getFirstQueuedDiagnostic(formState)).toEqual({ a: 1 });
    });

    it('returns empty object when queuedDiagnostics is not an array', () => {
      const formState = { ...baseFormState, queuedDiagnostics: null };
      expect(getFirstQueuedDiagnostic(formState)).toEqual({});
    });
  });

  describe('getCommonDiagnosticFields', () => {
    const firstQD = { orderProviderSGID: 'sgid-1' };

    it('builds common fields and maps billing items array', () => {
      const formState = {
        ...baseFormState,
        queuedBillableItems: [
          {
            id: 1,
            cptCode: '97110',
            isBillable: true,
            amountCharged: '100',
            discountOrReduction: '10',
            amountPaidInsurance: '50',
            amountDue: '10',
            amountPaidAthlete: '40',
            datePaidDate: '2025-11-03T00:00:00+00:00',
            isDeleted: false,
          },
        ],
      };
      const result = getCommonDiagnosticFields(formState, firstQD, {
        diagnosticTypeId: 19,
        laterality: 2,
        diagDate: '2025-11-05T00:00:00+00:00',
      });
      expect(result).toMatchObject({
        diagnostic_type_id: 19,
        location_id: 123,
        prescriber_id: 456,
        laterality: 2,
        diagnostic_reason_id: 789,
        diag_date: '2025-11-05T00:00:00+00:00',
        injury_ids: [1, 2],
        illness_ids: [3],
        provider_sgid: 'sgid-1',
        cpt_code: '97110',
        is_billable: true,
        referring_physician: 'Dr Test',
        amount_charged: '100',
        discount: '10',
        amount_paid_insurance: '50',
        amount_due: '10',
        amount_paid_athlete: '40',
        date_paid: '2025-11-03T00:00:00+00:00',
      });
      expect(result.billable_items).toEqual([
        expect.objectContaining({
          id: 1,
          cpt_code: '97110',
          is_billable: true,
          amount_charged: '100',
          discount: '10',
          amount_paid_insurance: '50',
          amount_due: '10',
          amount_paid_athlete: '40',
          date_paid: '2025-11-03T00:00:00+00:00',
          referring_physician: 'Dr Test',
          is_deleted: false,
        }),
      ]);
    });

    it('returns [] for billable_items when GA flag on and no queued items', () => {
      window.setFlag('pm-diagnostic-ga-enhancement', true);
      const formState = { ...baseFormState, queuedBillableItems: undefined };
      expect(
        getCommonDiagnosticFields(formState, firstQD, {
          diagnosticTypeId: null,
          laterality: null,
          diagDate: null,
        }).billable_items
      ).toEqual([]);
    });

    it('returns null for billable_items when GA flag off and no queued items', () => {
      window.setFlag('pm-diagnostic-ga-enhancement', false);
      const formState = { ...baseFormState, queuedBillableItems: undefined };
      const result = getCommonDiagnosticFields(formState, firstQD, {
        diagnosticTypeId: null,
        laterality: null,
        diagDate: null,
      });
      expect(result.billable_items).toBeNull();
    });
  });

  describe('getRedoxPayload', () => {
    it('includes common fields and order_date', () => {
      const formState = {
        ...baseFormState,
        queuedDiagnostics: [
          {
            key: 1,
            diagnosticType: {
              id: 19,
              cpt_code: null,
              exam_code: null,
              issue_optional: false,
              label: 'x',
              laterality_required: false,
              name: 't',
              value: 19,
              diagnostic_type_questions: [],
              cardiacScreening: false,
            },
            diagnosticTypes: [],
            athleteId: null,
            orderProviderSGID: 1001,
            userId: null,
            locationId: 123,
            reasonId: 789,
            bodyAreaId: null,
            diagnosticDate: '2025-11-05T00:00:00+00:00',
            orderDate: '2025-11-01T00:00:00+00:00',
            illnessIds: [],
            injuryIds: [],
            annotationContent: '',
            restrictAccessTo: 'DEFAULT',
            queuedAttachments: [],
            queuedAttachmentTypes: [],
            linkTitle: '',
            linkUri: '',
            queuedLinks: [],
            lateralityId: 2,
            annotationId: null,
            answers: [],
          },
        ],
      };
      const payload = getRedoxPayload(formState);
      expect(payload).toMatchObject({
        diagnostic: expect.objectContaining({
          diagnostic_type_id: 19,
          laterality: 2,
          diag_date: '2025-11-05T00:00:00+00:00',
          order_date: '2025-11-01T00:00:00+00:00',
          provider_sgid: 1001,
        }),
        scope_to_org: true,
      });
    });
  });

  describe('getGaPayload', () => {
    it('includes diagnostic_type_answers and GA specific fields', () => {
      const formState = {
        ...baseFormState,
        diagnosticType: { value: 88 },
        redoxOrderStatus: 1,
        queuedDiagnostics: [
          {
            key: 1,
            diagnosticType: {
              id: 19,
              cpt_code: null,
              exam_code: null,
              issue_optional: false,
              label: 'x',
              laterality_required: false,
              name: 't',
              value: 19,
              diagnostic_type_questions: [],
              cardiacScreening: true,
            },
            diagnosticTypes: [],
            athleteId: null,
            orderProviderSGID: 1001,
            userId: null,
            locationId: 123,
            reasonId: 789,
            bodyAreaId: null,
            diagnosticDate: '2025-11-05T00:00:00+00:00',
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
            lateralityId: 0,
            annotationId: null,
            answers: [
              {
                answerIndex: 0,
                questionTypeId: 1,
                questionType: 'choice',
                value: 7,
                optionalText: null,
                optionalTextRequired: null,
                label: 'Q1',
                required: false,
              },
              {
                answerIndex: 1,
                questionTypeId: 2,
                questionType: 'text',
                value: 'foo',
                optionalText: null,
                optionalTextRequired: null,
                label: 'Q2',
                required: false,
              },
              {
                answerIndex: 2,
                questionTypeId: 3,
                questionType: 'datetime',
                value: '2025-11-10T00:00:00+00:00',
                optionalText: null,
                optionalTextRequired: null,
                label: 'Q3',
                required: false,
              },
              {
                answerIndex: 3,
                questionTypeId: 4,
                questionType: 'choice',
                value: null,
                optionalText: 'extra',
                optionalTextRequired: true,
                label: 'Q4',
                required: true,
              },
            ],
          },
        ],
      };
      const payload = getGaPayload(formState);
      expect(payload.diagnostic.diagnostic_type_answers).toEqual([
        expect.objectContaining({
          diagnostic_type_question_id: 1,
          diagnostic_type_question_choice_id: 7,
          datetime: null,
          text: null,
        }),
        expect.objectContaining({
          diagnostic_type_question_id: 2,
          diagnostic_type_question_choice_id: null,
          datetime: null,
          text: 'foo',
        }),
        expect.objectContaining({
          diagnostic_type_question_id: 3,
          diagnostic_type_question_choice_id: null,
          datetime: '2025-11-10T00:00:00+00:00',
          text: null,
        }),
        expect.objectContaining({
          diagnostic_type_question_id: 4,
          diagnostic_type_question_choice_id: null,
          datetime: null,
          text: 'extra',
        }),
      ]);
      expect(payload.diagnostic).toMatchObject({
        cardiac_screening: true,
        send_redox_order: true,
      });
    });
  });

  describe('getValueOrFallback', () => {
    it('returns the value if it is not null', () => {
      expect(getValueOrFallback(1, [2, 3])).toEqual(1);
      expect(getValueOrFallback('1', [2, 3])).toEqual('1');
      expect(getValueOrFallback(true, [false, false])).toEqual(true);
    });
    it('returns the first non-null fallback if the value is null', () => {
      expect(getValueOrFallback(null, [null, undefined, 2, 3])).toEqual(2);
      expect(getValueOrFallback(undefined, [null, undefined, 2, 3])).toEqual(2);
    });
  });
});
