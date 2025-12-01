import viewTypeReducer from '../viewType';
import { updateViewType } from '../../actions';

describe('viewType reducer', () => {
  const initialState = 'LIST';

  it('returns correct state on UPDATE_VIEW_TYPE', () => {
    const action = updateViewType('GRID');
    const nextState = viewTypeReducer(initialState, action);

    expect(nextState).toBe('GRID');
  });

  it('returns initial state when action type does not match', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const nextState = viewTypeReducer(initialState, action);

    expect(nextState).toBe(initialState);
  });
});
