import $ from 'jquery';
import { fetchGraphData, fetchGraphDataSuccess } from '../actions';
import graphDummyData from '../../resources/graphDummyData';

describe('Contributing Factors Actions', () => {
  it('creates the correct action for FETCH_GRAPH_DATA_SUCCESS', () => {
    const responseData = {};
    const expectedAction = {
      type: 'FETCH_GRAPH_DATA_SUCCESS',
      payload: {
        graphData: responseData,
      },
    };

    expect(fetchGraphDataSuccess(responseData)).toEqual(expectedAction);
  });

  describe('when fetching graph data', () => {
    let ajaxSpy;
    const mockDispatch = jest.fn();

    beforeEach(() => {
      jest.useFakeTimers();
      mockDispatch.mockClear();
      window.featureFlags = {}; // Reset feature flags

      const mockJqXHR = {
        done: jest.fn().mockImplementation(function (callback) {
          callback({ graphData: graphDummyData });
          return this;
        }),
        fail: jest.fn().mockReturnThis(),
      };
      ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);
    });

    afterEach(() => {
      jest.useRealTimers();
      ajaxSpy.mockRestore();
    });

    it('sends correct data and dispatches success actions when feature flag is off', () => {
      const thunk = fetchGraphData(
        '1966',
        '4396d291-34e9-4e1e-8e17-e45e2ec44f82',
        '1613433600000'
      );

      thunk(mockDispatch);

      // 1. Loading action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: 'FETCH_GRAPH_DATA_LOADING',
      });

      // 2. Ajax call
      expect(ajaxSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/settings/injury_risk_contributing_factors/build',
          data: JSON.stringify({
            athlete_id: '1966',
            injury_risk_variable_uuid: '4396d291-34e9-4e1e-8e17-e45e2ec44f82',
            prediction_timestamp: '1613433600000',
          }),
        })
      );

      // 3. Success action
      expect(mockDispatch.mock.calls[1][0]).toEqual({
        type: 'FETCH_GRAPH_DATA_SUCCESS',
        payload: {
          graphData: { graphData: graphDummyData },
        },
      });

      // 4. Hide status action after timeout
      jest.runAllTimers();
      expect(mockDispatch.mock.calls[2][0]).toEqual({
        type: 'HIDE_APP_STATUS',
      });
      expect(mockDispatch).toHaveBeenCalledTimes(3);
    });

    it('sends to correct url when feature flag is on', () => {
      window.featureFlags['side-nav-update'] = true;

      const thunk = fetchGraphData(
        '1966',
        '4396d291-34e9-4e1e-8e17-e45e2ec44f82',
        '1613433600000'
      );

      thunk(mockDispatch);

      expect(ajaxSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/analytics/injury_risk_contributing_factors/build',
        })
      );
    });
  });

  describe('When fetching graph data fails', () => {
    let ajaxSpy;
    const mockDispatch = jest.fn();

    beforeEach(() => {
      mockDispatch.mockClear();
      const mockJqXHR = {
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockImplementation(function (callback) {
          callback();
          return this;
        }),
      };
      ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);
    });

    afterEach(() => {
      ajaxSpy.mockRestore();
    });

    it('dispatches the correct actions', () => {
      const thunk = fetchGraphData(
        '1966',
        '4396d291-34e9-4e1e-8e17-e45e2ec44f82',
        '1613433600000'
      );

      thunk(mockDispatch);

      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: 'FETCH_GRAPH_DATA_LOADING',
      });
      expect(mockDispatch.mock.calls[1][0]).toEqual({
        type: 'FETCH_GRAPH_DATA_ERROR',
      });
      expect(mockDispatch).toHaveBeenCalledTimes(2);
    });
  });
});
