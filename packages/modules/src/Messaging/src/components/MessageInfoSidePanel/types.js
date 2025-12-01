// @flow

type openMessageInfoSidePanel = {
  type: 'OPEN_MESSAGE_INFO_SIDE_PANEL',
  payload: {
    messageIndex: number,
  },
};

type closeMessageInfoSidePanel = {
  type: 'CLOSE_MESSAGE_INFO_SIDE_PANEL',
};

export type Action = openMessageInfoSidePanel | closeMessageInfoSidePanel;
