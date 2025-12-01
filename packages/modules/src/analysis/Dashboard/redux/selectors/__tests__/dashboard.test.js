import { getDashboard, getWidgets, getWidgetById } from '../dashboard';

describe('analyticalDashboard - dashboard selectors', () => {
  const state = {
    dashboard: {
      activeDashboard: {},
      appStatusText: '',
      status: null,
      widgets: [],
      toast: [],
    },
  };

  describe('getDashboard() selector', () => {
    it('returns dashboard state', () => {
      const selectedState = getDashboard(state);

      expect(selectedState).toStrictEqual(state.dashboard);
    });
  });

  describe('getWidgets() selector', () => {
    it('returns widget list', () => {
      const widgets = [
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
        {
          cols: 6,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 0,
          id: 10,
          widget: {},
          widget_render: {},
          widget_type: 'table',
        },
      ];
      const stateWithWidgets = {
        dashboard: {
          ...state.dashboard,
          widgets,
        },
      };
      const selectedWidgets = getWidgets(stateWithWidgets);

      expect(selectedWidgets).toStrictEqual(widgets);
    });
  });

  describe('getWidgetById() selector', () => {
    it('selects a widget from list with given id', () => {
      const widgets = [
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
        {
          cols: 6,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 0,
          id: 10,
          widget: {},
          widget_render: {},
          widget_type: 'table',
        },
      ];
      const stateWithWidgets = {
        dashboard: {
          ...state.dashboard,
          widgets,
        },
      };
      const selectedWidget = getWidgetById(stateWithWidgets, 10);

      expect(selectedWidget).toStrictEqual(widgets[1]);
    });
  });
});
