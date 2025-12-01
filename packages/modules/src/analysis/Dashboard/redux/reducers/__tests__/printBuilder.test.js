import printBuilderReducer from '../printBuilder';

describe('analyticalDashboard - printBuilder reducer', () => {
  const defaultState = {};

  it('returns the correct state on OPEN_PRINT_BUILDER', () => {
    const initialState = {
      ...defaultState,
      isOpen: false,
    };

    const action = {
      type: 'OPEN_PRINT_BUILDER',
    };

    const nextState = printBuilderReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
    });
  });

  it('returns the correct state on CLOSE_PRINT_BUILDER', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'CLOSE_PRINT_BUILDER',
    };

    const nextState = printBuilderReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: false,
    });
  });
});
