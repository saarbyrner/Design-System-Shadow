// @flow
import $ from 'jquery';
import { setAthletes } from '@kitman/common/src/actions';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { Alarm, AlarmCalculation } from '@kitman/common/src/types/Alarm';
import type { Status } from '@kitman/common/src/types/Status';
import type {
  GroupBy,
  SetAthletesAction,
  SortOrder,
} from '@kitman/common/src/types';
import type {
  AlarmFilterOptions,
  AthleteFilterOptions,
  AvailabilityFilterOptions,
} from '@kitman/common/src/types/__common';
import type { Action } from '../types/actions';

export const showAlarmsEditorModal = (
  statusId: $PropertyType<Status, 'status_id'>
): Action => ({
  type: 'SHOW_MODAL',
  modalType: 'alarms',
  modalProps: {
    statusId,
  },
});

export const hideCurrentModal = (): Action => ({
  type: 'HIDE_CURRENT_MODAL',
});

export const confirmCloseModal =
  (): ((dispatch: Function) => any) =>
  (dispatch: (action: Action) => Action) => {
    const workaround = () => {
      dispatch(hideCurrentModal());
    };

    dispatch({
      type: 'CONFIRM_CLOSE_MODAL',
      payload: {
        action: workaround,
      },
    });
  };

export const cancelCloseModal = (): Action => ({
  type: 'CANCEL_CLOSE_MODAL',
});

export const hideConfirmation = (): Action => ({
  type: 'HIDE_CONFIRMATION',
});

export const groupAthletes = (
  athletes: Array<Athlete>,
  groupBy: GroupBy
): Action => ({
  type: 'GROUP_ATHLETES',
  payload: {
    athletes,
    groupBy,
  },
});

// This isn't used by anything at the moment but will be dispatched below so
// it's obvious what's going on in the console and it's there if anything needs
// it in the future
export const getLatestDataRequested = (): Action => ({
  type: 'GET_LATEST_DATA_REQUESTED',
});

// if getLatestData ajax call fails this will be called to reload the whole page
// and avoid leaving redux in a potentially incorrect state
const defaultFailureHandler = () => {
  window.location.reload();
};

export const setAlarmDefinitions = (alarmDefinitions: Object): Action => ({
  type: 'SET_ALARM_DEFINITIONS',
  payload: {
    alarmDefinitions,
  },
});

export const getLatestData =
  (
    postUpdateAction: Function,
    failureHandler: Function = defaultFailureHandler
  ) =>
  (
    dispatch: (action: Action | SetAthletesAction) => void,
    getState: Function = () => {}
  ) => {
    dispatch(getLatestDataRequested());
    $.getJSON('/dashboards/show.json', {
      id: getState()?.dashboards?.currentId,
    })
      .done((data) => {
        dispatch(setAthletes(data.athletes));
        dispatch(setAlarmDefinitions(data.alarm_definitions));
        dispatch(postUpdateAction);
      })
      .fail(failureHandler);
  };

export const switchDashboard = (dashboardId: number) => () => {
  window.location = `/dashboards/${dashboardId}`;
};

export const saveAlarmDefinitionsRequest = (): Action => ({
  type: 'SAVE_ALARM_DEFINITIONS_REQUEST',
});

export const saveAlarmDefinitionsSuccess = (): Action => ({
  type: 'SAVE_ALARM_DEFINITIONS_SUCCESS',
});

export const saveAlarmDefinitionsFailure = (): Action => ({
  type: 'SAVE_ALARM_DEFINITIONS_FAILURE',
});

const modalHideTimeout = 1000;

export const saveAlarmDefinitions =
  (
    statusId: $PropertyType<Status, 'status_id'>,
    alarmDefinitionsForStatus: Object
  ): any =>
  (dispatch: (action: any) => void) => {
    dispatch(saveAlarmDefinitionsRequest());
    // convert athletes back to ids to save
    let alarmDefinitionsToSave = JSON.parse(
      JSON.stringify(alarmDefinitionsForStatus)
    );
    alarmDefinitionsToSave = alarmDefinitionsToSave.map((alarmDefinition) => {
      Object.assign(alarmDefinition, {
        athletes: alarmDefinition.athletes.map(
          (athlete) => athlete.id || athlete
        ),
      });
      return alarmDefinition;
    });

    $.ajax({
      method: 'PUT',
      url: '/settings/alarms',
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({
        status_id: statusId,
        alarms: alarmDefinitionsToSave,
      }),
    })
      .done(() => {
        // $FlowFixMe: third party library not imported (Google analytics)
        if (typeof ga === 'function') {
          // eslint-disable-next-line no-undef
          ga(
            'send',
            'event',
            'Dashboard',
            'save_alarm',
            'Save Alarm Definitions Success'
          );
        }
        const postUpdateAction = () => {
          dispatch(saveAlarmDefinitionsSuccess());
          setTimeout(() => {
            dispatch(hideCurrentModal());
          }, modalHideTimeout);
        };
        dispatch(getLatestData(postUpdateAction));
      })
      .fail(() => {
        dispatch(saveAlarmDefinitionsFailure());
      });
  };

export const setAlarmDefinitionsForStatus = (alarms: Array<Alarm>): Action => ({
  type: 'SET_ALARM_DEFINITIONS_FOR_STATUS',
  payload: {
    alarms,
  },
});

export const deleteAlarmDefinitionForStatus = (index: number): Action => ({
  type: 'DELETE_ALARM_DEFINITION_FOR_STATUS',
  payload: {
    index,
  },
});

export const deleteAllAlarmDefinitionsForStatus = (): Action => ({
  type: 'DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS',
});

export const confirmDeleteAllAlarmDefinitionsForStatus = (): Action => ({
  type: 'CONFIRM_DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS',
});

export const addAlarmDefinitionForStatus = (
  alarmId: $PropertyType<Alarm, 'alarm_id'>
): Action => ({
  type: 'ADD_ALARM_DEFINITION_FOR_STATUS',
  payload: {
    alarmId,
  },
});

export const setAlarmCondition = (
  condition: $PropertyType<Alarm, 'condition'>,
  index: number
): Action => ({
  type: 'SET_ALARM_CONDITION',
  payload: {
    condition,
    index,
  },
});

export const setAlarmType = (
  alarmType: $PropertyType<Alarm, 'alarm_type'>,
  index: number
): Action => ({
  type: 'SET_ALARM_TYPE',
  payload: {
    alarmType,
    index,
  },
});

export const setAlarmCalculation = (
  calculation: AlarmCalculation,
  index: number
): Action => ({
  type: 'SET_ALARM_CALCULATION',
  payload: {
    calculation,
    index,
  },
});

export const setAlarmPercentage = (
  percentage: number,
  index: number
): Action => ({
  type: 'SET_ALARM_PERCENTAGE',
  payload: {
    percentage,
    index,
  },
});

export const setAlarmPeriodScope = (
  periodScope: string,
  index: number
): Action => ({
  type: 'SET_ALARM_PERIOD_SCOPE',
  payload: {
    periodScope,
    index,
  },
});

export const setAlarmPeriodLength = (
  periodLength: number,
  index: number
): Action => ({
  type: 'SET_ALARM_PERIOD_LENGTH',
  payload: {
    periodLength,
    index,
  },
});

export const setAlarmValue = (value: number, index: number): Action => ({
  type: 'SET_ALARM_VALUE',
  payload: {
    value,
    index,
  },
});

export const showConfirmFeedbackMessage = (): Action => ({
  type: 'SHOW_CONFIRM_FEEDBACK_MESSAGE',
});

export const closeFeedbackMessage = (): Action => ({
  type: 'CLOSE_FEEDBACK_MESSAGE',
});

export const setAlarmColour = (
  colour: $PropertyType<Alarm, 'colour'>,
  index: number
): Action => ({
  type: 'SET_ALARM_COLOUR',
  payload: {
    colour,
    index,
  },
});

export const updateShowAlarmOnMobile = (
  alarmPosition: number,
  showOnMobile: boolean
): Action => ({
  type: 'UPDATE_SHOW_ALARM_ON_MOBILE',
  payload: {
    index: alarmPosition,
    showOnMobile,
  },
});

export const toggleSelectAllForMobile = (
  alarmIdsWithShowOnMobile: Array<$PropertyType<Alarm, 'alarm_id'>>
): Action => ({
  type: 'TOGGLE_SELECT_ALL_FOR_MOBILE',
  payload: {
    alarmIdsWithShowOnMobile,
  },
});

export const alarmSquadSearch = (
  searchTerm: string,
  alarmId: $PropertyType<Alarm, 'alarm_id'>
): Action => ({
  type: 'ALARM_SEARCH_APPLIES_TO',
  payload: {
    searchTerm,
    alarmId,
  },
});

export const applyTo = (
  alarmPosition: number,
  selectedItems: Array<string>
): Action => ({
  type: 'APPLY_ALARM_TO',
  payload: {
    alarmPosition,
    selectedItems,
  },
});

export const toggleDashboardFilters = (isFilterShown: boolean): Action => ({
  type: 'TOGGLE_DASHBOARD_FILTERS',
  payload: {
    isFilterShown,
  },
});

export const updateFilterOptions = (
  groupBy: GroupBy,
  alarmFilters: Array<AlarmFilterOptions>,
  athleteFilters: Array<AthleteFilterOptions>,
  availabilityFilters: Array<AvailabilityFilterOptions>
): Action => ({
  type: 'UPDATE_FILTER_OPTIONS',
  payload: {
    groupBy,
    alarmFilters,
    athleteFilters,
    availabilityFilters,
  },
});

export const updateSort = (
  sortOrder: SortOrder,
  statusId: string,
  statusKey: string
): Action => ({
  type: 'UPDATE_SORT',
  payload: {
    sortOrder,
    statusId,
    statusKey,
  },
});
