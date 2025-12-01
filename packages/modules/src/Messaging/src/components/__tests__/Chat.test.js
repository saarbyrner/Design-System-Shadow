import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment';
import Chat from '../Chat';

const preloadedState = {
  athleteChat: {
    searchableItemGroups: {
      staff: [],
      athletes: [],
      userChannels: [],
      directChannels: [],
    },
  },
};

describe('<Chat /> component', () => {
  const date1 = moment('2020-11-01T12:00:00Z');
  const date2 = moment('2020-11-02T12:01:00Z');
  const date3 = moment('2020-11-03T13:00:00Z');

  const baseProps = {
    userRole: { permissions: {} },
    messages: [
      { messageType: 'LOG', body: 'Connecting...', index: 0 },
      {
        messageType: 'ME',
        body: 'First Hello!',
        index: 1,
        date: date1,
        time: '12:00 pm',
      },
      {
        messageType: 'ME',
        body: 'Second message!',
        index: 2,
        date: date2,
        time: '12:01 pm',
      },
      {
        messageType: 'THEM',
        body: 'Hey there!',
        index: 3,
        date: date3,
        time: '1:00 pm',
      },
    ],
    currentChannel: { sid: 'CH123' },
    currentChannelExtraData: {
      fetchMessagesStatus: 'FETCH_COMPLETE',
      members: [
        { lastReadMessageIndex: 1 },
        { lastReadMessageIndex: 2 },
        { lastReadMessageIndex: 2 },
      ],
    },
    generalStatus: 'CONNECTED',
    onMessageSend: jest.fn(),
    markMessagesRead: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the correct number of messages', () => {
    renderWithRedux(<Chat {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    const messageContainers = document.querySelectorAll(
      '.chatMessaging__messageContainer:not(.chatMessaging__messageContainer--log)'
    );
    expect(messageContainers).toHaveLength(3);
  });

  it('renders the correct message times', () => {
    renderWithRedux(<Chat {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('12:00 pm')).toBeInTheDocument();
    expect(screen.getByText('12:01 pm')).toBeInTheDocument();
    expect(screen.getByText('1:00 pm')).toBeInTheDocument();
  });

  it('renders the correct read status for messages', () => {
    renderWithRedux(<Chat {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('(1/2)')).toBeInTheDocument();
    expect(screen.getByText('(0/2)')).toBeInTheDocument();
  });

  it('renders date dividers when message dates differ', () => {
    renderWithRedux(<Chat {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText(/November 01/i)).toBeInTheDocument();
    expect(screen.getByText(/November 02/i)).toBeInTheDocument();
    expect(screen.getByText(/November 03/i)).toBeInTheDocument();
  });

  it('renders the loading UI when message status is FETCHING', () => {
    const fetchingProps = {
      ...baseProps,
      currentChannelExtraData: {
        ...baseProps.currentChannelExtraData,
        fetchMessagesStatus: 'FETCHING',
      },
    };
    renderWithRedux(<Chat {...fetchingProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders the "No messages yet" status when messages array is empty', () => {
    renderWithRedux(<Chat {...baseProps} messages={[]} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('No messages yet')).toBeInTheDocument();
  });

  it('renders the "Select a channel" status when there is no current channel', () => {
    renderWithRedux(<Chat {...baseProps} currentChannel={null} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('Select a channel')).toBeInTheDocument();
  });

  it('does not render the message input if the user has a read-only role', () => {
    const readOnlyProps = {
      ...baseProps,
      currentChannelExtraData: {
        ...baseProps.currentChannelExtraData,
        memberRole: 'channel user - readonly',
      },
    };
    renderWithRedux(<Chat {...readOnlyProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders media messages', () => {
    const mediaMessages = [
      {
        messageType: 'ME',
        index: 1,
        date: moment(),
        time: '12:00 pm',
        mediaDetails: {
          contentClass: 'image',
          isWebDisplayable: true,
        },
        media: { filename: 'test_image.jpg' },
      },
    ];

    const { container } = renderWithRedux(
      <Chat {...baseProps} messages={mediaMessages} />,
      { preloadedState, useGlobalStore: false }
    );
    const messageBody = container.querySelector('.css-17nq19z-messageBody');
    expect(messageBody).toBeInTheDocument();
  });
});
