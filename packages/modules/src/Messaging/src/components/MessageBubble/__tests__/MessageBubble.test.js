import { screen } from '@testing-library/react';
import moment from 'moment';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import MessageBubble from '../index';

describe('<MessageBubble />', () => {
  let baseProps;

  beforeEach(() => {
    window.featureFlags = {};
    const messageDate = moment('2020-11-02T12:01:00Z');

    baseProps = {
      message: {
        messageType: 'ME',
        body: 'Second message from me!',
        index: 2,
        authorDetails: {
          authorName: 'Author1',
          friendlyName: 'Nice 1',
          colourNumber: 1,
        },
        time: '12:01 pm',
        date: messageDate,
      },
      channelSid: 'someSid',
      members: [
        {
          messagingIdentity: 'id1',
          lastReadMessageIndex: 1,
        },
      ],
      isDirectMessage: false,
      displayReadStatus: true,
      firstMessageInChain: true,
      allRoundCorners: true,
      onViewMessageInfo: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders an outgoing message without the author name', () => {
    renderWithRedux(<MessageBubble {...baseProps} />, {
      preloadedState: {},
      useGlobalStore: false,
    });

    // Author's name should NOT be visible for "ME" messages
    expect(screen.queryByText('Nice 1')).not.toBeInTheDocument();

    // Message content and time should be visible
    expect(screen.getByText('Second message from me!')).toBeInTheDocument();
    expect(screen.getByText('12:01 pm')).toBeInTheDocument();
  });

  it('renders an incoming message with the author name', () => {
    const incomingMessageProps = {
      ...baseProps,
      message: {
        ...baseProps.message,
        messageType: 'THEM', // Change message type to incoming
      },
    };

    renderWithRedux(<MessageBubble {...incomingMessageProps} />, {
      preloadedState: {},
      useGlobalStore: false,
    });

    // Author's name, content, and time should ALL be visible
    expect(screen.getByText('Nice 1')).toBeInTheDocument();
    expect(screen.getByText('Second message from me!')).toBeInTheDocument();
    expect(screen.getByText('12:01 pm')).toBeInTheDocument();
  });
});
