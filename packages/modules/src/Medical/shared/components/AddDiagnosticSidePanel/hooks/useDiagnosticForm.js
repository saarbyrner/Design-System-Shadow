// @flow

import { useReducer } from 'react';
import { safeNumberString } from '@kitman/common/src/utils/safeNumberString';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { Dispatch } from '../../../types';

export type DiagnosticTypeQuestion = {
  description: string | null,
  diagnostic_type_question_choices: Array<{
    id: number,
    name: string,
    optional_text: boolean,
  }>,
  id: number,
  label: string,
  question_type: 'choice' | 'text' | 'datetime' | 'segmented_choice',
  required: boolean,
};
export type Answer = {
  answerIndex: number,
  questionTypeId: number,
  value: number | string | null,
  optionalText?: string,
  optionalTextRequired: boolean | null,
  questionType: 'choice' | 'text' | 'datetime' | 'segmented_choice',
  label: string,
  required: boolean,
};
export type DiagnosticSelectType = {
  cpt_code: number | null,
  exam_code: number | null,
  id: number | null,
  issue_optional: boolean,
  label: string | null,
  laterality_required: boolean,
  name: string | null,
  value: number | null,
  type?: 'order set' | null,
  diagnostic_type_questions: Array<DiagnosticTypeQuestion>,
  options?: Array<DiagnosticSelectType>,
  cardiacScreening: boolean,
};

export type QueuedLinks = {
  title: string,
  uri: string,
  id?: number,
};

export type QueuedDiagnostic = {
  key: number,
  diagnosticType: DiagnosticSelectType | null,
  diagnosticTypes: Array<DiagnosticSelectType>,
  userId: ?number,
  orderProviderSGID: number | null,
  athleteId: ?number,
  locationId: number | null,
  reasonId: ?number,
  bodyAreaId: ?number,
  diagnosticDate: ?string,
  orderDate: ?string,
  illnessIds: number[],
  injuryIds: number[],
  annotationContent: ?string,
  restrictAccessTo: string,
  queuedAttachments: Array<AttachedFile>,
  queuedAttachmentTypes: Array<string>,
  linkTitle: string,
  linkUri: string,
  queuedLinks: Array<QueuedLinks>,
  lateralityId: number | null,
  annotationId?: number | null,
  answers: Array<Answer>,
};

export type BillableItem = {
  id?: number,
  key: number,
  isDeleted: boolean,
  cptCode: string,
  isBillable: boolean,
  amountCharged: string,
  discountOrReduction: string,
  amountPaidInsurance: string,
  amountDue: string,
  amountPaidAthlete: string,
  datePaidDate: ?string,
};
export type FormState = {
  diagnosticType: ?DiagnosticSelectType,
  userId: ?number,
  orderProviderSGID: number | null,
  athleteId: ?number,
  locationId: number | null,
  reasonId: ?number,
  bodyAreaId: ?number,
  diagnosticDate: ?string,
  illnessIds: number[],
  injuryIds: number[],
  chronicIssueIds: number[],
  covidTestDate: ?string,
  covidTestType: ?string,
  covidTestResult: ?string,
  covidTestReference: ?string,
  covidAntibodyTestDate: ?string,
  covidAntibodyTestType: ?string,
  covidAntibodyTestResult: ?string,
  covidAntibodyTestReference: ?string,
  medicationType: ?string,
  medicationDosage: ?string,
  medicationFrequency: ?string,
  medicationCourseCompleted: boolean,
  medicationCourseStartedAt: ?string,
  medicationCourseCompletedAt: ?string,
  medicationAnnotationContent: ?string,
  annotationContent: ?string,
  annotationDate: ?string,
  restrictAccessTo: string,
  cptCode: string,
  isBillable: boolean,
  amountCharged: string,
  discountOrReduction: string,
  amountPaidInsurance: string,
  amountDue: string,
  amountPaidAthlete: string,
  referringPhysician: string,
  datePaidDate: ?string,
  queuedBillableItems: Array<BillableItem>,
  queuedAttachments: Array<AttachedFile>,
  queuedAttachmentTypes: Array<string>,
  linkTitle: string,
  linkUri: string,
  queuedLinks: Array<QueuedLinks>,
  redoxOrderStatus: number,
  lateralityId: number | null,
  queuedDiagnostics: QueuedDiagnostic[],
};

export type FormAction =
  | { type: 'SET_DIAGNOSTIC_TYPE', diagnosticType: DiagnosticSelectType }
  | { type: 'SET_USER_ID', userId: number }
  | { type: 'SET_ORDER_PROVIDER_SGID', orderProviderSGID: number | null }
  | { type: 'SET_REFERRING_PHYSICIAN', referringPhysician: string }
  | { type: 'SET_LOCATION_ID', locationId: number | null }
  | { type: 'SET_REASON_ID', reasonId: ?number }
  | { type: 'SET_ATHLETE_ID', athleteId: number | null }
  | { type: 'SET_BODY_AREA_ID', bodyAreaId: number }
  | { type: 'SET_DIAGNOSTIC_DATE', diagnosticDate: string }
  | { type: 'SET_ANNOTATION_DATE', annotationDate: string }
  | { type: 'SET_ILLNESS_IDS', illnessIds: number[] }
  | { type: 'SET_INJURY_IDS', injuryIds: number[] }
  | { type: 'SET_CHRONIC_IDS', chronicIssueIds: number[] }
  | { type: 'SET_COVID_TEST_DATE', covidTestDate: string }
  | { type: 'SET_COVID_TEST_TYPE', covidTestType: string }
  | { type: 'SET_COVID_TEST_RESULT', covidTestResult: string }
  | { type: 'SET_COVID_TEST_REFERENCE', covidTestReference: string }
  | { type: 'SET_COVID_ANTIBODY_TEST_DATE', covidAntibodyTestDate: string }
  | { type: 'SET_COVID_ANTIBODY_TEST_TYPE', covidAntibodyTestType: string }
  | { type: 'SET_COVID_ANTIBODY_TEST_RESULT', covidAntibodyTestResult: string }
  | {
      type: 'SET_COVID_ANTIBODY_TEST_REFERENCE',
      covidAntibodyTestReference: string,
    }
  | { type: 'SET_MEDICATION_TYPE', medicationType: string }
  | { type: 'SET_MEDICATION_DOSAGE', medicationDosage: string }
  | { type: 'SET_MEDICATION_FREQUENCY', medicationFrequency: string }
  | { type: 'SET_MEDICATION_START_DATE', medicationCourseStartedAt: string }
  | { type: 'SET_MEDICATION_END_DATE', medicationCourseCompletedAt: string }
  | {
      type: 'SET_MEDICATION_COURSE_COMPLETED',
      medicationCourseCompleted: boolean,
    }
  | { type: 'SET_MEDICATION_NOTE_CONTENT', medicationAnnotationContent: string }
  | { type: 'SET_NOTE_CONTENT', annotationContent: string }
  | { type: 'SET_NOTE_VISIBILITY', noteVisibilityId: string }
  | { type: 'SET_CPT_CODE', cptCode: string }
  | { type: 'SET_IS_BILLABLE', isBillable: boolean }
  | {
      type: 'SET_AMOUNT_CHARGED',
      amountCharged: string,
    }
  | {
      type: 'SET_DISCOUNT_OR_REDUCTION',
      discountOrReduction: string,
    }
  | {
      type: 'SET_AMOUNT_PAID_INSURANCE',
      amountPaidInsurance: string,
    }
  | {
      type: 'SET_AMOUNT_DUE',
      amountDue: string,
    }
  | {
      type: 'SET_AMOUNT_PAID_ATHLETE',
      amountPaidAthlete: string,
    }
  | { type: 'SET_DATE_PAID_DATE', datePaidDate: string }
  | { type: 'SET_MULTI_CPT_CODE', index: number, cptCode: string }
  | { type: 'SET_MULTI_IS_BILLABLE', index: number, isBillable: boolean }
  | {
      type: 'SET_MULTI_AMOUNT_CHARGED',
      index: number,
      amountCharged: string,
    }
  | {
      type: 'SET_MULTI_DISCOUNT_OR_REDUCTION',
      index: number,
      discountOrReduction: string,
    }
  | {
      type: 'SET_MULTI_AMOUNT_PAID_INSURANCE',
      index: number,
      amountPaidInsurance: string,
    }
  | {
      type: 'SET_MULTI_AMOUNT_DUE',
      index: number,
      amountDue: string,
    }
  | {
      type: 'SET_MULTI_AMOUNT_PAID_ATHLETE',
      index: number,
      amountPaidAthlete: string,
    }
  | { type: 'SET_MULTI_DATE_PAID_DATE', index: number, datePaidDate: string }
  | { type: 'ADD_ANOTHER_BILLABLE_ITEM' }
  | { type: 'REMOVE_MULTI_CPT', index: number }
  | { type: 'REMOVE_MULTI_CPT_ON_OVERVIEW', index: number }
  | {
      type: 'SET_MULTI_BILLABLE_ITEMS',
      queuedBillableItems: Array<BillableItem>,
    }
  | {
      type: 'UPDATE_QUEUED_ATTACHMENTS',
      queuedAttachments: AttachedFile[],
    }
  | { type: 'CLEAR_LINK_ATTACHMENT' }
  | { type: 'CLEAR_QUEUED_LINKS' }
  | { type: 'REMOVE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'UPDATE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'SET_LINK_TITLE', linkTitle: string }
  | { type: 'SET_LINK_URI', linkUri: string }
  | {
      type: 'UPDATE_QUEUED_LINKS',
      queuedLinks: QueuedLinks[],
    }
  | { type: 'REMOVE_QUEUED_LINK', id: ?number }
  | { type: 'SET_REDOX_ORDER_STATUS', redoxOrderStatus: number }
  | { type: 'SET_LATERALITY', lateralityId: number }
  | { type: 'ADD_ANOTHER_MULTI_ORDER' }
  | { type: 'REMOVE_MULTI_ORDER', index: number }
  | {
      type: 'SET_MULTI_ORDER_TYPE',
      index: number,
      diagnosticType: DiagnosticSelectType,
    }
  | {
      type: 'SET_MULTI_DIAGNOSTICS_TYPE',
      index: number,
      diagnosticTypes: Array<DiagnosticSelectType>,
    }
  | {
      type: 'SET_MULTI_ORDER_PROVIDER_SGID',
      index: number,
      orderProviderSGID: number | null,
    }
  | {
      type: 'SET_MULTI_ORDER_DATE',
      index: number,
      orderDate: string,
    }
  | {
      type: 'SET_MULTI_ORDER_APPOINTMENT_DATE',
      index: number,
      diagnosticDate: string,
    }
  | {
      type: 'SET_MULTI_BODY_AREA_ID',
      index: number,
      bodyAreaId: number,
    }
  | {
      type: 'SET_MULTI_LATERALITY',
      index: number,
      lateralityId: number,
    }
  | {
      type: 'SET_MULTI_NOTE_CONTENT',
      index: number,
      annotationContent: string,
    }
  | {
      type: 'UPDATE_MULTI_ATTACHMENT_TYPE',
      index: number,
      queuedAttachmentType: string,
    }
  | {
      type: 'REMOVE_MULTI_ATTACHMENT_TYPE',
      index: number,
      queuedAttachmentType: string,
    }
  | { type: 'CLEAR_MULTI_QUEUED_LINKS', index: number }
  | { type: 'SET_MULTI_LINK_TITLE', index: number, linkTitle: string }
  | { type: 'SET_MULTI_LINK_URI', index: number, linkUri: string }
  | {
      type: 'UPDATE_MULTI_QUEUED_LINKS',
      index: number,
      queuedLinks: QueuedLinks[],
    }
  | { type: 'REMOVE_MULTI_QUEUED_LINK', index: number, id: ?number }
  | {
      type: 'UPDATE_MULTI_QUEUED_ATTACHMENTS',
      index: number,
      queuedAttachments: Array<AttachedFile>,
    }
  | {
      type: 'SET_DIAGNOSTIC_TYPE_GROUP_SET',
      diagnosticTypeGroupSet: Array<DiagnosticSelectType>,
    }
  | {
      type: 'SET_MULTI_LOCATION_ID',
      locationId: number | null,
      isMultiSelect: boolean,
    }
  | { type: 'SET_FOR_ALL' }
  | { type: 'SET_DIAGNOSTIC_TO_UPDATE', diagnosticToUpdate: Object }
  | {
      type: 'SET_DIAGNOSTIC_TYPE_ANSWER',
      diagnosticIndex: number,
      answer: Answer,
    }
  | {
      type: 'SET_OPTIONAL_TEXT_ANSWER',
      diagnosticIndex: number,
      answer: {
        answerIndex: number,
        questionTypeId: number,
        value?: number,
        optionalText?: string,
        optionalTextRequired: boolean,
      },
    }
  | {
      type: 'SET_CARDIAC_SCREENING_ANSWER',
      diagnosticIndex: number,
      answer: Answer,
    }
  | {
      type: 'SET_CARDIAC_SCREENING_FOLLOW_UP',
      diagnosticIndex: number,
      answer: {
        answerIndex: number,
        questionTypeId: number,
        value?: number,
        optionalText?: string,
        optionalTextRequired: boolean,
      },
    }
  | { type: 'CLEAR_FORM' };

export const initialFormState = {
  diagnosticType: null,
  athleteId: null,
  orderProviderSGID: null,
  userId: null,
  referringPhysician: '',
  locationId: null,
  reasonId: null,
  bodyAreaId: null,
  diagnosticDate: null,
  illnessIds: [],
  injuryIds: [],
  chronicIssueIds: [],
  covidTestDate: null,
  covidTestType: null,
  covidTestResult: null,
  covidTestReference: null,
  covidAntibodyTestDate: null,
  covidAntibodyTestType: null,
  covidAntibodyTestResult: null,
  covidAntibodyTestReference: null,
  medicationType: null,
  medicationDosage: null,
  medicationFrequency: null,
  medicationCourseCompleted: false,
  medicationCourseStartedAt: null,
  medicationCourseCompletedAt: null,
  medicationAnnotationContent: null,
  annotationContent: '',
  annotationDate: null,
  restrictAccessTo: 'DEFAULT',
  isBillable: false,
  cptCode: '',
  amountCharged: '0',
  discountOrReduction: '0',
  amountPaidInsurance: '0',
  amountDue: '0',
  amountPaidAthlete: '0',
  datePaidDate: null,
  queuedAttachments: [],
  queuedAttachmentTypes: [],
  queuedBillableItems: [],
  linkTitle: '',
  linkUri: '',
  queuedLinks: [],
  redoxOrderStatus: 0,
  lateralityId: null,
  queuedDiagnostics: [
    {
      key: 1,
      diagnosticType: null,
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
      annotationId: null,
      answers: [],
    },
  ],
};

const formReducer = (
  state: FormState = initialFormState,
  action: FormAction
) => {
  switch (action.type) {
    case 'SET_DIAGNOSTIC_TYPE':
      return {
        ...state,
        diagnosticType: action.diagnosticType,
      };
    case 'SET_USER_ID':
      return {
        ...state,
        userId: action.userId,
      };
    case 'SET_ORDER_PROVIDER_SGID':
      return {
        ...state,
        orderProviderSGID: action.orderProviderSGID,
      };
    case 'SET_REFERRING_PHYSICIAN':
      return {
        ...state,
        referringPhysician: action.referringPhysician,
      };
    case 'SET_LOCATION_ID':
      return {
        ...state,
        locationId: action.locationId,
      };
    case 'SET_MULTI_LOCATION_ID': {
      if (action.isMultiSelect) {
        return {
          ...initialFormState,
          redoxOrderStatus: state.redoxOrderStatus,
          locationId: action.locationId,
          athleteId: state.athleteId,
          reasonId: state.reasonId,
          injuryIds: state.injuryIds,
          illnessIds: state.illnessIds,
          chronicIssueIds: state.chronicIssueIds,
          diagnosticType: null,
          orderProviderSGID: null,
          userId: null,
          referringPhysician: '',
          bodyAreaId: null,
          diagnosticDate: null,
          covidTestDate: null,
          covidTestType: null,
          covidTestResult: null,
          covidTestReference: null,
          covidAntibodyTestDate: null,
          covidAntibodyTestType: null,
          covidAntibodyTestResult: null,
          covidAntibodyTestReference: null,
          medicationType: null,
          medicationDosage: null,
          medicationFrequency: null,
          medicationCourseCompleted: false,
          medicationCourseStartedAt: null,
          medicationCourseCompletedAt: null,
          medicationAnnotationContent: null,
          annotationContent: '',
          restrictAccessTo: 'DEFAULT',
          isBillable: false,
          cptCode: '',
          amountCharged: '0',
          discountOrReduction: '0',
          amountPaidInsurance: '0',
          amountDue: '0',
          amountPaidAthlete: '0',
          datePaidDate: null,
          queuedAttachments: [],
          queuedAttachmentTypes: [],
          queuedBillableItems: [],
          linkTitle: '',
          linkUri: '',
          queuedLinks: [],
          lateralityId: null,
          queuedDiagnostics: [
            {
              ...state.queuedDiagnostics[0],
              key: 1,
              locationId: action.locationId,
              diagnosticType: null,
              diagnosticTypes: [],
              answers: [],
            },
          ],
        };
      }
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();
      const newDiagnostics = appliedQueuedDiagnostics.map(
        (diagnostic, idx) => ({
          ...diagnostic,
          key: idx + 1,
          locationId: action.locationId,
          diagnosticType: null,
          diagnosticTypes: [],
        })
      );

      return {
        ...initialFormState,
        redoxOrderStatus: state.redoxOrderStatus,
        locationId: action.locationId,
        athleteId: state.athleteId,
        reasonId: state.reasonId,
        injuryIds: state.injuryIds,
        illnessIds: state.illnessIds,
        chronicIssueIds: state.chronicIssueIds,
        queuedDiagnostics: newDiagnostics,
      };
    }
    case 'SET_REASON_ID':
      return {
        ...state,
        reasonId: action.reasonId,
      };
    case 'SET_BODY_AREA_ID':
      return {
        ...state,
        bodyAreaId: action.bodyAreaId,
      };
    case 'SET_ATHLETE_ID':
      return {
        ...state,
        athleteId: action.athleteId,
        injuryIds: [],
        illnessIds: [],
        chronicIssueIds: [],
      };
    case 'SET_DIAGNOSTIC_DATE':
      return {
        ...state,
        diagnosticDate: action.diagnosticDate,
      };
    case 'SET_ILLNESS_IDS':
      return {
        ...state,
        illnessIds: action.illnessIds,
      };
    case 'SET_CHRONIC_IDS':
      return {
        ...state,
        chronicIssueIds: action.chronicIssueIds,
      };
    case 'SET_INJURY_IDS':
      return {
        ...state,
        injuryIds: action.injuryIds,
      };
    case 'SET_COVID_TEST_DATE':
      return {
        ...state,
        covidTestDate: action.covidTestDate,
      };
    case 'SET_COVID_TEST_TYPE':
      return {
        ...state,
        covidTestType: action.covidTestType,
      };
    case 'SET_COVID_TEST_RESULT':
      return {
        ...state,
        covidTestResult: action.covidTestResult,
      };
    case 'SET_COVID_TEST_REFERENCE':
      return {
        ...state,
        covidTestReference: action.covidTestReference,
      };
    case 'SET_COVID_ANTIBODY_TEST_DATE':
      return {
        ...state,
        covidAntibodyTestDate: action.covidAntibodyTestDate,
      };
    case 'SET_COVID_ANTIBODY_TEST_TYPE':
      return {
        ...state,
        covidAntibodyTestType: action.covidAntibodyTestType,
      };
    case 'SET_COVID_ANTIBODY_TEST_RESULT':
      return {
        ...state,
        covidAntibodyTestResult: action.covidAntibodyTestResult,
      };
    case 'SET_COVID_ANTIBODY_TEST_REFERENCE':
      return {
        ...state,
        covidAntibodyTestReference: action.covidAntibodyTestReference,
      };
    case 'SET_MEDICATION_TYPE':
      return {
        ...state,
        medicationType: action.medicationType,
      };
    case 'SET_MEDICATION_DOSAGE':
      return {
        ...state,
        medicationDosage: action.medicationDosage,
      };
    case 'SET_MEDICATION_FREQUENCY':
      return {
        ...state,
        medicationFrequency: action.medicationFrequency,
      };
    case 'SET_MEDICATION_START_DATE':
      return {
        ...state,
        medicationCourseStartedAt: action.medicationCourseStartedAt,
      };
    case 'SET_MEDICATION_END_DATE':
      return {
        ...state,
        medicationCourseCompletedAt: action.medicationCourseCompletedAt,
      };
    case 'SET_MEDICATION_COURSE_COMPLETED':
      return {
        ...state,
        medicationCourseCompleted: action.medicationCourseCompleted,
      };
    case 'SET_MEDICATION_NOTE_CONTENT':
      return {
        ...state,
        medicationAnnotationContent: action.medicationAnnotationContent,
      };
    case 'SET_NOTE_CONTENT':
      return {
        ...state,
        annotationContent: action.annotationContent,
      };
    case 'SET_NOTE_VISIBILITY':
      return {
        ...state,
        restrictAccessTo: action.noteVisibilityId,
      };
    case 'SET_CPT_CODE':
      return {
        ...state,
        cptCode: action.cptCode,
      };
    case 'SET_IS_BILLABLE':
      return {
        ...state,
        isBillable: action.isBillable,
        // update amount fields to be 0 by default if isBillable is true
        // clear if isBillable is set to false
        amountCharged: action.isBillable ? '0' : '',
        discountOrReduction: action.isBillable ? '0' : '',
        amountPaidInsurance: action.isBillable ? '0' : '',
        amountDue: action.isBillable ? '0' : '',
        amountPaidAthlete: action.isBillable ? '0' : '',
      };
    case 'SET_AMOUNT_CHARGED':
      return {
        ...state,
        amountCharged: action.amountCharged,
      };
    case 'SET_DISCOUNT_OR_REDUCTION':
      return {
        ...state,
        discountOrReduction: action.discountOrReduction,
      };
    case 'SET_AMOUNT_PAID_INSURANCE':
      return {
        ...state,
        amountPaidInsurance: action.amountPaidInsurance,
      };
    case 'SET_AMOUNT_DUE':
      return {
        ...state,
        amountDue: action.amountDue,
      };
    case 'SET_AMOUNT_PAID_ATHLETE':
      return {
        ...state,
        amountPaidAthlete: action.amountPaidAthlete,
      };
    case 'SET_DATE_PAID_DATE':
      return {
        ...state,
        datePaidDate: action.datePaidDate,
      };
    case 'SET_ANNOTATION_DATE':
      return {
        ...state,
        annotationDate: action.annotationDate,
      };

    case 'ADD_ANOTHER_BILLABLE_ITEM': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice();

      appliedBillableItems.push({
        key: appliedBillableItems.length + 1,
        isDeleted: false,
        isBillable: false,
        cptCode: '',
        amountCharged: '0',
        discountOrReduction: '0',
        amountPaidInsurance: '0',
        amountDue: '0',
        amountPaidAthlete: '0',
        datePaidDate: null,
      });
      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'REMOVE_MULTI_CPT': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice();

      const itemToRemove = appliedBillableItems[action.index];
      // If persisted (has id), mark as deleted; otherwise remove from array
      if (itemToRemove?.id) {
        appliedBillableItems[action.index] = {
          ...appliedBillableItems[action.index],
          isDeleted: true,
        };
      } else {
        // Physically remove unsaved items and rekey remaining
        const filtered = appliedBillableItems
          .filter((_, index) => index !== action.index)
          .map((billableItem, index) => ({
            ...billableItem,
            key: index + 1,
          }));
        return {
          ...state,
          queuedBillableItems: filtered,
        };
      }

      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'REMOVE_MULTI_CPT_ON_OVERVIEW': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice().map((billableItem, index) => ({
          ...billableItem,
          isDeleted: action.index === index || billableItem.isDeleted,
        }));

      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'SET_MULTI_CPT_CODE': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice();

      appliedBillableItems[action.index] = {
        ...appliedBillableItems[action.index],
        cptCode: action.cptCode,
      };

      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'SET_MULTI_IS_BILLABLE': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice();

      appliedBillableItems[action.index] = {
        ...appliedBillableItems[action.index],
        isBillable: action.isBillable,
        amountCharged: action.isBillable ? '0' : '0',
        discountOrReduction: action.isBillable ? '0' : '0',
        amountPaidInsurance: action.isBillable ? '0' : '0',
        amountDue: action.isBillable ? '0' : '0',
        amountPaidAthlete: action.isBillable ? '0' : '0',
        datePaidDate: action.isBillable
          ? appliedBillableItems[action.index].datePaidDate
          : null,
      };
      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'SET_MULTI_AMOUNT_CHARGED': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice();

      appliedBillableItems[action.index] = {
        ...appliedBillableItems[action.index],
        amountCharged: action.amountCharged,
      };
      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'SET_MULTI_DISCOUNT_OR_REDUCTION': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice();

      appliedBillableItems[action.index] = {
        ...appliedBillableItems[action.index],
        discountOrReduction: action.discountOrReduction,
      };
      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'SET_MULTI_AMOUNT_PAID_INSURANCE': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice();

      appliedBillableItems[action.index] = {
        ...appliedBillableItems[action.index],
        amountPaidInsurance: action.amountPaidInsurance,
      };
      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'SET_MULTI_AMOUNT_DUE': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice();

      appliedBillableItems[action.index] = {
        ...appliedBillableItems[action.index],
        amountDue: action.amountDue,
      };
      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'SET_MULTI_AMOUNT_PAID_ATHLETE': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice();

      appliedBillableItems[action.index] = {
        ...appliedBillableItems[action.index],
        amountPaidAthlete: action.amountPaidAthlete,
      };
      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'SET_MULTI_DATE_PAID_DATE': {
      const appliedBillableItems: Array<BillableItem> =
        state.queuedBillableItems.slice();

      appliedBillableItems[action.index] = {
        ...appliedBillableItems[action.index],
        datePaidDate: action.datePaidDate,
      };
      return {
        ...state,
        queuedBillableItems: appliedBillableItems,
      };
    }
    case 'SET_MULTI_BILLABLE_ITEMS':
      return {
        ...state,
        queuedBillableItems: action.queuedBillableItems,
      };
    case 'UPDATE_QUEUED_ATTACHMENTS':
      return {
        ...state,
        queuedAttachments: action.queuedAttachments,
      };
    case 'UPDATE_ATTACHMENT_TYPE':
      return {
        ...state,
        queuedAttachmentTypes: [
          ...state.queuedAttachmentTypes,
          action.queuedAttachmentType,
        ],
      };
    case 'REMOVE_ATTACHMENT_TYPE':
      return {
        ...state,
        queuedAttachmentTypes: state.queuedAttachmentTypes.filter(
          (type) => type !== action.queuedAttachmentType
        ),
        queuedAttachments:
          action.queuedAttachmentType === 'FILE' ? [] : state.queuedAttachments,
      };
    case 'SET_LINK_TITLE':
      return {
        ...state,
        linkTitle: action.linkTitle,
      };
    case 'SET_LINK_URI':
      return {
        ...state,
        linkUri: action.linkUri,
      };
    case 'UPDATE_QUEUED_LINKS': {
      const copiedQueuedLinks = [...state.queuedLinks, ...action.queuedLinks];

      return {
        ...state,
        queuedLinks: copiedQueuedLinks.map((queuedLink, index) => {
          return { ...queuedLink, id: index };
        }),
      };
    }
    case 'CLEAR_QUEUED_LINKS': {
      return {
        ...state,
        queuedLinks: [],
      };
    }
    case 'CLEAR_LINK_ATTACHMENT': {
      return {
        ...state,
        queuedAttachmentTypes: state.queuedAttachmentTypes.filter(
          (type) => type !== 'LINK'
        ),
        queuedLinks: [],
        linkTitle: '',
        linkUri: '',
      };
    }
    case 'REMOVE_QUEUED_LINK':
      return {
        ...state,
        queuedLinks: state.queuedLinks.filter(
          (queuedLink) => queuedLink.id !== action.id
        ),
      };
    case 'SET_REDOX_ORDER_STATUS': {
      return {
        ...state,
        redoxOrderStatus: action.redoxOrderStatus,
      };
    }
    case 'SET_LATERALITY':
      return {
        ...state,
        lateralityId: action.lateralityId,
      };
    case 'ADD_ANOTHER_MULTI_ORDER': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();
      appliedQueuedDiagnostics.push({
        key: appliedQueuedDiagnostics.length + 1,
        diagnosticType: null,
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
      });
      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'REMOVE_MULTI_ORDER': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics
          .slice()
          .filter((item, index) => index !== action.index)
          .map((diagnosticType, index) => ({
            ...diagnosticType,
            key: index + 1,
          }));

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'SET_MULTI_ORDER_TYPE': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        diagnosticType: action.diagnosticType,
      };
      // need to initialize if answers are required
      if (action.diagnosticType?.diagnostic_type_questions?.length) {
        const appliedAnswers =
          action.diagnosticType.diagnostic_type_questions.map(
            (question, answerIndex) => ({
              answerIndex,
              questionTypeId: question.id,
              questionType: question.question_type,
              value: null,
              optionalTextRequired: null,
              label: question.label,
              required: question.required,
            })
          );
        appliedQueuedDiagnostics[action.index] = {
          ...appliedQueuedDiagnostics[action.index],
          answers: appliedAnswers,
        };

        return {
          ...state,
          queuedDiagnostics: appliedQueuedDiagnostics,
        };
      }

      // ensure that the answers array is fresh if there are no questions
      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        answers: [],
      };

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }

    case 'SET_MULTI_DIAGNOSTICS_TYPE': {
      // copy of current DIAGNOSTIC SECTIONS
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      // need to know if the is a diagnostic type in multi-select
      // that requires "Ask On Entry Questions" will need to render dynamically

      const diagnosticWithQuestionsOrLaterality = action.diagnosticTypes.find(
        (type) => {
          return (
            type.diagnostic_type_questions?.length || type.laterality_required
          );
        }
      );

      // this function returns an array of diagnostics
      // that populate the multi-select within each DIAGNOSTIC SECTION
      const getDiagnosticTypes = (actionPayload) => {
        // check if Array Type in order to not break at runtime
        if (Array.isArray(actionPayload)) {
          // if the most recent action is an order set,
          // then we need to remove the parent option from the array
          // and spread the contents with the other options
          if (
            actionPayload[actionPayload.length - 1]?.type === 'order set' &&
            !diagnosticWithQuestionsOrLaterality
          ) {
            const filteredArray = actionPayload.filter(
              (diagnosticType) =>
                diagnosticType.type !== 'order set' ||
                diagnosticType.type === undefined ||
                diagnosticType.diagnostic_type_questions?.length === 0
            );

            const foundArray =
              actionPayload.find(({ type }) => type === 'order set')?.options ||
              [];

            return [...filteredArray, ...foundArray];
          }
          if (
            actionPayload[actionPayload.length - 1]?.type === 'order set' &&
            diagnosticWithQuestionsOrLaterality
          ) {
            const filteredArray = actionPayload.filter(
              (diagnosticType) =>
                diagnosticType.type !== 'order set' ||
                diagnosticType.type === undefined ||
                diagnosticType.diagnostic_type_questions?.length === 0
            );

            const foundArray =
              actionPayload.find(({ type }) => type === 'order set')?.options ||
              [];

            const arrayToReturn = [...filteredArray, ...foundArray];

            if (
              arrayToReturn.every(
                (type) => type.diagnostic_type_questions?.length
              )
            ) {
              arrayToReturn.slice(1, arrayToReturn.length).forEach((type) => {
                if (type.diagnostic_type_questions?.length) {
                  const appliedAnswers = type.diagnostic_type_questions.map(
                    (question, answerIndex) => ({
                      answerIndex,
                      questionTypeId: question.id,
                      questionType: question.question_type,
                      value: null,
                      optionalTextRequired: null,
                      label: question.label,
                      required: question.required,
                    })
                  );
                  // push a new section
                  appliedQueuedDiagnostics.push({
                    key: appliedQueuedDiagnostics.length + 1,
                    diagnosticType: type || null,
                    diagnosticTypes: type ? [type] : [],
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
                    answers: appliedAnswers,
                  });
                }
              });
              return [arrayToReturn[0]];
            }

            arrayToReturn.forEach((type) => {
              if (type.diagnostic_type_questions?.length) {
                const appliedAnswers = type.diagnostic_type_questions.map(
                  (question, answerIndex) => ({
                    answerIndex,
                    questionTypeId: question.id,
                    questionType: question.question_type,
                    value: null,
                    optionalTextRequired: null,
                    label: question.label,
                    required: question.required,
                  })
                );
                appliedQueuedDiagnostics.push({
                  key: appliedQueuedDiagnostics.length + 1,
                  diagnosticType: type || null,
                  diagnosticTypes: type ? [type] : [],
                  athleteId: state.athleteId,
                  orderProviderSGID: state.orderProviderSGID,
                  userId: state.userId,
                  locationId: state.locationId,
                  reasonId: state.reasonId,
                  bodyAreaId: null,
                  diagnosticDate: null,
                  orderDate: null,
                  illnessIds: state.illnessIds,
                  injuryIds: state.injuryIds,
                  annotationContent: '',
                  restrictAccessTo: 'DEFAULT',
                  queuedAttachments: [],
                  queuedAttachmentTypes: [],
                  linkTitle: '',
                  linkUri: '',
                  queuedLinks: [],
                  lateralityId: null,
                  answers: appliedAnswers,
                });
              }
            });

            return arrayToReturn.filter(
              (diagnosticType) =>
                diagnosticType.diagnostic_type_questions?.length === 0
            );
          }
        }

        // need to initialize if answers are required
        if (diagnosticWithQuestionsOrLaterality) {
          const appliedAnswers =
            diagnosticWithQuestionsOrLaterality?.diagnostic_type_questions?.map(
              (question, answerIndex) => ({
                answerIndex,
                questionTypeId: question.id,
                questionType: question.question_type,
                value: null,
                optionalTextRequired: null,
                label: question.label,
                required: question.required,
              })
            ) || [];

          if (actionPayload.length === 1) {
            appliedQueuedDiagnostics[action.index] = {
              ...appliedQueuedDiagnostics[action.index],
              answers: appliedAnswers,
            };
          }
          if (actionPayload.length > 1) {
            appliedQueuedDiagnostics.push({
              key: appliedQueuedDiagnostics.length + 1,
              diagnosticType: diagnosticWithQuestionsOrLaterality || null,
              diagnosticTypes: diagnosticWithQuestionsOrLaterality
                ? [diagnosticWithQuestionsOrLaterality]
                : [],
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
              answers: appliedAnswers,
            });
            const filteredArray = actionPayload.filter(
              (diagnosticType) =>
                (diagnosticType.diagnostic_type_questions?.length === 0 ||
                  !diagnosticType.diagnostic_type_questions) &&
                !diagnosticType.laterality_required
            );
            return filteredArray;
          }
        }

        // fallback if somehow actionPayload is NOT and Array Type
        return action.diagnosticTypes;
      };

      if (
        !diagnosticWithQuestionsOrLaterality?.diagnostic_type_questions?.length
      ) {
        appliedQueuedDiagnostics[action.index] = {
          ...appliedQueuedDiagnostics[action.index],
          answers: [],
        };
      }

      const getDiagnosticType = () => {
        // only want to show questions or laterality if the diagnostic is by itself
        // this check ensures that we clear the questions if questions
        // were already rendered when the user selected another diagnostic
        if (
          diagnosticWithQuestionsOrLaterality &&
          appliedQueuedDiagnostics[action.index].diagnosticTypes.length === 1
        ) {
          return diagnosticWithQuestionsOrLaterality;
        }
        return null;
      };

      // reminder: appliedQueuedDiagnostics are SECTIONS
      // this index refers to the SECTION not multi-select
      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        // need to filter out diagnostics w/ Ask On Entry if they exist
        diagnosticTypes: getDiagnosticTypes(action.diagnosticTypes),
        // need to initialize diagnosticType if Ask On Entry Questions req.
        diagnosticType: getDiagnosticType(),
      };

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }

    case 'SET_DIAGNOSTIC_TYPE_GROUP_SET': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        action.diagnosticTypeGroupSet.map((diagnosticType, index) => {
          return {
            key: index + 1,
            diagnosticType,
            diagnosticTypes: [],
            athleteId: null,
            orderProviderSGID:
              state.queuedDiagnostics[index]?.orderProviderSGID || null,
            userId: null,
            locationId: null,
            reasonId: null,
            bodyAreaId: state.queuedDiagnostics[index]?.bodyAreaId || null,
            diagnosticDate:
              state.queuedDiagnostics[index]?.diagnosticDate || null,
            orderDate: state.queuedDiagnostics[index]?.orderDate || null,
            illnessIds: [],
            injuryIds: [],
            annotationContent: '',
            restrictAccessTo: 'DEFAULT',
            queuedAttachments: [],
            queuedAttachmentTypes: [],
            linkTitle: '',
            linkUri: '',
            queuedLinks: [],
            lateralityId: state.queuedDiagnostics[index]?.lateralityId || null,
            answers: diagnosticType.diagnostic_type_questions?.length
              ? diagnosticType.diagnostic_type_questions.map(
                  (question, answerIndex) => ({
                    answerIndex,
                    questionTypeId: question.id,
                    questionType: question.question_type,
                    value: null,
                    optionalTextRequired: null,
                    label: question.label,
                    required: question.required,
                  })
                )
              : [],
          };
        });

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }

    case 'SET_MULTI_ORDER_PROVIDER_SGID': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();
      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        orderProviderSGID: action.orderProviderSGID,
      };
      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'SET_MULTI_ORDER_DATE': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        orderDate: action.orderDate,
      };

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'SET_MULTI_ORDER_APPOINTMENT_DATE': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        diagnosticDate: action.diagnosticDate,
      };

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'SET_MULTI_BODY_AREA_ID': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        bodyAreaId: action.bodyAreaId,
      };

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'SET_MULTI_LATERALITY': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        lateralityId: action.lateralityId,
      };

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'SET_MULTI_NOTE_CONTENT': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        annotationContent: action.annotationContent,
      };

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }

    case 'UPDATE_MULTI_ATTACHMENT_TYPE': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        queuedAttachmentTypes: [
          ...appliedQueuedDiagnostics[action.index].queuedAttachmentTypes,
          action.queuedAttachmentType,
        ],
      };

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'REMOVE_MULTI_ATTACHMENT_TYPE': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        queuedAttachmentTypes: appliedQueuedDiagnostics[
          action.index
        ].queuedAttachmentTypes.filter(
          (type) => type !== action.queuedAttachmentType
        ),
        queuedAttachments:
          action.queuedAttachmentType === 'FILE'
            ? []
            : appliedQueuedDiagnostics[action.index].queuedAttachments,
      };

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'CLEAR_MULTI_QUEUED_LINKS': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        queuedLinks: [],
      };
      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'SET_MULTI_LINK_TITLE': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        linkTitle: action.linkTitle,
      };
      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'SET_MULTI_LINK_URI': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        linkUri: action.linkUri,
      };
      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'UPDATE_MULTI_QUEUED_LINKS': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();
      const copiedQueuedLinks = [
        ...state.queuedDiagnostics[action.index].queuedLinks,
        ...action.queuedLinks,
      ];

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        queuedLinks: copiedQueuedLinks.map((queuedLink, index) => {
          return { ...queuedLink, id: index };
        }),
      };
      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'REMOVE_MULTI_QUEUED_LINK': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        queuedLinks: appliedQueuedDiagnostics[action.index].queuedLinks.filter(
          (queuedLink) => queuedLink.id !== action.id
        ),
      };
      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'UPDATE_MULTI_QUEUED_ATTACHMENTS': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      appliedQueuedDiagnostics[action.index] = {
        ...appliedQueuedDiagnostics[action.index],
        queuedAttachments: action.queuedAttachments,
      };
      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }
    case 'SET_FOR_ALL': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics.map((diagnostic) => ({
          ...diagnostic,
          orderProviderSGID: state.queuedDiagnostics[0].orderProviderSGID,
          bodyAreaId: state.queuedDiagnostics[0].bodyAreaId,
          diagnosticDate: state.queuedDiagnostics[0].diagnosticDate,
          orderDate: state.queuedDiagnostics[0].orderDate,
        })),
      };
    }
    case 'SET_DIAGNOSTIC_TO_UPDATE': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();
      const illnessIds = action.diagnosticToUpdate?.issue_occurrences
        ?.filter((item) => item.issue_type === 'Illness')
        .map((item) => item.issue_id);

      const injuryIds = action.diagnosticToUpdate?.issue_occurrences
        ?.filter((item) => item.issue_type === 'Injury')
        .map((item) => item.issue_id);

      appliedQueuedDiagnostics[0] = {
        ...appliedQueuedDiagnostics[0],
        key: 1,
        diagnosticType: {
          ...action.diagnosticToUpdate?.diagnostic_type,
          value: action.diagnosticToUpdate?.diagnostic_type?.id,
        },
        athleteId: action.diagnosticToUpdate?.athlete?.id,
        userId: action.diagnosticToUpdate?.prescriber?.id,
        orderProviderSGID: action.diagnosticToUpdate?.provider?.sgid,
        locationId: action.diagnosticToUpdate?.location?.id,
        reasonId: action.diagnosticToUpdate?.diagnostic_reason?.id || null,
        bodyAreaId: action.diagnosticToUpdate?.body_area_id,
        diagnosticDate: action.diagnosticToUpdate?.diagnostic_date,
        orderDate: action.diagnosticToUpdate?.order_date,
        restrictAccessTo: 'DEFAULT',
        lateralityId: action.diagnosticToUpdate?.laterality?.id,
        illnessIds,
        injuryIds,
      };

      // Map billing information for edit mode (single and multi-billing)
      const billableItems = Array.isArray(
        action.diagnosticToUpdate?.billable_items
      )
        ? action.diagnosticToUpdate.billable_items
        : [];

      const mappedQueuedBillableItems = billableItems.map((item, index) => ({
        key: item?.id ?? index + 1,
        id: item?.id,
        isDeleted: false,
        cptCode: item?.cpt_code || '',
        isBillable: !!item?.is_billable,
        amountCharged: safeNumberString(item?.amount_charged),
        discountOrReduction: safeNumberString(item?.discount),
        amountPaidInsurance: safeNumberString(item?.amount_paid_insurance),
        amountDue: safeNumberString(item?.amount_due),
        amountPaidAthlete: safeNumberString(item?.amount_paid_athlete),
        datePaidDate: item?.date_paid ?? null,
      }));

      const firstBillable =
        mappedQueuedBillableItems.length > 0
          ? mappedQueuedBillableItems[0]
          : null;

      return {
        ...state,
        athleteId: action.diagnosticToUpdate.athlete?.id,
        userId: action.diagnosticToUpdate?.prescriber?.id,
        locationId: action.diagnosticToUpdate.location?.id,
        reasonId: action.diagnosticToUpdate?.diagnostic_reason?.id || null,
        illnessIds,
        injuryIds,
        queuedDiagnostics: appliedQueuedDiagnostics,
        diagnosticType: {
          ...action.diagnosticToUpdate?.diagnostic_type,
          value: action.diagnosticToUpdate?.diagnostic_type?.id,
        },
        diagnosticDate: action.diagnosticToUpdate?.diagnostic_date,
        referringPhysician:
          action.diagnosticToUpdate?.referring_physician || '',
        // Populate single-billing fields from top-level fields if present,
        // otherwise fall back to first billable item if available, else keep defaults
        isBillable:
          typeof action.diagnosticToUpdate?.is_billable === 'boolean'
            ? action.diagnosticToUpdate.is_billable
            : firstBillable?.isBillable ?? state.isBillable,
        cptCode:
          (action.diagnosticToUpdate?.cpt_code ??
            firstBillable?.cptCode ??
            state.cptCode) ||
          '',
        amountCharged: safeNumberString(
          action.diagnosticToUpdate?.amount_charged ??
            firstBillable?.amountCharged ??
            state.amountCharged
        ),
        discountOrReduction: safeNumberString(
          action.diagnosticToUpdate?.discount ??
            firstBillable?.discountOrReduction ??
            state.discountOrReduction
        ),
        amountPaidInsurance: safeNumberString(
          action.diagnosticToUpdate?.amount_paid_insurance ??
            firstBillable?.amountPaidInsurance ??
            state.amountPaidInsurance
        ),
        amountDue: safeNumberString(
          action.diagnosticToUpdate?.amount_due ??
            firstBillable?.amountDue ??
            state.amountDue
        ),
        amountPaidAthlete: safeNumberString(
          action.diagnosticToUpdate?.amount_paid_athlete ??
            firstBillable?.amountPaidAthlete ??
            state.amountPaidAthlete
        ),
        datePaidDate:
          action.diagnosticToUpdate?.date_paid ??
          firstBillable?.datePaidDate ??
          state.datePaidDate,
        // Populate multi-billing items for multiple CPT flow
        queuedBillableItems: mappedQueuedBillableItems,
      };
    }

    case 'SET_DIAGNOSTIC_TYPE_ANSWER': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      const appliedAnswers =
        appliedQueuedDiagnostics[action.diagnosticIndex].answers.slice();

      appliedAnswers[action.answer.answerIndex] = {
        ...action.answer,
      };

      appliedQueuedDiagnostics[action.diagnosticIndex] = {
        ...appliedQueuedDiagnostics[action.diagnosticIndex],
        answers: appliedAnswers,
      };
      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }

    case 'SET_OPTIONAL_TEXT_ANSWER': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();
      const appliedAnswers: Array<Answer> =
        state.queuedDiagnostics[action.diagnosticIndex].answers.slice();

      appliedAnswers[action.answer.answerIndex] = {
        ...appliedAnswers[action.answer.answerIndex],
        optionalText: action.answer.optionalText,
      };

      appliedQueuedDiagnostics[action.diagnosticIndex] = {
        ...appliedQueuedDiagnostics[action.diagnosticIndex],
        answers: appliedAnswers,
      };
      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }

    case 'SET_CARDIAC_SCREENING_ANSWER': {
      const appliedQueuedDiagnostics: Array<QueuedDiagnostic> =
        state.queuedDiagnostics.slice();

      const appliedAnswers =
        appliedQueuedDiagnostics[action.diagnosticIndex].answers.slice();

      appliedAnswers[action.answer.answerIndex] = {
        ...action.answer,
      };

      appliedQueuedDiagnostics[action.diagnosticIndex] = {
        ...appliedQueuedDiagnostics[action.diagnosticIndex],
        answers: appliedAnswers,
      };

      return {
        ...state,
        queuedDiagnostics: appliedQueuedDiagnostics,
      };
    }

    case 'CLEAR_FORM':
      return {
        annotationDate: null,
        diagnosticType: null,
        athleteId: null,
        orderProviderSGID: null,
        userId: null,
        referringPhysician: '',
        locationId: null,
        reasonId: null,
        bodyAreaId: null,
        diagnosticDate: null,
        illnessIds: [],
        injuryIds: [],
        chronicIssueIds: [],
        covidTestDate: null,
        covidTestType: null,
        covidTestResult: null,
        covidTestReference: null,
        covidAntibodyTestDate: null,
        covidAntibodyTestType: null,
        covidAntibodyTestResult: null,
        covidAntibodyTestReference: null,
        medicationType: null,
        medicationDosage: null,
        medicationFrequency: null,
        medicationCourseCompleted: false,
        medicationCourseStartedAt: null,
        medicationCourseCompletedAt: null,
        medicationAnnotationContent: null,
        annotationContent: '',
        restrictAccessTo: 'DEFAULT',
        isBillable: false,
        cptCode: '',
        amountCharged: '0',
        discountOrReduction: '0',
        amountPaidInsurance: '0',
        amountDue: '0',
        amountPaidAthlete: '0',
        datePaidDate: null,
        queuedAttachments: [],
        queuedAttachmentTypes: [],
        queuedBillableItems: [],
        linkTitle: '',
        linkUri: '',
        queuedLinks: [],
        redoxOrderStatus: 0,
        lateralityId: null,
        queuedDiagnostics: [
          {
            key: 1,
            diagnosticType: null,
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
            annotationId: null,
            answers: [],
          },
        ],
      };

    default:
      return state;
  }
};

const useDiagnosticForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    initialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useDiagnosticForm;
