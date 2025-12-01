import $ from 'jquery';
import {
  saveWidgetSuccess,
  editWidgetSuccess,
  deleteWidgetSuccess,
  updateExistingWidgetYPosition,
  fetchWidgetsSuccess,
  fetchWidgetsFailure,
  fetchWidgetsLoading,
  fetchWidgetContentSuccess,
  fetchWidgetContentForbidden,
  fetchWidgetContentFailure,
  fetchWidgetContentLoading,
  fetchWidgets,
  fetchWidgetContent,
  deleteWidget,
} from '../widgets';

jest.mock('jquery', () => {
  const mockJQuery = jest.fn(() => ({
    attr: jest.fn(() => 'test-csrf-token'),
  }));
  mockJQuery.ajax = jest.fn();
  mockJQuery.param = jest.fn();
  return {
    __esModule: true,
    default: mockJQuery,
  };
});

describe('Widgets Actions', () => {
  let mockDispatcher;
  let mockGetState;

  beforeEach(() => {
    mockDispatcher = jest.fn();
    mockGetState = jest.fn();
    jest.clearAllMocks();
  });

  it('has the correct action SAVE_WIDGET_SUCCESS', () => {
    const expectedAction = {
      type: 'SAVE_WIDGET_SUCCESS',
      payload: {
        widget: {
          type: 'header',
        },
      },
    };

    expect(
      saveWidgetSuccess({
        type: 'header',
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_WIDGET_SUCCESS', () => {
    const expectedAction = {
      type: 'EDIT_WIDGET_SUCCESS',
      payload: {
        widget: {
          type: 'header',
        },
      },
    };

    expect(
      editWidgetSuccess({
        type: 'header',
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action DELETE_WIDGET_SUCCESS', () => {
    const expectedAction = {
      type: 'DELETE_WIDGET_SUCCESS',
      payload: {
        widgetId: 4,
      },
    };

    expect(deleteWidgetSuccess(4)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_EXISTING_WIDGET_Y_POSITION', () => {
    const expectedAction = {
      type: 'UPDATE_EXISTING_WIDGET_Y_POSITION',
      payload: {
        widget: {
          id: 3,
          type: 'header',
        },
      },
    };

    expect(
      updateExistingWidgetYPosition({
        id: 3,
        type: 'header',
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action FETCH_WIDGETS_SUCCESS', () => {
    const expectedAction = {
      type: 'FETCH_WIDGETS_SUCCESS',
      payload: {
        widgets: [
          {
            cols: 6,
            rows: 2,
            horizontal_position: 0,
            vertical_position: 0,
            id: 9,
            widget: {},
            widget_render: {},
            widget_type: 'header',
          },
        ],
      },
    };

    expect(
      fetchWidgetsSuccess([
        {
          cols: 6,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 0,
          id: 9,
          widget: {},
          widget_render: {},
          widget_type: 'header',
        },
      ])
    ).toEqual(expectedAction);
  });

  it('has the correct action FETCH_WIDGETS_FAILURE', () => {
    const expectedAction = {
      type: 'FETCH_WIDGETS_FAILURE',
    };

    expect(fetchWidgetsFailure()).toEqual(expectedAction);
  });

  it('has the correct action FETCH_WIDGETS_LOADING', () => {
    const expectedAction = {
      type: 'FETCH_WIDGETS_LOADING',
    };

    expect(fetchWidgetsLoading()).toEqual(expectedAction);
  });

  it('has the correct action FETCH_WIDGET_CONTENT_SUCCESS', () => {
    const expectedAction = {
      type: 'FETCH_WIDGET_CONTENT_SUCCESS',
      payload: {
        widgetId: 110,
        widgetContent: {
          graphGroup: 'longitudinal',
          graphType: 'line',
          id: 4030,
        },
      },
    };

    expect(
      fetchWidgetContentSuccess(110, {
        graphGroup: 'longitudinal',
        graphType: 'line',
        id: 4030,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action FETCH_WIDGET_CONTENT_FORBIDDEN', () => {
    const expectedAction = {
      type: 'FETCH_WIDGET_CONTENT_FORBIDDEN',
      payload: {
        widgetId: 113,
      },
    };

    expect(fetchWidgetContentForbidden(113)).toEqual(expectedAction);
  });

  it('has the correct action FETCH_WIDGET_CONTENT_FAILURE', () => {
    const expectedAction = {
      type: 'FETCH_WIDGET_CONTENT_FAILURE',
      payload: {
        widgetId: 109,
        errorMessage: 'Error message',
      },
    };

    expect(fetchWidgetContentFailure(109, 'Error message')).toEqual(
      expectedAction
    );
  });

  it('has the correct action FETCH_WIDGET_CONTENT_LOADING', () => {
    const expectedAction = {
      type: 'FETCH_WIDGET_CONTENT_LOADING',
      payload: {
        widgetId: 108,
      },
    };

    expect(fetchWidgetContentLoading(108)).toEqual(expectedAction);
  });

  describe('when fetching widgets', () => {
    beforeEach(() => {
      $.ajax.mockImplementation(() => ({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis(),
      }));
    });

    it('builds the correct request when pivot data is on', () => {
      mockGetState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 1,
          },
          appliedSquadAthletes: {
            all_squads: false,
            applies_to_squad: true,
            athletes: [],
            position_groups: [],
            positions: [],
            squads: [],
          },
          appliedTimePeriod: 'today',
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = fetchWidgets();
      thunk(mockDispatcher, mockGetState);

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets/container_widgets',
        method: 'POST',
        headers: {
          'X-CSRF-Token': 'test-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 1,
          pivot: {
            population: {
              all_squads: false,
              applies_to_squad: true,
              athletes: [],
              position_groups: [],
              positions: [],
              squads: [],
            },
            time_period: 'today',
          },
        }),
      });
    });
  });

  describe('when fetching widgets and the request fails', () => {
    beforeEach(() => {
      $.ajax.mockImplementation(() => ({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn((callback) => {
          callback({ statusText: 'INTERNAL_SERVER_ERROR' });
          return this;
        }),
      }));
    });

    it('dispatches the correct action when the request fails', () => {
      mockGetState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 1,
          },
          appliedSquadAthletes: {
            all_squads: false,
            applies_to_squad: true,
            athletes: [],
            position_groups: [],
            positions: [],
            squads: [],
          },
          appliedTimePeriod: 'today',
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = fetchWidgets();
      thunk(mockDispatcher, mockGetState);

      expect(mockDispatcher).toHaveBeenCalledWith({
        type: 'FETCH_WIDGETS_LOADING',
      });
      expect(mockDispatcher).toHaveBeenCalledWith({
        type: 'FETCH_WIDGETS_FAILURE',
      });
    });
  });

  describe('when fetching widget content', () => {
    beforeEach(() => {
      $.ajax.mockImplementation(() => ({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis(),
      }));
    });

    it('builds the correct request', () => {
      mockGetState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 1,
          },
          appliedSquadAthletes: {
            all_squads: false,
            applies_to_squad: false,
            athletes: [],
            position_groups: [],
            positions: [],
            squads: [],
          },
          appliedTimePeriod: '',
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = fetchWidgetContent(999);
      thunk(mockDispatcher, mockGetState);

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets/widget_render',
        method: 'POST',
        headers: {
          'X-CSRF-Token': 'test-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 1,
          container_widget_id: 999,
          pivot: {},
        }),
      });
    });

    it('builds the correct request when fetching archived notes', () => {
      mockGetState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 1,
          },
          appliedSquadAthletes: {
            all_squads: false,
            applies_to_squad: false,
            athletes: [],
            position_groups: [],
            positions: [],
            squads: [],
          },
          appliedTimePeriod: '',
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = fetchWidgetContent(999, 'annotation', { archived: true });
      thunk(mockDispatcher, mockGetState);

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets/widget_render',
        method: 'POST',
        headers: {
          'X-CSRF-Token': 'test-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 1,
          container_widget_id: 999,
          pivot: {},
          options: {
            archived: true,
          },
        }),
      });
    });
  });

  describe('when fetching widget content and pivoting', () => {
    beforeEach(() => {
      $.ajax.mockImplementation(() => ({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis(),
      }));
    });

    it('builds the correct request when pivoting by squadAthletes and timePeriod', () => {
      mockGetState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 1,
          },
          appliedSquadAthletes: {
            all_squads: false,
            applies_to_squad: true,
            athletes: [],
            position_groups: [],
            positions: [],
            squads: [],
          },
          appliedTimePeriod: 'today',
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = fetchWidgetContent(999, 'graph');
      thunk(mockDispatcher, mockGetState);

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets/widget_render',
        method: 'POST',
        headers: {
          'X-CSRF-Token': 'test-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 1,
          container_widget_id: 999,
          pivot: {
            population: {
              all_squads: false,
              applies_to_squad: true,
              athletes: [],
              position_groups: [],
              positions: [],
              squads: [],
            },
            time_period: 'today',
          },
        }),
      });
    });

    it('builds the correct request when pivoting a custom date range', () => {
      mockGetState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 1,
          },
          appliedSquadAthletes: {
            all_squads: false,
            applies_to_squad: true,
            athletes: [],
            position_groups: [],
            positions: [],
            squads: [],
          },
          appliedTimePeriod: 'custom_date_range',
          appliedDateRange: {
            start_date: '2019-01-01T00:00:00Z',
            end_date: '2019-10-01T23:59:59+01:00',
          },
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = fetchWidgetContent(999, 'graph');
      thunk(mockDispatcher, mockGetState);

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets/widget_render',
        method: 'POST',
        headers: {
          'X-CSRF-Token': 'test-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 1,
          container_widget_id: 999,
          pivot: {
            population: {
              all_squads: false,
              applies_to_squad: true,
              athletes: [],
              position_groups: [],
              positions: [],
              squads: [],
            },
            time_period: 'custom_date_range',
            date_range: {
              start_date: '2019-01-01T00:00:00Z',
              end_date: '2019-10-01T23:59:59+01:00',
            },
          },
        }),
      });
    });

    it('builds the correct request when pivoting a rolling date', () => {
      mockGetState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 1,
          },
          appliedSquadAthletes: {
            all_squads: false,
            applies_to_squad: true,
            athletes: [],
            position_groups: [],
            positions: [],
            squads: [],
          },
          appliedTimePeriod: 'last_x_days',
          appliedTimePeriodLength: '300',
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = fetchWidgetContent(999, 'graph');
      thunk(mockDispatcher, mockGetState);

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets/widget_render',
        method: 'POST',
        headers: {
          'X-CSRF-Token': 'test-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 1,
          container_widget_id: 999,
          pivot: {
            population: {
              all_squads: false,
              applies_to_squad: true,
              athletes: [],
              position_groups: [],
              positions: [],
              squads: [],
            },
            time_period: 'last_x_days',
            time_period_length: '300',
          },
        }),
      });
    });
  });

  describe('when fetching widget content and the request fails', () => {
    beforeEach(() => {
      $.ajax.mockImplementation(() => ({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn((callback) => {
          callback({ statusText: 'INTERNAL_SERVER_ERROR' });
          return this;
        }),
      }));
    });

    it('dispatches the correct action when the request fails', () => {
      mockGetState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 100,
          },
          appliedSquadAthletes: {
            all_squads: false,
            applies_to_squad: true,
            athletes: [],
            position_groups: [],
            positions: [],
            squads: [],
          },
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = fetchWidgetContent(901);
      thunk(mockDispatcher, mockGetState);

      expect(mockDispatcher).toHaveBeenCalledWith({
        type: 'FETCH_WIDGET_CONTENT_LOADING',
        payload: { widgetId: 901 },
      });
      expect(mockDispatcher).toHaveBeenCalledWith({
        type: 'FETCH_WIDGET_CONTENT_FAILURE',
        payload: { widgetId: 901, errorMessage: null },
      });
    });
  });

  describe('when deleting a widget', () => {
    beforeEach(() => {
      $.ajax.mockImplementation(() => ({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis(),
      }));
    });

    it('builds the correct request', () => {
      mockGetState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 1,
          },
          widgets: [{ id: 99 }],
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = deleteWidget(mockGetState().dashboard.widgets[0].id);
      thunk(mockDispatcher, mockGetState);

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets/99',
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': 'test-csrf-token',
        },
        data: {
          container_type: 'AnalyticalDashboard',
          container_id: 1,
        },
      });
      expect($.param).not.toHaveBeenCalled();
    });
  });
});
