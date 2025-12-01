import coachingPrinciplesReducer from '../coaching_principles_reducer';

describe('coachingPrinciples reducer', () => {
  it('returns the correct state on SET_COACHING_PRINCIPLES_ENABLED', () => {
    const initialState = {};

    const action = {
      type: 'SET_COACHING_PRINCIPLES_ENABLED',
      payload: {
        value: true,
      },
    };

    const nextState = coachingPrinciplesReducer(initialState, action);
    expect(nextState).toEqual({
      isEnabled: true,
    });
  });
});
