import sendDrawerSlice, {
  updateOpen,
  updateData,
  attachSelectedFiles,
  updateValidation,
  reset,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import {
  mockState,
  mockFiles,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import { mapFilesToOptions } from '@kitman/modules/src/ElectronicFiles/shared/utils';

const initialState = mockState.sendDrawerSlice;

describe('[sendDrawerSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(sendDrawerSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update open', () => {
    const actionToTrue = updateOpen(true);
    const stateToTrue = sendDrawerSlice.reducer(initialState, actionToTrue);
    expect(stateToTrue.open).toEqual(true);

    const actionToFalse = updateOpen(false);
    const stateToFalse = sendDrawerSlice.reducer(stateToTrue, actionToFalse);
    expect(stateToFalse.open).toEqual(false);
  });

  it('should correctly update data', () => {
    const newContact = {
      name: 'Thierry',
      number: '111 222 333',
      address: 'Highbury',
    };

    const action = updateData({
      newContact,
    });
    const state = sendDrawerSlice.reducer(initialState, action);
    expect(state.data.newContact).toEqual(newContact);
  });

  it('should correctly attach selected files', () => {
    const action = attachSelectedFiles();

    const selectedFiles = mapFilesToOptions(mockFiles.entity_attachments);

    const state = sendDrawerSlice.reducer(
      {
        ...initialState,
        data: {
          ...initialState.data,
          selectedFiles,
        },
      },
      action
    );

    expect(state.data.attachedFiles).toEqual(
      selectedFiles.map((option) => option.file || {})
    );
    expect(state.data.selectedFiles).toEqual([]);
  });

  it('should corectly update validation', () => {
    const payload = {
      message: ['Message is required'],
    };

    const action = updateValidation(payload);
    const state = sendDrawerSlice.reducer(initialState, action);
    expect(state.validation.errors).toEqual(payload);
  });

  it('should correctly reset', () => {
    const actionToOpen = updateOpen(true);
    const stateToOpen = sendDrawerSlice.reducer(initialState, actionToOpen);
    expect(stateToOpen.open).toEqual(true);

    const actionToReset = reset();
    const stateToReset = sendDrawerSlice.reducer(stateToOpen, actionToReset);
    expect(stateToReset.open).toEqual(false);
  });
});
