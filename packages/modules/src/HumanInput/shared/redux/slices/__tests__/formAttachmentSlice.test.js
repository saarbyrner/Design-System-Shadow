import formAttachmentSlice, {
  onResetAttachmentsQueue,
  onUpdate,
  onDelete,
  onBuildOriginalQueue,
  onRestoreFormAttachments,
  onDeleteAttachmentFromRepeatableGroup,
  initialState,
} from '../formAttachmentSlice';

const mockAttachment = {
  id: 1,
  name: 'test.pdf',
  type: 'application/pdf',
  size: 1000,
  blobUrl: 'blob://test',
  createdDate: '2023-01-01',
};

const mockQueueItem = {
  file: mockAttachment,
  state: 'IDLE',
  message: null,
};

describe('[formAttachmentSlice]', () => {
  it('should have initial state', () => {
    const action = { type: 'unknown' };
    expect(formAttachmentSlice.reducer(initialState, action)).toEqual(
      initialState
    );
  });

  describe('reducers', () => {
    it('onResetAttachmentsQueue should reset to initial state', () => {
      const state = {
        queue: { 1: mockQueueItem },
        originalQueue: { 1: mockQueueItem },
      };
      const action = onResetAttachmentsQueue();

      expect(formAttachmentSlice.reducer(state, action)).toEqual(initialState);
    });

    it('onUpdate should update queue state', () => {
      const payload = { 1: mockQueueItem };
      const action = onUpdate(payload);
      const result = formAttachmentSlice.reducer(initialState, action);

      expect(result.queue).toEqual(payload);
    });

    it('onBuildOriginalQueue should update original queue', () => {
      const payload = { 1: mockQueueItem };
      const action = onBuildOriginalQueue(payload);
      const result = formAttachmentSlice.reducer(initialState, action);

      expect(result.originalQueue).toEqual(payload);
    });

    it('onDelete should remove item from queue', () => {
      const state = {
        queue: { 1: mockQueueItem, 2: mockQueueItem },
        originalQueue: {},
      };
      const action = onDelete({ id: 1 });
      const result = formAttachmentSlice.reducer(state, action);

      expect(result.queue).toEqual({ 2: mockQueueItem });
    });

    it('onRestoreFormAttachments should restore from original queue', () => {
      const state = {
        queue: { 1: mockQueueItem },
        originalQueue: { 2: mockQueueItem },
      };
      const action = onRestoreFormAttachments();
      const result = formAttachmentSlice.reducer(state, action);

      expect(result.queue).toEqual(state.originalQueue);
    });

    describe('onDeleteAttachmentFromRepeatableGroup', () => {
      const repeatableState = {
        queue: {
          1: [mockQueueItem, mockQueueItem, mockQueueItem],
          2: [mockQueueItem],
        },
        originalQueue: {},
      };

      it('should remove group when isDeleteGroupAction is true', () => {
        const action = onDeleteAttachmentFromRepeatableGroup({
          elementId: 1,
          groupNumber: 1,
          isDeleteGroupAction: true,
        });

        const result = formAttachmentSlice.reducer(repeatableState, action);

        expect(result.queue[1].length).toBe(2);
      });

      it('should set group item to null when isDeleteGroupAction is false', () => {
        const action = onDeleteAttachmentFromRepeatableGroup({
          elementId: 1,
          groupNumber: 1,
          isDeleteGroupAction: false,
        });
        const result = formAttachmentSlice.reducer(repeatableState, action);

        expect(result.queue[1][1]).toBeNull();
      });

      it('should remove multiple groups when isDeleteGroupAction is true', () => {
        const multiGroupState = {
          queue: {
            1: [mockQueueItem, mockQueueItem, mockQueueItem, mockQueueItem],
            2: [mockQueueItem],
          },
          originalQueue: {},
        };

        const action1 = onDeleteAttachmentFromRepeatableGroup({
          elementId: 1,
          groupNumber: 1,
          isDeleteGroupAction: true,
        });

        const action2 = onDeleteAttachmentFromRepeatableGroup({
          elementId: 1,
          groupNumber: 0,
          isDeleteGroupAction: true,
        });

        let result = formAttachmentSlice.reducer(multiGroupState, action1);

        result = formAttachmentSlice.reducer(result, action2);

        expect(result.queue[1].length).toBe(2);
        expect(result.queue[2]).toEqual([mockQueueItem]);
      });

      it('should maintain other elementIds when deleting a group', () => {
        const state = {
          queue: {
            1: [mockQueueItem, mockQueueItem],
            2: [mockQueueItem, mockQueueItem],
          },
          originalQueue: {},
        };

        const action = onDeleteAttachmentFromRepeatableGroup({
          elementId: 1,
          groupNumber: 0,
          isDeleteGroupAction: true,
        });

        const result = formAttachmentSlice.reducer(state, action);

        expect(result.queue[1].length).toBe(1);
        expect(result.queue[2].length).toBe(2);
      });
    });
  });
});
