// @flow
export type TemplateEditor = {
  id: number,
  firstname: string,
  lastname: string,
};

export type Template = {
  id: string,
  organisation: {
    id: string,
    name: string,
  },
  editor: TemplateEditor,
  name: string,
  created_at: string,
  updated_at: string,
};

// actions
type showDuplicateModal = {
  type: 'SHOW_DUPLICATE_MODAL',
  payload: {
    template: Template,
  },
};

type updateTemplateName = {
  type: 'UPDATE_TEMPLATE_NAME',
  payload: {
    templateName: string,
  },
};

type showConfirmDeleteTemplate = {
  type: 'SHOW_CONFIRM_DELETE_TEMPLATE',
  payload: {
    template: Template,
  },
};

type deleteTemplateSuccess = {
  type: 'DELETE_TEMPLATE_SUCCESS',
  payload: {
    template: Template,
  },
};

type showAddModal = {
  type: 'SHOW_ADD_MODAL',
};

type showRenameModal = {
  type: 'SHOW_RENAME_MODAL',
  payload: {
    template: Template,
  },
};

type addTemplateSuccess = {
  type: 'ADD_TEMPLATE_SUCCESS',
  payload: {
    template: Template,
  },
};

type duplicateTemplateSuccess = {
  type: 'DUPLICATE_TEMPLATE_SUCCESS',
  payload: {
    template: Template,
  },
};

type renameTemplateSuccess = {
  type: 'RENAME_TEMPLATE_SUCCESS',
  payload: {
    oldTemplate: Template,
    newTemplate: Template,
  },
};

type closeModal = {
  type: 'CLOSE_MODAL',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type serverRequest = {
  type: 'SERVER_REQUEST',
};

type serverRequestError = {
  type: 'SERVER_REQUEST_ERROR',
};

export type Action =
  | showDuplicateModal
  | showConfirmDeleteTemplate
  | deleteTemplateSuccess
  | updateTemplateName
  | showAddModal
  | showRenameModal
  | addTemplateSuccess
  | renameTemplateSuccess
  | duplicateTemplateSuccess
  | closeModal
  | hideAppStatus
  | serverRequest
  | serverRequestError;
