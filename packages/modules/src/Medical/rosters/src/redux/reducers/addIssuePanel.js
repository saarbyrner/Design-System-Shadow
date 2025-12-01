// @flow
import moment from 'moment';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type { SecondaryPathology } from '@kitman/common/src/types/Coding';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { SelectOption } from '@kitman/components/src/AsyncSelect';
import {
  convertFileToUrl,
  transformFilesForUpload,
} from '@kitman/common/src/utils/fileHelper';
import {
  getFreetextValue,
  isV2MultiCodingSystem,
} from '@kitman/modules/src/Medical/shared/utils';
import type {
  DiagnosisAttachments,
  IssueAttachments,
} from '@kitman/modules/src/Medical/rosters/types';
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

const getDefaultInitialInfo = () => ({
  type: null,
  athlete: null,
  athleteData: null,
  diagnosisDate: null,
  reportedDate: null,
  chronicConditionOnsetDate: null,
  linkedChronicIssue: null,
  initialNote: '',
  issueId: null,
  previousIssue: null,
  previousIssueId: null,
  continuationIssueId: null,
  squadId: null,
  recurrenceOutsideSystem: false,
});

const getDefaultDiagnosisInfo = () => ({
  coding: {},
  supplementaryCoding: {},
  supplementalPathology: null,
  examinationDate: null,
  onset: null,
  onsetDescription: null,
  side: null,
  statuses: [{ status: '', date: moment(Date.now()).format('YYYY-MM-DD') }],
  concussion_assessments: [],
  isBamic: false,
  bamicGrade: null,
  bamicSite: null,
  secondary_pathologies: [],
});

const getDefaultEventInfo = () => ({
  diagnosisDate: moment(Date.now()).format('YYYY-MM-DD'),
  event: null,
  eventType: null,
  activity: null,
  mechanismDescription: null,
  positionWhenInjured: null,
  sessionCompleted: null,
  timeOfInjury: null,
  presentationType: null,
  injuryMechanismId: null,
  issueContactType: null,
  issueContactFreetext: '',
  events: {
    games: [],
    sessions: [],
  },
});

const getDefaultAdditionalInfo = () => ({
  annotations: [],
  conditionalFieldsAnswers: [],
  questions: [],
  requestStatus: null,
  linkedIssues: {
    illnesses: [],
    injuries: [],
  },
  issueLinks: [],
  issueFiles: [],
});

export default (
  state: $PropertyType<Store, 'addIssuePanel'> = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_ADD_ISSUE_PANEL': {
      return {
        ...state,
        isOpen: true,
        shouldRestoreData: false,
        initialInfo: {
          ...state.initialInfo,
          type: 'INJURY',
          athlete: action.payload.athleteId || null,
          squadId: action.payload.squadId || null,
          isAthleteSelectable: action.payload.isAthleteSelectable,
          athleteData: action.payload.athleteData,
        },
        eventInfo: {
          ...state.eventInfo,
          positionWhenInjured: action.payload.positionId || null,
        },
      };
    }
    case 'OPEN_ADD_ISSUE_PANEL_PREVIOUS_STATE': {
      return {
        ...state,
        ...action.payload.previousPanelState,
        isOpen: true,
        shouldRestoreData: true,
        requestStatus: null,
        pathologyGroupRequestStatus: null,
        page: 1,
      };
    }
    case 'CLOSE_ADD_ISSUE_PANEL': {
      // reset all state back to defaults
      return {
        ...state,
        isOpen: false,
        shouldRestoreData: false,
        title: '',
        initialInfo: {
          ...getDefaultInitialInfo(),
        },
        diagnosisInfo: { ...getDefaultDiagnosisInfo() },
        eventInfo: {
          ...getDefaultEventInfo(),
          events: state.eventInfo.events,
        },
        additionalInfo: {
          ...getDefaultAdditionalInfo(),
        },
        bamicGradesOptions: [],
        page: 1,
        requestStatus: null,
        pathologyGroupRequestStatus: null,
      };
    }

    case 'ADD_ADDITIONAL_ANNOTATION': {
      const appliedAnnotations: Array<IssueAttachments> =
        state.additionalInfo.annotations.slice();
      if (action.payload.attachmentType === 'NOTE') {
        const annotationObject: IssueAttachments = {
          id: appliedAnnotations.length + 1,
          type: 'NOTE',
          attachmentContent: {
            annotationable_type: 'Athlete',
            annotationable_id: state.initialInfo.athlete,
            organisation_annotation_type_id: null,
            title:
              state.initialInfo.type === 'INJURY'
                ? 'Injury note'
                : 'Illness note',
            annotation_date: moment().format(dateTransferFormat),
            content: '',
            attachments: [],
            illness_occurrence_ids: [],
            injury_occurrence_ids: [],
            restricted_to_doc: false,
            restricted_to_psych: false,
            attachments_attributes: [],
            annotation_actions_attributes: [],
            filesQueue: [],
          },
        };
        if (window.featureFlags['chronic-injury-illness']) {
          annotationObject.attachmentContent.chronic_issue_ids = [];
        }
        appliedAnnotations.push(annotationObject);
      }

      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          annotations: appliedAnnotations,
        },
      };
    }
    case 'SET_CONDITIONAL_FIELDS_REQUEST_STATUS': {
      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          requestStatus: action.payload.requestStatus,
        },
      };
    }
    case 'SET_CONDITIONAL_FIELDS_QUESTIONS': {
      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          questions: action.payload.questions,
        },
      };
    }
    case 'ADD_STATUS': {
      const appliedStatuses: Array<{
        status: string,
        date: string,
      }> = state.diagnosisInfo.statuses.slice();

      appliedStatuses.push({
        status: '',
        date: moment(Date.now()).format('YYYY-MM-DD'),
      });

      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          statuses: appliedStatuses,
        },
      };
    }
    case 'SET_PATHOLOGY_GROUP_REQUEST_STATUS': {
      return {
        ...state,
        pathologyGroupRequestStatus: action.payload.requestStatus,
      };
    }
    case 'CREATE_ISSUE_PENDING': {
      return {
        ...state,
        requestStatus: 'loading',
      };
    }
    case 'CREATE_ISSUE_FAILURE': {
      return {
        ...state,
        requestStatus: 'error',
      };
    }
    case 'CREATE_ISSUE_SUCCESS': {
      return {
        ...state,
        requestStatus: 'success',
        issueCreateResponse: action.payload,
      };
    }
    case 'ENTER_SUPPLEMENTAL_PATHOLOGY': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          supplementalPathology: action.payload.supplementalPathology,
        },
      };
    }
    case 'REMOVE_ADDITIONAL_ANNOTATION': {
      const appliedAnnotations: Array<IssueAttachments> = [
        ...state.additionalInfo.annotations,
      ]
        .filter((item, index) => index !== action.payload.index)
        .map((annotation, index) => ({
          ...annotation,
          id: index + 1,
        }));
      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          annotations: appliedAnnotations,
        },
      };
    }
    case 'REMOVE_STATUS': {
      const appliedStatuses: Array<{ status: string, date: string }> = [
        ...state.diagnosisInfo.statuses,
      ].filter((item, index) => index !== action.payload.index);

      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          statuses: appliedStatuses,
        },
      };
    }
    case 'REMOVE_SUPPLEMENTAL_PATHOLOGY': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          supplementalPathology: null,
        },
      };
    }
    case 'GO_TO_NEXT_PANEL_PAGE': {
      const nextPage = state.page + 1;
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          /*
           * Set the default examination date to today. We do not set
           * the default date at the store initialisation level because a user could
           * save the form before getting a chance to confirm the information.
           * To accommodate player movement and avoid a user being allowed to save an
           * issue with the examination date set to new Date() (today), it is now defaulted
           * to the initial reported date with the max date being the date the player
           * left the club, if present
           */
          examinationDate:
            nextPage === 2 && !state.diagnosisInfo.examinationDate
              ? state.initialInfo.reportedDate
              : state.diagnosisInfo.examinationDate,
        },
        page: nextPage,
      };
    }
    case 'GO_TO_PREVIOUS_PANEL_PAGE': {
      return {
        ...state,
        page: state.page - 1,
      };
    }
    case 'SELECT_ACTIVITY': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          activity: action.payload.activity,
        },
      };
    }
    case 'UPDATE_PRIMARY_MECHANISM_FREE_TEXT': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          primaryMechanismFreetext: action.payload.freeText,
        },
      };
    }
    case 'SELECT_ATHLETE': {
      return {
        ...state,
        initialInfo: {
          ...state.initialInfo,
          athlete: action.payload.athleteId,
        },
      };
    }
    case 'SELECT_ATHLETE_DATA': {
      return {
        ...state,
        initialInfo: {
          ...state.initialInfo,
          athleteData: action.payload.athleteData,
        },
      };
    }
    case 'SELECT_BODY_AREA': {
      if (action.payload.codingSystem === codingSystemKeys.OSICS_10) {
        const codingInfo =
          state.diagnosisInfo.coding[codingSystemKeys.OSICS_10] || {};

        return {
          ...state,
          diagnosisInfo: {
            ...state.diagnosisInfo,
            coding: {
              [codingSystemKeys.OSICS_10]: {
                ...codingInfo,
                osics_body_area_id: action.payload.bodyAreaId,
              },
            },
          },
        };
      }

      if (action.payload.codingSystem === codingSystemKeys.DATALYS) {
        const codingInfo =
          state.diagnosisInfo.coding[codingSystemKeys.DATALYS] || {};

        return {
          ...state,
          diagnosisInfo: {
            ...state.diagnosisInfo,
            coding: {
              [codingSystemKeys.DATALYS]: {
                ...codingInfo,
                datalys_body_area_id: action.payload.bodyAreaId,
              },
            },
          },
        };
      }

      if (
        action.payload.codingSystem === codingSystemKeys.CLINICAL_IMPRESSIONS
      ) {
        const codingInfo =
          state.diagnosisInfo.coding[codingSystemKeys.CLINICAL_IMPRESSIONS] ||
          {};

        return {
          ...state,
          diagnosisInfo: {
            ...state.diagnosisInfo,
            coding: {
              [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
                ...codingInfo,
                clinical_impression_body_area_id: action.payload.bodyAreaId,
              },
            },
          },
        };
      }

      return state;
    }
    case 'SELECT_CLASSIFICATION': {
      if (action.payload.codingSystem === codingSystemKeys.OSICS_10) {
        const codingInfo =
          state.diagnosisInfo.coding[codingSystemKeys.OSICS_10] || {};

        return {
          ...state,
          diagnosisInfo: {
            ...state.diagnosisInfo,
            coding: {
              [codingSystemKeys.OSICS_10]: {
                ...codingInfo,
                osics_classification_id: action.payload.classificationId,
              },
            },
          },
        };
      }

      if (action.payload.codingSystem === codingSystemKeys.DATALYS) {
        const codingInfo =
          state.diagnosisInfo.coding[codingSystemKeys.DATALYS] || {};

        return {
          ...state,
          diagnosisInfo: {
            ...state.diagnosisInfo,
            coding: {
              [codingSystemKeys.DATALYS]: {
                ...codingInfo,
                datalys_classification_id: action.payload.classificationId,
              },
            },
          },
        };
      }

      if (
        action.payload.codingSystem === codingSystemKeys.CLINICAL_IMPRESSIONS
      ) {
        const codingInfo =
          state.diagnosisInfo.coding[codingSystemKeys.CLINICAL_IMPRESSIONS] ||
          {};

        return {
          ...state,
          diagnosisInfo: {
            ...state.diagnosisInfo,
            coding: {
              [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
                ...codingInfo,
                clinical_impression_classification_id:
                  action.payload.classificationId,
              },
            },
          },
        };
      }

      return state;
    }
    case 'SELECT_DIAGNOSIS_DATE': {
      return {
        ...state,
        initialInfo: {
          ...state.initialInfo,
          diagnosisDate: action.payload.date,
        },
        eventInfo: {
          ...state.eventInfo,
          diagnosisDate: action.payload.date,
        },
      };
    }
    case 'SELECT_REPORTED_DATE': {
      return {
        ...state,
        initialInfo: {
          ...state.initialInfo,
          reportedDate: action.payload.date,
        },
      };
    }
    case 'SELECT_EVENT': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          event: action.payload.eventId,
          eventType: action.payload.eventType,
        },
      };
    }
    case 'SELECT_MECHANISM_DESCRIPTION': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          mechanismDescription: action.payload.mechanismDescription,
        },
      };
    }
    case 'SELECT_PRESENTATION_TYPE': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          presentationTypeId: action.payload.presentationTypeId,
        },
      };
    }
    case 'SET_PRESENTATION_TYPE_FREE_TEXT': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          presentationTypeFreeText: action.payload.presentationTypeFreeText,
        },
      };
    }
    case 'SELECT_ISSUE_CONTACT_TYPE': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          issueContactType: action.payload.issueContactType,
        },
      };
    }
    case 'SET_ISSUE_CONTACT_FREE_TEXT': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          issueContactFreetext: action.payload.freeText,
        },
      };
    }
    case 'SELECT_INJURY_MECHANISM': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          injuryMechanismId: action.payload.injuryMechanismId,
        },
      };
    }
    case 'UPDATE_INJURY_MECHANISM_FREE_TEXT': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          injuryMechanismFreetext: action.payload.freeText,
        },
      };
    }
    case 'SELECT_EXAMINATION_DATE': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          examinationDate: action.payload.date,
        },
      };
    }

    case 'SELECT_ISSUE_TYPE': {
      if (state.additionalInfo.annotations.length > 0) {
        const appliedAnnotations: Array<DiagnosisAttachments> =
          state.additionalInfo.annotations.slice().map((annotation) => ({
            ...annotation,
            attachmentContent: {
              ...annotation.attachmentContent,
              title: action.payload.issueType.includes('INJURY')
                ? 'Injury note'
                : 'Illness note',
            },
          }));
        return {
          ...state,
          initialInfo: {
            ...state.initialInfo,
            type: action.payload.issueType,
            issueId: null,
            previousIssueId: null,
            continuationIssueId: null,
            linkedChronicIssue: null,
          },
          diagnosisInfo: {
            ...state.diagnosisInfo,
            coding: {},
            supplementalPathology: null,
            concussion_assessments: [],
            isBamic: false,
            bamicGrade: null,
            bamicSite: null,
          },
          eventInfo: {
            ...state.eventInfo,
            event: null,
            eventType: null,
            activity: null,
            sessionCompleted: null,
            timeOfInjury: null,
          },
          additionalInfo: {
            ...state.additionalInfo,
            annotations: appliedAnnotations,
          },
          bamicGradesOptions: [],
        };
      }
      return {
        ...state,
        initialInfo: {
          ...state.initialInfo,
          type: action.payload.issueType,
          issueId: null,
          previousIssueId: null,
          continuationIssueId: null,
          linkedChronicIssue: null,
        },
        diagnosisInfo: {
          ...state.diagnosisInfo,
          coding: {},
          supplementalPathology: null,
          concussion_assessments: [],
          isBamic: false,
          bamicGrade: null,
          bamicSite: null,
        },
        eventInfo: {
          ...state.eventInfo,
          event: null,
          eventType: null,
          activity: null,
          sessionCompleted: null,
          timeOfInjury: null,
        },
        bamicGradesOptions: [],
      };
    }
    case 'SELECT_CODING': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          coding: {
            ...action.payload.coding,
            [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
              ...action.payload.coding[codingSystemKeys.CLINICAL_IMPRESSIONS],
              side_id:
                state.diagnosisInfo.coding[
                  codingSystemKeys.CLINICAL_IMPRESSIONS
                ]?.side_id,
            },
          },
        },
      };
    }

    case 'SELECT_SUPPLEMENTAL_CODING': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          supplementaryCoding: action.payload.supplementaryCoding,
        },
      };
    }
    case 'SELECT_ONSET': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          onset: action.payload.onset,
        },
      };
    }
    case 'SELECT_ONSET_DESCRIPTION': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          onsetDescription: action.payload.onsetDescription,
        },
      };
    }
    case 'SET_ONSET_FREE_TEXT': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          onsetFreeText: action.payload.freeText,
        },
      };
    }
    case 'SELECT_PATHOLOGY': {
      const osics10Info =
        state.diagnosisInfo.coding[codingSystemKeys.OSICS_10] || {};
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          coding: {
            [codingSystemKeys.OSICS_10]: {
              ...osics10Info,
              osics_pathology_id: action.payload.pathology,
            },
          },
        },
      };
    }
    case 'SELECT_CODING_SYSTEM_PATHOLOGY': {
      const nextPathology = {
        ...(action.payload.pathology ?? {}),
        coding_system_side_id:
          action.payload.pathology?.coding_system_side?.coding_system_side_id ??
          state.diagnosisInfo.coding.pathologies?.[0]?.coding_system_side_id ??
          null,
      };

      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          selectedCodingSystemPathology: nextPathology,
          coding: {
            pathologies: [nextPathology],
          },
        },
      };
    }
    case 'UPDATE_ATTACHED_CONCUSSION_ASSESSMENTS': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          concussion_assessments: action.payload.assessmentIds,
        },
      };
    }
    case 'SELECT_POSITION_WHEN_INJURED': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          positionWhenInjured: action.payload.positionWhenInjured,
        },
      };
    }
    case 'SELECT_PREVIOUS_ISSUE': {
      const isNoPriorInjurySelected = action.payload.issueId === -1;
      return {
        ...state,
        initialInfo: {
          ...state.initialInfo,
          issueId: action.payload.issueId,
          previousIssueId: action.payload.previousIssueId,
          recurrenceOutsideSystem: isNoPriorInjurySelected,
        },
        diagnosisInfo: isNoPriorInjurySelected
          ? {
              ...state.diagnosisInfo,
              selectedCodingSystemPathology: null,
              coding: {},
            }
          : state.diagnosisInfo,
      };
    }
    case 'SELECT_CONTINUATION_ISSUE': {
      const isNoPriorInjurySelected = action.payload.issue.id === -1;
      if (isNoPriorInjurySelected) {
        return {
          ...state,
          initialInfo: {
            ...state.initialInfo,
            issueId: action.payload.issue.id,
            continuationIssueId: null,
          },
          diagnosisInfo: getDefaultDiagnosisInfo(),
          eventInfo: getDefaultEventInfo(),
          additionalInfo: getDefaultAdditionalInfo(),
          title: '',
        };
      }
      return {
        ...state,
        initialInfo: {
          ...getDefaultInitialInfo(),
          isAthleteSelectable: state.initialInfo.isAthleteSelectable,
          type: state.initialInfo.type,
          athlete: state.initialInfo.athlete,
          athleteData: state.initialInfo.athleteData,
          squadId: state.initialInfo.squadId,
          issueId: action.payload.issue.id,
          continuationIssueId: action.payload.issue.id,
        },
        diagnosisInfo: {
          ...getDefaultDiagnosisInfo(),
          supplementalPathology: action.payload.issue.supplementary_pathology,
          onset: state.initialInfo.type.includes('INJURY')
            ? action.payload.issue.type_id
            : action.payload.issue.onset_id,
          onsetDescription: action.payload.issue.onset_description,
          onsetFreeText: getFreetextValue(
            action.payload.issue,
            'issue_occurrence_onsets'
          ),
          side: action.payload.issue.side,
          concussion_assessments: action.payload.issue.concussion_assessments,
          coding: action.payload.issue.coding,
          isBamic: !!action.payload.issue.osics?.bamic,
          bamicSite: action.payload.issue.bamic_grade_id,
          bamicGrade: action.payload.issue.bamic_site_id,
          secondary_pathologies: action.payload.issue.coding
            ?.clinical_impressions?.secondary_pathologies
            ? action.payload.issue.coding?.clinical_impressions?.secondary_pathologies.map<{
                record: SelectOption,
              }>((secondaryPathology) => ({
                record: {
                  value: {
                    id: secondaryPathology.record?.id,
                    code: secondaryPathology.record?.code,
                    pathology: secondaryPathology.record?.pathology,
                    clinical_impression_body_area:
                      secondaryPathology.record?.clinical_impression_body_area
                        .name,
                    clinical_impression_body_area_id:
                      secondaryPathology.record?.clinical_impression_body_area
                        .id,
                    clinical_impression_classification:
                      secondaryPathology.record
                        ?.clinical_impression_classification.name,
                    clinical_impression_classification_id:
                      secondaryPathology.record
                        ?.clinical_impression_classification.id,
                  },
                  label: secondaryPathology.record?.pathology || '',
                },
              }))
            : [],
        },
        eventInfo: {
          ...getDefaultEventInfo(),
          eventType: action.payload.issue.activity_type,
        },
        additionalInfo: {
          ...getDefaultAdditionalInfo(),
        },
        title: action.payload.issue.issue_occurrence_title,
      };
    }
    case 'SELECT_SESSION_COMPLETED': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          sessionCompleted: action.payload.sessionCompleted,
        },
      };
    }
    case 'SELECT_RELATED_CHRONIC_ISSUES': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          relatedChronicIssues: action.payload.issueIds,
        },
      };
    }
    case 'SELECT_SIDE': {
      if (isV2MultiCodingSystem(action.payload.codingSystem)) {
        const pathology = state.diagnosisInfo.coding?.pathologies?.[0] ?? {};
        const updatedPathology = {
          ...pathology,
          id: pathology.id ?? null,
          coding_system_side_id: action.payload.side,
        };

        return {
          ...state,
          diagnosisInfo: {
            ...state.diagnosisInfo,
            selectedCodingSystemPathology: updatedPathology,
            coding: {
              pathologies: [updatedPathology],
            },
          },
        };
      }
      if (window.featureFlags['emr-multiple-coding-systems']) {
        if (action.payload.codingSystem === codingSystemKeys.OSICS_10) {
          return {
            ...state,
            diagnosisInfo: {
              ...state.diagnosisInfo,
              coding: {
                [codingSystemKeys.OSICS_10]: {
                  ...state.diagnosisInfo.coding[codingSystemKeys.OSICS_10],
                  side_id: action.payload.side,
                },
              },
            },
          };
        }

        if (action.payload.codingSystem === codingSystemKeys.DATALYS) {
          return {
            ...state,
            diagnosisInfo: {
              ...state.diagnosisInfo,
              coding: {
                [codingSystemKeys.DATALYS]: {
                  ...state.diagnosisInfo.coding[codingSystemKeys.DATALYS],
                  side_id: action.payload.side,
                },
              },
            },
          };
        }

        if (
          action.payload.codingSystem === codingSystemKeys.CLINICAL_IMPRESSIONS
        ) {
          const secondaryPathology =
            // $FlowIgnore
            state.diagnosisInfo?.secondary_pathologies?.map((sp) => {
              return {
                ...sp,
                side: action.payload.side,
              };
            }) || [];

          return {
            ...state,
            diagnosisInfo: {
              ...state.diagnosisInfo,
              coding: {
                [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
                  ...state.diagnosisInfo.coding[
                    codingSystemKeys.CLINICAL_IMPRESSIONS
                  ],
                  side_id: action.payload.side,
                },
              },
              secondary_pathologies: secondaryPathology,
            },
          };
        }
      }

      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          side: action.payload.side,
        },
      };
    }
    case 'SELECT_SQUAD': {
      return {
        ...state,
        initialInfo: {
          ...state.initialInfo,
          squadId: action.payload.squadId,
        },
      };
    }
    case 'SELECT_TIME_OF_INJURY': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          timeOfInjury: action.payload.injuryTime,
        },
      };
    }
    case 'UPDATE_BODY_AREA': {
      const osicsInfo =
        state.diagnosisInfo.coding[codingSystemKeys.OSICS_10] || {};
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          coding: {
            [codingSystemKeys.OSICS_10]: {
              ...osicsInfo,
              osics_body_area_id: action.payload.bodyArea,
            },
          },
        },
      };
    }
    case 'UPDATE_CLASSIFICATION': {
      const osicsInfo =
        state.diagnosisInfo.coding[codingSystemKeys.OSICS_10] || {};
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          coding: {
            [codingSystemKeys.OSICS_10]: {
              ...osicsInfo,
              osics_classification_id: action.payload.classification,
            },
          },
        },
      };
    }
    case 'UPDATE_GROUPS': {
      const osicsInfo =
        state.diagnosisInfo.coding[codingSystemKeys.OSICS_10] || {};
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          coding: {
            [codingSystemKeys.OSICS_10]: {
              ...osicsInfo,
              groups: action.payload.groups,
            },
          },
        },
      };
    }
    case 'UPDATE_EVENTS': {
      return {
        ...state,
        eventInfo: {
          ...state.eventInfo,
          events: {
            ...state.eventInfo.events,
            games: action.payload.games,
            sessions: action.payload.training_sessions,
            otherEventOptions: action.payload.other_events || [],
          },
        },
      };
    }
    case 'UPDATE_ICD_CODE': {
      const osicsInfo =
        state.diagnosisInfo.coding[codingSystemKeys.OSICS_10] || {};
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          coding: {
            [codingSystemKeys.OSICS_10]: {
              ...osicsInfo,
              icd: action.payload.icdCode,
            },
          },
        },
      };
    }
    case 'UPDATE_INITIAL_NOTE': {
      return {
        ...state,
        initialInfo: {
          ...state.initialInfo,
          initialNote: action.payload.note,
        },
      };
    }
    case 'UPDATE_ANNOTATION_CONTENT': {
      const appliedAnnotations: Array<IssueAttachments> =
        state.additionalInfo.annotations.slice();

      appliedAnnotations[action.payload.index] = {
        ...appliedAnnotations[action.payload.index],
        attachmentContent: {
          ...appliedAnnotations[action.payload.index]?.attachmentContent,
          content: action.payload.content,
        },
      };

      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          annotations: appliedAnnotations,
        },
      };
    }

    case 'UPDATE_ANNOTATION_VISIBILITY': {
      const appliedAnnotations: Array<IssueAttachments> =
        state.additionalInfo.annotations.slice();

      if (action.payload.visibility === 'DOCTORS') {
        appliedAnnotations[action.payload.index] = {
          ...appliedAnnotations[action.payload.index],
          attachmentContent: {
            ...appliedAnnotations[action.payload.index]?.attachmentContent,
            restricted_to_doc: true,
            restricted_to_psych: false,
          },
        };
      } else if (action.payload.visibility === 'PSYCH_TEAM') {
        appliedAnnotations[action.payload.index] = {
          ...appliedAnnotations[action.payload.index],
          attachmentContent: {
            ...appliedAnnotations[action.payload.index]?.attachmentContent,
            restricted_to_doc: false,
            restricted_to_psych: true,
          },
        };
      } else {
        appliedAnnotations[action.payload.index] = {
          ...appliedAnnotations[action.payload.index],
          attachmentContent: {
            ...appliedAnnotations[action.payload.index]?.attachmentContent,
            restricted_to_doc: false,
            restricted_to_psych: false,
          },
        };
      }
      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          annotations: appliedAnnotations,
        },
      };
    }
    case 'UPDATE_ANNOTATION_ATTACHMENTS_ATTRIBUTES': {
      if (action.payload.files.length > 0) {
        const appliedAttachments: Array<IssueAttachments> =
          state.additionalInfo.annotations.slice();
        const convertedFiles = convertFileToUrl(action.payload.files.slice());
        const transformedAttachments = transformFilesForUpload(
          action.payload.files.slice()
        );

        appliedAttachments[action.payload.index] = {
          ...appliedAttachments[action.payload.index],
          attachmentContent: {
            ...appliedAttachments[action.payload.index].attachmentContent,
            attachments: [
              ...appliedAttachments[action.payload.index].attachmentContent
                .attachments,
              ...convertedFiles,
            ],
            attachments_attributes: [
              ...appliedAttachments[action.payload.index].attachmentContent
                .attachments_attributes,
              ...transformedAttachments,
            ],
          },
        };
        return {
          ...state,
          additionalInfo: {
            ...state.additionalInfo,
            annotations: appliedAttachments,
          },
        };
      }
      return state;
    }
    case 'UPDATE_ANNOTATION_FILES_QUEUE': {
      const annotations: Array<IssueAttachments> =
        state.additionalInfo.annotations.slice();
      annotations[action.payload.index] = {
        ...annotations[action.payload.index],
        attachmentContent: {
          ...annotations[action.payload.index].attachmentContent,
          filesQueue: action.payload.files.map((file) => file.id),
        },
      };

      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          annotations,
        },
      };
    }

    case 'UPDATE_OSICS_CODE': {
      const osicsInfo =
        state.diagnosisInfo.coding[codingSystemKeys.OSICS_10] || {};
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          coding: {
            [codingSystemKeys.OSICS_10]: {
              ...osicsInfo,
              osics_id: action.payload.osicsCode,
              code: action.payload.osicsCode,
            },
          },
        },
      };
    }
    case 'UPDATE_STATUS_DATE': {
      const appliedStatuses: Array<{
        status: string,
        date: string,
      }> = state.diagnosisInfo.statuses.slice().map((status, index) => ({
        ...status,
        date:
          action.payload.index === index ? action.payload.date : status.date,
      }));

      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          statuses: appliedStatuses,
        },
      };
    }
    case 'UPDATE_STATUS_TYPE': {
      const appliedStatuses: Array<{
        status: string,
        date: string,
      }> = state.diagnosisInfo.statuses.slice().map((status, index) => ({
        ...status,
        status:
          action.payload.index === index
            ? action.payload.status
            : status.status,
      }));

      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          statuses: appliedStatuses,
        },
      };
    }
    case 'UPDATE_CONDITIONAL_FIELDS_ANSWERS': {
      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          conditionalFieldsAnswers: action.payload.answers,
        },
      };
    }
    case 'SET_BAMIC_GRADES_OPTIONS': {
      return {
        ...state,
        bamicGradesOptions: action.payload.bamicGradesOptions,
      };
    }
    case 'UPDATE_IS_BAMIC': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          isBamic: action.payload.isBamic,
        },
      };
    }
    case 'SELECT_BAMIC_GRADE': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          bamicGrade: action.payload.bamicGrade,
        },
      };
    }
    case 'SELECT_BAMIC_SITE': {
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          bamicSite: action.payload.bamicSite,
        },
      };
    }
    case 'SET_ISSUE_TITLE': {
      return {
        ...state,
        title: action.payload.title,
      };
    }
    case 'SET_LINKED_ISSUES': {
      const attrToUpdate =
        action.payload.type === 'Injury' ? 'injuries' : 'illnesses';
      const linkedIssues = {
        ...state.additionalInfo.linkedIssues,
        [`${attrToUpdate}`]: [...action.payload.ids],
      };
      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          linkedIssues: {
            ...linkedIssues,
          },
        },
      };
    }
    case 'UPDATE_ISSUE_LINKS': {
      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          issueLinks: action.payload,
        },
      };
    }
    case 'UPDATE_ISSUE_FILES': {
      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          issueFiles: action.payload,
        },
      };
    }

    case 'SET_CHRONIC_ISSUE': {
      return {
        ...state,
        initialInfo: {
          ...state.initialInfo,
          linkedChronicIssue: action.payload,
        },
      };
    }

    case 'SET_CHRONIC_CONDITION_ONSET_DATE': {
      return {
        ...state,
        initialInfo: {
          ...state.initialInfo,
          chronicConditionOnsetDate: action.payload.date,
        },
      };
    }

    case 'ADD_SECONDARY_PATHOLOGY': {
      const currentSecondaryPathologies: Array<SecondaryPathology> =
        state.diagnosisInfo.secondary_pathologies.slice();
      const secondaryPathology = { ...action.payload.secondaryPathology };

      if (
        window.featureFlags['emr-multiple-coding-systems'] &&
        state.diagnosisInfo?.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
          ?.side_id
      ) {
        secondaryPathology.side =
          // $FlowIgnore misleading type on Side
          state.diagnosisInfo.coding[
            codingSystemKeys.CLINICAL_IMPRESSIONS
          ].side_id;
      }

      currentSecondaryPathologies.push(secondaryPathology);

      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          secondary_pathologies: currentSecondaryPathologies,
        },
      };
    }
    case 'EDIT_SECONDARY_PATHOLOGY': {
      const currentSecondaryPathologies: Array<SecondaryPathology> =
        state.diagnosisInfo.secondary_pathologies.slice();

      currentSecondaryPathologies[action.payload.index] = {
        ...action.payload.secondaryPathology,
      };

      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          secondary_pathologies: [...currentSecondaryPathologies],
        },
      };
    }
    case 'REMOVE_SECONDARY_PATHOLOGY': {
      const appliedSecondaryPathologies: Array<SecondaryPathology> = [
        ...state.diagnosisInfo.secondary_pathologies,
      ].filter((item, index) => action.payload.index !== index);
      return {
        ...state,
        diagnosisInfo: {
          ...state.diagnosisInfo,
          secondary_pathologies: appliedSecondaryPathologies,
        },
      };
    }
    default:
      return state;
  }
};
