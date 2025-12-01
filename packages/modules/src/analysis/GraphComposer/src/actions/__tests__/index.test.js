import {
  updateGraphFormType,
  createGraph,
  saveGraph,
  closeDashboardSelectorModal,
  openDashboardSelectorModal,
  selectDashboard,
  closeRenameGraphModal,
  openRenameGraphModal,
  onRenameGraphValueChange,
  confirmRenameGraph,
} from '..';
import { buildSummaryGraphRequest } from '../../utils';

describe('Graph composer Actions', () => {
  it('has the correct action UPDATE_GRAPH_FORM_TYPE', () => {
    const newGraphType = 'line';
    const newGraphGroup = 'longitudinal';

    const expectedAction = {
      type: 'UPDATE_GRAPH_FORM_TYPE',
      payload: {
        graphType: newGraphType,
        graphGroup: newGraphGroup,
      },
    };

    expect(updateGraphFormType(newGraphType, newGraphGroup)).toEqual(
      expectedAction
    );
  });

  describe('when creating a graph', () => {
    let origXhr;
    let xhr;
    let request;

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = jest.fn();
      window.XMLHttpRequest = xhr;
      request = {
        open: jest.fn((method, url) => {
          request.method = method;
          request.url = url;
        }),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
        readyState: 4,
        status: 200,
        onreadystatechange: jest.fn(),
        responseText: JSON.stringify({}),
      };
      xhr.mockImplementation(() => request);
    });

    afterEach(() => {
      window.XMLHttpRequest = origXhr;
    });

    it('makes a request to the right endpoint for a radar graph', () => {
      const getState = jest.fn();
      getState.mockReturnValue({
        GraphFormSummary: {
          population: [
            {
              athletes: 'athlete_123',
              calculation: 'mean',
              timePeriod: 'today',
            },
            {
              athletes: 'position_group_76',
              calculation: 'sum',
              timePeriod: 'this_in_season',
            },
          ],
          metrics: [
            'kitman:stiffness_indication|abdominal',
            'kitman:soreness_indication|strength',
          ],
          comparisonGroupIndex: 1,
        },
        GraphFormType: 'radar',
      });

      const thunk = createGraph();
      thunk(() => {}, getState);
      expect(request.url).toBe('/analysis/graph/builder');
    });

    it('makes a request to the right endpoint for a line graph', () => {
      const getState = jest.fn();
      getState.mockReturnValue({
        GraphFormLongitudinal: {},
        GraphFormType: 'line',
      });

      const thunk = createGraph();
      thunk(() => {}, getState);
      expect(request.url).toBe('/analysis/graph/builder');
    });
  });

  describe('when saving a graph', () => {
    let origXhr;
    let xhr;
    let request;
    const dummyState = {
      GraphData: {
        summary: {},
        longitudinal: {
          aggregationPeriod: 'month',
          decorators: {},
        },
        summaryBar: {},
        summaryStackBar: {},
        summaryDonut: {},
        valueVisualisation: {},
      },
      GraphFormSummary: {
        population: [
          {
            athletes: 'athlete_123',
            calculation: 'mean',
            timePeriod: 'today',
          },
          {
            athletes: 'position_group_76',
            calculation: 'sum',
            timePeriod: 'this_in_season',
          },
        ],
        metrics: [
          'kitman:stiffness_indication|abdominal',
          'kitman:soreness_indication|strength',
        ],
        comparisonGroupIndex: 1,
      },
      GraphForm: {
        metrics: [
          {
            type: 'metric',
            squad_selection: {
              athletes: [10],
              positions: [],
              position_groups: [],
              applies_to_squad: false,
            },
          },
        ],
      },
      GraphFormType: 'line',
      DashboardSelectorModal: {
        selectedDashboard: '2',
      },
      StaticData: {
        containerType: 'AnalyticalDashboard',
      },
    };
    const getState = jest.fn();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = jest.fn();
      window.XMLHttpRequest = xhr;
      request = {
        open: jest.fn((method, url) => {
          request.method = method;
          request.url = url;
        }),
        send: jest.fn((body) => {
          request.requestBody = body;
        }),
        setRequestHeader: jest.fn(),
        readyState: 4,
        status: 200,
        onreadystatechange: jest.fn(),
        responseText: JSON.stringify({}),
      };
      xhr.mockImplementation(() => request);
    });

    afterEach(() => {
      window.XMLHttpRequest = origXhr;
    });

    describe('and when the graph group is summary', () => {
      it('sends the correct data', () => {
        dummyState.GraphFormType = 'radar';
        dummyState.GraphGroup = 'summary';
        getState.mockReturnValue(dummyState);
        const thunk = saveGraph();
        thunk(() => {}, getState);
        const formattedRequest = buildSummaryGraphRequest(
          getState().GraphFormSummary,
          getState().GraphFormType
        );
        expect(request.url).toBe('/analysis/graph?analytical_dashboard_id=2');
        expect(request.method).toBe('POST');
        expect(request.requestBody).toBe(
          JSON.stringify({ configuration: formattedRequest })
        );
      });
    });
  });

  // Action creator tests
  it('has the correct action CLOSE_DASHBOARD_SELECTOR_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_DASHBOARD_SELECTOR_MODAL',
    };

    expect(closeDashboardSelectorModal()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_DASHBOARD_SELECTOR_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_DASHBOARD_SELECTOR_MODAL',
    };

    expect(openDashboardSelectorModal()).toEqual(expectedAction);
  });

  it('has the correct action SELECT_DASHBOARD', () => {
    const expectedAction = {
      type: 'SELECT_DASHBOARD',
      payload: {
        selectedDashboard: '4',
      },
    };

    expect(selectDashboard('4')).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_RENAME_GRAPH_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_RENAME_GRAPH_MODAL',
    };

    expect(closeRenameGraphModal()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_RENAME_GRAPH_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_RENAME_GRAPH_MODAL',
    };

    expect(openRenameGraphModal()).toEqual(expectedAction);
  });

  it('has the correct action ON_RENAME_VALUE_CHANGE', () => {
    const expectedAction = {
      type: 'ON_RENAME_VALUE_CHANGE',
      payload: {
        value: 'new name',
      },
    };

    expect(onRenameGraphValueChange('new name')).toEqual(expectedAction);
  });

  it('has the correct action CONFIRM_RENAME_GRAPH', () => {
    const expectedAction = {
      type: 'CONFIRM_RENAME_GRAPH',
      payload: {
        newGraphName: 'new name',
        graphGroup: 'longitudinal',
      },
    };

    expect(confirmRenameGraph('new name', 'longitudinal')).toEqual(
      expectedAction
    );
  });
});
