/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';

const getDefaultGraphLink = () =>
  _cloneDeep({
    dashboardId: null,
    metrics: [],
  });

export default function (state = {}, action) {
  switch (action.type) {
    case 'OPEN_GRAPH_LINKS_MODAL': {
      const graphLinks = [];

      action.payload.graphData.metrics.forEach((metric, metricIndex) => {
        if (metric.linked_dashboard_id) {
          const graphLinkIndex = _findIndex(
            graphLinks,
            (graphLink) => graphLink.dashboardId === metric.linked_dashboard_id
          );

          if (graphLinkIndex === -1) {
            graphLinks.push({
              dashboardId: metric.linked_dashboard_id,
              metrics: [metricIndex.toString()],
            });
          } else {
            graphLinks[graphLinkIndex].metrics.push(metricIndex.toString());
          }
        }
      });

      if (graphLinks.length === 0) {
        graphLinks.push(getDefaultGraphLink());
      }

      return {
        ...state,
        open: true,
        graphId: action.payload.graphData.id,
        graphLinks,
      };
    }
    case 'CLOSE_GRAPH_LINKS_MODAL': {
      return {
        graphId: null,
        open: false,
        graphLinks: [],
        status: null,
      };
    }
    case 'ADD_GRAPH_LINK_ROW': {
      return {
        ...state,
        graphLinks: [...state.graphLinks, getDefaultGraphLink()],
      };
    }
    case 'REMOVE_GRAPH_LINK_ROW': {
      return {
        ...state,
        graphLinks: state.graphLinks.filter(
          (item, index) => index !== action.payload.rowIndex
        ),
      };
    }
    case 'RESET_GRAPH_LINKS': {
      return {
        ...state,
        graphLinks: [getDefaultGraphLink()],
      };
    }
    case 'SELECT_GRAPH_LINK_TARGET': {
      const graphLinksCopy = [...state.graphLinks];
      graphLinksCopy[action.payload.rowIndex].dashboardId =
        action.payload.dashboardId;

      return {
        ...state,
        graphLinks: graphLinksCopy,
      };
    }
    case 'SELECT_GRAPH_LINK_ORIGIN': {
      const selectedMetrics = state.graphLinks[action.payload.rowIndex].metrics;

      const graphLinksCopy = [...state.graphLinks];
      if (selectedMetrics.indexOf(action.payload.metricIndex) === -1) {
        graphLinksCopy[action.payload.rowIndex].metrics.push(
          action.payload.metricIndex
        );
      }

      return {
        ...state,
        graphLinks: graphLinksCopy,
      };
    }
    case 'UNSELECT_GRAPH_LINK_ORIGIN': {
      const selectedMetrics = state.graphLinks[action.payload.rowIndex].metrics;

      const graphLinksCopy = [...state.graphLinks];
      graphLinksCopy[action.payload.rowIndex].metrics = selectedMetrics.filter(
        (metricIndex) => metricIndex !== action.payload.metricIndex
      );

      return {
        ...state,
        graphLinks: graphLinksCopy,
      };
    }
    case 'CREATE_GRAPH_LINKS_LOADING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'CREATE_GRAPH_LINKS_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'CLOSE_GRAPH_LINKS_APP_STATUS': {
      return {
        ...state,
        status: null,
      };
    }
    default:
      return state;
  }
}
