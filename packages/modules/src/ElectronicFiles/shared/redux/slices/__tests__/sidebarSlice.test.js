import sidebarSlice, {
  updateExpanded,
  updateSelectedMenuItem,
  reset,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';

const initialState = mockState.sidebarSlice;

describe('[sidebarSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(sidebarSlice.reducer(initialState, action)).toEqual(expectedState);
  });

  it('should correctly update expanded', () => {
    const actionToTrue = updateExpanded(true);
    const stateToTrue = sidebarSlice.reducer(initialState, actionToTrue);
    expect(stateToTrue.expanded).toEqual(true);

    const actionToFalse = updateExpanded(false);
    const stateToFalse = sidebarSlice.reducer(stateToTrue, actionToFalse);
    expect(stateToFalse.expanded).toEqual(false);
  });

  it('should correctly update selected menu item', () => {
    const actionToSent = updateSelectedMenuItem('sent');
    const stateToSent = sidebarSlice.reducer(initialState, actionToSent);
    expect(stateToSent.selectedMenuItem).toEqual('sent');

    const actionToInbox = updateSelectedMenuItem('inbox');
    const stateToInbox = sidebarSlice.reducer(stateToSent, actionToInbox);
    expect(stateToInbox.selectedMenuItem).toEqual('inbox');
  });

  it('should correctly reset', () => {
    const actionToShrink = updateExpanded(false);
    const stateToShrink = sidebarSlice.reducer(initialState, actionToShrink);
    expect(stateToShrink.expanded).toEqual(false);

    const actionToSent = updateSelectedMenuItem('sent');
    const stateToSent = sidebarSlice.reducer(stateToShrink, actionToSent);
    expect(stateToSent.selectedMenuItem).toEqual('sent');

    const actionToReset = reset();
    const stateToReset = sidebarSlice.reducer(stateToSent, actionToReset);
    expect(stateToReset.expanded).toEqual(true);
    expect(stateToReset.selectedMenuItem).toEqual('inbox');
  });
});
