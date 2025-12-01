import $ from 'jquery';
import {
  serverRequest,
  serverRequestError,
  showDuplicateModal,
  showConfirmDeleteTemplate,
  deleteTemplateSuccess,
  showAddModal,
  addTemplateSuccess,
  duplicateTemplateSuccess,
  renameTemplateSuccess,
  closeModal,
  hideAppStatus,
  addTemplate,
  deleteTemplate,
  duplicateTemplate,
  renameTemplate,
} from '../actions';

jest.useFakeTimers();

jest.mock('jquery', () => {
  const ajaxMock = jest.fn();
  const $fn = () => ({ attr: () => 'token' });
  $fn.ajax = (...args) => ajaxMock(...args);
  $fn.getAjaxMock = () => ajaxMock;
  return $fn;
});

const buildTemplate = () => ({ id: '1', name: 'Template' });

describe('Dashboard Templates Actions', () => {
  it('has the correct action SERVER_REQUEST', () => {
    expect(serverRequest()).toEqual({ type: 'SERVER_REQUEST' });
  });

  it('has the correct action SERVER_REQUEST_ERROR', () => {
    expect(serverRequestError()).toEqual({ type: 'SERVER_REQUEST_ERROR' });
  });

  it('has the correct action SHOW_DUPLICATE_MODAL', () => {
    const template = buildTemplate();
    expect(showDuplicateModal(template)).toEqual({
      type: 'SHOW_DUPLICATE_MODAL',
      payload: { template },
    });
  });

  it('has the correct action SHOW_CONFIRM_DELETE_TEMPLATE', () => {
    const template = buildTemplate();
    expect(showConfirmDeleteTemplate(template)).toEqual({
      type: 'SHOW_CONFIRM_DELETE_TEMPLATE',
      payload: { template },
    });
  });

  it('has the correct action DELETE_TEMPLATE_SUCCESS', () => {
    const template = buildTemplate();
    expect(deleteTemplateSuccess(template)).toEqual({
      type: 'DELETE_TEMPLATE_SUCCESS',
      payload: { template },
    });
  });

  it('has the correct action SHOW_ADD_MODAL', () => {
    expect(showAddModal()).toEqual({ type: 'SHOW_ADD_MODAL' });
  });

  it('has the correct action ADD_TEMPLATE_SUCCESS', () => {
    const template = buildTemplate();
    expect(addTemplateSuccess(template)).toEqual({
      type: 'ADD_TEMPLATE_SUCCESS',
      payload: { template },
    });
  });

  it('has the correct action DUPLICATE_TEMPLATE_SUCCESS', () => {
    const template = buildTemplate();
    expect(duplicateTemplateSuccess(template)).toEqual({
      type: 'DUPLICATE_TEMPLATE_SUCCESS',
      payload: { template },
    });
  });

  it('has the correct action RENAME_TEMPLATE_SUCCESS', () => {
    const oldTemplate = buildTemplate();
    const newTemplate = { ...oldTemplate, name: 'Updated Template' };
    expect(renameTemplateSuccess(oldTemplate, newTemplate)).toEqual({
      type: 'RENAME_TEMPLATE_SUCCESS',
      payload: { oldTemplate, newTemplate },
    });
  });

  it('has the correct action CLOSE_MODAL', () => {
    expect(closeModal()).toEqual({ type: 'CLOSE_MODAL' });
  });

  it('has the correct action HIDE_APP_STATUS', () => {
    expect(hideAppStatus()).toEqual({ type: 'HIDE_APP_STATUS' });
  });
});

describe('addTemplate thunk', () => {
  it('calls server with correct parameters and dispatches success & redirect', () => {
    const ajax = $.getAjaxMock();
    ajax.mockImplementation(() => ({
      done: (cb) => {
        cb({ dashboard: buildTemplate() });
        return { fail: () => {} };
      },
      fail: () => {},
    }));
    const dispatch = jest.fn();
    addTemplate('template name')(dispatch);
    expect(dispatch.mock.calls[0][0]).toEqual(serverRequest());
    expect(dispatch.mock.calls[1][0].type).toBe('ADD_TEMPLATE_SUCCESS');
    jest.runAllTimers();
  });
});

describe('deleteTemplate thunk', () => {
  it('dispatches success after delete', () => {
    const template = buildTemplate();
    const ajax = $.getAjaxMock();
    ajax.mockImplementation(() => ({
      done: (cb) => {
        cb();
        return { fail: () => {} };
      },
      fail: () => {},
    }));
    const dispatch = jest.fn();
    deleteTemplate()(dispatch, () => ({
      modals: { templateToDelete: template },
    }));
    expect(dispatch.mock.calls[0][0]).toEqual(serverRequest());
    expect(dispatch.mock.calls[1][0]).toEqual(deleteTemplateSuccess(template));
    jest.runAllTimers();
  });
});

describe('duplicateTemplate thunk', () => {
  it('dispatches duplicate success', () => {
    const template = buildTemplate();
    const ajax = $.getAjaxMock();
    ajax.mockImplementation(() => ({
      done: (cb) => {
        cb({ dashboard: template });
        return { fail: () => {} };
      },
      fail: () => {},
    }));
    const dispatch = jest.fn();
    duplicateTemplate()(dispatch, () => ({
      modals: {
        templateName: 'Duplicate template name',
        templateToDuplicate: template,
      },
    }));
    expect(dispatch.mock.calls[0][0]).toEqual(serverRequest());
    expect(dispatch.mock.calls[1][0]).toEqual(
      duplicateTemplateSuccess(template)
    );
    jest.runAllTimers();
  });
});

describe('renameTemplate thunk', () => {
  it('dispatches rename success', () => {
    const template = buildTemplate();
    const updated = { ...template, name: 'Rename template name' };
    const ajax = $.getAjaxMock();
    ajax.mockImplementation(() => ({
      done: (cb) => {
        cb({ dashboard: updated });
        return { fail: () => {} };
      },
      fail: () => {},
    }));
    const dispatch = jest.fn();
    renameTemplate()(dispatch, () => ({
      modals: { templateName: updated.name, templateToRename: template },
    }));
    expect(dispatch.mock.calls[0][0]).toEqual(serverRequest());
    expect(dispatch.mock.calls[1][0]).toEqual(
      renameTemplateSuccess(template, updated)
    );
    jest.runAllTimers();
  });
});
