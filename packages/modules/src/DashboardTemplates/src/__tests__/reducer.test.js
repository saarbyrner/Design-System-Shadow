import {
  buildTemplates,
  buildTemplate,
} from '@kitman/common/src/utils/test_utils';
import { appStatus, modals, templates } from '../reducer';

describe('dashboard templates - appStatus reducer', () => {
  it('returns correct state on SERVER_REQUEST', () => {
    const initialState = { status: null };
    const action = { type: 'SERVER_REQUEST' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({ status: 'loading' });
  });

  it('returns correct state on SERVER_REQUEST_ERROR', () => {
    const initialState = { status: null };
    const action = { type: 'SERVER_REQUEST_ERROR' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({ status: 'error' });
  });

  it('returns correct state on ADD_TEMPLATE_SUCCESS', () => {
    const initialState = { status: 'loading' };
    const action = { type: 'ADD_TEMPLATE_SUCCESS' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({ status: 'loading' });
  });

  it('returns correct state on DUPLICATE_TEMPLATE_SUCCESS', () => {
    const initialState = { status: 'loading' };
    const action = { type: 'DUPLICATE_TEMPLATE_SUCCESS' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({ status: 'loading' });
  });

  it('returns correct state on RENAME_TEMPLATE_SUCCESS', () => {
    const initialState = { status: null };
    const action = { type: 'RENAME_TEMPLATE_SUCCESS' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({ status: 'success', message: 'Success' });
  });

  it('returns correct state on DELETE_TEMPLATE_SUCCESS', () => {
    const initialState = { status: 'loading' };
    const action = { type: 'DELETE_TEMPLATE_SUCCESS' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({ status: 'success', message: 'Success' });
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const initialState = { status: 'success' };
    const action = { type: 'HIDE_APP_STATUS' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({ status: null, message: null });
  });
});

describe('dashboard templates - modals reducer', () => {
  it('returns correct state on SHOW_ADD_MODAL', () => {
    const initialState = {
      addTemplateVisible: false,
      duplicateTemplateVisible: false,
      renameTemplateVisible: false,
      confirmDeleteVisible: false,
    };
    const action = { type: 'SHOW_ADD_MODAL' };
    const nextState = modals(initialState, action);
    expect(nextState).toEqual({
      addTemplateVisible: true,
      duplicateTemplateVisible: false,
      renameTemplateVisible: false,
      confirmDeleteVisible: false,
    });
  });

  it('returns correct state on SHOW_DUPLICATE_MODAL', () => {
    const templateToDuplicate = buildTemplate();
    const initialState = {
      addTemplateVisible: false,
      duplicateTemplateVisible: false,
      renameTemplateVisible: false,
      confirmDeleteVisible: false,
    };
    const action = {
      type: 'SHOW_DUPLICATE_MODAL',
      payload: { template: templateToDuplicate },
    };
    const nextState = modals(initialState, action);
    expect(nextState).toEqual({
      addTemplateVisible: false,
      duplicateTemplateVisible: true,
      renameTemplateVisible: false,
      confirmDeleteVisible: false,
      templateToDuplicate,
    });
  });

  it('returns correct state on UPDATE_TEMPLATE_NAME', () => {
    const templateName = 'new template name';
    const initialState = {
      addTemplateVisible: false,
      duplicateTemplateVisible: false,
      renameTemplateVisible: false,
    };
    const action = { type: 'UPDATE_TEMPLATE_NAME', payload: { templateName } };
    const nextState = modals(initialState, action);
    expect(nextState).toEqual({
      addTemplateVisible: false,
      duplicateTemplateVisible: false,
      renameTemplateVisible: false,
      templateName,
    });
  });

  it('returns correct state on SHOW_RENAME_MODAL', () => {
    const templateToRename = buildTemplate();
    const initialState = {
      addTemplateVisible: false,
      duplicateTemplateVisible: false,
      renameTemplateVisible: true,
      confirmDeleteVisible: false,
    };
    const action = {
      type: 'SHOW_RENAME_MODAL',
      payload: { template: templateToRename },
    };
    const nextState = modals(initialState, action);
    expect(nextState).toEqual({
      addTemplateVisible: false,
      duplicateTemplateVisible: false,
      renameTemplateVisible: true,
      confirmDeleteVisible: false,
      templateToRename,
      templateName: templateToRename.name,
    });
  });

  it('returns correct state on SHOW_CONFIRM_DELETE_TEMPLATE', () => {
    const template = buildTemplate();
    const initialState = {
      addTemplateVisible: false,
      duplicateTemplateVisible: false,
      renameTemplateVisible: false,
      confirmDeleteVisible: false,
    };
    const action = {
      type: 'SHOW_CONFIRM_DELETE_TEMPLATE',
      payload: { template },
    };
    const nextState = modals(initialState, action);
    expect(nextState).toEqual({
      addTemplateVisible: false,
      duplicateTemplateVisible: false,
      renameTemplateVisible: false,
      confirmDeleteVisible: true,
      templateToDelete: template,
    });
  });

  it('returns correct state on CLOSE_MODAL', () => {
    const initialState = {
      addTemplateVisible: true,
      duplicateTemplateVisible: true,
      renameTemplateVisible: true,
    };
    const action = { type: 'CLOSE_MODAL' };
    const nextState = modals(initialState, action);
    expect(nextState).toEqual({
      addTemplateVisible: false,
      duplicateTemplateVisible: false,
      renameTemplateVisible: false,
      confirmDeleteVisible: false,
    });
  });

  it('returns correct state on ADD_TEMPLATE_SUCCESS', () => {
    const initialState = {
      addTemplateVisible: true,
      duplicateTemplateVisible: true,
      renameTemplateVisible: true,
      confirmDeleteVisible: true,
    };
    const action = { type: 'ADD_TEMPLATE_SUCCESS' };
    const nextState = modals(initialState, action);
    expect(nextState).toEqual({
      addTemplateVisible: false,
      duplicateTemplateVisible: false,
      renameTemplateVisible: false,
      confirmDeleteVisible: false,
    });
  });
});

describe('dashboard templates - templates reducer', () => {
  let initialState;
  beforeEach(() => {
    initialState = buildTemplates(1);
  });

  describe('when the user duplicates a template', () => {
    it('returns correct state on DUPLICATE_TEMPLATE_SUCCESS', () => {
      const template = buildTemplate();
      template.name = 'Duplicate template';
      const action = {
        type: 'DUPLICATE_TEMPLATE_SUCCESS',
        payload: { template },
      };
      const nextState = templates(initialState, action);
      expect(nextState[0]).toEqual(initialState[0]);
    });
  });

  describe('when the user renames a template', () => {
    it('returns correct state on RENAME_TEMPLATE_SUCCESS', () => {
      const oldTemplate = buildTemplate();
      const newTemplate = { ...oldTemplate, name: 'Renamed template' };
      const action = {
        type: 'RENAME_TEMPLATE_SUCCESS',
        payload: { oldTemplate, newTemplate },
      };
      const nextState = templates(initialState, action);
      expect(nextState[0]).toEqual(initialState[0]);
    });
  });

  describe('when the user adds a new template', () => {
    it('returns correct state on ADD_TEMPLATE_SUCCESS', () => {
      const template = buildTemplate();
      const action = { type: 'ADD_TEMPLATE_SUCCESS', payload: { template } };
      const nextState = templates(initialState, action);
      expect(nextState[0]).toEqual(initialState[0]);
      expect(nextState[1]).toEqual(template);
    });
  });

  describe('when the user deletes a template', () => {
    beforeEach(() => {
      initialState = buildTemplates(4);
    });
    it('returns correct state on DELETE_TEMPLATE_SUCCESS', () => {
      const templateToDelete = initialState[2];
      const action = {
        type: 'DELETE_TEMPLATE_SUCCESS',
        payload: { template: templateToDelete },
      };
      const nextState = templates(initialState, action);
      expect(nextState.length).toBe(3);
      expect(nextState.indexOf(templateToDelete)).toBe(-1);
    });
  });
});
