// @flow
import { useReducer } from 'react';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { Dispatch } from '../../../types';
import type { ProcedureType } from '../../../types/medical';

const sortAndOrderSelectOptions = (optionsArray: Array<any>) => {
  return optionsArray
    ?.map(({ id, name }) => ({
      value: id,
      label: name,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      return lowercaseA.localeCompare(lowercaseB);
    });
};

export type QueuedLinks = {
  title: string,
  uri: string,
  id?: number,
};
export type FormStateProcedureType = ProcedureType & {
  value: number,
  label: string,
};
export type QueuedProcedure = {
  key: number,
  procedureDate: ?string,
  procedureOrderDate: string,
  providerSgid: string | number | null,
  otherProvider: ?string,
  procedureType: FormStateProcedureType | null,
  procedureTypes: Array<FormStateProcedureType>,
  procedureReasons: Array<Object>,
  procedureComplications: Array<Object>,
  procedureDescription: string,
  procedureReason: number | null,
  procedureReasonOther: string,
  procedureComplicationIds: Array<number>,
  procedureComplicationOther: string,
  bodyAreaId: number | null,
  illnessIds: Array<number>,
  injuryIds: Array<number>,
  chronicIssueIds: Array<number>,
  procedureTiming: string | null,
  procedureTimingOther: string | null,
  procedureStartTime: string | null,
  procedureDuration: number | null,
  procedureAmount: number | null,
  procedureAmountUsed: number | null,
  procedureUrineGravity: number | null,
  noteContent: ?string,
  queuedAttachmentTypes: Array<string>,
  queuedAttachments: Array<AttachedFile>,
  queuedLinks: Array<QueuedLinks>,
  linkTitle: string,
  linkUri: string,
};

export type FormState = {
  reasonOptionsForIv: Array<Object>,
  reasonOptionsForNonIv: Array<Object>,
  complicationOptionsForIv: Array<Object>,
  complicationOptionsForNonIv: Array<Object>,
  athleteId: ?number,
  locationId: ?number,
  queuedProcedures: Array<QueuedProcedure>,
};

export type FormAction =
  | { type: 'SET_FORM_DATA', formData: Object }
  | { type: 'SET_ATHLETE_ID', athleteId: number }
  | { type: 'SET_LOCATION_ID', locationId: number }
  | { type: 'SET_NOTE_CONTENT', index: number, noteContent: string }
  | { type: 'SET_OTHER_PROVIDER', index: number, otherProvider: ?string }
  | {
      type: 'SET_PROCEDURE_TYPE',
      index: number,
      procedureType: FormStateProcedureType | null,
    }
  | {
      type: 'SET_MULTI_PROCEDURE_TYPES',
      index: number,
      procedureTypes: Array<FormStateProcedureType>,
    }
  | {
      type: 'SET_PROCEDURE_ORDER_DATE',
      index: number,
      procedureOrderDate: string,
    }
  | {
      type: 'SET_PROCEDURE_DESCRIPTION',
      index: number,
      procedureDescription: string,
    }
  | {
      type: 'SET_PROCEDURE_REASON',
      index: number,
      procedureReason: number | null,
    }
  | {
      type: 'SET_PROCEDURE_REASON_OTHER',
      index: number,
      procedureReasonOther: string,
    }
  | {
      type: 'SET_PROCEDURE_COMPLICATION_IDS',
      index: number,
      procedureComplicationIds: Array<number>,
    }
  | {
      type: 'SET_PROCEDURE_COMPLICATION_OTHER',
      index: number,
      procedureComplicationOther: string,
    }
  | { type: 'SET_BODY_AREA_ID', index: number, bodyAreaId: number | null }
  | { type: 'SET_ILLNESS_IDS', index: number, illnessIds: Array<number> }
  | { type: 'SET_INJURY_IDS', index: number, injuryIds: Array<number> }
  | { type: 'SET_CHRONIC_IDS', index: number, chronicIssueIds: Array<number> }
  | { type: 'SET_PROCEDURE_TIMING', index: number, procedureTiming: string }
  | {
      type: 'SET_PROCEDURE_TIMING_OTHER',
      index: number,
      procedureTimingOther: string | null,
    }
  | {
      type: 'SET_PROCEDURE_START_TIME',
      index: number,
      procedureStartTime: string | null,
    }
  | {
      type: 'SET_PROCEDURE_DURATION',
      index: number,
      procedureDuration: number | null,
    }
  | {
      type: 'SET_PROCEDURE_IV_AMOUNT',
      index: number,
      procedureAmount: number | null,
    }
  | {
      type: 'SET_PROCEDURE_IV_AMOUNT_USED',
      index: number,
      procedureAmountUsed: number | null,
    }
  | {
      type: 'SET_PROCEDURE_IV_URINE_GRAVITY',
      index: number,
      procedureUrineGravity: number | null,
    }
  | {
      type: 'REMOVE_ATTACHMENT_TYPE',
      index: number,
      queuedAttachmentType: string,
    }
  | {
      type: 'UPDATE_ATTACHMENT_TYPE',
      index: number,
      queuedAttachmentType: string,
    }
  | {
      type: 'UPDATE_QUEUED_ATTACHMENTS',
      index: number,
      queuedAttachments: Array<AttachedFile>,
    }
  | { type: 'CLEAR_QUEUED_LINKS', index: number }
  | { type: 'SET_LINK_TITLE', index: number, linkTitle: string }
  | { type: 'SET_LINK_URI', index: number, linkUri: string }
  | { type: 'REMOVE_QUEUED_LINK', index: number, id: ?number }
  | {
      type: 'UPDATE_QUEUED_LINKS',
      index: number,
      queuedLinks: QueuedLinks[],
    }
  | { type: 'ADD_ANOTHER_PROCEDURE' }
  | { type: 'REMOVE_PROCEDURE', index: number }
  | { type: 'SET_PROCEDURE_DATE', index: number, procedureDate: string }
  | {
      type: 'SET_PROVIDER_SGID',
      index: number,
      providerSgid: string | number | null,
    }
  | {
      type: 'CLEAR_PROCEDURE_IV_FIELDS',
      index: number,
    }
  | { type: 'SET_FOR_ALL' }
  | { type: 'CLEAR_FORM' }
  | { type: 'CLEAR_MULTI_FORM' };

export const initialFormState = {
  reasonOptionsForIv: [],
  reasonOptionsForNonIv: [],
  complicationOptionsForIv: [],
  complicationOptionsForNonIv: [],
  athleteId: null,
  locationId: null,
  queuedProcedures: [
    {
      key: 1,
      procedureDate: '',
      providerSgid: null,
      procedureType: null,
      procedureTypes: [],
      procedureReasons: [],
      procedureComplications: [],
      procedureOrderDate: '',
      procedureDescription: '',
      procedureReason: null,
      procedureReasonOther: '',
      procedureComplicationIds: [],
      procedureComplicationOther: '',
      bodyAreaId: null,
      illnessIds: [],
      injuryIds: [],
      chronicIssueIds: [],
      procedureTiming: null,
      procedureTimingOther: null,
      procedureStartTime: null,
      procedureDuration: null,
      procedureAmount: null,
      procedureAmountUsed: null,
      procedureUrineGravity: null,
      queuedAttachments: [],
      linkTitle: '',
      linkUri: '',
      queuedLinks: [],
      queuedAttachmentTypes: [],
      noteContent: null,
      otherProvider: '',
    },
  ],
};

const formReducer = (
  state: FormState = initialFormState,
  action: FormAction
) => {
  switch (action.type) {
    case 'SET_FOR_ALL': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures.map((procedure) => ({
          ...procedure,
          providerSgid: state.queuedProcedures[0].providerSgid,
          procedureDate: state.queuedProcedures[0].procedureDate,
          procedureOrderDate: state.queuedProcedures[0].procedureOrderDate,
          illnessIds: state.queuedProcedures[0].illnessIds,
          injuryIds: state.queuedProcedures[0].injuryIds,
          chronicIssueIds: state.queuedProcedures[0].chronicIssueIds,
          bodyAreaId: state.queuedProcedures[0].bodyAreaId,
        })),
      };
    }
    case 'SET_FORM_DATA': {
      const sortedIvReasons = sortAndOrderSelectOptions(
        action.formData.procedure_reasons?.filter(
          ({ intravenous }) => intravenous
        )
      );
      const sortedNonIvReasons = sortAndOrderSelectOptions(
        action.formData.procedure_reasons?.filter(
          ({ intravenous }) => !intravenous
        )
      );
      const sortedIvComplications = sortAndOrderSelectOptions(
        action.formData.procedure_complications?.filter(
          (procedure) => procedure.intravenous
        )
      );
      const sortedNonIvComplications = sortAndOrderSelectOptions(
        action.formData.procedure_complications?.filter(
          (procedure) => !procedure.intravenous
        )
      );

      return {
        ...state,
        reasonOptionsForIv: [
          ...sortedIvReasons,
          {
            value: -1,
            label: 'Other',
          },
        ],
        reasonOptionsForNonIv: [
          ...sortedNonIvReasons,
          {
            value: -1,
            label: 'Other',
          },
        ],
        complicationOptionsForIv: [
          ...sortedIvComplications,
          {
            value: -1,
            label: 'Other',
          },
        ],
        complicationOptionsForNonIv: [
          ...sortedNonIvComplications,
          {
            value: -1,
            label: 'Other',
          },
        ],
      };
    }
    case 'SET_ATHLETE_ID':
      return {
        ...state,
        athleteId: action.athleteId,
      };

    case 'SET_LOCATION_ID':
      return {
        ...state,
        locationId: action.locationId,
      };

    case 'SET_NOTE_CONTENT': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        noteContent: action.noteContent,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_PROVIDER_SGID': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        providerSgid: action.providerSgid,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_PROCEDURE_TYPE': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureType: action.procedureType,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_MULTI_PROCEDURE_TYPES': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      const containsProcedureWithIvFields = action.procedureTypes.find(
        ({ intravenous }) => intravenous
      );

      const allProcedureTypesAreIv = action.procedureTypes.every(
        ({ intravenous }) => intravenous
      );
      if (containsProcedureWithIvFields && !allProcedureTypesAreIv) {
        appliedQueuedProcedures.push({
          key: appliedQueuedProcedures.length + 1,
          procedureDate: '',
          providerSgid: null,
          procedureType: containsProcedureWithIvFields,
          procedureTypes: [containsProcedureWithIvFields],
          procedureOrderDate: '',
          procedureDescription: '',
          procedureReason:
            containsProcedureWithIvFields?.default_procedure_reason_id || null,
          procedureReasonOther: '',
          procedureComplicationIds: [],
          procedureComplicationOther: '',
          bodyAreaId: null,
          illnessIds: [],
          injuryIds: [],
          chronicIssueIds: [],
          procedureTiming: null,
          procedureTimingOther: null,
          procedureStartTime: null,
          procedureDuration: null,
          procedureAmount: null,
          procedureAmountUsed: null,
          procedureUrineGravity: null,
          queuedAttachments: [],
          linkTitle: '',
          linkUri: '',
          queuedLinks: [],
          queuedAttachmentTypes: [],
          noteContent: null,
          otherProvider: '',
          procedureReasons: state.reasonOptionsForIv,
          procedureComplications: state.complicationOptionsForIv,
        });
      }
      if (containsProcedureWithIvFields && allProcedureTypesAreIv) {
        action.procedureTypes
          .slice(1, action.procedureTypes.length)
          .forEach((procedureType) => {
            if (procedureType.intravenous) {
              appliedQueuedProcedures.push({
                key: appliedQueuedProcedures.length + 1,
                procedureDate: '',
                providerSgid: null,
                procedureType,
                procedureTypes: [procedureType],
                procedureOrderDate: '',
                procedureDescription: '',
                procedureReason:
                  procedureType?.default_procedure_reason_id || null,
                procedureReasonOther: '',
                procedureComplicationIds: [],
                procedureComplicationOther: '',
                bodyAreaId: null,
                illnessIds: [],
                injuryIds: [],
                chronicIssueIds: [],
                procedureTiming: null,
                procedureTimingOther: null,
                procedureStartTime: null,
                procedureDuration: null,
                procedureAmount: null,
                procedureAmountUsed: null,
                procedureUrineGravity: null,
                queuedAttachments: [],
                linkTitle: '',
                linkUri: '',
                queuedLinks: [],
                queuedAttachmentTypes: [],
                noteContent: null,
                otherProvider: '',
                procedureReasons: state.reasonOptionsForIv,
                procedureComplications: state.complicationOptionsForIv,
              });
            }
          });

        appliedQueuedProcedures[action.index] = {
          ...appliedQueuedProcedures[action.index],
          procedureTypes: action.procedureTypes.slice(0, 1),
          procedureType: action.procedureTypes[0],
          procedureReasons: state.reasonOptionsForIv,
          procedureReason:
            action.procedureTypes[0]?.default_procedure_reason_id || null,
          procedureComplications: state.complicationOptionsForIv,
        };
      }
      if (
        !containsProcedureWithIvFields ||
        (containsProcedureWithIvFields && !allProcedureTypesAreIv)
      ) {
        appliedQueuedProcedures[action.index] = {
          ...appliedQueuedProcedures[action.index],

          procedureTypes: action.procedureTypes.filter(
            ({ intravenous }) => !intravenous
          ),
          procedureType: action.procedureTypes.filter(
            ({ intravenous }) => !intravenous
          )[0],
          procedureReasons: state.reasonOptionsForNonIv,
          procedureReason:
            (state.reasonOptionsForNonIv.includes(
              appliedQueuedProcedures[action.index].procedureReason
            ) &&
              appliedQueuedProcedures[action.index].procedureReason) ||
            action.procedureTypes.filter(({ intravenous }) => !intravenous)[0]
              ?.default_procedure_reason_id ||
            null,
        };
      }

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_OTHER_PROVIDER': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        otherProvider: action.otherProvider,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_PROCEDURE_ORDER_DATE': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureOrderDate: action.procedureOrderDate,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }
    case 'SET_PROCEDURE_DESCRIPTION': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureDescription: action.procedureDescription,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_PROCEDURE_REASON': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureReason: action.procedureReason,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }
    case 'SET_PROCEDURE_REASON_OTHER': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureReasonOther: action.procedureReasonOther,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_PROCEDURE_COMPLICATION_OTHER': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureComplicationOther: action.procedureComplicationOther,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_BODY_AREA_ID': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        bodyAreaId: action.bodyAreaId,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }
    case 'SET_CHRONIC_IDS': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        chronicIssueIds: action.chronicIssueIds,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }
    case 'SET_INJURY_IDS': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        injuryIds: action.injuryIds,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_ILLNESS_IDS': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        illnessIds: action.illnessIds,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }
    case 'SET_PROCEDURE_TIMING': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureTiming: action.procedureTiming,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }
    case 'SET_PROCEDURE_TIMING_OTHER': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureTimingOther: action.procedureTimingOther,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }
    case 'SET_PROCEDURE_START_TIME': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureStartTime: action.procedureStartTime,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_PROCEDURE_DURATION': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureDuration: action.procedureDuration,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_PROCEDURE_IV_AMOUNT': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureAmount: action.procedureAmount,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }
    case 'SET_PROCEDURE_IV_AMOUNT_USED': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureAmountUsed: action.procedureAmountUsed,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }
    case 'SET_PROCEDURE_IV_URINE_GRAVITY': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureUrineGravity: action.procedureUrineGravity,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'UPDATE_ATTACHMENT_TYPE': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        queuedAttachmentTypes: [
          ...appliedQueuedProcedures[action.index].queuedAttachmentTypes,
          action.queuedAttachmentType,
        ],
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'UPDATE_QUEUED_ATTACHMENTS': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        queuedAttachments: action.queuedAttachments,
      };
      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'REMOVE_ATTACHMENT_TYPE': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        queuedAttachmentTypes: appliedQueuedProcedures[
          action.index
        ].queuedAttachmentTypes.filter(
          (type) => type !== action.queuedAttachmentType
        ),
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'CLEAR_QUEUED_LINKS': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        queuedLinks: [],
        linkUri: '',
        linkTitle: '',
      };
      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_LINK_TITLE': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        linkTitle: action.linkTitle,
      };
      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_LINK_URI': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        linkUri: action.linkUri,
      };
      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'UPDATE_QUEUED_LINKS': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      const copiedQueuedLinks = [
        ...state.queuedProcedures[action.index].queuedLinks,
        ...action.queuedLinks,
      ];

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        queuedLinks: copiedQueuedLinks.map((queuedLink, index) => {
          return { ...queuedLink, id: index };
        }),
      };
      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'REMOVE_QUEUED_LINK': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        queuedLinks: appliedQueuedProcedures[action.index].queuedLinks.filter(
          (queuedLink) => queuedLink.id !== action.id
        ),
      };
      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'ADD_ANOTHER_PROCEDURE': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures.push({
        key: appliedQueuedProcedures.length + 1,
        procedureDate: '',
        providerSgid: null,
        procedureType: null,
        procedureTypes: [],
        procedureReasons: [],
        procedureComplications: [],
        procedureOrderDate: '',
        procedureDescription: '',
        procedureReason: null,
        procedureReasonOther: '',
        procedureComplicationIds: [],
        procedureComplicationOther: '',
        bodyAreaId: null,
        illnessIds: [],
        injuryIds: [],
        chronicIssueIds: [],
        procedureTiming: null,
        procedureTimingOther: null,
        procedureStartTime: null,
        procedureDuration: null,
        procedureAmount: null,
        procedureAmountUsed: null,
        procedureUrineGravity: null,
        queuedAttachments: [],
        linkTitle: '',
        linkUri: '',
        queuedLinks: [],
        queuedAttachmentTypes: [],
        noteContent: null,
        otherProvider: '',
      });

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'REMOVE_PROCEDURE': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures
          .filter((item, index) => index !== action.index)
          .map((diagnosticType, index) => ({
            ...diagnosticType,
            key: index + 1,
          }));

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_PROCEDURE_DATE': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureDate: action.procedureDate,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'SET_PROCEDURE_COMPLICATION_IDS': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureComplicationIds: action.procedureComplicationIds,
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }

    case 'CLEAR_PROCEDURE_IV_FIELDS': {
      const appliedQueuedProcedures: Array<QueuedProcedure> =
        state.queuedProcedures.slice();

      appliedQueuedProcedures[action.index] = {
        ...appliedQueuedProcedures[action.index],
        procedureStartTime: null,
        procedureDuration: null,
        procedureAmount: null,
        procedureAmountUsed: null,
        procedureUrineGravity: null,
        procedureTiming: '',
        procedureTimingOther: '',
      };

      return {
        ...state,
        queuedProcedures: appliedQueuedProcedures,
      };
    }
    case 'CLEAR_FORM':
      return {
        reasonOptionsForIv: state.reasonOptionsForIv,
        reasonOptionsForNonIv: state.reasonOptionsForNonIv,
        complicationOptionsForIv: state.complicationOptionsForIv,
        complicationOptionsForNonIv: state.complicationOptionsForNonIv,
        athleteId: null,
        locationId: null,
        queuedProcedures: [
          {
            key: 1,
            procedureDate: '',
            providerSgid: null,
            procedureType: null,
            procedureTypes: [],
            procedureReasons: [],
            procedureComplications: [],
            procedureOrderDate: '',
            procedureDescription: '',
            procedureReason: null,
            procedureReasonOther: '',
            procedureComplicationIds: [],
            procedureComplicationOther: '',
            bodyAreaId: null,
            illnessIds: [],
            injuryIds: [],
            chronicIssueIds: [],
            procedureTiming: null,
            procedureTimingOther: null,
            procedureStartTime: null,
            procedureDuration: null,
            procedureAmount: null,
            procedureAmountUsed: null,
            procedureUrineGravity: null,
            queuedAttachments: [],
            linkTitle: '',
            linkUri: '',
            queuedLinks: [],
            queuedAttachmentTypes: [],
            noteContent: null,
            otherProvider: '',
          },
        ],
      };

    case 'CLEAR_MULTI_FORM': {
      return {
        ...initialFormState,
        athleteId: state.athleteId,
      };
    }

    default:
      return state;
  }
};

const useProcedureForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    initialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useProcedureForm;
