import dialogSlice, {
  updateOpen,
  updateAllocations,
  updateAttachments,
  reset,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/dialogSlice';
import { data as mockInboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import { data as mockOutboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchOutboundElectronicFile.mock';

const initialState = {
  open: false,
  allocations: [],
  attachments: [],
};

describe('[dialogSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(dialogSlice.reducer(initialState, action)).toEqual(expectedState);
  });

  it('should correctly update open', () => {
    const actionToTrue = updateOpen(true);
    const stateToTrue = dialogSlice.reducer(initialState, actionToTrue);
    expect(stateToTrue.open).toEqual(true);

    const actionToFalse = updateOpen(false);
    const stateToFalse = dialogSlice.reducer(stateToTrue, actionToFalse);
    expect(stateToFalse.open).toEqual(false);
  });

  it('should correctly update allocations', () => {
    const actionToAllocations = updateAllocations(
      mockInboundData.data?.efax_allocations
    );
    const stateToAllocations = dialogSlice.reducer(
      initialState,
      actionToAllocations
    );
    expect(stateToAllocations.allocations).toEqual(
      mockInboundData.data?.efax_allocations
    );
  });

  it('should correctly update attachments', () => {
    const actionToAttachments = updateAttachments(
      mockOutboundData.data?.attachments
    );
    const stateToAttachments = dialogSlice.reducer(
      initialState,
      actionToAttachments
    );
    expect(stateToAttachments.attachments).toEqual(
      mockOutboundData.data?.attachments
    );
  });

  it('should correctly reset', () => {
    const actionToOpen = updateOpen(true);
    const stateToOpen = dialogSlice.reducer(initialState, actionToOpen);
    expect(stateToOpen.open).toEqual(true);

    const actionToAttachments = updateAttachments(
      mockOutboundData.data?.attachments
    );
    const stateToAttachments = dialogSlice.reducer(
      initialState,
      actionToAttachments
    );
    expect(stateToAttachments.attachments).toEqual(
      mockOutboundData.data?.attachments
    );

    const actionToReset = reset();
    const stateToReset = dialogSlice.reducer(stateToAttachments, actionToReset);
    expect(stateToReset.open).toEqual(false);
    expect(stateToReset.attachments).toEqual([]);
  });
});
