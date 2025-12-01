// @flow
/* eslint-disable no-use-before-define */
import type { Template } from './__common';
import type { State } from './state';

type ShowRenameModalAction = {
  type: 'SHOW_RENAME_MODAL',
  payload: { templateId: $PropertyType<Template, 'id'> },
};
type ShowDuplicateModalAction = {
  type: 'SHOW_DUPLICATE_MODAL',
  payload: { templateId: $PropertyType<Template, 'id'> },
};
type AddModalAction = {
  type: 'SHOW_ADD_MODAL',
};
type DeleteModalAction = {
  type: 'DELETE_TEMPLATE',
  payload: { templateId: $PropertyType<Template, 'id'> },
};
type CloseModalAction = {
  type: 'CLOSE_MODAL',
};
type UpdateTemplateAction = {
  type: 'UPDATE_TEMPLATE',
  payload: {
    templateId: $PropertyType<Template, 'id'>,
    templateData: Template,
  },
};
type SavingRequestAction = {
  type: 'SAVING_REQUEST',
};
type RequestSuccessAction = {
  type: 'REQUEST_SUCCESS',
};
type RequestErrorAction = {
  type: 'REQUEST_ERROR',
};
type HideAppStatusAction = {
  type: 'HIDE_APP_STATUS',
};
type ActivateTemplateAction = {
  type: 'ACTIVATE_TEMPLATE',
  payload: { templateId: $PropertyType<Template, 'id'> },
};
type DeactivateTemplateAction = {
  type: 'DEACTIVATE_TEMPLATE',
  payload: { templateId: $PropertyType<Template, 'id'> },
};

type SetTemplateScheduleAction = {
  type: 'SET_SCHEDULE',
  payload: {
    templateId: $PropertyType<Template, 'id'>,
    time: $PropertyType<Template, 'scheduled_time'> | null,
    timezone: $PropertyType<Template, 'local_timezone'> | null,
    days: $PropertyType<Template, 'scheduled_days'> | null,
  },
};
type closeSidePanel = {
  type: 'CLOSE_SIDE_PANEL',
};
type openSidePanel = {
  type: 'OPEN_SIDE_PANEL',
  payload: { template: Template, orgTimeZone: string },
};
type toggleNotifyAthletes = {
  type: 'TOGGLE_NOTIFY_ATHLETES',
};
type updateScheduleTime = {
  type: 'UPDATE_SCHEDULE_TIME',
  payload: {
    time: string | null,
  },
};
type updateLocalTimeZone = {
  type: 'UPDATE_LOCAL_TIMEZONE',
  payload: {
    timezone: string,
  },
};
type toggleDay = {
  type: 'TOGGLE_DAY',
  payload: {
    day: string,
  },
};
type ShowActivateDialogue = {
  type: 'SHOW_ACTIVATE_DIALOGUE',
  payload: {
    templateId: string,
  },
};
type ShowDeleteDialogue = {
  type: 'SHOW_DELETE_DIALOGUE',
  payload: {
    templateId: string,
  },
};
type HideActivateDialogue = {
  type: 'HIDE_ACTIVATE_DIALOGUE',
};
type HideDeleteDialogue = {
  type: 'HIDE_DELETE_DIALOGUE',
};

type setSearchText = {
  type: 'SET_SEARCH_TEXT',
  payload: string,
};
type setSearchStatus = {
  type: 'SET_SEARCH_STATUS',
  payload: string,
};
type setSearchScheduled = {
  type: 'SET_SEARCH_SCHEDULED',
  payload: string,
};
type setSortingParams = {
  type: 'SET_SORTING_PARAMS',
  payload: {
    column: string,
    direction: string,
  },
};
export type Action =
  | ShowRenameModalAction
  | ShowDuplicateModalAction
  | AddModalAction
  | DeleteModalAction
  | CloseModalAction
  | UpdateTemplateAction
  | SavingRequestAction
  | RequestSuccessAction
  | HideAppStatusAction
  | RequestErrorAction
  | ShowActivateDialogue
  | ShowDeleteDialogue
  | HideActivateDialogue
  | HideDeleteDialogue
  | ActivateTemplateAction
  | DeactivateTemplateAction
  | SetTemplateScheduleAction
  | closeSidePanel
  | openSidePanel
  | toggleNotifyAthletes
  | updateLocalTimeZone
  | updateScheduleTime
  | toggleDay
  | setSearchText
  | setSearchStatus
  | setSearchScheduled
  | setSortingParams;

// redux specific types for thunk actions
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
