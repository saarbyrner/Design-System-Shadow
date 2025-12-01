// @flow
import $ from 'jquery';
// import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { Template } from '../types/__common';
import type { Action, ThunkAction, Dispatch } from '../types/actions';

export const showRenameModal = (templateId: string): Action => ({
  type: 'SHOW_RENAME_MODAL',
  payload: {
    templateId,
  },
});

export const closeModal = (): Action => ({
  type: 'CLOSE_MODAL',
});

export const showDuplicateModal = (templateId: string): Action => ({
  type: 'SHOW_DUPLICATE_MODAL',
  payload: {
    templateId,
  },
});

export const deleteTemplate = (templateId: string): Action => ({
  type: 'DELETE_TEMPLATE',
  payload: {
    templateId,
  },
});

export const addTemplate = (): Action => ({
  type: 'SHOW_ADD_MODAL',
});

export const savingRequest = (): Action => ({
  type: 'SAVING_REQUEST',
});

export const requestSuccess = (): Action => ({
  type: 'REQUEST_SUCCESS',
});

export const requestError = (): Action => ({
  type: 'REQUEST_ERROR',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const activateTemplate = (templateId: string): Action => ({
  type: 'ACTIVATE_TEMPLATE',
  payload: {
    templateId,
  },
});

export const deactivateTemplate = (templateId: string): Action => ({
  type: 'DEACTIVATE_TEMPLATE',
  payload: {
    templateId,
  },
});

export const setTemplateSchedule = (
  templateId: string,
  time: string | null,
  timezone: string | null,
  days: { [string]: boolean } | null
): Action => ({
  type: 'SET_SCHEDULE',
  payload: {
    templateId,
    time,
    timezone,
    days,
  },
});

export const showActivateDialogue = (templateId: string): Action => ({
  type: 'SHOW_ACTIVATE_DIALOGUE',
  payload: {
    templateId,
  },
});

export const showDeleteDialogue = (templateId: string): Action => ({
  type: 'SHOW_DELETE_DIALOGUE',
  payload: {
    templateId,
  },
});

export const hideActivateDialogue = (): Action => ({
  type: 'HIDE_ACTIVATE_DIALOGUE',
});

export const hideDeleteDialogue = (): Action => ({
  type: 'HIDE_DELETE_DIALOGUE',
});

export const updateTemplate = (
  templateId: string | number,
  templateData: Template
): Action => ({
  type: 'UPDATE_TEMPLATE',
  payload: {
    templateId,
    templateData,
  },
});

export const renameTemplateRequest =
  (newTemplateName: string): ThunkAction =>
  (dispatch: Dispatch, getState: any) => {
    const targetTemplateId = getState().modals.templateId;
    dispatch(savingRequest());
    $.ajax({
      method: 'PATCH',
      url: `/settings/questionnaire_templates/${targetTemplateId}/rename`,
      contentType: 'application/json',
      data: JSON.stringify({ name: newTemplateName }),
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done((response: { template: Template }) => {
        dispatch(updateTemplate(targetTemplateId, response.template));
        dispatch(requestSuccess());

        setTimeout(() => {
          dispatch(closeModal());
          dispatch(hideAppStatus());
        }, 2000);
      })
      .fail(() => {
        dispatch(requestError());
      });
  };

export const deleteTemplateRequest =
  (templateId: string): ThunkAction =>
  (dispatch) => {
    dispatch(savingRequest());
    $.ajax({
      method: 'DELETE',
      url: `/settings/questionnaire_templates/${templateId}`,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done(() => {
        dispatch(deleteTemplate(templateId));
        dispatch(requestSuccess());

        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 2000);
      })
      .fail(() => {
        dispatch(requestError());
      });
  };

export const activateTemplateRequest =
  (templateId: string): ThunkAction =>
  (dispatch) => {
    dispatch(savingRequest());
    $.ajax({
      method: 'PATCH',
      url: `/settings/questionnaire_templates/${templateId}/activate`,
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done(() => {
        dispatch(activateTemplate(templateId));

        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 100);
      })
      .fail(() => {
        dispatch(requestError());
      });
  };

export const deactivateTemplateRequest =
  (templateId: string): ThunkAction =>
  (dispatch) => {
    dispatch(savingRequest());
    $.ajax({
      method: 'PATCH',
      url: `/settings/questionnaire_templates/${templateId}/deactivate`,
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done(() => {
        dispatch(deactivateTemplate(templateId));

        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 100);
      })
      .fail(() => {
        dispatch(requestError());
      });
  };

export const closeSidePanel = (): Action => ({
  type: 'CLOSE_SIDE_PANEL',
});

export const openSidePanel = (
  template: Template,
  orgTimeZone: string
): Action => ({
  type: 'OPEN_SIDE_PANEL',
  payload: {
    template,
    orgTimeZone,
  },
});

export const toggleNotifyAthletes = (): Action => ({
  type: 'TOGGLE_NOTIFY_ATHLETES',
});

export const updateScheduleTime = (time: string): Action => ({
  type: 'UPDATE_SCHEDULE_TIME',
  payload: {
    time,
  },
});

export const updateLocalTimeZone = (timezone: string): Action => ({
  type: 'UPDATE_LOCAL_TIMEZONE',
  payload: {
    timezone,
  },
});

export const toggleDay = (day: string): Action => ({
  type: 'TOGGLE_DAY',
  payload: {
    day,
  },
});

export const setSearchText = (text: string): Action => ({
  type: 'SET_SEARCH_TEXT',
  payload: text,
});

export const setSearchStatus = (text: string): Action => ({
  type: 'SET_SEARCH_STATUS',
  payload: text,
});

export const setSearchScheduled = (text: string): Action => ({
  type: 'SET_SEARCH_SCHEDULED',
  payload: text,
});

export const setSortingParams = (column: string, direction: string) => {
  return {
    type: 'SET_SORTING_PARAMS',
    payload: {
      column,
      direction,
    },
  };
};

export const saveScheduleReminder =
  (): ThunkAction => (dispatch: Dispatch, getState: any) => {
    dispatch(savingRequest());

    const targetTemplateId = getState().reminderSidePanel.templateId;
    const notifyAthletes = getState().reminderSidePanel.notifyAthletes;
    const scheduledTime = notifyAthletes
      ? getState().reminderSidePanel.scheduledTime
      : null;

    const selectedDays =
      notifyAthletes && window.featureFlags['repeat-reminders']
        ? getState().reminderSidePanel.scheduledDays
        : {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          };

    const scheduledDays =
      notifyAthletes && window.featureFlags['repeat-reminders']
        ? selectedDays
        : null;

    const localTimeZone = notifyAthletes
      ? getState().reminderSidePanel.localTimeZone
      : null;

    const requestData = {
      scheduled_time: scheduledTime,
      scheduled_days: scheduledDays, // When null backend assigns true for all days.
      local_timezone: localTimeZone,
    };

    $.ajax({
      method: 'PUT',
      url: `/settings/questionnaire_templates/${targetTemplateId}`,
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      data: JSON.stringify(requestData),
    })
      .done(() => {
        setTimeout(() => {
          dispatch(
            setTemplateSchedule(
              targetTemplateId,
              scheduledTime,
              localTimeZone,
              selectedDays // Assigning selectedDays as UI cannot accept null for the day selector
            )
          );
          dispatch(closeSidePanel());
          dispatch(hideAppStatus());
        }, 2000);
      })
      .fail(() => {
        dispatch(requestError());
      });
  };
