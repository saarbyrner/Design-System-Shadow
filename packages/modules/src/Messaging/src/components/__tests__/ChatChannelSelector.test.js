import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChatChannelSelector from '../ChatChannelSelector';

const preloadedState = {
  athleteChat: {
    searchableItemGroups: {
      staff: [{ identifier: 'id||001' }],
      athletes: [{ identifier: 'id||001' }],
    },
  },
};

describe('<ChatChannelSelector /> component', () => {
  const baseProps = {
    channels: [
      {
        sid: 'ch_01',
        friendlyName: 'Channel 1',
        status: 'joined',
        unreadMessagesCount: 1,
      },
      {
        sid: 'ch_02',
        friendlyName: 'Channel 2',
        status: 'invited',
        unreadMessagesCount: 5,
      },
      {
        sid: 'ch_03',
        friendlyName: 'Channel 3',
        status: 'notParticipating',
        unreadMessagesCount: 0,
      },
      {
        sid: 'ch_04',
        friendlyName: 'Channel 4',
        status: 'unknown',
        unreadMessagesCount: -1,
      },
      {
        sid: 'ch_05',
        friendlyName: 'Channel 5',
        status: 'unknown',
        unreadMessagesCount: -1,
      },
    ],
    userIdentity: 'someIdentity',
    onSwitchedChannel: jest.fn(),
    currentChannel: null,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render if no channels and hideIfZeroChannels is true', () => {
    const { container } = renderWithRedux(
      <ChatChannelSelector {...baseProps} channels={[]} hideIfZeroChannels />,
      { preloadedState, useGlobalStore: false }
    );
    expect(container.querySelector('.chatChannelSelector')).toBeNull();
  });

  it('renders even if there are no channels when hideIfZeroChannels is false', () => {
    const { container } = renderWithRedux(
      <ChatChannelSelector {...baseProps} channels={[]} />,
      { preloadedState, useGlobalStore: false }
    );
    expect(container.querySelector('.chatChannelSelector')).toBeInTheDocument();
  });

  it('renders the correct number of channels', () => {
    renderWithRedux(<ChatChannelSelector {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getAllByText(/Channel \d/)).toHaveLength(5);
  });

  it('renders the channel count when showChannelCount is true', () => {
    renderWithRedux(<ChatChannelSelector {...baseProps} showChannelCount />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onSwitchedChannel with the correct SID when a channel is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<ChatChannelSelector {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    await user.click(screen.getByText('Channel 1'));
    expect(baseProps.onSwitchedChannel).toHaveBeenCalledWith('ch_01');
  });

  it('renders a title when the title prop is supplied', () => {
    renderWithRedux(
      <ChatChannelSelector {...baseProps} title="Hello Title" />,
      { preloadedState, useGlobalStore: false }
    );
    expect(screen.getByText('Hello Title')).toBeInTheDocument();
  });

  it('renders unread message counts when showUnreadCount is true', () => {
    renderWithRedux(<ChatChannelSelector {...baseProps} showUnreadCount />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('applies a class for big icons when bigIcons is true', () => {
    renderWithRedux(<ChatChannelSelector {...baseProps} bigIcons />, {
      preloadedState,
      useGlobalStore: false,
    });
    const channelElement = screen.getByText('Channel 1').closest('div');
    expect(channelElement).toHaveClass('chatChannelSelector__channel--big');
  });

  it('filters channels based on the channelsFilter prop', () => {
    const filter = (channel) => channel.unreadMessagesCount > 0;
    renderWithRedux(
      <ChatChannelSelector {...baseProps} channelsFilter={filter} />,
      { preloadedState, useGlobalStore: false }
    );

    expect(screen.getAllByText(/Channel \d/)).toHaveLength(2);
    expect(screen.queryByText('Channel 3')).not.toBeInTheDocument();
  });

  it('renders and handles clicks for the plus button', async () => {
    const user = userEvent.setup();
    const plusButtonCallback = jest.fn();
    const { container } = renderWithRedux(
      <ChatChannelSelector
        {...baseProps}
        plusButtonAction={plusButtonCallback}
      />,
      { preloadedState, useGlobalStore: false }
    );

    const plusButton = container.querySelector('.icon-add');
    await user.click(plusButton);

    expect(plusButtonCallback).toHaveBeenCalledTimes(1);
  });
});
