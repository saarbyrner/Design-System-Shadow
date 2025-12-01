import { toggleSlidingPanel, updateAggregationPeriod } from '../pivotPanel';

describe('Pivot Panel Actions', () => {
  it('has the correct action TOGGLE_SLIDING_PANEL', () => {
    const expectedAction = {
      type: 'TOGGLE_SLIDING_PANEL',
    };

    expect(toggleSlidingPanel()).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_AGGREGATION_PERIOD', () => {
    const expectedAction = {
      type: 'UPDATE_AGGREGATION_PERIOD',
      payload: {
        graphId: '3',
        aggregationPeriod: 'month',
      },
    };

    expect(updateAggregationPeriod('3', 'month')).toEqual(expectedAction);
  });
});
