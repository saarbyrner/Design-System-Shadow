import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import App from '../App';
import dummyChatMessages from '../../../resources/dummyChatMessages';

// A minimal Redux state required by the child components.
const preloadedState = {
  athleteChat: {
    searchableItemGroups: {
      staff: [],
      athletes: [],
    },
  },
};

describe('Athlete Chat <App /> component', () => {
  const baseProps = {
    chatContext: { identity: '6||97443' },
    messages: dummyChatMessages,
    createChatClient: jest.fn(),
    sendNewMessage: jest.fn(),
    sendMedia: jest.fn(),
    switchChannel: jest.fn(),
    leaveChannel: jest.fn(),
    refreshChannelLists: jest.fn(),
    requestNextPageOfMessages: jest.fn(),
    requestPreviousPageOfMessages: jest.fn(),
    markMessagesRead: jest.fn(),
    showChannelMembersModal: jest.fn(),
    createChannel: jest.fn(),
    userRole: {
      identity: '6||97443',
      permissions: {
        canViewMessaging: true,
        canCreatePrivateChannel: true,
        canCreateDirectChannel: true,
        canAdministrateChannel: true,
      },
    },
    t: i18nextTranslateStub(),
  };

  it('renders the main chat container', () => {
    const { container } = renderWithRedux(<App {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(container.querySelector('.chatContainer')).toBeInTheDocument();
  });
});
