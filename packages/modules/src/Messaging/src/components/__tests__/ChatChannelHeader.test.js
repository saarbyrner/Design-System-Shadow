import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChatChannelHeader from '../ChatChannelHeader';

const preloadedState = {
  athleteChat: {
    searchableItemGroups: {
      staff: [{ identifier: 'id||001' }],
      athletes: [{ identifier: 'id||001' }],
    },
  },
};

describe('<ChatChannelHeader /> component', () => {
  const baseProps = {
    channel: {
      sid: 'ch_01',
      friendlyName: 'Channel 1',
      status: 'joined',
      description: 'Some description',
      creationType: 'private',
    },
    currentChannelExtraData: { memberRole: 'channel admin' },
    userRole: {
      permissions: { canAdministrateChannel: true },
    },
    onLeaveChannel: jest.fn(),
    showChannelMembersSidePanel: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct channel name and description', () => {
    renderWithRedux(<ChatChannelHeader {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('Channel 1')).toBeInTheDocument();
    expect(screen.getByText('Some description')).toBeInTheDocument();
  });

  it('does not render the description if it is not provided', () => {
    const propsWithoutDescription = {
      ...baseProps,
      channel: { ...baseProps.channel, description: undefined },
    };
    renderWithRedux(<ChatChannelHeader {...propsWithoutDescription} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.queryByText('Some description')).not.toBeInTheDocument();
  });

  describe('Channel Management Menu', () => {
    it('hides "Manage Members" if the user is not an admin', async () => {
      const user = userEvent.setup();
      const propsNotAdmin = {
        ...baseProps,
        userRole: { permissions: { canAdministrateChannel: false } },
        currentChannelExtraData: { memberRole: 'channel user' },
      };
      const { container } = renderWithRedux(
        <ChatChannelHeader {...propsNotAdmin} />,
        { preloadedState, useGlobalStore: false }
      );

      const menuButton = container.querySelector(
        '.chatChannelHeader__menuButton'
      );
      await user.click(menuButton);

      expect(screen.queryByText('Manage Members')).not.toBeInTheDocument();
    });

    it('enables "Manage Members" if the user has admin permissions', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRedux(
        <ChatChannelHeader {...baseProps} />,
        { preloadedState, useGlobalStore: false }
      );

      const menuButton = container.querySelector(
        '.chatChannelHeader__menuButton'
      );
      await user.click(menuButton);

      const manageMembersButton = (
        await screen.findByText('Manage Members')
      ).closest('button');
      expect(manageMembersButton).toBeEnabled();
    });
  });
});
