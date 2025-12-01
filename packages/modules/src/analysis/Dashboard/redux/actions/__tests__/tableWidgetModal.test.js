import $ from 'jquery';
import {
  openTableWidgetModal,
  closeTableWidgetModal,
  addTableWidgetLoading,
  addTableWidgetSuccess,
  addTableWidgetFailure,
  addTableWidget,
} from '../tableWidgetModal';

jest.mock('jquery', () => {
  const mockjQuery = jest.fn(() => ({
    attr: jest.fn(() => 'mock-csrf-token'),
  }));
  mockjQuery.ajax = jest.fn(() => ({
    done: jest.fn(() => ({
      fail: jest.fn(),
    })),
    fail: jest.fn(),
  }));
  return mockjQuery;
});

describe('Table Widget Modal Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('has the correct action OPEN_TABLE_WIDGET_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_TABLE_WIDGET_MODAL',
    };

    expect(openTableWidgetModal()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_TABLE_WIDGET_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_TABLE_WIDGET_MODAL',
    };

    expect(closeTableWidgetModal()).toEqual(expectedAction);
  });

  it('has the correct action ADD_TABLE_WIDGET_LOADING', () => {
    const expectedAction = {
      type: 'ADD_TABLE_WIDGET_LOADING',
    };

    expect(addTableWidgetLoading()).toEqual(expectedAction);
  });

  it('has the correct action ADD_TABLE_WIDGET_SUCCESS', () => {
    const expectedAction = {
      type: 'ADD_TABLE_WIDGET_SUCCESS',
    };

    expect(addTableWidgetSuccess()).toEqual(expectedAction);
  });

  it('has the correct action ADD_TABLE_WIDGET_FAILURE', () => {
    const expectedAction = {
      type: 'ADD_TABLE_WIDGET_FAILURE',
    };

    expect(addTableWidgetFailure()).toEqual(expectedAction);
  });

  describe('when adding a table widget', () => {
    beforeEach(() => {
      $.ajax.mockReturnValue({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis(),
      });
    });

    it('sends the correct data', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 999,
            name: 'Testing Dashboard',
          },
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = addTableWidget('COMPARISON');
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'ADD_TABLE_WIDGET_LOADING',
      });

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets',
        method: 'POST',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 999,
          widget: {
            type: 'table',
            config: {
              table_type: 'COMPARISON',
            },
          },
        }),
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
      });
    });
  });

  describe('when add a table widget fails', () => {
    beforeEach(() => {
      $.ajax.mockReturnValue({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn((callback) => {
          callback();
          return { fail: jest.fn() };
        }),
      });
    });

    it('dispatches the correct action', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {},
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = addTableWidget();
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'ADD_TABLE_WIDGET_LOADING',
      });
      expect(dispatcher).toHaveBeenCalledWith({
        type: 'ADD_TABLE_WIDGET_FAILURE',
      });
    });
  });
});
