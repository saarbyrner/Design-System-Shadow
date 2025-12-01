// @flow
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  getOsicsPathologiesOptions,
  getClassificationsOptions,
  getBodyAreaOptions,
  getIssueTypeOptions,
  getDefaultIssueState,
} from './utils';
import type { Action } from '../../types/action';
import type {
  AppStatusState,
  ModalDataState,
  IssueDataState,
  StaticDataState,
} from '../../types/state';

export const IssueData = (state: IssueDataState, action: Action) => {
  if (!state) {
    return {};
  }

  switch (action.type) {
    case 'ADD_NEW_EVENT': {
      const eventsOrder: Array<any> = state.events_order.slice();
      let newStatusId = 'new_status';

      // when adding multiple statuses the ID needs to be unique for them
      if (eventsOrder.indexOf('new_status_1') !== -1) {
        // Find the last injury event id and add one
        const getStatusIdRegex = /new_status_(\d+)/;
        const lastIssueEvent = eventsOrder[eventsOrder.length - 1];
        const regexResult = lastIssueEvent
          ? getStatusIdRegex.exec(lastIssueEvent)
          : null;
        const lastStatusId =
          lastIssueEvent && regexResult ? parseInt(regexResult[1], 10) : '';

        newStatusId = `new_status_${lastStatusId + 1}`;
      } else {
        newStatusId = 'new_status_1';
      }
      // update the status order and hash
      eventsOrder.push(newStatusId);

      const blankStatus = {
        injury_status_id: null,
        date: null,
      };
      // Object.assign must be used to silence Flow complaining about non-existent key
      const events = Object.assign({}, state.events, {
        [newStatusId]: Object.assign({}, blankStatus),
      });
      const issueData = Object.assign({}, state, {
        events,
        events_order: eventsOrder,
      });

      return Object.assign({}, state, issueData);
    }
    case 'REMOVE_EVENT': {
      const eventsOrder: Array<any> = state.events_order.slice();
      eventsOrder.splice(eventsOrder.indexOf(action.payload.statusId), 1);
      const events = state.events;
      delete events[action.payload.statusId];

      const issueData = Object.assign({}, state, {
        events,
        events_order: eventsOrder,
      });

      return Object.assign({}, state, issueData);
    }
    case 'UPDATE_BAMIC_GRADE_ID': {
      return {
        ...state,
        bamic_grade_id: action.payload.gradeId,
        bamic_site_id: null,
      };
    }
    case 'UPDATE_BAMIC_SITE_ID': {
      return { ...state, bamic_site_id: action.payload.siteId };
    }
    case 'UPDATE_ISSUE_STATUS': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.events[action.payload.statusId].injury_status_id =
        action.payload.optionId;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_EVENT_DATE': {
      const events = Object.assign({}, state.events);

      const newDate = moment(action.payload.editedDate).format(
        DateFormatter.dateTransferFormat
      );
      events[action.payload.statusId].date = newDate;

      const issueData = Object.assign({}, state, {
        events,
      });

      return Object.assign({}, state, issueData);
    }

    case 'UPDATE_EXAMINATION_DATE': {
      return {
        ...state,
        examination_date: moment(action.payload.examinationDate).format(
          DateFormatter.dateTransferFormat
        ),
      };
    }

    case 'UPDATE_OSICS_PATHOLOGY': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.osics.osics_pathology_id = action.payload.osicsPathology;

      return Object.assign({}, state, newIssue);
    }

    case 'UPDATE_ISSUE_INFO': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.modification_info = action.payload.issueInfo;

      return Object.assign({}, state, newIssue);
    }

    case 'UPDATE_OSICS_CLASSIFICATION': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.osics.osics_classification_id =
        action.payload.osicsClassification;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_BODY_AREA': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.osics.osics_body_area_id = action.payload.bodyArea;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_SIDE': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.side_id = action.payload.side;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_TYPE': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.type_id = action.payload.typeId;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_OSICS_CODE': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.osics.osics_id = action.payload.osicsCode;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_ICD_CODE': {
      return {
        ...state,
        osics: {
          ...state.osics,
          icd: action.payload.icdCode,
        },
      };
    }
    case 'UPDATE_OCCURRENCE_DATE': {
      const newIssue = JSON.parse(JSON.stringify(state));

      const newDate = action.payload.occurrenceDate
        ? moment(action.payload.occurrenceDate).format(
            DateFormatter.dateTransferFormat
          )
        : null;
      newIssue.occurrence_date = newDate;

      // The first event date must be the same than the issue occurrence date
      const firstEvent = newIssue.events_order[0];
      newIssue.events[firstEvent].date = newDate;

      // When the occurrence date changes, the date is not synchronised
      // with the selected game or training session.
      // We need to wipe the game and training session dropdown.
      // Unlisted events are not wiped because they are not associated to a date.
      if (state.occurrence_date !== newDate) {
        newIssue.game_id = state.game_id === 'UNLISTED' ? 'UNLISTED' : null;
        newIssue.training_session_id =
          state.training_session_id === 'UNLISTED' ? 'UNLISTED' : null;
      }

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_ACTIVITY': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.activity_id = action.payload.activityId;
      newIssue.activity_type = action.payload.activityType;

      newIssue.game_id = null;
      newIssue.training_session_id = null;
      newIssue.occurrence_min = null;

      // session_completed is false by default if the activity type is a game or a training session
      newIssue.session_completed =
        newIssue.activity_type === 'game' ||
        newIssue.activity_type === 'training'
          ? false
          : null;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_TRAINING_SESSION': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.training_session_id = action.payload.trainingSessionId;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_GAME': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.game_id = action.payload.gameId;

      if (action.payload.gameDate) {
        const newDate = action.payload.gameDate;

        // The injury occurrence date must be the game date
        newIssue.occurrence_date = newDate;

        // The first event date must be syncronysed with the game date
        const firstEvent = newIssue.events_order[0];
        newIssue.events[firstEvent].date = newDate;
      }

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_PERIOD': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.association_period_id = action.payload.periodId;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_GAME_TIME': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.occurrence_min = action.payload.gameTime;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_SESSION_COMPLETED': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.session_completed = action.payload.isSessionCompleted;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_POSITION_GROUP': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.position_when_injured_id = action.payload.positionGroupId;

      return Object.assign({}, state, newIssue);
    }
    case 'UPDATE_FORM_TYPE': {
      return getDefaultIssueState(state.athlete_id, state.modification_info);
    }
    case 'UPDATE_RECURRENCE': {
      return Object.assign({}, state, {
        recurrence_id: action.payload.priorIssue.id,
        osics: {
          osics_body_area_id:
            action.payload.priorIssue.osics.osics_body_area_id,
          osics_classification_id:
            action.payload.priorIssue.osics.osics_classification_id,
          osics_id: action.payload.priorIssue.osics.osics_id,
          osics_pathology_id:
            action.payload.priorIssue.osics.osics_pathology_id,
        },
        side_id: action.payload.priorIssue.side_id,
        prior_resolved_date: action.payload.priorIssue.resolved_date || null,
        // If the issue is an illness use onset_id else use type_id
        // to be refactor https://github.com/KitmanLabs/projects/issues/7351
        type_id:
          action.payload.priorIssue.onset_id ||
          action.payload.priorIssue.type_id,
      });
    }
    case 'UPDATE_HAS_RECURRENCE': {
      return Object.assign({}, state, {
        has_recurrence: action.payload.hasRecurrence,
        recurrence_id: null,
        osics: {
          osics_body_area_id: null,
          osics_classification_id: null,
          osics_id: null,
          osics_pathology_id: null,
        },
        side_id: null,
        type_id: null,
        prior_resolved_date: null,
      });
    }
    case 'UPDATE_HAS_SUPPLEMENTARY_PATHOLOGY': {
      return Object.assign({}, state, {
        has_supplementary_pathology: action.payload.hasSupplementaryPathology,
      });
    }
    case 'UPDATE_SUPPLEMENTARY_PATHOLOGY': {
      const newIssue = JSON.parse(JSON.stringify(state));
      newIssue.supplementary_pathology = action.payload.supplementaryPathology;

      return Object.assign({}, state, newIssue);
    }
    default:
      return state;
  }
};

export const CurrentNote = (state: any = {}, action: Action) => {
  switch (action.type) {
    case 'UPDATE_NOTE': {
      const newCurrentNote = Object.assign({}, state);
      newCurrentNote.note = action.payload.note;

      return Object.assign({}, state, newCurrentNote);
    }
    case 'UPDATE_IS_RESTRICTED': {
      const newCurrentNote = Object.assign({}, state);
      newCurrentNote.restricted = action.payload.isRestricted;

      return Object.assign({}, state, newCurrentNote);
    }
    case 'UPDATE_PSYCH_ONLY': {
      const newCurrentNote = Object.assign({}, state);
      newCurrentNote.psych_only = action.payload.psychOnly;

      return Object.assign({}, state, newCurrentNote);
    }
    default:
      return state;
  }
};

export const ModalData = (state: ModalDataState, action: Action) => {
  if (!state) {
    return {};
  }

  switch (action.type) {
    case 'IS_FETCHING_ISSUE_DETAILS': {
      const newModalData = JSON.parse(JSON.stringify(state));
      newModalData.isFetchingIssueDetails = action.payload.requestInProgress;

      return Object.assign({}, state, newModalData);
    }
    case 'IS_FETCHING_GAME_AND_TRAINING_OPTION': {
      const newModalData = JSON.parse(JSON.stringify(state));
      newModalData.isFetchingGameAndTrainingOptions =
        action.payload.requestInProgress;

      return Object.assign({}, state, newModalData);
    }
    case 'UPDATE_GAME_OPTIONS': {
      return Object.assign({}, state, {
        gameOptions: action.payload.gameOptions,
      });
    }
    case 'UPDATE_TRAINING_OPTIONS': {
      return Object.assign({}, state, {
        trainingSessionOptions: action.payload.trainingOptions,
      });
    }
    case 'UPDATE_FORM_TYPE': {
      return Object.assign({}, state, {
        formType: action.payload.formType,
        osicsPathologyOptions: getOsicsPathologiesOptions(
          action.payload.formType,
          state.staticData.injuryOsicsPathologies,
          state.staticData.illnessOsicsPathologies
        ),
        osicsClassificationOptions: getClassificationsOptions(
          action.payload.formType,
          state.staticData.injuryOsicsClassifications,
          state.staticData.illnessOsicsClassifications
        ),
        bodyAreaOptions: getBodyAreaOptions(
          action.payload.formType,
          state.staticData.injuryOsicsBodyAreas,
          state.staticData.illnessOsicsBodyAreas
        ),
        issueTypeOptions: getIssueTypeOptions(
          action.payload.formType,
          state.staticData.injuryOnsets,
          state.staticData.illnessOnsets
        ),
      });
    }
    default:
      return state;
  }
};

export const staticData = (state: StaticDataState = {}, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const AppStatus = (state: AppStatusState = {}, action: Action) => {
  switch (action.type) {
    case 'SERVER_REQUEST':
      return {
        status: 'loading',
        message: null,
      };
    case 'SERVER_REQUEST_ERROR':
      return {
        status: 'error',
        message: null,
      };
    case 'SERVER_REQUEST_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('Success'),
      };
    case 'HIDE_APP_STATUS':
      return {
        status: null,
        message: null,
      };
    default:
      return state;
  }
};
