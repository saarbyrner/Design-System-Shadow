import $ from 'jquery';
import {
  injuryRiskMetricsIsLoading,
  injuryRiskMetricsHasLoaded,
  injuryRiskMetricsHasErrored,
  setInjuryRiskMetrics,
  fetchInjuryriskMetrics,
} from '../injuryRiskMetrics';

jest.mock('jquery', () => ({
  ajax: jest.fn(),
}));

const mockInjuryRiskMetrics = [
  {
    archived: false,
    created_at: '2021-04-21T14:28:27Z',
    created_by: { id: 1236, fullname: "Stuart O'Brien" },
    date_range: {
      start_date: '2020-10-21T14:28:27Z',
      end_date: '2021-04-21T14:28:27Z',
    },
    filter: {
      exposure_types: ['game', 'training_session'],
      mechanisms: ['contact', 'non_contact'],
      osics_group_identifiers: ['all_injuries'],
    },
    last_prediction_status: 'completed',
    name: 'Testing 20210421142827',
  },
];

describe('analyticalDashboard - injuryRiskMetrics Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has the correct action INJURY_METRICS_IS_LOADING', () => {
    const expectedAction = {
      type: 'INJURY_METRICS_IS_LOADING',
    };

    expect(injuryRiskMetricsIsLoading()).toEqual(expectedAction);
  });

  it('has the correct action INJURY_METRICS_HAS_LOADED', () => {
    const expectedAction = {
      type: 'INJURY_METRICS_HAS_LOADED',
    };

    expect(injuryRiskMetricsHasLoaded()).toEqual(expectedAction);
  });

  it('has the correct action INJURY_METRICS_HAS_ERRORED', () => {
    const expectedAction = {
      type: 'INJURY_METRICS_HAS_ERRORED',
    };

    expect(injuryRiskMetricsHasErrored()).toEqual(expectedAction);
  });

  it('has the correct action SET_INJURY_RISK_METRICS', () => {
    const expectedAction = {
      type: 'SET_INJURY_RISK_METRICS',
      payload: mockInjuryRiskMetrics,
    };

    expect(setInjuryRiskMetrics(mockInjuryRiskMetrics)).toEqual(expectedAction);
  });

  describe('when fetching the injury risk metrics', () => {
    it('sends the correct request', () => {
      const mockAjax = {
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis(),
      };

      $.ajax.mockReturnValue(mockAjax);

      const thunk = fetchInjuryriskMetrics();
      const dispatcher = jest.fn();

      thunk(dispatcher);

      expect($.ajax).toHaveBeenCalledWith({
        method: 'GET',
        url: '/settings/injury_risk_variables.json',
        contentType: 'application/json',
      });

      // Simulate successful response
      const doneCallback = mockAjax.done.mock.calls[0][0];
      doneCallback(mockInjuryRiskMetrics);

      expect(dispatcher).toHaveBeenNthCalledWith(1, {
        type: 'INJURY_METRICS_IS_LOADING',
      });
      expect(dispatcher).toHaveBeenNthCalledWith(2, {
        type: 'SET_INJURY_RISK_METRICS',
        payload: mockInjuryRiskMetrics,
      });
      expect(dispatcher).toHaveBeenNthCalledWith(3, {
        type: 'INJURY_METRICS_HAS_LOADED',
      });
    });
  });

  describe('when fetching the injury risk metrics fails', () => {
    it('dispatches the correct action', () => {
      const mockAjax = {
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis(),
      };

      $.ajax.mockReturnValue(mockAjax);

      const thunk = fetchInjuryriskMetrics();
      const dispatcher = jest.fn();

      thunk(dispatcher);

      // Simulate failed response
      const failCallback = mockAjax.fail.mock.calls[0][0];
      failCallback();

      expect(dispatcher).toHaveBeenNthCalledWith(1, {
        type: 'INJURY_METRICS_IS_LOADING',
      });
      expect(dispatcher).toHaveBeenNthCalledWith(2, {
        type: 'INJURY_METRICS_HAS_ERRORED',
      });
      expect(dispatcher).toHaveBeenNthCalledWith(3, {
        type: 'INJURY_METRICS_HAS_LOADED',
      });
    });
  });
});
