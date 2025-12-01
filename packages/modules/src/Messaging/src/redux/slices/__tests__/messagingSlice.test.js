import messagingSlice, {
  initialState,
  setConversationUnread,
  removeConversation,
  reset,
} from '../messagingSlice';

const messagingSliceReducer = messagingSlice.reducer;

describe('messagingSlice', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(messagingSliceReducer(initialState, action)).toStrictEqual(
      expectedState
    );
  });

  describe('setConversationUnread()', () => {
    it('should set unread count for a new conversation', () => {
      const sid = '123';
      const count = 5;

      const expectedState = {
        totalUnread: 5,
        conversationMap: {
          [sid]: 5,
        },
      };

      expect(
        messagingSliceReducer(
          initialState,
          setConversationUnread({ sid, count })
        )
      ).toStrictEqual(expectedState);
    });

    it('should update unread count for existing conversation and adjust total', () => {
      const sid = '123';
      const initialStateWithConversation = {
        totalUnread: 5,
        conversationMap: {
          [sid]: 5,
        },
      };

      const expectedState = {
        totalUnread: 8, // 5 - 5 + 8 = 8
        conversationMap: {
          [sid]: 8,
        },
      };

      expect(
        messagingSliceReducer(
          initialStateWithConversation,
          setConversationUnread({ sid, count: 8 })
        )
      ).toStrictEqual(expectedState);
    });

    it('should decrease total unread when conversation count is reduced', () => {
      const sid = 'conversation-123';
      const initialStateWithConversation = {
        totalUnread: 10,
        conversationMap: {
          [sid]: 7,
        },
      };

      const expectedState = {
        totalUnread: 6, // 10 - 7 + 3 = 6
        conversationMap: {
          [sid]: 3,
        },
      };

      expect(
        messagingSliceReducer(
          initialStateWithConversation,
          setConversationUnread({ sid, count: 3 })
        )
      ).toStrictEqual(expectedState);
    });
  });

  describe('removeConversation()', () => {
    it('should remove conversation and adjust total unread count', () => {
      const sid = 'conversation-123';
      const initialStateWithConversation = {
        totalUnread: 10,
        conversationMap: {
          [sid]: 5,
          'conversation-456': 5,
        },
      };

      const expectedState = {
        totalUnread: 5, // 10 - 5 = 5
        conversationMap: {
          'conversation-456': 5,
        },
      };

      expect(
        messagingSliceReducer(
          initialStateWithConversation,
          removeConversation({ sid })
        )
      ).toStrictEqual(expectedState);
    });

    it('should ensure totalUnread never goes below 0', () => {
      const sid = 'conversation-123';
      const initialStateWithConversation = {
        totalUnread: 3,
        conversationMap: {
          [sid]: 5,
        },
      };

      const expectedState = {
        totalUnread: 0,
        conversationMap: {},
      };

      expect(
        messagingSliceReducer(
          initialStateWithConversation,
          removeConversation({ sid })
        )
      ).toStrictEqual(expectedState);
    });
  });

  describe('reset()', () => {
    it('should reset state to initial state', () => {
      const stateWithData = {
        totalUnread: 15,
        conversationMap: {
          'conversation-1': 5,
          'conversation-2': 10,
        },
      };

      expect(messagingSliceReducer(stateWithData, reset())).toStrictEqual(
        initialState
      );
    });
  });
});
