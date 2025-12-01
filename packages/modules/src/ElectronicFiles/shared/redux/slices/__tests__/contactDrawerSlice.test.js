import contactDrawerSlice, {
  updateOpen,
  updateData,
  updateValidation,
  reset,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactDrawerSlice';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';

const initialState = mockState.contactDrawerSlice;

describe('[contactDrawerSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(contactDrawerSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update open', () => {
    const actionToTrue = updateOpen(true);
    const stateToTrue = contactDrawerSlice.reducer(initialState, actionToTrue);
    expect(stateToTrue.open).toEqual(true);

    const actionToFalse = updateOpen(false);
    const stateToFalse = contactDrawerSlice.reducer(stateToTrue, actionToFalse);
    expect(stateToFalse.open).toEqual(false);
  });

  it('should correctly update data', () => {
    const contact = {
      name: 'Thierry',
      number: '111 222 333',
      address: 'Highbury',
    };

    const action = updateData({
      contact,
    });
    const state = contactDrawerSlice.reducer(initialState, action);
    expect(state.data.contact).toEqual(contact);
  });

  it('should corectly update validation', () => {
    const payload = {
      firstName: ['First name is required'],
    };

    const action = updateValidation(payload);
    const state = contactDrawerSlice.reducer(initialState, action);
    expect(state.validation.errors).toEqual(payload);
  });

  it('should correctly reset', () => {
    const actionToOpen = updateOpen(true);
    const stateToOpen = contactDrawerSlice.reducer(initialState, actionToOpen);
    expect(stateToOpen.open).toEqual(true);

    const actionToReset = reset();
    const stateToReset = contactDrawerSlice.reducer(stateToOpen, actionToReset);
    expect(stateToReset.open).toEqual(false);
  });
});
