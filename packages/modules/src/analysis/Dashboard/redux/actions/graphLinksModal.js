// @flow
import $ from 'jquery';
import type { Action, ThunkAction } from '../types/actions';
import type { Store } from '../types/store';
import type { GraphData } from '../../types';

type StoreGraphLinksModal = $PropertyType<Store, 'graphLinksModal'>;
type GraphLinks = $PropertyType<StoreGraphLinksModal, 'graphLinks'>;

export const openGraphLinksModal = (graphData: GraphData): Action => ({
  type: 'OPEN_GRAPH_LINKS_MODAL',
  payload: {
    graphData,
  },
});

export const closeGraphLinksModal = (): Action => ({
  type: 'CLOSE_GRAPH_LINKS_MODAL',
});

export const addGraphLinkRow = (): Action => ({
  type: 'ADD_GRAPH_LINK_ROW',
});

export const removeGraphLinkRow = (rowIndex: number): Action => ({
  type: 'REMOVE_GRAPH_LINK_ROW',
  payload: {
    rowIndex,
  },
});

export const resetGraphLinks = (): Action => ({
  type: 'RESET_GRAPH_LINKS',
});

export const selectGraphLinkOrigin = (
  rowIndex: number,
  metricIndex: string
): Action => ({
  type: 'SELECT_GRAPH_LINK_ORIGIN',
  payload: {
    rowIndex,
    metricIndex,
  },
});

export const unselectGraphLinkOrigin = (
  rowIndex: number,
  metricIndex: string
): Action => ({
  type: 'UNSELECT_GRAPH_LINK_ORIGIN',
  payload: {
    rowIndex,
    metricIndex,
  },
});
export const selectGraphLinkTarget = (
  rowIndex: number,
  dashboardId: string
): Action => ({
  type: 'SELECT_GRAPH_LINK_TARGET',
  payload: {
    rowIndex,
    dashboardId,
  },
});

export const closeGraphLinksAppStatus = (): Action => ({
  type: 'CLOSE_GRAPH_LINKS_APP_STATUS',
});

export const createGraphLinksLoading = (): Action => ({
  type: 'CREATE_GRAPH_LINKS_LOADING',
});

export const createGraphLinksSuccess = (
  graphId: string,
  graphLinks: GraphLinks
): Action => ({
  type: 'CREATE_GRAPH_LINKS_SUCCESS',
  payload: {
    graphId,
    graphLinks,
  },
});

export const createGraphLinksFailure = (): Action => ({
  type: 'CREATE_GRAPH_LINKS_FAILURE',
});

export const saveGraphLinks =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    // Remove empty selections from the graph links
    const graphLinksFiltered = getState().graphLinksModal.graphLinks.filter(
      (graphLink) => graphLink.metrics.length > 0 && graphLink.dashboardId
    );

    const graphLinksRequestData = {
      graph_links: graphLinksFiltered.map((graphLink) => ({
        metric_indexes: graphLink.metrics,
        dashboard_id: graphLink.dashboardId,
      })),
    };

    dispatch(createGraphLinksLoading());

    $.ajax({
      method: 'POST',
      url: `/analysis/graph/${
        getState().graphLinksModal.graphId
      }/link_dashboard`,
      contentType: 'application/json',
      data: JSON.stringify(graphLinksRequestData),
    })
      .done(() => {
        dispatch(
          createGraphLinksSuccess(
            getState().graphLinksModal.graphId,
            graphLinksFiltered
          )
        );
        dispatch(closeGraphLinksModal());
      })
      .fail(() => {
        dispatch(createGraphLinksFailure());
      });
  };
