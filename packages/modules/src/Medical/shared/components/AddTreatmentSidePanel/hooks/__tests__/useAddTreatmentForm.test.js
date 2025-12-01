import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import moment from 'moment-timezone';
import TestRenderer from 'react-test-renderer';
import useTreatmentForm from '../useAddTreatmentForm';

describe('useAddTreatmentForm', () => {
  const { act } = TestRenderer;

  let hookRender;
  let formState;
  let dispatch;

  const mockTreatmentAttribute = {
    treatment_modality: 1,
    duration: '20',
    reason: 'reason',
    issue_type: '',
    issue_id: '',
    treatment_body_areas: [''],
    is_billable: false,
    billable_items: [
      {
        cpt_code: '12345',
        icd_code: 'abcdef',
        amount_charged: '20',
        discount: '20',
        amount_paid_insurance: '20',
        amount_due: '20',
        amount_paid_athlete: '20',
        date_paid: '',
        note: 'a note',
      },
    ],
    cpt_code: '12345',
    icd_code: 'abcdef',
    amount_charged: '20',
    discount: '20',
    amount_paid_insurance: '20',
    amount_due: '20',
    amount_paid_athlete: '20',
    date_paid: '',
    note: 'a note',
  };

  const mockTreatment = {
    id: 1,
    user: {
      id: 2,
      firstname: 'An',
      lastname: 'Other',
      fullname: 'An Other',
    },
    referring_physician: '',
    athlete: {
      id: 3,
      firstname: 'An',
      lastname: 'Athlete',
      fullname: 'An Athlete',
      shortname: 'A Athlete',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    },
    start_time: '2022-07-12T11:00:00Z',
    end_time: '2022-07-12T11:30:00Z',
    timezone: 'Europe/Dublin',
    title: 'Treatment Note',
    created_by: {
      id: 2,
      firstname: 'An',
      lastname: 'Other',
      fullname: 'An Other',
    },
    created_at: '2022-07-12T11:49:48Z',
    treatments: [
      {
        id: 45524,
        treatment_modality: {
          id: 38,
          name: 'Ice Pack',
          treatment_category: {
            id: 3,
            name: 'Cryotherapy/Compression',
          },
        },
        duration: null,
        reason: 'general',
        issue_type: null,
        issue: null,
        treatment_body_areas: [
          {
            id: 65686,
            treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
            treatable_area: {
              id: 1,
              name: 'Ankle',
            },
            side: {
              id: 1,
              name: 'Left',
            },
            name: 'Left Ankle',
          },
        ],
        issue_name: null,
        note: "Oh, honey, he's teasing you. Nobody has two television sets. -- Natus quod qui explicabo et nisi. Quisquam numquam asperiores ratione minima deserunt.",
        billable_items: [
          {
            cpt_code: null,
            icd_code: null,
            is_billable: false,
            amount_charged: null,
            discount: null,
            amount_paid_insurance: null,
            amount_due: null,
            amount_paid_athlete: null,
            date_paid: null,
          },
        ],
        cpt_code: null,
        icd_code: null,
        is_billable: false,
        amount_charged: null,
        discount: null,
        amount_paid_insurance: null,
        amount_due: null,
        amount_paid_athlete: null,
        date_paid: null,
      },
    ],
    annotation: {
      id: 2640424,
      organisation_annotation_type: null,
      annotationable_type: 'TreatmentSession',
      annotationable: null,
      title: 'Note Title 2640424',
      content:
        "You want a Pepsi, pal, you're gonna pay for it. -- Molestiae est enim dolorem voluptas.",
      annotation_date: '2022-07-11T23:00:00Z',
      annotation_actions: [],
      expiration_date: null,
      attachments: [],
      archived: false,
      created_by: {
        id: 2,
      },
      created_at: '2022-07-12T11:49:48Z',
      updated_by: null,
      updated_at: '2022-07-13T04:51:12Z',
    },
  };

  const initTreatmentFormValues = {
    athleteId: null,
    practitionerId: null,
    referringPhysician: '',
    startDate: '2020-10-15',
    startTime: '2020-10-15',
    endTime: '2020-10-15T00:30:00.000Z',
    timezone: 'Europe/Dublin',
    duration: null,
    treatmentDate: '2020-10-15',
    treatmentsAttributes: [],
    queuedAttachments: [],
    queuedAttachmentTypes: [],
    annotationAttributes: {
      content: '',
      attachments_attributes: [],
    },
    modalities: [],
    bodyAreas: [],
    reason: {
      issue_id: null,
      issue_type: null,
      reason: '',
    },
    multiDuration: '',
    date: {
      startDate: '2020-10-15T00:00:00.000Z',
      endDate: '2020-10-15T00:30:00.000Z',
      startTime: '2020-10-15T00:00:00.000Z',
      endTime: '2020-10-15T00:30:00.000Z',
      timezone: 'Europe/Dublin',
      duration: '30',
    },
  };

  describe('on the 2020-10-15', () => {
    let timer;

    beforeEach(() => {
      document.body.dataset.timezone = 'Europe/Dublin';
      moment.tz.setDefault('Europe/Dublin');
      const mockedDate = moment('2020-10-15'); // October 15th
      timer = sinon.useFakeTimers(mockedDate.toDate());
      hookRender = renderHook(() =>
        useTreatmentForm(initTreatmentFormValues)
      ).result;
      formState = hookRender.current.formState;
      dispatch = hookRender.current.dispatch;
    });

    afterEach(() => {
      timer.restore();
      moment.tz.setDefault();
    });

    it('returns correct state on ADD_TREATMENT', () => {
      formState.treatmentsAttributes = [];
      act(() => {
        dispatch({
          type: 'ADD_TREATMENT',
          treatment: mockTreatmentAttribute,
        });
      });

      expect(hookRender.current.formState.treatmentsAttributes.length).toEqual(
        1
      );
      expect(
        hookRender.current.formState.treatmentsAttributes[0]
      ).toStrictEqual(mockTreatmentAttribute);
    });

    it('returns correct state on CLEAR_FORM', () => {
      act(() => {
        dispatch({
          type: 'CLEAR_FORM',
          defaultFormValues: initTreatmentFormValues,
        });
      });
      expect(hookRender.current.formState.athleteId).toStrictEqual(
        initTreatmentFormValues.athleteId
      );
      expect(hookRender.current.formState.practitionerId).toStrictEqual(
        initTreatmentFormValues.practitionerId
      );
      expect(hookRender.current.formState.duration).toStrictEqual(
        initTreatmentFormValues.duration
      );
      expect(hookRender.current.formState.treatmentsAttributes).toStrictEqual(
        initTreatmentFormValues.treatmentsAttributes
      );
      expect(hookRender.current.formState.queuedAttachments).toStrictEqual(
        initTreatmentFormValues.queuedAttachments
      );
      expect(hookRender.current.formState.queuedAttachmentTypes).toStrictEqual(
        initTreatmentFormValues.queuedAttachmentTypes
      );
      expect(hookRender.current.formState.annotationAttributes).toStrictEqual(
        initTreatmentFormValues.annotationAttributes
      );
      expect(hookRender.current.formState.modalities).toStrictEqual(
        initTreatmentFormValues.modalities
      );
      expect(hookRender.current.formState.bodyAreas).toStrictEqual(
        initTreatmentFormValues.bodyAreas
      );
      expect(hookRender.current.formState.reason).toStrictEqual(
        initTreatmentFormValues.reason
      );
      expect(hookRender.current.formState.multiDuration).toStrictEqual(
        initTreatmentFormValues.multiDuration
      );
      expect(hookRender.current.formState.date.duration).toEqual('30 mins');
      expect(
        moment(hookRender.current.formState.date.startDate).format()
      ).toEqual('2020-10-15T00:00:00+01:00');
      expect(
        moment(hookRender.current.formState.date.startTime).format()
      ).toEqual('2020-10-15T00:00:00+01:00');
      expect(
        moment(hookRender.current.formState.date.endDate).format()
      ).toEqual('2020-10-15T00:30:00+01:00');
      expect(
        moment(hookRender.current.formState.date.endTime).format()
      ).toEqual('2020-10-15T00:30:00+01:00');
      expect(hookRender.current.formState.date.timezone).toEqual(
        'Europe/Dublin'
      );
    });

    it('returns correct state on CLEAR_MULTI_ADD', () => {
      act(() => {
        dispatch({
          type: 'CLEAR_MULTI_ADD',
        });
      });
      expect(hookRender.current.formState.modalities).toStrictEqual([]);
      expect(hookRender.current.formState.bodyAreas).toStrictEqual([]);
      expect(hookRender.current.formState.reason).toStrictEqual({
        reason: '',
        issue_type: null,
        issue_id: null,
      });
      expect(hookRender.current.formState.multiDuration).toStrictEqual('');
    });

    it('returns correct state on CREATE_TREATMENT_TEMPLATE', () => {
      act(() => {
        dispatch({
          type: 'CREATE_TREATMENT_TEMPLATE',
        });
      });
      expect(hookRender.current.formState.treatmentsAttributes).toStrictEqual([
        {
          treatment_modality_id: null,
          duration: null,
          reason: null,
          issue_type: null,
          issue_id: null,
          treatment_body_areas_attributes: [],
          is_billable: false,
          cpt_code: '',
          icd_code: '',
          amount_charged: '',
          discount: '',
          amount_paid_insurance: '',
          amount_due: '',
          amount_paid_athlete: '',
          date_paid: '',
          note: '',
        },
      ]);
    });

    it('returns correct state on REMOVE_ATTACHMENT_TYPE', () => {
      act(() => {
        dispatch({
          type: 'UPDATE_ATTACHMENT_TYPE',
          queuedAttachmentTypes: 'FILE',
        });
      });

      act(() => {
        dispatch({
          type: 'REMOVE_ATTACHMENT_TYPE',
          attachmentType: 'FILE',
        });
      });

      expect(hookRender.current.formState.queuedAttachmentTypes).toEqual([]);
      expect(hookRender.current.formState.annotationAttributes.content).toEqual(
        ''
      );
    });

    it('returns correct state on REMOVE_TREATMENT', () => {
      act(() => {
        dispatch({
          type: 'REMOVE_TREATMENT',
          index: 0,
        });
      });
      expect(hookRender.current.formState.treatmentsAttributes.length).toEqual(
        0
      );
    });

    it('returns correct state on SET_ATHLETE_ID', () => {
      expect(formState.athleteId).toBe(null);
      act(() => {
        dispatch({
          type: 'SET_ATHLETE_ID',
          athleteId: 123,
        });
      });

      expect(hookRender.current.formState.athleteId).toBe(123);
    });

    it('returns correct state on SET_ATTACHED_NOTE_CONTENT', () => {
      expect(formState.athleteId).toBe(null);
      act(() => {
        dispatch({
          type: 'SET_ATTACHED_NOTE_CONTENT',
          note: 'A note',
        });
      });

      expect(hookRender.current.formState.annotationAttributes).toStrictEqual({
        content: 'A note',
        attachments_attributes: [],
      });
    });

    it('returns correct state on SET_MULTI_BODY_AREAS', () => {
      act(() => {
        dispatch({
          type: 'SET_MULTI_BODY_AREAS',
          bodyAreas: [
            {
              side_id: 2,
              treatable_area_id: 161,
              treatable_area_type: 'Emr::Private::Models::BodyPart',
            },
          ],
        });
      });

      expect(hookRender.current.formState.bodyAreas).toStrictEqual([
        {
          side_id: 2,
          treatable_area_id: 161,
          treatable_area_type: 'Emr::Private::Models::BodyPart',
        },
      ]);
    });

    it('returns correct state on SET_MULTI_DURATION', () => {
      act(() => {
        dispatch({
          type: 'SET_MULTI_DURATION',
          duration: '',
        });
      });
      expect(hookRender.current.formState.duration).toStrictEqual(null);
    });

    it('returns correct state on SET_MULTI_MODALITIES', () => {
      act(() => {
        dispatch({
          type: 'SET_MULTI_MODALITIES',
          modalities: [12, 24, 36],
        });
      });

      expect(hookRender.current.formState.modalities).toStrictEqual([
        12, 24, 36,
      ]);
    });

    it('returns correct state on SET_MULTI_REASON', () => {
      act(() => {
        dispatch({
          type: 'SET_MULTI_REASON',
          reason: '',
        });
      });
      expect(hookRender.current.formState.reason).toStrictEqual('');
    });

    it('returns correct state on SET_PRACTITIONER_ID', () => {
      expect(formState.practitionerId).toBe(null);
      act(() => {
        dispatch({
          type: 'SET_PRACTITIONER_ID',
          practitionerId: 123,
        });
      });

      expect(hookRender.current.formState.practitionerId).toBe(123);
    });

    it('returns correct state on SET_REFERRING_PHYSICIAN', () => {
      expect(formState.referringPhysician).toBe('');
      act(() => {
        dispatch({
          type: 'SET_REFERRING_PHYSICIAN',
          referringPhysician: 'Test Name',
        });
      });

      expect(hookRender.current.formState.referringPhysician).toBe('Test Name');
    });

    it('returns correct state on SET_TREATMENT_AMOUNT_CHARGED', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_AMOUNT_CHARGED',
          amountCharged: 100,
          index: 0,
        });
      });

      expect(
        hookRender.current.formState.treatmentsAttributes[0].amount_charged
      ).toBe(100);
    });

    it('returns correct state on SET_TREATMENT_DISCOUNT_OR_REDUCTION', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_DISCOUNT_OR_REDUCTION',
          discountOrReduction: 30,
          index: 0,
        });
      });

      expect(
        hookRender.current.formState.treatmentsAttributes[0].discount
      ).toBe(30);
    });

    it('returns correct state on SET_TREATMENT_AMOUNT_INSURANCE', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_AMOUNT_INSURANCE',
          amountPaidInsurance: 123,
          index: 0,
        });
      });

      expect(
        hookRender.current.formState.treatmentsAttributes[0]
          .amount_paid_insurance
      ).toBe(123);
    });

    it('returns correct state on SET_TREATMENT_AMOUNT_DUE', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_AMOUNT_DUE',
          amountDue: 500,
          index: 0,
        });
      });

      expect(
        hookRender.current.formState.treatmentsAttributes[0].amount_due
      ).toBe(500);
    });

    it('returns correct state on SET_TREATMENT_AMOUNT_ATHLETE', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_AMOUNT_ATHLETE',
          amountPaidAthlete: 123,
          index: 0,
        });
      });

      expect(
        hookRender.current.formState.treatmentsAttributes[0].amount_paid_athlete
      ).toBe(123);
    });

    it('returns correct state on SET_TREATMENT_DATE_PAID_DATE', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_DATE_PAID_DATE',
          datePaidDate: '2022-07-12T12:00:00+01:00',
          index: 0,
        });
      });

      expect(
        hookRender.current.formState.treatmentsAttributes[0].date_paid
      ).toBe('2022-07-12T12:00:00+01:00');
    });

    it('returns correct state on SET_TREATMENT_BODY_AREA', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_BODY_AREA',
          index: 0,
          selectedBodyAreas: [23, 24, 25],
        });
      });
      expect(
        hookRender.current.formState.treatmentsAttributes[0]
          .treatment_body_areas
      ).toStrictEqual([23, 24, 25]);
    });

    it('returns correct state on SET_TREATMENT_CPT_CODE', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_CPT_CODE',
          cptCode: 12453,
          index: 0,
        });
      });

      expect(
        hookRender.current.formState.treatmentsAttributes[0].cpt_code
      ).toBe(12453);
    });

    it('returns correct state on SET_TREATMENT_ICD_CODE', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_CPT_CODE',
          icdCode: 'abcdef',
          index: 0,
        });
      });

      expect(
        hookRender.current.formState.treatmentsAttributes[0].icd_code
      ).toBe('abcdef');
    });

    it('returns correct state on SET_TREATMENT_IS_BILLABLE', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_IS_BILLABLE',
          isBillable: true,
          index: 0,
        });
      });

      expect(
        hookRender.current.formState.treatmentsAttributes[0].is_billable
      ).toBe(true);
    });

    it('returns correct state on SET_TREATMENT_NOTE', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_NOTE',
          note: 'SET_TREATMENT_NOTE',
          index: 0,
        });
      });

      expect(hookRender.current.formState.treatmentsAttributes[0].note).toBe(
        'SET_TREATMENT_NOTE'
      );
    });

    it('returns correct state on SET_TREATMENT_MODALITY', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_MODALITY',
          index: 0,
          modality: 23,
        });
      });
      expect(
        hookRender.current.formState.treatmentsAttributes[0].treatment_modality
      ).toStrictEqual(23);
    });

    it('returns correct state on SET_TREATMENT_REASON', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_REASON',
          index: 0,
          reason: {
            reason: 'general',
            issue_type: null,
            issue_id: null,
          },
        });
      });
      expect(
        hookRender.current.formState.treatmentsAttributes[0].reason
      ).toStrictEqual('general');
    });

    it('returns correct state on UPDATE_QUEUED_ATTACHMENTS', () => {
      formState.treatmentsAttributes = [mockTreatmentAttribute];
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
      act(() => {
        dispatch({
          type: 'UPDATE_QUEUED_ATTACHMENTS',
          queuedAttachments: files,
        });
      });
      expect(hookRender.current.formState.queuedAttachments).toStrictEqual(
        files
      );
    });

    it('returns correct state on UPDATE_ATTACHMENT_TYPE', () => {
      act(() => {
        dispatch({
          type: 'UPDATE_ATTACHMENT_TYPE',
          queuedAttachmentType: 'FILE',
        });
      });

      act(() => {
        dispatch({
          type: 'UPDATE_ATTACHMENT_TYPE',
          queuedAttachmentType: 'NOTE',
        });
      });

      expect(hookRender.current.formState.queuedAttachmentTypes).toEqual([
        'FILE',
        'NOTE',
      ]);
    });
  });

  describe('[regression] date and time setting', () => {
    let timer;

    beforeEach(() => {
      moment.tz.setDefault('Europe/Dublin');
      const mockedDate = moment('2022-08-23T10:38:08+01:00');
      timer = sinon.useFakeTimers(mockedDate.toDate());
      hookRender = renderHook(() =>
        useTreatmentForm(initTreatmentFormValues)
      ).result;
      formState = hookRender.current.formState;
      dispatch = hookRender.current.dispatch;
    });

    afterEach(() => {
      timer.restore();
      moment.tz.setDefault();
    });

    it('returns correct state on SET_TREATMENT_START_DATE', () => {
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_START_DATE',
          date: moment('2022-08-23T10:38:08+01:00'),
        });
      });
      expect(hookRender.current.formState.date.duration).toEqual('30 mins');
      expect(
        moment(hookRender.current.formState.date.startDate).format()
      ).toEqual('2022-08-23T10:38:00+01:00');
      expect(
        moment(hookRender.current.formState.date.endDate).format()
      ).toEqual('2022-08-23T11:08:00+01:00');
      expect(hookRender.current.formState.date.timezone).toEqual(
        'Europe/Dublin'
      );
    });
    it('returns correct state on SET_TREATMENT_START_TIME', () => {
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_START_DATE',
          date: moment('2022-08-23T10:38:08+01:00'),
        });
      });
      expect(hookRender.current.formState.date.duration).toEqual('30 mins');
      expect(
        moment(hookRender.current.formState.date.startDate).format()
      ).toEqual('2022-08-23T10:38:00+01:00');
      expect(
        moment(hookRender.current.formState.date.endDate).format()
      ).toEqual('2022-08-23T11:08:00+01:00');
      expect(hookRender.current.formState.date.timezone).toEqual(
        'Europe/Dublin'
      );
    });

    it('returns correct state on SET_TREATMENT_END_DATE', () => {
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_END_DATE',
          date: moment('2022-08-24T10:38:08+01:00'),
        });
      });
      expect(hookRender.current.formState.date.duration).toEqual('1470 mins');
      expect(
        moment(hookRender.current.formState.date.startDate).format()
      ).toEqual('2022-08-23T10:38:08+01:00');
      expect(
        moment(hookRender.current.formState.date.endDate).format()
      ).toEqual('2022-08-24T11:08:00+01:00');
      expect(hookRender.current.formState.date.timezone).toEqual(
        'Europe/Dublin'
      );
    });

    it('returns correct state on SET_TREATMENT_END_TIME', () => {
      formState.date = {
        startTime: moment('2022-08-23T10:38:08+01:00'),
        startDate: moment('2022-08-23T10:38:08+01:00'),
        endDate: moment('2022-08-24T01:00:00+01:00'),
        timezone: 'Europe/Dublin',
      };
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_END_TIME',
          time: moment('2022-08-24T14:27:02+01:00'),
        });
      });
      expect(hookRender.current.formState.date.duration).toEqual('1669 mins');
      expect(
        moment(hookRender.current.formState.date.startDate).format()
      ).toEqual('2022-08-23T10:38:08+01:00');
      expect(
        moment(hookRender.current.formState.date.endDate).format()
      ).toEqual('2022-08-24T14:27:02+01:00');
      expect(hookRender.current.formState.date.timezone).toEqual(
        'Europe/Dublin'
      );
    });
    it('returns correct state on SET_TREATMENT_TIMEZONE', () => {
      act(() => {
        dispatch({
          type: 'SET_TREATMENT_TIMEZONE',
          timezone: 'Asia/Qatar',
        });
      });
      expect(hookRender.current.formState.date.timezone).toEqual('Asia/Qatar');
    });
  });

  describe('[duplicating] a treatment', () => {
    let timer;
    let mockedDate;

    beforeEach(() => {
      document.body.dataset.timezone = 'Europe/Dublin';
      moment.tz.setDefault('Europe/Dublin');
      mockedDate = moment(mockTreatment.start_time); // mockTreatment date (2022/07/12)
      timer = sinon.useFakeTimers(mockedDate.toDate());
      hookRender = renderHook(() =>
        useTreatmentForm(initTreatmentFormValues)
      ).result;
      formState = hookRender.current.formState;
      dispatch = hookRender.current.dispatch;
    });

    afterEach(() => {
      timer.restore();
      moment.tz.setDefault();
    });

    it('returns correct state on DUPLICATE_TREATMENT', () => {
      act(() => {
        dispatch({
          type: 'DUPLICATE_TREATMENT',
          treatment: mockTreatment,
        });
      });

      expect(
        moment(hookRender.current.formState.date.startDate).format()
      ).toEqual('2022-07-12T12:00:00+01:00');

      expect(
        moment(hookRender.current.formState.date.startTime).format()
      ).toEqual('2022-07-12T12:00:00+01:00');

      expect(
        moment(hookRender.current.formState.date.endDate).format()
      ).toEqual('2022-07-12T12:30:00+01:00');

      expect(
        moment(hookRender.current.formState.date.endTime).format()
      ).toEqual('2022-07-12T12:30:00+01:00');

      expect(hookRender.current.formState.date.timezone).toEqual(
        'Europe/Dublin'
      );

      expect(hookRender.current.formState.treatmentsAttributes.length).toEqual(
        1
      );
      expect(
        hookRender.current.formState.treatmentsAttributes[0]
          .treatment_body_areas
      ).toEqual([
        '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":1,"side_id":1}',
      ]);
      expect(
        hookRender.current.formState.treatmentsAttributes[0].treatment_modality
      ).toEqual(38);

      expect(hookRender.current.formState.annotationAttributes).toEqual({
        attachments_attributes: [],
        content: mockTreatment.annotation.content,
      });
    });
  });
});
