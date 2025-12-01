import $ from 'jquery';
import {
  fakeAjaxSuccess,
  fakeAjaxFailure,
} from '@kitman/modules/src/analysis/Dashboard/utils/ajaxMocks';
import {
  saveDuplicateWidget,
  duplicateWidgetLoading,
  duplicateWidgetSuccess,
  duplicateWidgetFailure,
  closeDuplicateWidgetAppStatus,
} from '../duplicateWidgetModal';
import * as widgetsActions from '../widgets';

import { getDashboardLayout } from '../dashboard';

jest.useFakeTimers();
jest
  .spyOn(widgetsActions, 'fetchWidgetContent')
  .mockImplementation((id, type) => {
    return { type: 'MOCK_FETCH_WIDGET_CONTENT', payload: { id, type } };
  });

describe('saveDuplicateWidget thunk', () => {
  let dispatch;
  let getState;

  const containerWidgetMock = {
    id: 999,
    widget_render: {},
  };

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      dashboard: {
        activeDashboard: { id: 123 },
        widgets: [],
      },
      duplicateWidgetModal: {
        widgetId: 456,
        widgetName: 'Duplicated Widget',
        selectedDashboard: { id: 123 },
        selectedSquad: { id: 789 },
        widgetType: 'reporting',
      },
      staticData: {
        containerType: 'HomeDashboard',
      },
    }));

    // @ts-ignore
    $.ajax = jest.fn();
    // @ts-ignore
    $('meta[name="csrf-token"]').attr = () => 'mock-csrf-token';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches success and updates dashboard when targetDashboardId === activeDashboardId', () => {
    const response = {
      container_widget: containerWidgetMock,
    };

    $.ajax.mockImplementation(() => fakeAjaxSuccess(response));

    saveDuplicateWidget()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(duplicateWidgetLoading());
    expect(dispatch).toHaveBeenCalledWith(duplicateWidgetSuccess());
    expect(dispatch).toHaveBeenCalledWith(
      widgetsActions.updateExistingWidgetYPosition(containerWidgetMock)
    );
    expect(dispatch).toHaveBeenCalledWith(
      widgetsActions.saveWidgetSuccess(containerWidgetMock)
    );
    expect(dispatch).toHaveBeenCalledWith(getDashboardLayout([]));
    expect(dispatch).not.toHaveBeenCalledWith(
      widgetsActions.fetchWidgetContent()
    );

    jest.advanceTimersByTime(1000);
    expect(dispatch).toHaveBeenCalledWith(closeDuplicateWidgetAppStatus());
  });

  it('dispatches fetchWidgetContent if __async__ is true', () => {
    const response = {
      container_widget: {
        ...containerWidgetMock,
        widget_render: {
          __async__: true,
        },
      },
    };

    $.ajax.mockImplementation(() => fakeAjaxSuccess(response));

    saveDuplicateWidget()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(duplicateWidgetSuccess());
    expect(dispatch).toHaveBeenCalledWith(
      widgetsActions.fetchWidgetContent(999, 'reporting')
    );
  });

  it('dispatches failure on ajax error', () => {
    $.ajax.mockImplementation(() => fakeAjaxFailure());

    saveDuplicateWidget()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(duplicateWidgetLoading());
    expect(dispatch).toHaveBeenCalledWith(duplicateWidgetFailure());
  });
});
