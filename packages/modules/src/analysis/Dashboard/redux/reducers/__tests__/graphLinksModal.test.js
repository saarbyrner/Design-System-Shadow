import graphLinksModalReducer from '../graphLinksModal';

describe('analyticalDashboard - graphLinksModal reducer', () => {
  const defaultState = {
    open: false,
    graphId: null,
    graphLinks: [],
    status: null,
  };

  const defaultGraphLink = {
    dashboardId: null,
    metrics: [],
  };

  describe('When none of the metrics are linked to a dashboard', () => {
    it('returns correct state on OPEN_GRAPH_LINKS_MODAL', () => {
      const action = {
        type: 'OPEN_GRAPH_LINKS_MODAL',
        payload: {
          graphData: {
            id: 1,
            metrics: [{}],
          },
        },
      };

      const nextState = graphLinksModalReducer(defaultState, action);
      expect(nextState).toStrictEqual({
        ...defaultState,
        open: true,
        graphId: 1,
        graphLinks: [defaultGraphLink],
      });
    });
  });

  describe('When some metrics are linked to a dashboard', () => {
    it('returns correct state on OPEN_GRAPH_LINKS_MODAL', () => {
      const action = {
        type: 'OPEN_GRAPH_LINKS_MODAL',
        payload: {
          graphData: {
            id: 1,
            metrics: [
              {
                linked_dashboard_id: 3,
              },
              {
                linked_dashboard_id: 3,
              },
              { linked_dashboard_id: null },
              {
                linked_dashboard_id: 2,
              },
            ],
          },
        },
      };

      const nextState = graphLinksModalReducer(defaultState, action);
      expect(nextState).toStrictEqual({
        ...defaultState,
        open: true,
        graphId: 1,
        graphLinks: [
          {
            dashboardId: 3,
            metrics: ['0', '1'],
          },
          {
            dashboardId: 2,
            metrics: ['3'],
          },
        ],
      });
    });
  });

  it('returns correct state on CLOSE_GRAPH_LINKS_MODAL', () => {
    const initialState = {
      graphId: '2',
      open: true,
      graphLinks: [{}],
      status: 'loading',
    };

    const action = {
      type: 'CLOSE_GRAPH_LINKS_MODAL',
    };

    const nextState = graphLinksModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      open: false,
    });
  });

  it('returns correct state on ADD_GRAPH_LINK_ROW', () => {
    const initialState = {
      ...defaultState,
      graphLinks: [defaultGraphLink],
    };

    const action = {
      type: 'ADD_GRAPH_LINK_ROW',
    };

    const nextState = graphLinksModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      graphLinks: [defaultGraphLink, defaultGraphLink],
    });
  });

  it('returns correct state on REMOVE_GRAPH_LINK_ROW', () => {
    const initialState = {
      ...defaultState,
      graphLinks: [
        {
          index: 0,
        },
        {
          index: 1,
        },
      ],
    };

    const action = {
      type: 'REMOVE_GRAPH_LINK_ROW',
      payload: {
        rowIndex: 1,
      },
    };

    const nextState = graphLinksModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      graphLinks: [{ index: 0 }],
    });
  });

  it('returns correct state on RESET_GRAPH_LINKS', () => {
    const initialState = {
      ...defaultState,
      graphLinks: [
        {
          dashboardId: '3',
          metrics: ['1', '2'],
        },
      ],
    };

    const action = {
      type: 'RESET_GRAPH_LINKS',
    };

    const nextState = graphLinksModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      graphLinks: [defaultGraphLink],
    });
  });

  it('returns correct state on SELECT_GRAPH_LINK_TARGET', () => {
    const initialState = {
      ...defaultState,
      graphLinks: [
        {
          index: 0,
          dashboardId: null,
        },
        {
          index: 1,
          dashboardId: null,
        },
      ],
    };

    const action = {
      type: 'SELECT_GRAPH_LINK_TARGET',
      payload: {
        rowIndex: 1,
        dashboardId: '4',
      },
    };

    const nextState = graphLinksModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      graphLinks: [
        {
          index: 0,
          dashboardId: null,
        },
        {
          index: 1,
          dashboardId: '4',
        },
      ],
    });
  });

  it('returns correct state on SELECT_GRAPH_LINK_ORIGIN', () => {
    const initialState = {
      ...defaultState,
      graphLinks: [
        {
          index: 0,
          dashboardId: null,
          metrics: [],
        },
        {
          index: 1,
          dashboardId: null,
          metrics: [],
        },
      ],
    };

    const action = {
      type: 'SELECT_GRAPH_LINK_ORIGIN',
      payload: {
        rowIndex: 1,
        metricIndex: '2',
      },
    };

    const nextState = graphLinksModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      graphLinks: [
        {
          index: 0,
          dashboardId: null,
          metrics: [],
        },
        {
          index: 1,
          dashboardId: null,
          metrics: ['2'],
        },
      ],
    });
  });

  it('returns correct state on UNSELECT_GRAPH_LINK_ORIGIN', () => {
    const initialState = {
      ...defaultState,
      graphLinks: [
        {
          index: 0,
          dashboardId: null,
          metrics: [],
        },
        {
          index: 1,
          dashboardId: null,
          metrics: ['2'],
        },
      ],
    };

    const action = {
      type: 'UNSELECT_GRAPH_LINK_ORIGIN',
      payload: {
        rowIndex: 1,
        metricIndex: '2',
      },
    };

    const nextState = graphLinksModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      graphLinks: [
        {
          index: 0,
          dashboardId: null,
          metrics: [],
        },
        {
          index: 1,
          dashboardId: null,
          metrics: [],
        },
      ],
    });
  });

  it('returns correct state on CREATE_GRAPH_LINKS_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'CREATE_GRAPH_LINKS_LOADING',
    };

    const nextState = graphLinksModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns correct state on CREATE_GRAPH_LINKS_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
    };

    const action = {
      type: 'CREATE_GRAPH_LINKS_FAILURE',
    };

    const nextState = graphLinksModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns correct state on CLOSE_GRAPH_LINKS_APP_STATUS', () => {
    const initialState = {
      ...defaultState,
      status: 'error',
    };

    const action = {
      type: 'CLOSE_GRAPH_LINKS_APP_STATUS',
    };

    const nextState = graphLinksModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
    });
  });
});
