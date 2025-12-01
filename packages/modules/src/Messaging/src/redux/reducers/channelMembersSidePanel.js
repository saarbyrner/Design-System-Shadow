// @flow
import type { Action as ChannelMembersSidePanelActions } from '../../components/ChannelMembersSidePanel/types';
import type { channelMembersSidePanelState } from '../../types';

export default (
  state: channelMembersSidePanelState = {},
  action: ChannelMembersSidePanelActions
): channelMembersSidePanelState => {
  switch (action.type) {
    case 'CLOSE_CHANNEL_MEMBERS_SIDE_PANEL': {
      return {
        ...state,
        updateRequestStatus: 'IDLE',
      };
    }
    case 'CHANNEL_MEMBERS_UPDATE_IN_PROGRESS': {
      return {
        ...state,
        updateRequestStatus: 'IN_PROGRESS',
      };
    }
    case 'CHANNEL_MEMBERS_UPDATE_COMPLETE': {
      return {
        ...state,
        updateRequestStatus: 'COMPLETE',
      };
    }
    case 'CHANNEL_MEMBERS_UPDATE_FAILED': {
      return {
        ...state,
        updateRequestStatus: 'FAILED',
      };
    }
    default:
      return state;
  }
};
