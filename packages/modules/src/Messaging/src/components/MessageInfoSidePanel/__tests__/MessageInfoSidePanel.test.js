import { screen } from '@testing-library/react';
import moment from 'moment';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import MessageInfoSidePanel from '../index';

describe('<MessageInfoSidePanel />', () => {
  let baseProps;
  let preloadedState;

  beforeEach(() => {
    const messageDate = moment('2020-11-01T12:00:00Z');

    baseProps = {
      chatUserIdentity: 'id1',
      channelSid: 'CH_some_active_sid',
      message: {
        messageType: 'ME',
        body: 'First Hello!',
        index: 1,
        authorDetails: {
          authorName: 'Author1',
          friendlyName: 'Nice 1',
          colourNumber: 1,
        },
        time: '12:00 pm',
        date: messageDate,
      },
      members: [
        {
          messagingIdentity: 'id1',
          lastReadMessageIndex: 1,
          friendlyName: 'You',
        },
        {
          messagingIdentity: 'id2',
          lastReadMessageIndex: 2,
          friendlyName: 'Jon Doe',
        },
        {
          messagingIdentity: 'id3',
          lastReadMessageIndex: 2,
          friendlyName: 'Jane Smith',
        },
      ],
      onClose: jest.fn(),
      t: i18nextTranslateStub(),
    };

    // Mock all necessary parts of the Redux store
    preloadedState = {
      messagingSlice: {
        members: baseProps.members,
      },
      // Add the athleteChat slice needed by the ChatAvatar child component
      athleteChat: {
        searchableItemGroups: {
          staff: [],
          athletes: [],
        },
      },
    };
  });

  it('renders the message body and sender details', () => {
    renderWithRedux(<MessageInfoSidePanel {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    // Check for the message bubble content
    expect(screen.getByText('First Hello!')).toBeInTheDocument();

    // Check for the section header
    expect(screen.getByText('Read')).toBeInTheDocument();

    // Check for the names of the members who have read the message
    expect(screen.getByText('Jon Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
