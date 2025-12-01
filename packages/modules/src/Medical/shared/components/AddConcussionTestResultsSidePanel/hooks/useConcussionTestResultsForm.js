// @flow
import moment from 'moment-timezone';
import { useReducer } from 'react';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { Dispatch, ConcussionTestProtocol } from '../../../types';

export type TestType =
  | 'baseline'
  | 'initial_assessment'
  | 'start_of_rtp'
  | 'rtp_recurring';

type CommonFormState = {
  test_type: TestType,
  athlete_id: ?number,
  examination_date: string,
  local_timezone: string,
  examiner_id: ?number,
  illness_occurrence_ids: number[],
  injury_occurrence_ids: number[],
  queuedAttachments: Array<AttachedFile>,
  queuedAttachmentTypes: Array<string>,
};

type NPCResults = CommonFormState & {
  type: 'NPC',
  npc_distance_1: ?string,
  npc_distance_2: ?string,
  npc_distance_3: ?string,
  npc_average: ?number,
};

type KingDevickResults = CommonFormState & {
  type: 'KING-DEVICK',
  king_devick_score: ?string,
  king_devick_errors: ?string,
};

export type FormState = NPCResults | KingDevickResults;

export type FormAction =
  | { type: 'SET_TEST_TYPE', testType: TestType }
  | { type: 'SET_ATHLETE_ID', athleteId: number }
  | { type: 'SET_EXAMINATION_DATE', examinationDate: string }
  | { type: 'SET_EXAMINATION_TIME', examinationTime: string }
  | { type: 'SET_ILLNESS_IDS', illnessIds: number[] }
  | { type: 'SET_INJURY_IDS', injuryIds: number[] }
  | { type: 'SET_LOCAL_TIMEZONE', localTimezone: string }
  | { type: 'SET_EXAMINER_ID', examinerId: number }
  | {
      type: 'UPDATE_QUEUED_ATTACHMENTS',
      queuedAttachments: AttachedFile[],
    }
  | { type: 'REMOVE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'UPDATE_ATTACHMENT_TYPE', queuedAttachmentType: string }
  | { type: 'CLEAR_FORM', testProtocol: ConcussionTestProtocol }

  // NPC only actions
  | { type: 'SET_NPC_DISTANCE_1', distance: string }
  | { type: 'SET_NPC_DISTANCE_2', distance: string }
  | { type: 'SET_NPC_DISTANCE_3', distance: string }

  // KING-DEVICK only actions
  | { type: 'SET_KING_DEVICK_ERRORS', errors: string }
  | { type: 'SET_KING_DEVICK_SCORE', score: string };

const getInitialExaminationTimeValues = () => {
  const localTimezone =
    document.getElementsByTagName('body')[0].dataset.timezone;

  const localStartOfHour = localTimezone
    ? moment().tz(localTimezone).startOf('hour')
    : moment().startOf('hour');
  return {
    local_timezone: localTimezone || localStartOfHour.tz(),
    examination_date: localStartOfHour.format(DateFormatter.dateTransferFormat),
  };
};

export const getInitialFormState = (testProtocol: ConcussionTestProtocol) => {
  if (testProtocol === 'NPC') {
    return {
      ...getInitialExaminationTimeValues(),
      type: testProtocol,
      test_type: 'baseline',
      athlete_id: null,
      examiner_id: null,
      illness_occurrence_ids: [],
      injury_occurrence_ids: [],
      queuedAttachments: [],
      queuedAttachmentTypes: [],

      // NPC only values
      npc_distance_1: null,
      npc_distance_2: null,
      npc_distance_3: null,
      npc_average: null,
    };
  }

  return {
    ...getInitialExaminationTimeValues(),
    type: testProtocol,
    test_type: 'baseline',
    athlete_id: null,
    examiner_id: null,
    illness_occurrence_ids: [],
    injury_occurrence_ids: [],
    queuedAttachments: [],
    queuedAttachmentTypes: [],

    // KING-DEVICK only values
    king_devick_score: null,
    king_devick_errors: null,
  };
};

const updateExaminationDateWithTime = (
  currentExaminationDate: string,
  newTime: string,
  localTimezone: string
): string => {
  const timeSource = moment.tz(newTime, localTimezone);

  // Will already have an examinationDate keep its date and apply only time components of timeSource to it
  const updatedDate = moment.tz(currentExaminationDate, localTimezone).set({
    hour: timeSource.get('hour'),
    minute: timeSource.get('minute'),
  });

  return updatedDate.format(DateFormatter.dateTransferFormat);
};

const updateExaminationDate = (
  currentExaminationDate: string,
  newDate: string,
  localTimezone: string
): string => {
  const timeSource = moment.tz(currentExaminationDate, localTimezone);

  // Will already have an examinationDate with a time so apply only its time components of timeSource to it
  const updatedDate = moment.tz(newDate, localTimezone).set({
    hour: timeSource.get('hour'),
    minute: timeSource.get('minute'),
    second: 0,
    millisecond: 0,
  });

  return updatedDate.format(DateFormatter.dateTransferFormat);
};

const updateExaminationDateTimezone = (
  currentExaminationDate: string,
  currentTimezone: string,
  newTimezone: string
): string => {
  // We don't convert/offset the time to the new timezone
  // Instead if it was 3pm in original timezone, make the new examination time 3pm in the new timezone
  const timeSource = moment.tz(currentExaminationDate, currentTimezone);

  const updatedDate = moment().tz(newTimezone);

  updatedDate.set({
    year: timeSource.get('year'),
    month: timeSource.get('month'),
    date: timeSource.get('date'),
    hour: timeSource.get('hour'),
    minute: timeSource.get('minute'),
    second: 0,
    millisecond: 0,
  });

  return updatedDate.format(DateFormatter.dateTransferFormat);
};

const calcAverage = (numbers: Array<?string>): ?number => {
  const initialValues = { dividend: 0, divisor: 0 };
  const reduced = numbers.reduce((accumulator, currentValue) => {
    if (currentValue != null) {
      const numValue = parseFloat(currentValue);
      if (!Number.isNaN(numValue)) {
        return {
          dividend: accumulator.dividend + numValue,
          divisor: accumulator.divisor + 1,
        };
      }
    }
    return accumulator;
  }, initialValues);

  const value = reduced.divisor > 0 ? reduced.dividend / reduced.divisor : 0;
  return parseFloat(value.toFixed(2));
};

const formReducer = (state: FormState, action: FormAction) => {
  // Simple approach to replicating Combine reducers from redux

  // NPC only actions
  if (state.type === 'NPC') {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case 'SET_NPC_DISTANCE_1':
        return {
          ...state,
          npc_distance_1: action.distance,
          npc_average: calcAverage([
            action.distance,
            state.npc_distance_2,
            state.npc_distance_3,
          ]),
        };
      case 'SET_NPC_DISTANCE_2':
        return {
          ...state,
          npc_distance_2: action.distance,
          npc_average: calcAverage([
            state.npc_distance_1,
            action.distance,
            state.npc_distance_3,
          ]),
        };
      case 'SET_NPC_DISTANCE_3':
        return {
          ...state,
          npc_distance_3: action.distance,
          npc_average: calcAverage([
            state.npc_distance_1,
            state.npc_distance_2,
            action.distance,
          ]),
        };
    }
  }

  // KING-DEVICK only actions
  if (state.type === 'KING-DEVICK') {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case 'SET_KING_DEVICK_SCORE':
        return {
          ...state,
          king_devick_score: action.score,
        };
      case 'SET_KING_DEVICK_ERRORS':
        return {
          ...state,
          king_devick_errors: action.errors,
        };
    }
  }

  // Remaining common actions
  switch (action.type) {
    case 'SET_TEST_TYPE':
      return {
        ...state,
        test_type: action.testType,
      };

    case 'SET_ATHLETE_ID':
      return {
        ...state,
        athlete_id: action.athleteId,
      };

    case 'SET_ILLNESS_IDS':
      return {
        ...state,
        illness_occurrence_ids: action.illnessIds,
      };

    case 'SET_INJURY_IDS':
      return {
        ...state,
        injury_occurrence_ids: action.injuryIds,
      };

    case 'SET_EXAMINATION_DATE':
      return {
        ...state,
        examination_date: updateExaminationDate(
          state.examination_date,
          action.examinationDate,
          state.local_timezone
        ),
      };

    case 'SET_EXAMINATION_TIME':
      return {
        ...state,
        examination_date: updateExaminationDateWithTime(
          state.examination_date,
          action.examinationTime,
          state.local_timezone
        ),
      };

    case 'SET_LOCAL_TIMEZONE':
      return {
        ...state,
        examination_date: updateExaminationDateTimezone(
          state.examination_date,
          state.local_timezone,
          action.localTimezone
        ),
        local_timezone: action.localTimezone,
      };

    case 'SET_EXAMINER_ID':
      return {
        ...state,
        examiner_id: action.examinerId,
      };

    case 'UPDATE_QUEUED_ATTACHMENTS':
      return {
        ...state,
        queuedAttachments: action.queuedAttachments,
      };

    // Can be a FILE, LINK or NOTE
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
      };

    case 'CLEAR_FORM':
      return getInitialFormState(action.testProtocol);

    default:
      return state;
  }
};

const useConcussionTestResultsForm = (testProtocol: ConcussionTestProtocol) => {
  const initialState = getInitialFormState(testProtocol);
  const init = () => {
    return initialState;
  };

  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    initialState,
    init
  );

  return {
    formState,
    dispatch,
  };
};

export default useConcussionTestResultsForm;
