// @flow
import $ from 'jquery';
import type { Action, Template } from './types';

export const showDuplicateModal = (template: Template): Action => ({
  type: 'SHOW_DUPLICATE_MODAL',
  payload: {
    template,
  },
});

export const updateTemplateName = (templateName: string): Action => ({
  type: 'UPDATE_TEMPLATE_NAME',
  payload: {
    templateName,
  },
});

export const showConfirmDeleteTemplate = (template: Template): Action => ({
  type: 'SHOW_CONFIRM_DELETE_TEMPLATE',
  payload: {
    template,
  },
});

export const deleteTemplateSuccess = (template: Template): Action => ({
  type: 'DELETE_TEMPLATE_SUCCESS',
  payload: {
    template,
  },
});

export const showAddModal = () => ({
  type: 'SHOW_ADD_MODAL',
});

export const showRenameModal = (template: Template): Action => ({
  type: 'SHOW_RENAME_MODAL',
  payload: {
    template,
  },
});

export const addTemplateSuccess = (template: Template): Action => ({
  type: 'ADD_TEMPLATE_SUCCESS',
  payload: {
    template,
  },
});

export const duplicateTemplateSuccess = (template: Template): Action => ({
  type: 'DUPLICATE_TEMPLATE_SUCCESS',
  payload: {
    template,
  },
});

export const renameTemplateSuccess = (
  oldTemplate: Template,
  newTemplate: Template
): Action => ({
  type: 'RENAME_TEMPLATE_SUCCESS',
  payload: {
    oldTemplate,
    newTemplate,
  },
});

export const closeModal = (): Action => ({
  type: 'CLOSE_MODAL',
});

export const serverRequest = (): Action => ({
  type: 'SERVER_REQUEST',
});

export const serverRequestError = (): Action => ({
  type: 'SERVER_REQUEST_ERROR',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

const handleAddedDashboard = (dashboard, dispatch) => {
  dispatch(addTemplateSuccess(dashboard));
  setTimeout(() => {
    window.location.assign(`/dashboards/${dashboard.id}/edit`);
  }, 1000);
};

export const addTemplate =
  (templateName: string) => (dispatch: (action: Action) => void) => {
    dispatch(serverRequest());
    $.ajax({
      method: 'POST',
      url: '/dashboards',
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({ name: templateName }),
    })
      .done((response) => {
        handleAddedDashboard(response.dashboard, dispatch);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const deleteTemplate =
  () => (dispatch: (action: Action) => void, getState: () => Object) => {
    const template = getState().modals.templateToDelete;
    dispatch(serverRequest());
    $.ajax({
      method: 'DELETE',
      url: `/dashboards/${template.id}`,
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done(() => {
        dispatch(deleteTemplateSuccess(template));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

const handleDuplicatedDashboard = (dashboard, dispatch, successAction) => {
  dispatch(successAction(dashboard));
  setTimeout(() => {
    window.location.assign(`/dashboards/${dashboard.id}/edit`);
  }, 1000);
};

export const duplicateTemplate =
  () => (dispatch: (action: Action) => void, getState: () => Object) => {
    const templateName = getState().modals.templateName;
    const duplicateTemplateId = getState().modals.templateToDuplicate.id;
    dispatch(serverRequest());
    $.ajax({
      method: 'POST',
      url: '/dashboards/duplicate',
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({
        dashboard_id: duplicateTemplateId,
        name: templateName,
      }),
    })
      .done((response) => {
        handleDuplicatedDashboard(
          response.dashboard,
          dispatch,
          duplicateTemplateSuccess
        );
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const renameTemplate =
  () => (dispatch: (action: Action) => void, getState: () => Object) => {
    const templateName = getState().modals.templateName;
    const oldTemplate = getState().modals.templateToRename;
    const renameTemplateId = oldTemplate.id;
    dispatch(serverRequest());
    $.ajax({
      method: 'PATCH',
      url: `/dashboards/${renameTemplateId}`,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({
        dashboardId: renameTemplateId,
        name: templateName,
      }),
    })
      .done((response) => {
        dispatch(renameTemplateSuccess(oldTemplate, response.dashboard));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };
