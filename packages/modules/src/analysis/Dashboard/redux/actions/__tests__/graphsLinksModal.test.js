import $ from 'jquery';
import {
  fakeAjaxSuccess,
  fakeAjaxFailure,
} from '@kitman/modules/src/analysis/Dashboard/utils/ajaxMocks';
import {
  openGraphLinksModal,
  closeGraphLinksModal,
  addGraphLinkRow,
  removeGraphLinkRow,
  resetGraphLinks,
  selectGraphLinkOrigin,
  unselectGraphLinkOrigin,
  selectGraphLinkTarget,
  closeGraphLinksAppStatus,
  createGraphLinksLoading,
  createGraphLinksSuccess,
  createGraphLinksFailure,
  saveGraphLinks,
} from '../graphLinksModal';

describe('graphLinksModal actions', () => {
  describe('action creators', () => {
    it('openGraphLinksModal returns correct action', () => {
      const graphData = { id: 'g1', name: 'Test graph' };
      expect(openGraphLinksModal(graphData)).toEqual({
        type: 'OPEN_GRAPH_LINKS_MODAL',
        payload: { graphData },
      });
    });

    it('closeGraphLinksModal returns correct action', () => {
      expect(closeGraphLinksModal()).toEqual({
        type: 'CLOSE_GRAPH_LINKS_MODAL',
      });
    });

    it('addGraphLinkRow returns correct action', () => {
      expect(addGraphLinkRow()).toEqual({ type: 'ADD_GRAPH_LINK_ROW' });
    });

    it('removeGraphLinkRow returns correct action', () => {
      expect(removeGraphLinkRow(3)).toEqual({
        type: 'REMOVE_GRAPH_LINK_ROW',
        payload: { rowIndex: 3 },
      });
    });

    it('resetGraphLinks returns correct action', () => {
      expect(resetGraphLinks()).toEqual({ type: 'RESET_GRAPH_LINKS' });
    });

    it('selectGraphLinkOrigin returns correct action', () => {
      expect(selectGraphLinkOrigin(2, 'metric1')).toEqual({
        type: 'SELECT_GRAPH_LINK_ORIGIN',
        payload: { rowIndex: 2, metricIndex: 'metric1' },
      });
    });

    it('unselectGraphLinkOrigin returns correct action', () => {
      expect(unselectGraphLinkOrigin(4, 'metricX')).toEqual({
        type: 'UNSELECT_GRAPH_LINK_ORIGIN',
        payload: { rowIndex: 4, metricIndex: 'metricX' },
      });
    });

    it('selectGraphLinkTarget returns correct action', () => {
      expect(selectGraphLinkTarget(1, 'dashboard42')).toEqual({
        type: 'SELECT_GRAPH_LINK_TARGET',
        payload: { rowIndex: 1, dashboardId: 'dashboard42' },
      });
    });

    it('closeGraphLinksAppStatus returns correct action', () => {
      expect(closeGraphLinksAppStatus()).toEqual({
        type: 'CLOSE_GRAPH_LINKS_APP_STATUS',
      });
    });

    it('createGraphLinksLoading returns correct action', () => {
      expect(createGraphLinksLoading()).toEqual({
        type: 'CREATE_GRAPH_LINKS_LOADING',
      });
    });

    it('createGraphLinksSuccess returns correct action', () => {
      const graphId = 'g1';
      const graphLinks = [{ metrics: ['m1'], dashboardId: 'd1' }];
      expect(createGraphLinksSuccess(graphId, graphLinks)).toEqual({
        type: 'CREATE_GRAPH_LINKS_SUCCESS',
        payload: { graphId, graphLinks },
      });
    });

    it('createGraphLinksFailure returns correct action', () => {
      expect(createGraphLinksFailure()).toEqual({
        type: 'CREATE_GRAPH_LINKS_FAILURE',
      });
    });
  });

  describe('saveGraphLinks thunk', () => {
    let dispatch;
    let getState;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn(() => ({
        graphLinksModal: {
          graphId: 'graph123',
          graphLinks: [
            { metrics: ['m1', 'm2'], dashboardId: 'dash1' },
            { metrics: [], dashboardId: 'dash2' }, // should be filtered out
            { metrics: ['m3'], dashboardId: '' }, // filtered out
            { metrics: ['m4'], dashboardId: 'dash4' },
          ],
        },
      }));
    });

    it('dispatches loading and success and closes modal on successful ajax', () => {
      const filteredGraphLinks = [
        { metrics: ['m1', 'm2'], dashboardId: 'dash1' },
        { metrics: ['m4'], dashboardId: 'dash4' },
      ];

      // Podmieniamy $.ajax na nasz fakeAjaxSuccess:
      $.ajax = jest.fn(() => fakeAjaxSuccess());

      saveGraphLinks()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'CREATE_GRAPH_LINKS_LOADING',
      });

      expect($.ajax).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/analysis/graph/graph123/link_dashboard',
          contentType: 'application/json',
          data: JSON.stringify({
            graph_links: filteredGraphLinks.map((link) => ({
              metric_indexes: link.metrics,
              dashboard_id: link.dashboardId,
            })),
          }),
        })
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'CREATE_GRAPH_LINKS_SUCCESS',
        payload: {
          graphId: 'graph123',
          graphLinks: filteredGraphLinks,
        },
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'CLOSE_GRAPH_LINKS_MODAL',
      });
    });

    it('dispatches failure on ajax failure', () => {
      $.ajax = jest.fn(() => fakeAjaxFailure());

      saveGraphLinks()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'CREATE_GRAPH_LINKS_LOADING',
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: 'CREATE_GRAPH_LINKS_FAILURE',
      });
    });
  });
});
