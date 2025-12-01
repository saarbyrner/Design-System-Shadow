import closeToastItem from '../actions';

describe('Toast Actions', () => {
  it('has the correct action CLOSE_TOAST_ITEM', () => {
    const expectedAction = {
      type: 'CLOSE_TOAST_ITEM',
      payload: {
        itemId: 1234,
      },
    };

    expect(closeToastItem(1234)).toEqual(expectedAction);
  });
});
