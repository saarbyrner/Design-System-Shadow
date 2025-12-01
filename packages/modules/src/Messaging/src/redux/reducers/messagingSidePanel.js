// @flow
import type { Action as ChannelCreationSidePanelActions } from '../../components/ChannelCreationSidePanel/types';
import type { Action as ChannelMembersSidePanelActions } from '../../components/ChannelMembersSidePanel/types';
import type { Action as ChannelSettingsSidePanelActions } from '../../components/ChannelSettingsSidePanel/types';
import type { Action as MessageInfoSidePanelActions } from '../../components/MessageInfoSidePanel/types';
import type { messagingSidePanelState } from '../../types';

export default (
  state: messagingSidePanelState = {},
  action:
    | ChannelCreationSidePanelActions
    | ChannelMembersSidePanelActions
    | ChannelSettingsSidePanelActions
    | MessageInfoSidePanelActions
): messagingSidePanelState => {
  switch (action.type) {
    case 'OPEN_MESSAGE_INFO_SIDE_PANEL': {
      return {
        ...state,
        activeSidePanel: 'MessageInfo',
      };
    }
    case 'CLOSE_MESSAGE_INFO_SIDE_PANEL': {
      return {
        ...state,
        activeSidePanel: null,
      };
    }
    case 'OPEN_CHANNEL_CREATION_SIDE_PANEL': {
      return {
        ...state,
        activeSidePanel: 'ChannelCreation',
      };
    }
    case 'CLOSE_CHANNEL_CREATION_SIDE_PANEL': {
      return {
        ...state,
        activeSidePanel: null,
      };
    }
    case 'OPEN_CHANNEL_MEMBERS_SIDE_PANEL': {
      return {
        ...state,
        activeSidePanel: 'ChannelMembers',
      };
    }
    case 'CLOSE_CHANNEL_MEMBERS_SIDE_PANEL': {
      return {
        ...state,
        activeSidePanel: null,
      };
    }
    case 'OPEN_CHANNEL_SETTINGS_SIDE_PANEL': {
      return {
        ...state,
        activeSidePanel: 'ChannelSettings',
      };
    }
    case 'CLOSE_CHANNEL_SETTINGS_SIDE_PANEL': {
      return {
        ...state,
        activeSidePanel: null,
      };
    }

    default:
      return state;
  }
};
