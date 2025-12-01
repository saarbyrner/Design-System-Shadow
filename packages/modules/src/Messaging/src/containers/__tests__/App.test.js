import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import App from '../App';

describe('Athlete Chat App Container', () => {
  const baseProps = {
    chatContext: { identity: '6||97443' },
    createChatClient: jest.fn(),
    switchChannel: jest.fn(),
    leaveChannel: jest.fn(),
    sendNewMessage: jest.fn(),
    refreshChannelLists: jest.fn(),
    requestNextPageOfMessages: jest.fn(),
    requestPreviousPageOfMessages: jest.fn(),
    markMessagesRead: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const preloadedState = {
    athleteChat: {
      userRole: {
        permissions: {
          canViewMessaging: true,
          canCreatePrivateChannel: true,
          canCreateDirectChannel: true,
          canAdministrateChannel: true,
        },
        identity: '6||97443',
      },
      userChannels: [],
      directChannels: [],
      messages: [],
      currentChannel: null,
      currentChannelExtraData: {},
      searchableItemGroups: { staff: [], athletes: [] },
    },
    messagingSidePanel: {
      activeSidePanel: null,
    },
  };

  it('renders the main chat container', () => {
    const { container } = renderWithRedux(<App {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(container.querySelector('.chatContainer')).toBeInTheDocument();
  });
});
