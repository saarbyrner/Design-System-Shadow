// @flow
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { Alarm, AlarmCalculation } from '@kitman/common/src/types/Alarm';
import type { Status } from '@kitman/common/src/types/Status';
import type { GroupBy, SortOrder } from '@kitman/common/src/types';
import type {
  AlarmFilterOptions,
  AthleteFilterOptions,
  AvailabilityFilterOptions,
} from '@kitman/common/src/types/__common';

type showAlarmsEditorModal = {
  type: 'SHOW_ALARMS_EDITOR_MODAL',
  statusId: string,
  isVisible: boolean,
};

type hideAlarmsEditorModal = {
  type: 'HIDE_ALARMS_EDITOR_MODAL',
  isVisible: boolean,
};

type showModal = {
  type: 'SHOW_MODAL',
  modalType: 'alarms',
  modalProps: {
    statusId: $PropertyType<Status, 'status_id'>,
  },
};

type hideCurrentModal = {
  type: 'HIDE_CURRENT_MODAL',
};

type confirmCloseModal = {
  type: 'CONFIRM_CLOSE_MODAL',
};

type cancelCloseModal = {
  type: 'CANCEL_CLOSE_MODAL',
};

type hideConfirmation = {
  type: 'HIDE_CONFIRMATION',
};

type showConfirmation = {
  type: 'SHOW_CONFIRMATION',
  payload: {
    action: string,
    message: string,
  },
};

type groupAthletes = {
  type: 'GROUP_ATHLETES',
  payload: {
    athletes: Array<Athlete>,
    groupBy: GroupBy,
  },
};

type getLatestDataRequested = {
  type: 'GET_LATEST_DATA_REQUESTED',
};

// alarms
type setAlarmDefinitions = {
  type: 'SET_ALARM_DEFINITIONS',
  payload: {
    alarmDefinitions: Object,
  },
};

type saveAlarmDefinitionsRequest = {
  type: 'SAVE_ALARM_DEFINITIONS_REQUEST',
};

type saveAlarmDefinitionsSuccess = {
  type: 'SAVE_ALARM_DEFINITIONS_SUCCESS',
};

type saveAlarmDefinitionsFailure = {
  type: 'SAVE_ALARM_DEFINITIONS_FAILURE',
};

type setAlarmDefinitionsForStatus = {
  type: 'SET_ALARM_DEFINITIONS_FOR_STATUS',
  payload: {
    alarms: Array<Alarm>,
  },
};

type deleteAlarmDefinitionForStatus = {
  type: 'DELETE_ALARM_DEFINITION_FOR_STATUS',
  payload: {
    index: number,
  },
};

type deleteAllAlarmDefinitionsForStatus = {
  type: 'DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS',
};

type confirmDeleteAllAlarmDefinitionsForStatus = {
  type: 'CONFIRM_DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS',
};

type addAlarmDefinitionForStatus = {
  type: 'ADD_ALARM_DEFINITION_FOR_STATUS',
  payload: {
    alarmId: string,
  },
};

type setAlarmCondition = {
  type: 'SET_ALARM_CONDITION',
  payload: {
    condition: $PropertyType<Alarm, 'condition'>,
    index: number,
  },
};

type setAlarmType = {
  type: 'SET_ALARM_TYPE',
  payload: {
    alarmType: $PropertyType<Alarm, 'alarm_type'>,
    index: number,
  },
};

type setAlarmCalculation = {
  type: 'SET_ALARM_CALCULATION',
  payload: {
    calculation: AlarmCalculation,
    index: number,
  },
};

type setAlarmPercentage = {
  type: 'SET_ALARM_PERCENTAGE',
  payload: {
    percentage: number,
    index: number,
  },
};

type setAlarmPeriodScope = {
  type: 'SET_ALARM_PERIOD_SCOPE',
  payload: {
    periodScope: string,
    index: number,
  },
};

type setAlarmPeriodLength = {
  type: 'SET_ALARM_PERIOD_LENGTH',
  payload: {
    periodLength: number,
    index: number,
  },
};

type setAlarmValue = {
  type: 'SET_ALARM_VALUE',
  payload: {
    value: any,
    index: number,
  },
};

type showConfirmFeedbackMessage = {
  type: 'SHOW_CONFIRM_FEEDBACK_MESSAGE',
};

type closeFeedbackMessage = {
  type: 'CLOSE_FEEDBACK_MESSAGE',
};

type setAlarmColour = {
  type: 'SET_ALARM_COLOUR',
  payload: {
    colour: $PropertyType<Alarm, 'colour'>,
    index: number,
  },
};

type alarmSquadSearch = {
  type: 'ALARM_SEARCH_APPLIES_TO',
  payload: {
    searchTerm: string,
    alarmId: string,
  },
};

type applyTo = {
  type: 'APPLY_ALARM_TO',
  payload: {
    alarmPosition: number,
    selectedItems: Array<string>,
  },
};

type removeAthleteFromAlarm = {
  type: 'REMOVE_ATHLETE_FROM_ALARM',
};

type removePositionGroupFromAlarm = {
  type: 'REMOVE_POSITION_GROUP_FROM_ALARM',
};

type removePositionFromAlarm = {
  type: 'REMOVE_POSITION_FROM_ALARM',
};

type removeEntireSquadFromAlarm = {
  type: 'REMOVE_ENTIRE_SQUAD_FROM_ALARM',
};

type addAthleteToAlarm = {
  type: 'ADD_ATHLETE_TO_ALARM',
};

type addPositionGroupToAlarm = {
  type: 'ADD_POSITION_GROUP_TO_ALARM',
};

type addPositionToAlarm = {
  type: 'ADD_POSITION_TO_ALARM',
};

type addEntireSquadToAlarm = {
  type: 'ADD_ENTIRE_SQUAD_TO_ALARM',
};

type toggleDashboardFilters = {
  type: 'TOGGLE_DASHBOARD_FILTERS',
  payload: {
    isFilterShown: boolean,
  },
};

type updateFilterOptions = {
  type: 'UPDATE_FILTER_OPTIONS',
  payload: {
    groupBy: GroupBy,
    alarmFilters: Array<AlarmFilterOptions>,
    athleteFilters: Array<AthleteFilterOptions>,
    availabilityFilters: Array<AvailabilityFilterOptions>,
  },
};

type updateSort = {
  type: 'UPDATE_SORT',
  payload: {
    sortOrder: SortOrder,
    statusId: string,
  },
};

type updateShowAlarmOnMobile = {
  type: 'UPDATE_SHOW_ALARM_ON_MOBILE',
  payload: {
    index: number,
    showOnMobile: boolean,
  },
};

type toggleSelectAllForMobile = {
  type: 'TOGGLE_SELECT_ALL_FOR_MOBILE',
  payload: {
    alarmIdsWithShowOnMobile: Array<$PropertyType<Alarm, 'alarm_id'>>,
  },
};

export type Action =
  | setAlarmDefinitions
  | showAlarmsEditorModal
  | hideAlarmsEditorModal
  | saveAlarmDefinitionsRequest
  | saveAlarmDefinitionsSuccess
  | saveAlarmDefinitionsFailure
  | setAlarmDefinitionsForStatus
  | deleteAlarmDefinitionForStatus
  | addAlarmDefinitionForStatus
  | setAlarmCondition
  | setAlarmValue
  | showConfirmFeedbackMessage
  | closeFeedbackMessage
  | setAlarmColour
  | alarmSquadSearch
  | applyTo
  | removeAthleteFromAlarm
  | removePositionGroupFromAlarm
  | removePositionFromAlarm
  | removeEntireSquadFromAlarm
  | addAthleteToAlarm
  | addPositionGroupToAlarm
  | addPositionToAlarm
  | addEntireSquadToAlarm
  | hideCurrentModal
  | confirmCloseModal
  | cancelCloseModal
  | showConfirmation
  | hideConfirmation
  | groupAthletes
  | getLatestDataRequested
  | toggleDashboardFilters
  | updateFilterOptions
  | updateSort
  | updateShowAlarmOnMobile
  | toggleSelectAllForMobile
  | setAlarmCalculation
  | setAlarmType
  | setAlarmPercentage
  | setAlarmPeriodScope
  | setAlarmPeriodLength
  | deleteAllAlarmDefinitionsForStatus
  | confirmDeleteAllAlarmDefinitionsForStatus
  | showModal;
