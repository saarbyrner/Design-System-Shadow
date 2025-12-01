import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChannelMemberRemover from '..';

const preloadedState = {
  athleteChat: {
    searchableItemGroups: {
      staff: [{ identifier: 'id||S001' }],
      athletes: [{ identifier: 'id||001' }],
    },
  },
};

describe('<ChannelMemberRemover /> component', () => {
  const channelMembers = [
    {
      friendlyName: 'Athlete 1',
      memberKind: 'ATHLETE',
      messagingIdentity: 'id||001',
      userId: '001',
    },
    {
      friendlyName: 'Staff 1',
      memberKind: 'STAFF',
      messagingIdentity: 'id||S001',
      userId: 'S001',
    },
  ];

  const baseProps = {
    channelMembers,
    selection: { athletes: [], staff: [] },
    onSelectionChanged: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the accordion titles for Athletes and Staff', () => {
    renderWithRedux(<ChannelMemberRemover {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('Athletes')).toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();
  });

  it('renders the member names', () => {
    renderWithRedux(<ChannelMemberRemover {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('Athlete 1')).toBeInTheDocument();
    expect(screen.getByText('Staff 1')).toBeInTheDocument();
  });

  it('calls onSelectionChanged with the correct ID when a member is removed', async () => {
    const user = userEvent.setup();
    renderWithRedux(<ChannelMemberRemover {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    const athlete1Row = screen.getByText('Athlete 1').closest('li');
    const removeButton = within(athlete1Row).getByRole('button');

    await user.click(removeButton);

    expect(baseProps.onSelectionChanged).toHaveBeenCalledTimes(1);
    expect(baseProps.onSelectionChanged).toHaveBeenCalledWith({
      athletes: ['001'],
      staff: [],
    });
  });

  it('applies a specific class to a member row when they are marked for removal', () => {
    const propsWithSelection = {
      ...baseProps,
      selection: { athletes: ['001'], staff: [] },
    };
    renderWithRedux(<ChannelMemberRemover {...propsWithSelection} />, {
      preloadedState,
      useGlobalStore: false,
    });

    const athlete1Row = screen
      .getByText('Athlete 1')
      .closest('.channelMemberRemover__memberRow');
    expect(athlete1Row).toHaveClass(
      'channelMemberRemover__memberRow--transitionToRemoved'
    );
  });

  it('does not render the Athlete accordion when there are no athlete members', () => {
    const propsWithoutAthletes = {
      ...baseProps,
      channelMembers: [
        {
          friendlyName: 'Staff 1',
          memberKind: 'STAFF',
          messagingIdentity: 'id||S001',
          userId: 'S001',
        },
      ],
    };
    renderWithRedux(<ChannelMemberRemover {...propsWithoutAthletes} />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.queryByText('Athletes')).not.toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();
  });
});
