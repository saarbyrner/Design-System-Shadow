import { updateDecorators, updateAggregationPeriod } from '..';

describe('Graph Composer - Graph View Actions', () => {
  it('has the correct action UPDATE_DECORATORS', () => {
    const newDecorators = {
      injuries: true,
      illnesses: false,
    };

    const expectedAction = {
      type: 'UPDATE_DECORATORS',
      payload: {
        graphGroup: 'longitudinal',
        decorators: newDecorators,
      },
    };

    expect(updateDecorators('longitudinal', newDecorators)).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_AGGREGATION_PERIOD', () => {
    const newAggregationPeriod = 'month';

    const expectedAction = {
      type: 'UPDATE_AGGREGATION_PERIOD',
      payload: {
        aggregationPeriod: newAggregationPeriod,
      },
    };

    expect(updateAggregationPeriod(newAggregationPeriod)).toEqual(
      expectedAction
    );
  });
});
