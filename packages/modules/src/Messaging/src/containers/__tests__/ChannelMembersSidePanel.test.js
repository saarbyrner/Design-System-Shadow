import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import * as channelMembersActions from '../../components/ChannelMembersSidePanel/actions';
import ChannelMembersSidePanelContainer from '../ChannelMembersSidePanel';

jest.mock('../../components/ChannelMembersSidePanel/actions');

describe('ChannelMembersSidePanel Container', () => {
  const preloadedState = {
    channelMembersSidePanel: { updateRequestStatus: 'IDLE' },
    athleteChat: {
      userRole: { orgId: 'someOrg' },
      currentChannelExtraData: { members: [] },
      searchableItemGroups: { athletes: [], staff: [] },
    },
    messagingSidePanel: { activeSidePanel: 'ChannelMembers' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the panel title', () => {
    renderWithRedux(
      <ChannelMembersSidePanelContainer staff={[]} squads={[]} />,
      {
        preloadedState,
        useGlobalStore: false,
      }
    );
    expect(screen.getByText('Manage Members')).toBeInTheDocument();
  });

  it('dispatches the close action when the close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(
      <ChannelMembersSidePanelContainer staff={[]} squads={[]} />,
      {
        preloadedState,
        useGlobalStore: false,
      }
    );

    const closeButton = screen.getByTestId('panel-close-button');
    await user.click(closeButton);

    expect(
      channelMembersActions.closeChannelMembersSidePanel
    ).toHaveBeenCalledTimes(1);
  });

  it('does not render when the side panel is not active', () => {
    const closedState = {
      ...preloadedState,
      messagingSidePanel: { activeSidePanel: null },
    };
    const { container } = renderWithRedux(
      <ChannelMembersSidePanelContainer staff={[]} squads={[]} />,
      {
        preloadedState: closedState,
        useGlobalStore: false,
      }
    );
    expect(container).toBeEmptyDOMElement();
  });
});
