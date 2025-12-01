import $ from 'jquery';
import {
  fakeAjaxSuccess,
  fakeAjaxFailure,
} from '@kitman/modules/src/analysis/Dashboard/utils/ajaxMocks';
import {
  openActionsWidgetModal,
  closeActionsWidgetModal,
  selectAnnotationType,
  unselectAnnotationType,
  setPopulation,
  setHiddenColumns,
  saveActionsWidgetLoading,
  saveActionsWidgetSuccess,
  saveActionsWidgetFailure,
  closeActionsWidgetAppStatus,
  saveActionsWidget,
  editActionsWidget,
} from '../actionsWidgetModal';

jest.mock('jquery');

describe('actionsWidgetModal action creators', () => {
  it('creates OPEN_ACTIONS_WIDGET_MODAL', () => {
    const action = openActionsWidgetModal(1, ['a'], { foo: 1 }, ['col']);
    expect(action).toEqual({
      type: 'OPEN_ACTIONS_WIDGET_MODAL',
      payload: {
        widgetId: 1,
        annotationTypes: ['a'],
        population: { foo: 1 },
        hiddenColumns: ['col'],
      },
    });
  });

  it('creates CLOSE_ACTIONS_WIDGET_MODAL', () => {
    expect(closeActionsWidgetModal()).toEqual({
      type: 'CLOSE_ACTIONS_WIDGET_MODAL',
    });
  });

  it('creates SELECT_ACTIONS_WIDGET_ANNOTATION_TYPE', () => {
    expect(selectAnnotationType(5)).toEqual({
      type: 'SELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
      payload: { annotationTypeId: 5 },
    });
  });

  it('creates UNSELECT_ACTIONS_WIDGET_ANNOTATION_TYPE', () => {
    expect(unselectAnnotationType(7)).toEqual({
      type: 'UNSELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
      payload: { annotationTypeId: 7 },
    });
  });

  it('creates SET_ACTIONS_WIDGET_POPULATION', () => {
    expect(setPopulation({ foo: 2 })).toEqual({
      type: 'SET_ACTIONS_WIDGET_POPULATION',
      payload: { population: { foo: 2 } },
    });
  });

  it('creates SET_ACTIONS_WIDGET_HIDDEN_COLUMNS', () => {
    expect(setHiddenColumns(['bar'])).toEqual({
      type: 'SET_ACTIONS_WIDGET_HIDDEN_COLUMNS',
      payload: { hiddenColumns: ['bar'] },
    });
  });

  it('creates SAVE_ACTIONS_WIDGET_LOADING', () => {
    expect(saveActionsWidgetLoading()).toEqual({
      type: 'SAVE_ACTIONS_WIDGET_LOADING',
    });
  });

  it('creates SAVE_ACTIONS_WIDGET_SUCCESS', () => {
    expect(saveActionsWidgetSuccess()).toEqual({
      type: 'SAVE_ACTIONS_WIDGET_SUCCESS',
    });
  });

  it('creates SAVE_ACTIONS_WIDGET_FAILURE', () => {
    expect(saveActionsWidgetFailure()).toEqual({
      type: 'SAVE_ACTIONS_WIDGET_FAILURE',
    });
  });

  it('creates CLOSE_ACTIONS_WIDGET_APP_STATUS', () => {
    expect(closeActionsWidgetAppStatus()).toEqual({
      type: 'CLOSE_ACTIONS_WIDGET_APP_STATUS',
    });
  });
});

describe('actionsWidgetModal thunks', () => {
  const dispatch = jest.fn();
  const getState = jest.fn(() => ({
    staticData: { containerType: 'HomeDashboard' },
    dashboard: { activeDashboard: { id: 42 }, widgets: [] },
    actionsWidgetModal: {
      organisation_annotation_type_ids: [1, 2],
      population: { foo: 1 },
      hidden_columns: ['col'],
    },
  }));

  beforeEach(() => {
    dispatch.mockClear();
    getState.mockClear();
  });

  it('saveActionsWidget dispatches loading and success actions', () => {
    const response = { container_widget: { id: 99 } };
    $.ajax.mockImplementation(() => fakeAjaxSuccess(response));

    const thunk = saveActionsWidget();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(saveActionsWidgetLoading());
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SAVE_ACTIONS_WIDGET_SUCCESS' })
    );
  });

  it('saveActionsWidget dispatches failure on ajax fail', () => {
    $.ajax.mockImplementation(fakeAjaxFailure);

    const thunk = saveActionsWidget();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(saveActionsWidgetLoading());
    expect(dispatch).toHaveBeenCalledWith(saveActionsWidgetFailure());
  });

  it('editActionsWidget dispatches loading and success actions', () => {
    const response = { container_widget: { id: 88 } };
    $.ajax.mockImplementation(() => fakeAjaxSuccess(response));

    const thunk = editActionsWidget(88);
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(saveActionsWidgetLoading());
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SAVE_ACTIONS_WIDGET_SUCCESS' })
    );
  });

  it('editActionsWidget dispatches failure on ajax fail', () => {
    $.ajax.mockImplementation(fakeAjaxFailure);

    const thunk = editActionsWidget(77);
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(saveActionsWidgetLoading());
    expect(dispatch).toHaveBeenCalledWith(saveActionsWidgetFailure());
  });
});
