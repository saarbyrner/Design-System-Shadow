import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import MessagingMembersModal from '../index';

describe('<MessagingMembersModal />', () => {
  let baseProps;
  let preloadedState;

  const memberList = [
    {
      messagingIdentity: 'member_01',
      friendlyName: 'Member One',
      channelRole: 'channel admin',
    },
    {
      messagingIdentity: 'member_02',
      friendlyName: 'Member Two',
    },
    {
      messagingIdentity: 'member_03',
      friendlyName: 'Member Three',
    },
  ];

  beforeEach(() => {
    window.featureFlags = {};
    baseProps = {
      isOpen: true,
      close: jest.fn(),
      members: memberList,
      t: i18nextTranslateStub(),
    };

    preloadedState = {
      athleteChat: {
        searchableItemGroups: {
          staff: [],
          athletes: [],
        },
      },
    };
  });

  it('renders the list of members with their correct names and roles', () => {
    renderWithRedux(<MessagingMembersModal {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    // Check that the modal title is visible
    expect(
      screen.getByRole('heading', { name: /channel members/i })
    ).toBeInTheDocument();

    // Verify the text content of each member is rendered correctly
    expect(screen.getByText('Member One (Channel admin)')).toBeInTheDocument();
    expect(screen.getByText('Member Two')).toBeInTheDocument();
    expect(screen.getByText('Member Three')).toBeInTheDocument();
  });
});
